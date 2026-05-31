# WaitGroup 與 Atomic

> `sync.WaitGroup` 讓主流程等待一群 goroutine 全部完成；`sync/atomic` 提供 lock-free 的原子操作，適合單一變數的簡單計數場景。

## 核心概念

- **`WaitGroup` 的三個方法**：
  - `Add(n)` —— 告訴 wg 接下來會有 n 個任務要等。
  - `Done()` —— 任務完成時呼叫（內部就是 `Add(-1)`）。
  - `Wait()` —— 阻塞直到 counter 歸零。
- **`Add` 一定要在 `go` 之前呼叫**：若 `Add` 寫在新 goroutine 裡，main 可能還沒等到 Add 就已經 `Wait` 完，造成 race。
- **每個 `Add(1)` 對應一個 `defer wg.Done()`**：放在 goroutine 函式的最開頭，確保即使 panic 也會 Done。
- **`atomic.AddInt64` / `LoadInt64` / `StoreInt64`**：對單一整數變數做原子操作；不需要 mutex 即可避免 data race。Go 1.19+ 也提供 `atomic.Int64` 等型別封裝。
- **WaitGroup vs Mutex vs Atomic vs Channel**：
  - WaitGroup：等一群 goroutine 收工。
  - Mutex：保護一段「臨界區」（多行邏輯、複雜狀態）。
  - Atomic：單一整數 / 指標的高頻簡單操作。
  - Channel：goroutine 間傳遞資料或事件。

## 範例

WaitGroup + atomic 計數：

```go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var counter int64
    var wg sync.WaitGroup

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            atomic.AddInt64(&counter, 1)
        }()
    }

    wg.Wait()
    fmt.Println("counter:", atomic.LoadInt64(&counter)) // 100
}
```

Go 1.19+ 的 `atomic.Int64` 封裝（更安全、避免忘了取址）：

```go
import "sync/atomic"

var counter atomic.Int64

counter.Add(1)
fmt.Println(counter.Load())
```

## 常見錯誤

- ❌ **在 goroutine 內呼叫 `wg.Add(1)`**：應該在 `go` 之前 Add，否則 main 可能太早結束。
- ❌ **忘了 `defer wg.Done()`**：goroutine 提早 return 或 panic 後 counter 不會歸零，`Wait` 永遠阻塞。
- ❌ **對 `int64` 變數混用 `++` 與 `atomic.AddInt64`**：原子操作只在「全部都用 atomic」的情況下才安全，混用會 race。

## 最佳實踐

- ✅ **`wg.Add(1)` 寫在 `go` 之前，`defer wg.Done()` 寫在 goroutine 第一行**：固定模式不出錯。
- ✅ **Counter 場景優先用 `atomic`**：比 `sync.Mutex` 輕量；Go 1.19+ 推薦用 `atomic.Int64`/`atomic.Uint64` 等型別封裝。
- ✅ **複雜的條件等待用 channel 或 `sync.Cond`**：WaitGroup 只擅長「等 N 個任務做完」這種簡單模式。

## 任務

啟動 100 個 goroutine，各自把 `counter` 原子地加 1，並用 `WaitGroup` 等待全部完成，最後印出 `"counter: 100"`。

## 延伸閱讀

- [Package sync — pkg.go.dev](https://pkg.go.dev/sync) — BSD-3-Clause
- [Package sync/atomic — pkg.go.dev](https://pkg.go.dev/sync/atomic) — BSD-3-Clause
- [The Go Memory Model](https://go.dev/ref/mem) — BSD-3-Clause
- [Go by Example: WaitGroups](https://gobyexample.com/waitgroups) — CC BY 3.0
- [Go by Example: Atomic Counters](https://gobyexample.com/atomic-counters) — CC BY 3.0
