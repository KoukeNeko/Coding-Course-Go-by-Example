# 常數 (Constants)

> `const` 宣告編譯時期就決定的常數，可以是「typed」（綁定型別）或「untyped」（保留任意精度、使用時才依上下文決定型別）。

## 核心概念

- **必須用 `=`，不能用 `:=`**：短宣告 `:=` 永遠宣告變數，常數一律寫 `const X = ...`。
- **值必須在編譯時期可決定**：不能來自函式呼叫（少數內建例外，如 `len`、`unsafe.Sizeof` 對常數參數的呼叫）。
- **Untyped constant**：未指定型別的常數（如 `const Pi = 3.14`）有「default type」但能在運算中自然轉換到目標型別，且精度極高。
- **Typed constant**：指定型別後（如 `const Limit int64 = 1000`）就必須以該型別參與運算，不會自動轉成其他型別。
- **`iota` 列舉計數器**：常數區塊中 `iota` 從 0 開始，每多一行自動加 1，是 Go 實作列舉的標準手法。

## 範例

混用 typed 與 untyped 常數：

```go
package main

import (
    "fmt"
    "math"
)

const Greeting = "Hello"        // untyped string constant
const Pi float64 = 3.14159      // typed constant

const (
    KB = 1024
    MB = 1024 * KB
    GB = 1024 * MB
)

func main() {
    radius := 2.0
    area := Pi * math.Pow(radius, 2)
    fmt.Println(Greeting, area, MB)
}
```

用 `iota` 製作列舉：

```go
type Weekday int

const (
    Sunday Weekday = iota // 0
    Monday                // 1
    Tuesday               // 2
    Wednesday             // 3
    Thursday              // 4
    Friday                // 5
    Saturday              // 6
)
```

## 常見錯誤

- ❌ `MaxSize := 100` 卻當常數用 —— `:=` 永遠宣告變數，需要常數請寫 `const MaxSize = 100`。
- ❌ `const now = time.Now()` —— 執行期才知道的值不能當常數，編譯失敗。
- ❌ 對 typed constant 期待自動轉型：`const n int = 10; var f float64 = n` 會失敗，需 `float64(n)`。

## 最佳實踐

- ✅ 預設使用 **untyped 常數**以保留型別彈性，除非真的需要限制型別。
- ✅ 對外匯出的常數用大寫開頭（`const MaxRetries = 3`），不再使用 C 風格的 `ALL_CAPS`。
- ✅ 一組相關常數（特別是列舉）統一放在 `const ( ... )` 區塊裡，必要時搭配 `iota`。

## 任務：計算秒數

請利用已知的 `secondsInMinute` 與 `minutesInHour`，計算並宣告 `secondsInHour` 常數。

## 延伸閱讀

- [A Tour of Go: Constants](https://go.dev/tour/basics/15) — BSD-3-Clause
- [A Tour of Go: Numeric Constants](https://go.dev/tour/basics/16) — BSD-3-Clause
- [The Go Blog: Constants](https://go.dev/blog/constants) — BSD-3-Clause
- [Effective Go: Constants](https://go.dev/doc/effective_go#constants) — BSD-3-Clause
- [Go by Example: Constants](https://gobyexample.com/constants) — CC BY 3.0
- [Go Spec: Constants](https://go.dev/ref/spec#Constants) — BSD-3-Clause
