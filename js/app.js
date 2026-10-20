// 入口：在書架與閱讀器之間切換，記住上次打開的書，下次啟動直接回到那本。

import { initShelf, refreshShelf, showStatus } from './shelf.js';
import { initReaderUi, onBookOpened, showToast } from './reader-ui.js';
import { loadBuiltinChunk, downloadRemaining, isFullyDownloaded } from './builtin.js';
import { getBook, listBooks } from './db.js';
import { readyCount } from './book.js';
import * as reader from './reader.js';

const LAST_BOOK_KEY = 'novel-reader:last-book';
const RESIZE_DEBOUNCE_MS = 150;

const shelfView = document.getElementById('shelf');
const readerView = document.getElementById('reader');
const downloading = {};

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
  rememberBook(id);
  await reader.start();
  prefetchBuiltin(id);
}

/** 內建書在背景把剩下的全文下載完，之後就能離線讀。 */
async function prefetchBuiltin(id) {
  if (downloading[id]) return;
  const book = await getBook(id).catch(() => null);
  if (!book || !book.builtin || isFullyDownloaded(book)) return;
  downloading[id] = true;
  try {
    await downloadRemaining(id, () => {});
    showToast(`《${book.title}》已全部下載，可以離線閱讀了`);
  } catch (err) {
    console.warn('背景下載中斷，有網路時會自動繼續', err);
    const latest = await getBook(id).catch(() => null);
    if (latest) showToast(`下載中斷（${readyCount(latest)}/${latest.chunkStarts.length}），有網路時會自動繼續，先別離線`);
  } finally {
    downloading[id] = false;
  }
}

/** 書架上所有沒下載完的內建書都接著下載（啟動、回到前景、恢復網路時）。 */
async function resumeDownloads() {
  const books = await listBooks().catch(() => []);
  books.forEach((b) => prefetchBuiltin(b.id));
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
    else resumeDownloads();
  });
  window.addEventListener('online', resumeDownloads);
  window.addEventListener('pagehide', () => reader.flushProgress());
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return; // iOS 10 沒有，改由 offline.appcache 離線
  // eslint-disable-next-line compat/compat -- 上一行已檢查
  navigator.serviceWorker.register('sw.js').catch((err) => console.warn('離線快取註冊失敗', err));
}

/** iOS 10 沒有 safe-area，加到主畫面後內容會被半透明狀態列蓋住，手動留 20px。 */
function fixLegacyStatusBar() {
  const supportsEnv = window.CSS && CSS.supports && CSS.supports('padding-top: env(safe-area-inset-top)');
  if (navigator.standalone && !supportsEnv) document.documentElement.classList.add('legacy-standalone');
}

async function main() {
  fixLegacyStatusBar();
  reader.setChunkLoader(loadBuiltinChunk);
  initShelf({ onOpen: openBook });
  initReaderUi({ onBack: showShelf });
  bindLifecycle();
  registerServiceWorker();
  // eslint-disable-next-line compat/compat -- 用 ?. 檢查過，iOS 10 沒有就跳過
  navigator.storage?.persist?.().catch(() => {});

  const id = lastBook();
  if (id) await openBook(id);
  else await refreshShelf();
  resumeDownloads();
}

main();
