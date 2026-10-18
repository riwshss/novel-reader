// 端對端測試：用 WebKit 模擬 iPhone，跑完匯入→翻頁→目錄→設定→續讀→離線→刪除。
// 執行：npm run e2e（需先 npx playwright install webkit）
import { webkit, chromium, devices } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SHOTS = join(ROOT, 'e2e', 'screenshots');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json',
};

function startServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const rel = normalize(urlPath === '/' ? '/index.html' : urlPath).replace(/^([\\/])+/, '');
    try {
      const body = await readFile(join(ROOT, rel));
      res.writeHead(200, { 'Content-Type': TYPES[extname(rel)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function longNovel() {
  const para = '夜色渐深，城外的风吹过古老的城墙，少年站在高处望着远方的灯火，心中暗暗发誓一定要走出这座小城。';
  const parts = ['长篇测试', '作者：某人', ''];
  for (let i = 1; i <= 12; i++) {
    parts.push(`第${i}章 风起之时${i}`, '');
    for (let j = 0; j < 40; j++) parts.push(`　　${j + 1}. ${para}`);
  }
  return Buffer.from(parts.join('\n'), 'utf-8');
}

const text = (page, sel) => page.locator(sel).innerText();
const pageNo = async (page) => (await text(page, '#page-info')).split('/').map((s) => Number(s.trim()));

async function tapAt(page, xRatio, yRatio = 0.5) {
  const vp = page.viewportSize();
  await page.touchscreen.tap(vp.width * xRatio, vp.height * yRatio);
  await page.waitForTimeout(280);
}

async function run(browserType, name) {
  const browser = await browserType.launch();
  const context = await browser.newContext({ ...devices['iPhone 15'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  const server = await startServer();
  const url = `http://127.0.0.1:${server.address().port}/`;
  const shot = (n) => page.screenshot({ path: join(SHOTS, `${name}-${n}.png`) });
  const step = (s) => console.log(`  [${name}] ${s}`);

  try {
    await page.goto(url);
    await page.waitForSelector('#empty-hint:not([hidden])');
    step('空書架顯示提示 ✓');

    const gbk = await readFile(join(ROOT, 'tests', 'fixtures', 'gbk.txt'));
    await page.setInputFiles('#file-input', [
      { name: '斗破苍穹.txt', mimeType: 'text/plain', buffer: gbk },
      { name: '《长篇测试》.txt', mimeType: 'text/plain', buffer: longNovel() },
    ]);
    await page.waitForFunction(() => document.querySelectorAll('.book-item').length === 2);
    assert.match(await text(page, '#shelf-status'), /已匯入《斗破苍穹》（3 章）/);
    assert.match(await text(page, '#shelf-status'), /已匯入《长篇测试》（13 章）/);
    await shot('1-shelf');
    step('匯入 GBK + UTF-8 兩本書 ✓');

    await page.setInputFiles('#file-input', { name: '斗破苍穹.txt', mimeType: 'text/plain', buffer: gbk });
    await page.waitForFunction(() => /已經在書架上/.test(document.getElementById('shelf-status').textContent));
    step('重複匯入會被擋下 ✓');

    await page.locator('.book-item', { hasText: '长篇测试' }).locator('.book-title').click();
    await page.waitForSelector('#reader:not([hidden])');
    assert.equal(await text(page, '#chapter-name'), '前言');
    await tapAt(page, 0.85);
    assert.equal(await text(page, '#chapter-name'), '第1章 风起之时1');
    let [cur, total] = await pageNo(page);
    assert.equal(cur, 1);
    assert.ok(total >= 3, `第1章應有多頁，實際 ${total}`);
    await shot('2-reader-page1');
    step(`前言翻到第1章，共 ${total} 頁 ✓`);

    await tapAt(page, 0.85);
    assert.deepEqual(await pageNo(page), [2, total]);
    await shot('3-reader-page2');
    await tapAt(page, 0.15);
    assert.deepEqual(await pageNo(page), [1, total]);
    step('右邊點下一頁、左邊點上一頁 ✓');

    await tapAt(page, 0.15);
    assert.equal(await text(page, '#chapter-name'), '前言');
    await tapAt(page, 0.15);
    await page.waitForSelector('#toast:not([hidden])');
    assert.equal(await text(page, '#toast'), '已經是第一頁了');
    step('跨章往回 + 書頭提示 ✓');

    // 檢查每頁內容沒有跑出可視範圍（欄寬與翻頁步距一致）
    await tapAt(page, 0.85);
    const geometry = await page.evaluate(() => {
      const vp = document.getElementById('page-viewport').getBoundingClientRect();
      const ps = [...document.querySelectorAll('#page-content > *')];
      const rects = ps.flatMap((p) => [...p.getClientRects()]);
      const visible = rects.filter((r) => r.right > vp.left && r.left < vp.right);
      return {
        vpLeft: vp.left, vpRight: vp.right, vpBottom: vp.bottom,
        bad: visible.filter((r) => r.left < vp.left + 1 || r.right > vp.right - 1 || r.bottom > vp.bottom + 1).length,
      };
    });
    assert.equal(geometry.bad, 0, `有 ${geometry.bad} 個文字片段超出頁面`);
    for (let i = 1; i < total; i++) await tapAt(page, 0.85);
    assert.deepEqual(await pageNo(page), [total, total]);
    const lastGeometry = await page.evaluate(() => {
      const vp = document.getElementById('page-viewport').getBoundingClientRect();
      const rects = [...document.querySelectorAll('#page-content > *')].flatMap((p) => [...p.getClientRects()]);
      return rects.filter((r) => r.right > vp.left && r.left < vp.right).length;
    });
    assert.ok(lastGeometry > 0, '最後一頁不應該是空白頁');
    await tapAt(page, 0.85);
    assert.equal(await text(page, '#chapter-name'), '第2章 风起之时2');
    step('每頁文字都在框內、最後一頁非空白、翻到下一章 ✓');

    await tapAt(page, 0.5);
    await page.waitForSelector('#menu:not([hidden])');
    await shot('4-menu');
    await page.click('#btn-toc');
    await page.waitForSelector('#toc:not([hidden])');
    assert.equal(await text(page, '#toc-list li.current'), '第2章 风起之时2');
    await shot('5-toc');
    await page.locator('#toc-list li', { hasText: '第10章' }).click();
    assert.equal(await text(page, '#chapter-name'), '第10章 风起之时10');
    step('選單 + 目錄跳到第10章 ✓');

    await tapAt(page, 0.85);
    await tapAt(page, 0.85);
    const firstLineBefore = await page.evaluate(() => {
      const vp = document.getElementById('page-viewport').getBoundingClientRect();
      const p = [...document.querySelectorAll('#page-content > *')].find((el) =>
        [...el.getClientRects()].some((r) => r.left >= vp.left && r.right <= vp.right));
      return p?.textContent.slice(0, 4);
    });
    await tapAt(page, 0.5);
    await page.click('#btn-settings');
    await page.waitForSelector('#settings-panel:not([hidden])');
    await page.click('[data-step="fontSize"][data-dir="1"]');
    await page.click('[data-step="fontSize"][data-dir="1"]');
    assert.equal(await text(page, '#val-fontSize'), '21');
    await page.click('[data-theme="dark"]');
    await shot('6-settings-dark');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.equal(bg, 'rgb(18, 18, 18)');
    await page.click('#settings-mask', { position: { x: 20, y: 20 } });
    const visibleAfter = await page.evaluate(() => {
      const vp = document.getElementById('page-viewport').getBoundingClientRect();
      return [...document.querySelectorAll('#page-content > *')]
        .filter((el) => [...el.getClientRects()].some((r) => r.right > vp.left && r.left < vp.right))
        .map((el) => el.textContent.slice(0, 4));
    });
    assert.ok(visibleAfter.includes(firstLineBefore), `放大字體後應停在同一段（${firstLineBefore}）`);
    await shot('7-dark-reading');
    step('放大字體、夜間模式、仍停留同一段 ✓');

    const before = await text(page, '#chapter-name');
    const pageBefore = await pageNo(page);
    await page.waitForTimeout(600); // 等待進度寫入
    await page.reload();
    await page.waitForSelector('#reader:not([hidden])');
    assert.equal(await text(page, '#chapter-name'), before);
    assert.deepEqual(await pageNo(page), pageBefore);
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(18, 18, 18)');
    step('重新開啟後回到同一章同一頁、設定保留 ✓');

    await tapAt(page, 0.5);
    await page.click('#btn-back');
    await page.waitForSelector('#shelf:not([hidden])');
    const meta = await page.locator('.book-item', { hasText: '长篇测试' }).locator('.book-meta').innerText();
    assert.match(meta, /第10章 风起之时10 · \d+\.\d%/);
    await shot('8-shelf-progress');
    step(`書架顯示進度「${meta}」 ✓`);

    const hasSw = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      await navigator.serviceWorker.ready;
      return true;
    });
    if (hasSw) {
      await page.waitForTimeout(500);
      // 直接關掉伺服器模擬斷網（比 setOffline 更接近真實情況）
      await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
      await page.reload();
      await page.waitForSelector('.book-item');
      step('伺服器關閉後重新整理仍可開啟（離線快取）✓');
    } else {
      step('此瀏覽器環境無 Service Worker，略過離線測試');
    }

    await page.locator('.book-item', { hasText: '斗破苍穹' }).locator('.book-delete').click();
    await page.waitForFunction(() => document.querySelectorAll('.book-item').length === 1);
    step('刪除書本 ✓');

    assert.deepEqual(errors, [], `頁面錯誤：${errors.join('; ')}`);
  } finally {
    await browser.close();
    if (server.listening) server.close();
  }
}

await mkdir(SHOTS, { recursive: true });
let failed = false;
for (const [type, name] of [[webkit, 'webkit'], [chromium, 'chromium']]) {
  try {
    await run(type, name);
    console.log(`✔ ${name} 全部通過`);
  } catch (err) {
    failed = true;
    console.error(`✖ ${name} 失敗：`, err.message);
  }
}
process.exit(failed ? 1 : 0);
