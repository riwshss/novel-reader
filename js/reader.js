// 分頁閱讀引擎：一次只渲染一章，用 CSS 多欄把章節切成一頁一欄，translateX 翻頁。
// 全文按塊存在 IndexedDB，只把目前那塊放在記憶體（舊 iPhone 記憶體小）。
// 進度以「章節 + 段落序號 + 段內字元」保存，換字體大小或轉向後仍能回到同一個字。

import { getBook, getChunk, putBook, updateBook, getLegacyContent, deleteLegacyContent } from './db.js';
import { buildBook, chunkOf } from './book.js';
import { setChildren } from './dom.js';

const SAVE_DELAY_MS = 400;

const viewport = document.getElementById('page-viewport');
const content = document.getElementById('page-content');
const chapterName = document.getElementById('chapter-name');
const pageInfo = document.getElementById('page-info');
const percentInfo = document.getElementById('percent-info');

const state = {
  book: null,
  chapterStarts: [],
  chapter: 0,
  page: 0,
  pages: 1,
  pageWidth: 0,
  anchor: { block: 0, offset: 0 }, // 目前頁首的字，翻頁時更新，重新分頁時沿用
  chunk: { k: -1, texts: null },
  loading: false,
  failed: false,
  token: 0,
};

let saveTimer = null;
let edgeHandler = () => {};
let changeHandler = () => {};
let chunkLoader = null;

/** 翻到書頭/書尾或載入失敗時的通知（UI 顯示提示）。 */
export function onEdge(fn) {
  edgeHandler = fn;
}

/** 頁面或章節變化時的通知（UI 更新選單）。 */
export function onChange(fn) {
  changeHandler = fn;
}

/** IndexedDB 裡還沒有的塊（內建書）由這個函式下載：(book, k) => Promise<string[]>。 */
export function setChunkLoader(fn) {
  chunkLoader = fn;
}

export function getState() {
  const book = state.book;
  return {
    title: book ? book.title : '',
    chapterTitles: book ? book.titles : [],
    chapter: state.chapter,
    page: state.page,
    pages: state.pages,
  };
}

const CHAPTER_FIELDS = ['titles', 'lens', 'chunkStarts', 'chapterCount', 'totalChars', 'ready'];

/** 舊版整本一筆的資料轉成分塊格式，保留原本的進度。 */
async function migrateLegacy(book) {
  const data = await getLegacyContent(book.id);
  if (!data || !Array.isArray(data.chapters) || data.chapters.length === 0) return null;
  const built = buildBook({}, data.chapters);
  const meta = Object.assign({}, built.meta, book);
  CHAPTER_FIELDS.forEach((f) => { meta[f] = built.meta[f]; });
  await putBook(meta, built.chunks);
  await deleteLegacyContent(book.id);
  return meta;
}

/** 載入書本資料（可能拋錯）；成功後需讓閱讀器可見，再呼叫 start()。 */
export async function loadBook(id) {
  let book = await getBook(id);
  if (book && !Array.isArray(book.chunkStarts)) book = await migrateLegacy(book);
  if (!book || !Array.isArray(book.titles) || book.titles.length === 0) {
    throw new Error(`找不到書本資料：${id}`);
  }
  let sum = 0;
  state.chapterStarts = book.lens.map((len) => {
    const start = sum;
    sum += len;
    return start;
  });
  state.book = book;
  state.chunk = { k: -1, texts: null };
}

export function start() {
  const progress = state.book.progress || {};
  const chapter = clamp(Number(progress.chapter) || 0, 0, state.book.titles.length - 1);
  return showChapter(chapter, { block: Number(progress.block) || 0, offset: Number(progress.offset) || 0 });
}

export function close() {
  flushProgress();
  state.token++;
  state.book = null;
  state.chunk = { k: -1, texts: null };
  setChildren(content, []);
}

export function nextPage() {
  if (state.loading) return;
  if (state.failed) return showChapter(state.chapter, 'start');
  if (state.page < state.pages - 1) return setPage(state.page + 1, true);
  if (state.chapter < state.book.titles.length - 1) return showChapter(state.chapter + 1, 'start');
  edgeHandler('已經是最後一頁了');
}

export function prevPage() {
  if (state.loading) return;
  if (state.failed) return showChapter(state.chapter, 'start');
  if (state.page > 0) return setPage(state.page - 1, true);
  if (state.chapter > 0) return showChapter(state.chapter - 1, 'end');
  edgeHandler('已經是第一頁了');
}

export function goChapter(index) {
  return showChapter(clamp(index, 0, state.book.titles.length - 1), 'start');
}

/** 版面尺寸或字體設定改變後重新分頁，停在原本頁首那個字。 */
export function relayout() {
  if (!state.book || state.loading || state.failed) return;
  const anchor = state.anchor;
  measure();
  setPage(pageOfAnchor(anchor), false, anchor);
}

export function flushProgress() {
  if (!saveTimer) return;
  clearTimeout(saveTimer);
  saveTimer = null;
  persistProgress();
}

// ---------- 內部 ----------

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** 取第 index 章全文：先看記憶體裡的塊，再看 IndexedDB，都沒有就下載。 */
async function textOf(index) {
  const book = state.book;
  const k = chunkOf(book.chunkStarts, index);
  if (state.chunk.k !== k) {
    let texts = await getChunk(book.id, k);
    if (!texts && chunkLoader && book.builtin) texts = await chunkLoader(book, k);
    if (!texts) throw new Error('這本書的內容不完整，請刪除後重新匯入');
    if (!state.book || state.book.id !== book.id) return null; // 載入途中換書或關閉了
    state.chunk = { k, texts };
  }
  const text = state.chunk.texts[index - book.chunkStarts[k]];
  return typeof text === 'string' ? text : '';
}

function paragraph(text, className) {
  const p = document.createElement('p');
  if (className) p.className = className;
  p.textContent = text;
  return p;
}

function renderChapter(title, text) {
  const heading = document.createElement('h2');
  heading.textContent = title;
  const nodes = [heading];
  text.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed) nodes.push(paragraph(trimmed));
  });
  setChildren(content, nodes);
}

function renderNotice(title, message) {
  const heading = document.createElement('h2');
  heading.textContent = title;
  setChildren(content, [heading, paragraph(message, 'notice')]);
}

function setColumns(width, gap) {
  const style = content.style;
  style.width = `${width}px`;
  style.setProperty('-webkit-column-width', `${width}px`);
  style.setProperty('column-width', `${width}px`);
  style.setProperty('-webkit-column-gap', `${gap}px`);
  style.setProperty('column-gap', `${gap}px`);
}

function measure() {
  const width = Math.floor(viewport.getBoundingClientRect().width);
  const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
  setColumns(width - pad * 2, pad * 2);
  state.pageWidth = width;
  state.pages = countPages();
}

/** 元素第 n 個片段落在第幾頁（以內容左緣為基準，不受 transform 影響）。 */
function pageOfRect(rect) {
  const base = content.getBoundingClientRect().left;
  return Math.max(0, Math.floor((rect.left - base + 1) / state.pageWidth));
}

function countPages() {
  const last = content.lastElementChild;
  if (!last) return 1;
  const rects = last.getClientRects();
  if (rects.length === 0) return 1;
  return pageOfRect(rects[rects.length - 1]) + 1;
}

function pageOfBlock(index) {
  const el = content.children[clamp(index, 0, content.children.length - 1)];
  const rects = el ? el.getClientRects() : null;
  if (!rects || rects.length === 0) return 0;
  return clamp(pageOfRect(rects[0]), 0, state.pages - 1);
}

/** 這一頁第一個出現的段落序號。 */
function blockAtPage(page) {
  const blocks = content.children;
  for (let i = 0; i < blocks.length; i++) {
    const rects = blocks[i].getClientRects();
    if (rects.length > 0 && pageOfRect(rects[rects.length - 1]) >= page) return i;
  }
  return Math.max(0, blocks.length - 1);
}

const charRange = document.createRange();

function pageOfChar(node, offset) {
  charRange.setStart(node, offset);
  charRange.setEnd(node, offset + 1);
  const rects = charRange.getClientRects();
  return rects.length > 0 ? pageOfRect(rects[0]) : 0;
}

function textNodeOf(block) {
  const el = content.children[block];
  return el ? el.firstChild : null;
}

/** 這一頁第一個字的位置 { block, offset }：段落跨頁時用二分搜尋找出頁首那個字。 */
function anchorAtPage(page) {
  const block = blockAtPage(page);
  const node = textNodeOf(block);
  if (!node || node.length < 2 || pageOfChar(node, 0) >= page) return { block, offset: 0 };
  let lo = 0;
  let hi = node.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (pageOfChar(node, mid) >= page) hi = mid;
    else lo = mid + 1;
  }
  return { block, offset: lo };
}

function pageOfAnchor({ block, offset }) {
  const node = textNodeOf(block);
  if (!offset || !node || node.length === 0) return pageOfBlock(block);
  return clamp(pageOfChar(node, Math.min(offset, node.length - 1)), 0, state.pages - 1);
}

function resetPosition() {
  content.classList.remove('animate');
  content.style.transform = 'translate3d(0, 0, 0)';
  content.style.webkitTransform = 'translate3d(0, 0, 0)';
}

async function showChapter(index, position) {
  const token = ++state.token;
  const book = state.book;
  const title = book.titles[index];
  state.chapter = index;
  state.loading = true;
  state.failed = false;
  if (state.chunk.k !== chunkOf(book.chunkStarts, index)) {
    resetPosition();
    renderNotice(title, '載入中…');
  }
  let text;
  try {
    text = await textOf(index);
  } catch (err) {
    if (token !== state.token) return;
    console.error('載入章節失敗', err);
    state.loading = false;
    state.failed = true;
    resetPosition();
    renderNotice(title, `載入失敗：${err.message}\n請連上網路後點一下畫面重試`);
    updateFooter();
    return;
  }
  if (token !== state.token || text === null) return;
  state.loading = false;
  renderChapter(title, text);
  resetPosition();
  measure();
  const anchor = position && typeof position === 'object' ? position : null;
  let page = 0;
  if (position === 'end') page = state.pages - 1;
  else if (anchor) page = pageOfAnchor(anchor);
  setPage(page, false, anchor);
}

function setPage(page, animate, keepAnchor = null) {
  state.page = clamp(page, 0, state.pages - 1);
  state.anchor = keepAnchor || anchorAtPage(state.page);
  content.classList.toggle('animate', animate);
  const transform = `translate3d(${-state.page * state.pageWidth}px, 0, 0)`;
  content.style.webkitTransform = transform;
  content.style.transform = transform;
  updateFooter();
  scheduleSave();
  changeHandler();
}

function percent() {
  const book = state.book;
  if (!book.totalChars) return 0;
  const len = book.lens[state.chapter];
  const read = state.chapterStarts[state.chapter] + (len * (state.page + 1)) / state.pages;
  return Math.min(100, (read / book.totalChars) * 100);
}

function updateFooter() {
  chapterName.textContent = state.book.titles[state.chapter];
  pageInfo.textContent = state.failed ? '' : `${state.page + 1} / ${state.pages}`;
  percentInfo.textContent = `${percent().toFixed(1)}%`;
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistProgress();
  }, SAVE_DELAY_MS);
}

function persistProgress() {
  const book = state.book;
  if (!book) return;
  const patch = {
    progress: {
      chapter: state.chapter,
      block: state.anchor.block,
      offset: state.anchor.offset,
      chapterTitle: book.titles[state.chapter],
    },
    percent: Math.round(percent() * 10) / 10,
    lastReadAt: Date.now(),
  };
  state.book = Object.assign({}, book, patch);
  updateBook(book.id, (stored) => Object.assign({}, stored, patch))
    .catch((err) => console.error('儲存進度失敗', err));
}
