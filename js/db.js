// IndexedDB 封裝：books 存書目、章節標題與進度（小），contents 每塊章節全文一筆（大）。
// contents 的 key 是「書 id#塊序號」；舊版整本一筆（key 就是書 id）的資料在打開時轉換。
// 只用 iOS 10 Safari 也有的 API（不用 getAll / getAllKeys）。

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
  dbPromise.catch(() => { dbPromise = null; });
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
  done.catch(() => {}); // fn 自己拋錯時，下面不會再 await done
  const result = await fn(tx);
  await done;
  return result;
}

const chunkKey = (bookId, k) => `${bookId}#${k}`;
const chunkRange = (bookId) => IDBKeyRange.bound(`${bookId}#`, `${bookId}#￿`);

export async function listBooks() {
  const books = await withStore(['books'], 'readonly', (tx) => new Promise((resolve, reject) => {
    const out = [];
    const req = tx.objectStore('books').openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) return resolve(out);
      out.push(cursor.value);
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  }));
  return books.sort((a, b) => (b.lastReadAt || b.addedAt) - (a.lastReadAt || a.addedAt));
}

export function getBook(id) {
  return withStore(['books'], 'readonly', (tx) => promisify(tx.objectStore('books').get(id)));
}

function patchBook(store, id, fn, resolve, reject) {
  const req = store.get(id);
  req.onsuccess = () => {
    if (!req.result) return resolve(null);
    const next = fn(req.result);
    store.put(next);
    resolve(next);
  };
  req.onerror = () => reject(req.error);
}

/**
 * 在同一個交易裡讀出書目、套用 fn、寫回，避免閱讀進度和下載進度互相覆蓋。
 * put 寫在 onsuccess 裡（不經過 await），舊版 Safari 才不會先把交易提交掉。
 */
export function updateBook(id, fn) {
  return withStore(['books'], 'readwrite', (tx) => new Promise((resolve, reject) => {
    patchBook(tx.objectStore('books'), id, fn, resolve, reject);
  }));
}

/** 存一塊下載好的全文，並把書目上那塊標記為已下載。 */
export function storeChunk(bookId, k, texts) {
  return withStore(['books', 'contents'], 'readwrite', (tx) => new Promise((resolve, reject) => {
    const books = tx.objectStore('books');
    const req = books.get(bookId);
    req.onsuccess = () => {
      const book = req.result;
      if (!book) { // 下載途中書被刪掉了，不要留下孤兒全文
        tx.abort();
        return reject(new Error('書已被刪除'));
      }
      const ready = (book.ready || []).slice();
      ready[k] = true;
      books.put(Object.assign({}, book, { ready }));
      tx.objectStore('contents').put({ id: chunkKey(bookId, k), texts });
      resolve();
    };
    req.onerror = () => reject(req.error);
  }));
}

/** 取一塊章節全文（字串陣列）；還沒下載就回 null。 */
export async function getChunk(bookId, k) {
  const record = await withStore(['contents'], 'readonly', (tx) => promisify(tx.objectStore('contents').get(chunkKey(bookId, k))));
  return record ? record.texts : null;
}

/** 新增或更新書目，連同給定的幾塊全文：chunks = { 塊序號: 字串陣列 }。 */
export function putBook(meta, chunks = {}) {
  return withStore(['books', 'contents'], 'readwrite', (tx) => {
    tx.objectStore('books').put(meta);
    Object.keys(chunks).forEach((k) => {
      tx.objectStore('contents').put({ id: chunkKey(meta.id, k), texts: chunks[k] });
    });
  });
}

export function deleteBook(id) {
  return withStore(['books', 'contents'], 'readwrite', (tx) => {
    tx.objectStore('books').delete(id);
    tx.objectStore('contents').delete(id); // 舊版整本一筆的格式
    tx.objectStore('contents').delete(chunkRange(id));
  });
}

/** 舊版整本一筆的全文：{ chapters: [{ title, text }] }，沒有就回 undefined。 */
export function getLegacyContent(id) {
  return withStore(['contents'], 'readonly', (tx) => promisify(tx.objectStore('contents').get(id)));
}

export function deleteLegacyContent(id) {
  return withStore(['contents'], 'readwrite', (tx) => {
    tx.objectStore('contents').delete(id);
  });
}
