# 互斥鎖 (Mutexes)

> 當多個 goroutine 必須讀寫同一塊記憶體時，用 `sync.Mutex` 把存取串行化，避免資料競爭（data race）。

## 核心概念

- **Data race 的定義**：兩個 goroutine 並發存取同一變數，且至少一方是寫入；結果未定義 —— 可能崩潰、可能值錯亂。
- **`Lock` / `Unlock`**：`sync.Mutex` 的零值就是可用的未上鎖狀態。`Lock()` 取得鎖、`Unlock()` 釋放；忘了 Unlock 會造成死鎖，常配合 `defer mu.Unlock()` 確保釋放。
- **`RWMutex` 讀寫鎖**：`RLock()/RUnlock()` 允許多個讀者並存；`Lock()/Unlock()` 為獨佔寫入。讀多寫少的場景效能比 `Mutex` 好。
- **不可複製**：`sync.Mutex` / `RWMutex` 一旦被使用就不能複製；含 mutex 的 struct 的方法 receiver 必須是指標。
- **`-race` flag**：用 `go test -race` / `go run -race` / `go build -race` 啟用 race detector，於執行期偵測 data race；CI 強烈建議開啟。

## 範例

安全計數器：

```go
package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu    sync.Mutex
    value int
}

// 必須用指標 receiver，否則 mu 會被複製、互斥失效
func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *SafeCounter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    counter := &SafeCounter{}
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Increment()
        }()
    }
    wg.Wait()
    fmt.Println(counter.Value()) // 1000；用 go run -race 也不會報錯
}
```

## 常見錯誤

- ❌ **忘記 Unlock / 提早 return**：用 `defer mu.Unlock()` 解決；避免在持鎖期間呼叫可能 panic 的函式而沒有 defer。
- ❌ **複製含 mutex 的 struct**（透過值傳遞、賦值、append 到 slice）→ 互斥失效；要用指標。
- ❌ **持鎖時呼叫外部回呼或 channel send/receive** → 容易死鎖；持鎖時間要短、不要做 I/O。

## 最佳實踐

- ✅ **取鎖立刻 `defer Unlock`**：簡單、不會漏，且 panic 也安全。
- ✅ **能用 channel 就用 channel**：mutex 適合保護「狀態」（counter、map、cache），channel 適合表達「事件流」。
- ✅ **CI 內必跑 `go test -race`**：race 是非決定性的，沒有 detector 幾乎抓不到。

## 任務

補全下面程式碼中的 `Lock()` 與 `Unlock()`，保護 `counter` 變數的安全寫入。

## 延伸閱讀

- [The Go Memory Model](https://go.dev/ref/mem) — BSD-3-Clause
- [Data Race Detector](https://go.dev/doc/articles/race_detector) — BSD-3-Clause
- [Package sync — pkg.go.dev](https://pkg.go.dev/sync) — BSD-3-Clause
- [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency) — BSD-3-Clause
- [Go by Example: Mutexes](https://gobyexample.com/mutexes) — CC BY 3.0
