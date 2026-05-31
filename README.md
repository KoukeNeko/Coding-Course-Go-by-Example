<img width="2672" height="1465" alt="image" src="https://github.com/user-attachments/assets/494ba26e-ade6-4c78-ad07-22a24c22f830" />


# Interactive Go Course

一個資料驅動的互動式 Go 教學平台：左側 lesson、右側可編輯的 `main.go`，按 Run 即在 Docker 沙箱內執行並用隱藏單元測試自動評分。

![chapters](https://img.shields.io/badge/chapters-28-blue?style=for-the-badge) ![license](https://img.shields.io/badge/code-MIT-green?style=for-the-badge) ![content](https://img.shields.io/badge/content-BSD--3--Clause%20%2B%20CC%20BY%203.0-orange?style=for-the-badge)

## 功能

- **28 章循序漸進的 Go 教材**，從 Hello World 到 Context、Generics、JSON。
- **內建 Monaco Editor**，提供 Go 語法高亮與自動完成的編輯體驗。
- **隱藏單元測試自動評分**：每章內附 `main_test.go`，後端若偵測到測試檔便改用 `go test -v` 取代 `go run main.go`，按 Run 即知對錯。
- **高強度 Docker 沙箱**：每次執行都在新容器內，無網路、唯讀掛載、記憶體 / CPU / PID 限制、drop all caps、no-new-privileges。
- **資料驅動架構**：教材是檔案系統上的 Markdown 與 Go 原始碼，後端啟動時掃描 `courses/` 並透過 REST API 提供給前端。新增章節只需建立資料夾。

## 技術棧

| 層 | 技術 |
|---|---|
| Frontend | React 19、Vite、TypeScript、Monaco Editor、react-markdown、Tailwind 風格自寫 CSS |
| Backend | Go 1.25、`net/http`、原生標準庫（無外部相依） |
| Sandbox | Docker CLI（從後端透過掛載 docker.sock 啟動 sibling 容器） |
| Image  | `golang:alpine`（執行學生程式碼） |

## 快速啟動

確認本機已安裝 **Docker** 與 **Docker Compose**：

```bash
docker compose up --build
```

啟動後：

- 前端：<http://localhost>
- API：<http://localhost:8080/api/chapters>

## 專案結構

```
.
├── backend/                # Go HTTP server
│   ├── main.go             # API + 沙箱執行邏輯
│   ├── go.mod
│   └── Dockerfile
├── frontend/               # React + Vite 前端
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── data/chapters.ts (type 定義)
│   ├── nginx.conf          # 生產用 Nginx + /api 反向代理
│   └── Dockerfile
├── courses/                # 教材內容（資料驅動）
│   └── NN-slug/
│       ├── meta.json       # { "id": "...", "title": "N. 標題" }
│       ├── lesson.md       # 教材本文
│       ├── main.go         # 初始 starter code
│       └── main_test.go    # 隱藏測試（按 Run 即自動評分）
├── scripts/
│   ├── verify-backend.sh
│   └── verify-chapters.sh
└── docker-compose.yml
```

## API

| Method | Path | 用途 |
|---|---|---|
| `GET`  | `/api/chapters` | 回傳所有章節 JSON（id、title、description、initialCode） |
| `POST` | `/api/execute`  | Body: `{ "code": "...", "chapterID": "..." }`；回傳執行 / 測試輸出 |

## 新增章節

```bash
mkdir courses/29-new-topic
cat > courses/29-new-topic/meta.json <<'EOF'
{ "id": "new-topic", "title": "29. 新主題" }
EOF
cat > courses/29-new-topic/lesson.md <<'EOF'
# 新主題

> 一句話描述

## 核心概念
...

## 任務
...
EOF
cat > courses/29-new-topic/main.go <<'EOF'
package main
import "fmt"
func main() {
    // TODO
    fmt.Println("hello")
}
EOF
# 可選：加入 main_test.go 即可啟動隱藏測試評分
```

重啟後端：`docker compose restart backend`。前端會自動從 API 抓到新章節。

## 沙箱安全性

每次執行使用者程式碼，後端會：

- `--network none`：禁止對外連線。
- `--user 1000:1000`：以非 root 執行。
- `--memory 512m --memory-swap 512m`：限制記憶體並停用 swap。
- `--cpus 1.0`：CPU 上限 1 核。
- `--pids-limit 200`：避免 fork bomb。
- `--cap-drop ALL --security-opt no-new-privileges`：移除所有 Linux capabilities、禁止提權。
- `-v <tmp>:/app:ro`：原始碼以唯讀方式掛載。
- 20 秒 context timeout：阻止無限迴圈。

詳見 [backend/main.go](backend/main.go) 的 `executeCodeInSandbox`。

## 授權

### 程式碼

本專案的程式碼以 **MIT License** 發布。

### 教材內容

`courses/**/lesson.md` 的解說與範例為原創內容，但**參考**了下列公開授權的權威來源；每篇 lesson 末尾的「延伸閱讀」皆列出來源與授權：

| 來源 | 授權 |
|---|---|
| [go.dev](https://go.dev/)（Tour of Go、Effective Go、Go Spec、Go Blog、pkg.go.dev） | BSD-3-Clause |
| [Go by Example](https://gobyexample.com/)（Mark McGranaghan） | CC BY 3.0 |

引用片段時皆以自有語句改寫；範例皆原創或顯著變形。

### 主題與樣式

本專案的程式碼編輯器使用了 **GitHub Dark** 與 **GitHub Light** 主題：
- 這些主題衍生自 GitHub 官方開源的 [primer/github-vscode-theme](https://github.com/primer/github-vscode-theme) (MIT License)。
- 並由 [brijeshb42/monaco-themes](https://github.com/brijeshb42/monaco-themes) (MIT License) 協助轉換為相容於 Monaco Editor 的格式。

## 致謝

教材引用之公開授權資源，原作者皆為 Go 團隊與社群貢獻者；參考連結與授權標註保留於每篇 `lesson.md`。
同時感謝 GitHub Primer 團隊以及開源社群提供的編輯器主題配色。
