# 個人網站維護說明

這個網站用 GitHub Pages 內建的 Jekyll 產生。你只要改文字檔，推上 GitHub 後約一分鐘網站就會自動更新，不需要安裝任何東西。

## 資料夾結構

```
_config.yml            名字、自我介紹、聯絡方式、CV PDF 連結
_data/
  education.yml        學歷
  experience.yml       工作經歷
  toolbox.yml          技能／工具
  categories.yml       專案的四個分類（名稱和顏色）
_projects/             每個專案一個 .md 檔 ← 最常改的地方
assets/projects/       每個專案的圖片、影片（一個專案一個資料夾）
PROJECT_TEMPLATE.md    新增專案用的範本
```

其他資料夾（`_layouts`、`_includes`、`assets/css`、`assets/js`）是版面和程式，平常不用動。

## 新增一個專案

1. 複製 `PROJECT_TEMPLATE.md` 到 `_projects/`，改名，例如 `_projects/flood-mapping.md`。檔名就是網址：`/projects/flood-mapping/`。
2. 照範本填上方的欄位：標題、日期、分類、標籤、經緯度、一句話簡介。經緯度可以在 Google Maps 上按右鍵複製。標籤盡量沿用現有的（範本裡有列），篩選列才不會越來越長；用到哪些工具寫在內文就好。
3. 下面用 Markdown 寫內容（一段說明加幾個重點）。
4. 有圖片或影片的話，放到 `assets/projects/flood-mapping/`，在檔案裡用 `/assets/projects/flood-mapping/檔名` 引用。
5. Commit 並 push。首頁的地圖、專案清單、篩選器、CV 頁都會自動出現這個新專案。

選填欄位：
- `results`：右側的成果數字表。
- `team`：合作者。
- `video`：影片，捲到畫面上時會自動靜音播放。
- `compare`：前後對照滑桿，例如難民營那頁。
- `demo`：互動 demo（見下方說明）。

## 修改其他內容

- 學歷、經歷、技能：直接改 `_data/` 裡對應的 `.yml` 檔。
- 經歷要連到專案：在 `experience.yml` 的 `projects:` 填專案檔名（不含 `.md`）。
- 新增分類：在 `_data/categories.yml` 加一筆 `id`、`name`、`color`，專案的 `category:` 填那個 `id`。
- CV PDF：把 PDF 放進 `assets/`，在 `_config.yml` 填 `cv_pdf: /assets/cv.pdf`。CV 頁也有「Print / save as PDF」按鈕，可以直接存成 PDF。

## 互動 demo

現有的 demo 放在 `_includes/demos/`（畫面）和 `assets/js/demos/`（程式），在專案檔裡用 `demo: das` 這種方式指定。新的 demo 需要寫程式，寫好後在 `_includes/demo.html` 加一行 `{% when "名稱" %}{% include demos/名稱.html %}`。沒有 demo 的專案用文字、圖片或影片就很好。

## 網址設定

- 如果 repo 名稱是 `<你的帳號>.github.io`，`_config.yml` 的 `baseurl` 留空。
- 如果 repo 是別的名字（例如 `portfolio`），設定 `baseurl: "/portfolio"`。

## 在自己電腦預覽（選用）

安裝 Ruby 後執行：

```
gem install jekyll
jekyll serve
```

然後打開 http://localhost:4000 。
