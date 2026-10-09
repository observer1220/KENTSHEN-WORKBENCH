---
title: 一個人，六個小工具，同一個 Cloudflare 帳號
date: 2026-10-09
tags: Cloudflare, 工具, 開發筆記
summary: 從台灣百岳地圖到歌詞同步，六個作品怎麼共用同一套部署、登入與資料庫。
---

從四月到十月，我陸續把六個小工具放上線：台灣百岳地圖、台股報表、Undercurrent、Elsewhere、Veil，還有 Lyric Sync。它們看起來互不相干，背後卻用同一套做法。這篇記錄我怎麼讓一個人也養得起這麼多網站。

## 為什麼全部放在 Cloudflare Workers

這些工具多半是靜態頁面加上少量 API，不需要一台二十四小時開著的伺服器。放在 Workers 上有三個好處：

- 沒有伺服器要維護，流量小的時候幾乎不花錢
- 推到 GitHub 就自動部署，我只要執行一行指令
- 需要資料庫時直接接 D1，不用另外找服務

每個專案的部署指令都一樣：

```bash
./deploy.sh main
```

## 登入只做一次

Undercurrent、Elsewhere 和台灣百岳地圖共用同一個登入中樞 auth-hub。使用者在任何一個站登入，其他站也認得他，我也不用在每個專案重寫一次帳號系統。權限判斷永遠在伺服器端做，前端只決定要不要顯示按鈕。

## 讓 AI 不要亂編

做 Elsewhere 時最在意的是行程的真實性。日本、韓國、越南和泰國走資料庫模式，景點、飯店和餐廳都從資料庫的候選清單挑，不讓模型自己編。清單不夠時才補充，並且標明哪些是 AI 補的。

> 工具要小，小到一個人養得起，才有可能長期維護。

## 使用者怎麼說

Undercurrent 上線後我在 Threads 發了一篇介紹，下面是原文：

::embed[https://www.threads.com/@kentshen77/post/Dbib4VKDgVL]

## 延伸閱讀

Elsewhere 和 Undercurrent 一開始都是 Pages 專案，後來照官方指南搬到 Workers。如果你也有舊的 Pages 站，可以先看這份文件：

::embed[https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ | 從 Pages 搬到 Workers | Cloudflare 官方的遷移指南，說明靜態資源與路由要怎麼對應。]

也歡迎直接試用這些作品，從 Veil 開始最快，貼一段 log 就能看到效果：

::embed[https://veil.observer1220.workers.dev/ | VEIL 機敏文件去識別化工具 | 貼給 AI 之前，先把密碼、私鑰和個資遮起來。內容只在你的瀏覽器裡處理。]
