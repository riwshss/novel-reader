import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveKey, seal, open, WrongKeyError } from '../js/bookpack.js';

const salt = new Uint8Array(16).fill(7);

test('seal/open round-trips JSON with Chinese text', () => {
  const key = deriveKey('密碼abc', salt, 10);
  const data = { title: '做局', texts: ['第一章\n乔梁笑了。', 'x'.repeat(50000)] };
  assert.deepEqual(open(seal(data, key), key), data);
});

test('sealed output does not contain the plaintext', () => {
  const key = deriveKey('pw', salt, 10);
  const bytes = seal({ t: 'secret-marker-123' }, key);
  assert.ok(!Buffer.from(bytes).toString('latin1').includes('secret-marker'));
});

test('open throws WrongKeyError for a wrong password', () => {
  const bytes = seal({ a: 1 }, deriveKey('right', salt, 10));
  assert.throws(() => open(bytes, deriveKey('wrong', salt, 10)), WrongKeyError);
});

test('deriveKey is deterministic and depends on salt and iterations', () => {
  const a = deriveKey('pw', salt, 10);
  assert.deepEqual(a, deriveKey('pw', salt, 10));
  assert.notDeepEqual(a, deriveKey('pw', new Uint8Array(16), 10));
  assert.notDeepEqual(a, deriveKey('pw', salt, 11));
  assert.equal(a.length, 32);
});
