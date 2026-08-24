# 給我錢 1.0 🍯

簡易趣味薪資紀錄系統 — 一個韓系可愛風格的薪資計算與打卡 APP，支援即時工時追蹤與薪資預估，並可安裝成手機 PWA。

## 這是什麼

不用註冊帳號、不用綁定 Email，輸入一個用戶名稱和時薪就能開始打卡。上班時即時顯示已工作的時間與目前預估可以領到的薪水，下班一鍵結算並存入歷史班表，資料透過 Firebase Firestore 即時雲端同步，換裝置登入同一個名稱就能接續使用。

## 功能特色

- **免註冊打卡**：只需要用戶名稱 + 時薪即可開始，資料自動存到雲端
- **即時計時 / 薪資試算**：開始上班、休息暫停、繼續、下班，計時中即時換算目前預估薪資
- **雲端即時同步**：透過 Firestore `onSnapshot` 即時監聽資料變化，多裝置登入同一帳號會自動同步狀態
- **歷史班表紀錄**：每次下班自動記錄一筆班別（時間、時長、時薪、實領金額),可查看或清除
- **時薪即時調整**：打卡過程中可隨時修改時薪設定
- **可愛插畫風 UI**：韓系粉彩配色 + 手繪風小熊動畫,依上班/休息/下班狀態切換表情
- **PWA 支援**：可加到手機主畫面,離線圖示與 manifest 已設定好

## 技術棧

| 分類 | 技術 |
| --- | --- |
| 前端框架 | React 19 + TypeScript |
| 建置工具 | Vite 6 |
| 樣式 | Tailwind CSS 4 |
| 動畫 | Motion (Framer Motion) |
| 圖示 | lucide-react |
| 資料庫 | Firebase Firestore（即時同步） |
| 其他 | PWA（manifest.json + service worker） |

> 專案由 Google AI Studio 產生,`package.json` 中仍保留 `@google/genai`、`express` 依賴與 `.env.example`,目前程式碼實際上未使用到這兩項,可視需求移除。

## 專案結構

```
src/
├── App.tsx                     # 進入點,管理登入狀態與 Firestore 即時監聽
├── types.ts                    # UserData / ShiftLog 等型別定義,含配色常數
├── components/
│   ├── LoginView.tsx            # 登入 / 建立用戶
│   ├── MainWorkView.tsx         # 主打卡畫面(計時、薪資試算、控制按鈕)
│   ├── ShiftHistoryModal.tsx    # 歷史班表 Modal
│   ├── InstallGuideModal.tsx    # 加入主畫面安裝教學
│   ├── LineArtBear.tsx          # 手繪風小熊動畫
│   └── MobileFrame.tsx          # 手機外框版型
├── index.css
└── main.tsx
firestore.rules                 # Firestore 安全規則
public/                         # manifest.json、icon、service worker
```

## 開始使用

### 安裝依賴

```bash
bun install
# 或
npm install
```

### 設定 Firebase

目前 Firebase 專案設定直接寫在 [src/App.tsx](src/App.tsx) 中(`firebaseConfig`),若要接自己的 Firebase 專案,請替換成你自己的設定,並依 `firebase-blueprint.json` 建立對應的 Firestore 集合結構(`users/{username}`)。

### 啟動開發伺服器

```bash
bun run dev
```

預設會在 `http://localhost:3000` 啟動。

### 建置 / 預覽

```bash
bun run build
bun run preview
```

### 型別檢查

```bash
bun run lint
```

## 資料模型

`users/{username}` 文件結構(定義於 [src/types.ts](src/types.ts)):

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `username` | string | 用戶名稱,同時作為文件 ID |
| `hourlyRate` | number | 時薪 |
| `isClockedIn` | boolean | 是否正在打卡中 |
| `isPaused` | boolean | 是否處於休息暫停 |
| `startTime` | number \| null | 本次計時起算的時間戳 |
| `accumulatedMs` | number | 已累積的工作毫秒數 |
| `history` | ShiftLog[] | 歷史班表紀錄 |

## 已知限制

- `firestore.rules` 目前設定為**任何人皆可讀寫、無身份驗證**,僅適合個人使用或展示用途。若要正式使用或多人共用,建議加上 Firebase Authentication 並收斂安全規則。
- 用戶名稱即帳號,重複輸入相同名稱即可讀寫該帳號資料,無密碼保護。
