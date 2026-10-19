// e2e 共用：靜態伺服器、測試用內建書、點擊/讀取的小工具。

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import nacl from 'tweetnacl';
import { deriveKey, seal, toHex } from '../js/bookpack.js';
import { chunkStartsFor } from '../js/parser.js';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json',
  '.bin': 'application/octet-stream', '.appcache': 'text/cache-manifest',
};

/** 靜態伺服器；books/ 底下改由 booksDir 提供（測試用內建書或真正的書）。 */
export function startServer(booksDir) {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const rel = normalize(urlPath === '/' ? '/index.html' : urlPath).replace(/^([\\/])+/, '');
    const file = rel.startsWith('books') ? join(booksDir, rel.slice('books'.length)) : join(ROOT, rel);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(rel)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

export function stopServer(server) {
  return new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  });
}

export const FIXTURE_PASSWORD = 'test-pass-123';
export const FIXTURE_CHAPTERS = 25;

/** 產生一本小的加密內建書（25 章、分成好幾塊），格式與 tools/build-book.mjs 相同。 */
export async function makeFixtureBooks(dir) {
  const chapters = [];
  for (let i = 1; i <= FIXTURE_CHAPTERS; i++) {
    const lines = [];
    for (let j = 1; j <= 12; j++) lines.push(`　　内建第${i}章第${j}段，乔梁看着窗外的雨，心里盘算着明天的会议该怎么开。`);
    chapters.push({ title: `第${i}章 内建${i}`, text: lines.join('\n') });
  }
  const lens = chapters.map((c) => c.text.length);
  const chunkStarts = chunkStartsFor(lens, 4000);
  const salt = nacl.randomBytes(16);
  const iterations = 100;
  const key = deriveKey(FIXTURE_PASSWORD, salt, iterations);
  const bookDir = join(dir, 'testbook');
  await mkdir(bookDir, { recursive: true });
  await writeFile(join(bookDir, 'index.bin'), seal({ title: '测试内建', titles: chapters.map((c) => c.title), lens, chunkStarts }, key));
  for (let k = 0; k < chunkStarts.length; k++) {
    const end = k + 1 < chunkStarts.length ? chunkStarts[k + 1] : chapters.length;
    await writeFile(join(bookDir, `c${k}.bin`), seal(chapters.slice(chunkStarts[k], end).map((c) => c.text), key));
  }
  const manifest = { books: [{ id: 'testbook', title: '测试内建', salt: toHex(salt), iterations, chunkCount: chunkStarts.length, builtAt: 1 }] };
  await writeFile(join(dir, 'manifest.json'), JSON.stringify(manifest));
  return chunkStarts.length;
}

export function longNovel() {
  const para = '夜色渐深，城外的风吹过古老的城墙，少年站在高处望着远方的灯火，心中暗暗发誓一定要走出这座小城。';
  const parts = ['长篇测试', '作者：某人', ''];
  for (let i = 1; i <= 12; i++) {
    parts.push(`第${i}章 风起之时${i}`, '');
    for (let j = 0; j < 40; j++) parts.push(`　　${j + 1}. ${para}`);
  }
  return Buffer.from(parts.join('\n'), 'utf-8');
}

export const text = (page, sel) => page.locator(sel).innerText();
export const pageNo = async (page) => (await text(page, '#page-info')).split('/').map((s) => Number(s.trim()));

export async function tapAt(page, xRatio, yRatio = 0.5) {
  const vp = page.viewportSize();
  await page.touchscreen.tap(vp.width * xRatio, vp.height * yRatio);
  await page.waitForTimeout(280);
}

/** 目前畫面上看得到的段落開頭幾個字。 */
export function visibleParagraphs(page) {
  return page.evaluate(() => {
    const vp = document.getElementById('page-viewport').getBoundingClientRect();
    return [...document.querySelectorAll('#page-content > *')]
      .filter((el) => [...el.getClientRects()].some((r) => r.right > vp.left && r.left < vp.right))
      .map((el) => el.textContent.slice(0, 12));
  });
}

/** 有沒有東西超出螢幕右緣（小螢幕排版檢查）。 */
export function overflowingElements(page, selector) {
  return page.evaluate((sel) => {
    const width = window.innerWidth;
    return [...document.querySelectorAll(sel)]
      .filter((el) => el.offsetParent !== null)
      .filter((el) => { const r = el.getBoundingClientRect(); return r.right > width + 0.5 || r.left < -0.5; })
      .map((el) => el.className || el.tagName);
  }, selector);
}
