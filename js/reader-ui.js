// 閱讀器的互動層：點擊/滑動翻頁、選單、目錄、設定面板、時鐘。

import * as reader from './reader.js';
import { THEMES, FONTS, LIMITS, loadSettings, saveSettings, applySettings } from './settings.js';
import { setChildren } from './dom.js';

const SWIPE_MIN_PX = 40;
const TAP_PREV_ZONE = 0.3;
const TAP_NEXT_ZONE = 0.7;
const CLICK_SUPPRESS_MS = 500;
const TOAST_MS = 1500;
const CLOCK_INTERVAL_MS = 20000;

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const menu = $('menu');
const toc = $('toc');
const tocList = $('toc-list');
const settingsPanel = $('settings-panel');
const slider = $('chapter-slider');
const sliderLabel = $('slider-label');
const toast = $('toast');
const download = $('download');

let settings = loadSettings();
let toastTimer = null;

export function initReaderUi({ onBack }) {
  applySettings(settings);
  bindStage();
  bindMenu(onBack);
  bindToc();
  bindSettings();
  bindKeyboard();
  startClock();
  reader.onEdge(showToast);
  reader.onChange(syncMenu);
}

/** 書本打開後建立目錄與滑桿範圍。 */
export function onBookOpened() {
  const { chapterTitles } = reader.getState();
  const frag = document.createDocumentFragment();
  chapterTitles.forEach((title, i) => {
    const li = document.createElement('li');
    li.textContent = title;
    li.dataset.index = String(i);
    frag.append(li);
  });
  setChildren(tocList, [frag]);
  slider.max = String(Math.max(0, chapterTitles.length - 1));
  closeAllPanels();
}

function isAnyPanelOpen() {
  return !menu.hidden || !toc.hidden || !settingsPanel.hidden;
}

function closeAllPanels() {
  menu.hidden = true;
  toc.hidden = true;
  settingsPanel.hidden = true;
}

export function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, TOAST_MS);
}

/** 內建書背景下載進度；done >= total 或沒給就收起來。 */
export function showDownload(done, total) {
  if (!total || done >= total) {
    download.hidden = true;
    return;
  }
  $('download-text').textContent = `下載中 ${done}/${total}`;
  $('download-fill').style.width = `${(done / total) * 100}%`;
  download.hidden = false;
}

// ---------- 翻頁手勢 ----------

function bindStage() {
  let touchStart = null;
  let suppressClickUntil = 0;

  stage.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  stage.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
    suppressClickUntil = Date.now() + CLICK_SUPPRESS_MS;
    if (dx < 0) reader.nextPage();
    else reader.prevPage();
  });

  stage.addEventListener('click', (e) => {
    if (Date.now() < suppressClickUntil) return;
    const x = e.clientX / stage.clientWidth;
    if (x < TAP_PREV_ZONE) reader.prevPage();
    else if (x > TAP_NEXT_ZONE) reader.nextPage();
    else openMenu();
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    if ($('reader').hidden || isAnyPanelOpen()) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') reader.nextPage();
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') reader.prevPage();
    else return;
    e.preventDefault();
  });
}

// ---------- 選單 ----------

function openMenu() {
  menu.hidden = false; // 先顯示，syncMenu 才不會因為選單隱藏而跳過
  syncMenu();
}

function syncMenu() {
  if (menu.hidden && toc.hidden) return;
  const s = reader.getState();
  $('menu-title').textContent = s.title;
  slider.value = String(s.chapter);
  sliderLabel.textContent = s.chapterTitles[s.chapter] ?? '';
}

function bindMenu(onBack) {
  $('menu-close-area').addEventListener('click', () => { menu.hidden = true; });
  $('btn-back').addEventListener('click', () => {
    closeAllPanels();
    onBack();
  });
  $('btn-prev-ch').addEventListener('click', () => reader.goChapter(reader.getState().chapter - 1));
  $('btn-next-ch').addEventListener('click', () => reader.goChapter(reader.getState().chapter + 1));
  slider.addEventListener('input', () => {
    sliderLabel.textContent = reader.getState().chapterTitles[Number(slider.value)] ?? '';
  });
  slider.addEventListener('change', () => reader.goChapter(Number(slider.value)));
  $('btn-toc').addEventListener('click', openToc);
  $('btn-settings').addEventListener('click', () => {
    menu.hidden = true;
    renderSettings();
    settingsPanel.hidden = false;
  });
}

// ---------- 目錄 ----------

function openToc() {
  menu.hidden = true;
  const { chapter } = reader.getState();
  tocList.querySelector('li.current')?.classList.remove('current');
  const current = tocList.children[chapter];
  current?.classList.add('current');
  toc.hidden = false;
  current?.scrollIntoView({ block: 'center' });
}

function bindToc() {
  const close = () => { toc.hidden = true; };
  $('btn-toc-close').addEventListener('click', close);
  $('toc-mask').addEventListener('click', close);
  tocList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-index]');
    if (!li) return;
    close();
    reader.goChapter(Number(li.dataset.index));
  });
}

// ---------- 設定 ----------

function updateSettings(patch) {
  settings = saveSettings({ ...settings, ...patch });
  applySettings(settings);
  reader.relayout();
  renderSettings();
}

function renderOptions(container, entries, activeKey, key, decorate) {
  const buttons = Object.keys(entries).map((id) => {
    const item = entries[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.label;
    btn.dataset[key] = id;
    btn.classList.toggle('active', id === activeKey);
    decorate?.(btn, item);
    return btn;
  });
  setChildren(container, buttons);
}

function renderSettings() {
  $('val-fontSize').textContent = String(settings.fontSize);
  $('val-lineHeight').textContent = settings.lineHeight.toFixed(1);
  renderOptions($('font-options'), FONTS, settings.font, 'font', (btn, item) => {
    btn.style.fontFamily = item.css;
  });
  renderOptions($('theme-options'), THEMES, settings.theme, 'theme', (btn, item) => {
    btn.classList.add('swatch');
    btn.style.background = item.bg;
    btn.style.color = item.fg;
  });
}

function bindSettings() {
  $('settings-mask').addEventListener('click', () => { settingsPanel.hidden = true; });
  settingsPanel.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.step) {
      const key = btn.dataset.step;
      const delta = LIMITS[key].step * Number(btn.dataset.dir);
      updateSettings({ [key]: settings[key] + delta });
    } else if (btn.dataset.font) {
      updateSettings({ font: btn.dataset.font });
    } else if (btn.dataset.theme) {
      updateSettings({ theme: btn.dataset.theme });
    }
  });
}

// ---------- 時鐘 ----------

function startClock() {
  const clock = $('clock');
  const tick = () => {
    const now = new Date();
    clock.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };
  tick();
  setInterval(tick, CLOCK_INTERVAL_MS);
}
