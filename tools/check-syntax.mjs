// 確認 dist/app.js 只用到 ES2017 語法（iOS 10.3 Safari 的上限），否則 iPhone 5 會整頁白屏。
import { parse } from 'acorn';
import { readFileSync } from 'node:fs';

const file = new URL('../dist/app.js', import.meta.url);
try {
  parse(readFileSync(file, 'utf8'), { ecmaVersion: 2017, sourceType: 'script' });
  console.log('dist/app.js 語法檢查通過（ES2017）');
} catch (err) {
  console.error(`dist/app.js 含有 iOS 10 不支援的語法：${err.message}`);
  process.exit(1);
}
