// 把 txt 打包成加密的內建書，輸出到 books/<id>/，並登記到 books/manifest.json。
// 用法：NOVEL_PASSWORD=密碼 node tools/build-book.mjs <txt 路徑> <id>
// 密碼不進 repo；手機第一次打開內建書時輸入。

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import nacl from 'tweetnacl';
import { decodeText, splitChapters, titleFromFilename, chunkStartsFor } from '../js/parser.js';
import { deriveKey, seal, toHex } from '../js/bookpack.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BOOKS_DIR = join(ROOT, 'books');
const MANIFEST = join(BOOKS_DIR, 'manifest.json');
const CHUNK_CHARS = 150000;
const KDF_ITERATIONS = 20000;
// 盜版站塞進來的廣告行
const AD_LINE_RE = /ixdzs|爱下电子书|章节内容开始|还在连载中|^『状态:|^\s*最新章节[！!]?\s*$/;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cleanText(text) {
  return text
    .split('\n')
    .filter((line) => !AD_LINE_RE.test(line))
    .join('\n')
    .trim();
}

/** 去掉完全重複的章節（標題與內文都一樣），保留最後一次出現的位置。 */
function dropDuplicates(chapters) {
  const lastIndex = new Map();
  chapters.forEach((c, i) => lastIndex.set(`${c.title}\n${c.text}`, i));
  return chapters.filter((c, i) => lastIndex.get(`${c.title}\n${c.text}`) === i);
}

function loadManifest() {
  if (!existsSync(MANIFEST)) return { books: [] };
  return JSON.parse(readFileSync(MANIFEST, 'utf8'));
}

function main() {
  const [txtPath, id] = process.argv.slice(2);
  const password = process.env.NOVEL_PASSWORD;
  if (!txtPath || !id) fail('用法：NOVEL_PASSWORD=密碼 node tools/build-book.mjs <txt> <id>');
  if (!/^[a-z0-9-]+$/.test(id)) fail('id 只能用小寫英數與 -');
  if (!password || password.length < 8) fail('請用環境變數 NOVEL_PASSWORD 提供至少 8 碼的密碼');

  const title = titleFromFilename(txtPath.split(/[\\/]/).pop());
  const raw = splitChapters(decodeText(readFileSync(txtPath)));
  const chapters = dropDuplicates(raw.map((c) => ({ title: c.title, text: cleanText(c.text) })))
    .filter((c) => c.text.length > 0);
  const lens = chapters.map((c) => c.text.length);
  const chunkStarts = chunkStartsFor(lens, CHUNK_CHARS);

  const salt = nacl.randomBytes(16);
  const key = deriveKey(password, salt, KDF_ITERATIONS);
  const outDir = join(BOOKS_DIR, id);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'index.bin'), seal({ title, titles: chapters.map((c) => c.title), lens, chunkStarts }, key));
  let bytes = 0;
  chunkStarts.forEach((start, k) => {
    const end = k + 1 < chunkStarts.length ? chunkStarts[k + 1] : chapters.length;
    const sealed = seal(chapters.slice(start, end).map((c) => c.text), key);
    writeFileSync(join(outDir, `c${k}.bin`), sealed);
    bytes += sealed.length;
  });

  const manifest = loadManifest();
  const entry = { id, title, salt: toHex(salt), iterations: KDF_ITERATIONS, chunkCount: chunkStarts.length, builtAt: Date.now() };
  manifest.books = manifest.books.filter((b) => b.id !== id).concat(entry);
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`《${title}》${chapters.length} 章（原始 ${raw.length}），${chunkStarts.length} 塊，共 ${(bytes / 1048576).toFixed(1)} MB`);
}

main();
