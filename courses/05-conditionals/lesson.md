# 條件控制 (if / else if / else)

> Go 的 `if` 條件不加括號，但區塊必須加大括號；支援在條件之前先執行一段「初始化語句」，該語句宣告的變數作用域只限於整個 `if/else` 區塊。

## 核心概念

- **語法**：`if 條件 { ... } else if 條件 { ... } else { ... }`，條件式禁止寫 `()`。
- **大括號 `{` 必須與 `if` / `else` 同一行**（K&R 風格），這是 `gofmt` 強制規定。
- **條件式必須是 `bool`**：Go 不會把 `0`、`""`、`nil` 當成 false（這跟 C/Python 大不同）。
- **初始化語句**：`if x := compute(); x > 10 { ... }`，`x` 只在 `if` / `else` 區塊內可見，是 Go 慣用於錯誤處理的縮小作用域技巧。
- **沒有三元運算子**：`a ? b : c` 不存在；需要時請用一般 `if/else` 取代。

## 範例

基本的 `if / else if / else`：

```go
package main

import "fmt"

func main() {
    score := 78

    if score >= 90 {
        fmt.Println("A")
    } else if score >= 60 {
        fmt.Println("Pass")
    } else {
        fmt.Println("Fail")
    }
}
```

帶初始化語句的 `if`（常見於錯誤處理）：

```go
package main

import (
    "fmt"
    "strconv"
)

func main() {
    if n, err := strconv.Atoi("42"); err == nil {
        fmt.Println("parsed:", n)
    } else {
        fmt.Println("parse failed:", err)
    }
    // 此處 n、err 已不在作用域內
}
```

## 常見錯誤

- ❌ `if (x > 0) { ... }` —— 條件外加括號可執行但違反 `gofmt`，非慣用寫法。
- ❌ 把 `{` 放到下一行 —— Go 會在行尾自動插入分號，直接造成語法錯誤。
- ❌ `if name { ... }` 期待非布林被視為 truthy/falsy —— 編譯失敗，必須用 `if name != "" { ... }`。

## 最佳實踐

- ✅ **早歸還（early return）**：if-else 巢狀過深時，讓錯誤分支先 `return`，主邏輯保持在最外層縮排。
- ✅ 將 `err != nil` 判斷靠近產生它的函式呼叫，配合 if 初始化把作用域縮到最小。
- ✅ 條件為單一布林變數時直接寫 `if isReady { ... }`，不要寫 `if isReady == true`。

## 任務

修改第 11 行的運算子。當 `messageLen` **小於或等於** `maxLen` 時，應該要印出 "Message sent"。

## 延伸閱讀

- [A Tour of Go: If](https://go.dev/tour/flowcontrol/5) — BSD-3-Clause
- [A Tour of Go: If with a short statement](https://go.dev/tour/flowcontrol/6) — BSD-3-Clause
- [Effective Go: If](https://go.dev/doc/effective_go#if) — BSD-3-Clause
- [Go by Example: If/Else](https://gobyexample.com/if-else) — CC BY 3.0
- [Go Spec: If statements](https://go.dev/ref/spec#If_statements) — BSD-3-Clause
