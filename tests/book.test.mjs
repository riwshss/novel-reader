import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBook, chunkOf, readyCount, CHUNK_CHARS } from '../js/book.js';

const chapter = (title, len) => ({ title, text: '字'.repeat(len) });

test('buildBook splits large books into chunks and records chapter info', () => {
  const chapters = [chapter('一', CHUNK_CHARS - 10), chapter('二', 100), chapter('三', 5)];
  const { meta, chunks } = buildBook({ id: 'b', title: '書' }, chapters);
  assert.deepEqual(meta.chunkStarts, [0, 1]);
  assert.deepEqual(meta.titles, ['一', '二', '三']);
  assert.equal(meta.totalChars, CHUNK_CHARS + 95);
  assert.equal(meta.chapterCount, 3);
  assert.deepEqual(meta.ready, [true, true]);
  assert.equal(chunks[1].length, 2);
  assert.equal(meta.id, 'b');
  assert.equal(meta.progress.chapterTitle, '一');
});

test('chunkOf finds the chunk containing a chapter', () => {
  const starts = [0, 63, 125, 188];
  assert.equal(chunkOf(starts, 0), 0);
  assert.equal(chunkOf(starts, 62), 0);
  assert.equal(chunkOf(starts, 63), 1);
  assert.equal(chunkOf(starts, 187), 2);
  assert.equal(chunkOf(starts, 3000), 3);
  assert.equal(chunkOf([0], 5), 0);
});

test('readyCount counts downloaded chunks', () => {
  assert.equal(readyCount({ ready: [true, false, true] }), 2);
  assert.equal(readyCount({}), 0);
});
