# 併發與通道 (Concurrency & Channels)

> Go 用 **goroutine** 表達「同時做很多事」、用 **channel** 在 goroutine 之間安全傳值，把「共享記憶體」改寫成「藉由通訊來分享」(Don't communicate by sharing memory; share memory by communicating)。

## 核心概念

- **`go` 啟動 goroutine**：在任何函式呼叫前加 `go`，該函式就在新的 goroutine 中並發執行；goroutine 比 OS thread 輕量，啟動成千上萬個都常見。
- **`make(chan T)` 建立 channel**：channel 是型別安全的 FIFO 佇列，用 `ch <- v` 送值、`v := <-ch` 收值。
- **Unbuffered vs Buffered**：
  - `make(chan T)` 容量 0 → 送與收必須同時就緒（同步交付）。
  - `make(chan T, n)` 容量 n → 緩衝未滿時 send 不阻塞，未空時 receive 不阻塞。
- **`close()` 與 `for v := range ch`**：由「送方」呼叫 `close(ch)` 表示「不會再送了」；接收端可用 `for v := range ch` 一直讀到關閉為止，或用 `v, ok := <-ch` 透過 `ok == false` 判斷是否已關閉。
- **Concurrency ≠ Parallelism**：並發是「結構上把工作獨立切分」、並行是「實際同時跑」；Go 鼓勵先用 goroutine + channel 把程式結構切好，runtime 會把它們調度到可用的 CPU。

## 範例

最簡單的 ping pong：

```go
package main

import "fmt"

func main() {
    ch := make(chan string)

    go func() {
        ch <- "Ping"
    }()

    msg := <-ch
    fmt.Println(msg)
}
```

Pipeline 模式：把輸入平方後送出：

```go
package main

import "fmt"

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out) // 送完後關閉，讓下游 range 能正常結束
        for number := range in {
            out <- number * number
        }
    }()
    return out
}

func main() {
    source := make(chan int)
    go func() {
        defer close(source)
        for _, value := range []int{1, 2, 3, 4} {
            source <- value
        }
    }()

    for squared := range square(source) {
        fmt.Println(squared) // 1, 4, 9, 16
    }
}
```

## 常見錯誤

- ❌ **對已關閉的 channel 送值**：直接 panic；只能由唯一的送方關閉，且關閉後不再送。
- ❌ **goroutine leak**：goroutine 卡在沒有人讀/寫的 channel 上，GC 不會回收它。要設計清楚的退出（`done` channel、`context.Context`）。
- ❌ **以為 channel 一定要同步**：不為 fan-out / fan-in / 速率對齊場景選擇 buffered channel，反而造成不必要的阻塞；或反過來把它當佇列無限緩衝。

## 最佳實踐

- ✅ **「不要用共享記憶體溝通；用溝通來分享記憶體」**：能用 channel 表達的協作就不要用鎖。
- ✅ **誰建立、誰關閉**：channel 的 close 永遠由送方做，避免多個 goroutine 互相關閉導致 panic。
- ✅ **明確 goroutine 生命週期**：總是能回答「這個 goroutine 何時、為什麼會結束？」，並用 `context` 或 `done` channel 傳遞取消訊號。

## 任務

在一個新的 goroutine 中將訊息 `"Ping"` 送入通道，並在主執行緒中接收它並印出。

## 延伸閱讀

- [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency) — BSD-3-Clause
- [Go Spec: Channel types](https://go.dev/ref/spec#Channel_types) — BSD-3-Clause
- [The Go Blog: Go Concurrency Patterns — Pipelines and cancellation](https://go.dev/blog/pipelines) — BSD-3-Clause
- [The Go Blog: Concurrency is not parallelism](https://go.dev/blog/waza-talk) — BSD-3-Clause
- [Go by Example: Goroutines](https://gobyexample.com/goroutines) — CC BY 3.0
- [Go by Example: Channels](https://gobyexample.com/channels) — CC BY 3.0
