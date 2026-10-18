// 純函式：txt 位元組 → 文字 → 章節。不碰 DOM，方便在 Node 裡測試。

// 常用字（簡繁各一份），用來判斷 GB18030 / Big5 哪個解碼結果比較像中文
const COMMON_CHARS = new Set(
  '的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方它头经长儿回位分老因很给名法间知世什两次使身者被高已亲其进此话常与活正感' +
  '這個們來時為說國著過會對學麼發當沒從無種開總現動頭經長兒間給親進話與還見問樣點氣聲'
);

const FALLBACK_ENCODINGS = ['gb18030', 'big5'];

function scoreText(text) {
  let common = 0;
  let bad = 0;
  const len = Math.min(text.length, 20000);
  for (let i = 0; i < len; i++) {
    const ch = text[i];
    if (ch === '�') bad++;
    else if (COMMON_CHARS.has(ch)) common++;
  }
  return common - bad * 10;
}

/** 把 txt 的位元組解碼成字串，自動判斷 UTF-8 / UTF-16 / GB18030 / Big5。 */
export function decodeText(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (u8[0] === 0xef && u8[1] === 0xbb && u8[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(u8.subarray(3));
  }
  if (u8[0] === 0xff && u8[1] === 0xfe) return new TextDecoder('utf-16le').decode(u8.subarray(2));
  if (u8[0] === 0xfe && u8[1] === 0xff) return new TextDecoder('utf-16be').decode(u8.subarray(2));

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(u8);
  } catch {
    // 不是合法 UTF-8，往下試中文舊編碼
  }

  let best = null;
  for (const enc of FALLBACK_ENCODINGS) {
    let text;
    try {
      text = new TextDecoder(enc).decode(u8);
    } catch {
      continue; // 這個環境不支援該編碼
    }
    const score = scoreText(text);
    if (!best || score > best.score) best = { text, score };
  }
  return best ? best.text : new TextDecoder('utf-8').decode(u8);
}

const NUM = '0-9０-９零〇一二三四五六七八九十百千万萬两兩';
const CHAPTER_RE = new RegExp(
  '^(?:' +
    `第[${NUM}]+[章回节節卷集部篇话話].*` +
    '|(?:chapter|CHAPTER|Chapter)\\s*\\d+.*' +
    '|(?:序章|序言|序|楔子|引子|前言|尾声|尾聲|后记|後記|终章|終章|番外)(?:\\s.*|[：:、].*)?' +
  ')$'
);
const MAX_TITLE_LEN = 40;
// 以句號等結尾的多半是內文（例如「第一节课下课了。」），不是標題
const SENTENCE_END_RE = /[。！？!?…」”"]$/;
const CHUNK_SIZE = 8000;

function isChapterTitle(line) {
  return (
    line.length > 0 &&
    line.length <= MAX_TITLE_LEN &&
    !SENTENCE_END_RE.test(line) &&
    CHAPTER_RE.test(line)
  );
}

/** 沒偵測到章節時，按長度切成「第 N 段」，切點落在換行上。 */
function chunkByLength(text) {
  const chapters = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + CHUNK_SIZE, text.length);
    if (end < text.length) {
      const nl = text.indexOf('\n', end);
      end = nl === -1 ? text.length : nl + 1;
    }
    chapters.push({ title: `第 ${chapters.length + 1} 段`, text: text.slice(start, end).trim() });
    start = end;
  }
  return chapters.filter((c) => c.text.length > 0);
}

/** 把整本書的文字切成章節：[{ title, text }]。 */
export function splitChapters(rawText) {
  const text = rawText.replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  const chapters = [];
  let current = { title: '前言', lines: [] };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (isChapterTitle(line)) {
      chapters.push(current);
      current = { title: line, lines: [] };
    } else {
      current.lines.push(rawLine);
    }
  }
  chapters.push(current);

  const result = chapters
    .map((c) => ({ title: c.title, text: c.lines.join('\n').trim() }))
    .filter((c, i) => !(i === 0 && c.text.length === 0)); // 沒有前言就丟掉

  const hasRealChapters = result.length > 1 || (result.length === 1 && result[0].title !== '前言');
  if (!hasRealChapters) return chunkByLength(text.trim());
  return result;
}

/** 從檔名推書名：去副檔名、去書名號。 */
export function titleFromFilename(name) {
  const base = name.replace(/\.txt$/i, '').trim();
  const m = base.match(/《(.+?)》/);
  return (m ? m[1] : base) || '未命名';
}

/** txt 位元組 → 書本資料。 */
export function parseBook(bytes, filename) {
  const text = decodeText(bytes);
  const chapters = splitChapters(text);
  return { title: titleFromFilename(filename), chapters };
}
