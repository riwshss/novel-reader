// 書架：列出書本與還沒解鎖的內建書、匯入 txt、刪除。

import { listBooks, putBook, deleteBook } from './db.js';
import { parseBook } from './parser.js';
import { buildBook, readyCount } from './book.js';
import { listBuiltins, unlockBuiltin, builtinBookId, forgetKey } from './builtin.js';
import { WrongKeyError } from './bookpack.js';
import { setChildren } from './dom.js';

const MAX_FILE_BYTES = 200 * 1024 * 1024;
const COVER_CHARS = 4;

const list = document.getElementById('book-list');
const emptyHint = document.getElementById('empty-hint');
const status = document.getElementById('shelf-status');
const fileInput = document.getElementById('file-input');

let openHandler = () => {};
let builtins = [];
let lockedBuiltins = [];

export function initShelf({ onOpen }) {
  openHandler = onOpen;
  fileInput.addEventListener('change', async () => {
    const files = Array.prototype.slice.call(fileInput.files);
    fileInput.value = ''; // 允許再次選同一個檔案
    await importFiles(files);
  });
  list.addEventListener('click', onListClick);
}

export function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('error', isError);
  status.hidden = !message;
}

export async function refreshShelf() {
  let books;
  try {
    books = await listBooks();
  } catch (err) {
    console.error('讀取書架失敗', err);
    showStatus('讀取書架失敗，請重新整理再試', true);
    return;
  }
  // 先用上次的內建書清單立刻畫出來，再等網路上的清單回來重畫
  renderShelf(books);
  builtins = await listBuiltins();
  renderShelf(books);
}

function renderShelf(books) {
  const owned = books.map((b) => b.id);
  lockedBuiltins = builtins.filter((b) => owned.indexOf(builtinBookId(b.id)) === -1);
  setChildren(list, lockedBuiltins.map(renderLocked).concat(books.map(renderBook)));
  emptyHint.hidden = books.length + lockedBuiltins.length > 0;
}

function coverColor(title) {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return `hsl(${hash % 360}, 32%, 44%)`;
}

function describeProgress(book) {
  const chapterCount = book.chapterCount || (book.titles || []).length;
  let text = book.lastReadAt
    ? `${(book.progress && book.progress.chapterTitle) || ''} · ${(book.percent || 0).toFixed(1)}%`
    : `未開始 · 共 ${chapterCount} 章`;
  const chunks = (book.chunkStarts || []).length;
  if (book.builtin && readyCount(book) < chunks) text += ` · 已下載 ${readyCount(book)}/${chunks}`;
  return text;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderItem(title, metaText, percent) {
  const li = el('li', 'book-item');
  const cover = el('div', 'book-cover', Array.from(title).slice(0, COVER_CHARS).join(''));
  cover.style.background = coverColor(title);
  const info = el('div', 'book-info');
  const bar = el('div', 'book-progress');
  const fill = el('div', '');
  fill.style.width = `${percent}%`;
  bar.appendChild(fill);
  info.appendChild(el('div', 'book-title', title));
  info.appendChild(el('div', 'book-meta', metaText));
  info.appendChild(bar);
  li.appendChild(cover);
  li.appendChild(info);
  return li;
}

function renderBook(book) {
  const li = renderItem(book.title, describeProgress(book), book.percent || 0);
  li.dataset.id = book.id;
  const del = el('button', 'book-delete', '✕');
  del.type = 'button';
  del.dataset.action = 'delete';
  del.setAttribute('aria-label', `刪除《${book.title}》`);
  li.appendChild(del);
  return li;
}

function renderLocked(entry) {
  const li = renderItem(entry.title, '內建 · 點一下輸入密碼', 0);
  li.dataset.builtin = entry.id;
  li.classList.add('locked');
  return li;
}

async function onListClick(e) {
  const item = e.target.closest('.book-item');
  if (!item) return;
  if (item.dataset.builtin) return unlock(item.dataset.builtin);
  const id = item.dataset.id;
  if (e.target.closest('[data-action="delete"]')) return removeBook(item, id);
  openHandler(id);
}

async function removeBook(item, id) {
  const title = item.querySelector('.book-title').textContent;
  if (!confirm(`確定要刪除《${title}》嗎？閱讀進度也會一起刪除。`)) return;
  try {
    await deleteBook(id);
    forgetKey(id);
  } catch (err) {
    console.error('刪除失敗', err);
    showStatus('刪除失敗，請再試一次', true);
  }
  await refreshShelf();
}

async function unlock(builtinId) {
  const entry = lockedBuiltins.filter((b) => b.id === builtinId)[0];
  if (!entry) return;
  const password = prompt(`請輸入《${entry.title}》的密碼`);
  if (!password) return;
  showStatus('解鎖中…');
  await nextFrame();
  try {
    const meta = await unlockBuiltin(entry, password.trim());
    showStatus('');
    openHandler(meta.id);
  } catch (err) {
    if (err instanceof WrongKeyError) return showStatus('密碼錯誤，請再試一次', true);
    console.error('解鎖失敗', err);
    showStatus('解鎖失敗，請確認網路連線後再試', true);
  }
}

function newId() {
  const c = window.crypto;
  if (c && c.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** 讓瀏覽器先畫出狀態文字，再做耗時的解析。 */
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 30));

function readFile(file) {
  if (file.arrayBuffer) return file.arrayBuffer();
  return new Promise((resolve, reject) => { // iOS 10 的 File 沒有 arrayBuffer()
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

async function importOne(file, existing) {
  if (!/\.txt$/i.test(file.name) && file.type !== 'text/plain') {
    throw new UserError(`「${file.name}」不是 txt 檔`);
  }
  if (file.size > MAX_FILE_BYTES) throw new UserError(`「${file.name}」太大了（超過 200 MB）`);
  if (file.size === 0) throw new UserError(`「${file.name}」是空檔案`);
  if (typeof TextDecoder === 'undefined') throw new UserError('這台裝置的瀏覽器太舊，無法匯入 TXT');

  const { title, chapters } = parseBook(await readFile(file), file.name);
  if (existing.some((b) => b.title === title && b.size === file.size)) {
    throw new UserError(`《${title}》已經在書架上了`);
  }
  const { meta, chunks } = buildBook({ id: newId(), title, size: file.size }, chapters);
  await putBook(meta, chunks);
  return meta;
}

class UserError extends Error {}

async function importFiles(files) {
  if (files.length === 0) return;
  const messages = [];
  let hasError = false;
  let existing = await listBooks().catch(() => []);
  for (const file of files) {
    showStatus(`正在匯入「${file.name}」…`);
    await nextFrame();
    try {
      const meta = await importOne(file, existing);
      existing = existing.concat(meta);
      messages.push(`已匯入《${meta.title}》（${meta.chapterCount} 章）`);
    } catch (err) {
      hasError = true;
      if (err instanceof UserError) messages.push(err.message);
      else {
        console.error('匯入失敗', file.name, err);
        messages.push(`「${file.name}」匯入失敗，可能是空間不足或檔案損壞`);
      }
    }
  }
  showStatus(messages.join('\n'), hasError);
  await refreshShelf();
}
