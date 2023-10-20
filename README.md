# StockBlock

## 專案介紹

StockBlock 是一個使用 Vue.js 和 ECharts 建立的股市資訊視覺化工具。這個工具會向 [臺灣證券交易所OpenAPI](https://openapi.twse.com.tw/#/) 索取資料，並使用 ECharts 的 treemap 圖形來呈現資料。

> 注意： 由於 CORS (跨來源資源共享) 的限制，此應用程式在 GitHub Pages 上無法正常運作。在本地開發環境中，我們使用 Vite 的代理功能來繞過這些限制。然而，當應用程式部署到 GitHub Pages 時，這些代理設定不再有效。因此，請考慮在本地運行此應用程式。

## 使用的 API

本專案使用以下五隻 API：
- /exchangeReport/BWIBBU_ALL：上市個股日本益比、殖利率及股價淨值比
- /exchangeReport/MI_INDEX：每日收盤行情-大盤統計資訊
- /exchangeReport/STOCK_DAY_ALL：上市個股日成交資訊
- ​/exchangeReport​/FMSRFK_ALL：上市個股月成交資訊
- /exchangeReport/FMNPTK_ALL：上市個股年成交資訊

## 功能介紹

在首頁的地方會有 select option 的方式讓使用者選擇要檢視哪個主題以及副主題，並分類成以下主題：

```json
{
  "get_FMNPTK_ALL": [
    { "value": "TradeVolume", "title": "成交股數" },
    { "value": "Transaction", "title": "成交筆數" }
  ],
  "get_FMSRFK_ALL": [
    { "value": "Transaction", "title": "成交筆數" },
    { "value": "TradeVolumeB", "title": "成交股數" }
  ],
  "get_MI_INDEX": [
    { "value": "+", "title": "漲幅百分比" },
    { "value": "-", "title": "跌幅百分比" }
  ],
  "get_BWIBBU_ALL": [
    { "value": "PEratio", "title": "本益比" },
    { "value": "DividendYield", "title": "殖利率%" },
    { "value": "PBratio", "title": "股價淨值比" }
  ],
  "get_STOCK_DAY_ALL": [
    { "value": "TradeVolume", "title": "成交股數" },
    { "value": "Transaction", "title": "成交筆數" }
  ]
}
```

## 開發環境

本專案使用以下開發工具：

- Vue.js
- Vite
- TypeScript
- ECharts
- Element Plus
- Tailwindcss
- Axios

## 執行專案

1. 安裝依賴項目：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 編譯專案：
```bash
npm run build
```

4. 預覽編譯後的專案：
```bash
npm run preview
```

## 資料來源

本專案的資料來源為 臺灣證券交易所 OpenAPI。所有資料的智慧財產權均屬於臺灣證券交易所或其他權利人所有。在未經臺灣證券交易所或其他權利人書面同意的情況下，不得逕自使用、修改、重製、公開播送、改作、散布、發行、公開發表。然而，臺灣證券交易所已授權「政府資料開放平臺」提供公眾使用之本網站資料。

如果您要引用或轉載本專案內容，請以適當方式清楚註明資料來源，並確保資料完整性，不得任意增刪。尊重智慧財產權是您應盡的義務。

