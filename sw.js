// 離線快取：安裝時預先快取所有程式檔，之後一律先讀快取。
// VERSION 由 npm run build 依檔案內容自動產生，舊快取會在啟用時刪掉。

const VERSION = 'd6faa757d57f';
const CACHE = `novel-reader-${VERSION}`;
const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'dist/app.js',
  'manifest.webmanifest',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // 內建書（books/）一律直接走網路，離線時由程式自己處理錯誤
  if (url.pathname.indexOf('/books/') !== -1) return;
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request))
  );
});
