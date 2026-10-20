// 內建書：books/manifest.json 列出加密打包好的書（tools/build-book.mjs 產生）。
// 第一次打開輸入密碼 → 解出章節表存進書架；全文按塊下載、解密後存進 IndexedDB。

import { deriveKey, open, toHex, fromHex } from './bookpack.js';
import { getBook, putBook, storeChunk } from './db.js';
import { describeChapters, readyCount } from './book.js';

const BASE = 'books/';
const KEY_PREFIX = 'novel-reader:key:';

const inflight = {};

export const builtinBookId = (id) => `builtin-${id}`;

/** 用 XHR 下載（iOS 10.0–10.2 沒有 fetch）。 */
function request(path, responseType) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', BASE + path);
    xhr.responseType = responseType;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
      else reject(new Error(`下載失敗（${xhr.status}）：${path}`));
    };
    xhr.onerror = () => reject(new Error(`網路錯誤：${path}`));
    xhr.send();
  });
}

async function fetchBytes(path) {
  return new Uint8Array(await request(path, 'arraybuffer'));
}

function isValidEntry(b) {
  return b && /^[a-z0-9-]+$/.test(b.id) && typeof b.title === 'string' &&
    /^[0-9a-f]{32}$/.test(b.salt) && Number(b.iterations) > 0;
}

/** 內建書清單；離線或讀不到就當作沒有。 */
export async function listBuiltins() {
  try {
    const data = JSON.parse(await request(`manifest.json?t=${Date.now()}`, 'text'));
    return Array.isArray(data.books) ? data.books.filter(isValidEntry) : [];
  } catch (err) {
    console.warn('讀不到內建書清單', err);
    return [];
  }
}

function saveKey(bookId, key) {
  try {
    localStorage.setItem(KEY_PREFIX + bookId, toHex(key));
  } catch (err) {
    console.warn('無法記住內建書密碼', err);
  }
}

function loadKey(bookId) {
  try {
    const hex = localStorage.getItem(KEY_PREFIX + bookId);
    return hex && /^[0-9a-f]{64}$/.test(hex) ? fromHex(hex) : null;
  } catch {
    return null;
  }
}

export function forgetKey(bookId) {
  try {
    localStorage.removeItem(KEY_PREFIX + bookId);
  } catch {
    // 讀不到 localStorage 就沒有東西要刪
  }
}

/** 用密碼解開內建書的章節表並放上書架。密碼錯會拋 WrongKeyError。 */
export async function unlockBuiltin(entry, password) {
  const key = deriveKey(password, fromHex(entry.salt), Number(entry.iterations));
  const index = open(await fetchBytes(`${entry.id}/index.bin`), key);
  if (!Array.isArray(index.titles) || !Array.isArray(index.chunkStarts) || index.titles.length === 0) {
    throw new Error('內建書資料格式不對');
  }
  const id = builtinBookId(entry.id);
  const meta = Object.assign(describeChapters(index.titles, index.lens, index.chunkStarts), {
    id,
    title: index.title || entry.title,
    builtin: entry.id,
    builtAt: entry.builtAt,
    size: 0,
  });
  saveKey(id, key);
  await putBook(meta);
  return meta;
}

/** 下載並解密內建書的第 k 塊，存進 IndexedDB 後回傳全文陣列。同一塊同時只下載一次。 */
export function loadBuiltinChunk(book, k) {
  const tag = `${book.id}#${k}`;
  if (!inflight[tag]) {
    inflight[tag] = fetchChunk(book, k).then(
      (texts) => { delete inflight[tag]; return texts; },
      (err) => { delete inflight[tag]; throw err; }
    );
  }
  return inflight[tag];
}

async function fetchChunk(book, k) {
  const key = loadKey(book.id);
  if (!key) throw new Error('找不到密碼，請刪除這本書後重新解鎖');
  const texts = open(await fetchBytes(`${book.builtin}/c${k}.bin`), key);
  const end = k + 1 < book.chunkStarts.length ? book.chunkStarts[k + 1] : book.chapterCount;
  if (!Array.isArray(texts) || texts.length !== end - book.chunkStarts[k]) {
    throw new Error('內建書已更新，請刪除這本書後重新解鎖');
  }
  await storeChunk(book.id, k, texts);
  return texts;
}

const RETRY_DELAYS_MS = [2000, 5000, 15000, 30000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 網路斷一下（國內連 GitHub Pages 常見、或鎖螢幕被暫停）就等一下再試，不要整個停掉。 */
async function loadWithRetry(book, k) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await loadBuiltinChunk(book, k);
    } catch (err) {
      if (attempt >= RETRY_DELAYS_MS.length) throw err;
      console.warn(`第 ${k} 塊下載失敗，稍後重試`, err);
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
}

/** 背景把還沒下載的塊一塊一塊補齊（一次一塊，省記憶體）。 */
export async function downloadRemaining(bookId, onProgress) {
  const book = await getBook(bookId);
  if (!book || !book.builtin) return;
  for (let k = 0; k < book.chunkStarts.length; k++) {
    if (book.ready && book.ready[k]) continue;
    await loadWithRetry(book, k);
    onProgress(k);
  }
}

export function isFullyDownloaded(book) {
  return readyCount(book) >= book.chunkStarts.length;
}
