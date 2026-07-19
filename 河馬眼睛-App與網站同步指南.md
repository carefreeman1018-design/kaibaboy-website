# 河馬眼睛 App ↔ 官網 內容同步指南

> 目的：每次 App 更新後，讓網站（`hippo-eyes/` 頁、隱私政策、支援 FAQ）跟 App 的**實際功能與行為**保持一致。
> 適用對象：在「有 App 原始碼」那台電腦上工作的 Claude Code。

## 一、核心原則
1. **App 是真相來源**。同步方向永遠是：**App 實際情況 →（更新）`河馬眼睛-產品事實.md` →（生成）網站 HTML**。
2. **網站不得宣稱 App 沒做的事**。尤其隱私政策，寫的必須是 App 真實行為——這是 App Store 審核 5.1.1 最常被打回的原因。
3. 網站是**純靜態 HTML、無 build 工具**，所以「同步」＝由 Claude 讀 App、更新事實文件、再改對應 HTML 段落。
4. 繁體中文（台灣用法），語氣專業親切，燈號要保留「僅供參考、非醫療建議」聲明。

## 二、單一事實來源
`河馬眼睛-產品事實.md`（同目錄）是網站所有 App 相關內容的唯一依據。
每次 App 改版，**先更新這份文件**（把「待確認」對照 App 改成確定敘述、標上對照的 App 版本與日期），再往 HTML 傳播。

## 三、同步流程（每次 App 更新後重複）
1. `git pull`（先拿最新網站）。
2. 讀 App 原始碼，萃取事實（見第五節「去哪裡找」）。
3. 用實際情況**更新 `河馬眼睛-產品事實.md`**，逐項消化「待確認」。
4. 依第四節對照表，更新受影響的網站 HTML 段落。
5. 跑第六節「送審一致性檢查」。
6. 本機預覽驗證（`npx serve -l 3456 .`）→ `git commit` → `git push`（GitHub Pages 自動更新）。

## 四、事實 → 網站檔案 對照表
| 事實文件段落 | 影響的網站位置 |
|---|---|
| 2 標語 | `hippo-eyes/index.html` hero 副標；`index.html` 首頁河馬眼睛區塊 |
| 3 功能清單 | `hippo-eyes/index.html`「功能亮點」5 張卡片 |
| 4 使用流程 | `hippo-eyes/index.html`「怎麼使用？」4 步驟 |
| 5 燈號判定邏輯 | `hippo-eyes/index.html`「紅黃綠燈分級標準」AI 評級規則說明＋聲明；`index.html` 首頁三顆燈號 pill 描述；兩處手機示意圖（2026-07-19 起已無門檻表——燈號是 gemini-scan prompt 的 AI 判讀，非數值門檻） |
| 6 權限 | `hippo-eyes/privacy/index.html` 第二節（相機權限用途） |
| 7 資料處理 | `hippo-eyes/privacy/index.html` 第一、三、四、五、六節；`support/index.html` FAQ「照片會被上傳嗎」 |
| 8 裝置需求 | `support/index.html` FAQ「支援哪些裝置」；`hippo-eyes/privacy/` 如有提及 |
| 9 上架資訊 | 上架後：`hippo-eyes/index.html` 徽章與 CTA、`index.html`「開發中」徽章、`support/index.html` FAQ「什麼時候可以下載」全部改掉 |
| webApp / 企業工具 | `index.html`「服務項目」四張卡（AI 經營工具、數據分析、聊天機器人、股市回測）——依 webApp 實際功能校正，股市回測務必保留「不構成投資建議」 |

改動門檻數值時，記得同步 `sitemap.xml` 的 `lastmod`。

## 五、在 App / webApp 專案裡去哪裡找這些事實
（iOS App，路徑依實際專案調整）
- **權限字串**：`Info.plist` 的 `NSCameraUsageDescription`、`NSPhotoLibraryUsageDescription` 等
- **最低 iOS 版本 / 支援裝置**：Xcode 專案 target 的 Deployment Target、`TARGETED_DEVICE_FAMILY`
- **第三方 SDK**：`Podfile` / `Podfile.lock`（CocoaPods）、`Package.swift` 或 `*.xcodeproj` 的 SPM 依賴、`Package.resolved`
- **燈號判定邏輯**：真正的判定在 web repo `supabase/functions/gemini-scan/index.ts` 的中文 prompt（AI 評級規則：添加物優先、營養其次；無數值門檻、無固體/液體之分）；綠燈清單入庫的二次複驗見 `green-list-gate/index.ts`
- **影像辨識方式（裝置端 vs 伺服器）**：找 OCR / Vision / `VNRecognizeTextRequest` 相關程式，看是否有網路上傳（URLSession、API endpoint）
- **帳號系統**：找 login / signup / auth / 使用者資料儲存（有帳號 → 隱私政策要改，且 App 要有刪除帳號功能）
- **掃描紀錄儲存位置**：本地（UserDefaults / CoreData / SQLite / 檔案）還是雲端（Firebase / CloudKit / 自家 API）
- **年齡分級 / 文案**：App Store Connect 匯出的 metadata（若有），或 App 內設定畫面文案

（webApp：看 `package.json` 依賴、README、實際功能程式，用來校正首頁「服務項目」四張卡的描述。）

## 六、送審一致性檢查（改完必跑）
- [ ] 隱私政策所寫的資料蒐集 / 影像處理 / 第三方，與 App **實際行為**一致
- [ ] 隱私政策內容與日後填 App Store Connect 的 **App Privacy（營養標籤）問卷答案**一致（一個說「不蒐集」一個說「可能上傳」＝退件風險）
- [ ] 若 App 有帳號系統 → App 內要有「刪除帳號」功能，隱私政策也要說明刪除途徑（5.1.1(v)）
- [ ] 若導入新第三方 SDK → 隱私政策第五節具名揭露其名稱與用途
- [ ] 燈號評級規則（gemini-scan prompt）若改，網站分級標準說明、首頁 pill、兩處手機示意圖全部同步，且示意圖內容仍符合它所顯示的燈號
- [ ] 「僅供參考、非醫療建議」「特殊飲食需求請諮詢醫師/營養師」聲明還在
- [ ] 全站繁中、無簡體字與中國大陸用語

## 七、兩台電腦的 git 流程
- 開工前先 `git pull`，收工後 `git commit && git push`。
- 只有你一個人用，衝突機率低；若真的衝突，以較新的一方為準手動合併即可。
- GitHub repo：`carefreeman1018-design/kaibaboy-website`；push 到 main 後 GitHub Pages 幾分鐘內自動更新到 https://kaibaboy.com.tw 。

## 八、（進階，之後有需要再做）更強的同步保證
目前是「AI 讀 App → 更新事實文件 → 改 HTML」，適合現在的規模。
若日後想要更自動化，可考慮：把 `河馬眼睛-產品事實.md` 的關鍵數值抽成一個 `content/hippo-eyes.json`，加一個小產生器把數值注入 HTML；甚至讓 App 與網站共用同一份門檻設定檔。但那需要導入 build 步驟，靜態網站現階段不必急。
