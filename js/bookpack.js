// 內建書的加密封包：JSON → UTF-8 → deflate → XSalsa20-Poly1305（tweetnacl）。
// 全部是純 JS，iOS 10 的 Safari（沒有 crypto.subtle / DecompressionStream）也能解。

import nacl from 'tweetnacl';
import { deflateSync, inflateSync, strToU8, strFromU8 } from 'fflate';

const KEY_BYTES = nacl.secretbox.keyLength;
const NONCE_BYTES = nacl.secretbox.nonceLength;

export class WrongKeyError extends Error {
  constructor() {
    super('密碼錯誤');
    this.name = 'WrongKeyError';
  }
}

function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

/** 密碼 + 鹽 → 32 bytes 金鑰；重複 SHA-512 拖慢暴力猜測。 */
export function deriveKey(password, salt, iterations) {
  let h = nacl.hash(concat(salt, strToU8(password)));
  for (let i = 0; i < iterations; i++) h = nacl.hash(h);
  return h.subarray(0, KEY_BYTES);
}

/** 加密：輸出 nonce(24) + 密文。只在打包工具（Node）用。 */
export function seal(data, key) {
  const nonce = nacl.randomBytes(NONCE_BYTES);
  const box = nacl.secretbox(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }), nonce, key);
  return concat(nonce, box);
}

/** 解密；密碼錯或檔案被改過就拋 WrongKeyError。 */
export function open(bytes, key) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const plain = nacl.secretbox.open(u8.subarray(NONCE_BYTES), u8.subarray(0, NONCE_BYTES), key);
  if (!plain) throw new WrongKeyError();
  return JSON.parse(strFromU8(inflateSync(plain)));
}

export function toHex(bytes) {
  return Array.prototype.map.call(bytes, (b) => (b < 16 ? '0' : '') + b.toString(16)).join('');
}

export function fromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
