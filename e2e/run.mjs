// 端對端測試：模擬 iPhone 5 大小（320×568）與 iPhone 15，跑完
// 內建書解鎖→背景下載→匯入→翻頁→目錄→設定→續讀→離線→刪除。
// 執行：npm run e2e（會先 build；需先 npx playwright install webkit chromium）
// 若有 .book-password，另外用真正的《做局》打包檔跑一次冒煙測試。
import { webkit, chromium, devices } from 'playwright';
import { readFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import {
  ROOT, startServer, stopServer, makeFixtureBooks, FIXTURE_PASSWORD, FIXTURE_CHAPTERS,
  longNovel, text, pageNo, tapAt, visibleParagraphs, overflowingElements,
} from './helpers.mjs';

const SHOTS = join(ROOT, 'e2e', 'screenshots');

async function openSession(browserType, device, booksDir) {
  const browser = await browserType.launch();
  const context = await browser.newContext({ ...devices[device] });
  const page = await context.newPage();
  const session = { browser, page, errors: [], promptAnswer: '' };
  page.on('pageerror', (e) => session.errors.push(e.message));
  page.on('dialog', (d) => (d.type() === 'prompt' ? d.accept(session.promptAnswer) : d.accept()));
  session.server = await startServer(booksDir);
  session.url = `http://127.0.0.1:${session.server.address().port}/`;
  return session;
}

async function closeSession(session) {
  await session.browser.close();
  if (session.server.listening) await stopServer(session.server);
}

async function checkShelfAndImport(page, step, shot) {
  await page.waitForSelector('.book-item.locked');
  assert.equal(await page.locator('#empty-hint').isHidden(), true);
  assert.match(await text(page, '.book-item.locked .book-meta'), /點一下輸入密碼/);
  step('書架顯示未解鎖的內建書 ✓');

  const gbk = await readFile(join(ROOT, 'tests', 'fixtures', 'gbk.txt'));
  await page.setInputFiles('#file-input', [
    { name: '斗破苍穹.txt', mimeType: 'text/plain', buffer: gbk },
    { name: '《长篇测试》.txt', mimeType: 'text/plain', buffer: longNovel() },
  ]);
  await page.waitForFunction(() => document.querySelectorAll('.book-item').length === 3);
  assert.match(await text(page, '#shelf-status'), /已匯入《斗破苍穹》（3 章）/);
  assert.match(await text(page, '#shelf-status'), /已匯入《长篇测试》（13 章）/);
  assert.deepEqual(await overflowingElements(page, '.shelf-header *, .book-item *'), []);
  await shot('1-shelf');
  step('匯入 GBK + UTF-8 兩本書、書架沒有超出螢幕 ✓');

  await page.setInputFiles('#file-input', { name: '斗破苍穹.txt', mimeType: 'text/plain', buffer: gbk });
  await page.waitForFunction(() => /已經在書架上/.test(document.getElementById('shelf-status').textContent));
  step('重複匯入會被擋下 ✓');
}

async function checkPaging(page, step, shot) {
  await page.locator('.book-item', { hasText: '长篇测试' }).locator('.book-title').click();
  await page.waitForSelector('#reader:not([hidden])');
  await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '前言');
  await tapAt(page, 0.85);
  assert.equal(await text(page, '#chapter-name'), '第1章 风起之时1');
  const [cur, total] = await pageNo(page);
  assert.equal(cur, 1);
  assert.ok(total >= 3, `第1章應有多頁，實際 ${total}`);
  await shot('2-reader-page1');
  step(`前言翻到第1章，共 ${total} 頁 ✓`);

  await tapAt(page, 0.85);
  assert.deepEqual(await pageNo(page), [2, total]);
  await tapAt(page, 0.15);
  assert.deepEqual(await pageNo(page), [1, total]);
  step('右邊點下一頁、左邊點上一頁 ✓');

  await tapAt(page, 0.15);
  assert.equal(await text(page, '#chapter-name'), '前言');
  await tapAt(page, 0.15);
  await page.waitForSelector('#toast:not([hidden])');
  assert.equal(await text(page, '#toast'), '已經是第一頁了');
  step('跨章往回 + 書頭提示 ✓');

  await tapAt(page, 0.85);
  const bad = await page.evaluate(() => {
    const vp = document.getElementById('page-viewport').getBoundingClientRect();
    const rects = [...document.querySelectorAll('#page-content > *')].flatMap((p) => [...p.getClientRects()]);
    return rects.filter((r) => r.right > vp.left && r.left < vp.right)
      .filter((r) => r.left < vp.left + 1 || r.right > vp.right - 1 || r.bottom > vp.bottom + 1).length;
  });
  assert.equal(bad, 0, `有 ${bad} 個文字片段超出頁面`);
  for (let i = 1; i < total; i++) await tapAt(page, 0.85);
  assert.deepEqual(await pageNo(page), [total, total]);
  assert.ok((await visibleParagraphs(page)).length > 0, '最後一頁不應該是空白頁');
  await tapAt(page, 0.85);
  assert.equal(await text(page, '#chapter-name'), '第2章 风起之时2');
  step('每頁文字都在框內、最後一頁非空白、翻到下一章 ✓');
}

async function checkMenuAndSettings(page, step, shot) {
  await tapAt(page, 0.5);
  await page.waitForSelector('#menu:not([hidden])');
  assert.equal(await text(page, '#menu-title'), '长篇测试');
  assert.equal(await text(page, '#slider-label'), '第2章 风起之时2');
  assert.deepEqual(await overflowingElements(page, '.menu-bottom *'), []);
  await shot('4-menu');
  await page.click('#btn-toc');
  await page.waitForSelector('#toc:not([hidden])');
  assert.equal(await text(page, '#toc-list li.current'), '第2章 风起之时2');
  await shot('5-toc');
  await page.locator('#toc-list li', { hasText: '第10章' }).click();
  await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '第10章 风起之时10');
  step('選單 + 目錄跳到第10章 ✓');

  await tapAt(page, 0.85);
  await tapAt(page, 0.85);
  const firstLineBefore = (await visibleParagraphs(page)).find((t) => /^\d/.test(t)).slice(0, 4);
  await tapAt(page, 0.5);
  await page.click('#btn-settings');
  await page.waitForSelector('#settings-panel:not([hidden])');
  const size = Number(await text(page, '#val-fontSize'));
  await page.click('[data-step="fontSize"][data-dir="1"]');
  await page.click('[data-step="fontSize"][data-dir="1"]');
  assert.equal(Number(await text(page, '#val-fontSize')), size + 2);
  await page.click('[data-theme="dark"]');
  assert.deepEqual(await overflowingElements(page, '.sheet-panel *'), []);
  await shot('6-settings-dark');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(18, 18, 18)');
  await page.click('#settings-mask', { position: { x: 20, y: 20 } });
  const after = (await visibleParagraphs(page)).map((t) => t.slice(0, 4));
  assert.ok(after.includes(firstLineBefore), `放大字體後應停在同一段（${firstLineBefore}）`);
  await shot('7-dark-reading');
  step('放大字體、夜間模式、設定面板不超出、仍停留同一段 ✓');
}

async function checkResume(page, step, shot) {
  const before = await text(page, '#chapter-name');
  const pageBefore = await pageNo(page);
  await page.waitForTimeout(600); // 等待進度寫入
  await page.reload();
  await page.waitForSelector('#reader:not([hidden])');
  await page.waitForFunction((t) => document.getElementById('chapter-name').textContent === t, before);
  assert.deepEqual(await pageNo(page), pageBefore);
  step('重新開啟後回到同一章同一頁、設定保留 ✓');

  await tapAt(page, 0.5);
  await page.click('#btn-back');
  await page.waitForSelector('#shelf:not([hidden])');
  const meta = await page.locator('.book-item', { hasText: '长篇测试' }).locator('.book-meta').innerText();
  assert.match(meta, /第10章 风起之时10 · \d+\.\d%/);
  await shot('8-shelf-progress');
  step(`書架顯示進度「${meta}」 ✓`);
}

async function checkBuiltin(session, step, shot) {
  const { page } = session;
  session.promptAnswer = 'wrong-password';
  await page.click('.book-item.locked');
  await page.waitForFunction(() => /密碼錯誤/.test(document.getElementById('shelf-status').textContent));
  step('內建書輸入錯誤密碼被擋下 ✓');

  // 背景下載中途斷一次網路（國內連 GitHub Pages 常見），應該自動重試而不是停住
  session.server.dropOnce.add('/books/testbook/c2.bin');
  session.promptAnswer = FIXTURE_PASSWORD;
  await page.click('.book-item.locked');
  await page.waitForSelector('#reader:not([hidden])');
  await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '第1章 内建1');
  assert.match((await visibleParagraphs(page))[1], /内建第1章第1段/);
  await page.waitForFunction(() => /已全部下載/.test(document.getElementById('toast').textContent), null, { timeout: 15000 });
  assert.equal(session.server.dropOnce.size, 0, '測試沒有攔到 c2.bin');
  step('正確密碼解鎖、讀到第1章、下載中途斷線後自動重試完成 ✓');

  await tapAt(page, 0.5);
  await page.click('#btn-toc');
  await page.locator('#toc-list li', { hasText: `第${FIXTURE_CHAPTERS}章` }).click();
  await page.waitForFunction((n) => document.getElementById('chapter-name').textContent === `第${n}章 内建${n}`, FIXTURE_CHAPTERS);
  assert.match((await visibleParagraphs(page))[1], new RegExp(`内建第${FIXTURE_CHAPTERS}章第1段`));
  await shot('9-builtin');
  await tapAt(page, 0.5);
  await page.click('#btn-back');
  await page.waitForSelector('#shelf:not([hidden])');
  await page.waitForSelector('.book-item[data-id="builtin-testbook"]');
  assert.equal(await page.locator('.book-item.locked').count(), 0);
  const meta = await text(page, '.book-item[data-id="builtin-testbook"] .book-meta');
  assert.match(meta, /第25章 内建25 · \d+\.\d%/);
  assert.doesNotMatch(meta, /已下載/);
  step(`目錄跳到最後一章、書架「${meta}」 ✓`);
}

async function checkOffline(session, step) {
  const { page } = session;
  const hasSw = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return true;
  });
  if (!hasSw) return step('此瀏覽器環境無 Service Worker，略過離線測試');
  await page.waitForTimeout(500);
  await stopServer(session.server); // 直接關掉伺服器模擬斷網
  await page.reload();
  await page.waitForSelector('.book-item');
  await page.locator('.book-item', { hasText: '测试内建' }).locator('.book-title').click();
  await page.waitForSelector('#reader:not([hidden])');
  await tapAt(page, 0.5);
  await page.click('#btn-toc');
  await page.locator('#toc-list li', { hasText: '第2章' }).click();
  await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '第2章 内建2');
  assert.match((await visibleParagraphs(page))[1], /内建第2章第1段/);
  await tapAt(page, 0.5);
  await page.click('#btn-back');
  step('斷網後重新整理仍可開啟，內建書其他塊從本機讀 ✓');
}

async function run(browserType, device, name, booksDir) {
  const session = await openSession(browserType, device, booksDir);
  const { page } = session;
  const shot = (n) => page.screenshot({ path: join(SHOTS, `${name}-${n}.png`) });
  const step = (s) => console.log(`  [${name}] ${s}`);
  try {
    await page.goto(session.url);
    await checkShelfAndImport(page, step, shot);
    await checkPaging(page, step, shot);
    await checkMenuAndSettings(page, step, shot);
    await checkResume(page, step, shot);
    await checkBuiltin(session, step, shot);
    await checkOffline(session, step);

    await page.waitForSelector('#shelf:not([hidden])');
    const count = await page.locator('.book-item').count();
    await page.locator('.book-item', { hasText: '斗破苍穹' }).locator('.book-delete').click();
    await page.waitForFunction((n) => document.querySelectorAll('.book-item').length === n - 1, count);
    step('刪除書本 ✓');
    assert.deepEqual(session.errors, [], `頁面錯誤：${session.errors.join('; ')}`);
  } finally {
    await closeSession(session);
  }
}

/** 用真正打包的《做局》跑一次：解鎖、第一章、最後一章、全部下載完的時間。 */
async function smokeRealBook(password) {
  const session = await openSession(webkit, 'iPhone SE', join(ROOT, 'books'));
  const { page } = session;
  const step = (s) => console.log(`  [real] ${s}`);
  try {
    session.promptAnswer = password;
    await page.goto(session.url);
    const started = Date.now();
    await page.locator('.book-item.locked', { hasText: '做局' }).click();
    await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '前言', null, { timeout: 30000 });
    step(`解鎖並顯示前言，${Date.now() - started} ms ✓`);
    await page.waitForFunction(() => /已全部下載/.test(document.getElementById('toast').textContent), null, { timeout: 120000 });
    step(`全部 70 塊下載解密完成，${Date.now() - started} ms ✓`);
    await tapAt(page, 0.5);
    await page.click('#btn-toc');
    await page.locator('#toc-list li', { hasText: '第3426章' }).click();
    await page.waitForFunction(() => document.getElementById('chapter-name').textContent === '第3426章眼神直了');
    assert.ok((await visibleParagraphs(page)).length > 1, '最後一章應有內文');
    await page.screenshot({ path: join(SHOTS, 'real-last-chapter.png') });
    step('目錄跳到第3426章，內文正常 ✓');
    assert.deepEqual(session.errors, [], `頁面錯誤：${session.errors.join('; ')}`);
  } finally {
    await closeSession(session);
  }
}

await mkdir(SHOTS, { recursive: true });
const fixtureDir = await mkdtemp(join(tmpdir(), 'novel-e2e-'));
await makeFixtureBooks(fixtureDir);
const MATRIX = [
  [webkit, 'iPhone SE', 'webkit-se'],
  [webkit, 'iPhone 15', 'webkit-15'],
  [chromium, 'iPhone SE', 'chromium-se'],
];
let failed = false;
for (const [type, device, name] of MATRIX) {
  try {
    await run(type, device, name, fixtureDir);
    console.log(`✔ ${name} 全部通過`);
  } catch (err) {
    failed = true;
    console.error(`✖ ${name} 失敗：`, err.message);
  }
}
const passwordFile = join(ROOT, '.book-password');
if (existsSync(passwordFile) && existsSync(join(ROOT, 'books', 'manifest.json'))) {
  try {
    await smokeRealBook(readFileSync(passwordFile, 'utf8').trim());
    console.log('✔ real 全部通過');
  } catch (err) {
    failed = true;
    console.error('✖ real 失敗：', err.message);
  }
}
await rm(fixtureDir, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
