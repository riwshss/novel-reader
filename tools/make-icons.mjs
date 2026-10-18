// 用 Playwright 把 SVG 圖示渲染成各尺寸 PNG：node tools/make-icons.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const SIZES = [180, 192, 512];
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d27a36"/>
      <stop offset="1" stop-color="#9c4f1e"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <path d="M256 150c-40-28-96-36-150-30v232c54-6 110 2 150 30z" fill="#fbf5e6"/>
  <path d="M256 150c40-28 96-36 150-30v232c-54-6-110 2-150 30z" fill="#f1e4c6"/>
  <g stroke="#c9a77a" stroke-width="8" stroke-linecap="round">
    <path d="M140 180c30-2 62 3 88 15M140 222c30-2 62 3 88 15M140 264c30-2 62 3 88 15"/>
    <path d="M372 180c-30-2-62 3-88 15M372 222c-30-2-62 3-88 15M372 264c-30-2-62 3-88 15"/>
  </g>
</svg>`;

mkdirSync(new URL('../icons/', import.meta.url), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const size of SIZES) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: new URL(`../icons/icon-${size}.png`, import.meta.url).pathname.slice(1) });
}
await browser.close();
console.log('icons written:', SIZES.join(', '));
