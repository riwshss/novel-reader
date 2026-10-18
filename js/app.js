// 入口：在書架與閱讀器之間切換，記住上次打開的書，下次啟動直接回到那本。

import { initShelf, refreshShelf, showStatus } from './shelf.js';
import { initReaderUi, onBookOpened } from './reader-ui.js';
import * as reader from './reader.js';

const LAST_BOOK_KEY = 'novel-reader:last-book';
const RESIZE_DEBOUNCE_MS = 150;

const shelfView = document.getElementById('shelf');
const readerView = document.getElementById('reader');

function rememberBook(id) {
  try {
    if (id) localStorage.setItem(LAST_BOOK_KEY, id);
    else localStorage.removeItem(LAST_BOOK_KEY);
  } catch (err) {
    console.warn('無法記錄上次閱讀的書', err);
  }
}

function lastBook() {
  try {
    return localStorage.getItem(LAST_BOOK_KEY);
  } catch {
    return null;
  }
}

async function openBook(id) {
  try {
    await reader.loadBook(id);
  } catch (err) {
    console.error('打開書本失敗', err);
    rememberBook(null);
    showStatus('打不開這本書，可能已被刪除', true);
    await showShelf();
    return;
  }
  shelfView.hidden = true;
  readerView.hidden = false;
  onBookOpened();
  reader.start();
  rememberBook(id);
}

async function showShelf() {
  reader.close();
  readerView.hidden = true;
  shelfView.hidden = false;
  rememberBook(null);
  await refreshShelf();
}

function bindLifecycle() {
  let timer = null;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => reader.relayout(), RESIZE_DEBOUNCE_MS);
  });
  // iOS 切到背景後可能直接把 App 殺掉，先把進度寫進去
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') reader.flushProgress();
  });
  window.addEventListener('pagehide', () => reader.flushProgress());
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch((err) => console.warn('離線快取註冊失敗', err));
}

async function main() {
  initShelf({ onOpen: openBook });
  initReaderUi({ onBack: showShelf });
  bindLifecycle();
  registerServiceWorker();
  navigator.storage?.persist?.().catch(() => {});

  const id = lastBook();
  if (id) await openBook(id);
  else await refreshShelf();
}

main();
