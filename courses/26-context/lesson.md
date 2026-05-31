# Context 套件

> `context.Context` 攜帶截止時間、取消訊號與請求範圍內的資料，沿呼叫鏈傳遞，讓多個 goroutine 能被一起取消、共享 deadline —— 是 Go 後端服務的標準做法。

## 核心概念

- **`Background()` 與 `TODO()` 是根 context**：
  - `Background()` 用於 main、init、測試的最上層。
  - `TODO()` 用在「之後該換成真正的 context、但現在還不確定要用哪個」的暫時情境。
  - 兩者皆永不取消、無 deadline、無值。
- **`WithCancel / WithDeadline / WithTimeout` 衍生新 ctx**：呼叫後回傳「子 context + cancel 函式」，**`defer cancel()` 必呼叫**以釋放底層資源（包含 timer）；父 ctx 取消時所有子 ctx 連動取消。
- **First-arg 慣例**：context 永遠是函式第一個參數，且名為 `ctx`，例如 `func Fetch(ctx context.Context, url string) (...)`。**不要把 ctx 存在 struct**，而是逐層當參數傳。
- **`<-ctx.Done()` + `ctx.Err()`**：`Done()` 在 ctx 被取消或逾時時關閉，常出現在 `select` 中；事後可用 `ctx.Err()` 區分 `context.Canceled`（手動取消）或 `context.DeadlineExceeded`（逾時）。
- **`WithValue` 僅限請求範圍 metadata**：適合放 request ID、登入使用者、追蹤資訊；**不應用來傳函式可選參數**。key 必須用未匯出的具名型別來避免碰撞。

## 範例

超時呼叫 + 一定要 `defer cancel`：

```go
package main

import (
    "context"
    "fmt"
    "io"
    "net/http"
    "time"
)

func fetchWithTimeout(parent context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(parent, 2*time.Second)
    defer cancel() // 即使提早完成也要釋放 timer

    req, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    return io.ReadAll(resp.Body)
}

func main() {
    data, err := fetchWithTimeout(context.Background(), "https://example.com")
    fmt.Println(len(data), err)
}
```

在 `select` 中觀察取消：

```go
type Job struct{ ID int }

func processStream(ctx context.Context, input <-chan Job) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err() // Canceled 或 DeadlineExceeded
        case job, ok := <-input:
            if !ok {
                return nil
            }
            handle(job)
        }
    }
}
```

## 常見錯誤

- ❌ **忘了呼叫 `cancel()`**：`WithTimeout` 沒 defer cancel，timer 會殘留直到逾時才被 GC，大量呼叫會造成資源洩漏。
- ❌ **傳 `nil` 當 context**：函式簽名要求 `context.Context` 卻傳 `nil`，呼叫端在使用 ctx 時會 nil panic；不確定就傳 `context.TODO()`。
- ❌ **用 `WithValue` 傳必要參數**：例如用 ctx 傳 DB 連線、查詢條件；這讓函式簽名隱藏依賴、難測試、難追蹤。

## 最佳實踐

- ✅ **ctx 是第一個參數，且只往「下」傳，不往「上」回傳**；不要把 ctx 放在 struct 欄位裡。
- ✅ **每個 `With*` 配一個 `defer cancel()`**：即使你「知道」會逾時自然取消，也養成寫 defer 的習慣。
- ✅ **`WithValue` 的 key 用 unexported 具名型別**：`type userKey struct{}`，避免不同套件 key 撞名。

## 任務

使用 `context.WithTimeout` 建立一個超時為 50 毫秒的 Context，用 `select` 同時等待「100 毫秒後完成」與 `<-ctx.Done()`。因為超時較早，請印出 `Work cancelled:` 後接 `ctx.Err()`；若工作先完成則印出 `Work finished`。

## 延伸閱讀

- [The Go Blog: Go Concurrency Patterns — Context](https://go.dev/blog/context) — BSD-3-Clause
- [Package context — pkg.go.dev](https://pkg.go.dev/context) — BSD-3-Clause
- [Go by Example: Context](https://gobyexample.com/context) — CC BY 3.0
