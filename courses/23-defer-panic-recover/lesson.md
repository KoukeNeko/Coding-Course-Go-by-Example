# 延遲執行與中斷 (Defer / Panic / Recover)

> `defer` 排程函式在所屬函式 return 後執行；`panic` 中止正常控制流並沿呼叫堆疊往上展開；`recover` 是唯一能讓 panic 恢復的工具，**且只能在 `defer` 內呼叫**。

## 核心概念

- **LIFO 執行順序**：同一函式內多個 `defer` 會以「最後 defer、最先執行」收尾；適合用來保證資源釋放，例如在 return 前自動 `Close()`、`Unlock()`。
- **參數立即求值**：`defer` 寫下去那一刻就會把參數「凍結」起來，不會等到實際執行才再取一次。`defer fmt.Println(i)` 印的是當下的 `i`。
- **可讀寫具名回傳值**：如果外層函式用了具名回傳值（named return），deferred 函式內能直接修改它，常用於統一包裝 error。
- **panic 的展開行為**：`panic` 立刻中止目前函式正常流程，執行該函式內所有 `defer`，再往呼叫者層層往上展開；若沒人 `recover`，goroutine 整個崩潰、程式以非零狀態結束。
- **recover 的限制**：`recover()` 只在 *defer 內直接呼叫* 才有效；在被 defer 呼叫的子函式內呼叫，或非 panic 中呼叫，皆回傳 `nil`。它跟 `os.Exit` 不同 —— `os.Exit` 立刻結束、defer 都不跑；`panic` 仍會讓 defer 跑完。

## 範例

LIFO 與資源釋放：

```go
package main

import (
    "fmt"
    "io"
    "os"
)

func readConfig(path string) ([]byte, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close() // 不論底下哪條路徑 return 都會關檔
    return io.ReadAll(file)
}

func main() {
    defer fmt.Println("世界") // 最後執行
    defer fmt.Println("哈囉") // 先執行（LIFO）
    fmt.Println("開始")
}
// 輸出順序：開始 → 哈囉 → 世界
```

`recover` 攔截 goroutine 內的 panic：

```go
import "log"

func runSafely(task func()) {
    defer func() {
        if reason := recover(); reason != nil {
            log.Printf("task panicked: %v", reason)
        }
    }()
    task()
}
```

## 常見錯誤

- ❌ **以為 `defer` 的參數會延遲求值**：寫 `defer fmt.Println(counter)`，以為印出最終值，結果印的是寫下那行當時的值。
- ❌ **在迴圈裡 defer 累積資源**：`for` 內 `defer file.Close()` 要等整個外層函式結束才釋放；處理大量檔案時應改為單獨函式包起來。
- ❌ **在非 deferred 函式內呼叫 `recover`**：`recover()` 在 panic 時若不是被**直接** defer，會回傳 `nil`，panic 繼續往上傳。

## 最佳實踐

- ✅ **取得資源後立刻 `defer` 釋放**：`Lock` 後馬上 `defer Unlock`、`Open` 後馬上 `defer Close`，讓資源生命週期一眼可見。
- ✅ **panic 用在「不應該發生」的程式錯誤**：對外 API 邊界上仍應回傳 `error`；標準函式庫內部也許會 panic，但對外呈現的仍是 error。
- ✅ **goroutine 入口處包一層 `recover`**：背景任務、HTTP handler 等，加 recover 可避免單一 panic 拖垮整個 process。

## 任務

在 `main` 函式的第一行加上一個 `defer`，讓程式在結束時印出 `"Cleanup complete"`。

## 延伸閱讀

- [The Go Blog: Defer, Panic, and Recover](https://go.dev/blog/defer-panic-and-recover) — BSD-3-Clause
- [Effective Go: Defer / Panic / Recover](https://go.dev/doc/effective_go#defer) — BSD-3-Clause
- [Package builtin: panic / recover](https://pkg.go.dev/builtin#panic) — BSD-3-Clause
- [Go by Example: Defer](https://gobyexample.com/defer) — CC BY 3.0
- [Go by Example: Panic](https://gobyexample.com/panic) — CC BY 3.0
- [Go by Example: Recover](https://gobyexample.com/recover) — CC BY 3.0
