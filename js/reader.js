// 分頁閱讀引擎：一次只渲染一章，用 CSS 多欄把章節切成一頁一欄，translateX 翻頁。
// 進度以「章節 + 段落序號」保存，換字體大小或轉向後仍能回到同一段。

import { getBook, getContent, saveBook } from './db.js';

const SAVE_DELAY_MS = 400;

const viewport = document.getElementById('page-viewport');
const content = document.getElementById('page-content');
const chapterName = document.getElementById('chapter-name');
const pageInfo = document.getElementById('page-info');
const percentInfo = document.getElementById('percent-info');

const state = {
  book: null,
  chapters: [],
  chapterStarts: [],
  totalChars: 0,
  chapter: 0,
  page: 0,
  pages: 1,
  pageWidth: 0,
  anchor: { block: 0, offset: 0 }, // 目前頁首的字，翻頁時更新，重新分頁時沿用
};

let saveTimer = null;
let edgeHandler = () => {};
let changeHandler = () => {};

/** 翻到書頭/書尾時的通知（UI 顯示提示）。 */
export function onEdge(fn) {
  edgeHandler = fn;
}

/** 頁面或章節變化時的通知（UI 更新選單）。 */
export function onChange(fn) {
  changeHandler = fn;
}

export function getState() {
  return {
    title: state.book?.title ?? '',
    chapterTitles: state.chapters.map((c) => c.title),
    chapter: state.chapter,
    page: state.page,
    pages: state.pages,
  };
}

/** 載入書本資料（可能拋錯）；成功後需讓閱讀器可見，再呼叫 start()。 */
export async function loadBook(id) {
  const [book, data] = await Promise.all([getBook(id), getContent(id)]);
  if (!book || !data || !Array.isArray(data.chapters) || data.chapters.length === 0) {
    throw new Error(`找不到書本資料：${id}`);
  }
  let sum = 0;
  state.chapterStarts = data.chapters.map((c) => {
    const start = sum;
    sum += c.text.length;
    return start;
  });
  state.totalChars = sum;
  state.book = book;
  state.chapters = data.chapters;
}

export function start() {
  const progress = state.book.progress || {};
  const chapter = clamp(Number(progress.chapter) || 0, 0, state.chapters.length - 1);
  showChapter(chapter, { block: Number(progress.block) || 0, offset: Number(progress.offset) || 0 });
}

export function close() {
  flushProgress();
  state.book = null;
  state.chapters = [];
  content.replaceChildren();
}

export function nextPage() {
  if (state.page < state.pages - 1) return setPage(state.page + 1, true);
  if (state.chapter < state.chapters.length - 1) return showChapter(state.chapter + 1, 'start');
  edgeHandler('已經是最後一頁了');
}

export function prevPage() {
  if (state.page > 0) return setPage(state.page - 1, true);
  if (state.chapter > 0) return showChapter(state.chapter - 1, 'end');
  edgeHandler('已經是第一頁了');
}

export function goChapter(index) {
  showChapter(clamp(index, 0, state.chapters.length - 1), 'start');
}

/** 版面尺寸或字體設定改變後重新分頁，停在原本頁首那個字。 */
export function relayout() {
  if (!state.book) return;
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

function renderChapter(index) {
  const chapter = state.chapters[index];
  const frag = document.createDocumentFragment();
  const heading = document.createElement('h2');
  heading.textContent = chapter.title;
  frag.append(heading);
  for (const line of chapter.text.split('\n')) {
    const text = line.trim();
    if (!text) continue;
    const p = document.createElement('p');
    p.textContent = text;
    frag.append(p);
  }
  content.replaceChildren(frag);
}

function measure() {
  const width = Math.floor(viewport.getBoundingClientRect().width);
  const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
  const columnWidth = width - pad * 2;
  content.style.width = `${columnWidth}px`;
  content.style.columnWidth = `${columnWidth}px`;
  content.style.columnGap = `${pad * 2}px`;
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
  const rects = el?.getClientRects();
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

/** 這一頁第一個字的位置 { block, offset }：段落跨頁時用二分搜尋找出頁首那個字。 */
function anchorAtPage(page) {
  const block = blockAtPage(page);
  const node = content.children[block]?.firstChild;
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
  const node = content.children[block]?.firstChild;
  if (!offset || !node || node.length === 0) return pageOfBlock(block);
  return clamp(pageOfChar(node, Math.min(offset, node.length - 1)), 0, state.pages - 1);
}

function showChapter(index, position) {
  state.chapter = index;
  renderChapter(index);
  content.classList.remove('animate');
  content.style.transform = 'translate3d(0, 0, 0)';
  measure();
  let page = 0;
  if (position === 'end') page = state.pages - 1;
  else if (position && typeof position === 'object') page = pageOfAnchor(position);
  setPage(page, false, position && typeof position === 'object' ? position : null);
}

function setPage(page, animate, keepAnchor = null) {
  state.page = clamp(page, 0, state.pages - 1);
  state.anchor = keepAnchor ?? anchorAtPage(state.page);
  content.classList.toggle('animate', animate);
  content.style.transform = `translate3d(${-state.page * state.pageWidth}px, 0, 0)`;
  updateFooter();
  scheduleSave();
  changeHandler();
}

function percent() {
  if (state.totalChars === 0) return 0;
  const len = state.chapters[state.chapter].text.length;
  const read = state.chapterStarts[state.chapter] + (len * (state.page + 1)) / state.pages;
  return Math.min(100, (read / state.totalChars) * 100);
}

function updateFooter() {
  chapterName.textContent = state.chapters[state.chapter].title;
  pageInfo.textContent = `${state.page + 1} / ${state.pages}`;
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
  if (!state.book) return;
  const book = {
    ...state.book,
    progress: {
      chapter: state.chapter,
      ...state.anchor,
      chapterTitle: state.chapters[state.chapter].title,
    },
    percent: Math.round(percent() * 10) / 10,
    lastReadAt: Date.now(),
  };
  state.book = book;
  saveBook(book).catch((err) => console.error('儲存進度失敗', err));
}
