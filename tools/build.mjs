// 打包：js/*.js → dist/app.js（單一傳統 script，語法降到 iOS 10.3 Safari 能跑），
// 再依所有前端檔案的內容產生版本號，寫進 sw.js（新 iOS）與 offline.appcache（iOS 10 沒有 Service Worker）。
// 改完程式一律跑 npm run build，不用再手動改版本號。

import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// 目標 Safari 10：async/await、物件展開、?.、??、catch {} 都會降級。
// esbuild 因為舊 Safari 的邊角 bug 把 let/const 與解構當成不支援，但基本用法 Safari 10 都能跑，這裡明確放行。
// 不壓縮：變數改名可能踩到 Safari 10「let 重複宣告」的 bug。輸出另由 tools/check-syntax.mjs 用 ES2017 規則把關。
const TARGET = ['safari10'];
const SUPPORTED = { 'const-and-let': true, destructuring: true };
const ASSETS = [
  'index.html',
  'css/style.css',
  'dist/app.js',
  'manifest.webmanifest',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

await build({
  entryPoints: [join(ROOT, 'js/app.js')],
  outfile: join(ROOT, 'dist/app.js'),
  bundle: true,
  format: 'iife',
  target: TARGET,
  supported: SUPPORTED,
  minify: false,
  legalComments: 'none',
  // tweetnacl 在 Node 才會 require('crypto')，瀏覽器走 window.crypto
  external: ['crypto'],
  logLevel: 'warning',
});

const hash = createHash('sha256');
for (const file of ASSETS) hash.update(readFileSync(join(ROOT, file)));
const version = hash.digest('hex').slice(0, 12);

const swPath = join(ROOT, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
writeFileSync(swPath, sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`));

const appcache = [
  'CACHE MANIFEST',
  `# version ${version}`,
  '',
  'CACHE:',
  ...ASSETS.filter((f) => f !== 'index.html'),
  '',
  'NETWORK:',
  '*',
  '',
].join('\n');
writeFileSync(join(ROOT, 'offline.appcache'), appcache);

console.log(`build ok · version ${version}`);
