// 書本資料的純函式：章節 → 書目 + 分塊、章節所在的塊。不碰 DOM / IndexedDB，方便測試。

import { chunkStartsFor } from './parser.js';

export const CHUNK_CHARS = 150000;

/** 由章節與基本資料組出書目（含標題、字數、分塊表）與各塊全文。 */
export function buildBook(base, chapters) {
  const lens = chapters.map((c) => c.text.length);
  const chunkStarts = chunkStartsFor(lens, CHUNK_CHARS);
  const chunks = {};
  chunkStarts.forEach((start, k) => {
    const end = k + 1 < chunkStarts.length ? chunkStarts[k + 1] : chapters.length;
    chunks[k] = chapters.slice(start, end).map((c) => c.text);
  });
  const meta = Object.assign(describeChapters(chapters.map((c) => c.title), lens, chunkStarts), base);
  meta.ready = chunkStarts.map(() => true);
  return { meta, chunks };
}

/** 書目裡跟章節有關的欄位。 */
export function describeChapters(titles, lens, chunkStarts) {
  return {
    titles,
    lens,
    chunkStarts,
    chapterCount: titles.length,
    totalChars: lens.reduce((n, len) => n + len, 0),
    ready: chunkStarts.map(() => false),
    addedAt: Date.now(),
    lastReadAt: 0,
    percent: 0,
    progress: { chapter: 0, block: 0, offset: 0, chapterTitle: titles[0] },
  };
}

/** 第 index 章在哪一塊（chunkStarts 遞增，二分搜尋）。 */
export function chunkOf(chunkStarts, index) {
  let lo = 0;
  let hi = chunkStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (chunkStarts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** 已下載的塊數。 */
export function readyCount(meta) {
  return (meta.ready || []).filter(Boolean).length;
}
