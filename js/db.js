// IndexedDB 封裝：books 存書目與進度（小），contents 存章節全文（大）。

const DB_NAME = 'novel-reader';
const DB_VERSION = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('books')) db.createObjectStore('books', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('contents')) db.createObjectStore('contents', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(names, mode, fn) {
  const db = await openDb();
  const tx = db.transaction(names, mode);
  const done = new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('交易中止'));
  });
  const result = await fn(tx);
  await done;
  return result;
}

export async function listBooks() {
  const books = await withStore(['books'], 'readonly', (tx) => promisify(tx.objectStore('books').getAll()));
  return books.sort((a, b) => (b.lastReadAt || b.addedAt) - (a.lastReadAt || a.addedAt));
}

export function getBook(id) {
  return withStore(['books'], 'readonly', (tx) => promisify(tx.objectStore('books').get(id)));
}

export function getContent(id) {
  return withStore(['contents'], 'readonly', (tx) => promisify(tx.objectStore('contents').get(id)));
}

/** 新增一本書：meta 進 books，章節進 contents。 */
export function addBook(meta, chapters) {
  return withStore(['books', 'contents'], 'readwrite', (tx) => {
    tx.objectStore('books').put(meta);
    tx.objectStore('contents').put({ id: meta.id, chapters });
  });
}

export function saveBook(meta) {
  return withStore(['books'], 'readwrite', (tx) => {
    tx.objectStore('books').put(meta);
  });
}

export function deleteBook(id) {
  return withStore(['books', 'contents'], 'readwrite', (tx) => {
    tx.objectStore('books').delete(id);
    tx.objectStore('contents').delete(id);
  });
}
