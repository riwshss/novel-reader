# 小說閱讀器（TXT PWA）

給 iPhone 用的離線 TXT 小說閱讀器。純前端，書和進度都只存在手機上（IndexedDB）。

## 在 iPhone 上安裝

1. 用 **Safari** 打開 GitHub Pages 網址
2. 按下方「分享」→「加入主畫面」
3. 從主畫面的「閱讀」圖示打開，按「＋ 匯入 TXT」從「檔案」App 選小說

> 請從主畫面圖示開啟。只在 Safari 分頁裡使用的話，iOS 可能會在長時間沒開後清掉資料。

## 功能

- 自動辨識編碼：UTF-8 / UTF-16 / GBK(GB18030) / Big5
- 自動切章節：「第X章/回/節/卷」、Chapter N、楔子、番外等；沒有章節標題時按長度分段
- 左右點擊或滑動翻頁，中間點一下開選單
- 目錄、章節滑桿、上一章/下一章
- 字體大小、行距、宋體/黑體/楷體、四種背景
- 記住每本書讀到的位置（精確到頁首的字），重開 App 直接回到上次那本
- 離線可用（Service Worker）

## 開發

```bash
npm test                 # 解析器單元測試
npx playwright install webkit chromium
npm run e2e              # 模擬 iPhone 跑完整流程（WebKit + Chromium）
node tools/make-icons.mjs # 重新產生圖示
```

改版後記得把 `sw.js` 裡的 `VERSION` 加一，手機上才會拿到新版。
