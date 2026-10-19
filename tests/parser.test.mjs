import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decodeText, splitChapters, titleFromFilename, parseBook, chunkStartsFor } from '../js/parser.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url));
const utf8 = (s) => new TextEncoder().encode(s);

test('decodes plain UTF-8', () => {
  assert.equal(decodeText(utf8('第一章 你好')), '第一章 你好');
});

test('strips UTF-8 BOM', () => {
  assert.ok(decodeText(fixture('utf8bom.txt')).startsWith('斗破苍穹'));
});

test('decodes UTF-16LE with BOM', () => {
  assert.ok(decodeText(fixture('utf16.txt')).startsWith('斗破苍穹'));
});

test('detects GBK-encoded simplified Chinese', () => {
  const text = decodeText(fixture('gbk.txt'));
  assert.ok(text.includes('第一章 陨落的天才'));
  assert.ok(!text.includes('�'));
});

test('detects Big5-encoded traditional Chinese', () => {
  const text = decodeText(fixture('big5.txt'));
  assert.ok(text.includes('話說天下大勢'));
  assert.ok(!text.includes('�'));
});

test('splits chapters and keeps preface before first chapter', () => {
  const chapters = splitChapters('书名\n作者\n\n第一章 开始\n内容一\n第二章 继续\n内容二\n');
  assert.deepEqual(
    chapters.map((c) => c.title),
    ['前言', '第一章 开始', '第二章 继续']
  );
  assert.equal(chapters[1].text, '内容一');
});

test('drops empty preface', () => {
  const chapters = splitChapters('\n\n第1章 a\nx\n第2章 b\ny');
  assert.deepEqual(chapters.map((c) => c.title), ['第1章 a', '第2章 b']);
});

test('recognizes various heading styles', () => {
  const text = ['楔子', 'a', '第十二回 b', 'c', 'Chapter 3 Hello', 'd', '番外 e', 'f'].join('\n');
  assert.deepEqual(
    splitChapters(text).map((c) => c.title),
    ['楔子', '第十二回 b', 'Chapter 3 Hello', '番外 e']
  );
});

test('ignores body sentences that look like headings', () => {
  const text = '第一章 开学\n第一节课下课了。\n他走了出去\n';
  const chapters = splitChapters(text);
  assert.equal(chapters.length, 1);
  assert.ok(chapters[0].text.includes('第一节课下课了。'));
});

test('ignores overly long lines starting with 第', () => {
  const long = '第一章' + '很'.repeat(50);
  assert.equal(splitChapters(`第一章 a\n${long}\n`).length, 1);
});

test('normalizes CRLF line endings', () => {
  const chapters = splitChapters('第一章 a\r\n内容\r\n第二章 b\r\n内容2');
  assert.deepEqual(chapters.map((c) => c.title), ['第一章 a', '第二章 b']);
});

test('falls back to fixed-size chunks when no chapters found', () => {
  const para = '这是没有章节标题的一段文字。\n';
  const chapters = splitChapters(para.repeat(2000));
  assert.ok(chapters.length > 1);
  assert.equal(chapters[0].title, '第 1 段');
  assert.equal(chapters.map((c) => c.text).join('\n').length > 0, true);
});

test('titleFromFilename strips extension and book-title marks', () => {
  assert.equal(titleFromFilename('《三体》作者：刘慈欣.txt'), '三体');
  assert.equal(titleFromFilename('凡人修仙传.TXT'), '凡人修仙传');
  assert.equal(titleFromFilename('.txt'), '未命名');
});

test('parseBook returns title and chapters from GBK file', () => {
  const book = parseBook(fixture('gbk.txt'), '斗破苍穹.txt');
  assert.equal(book.title, '斗破苍穹');
  assert.deepEqual(
    book.chapters.map((c) => c.title),
    ['前言', '第一章 陨落的天才', '第二章 斗气大陆']
  );
});

test('accepts 第N章 headings ending with ？ or ！', () => {
  const text = '第101章你想不想？\na\n第102章又出事了！\nb\n第103章 好\nc';
  assert.deepEqual(
    splitChapters(text).map((c) => c.title),
    ['第101章你想不想？', '第102章又出事了！', '第103章 好']
  );
});

test('still treats 第N章 lines ending with 。 as body text', () => {
  const chapters = splitChapters('第1章 a\n第二章节结束了。\nb');
  assert.equal(chapters.length, 1);
});

test('chunkStartsFor groups chapters until the char budget is exceeded', () => {
  const lens = [40, 40, 40, 100, 10, 10];
  assert.deepEqual(chunkStartsFor(lens, 100), [0, 2, 3, 4]);
});

test('chunkStartsFor puts every chapter in some chunk', () => {
  assert.deepEqual(chunkStartsFor([5], 100), [0]);
  assert.deepEqual(chunkStartsFor([500, 500], 100), [0, 1]);
});
