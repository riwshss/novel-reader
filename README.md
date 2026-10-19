# 小說閱讀器（TXT PWA）

給 iPhone 用的離線 TXT 小說閱讀器。純前端，書和進度都只存在手機上（IndexedDB）。
支援到 iPhone 5（iOS 10）：程式打包成舊 Safari 能跑的語法，320px 小螢幕有專門排版。

## 在 iPhone 上安裝

1. 用 **Safari** 打開 GitHub Pages 網址
2. 按下方「分享」→「加入主畫面」
3. 從主畫面的「閱讀」圖示打開，按「＋ 匯入 TXT」從「檔案」App 選小說

> 請從主畫面圖示開啟。只在 Safari 分頁裡使用的話，iOS 可能會在長時間沒開後清掉資料。

## 內建書

書架上的「內建」書是加密打包好的（`books/`），repo 公開但內容需要密碼才能解開。
第一次點開輸入密碼 → 立刻可讀，其餘章節在背景下載解密存進手機，下載完就能離線閱讀。
（iOS 10 的檔案選擇器不能選 txt，所以舊 iPhone 要靠內建書。）

新增或更新內建書：

```bash
NOVEL_PASSWORD=密碼 node tools/build-book.mjs 路徑/書名.txt 英文id
```

密碼不會進 repo；本機的 `.book-password`（已 gitignore）供 e2e 冒煙測試使用。

## 功能

- 自動辨識編碼：UTF-8 / UTF-16 / GBK(GB18030) / Big5
- 自動切章節：「第X章/回/節/卷」、Chapter N、楔子、番外等；沒有章節標題時按長度分段
- 左右點擊或滑動翻頁，中間點一下開選單
- 目錄、章節滑桿、上一章/下一章
- 字體大小、行距、宋體/黑體/楷體、四種背景
- 記住每本書讀到的位置（精確到頁首的字），重開 App 直接回到上次那本
- 離線可用（新 iOS 用 Service Worker，iOS 10 用 AppCache）

## 開發

```bash
npm run build             # js/ → dist/app.js，並自動更新 sw.js 與 offline.appcache 的版本號
npm test                  # 單元測試（解析、分塊、加密）
npm run lint:compat       # 檢查有沒有用到 iOS 10 沒有的 API
node tools/check-syntax.mjs # 確認 dist/app.js 只有 ES2017 語法
npx playwright install webkit chromium
npm run e2e               # 先 build，再模擬 iPhone 5 / iPhone 15 跑完整流程
node tools/make-icons.mjs # 重新產生圖示
```

頁面載入的是 `dist/app.js`（要提交進 repo，GitHub Pages 沒有建置步驟）。改完 `js/` 一定要 `npm run build`。
