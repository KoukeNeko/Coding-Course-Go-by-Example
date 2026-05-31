# Select 語句

> `select` 讓一個 goroutine 同時等待多個 channel 操作；哪個就緒就執行哪個，多個同時就緒則「隨機」挑一個，`default` 把它從阻塞變成非阻塞。

## 核心概念

- **同時等待多個 channel**：語法類似 `switch`，但每個 `case` 必須是 channel 的送出或接收；沒有 case 就緒時 `select` 會阻塞，直到任一 case 可以推進。
- **多個就緒時隨機選**：若同時有多個 case 可推進，Go 規格規定「以均勻機率隨機」選一個；這避免程式因順序依賴而產生餓死，但也代表不能假設 case 順序。
- **`default` 變非阻塞操作**：加上 `default` 後，若沒有任何 channel 就緒就立刻執行 `default`；典型用途是「試試看能不能讀/寫，讀不到就跳過」的非阻塞檢查。
- **`time.After` 做超時**：`time.After(d)` 回傳一個會在 `d` 之後才送值的 channel；搭配 `select` 即可實作「等資料、最多等 N 秒」的模式。
- **`<-ctx.Done()` / `<-done` 做取消**：把取消訊號作為其中一個 case，主邏輯一旦被取消就能立即跳出，避免 goroutine 洩漏。

## 範例

超時模式：

```go
package main

import (
    "errors"
    "fmt"
    "time"
)

func waitForMessage(messages <-chan string, timeout time.Duration) (string, error) {
    select {
    case msg := <-messages:
        return msg, nil
    case <-time.After(timeout):
        return "", errors.New("timeout waiting for message")
    }
}

func main() {
    ch := make(chan string)
    go func() {
        time.Sleep(2 * time.Second)
        ch <- "hello"
    }()

    msg, err := waitForMessage(ch, 1*time.Second)
    fmt.Println(msg, err) // "" timeout waiting for message
}
```

非阻塞發送 + 取消：

```go
type Event struct{ Name string }

func tryPublish(events chan<- Event, e Event, done <-chan struct{}) bool {
    select {
    case events <- e:
        return true
    case <-done:
        return false
    default:
        // 通道滿了，這次放棄發送
        return false
    }
}
```

## 常見錯誤

- ❌ **以為 case 的順序代表優先順序**：多個 case 同時就緒時是**隨機**選的，不能用排列順序「優先處理某個 channel」。
- ❌ **`select{}` 空 select**：沒有任何 case 的 `select` 會永遠阻塞；常被誤用，實則只在「讓主 goroutine 不結束」這種少數場景才有意義。
- ❌ **for-select 中漏處理取消 channel**：迴圈中只 `select` 業務 channel，結果上層想取消時 goroutine 永遠卡住，造成洩漏。

## 最佳實踐

- ✅ **長時間執行的 goroutine 一定要有取消 case**：`<-ctx.Done()` 或 `<-done`，讓上游能優雅關閉。
- ✅ **超時邏輯放在呼叫端，用 `context.WithTimeout` 取代直接 `time.After`**：可以串接整條呼叫鏈的截止時間。
- ✅ **非阻塞檢查就用 `default`**：寫 `select { case x := <-ch: ... default: ... }`，別另外 spawn goroutine 模擬非阻塞。

## 任務

完成 `select` 區塊，等待接收 `ch1` 的訊息或是等待 1 秒的超時（`time.After`）。

## 延伸閱讀

- [Go Spec: Select statements](https://go.dev/ref/spec#Select_statements) — BSD-3-Clause
- [The Go Blog: Go Concurrency Patterns — Pipelines and cancellation](https://go.dev/blog/pipelines) — BSD-3-Clause
- [Package time — time.After](https://pkg.go.dev/time#After) — BSD-3-Clause
- [Go by Example: Select](https://gobyexample.com/select) — CC BY 3.0
- [Go by Example: Timeouts](https://gobyexample.com/timeouts) — CC BY 3.0
- [Go by Example: Non-Blocking Channel Operations](https://gobyexample.com/non-blocking-channel-operations) — CC BY 3.0
