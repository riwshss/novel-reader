// 書架：列出書本、匯入 txt、刪除。

import { listBooks, addBook, deleteBook } from './db.js';
import { parseBook } from './parser.js';

const MAX_FILE_BYTES = 200 * 1024 * 1024;
const COVER_CHARS = 4;

const list = document.getElementById('book-list');
const emptyHint = document.getElementById('empty-hint');
const status = document.getElementById('shelf-status');
const fileInput = document.getElementById('file-input');

let openHandler = () => {};

export function initShelf({ onOpen }) {
  openHandler = onOpen;
  fileInput.addEventListener('change', async () => {
    const files = [...fileInput.files];
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
  list.replaceChildren(...books.map(renderBook));
  emptyHint.hidden = books.length > 0;
}

function coverColor(title) {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return `hsl(${hash % 360}, 32%, 44%)`;
}

function describeProgress(book) {
  if (!book.lastReadAt) return `未開始 · 共 ${book.chapterCount} 章`;
  const chapter = book.progress?.chapterTitle ?? '';
  return `${chapter} · ${(book.percent ?? 0).toFixed(1)}%`;
}

function renderBook(book) {
  const li = document.createElement('li');
  li.className = 'book-item';
  li.dataset.id = book.id;

  const cover = document.createElement('div');
  cover.className = 'book-cover';
  cover.style.background = coverColor(book.title);
  cover.textContent = [...book.title].slice(0, COVER_CHARS).join('');

  const info = document.createElement('div');
  info.className = 'book-info';
  const title = document.createElement('div');
  title.className = 'book-title';
  title.textContent = book.title;
  const meta = document.createElement('div');
  meta.className = 'book-meta';
  meta.textContent = describeProgress(book);
  const bar = document.createElement('div');
  bar.className = 'book-progress';
  const fill = document.createElement('div');
  fill.style.width = `${book.percent ?? 0}%`;
  bar.append(fill);
  info.append(title, meta, bar);

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'book-delete';
  del.dataset.action = 'delete';
  del.setAttribute('aria-label', `刪除《${book.title}》`);
  del.textContent = '✕';

  li.append(cover, info, del);
  return li;
}

async function onListClick(e) {
  const item = e.target.closest('.book-item');
  if (!item) return;
  const id = item.dataset.id;
  if (e.target.closest('[data-action="delete"]')) {
    const title = item.querySelector('.book-title').textContent;
    if (!confirm(`確定要刪除《${title}》嗎？閱讀進度也會一起刪除。`)) return;
    try {
      await deleteBook(id);
    } catch (err) {
      console.error('刪除失敗', err);
      showStatus('刪除失敗，請再試一次', true);
    }
    await refreshShelf();
    return;
  }
  openHandler(id);
}

function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** 讓瀏覽器先畫出狀態文字，再做耗時的解析。 */
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 30));

async function importOne(file, existing) {
  if (!/\.txt$/i.test(file.name) && file.type !== 'text/plain') {
    throw new UserError(`「${file.name}」不是 txt 檔`);
  }
  if (file.size > MAX_FILE_BYTES) throw new UserError(`「${file.name}」太大了（超過 200 MB）`);
  if (file.size === 0) throw new UserError(`「${file.name}」是空檔案`);

  const { title, chapters } = parseBook(await file.arrayBuffer(), file.name);
  if (existing.some((b) => b.title === title && b.size === file.size)) {
    throw new UserError(`《${title}》已經在書架上了`);
  }
  const meta = {
    id: newId(),
    title,
    size: file.size,
    chapterCount: chapters.length,
    totalChars: chapters.reduce((n, c) => n + c.text.length, 0),
    addedAt: Date.now(),
    lastReadAt: 0,
    percent: 0,
    progress: { chapter: 0, block: 0, chapterTitle: chapters[0].title },
  };
  await addBook(meta, chapters);
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
      existing = [...existing, meta];
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
