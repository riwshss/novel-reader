// 閱讀設定：存在 localStorage，讀不到就用預設值。

const KEY = 'novel-reader:settings';

export const THEMES = {
  light: { label: '白', bg: '#fbfbf8', fg: '#222222', sub: '#8a8a85', panel: '#ffffff', line: '#e4e4e0' },
  sepia: { label: '米黃', bg: '#f4ecd8', fg: '#3b3024', sub: '#9a8b73', panel: '#fbf5e6', line: '#e0d4b8' },
  green: { label: '護眼', bg: '#cfe6cf', fg: '#1f3320', sub: '#5f7a60', panel: '#e2f1e2', line: '#b3d1b3' },
  dark: { label: '夜間', bg: '#121212', fg: '#a8a8a3', sub: '#5c5c58', panel: '#1e1e1e', line: '#2e2e2e' },
};

export const FONTS = {
  serif: { label: '宋體', css: '"Songti SC", "Songti TC", "STSong", "Noto Serif CJK SC", serif' },
  sans: { label: '黑體', css: '-apple-system, "PingFang SC", "PingFang TC", "Microsoft YaHei", sans-serif' },
  kai: { label: '楷體', css: '"Kaiti SC", "Kaiti TC", "STKaiti", "KaiTi", serif' },
};

export const LIMITS = {
  fontSize: { min: 14, max: 32, step: 1 },
  lineHeight: { min: 1.4, max: 2.4, step: 0.1 },
};

const DEFAULTS = { fontSize: 19, lineHeight: 1.8, theme: 'sepia', font: 'serif' };

function clamp(value, { min, max }) {
  return Math.min(max, Math.max(min, value));
}

/** 驗證並補齊設定，壞資料一律退回預設。 */
function sanitize(raw) {
  const s = { ...DEFAULTS, ...(raw && typeof raw === 'object' ? raw : {}) };
  return {
    fontSize: clamp(Number(s.fontSize) || DEFAULTS.fontSize, LIMITS.fontSize),
    lineHeight: Math.round(clamp(Number(s.lineHeight) || DEFAULTS.lineHeight, LIMITS.lineHeight) * 10) / 10,
    theme: s.theme in THEMES ? s.theme : DEFAULTS.theme,
    font: s.font in FONTS ? s.font : DEFAULTS.font,
  };
}

export function loadSettings() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(KEY)));
  } catch (err) {
    console.warn('讀取設定失敗，使用預設值', err);
    return { ...DEFAULTS };
  }
}

export function saveSettings(settings) {
  const clean = sanitize(settings);
  try {
    localStorage.setItem(KEY, JSON.stringify(clean));
  } catch (err) {
    console.warn('儲存設定失敗', err);
  }
  return clean;
}

/** 套用主題與字體到 CSS 變數。 */
export function applySettings(settings) {
  const theme = THEMES[settings.theme];
  const root = document.documentElement.style;
  root.setProperty('--bg', theme.bg);
  root.setProperty('--fg', theme.fg);
  root.setProperty('--sub', theme.sub);
  root.setProperty('--panel', theme.panel);
  root.setProperty('--line', theme.line);
  root.setProperty('--font-size', `${settings.fontSize}px`);
  root.setProperty('--line-height', String(settings.lineHeight));
  root.setProperty('--font', FONTS[settings.font].css);
  document.documentElement.dataset.theme = settings.theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.bg);
}
