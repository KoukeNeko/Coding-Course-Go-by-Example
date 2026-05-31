# 函式 (Functions)

> Go 函式以 `func` 宣告，**參數型別寫在參數名稱之後**；支援多重回傳值，常被用來把結果與 `error` 一併回傳。

## 核心概念

- **語法**：`func 名稱(參數 型別, ...) (回傳型別, ...) { ... }`，單一回傳值的括號可省略。
- **同型別的連續參數共用型別宣告**：`func add(a, b int) int` 等同 `func add(a int, b int) int`。
- **多重回傳值**：`func divide(a, b float64) (float64, error)`；呼叫端常寫 `q, err := divide(x, y)` 並立即檢查 `err`。
- **命名回傳值（named return）**：在簽章中先宣告 `(result int, err error)`，等同在函式開頭以零值宣告；不接值的 `return` 會自動回傳這些變數（naked return），適合短函式。
- **函式是 first-class citizen**：可作為參數或回傳值傳遞，並支援匿名函式與閉包（詳見「進階函式」章節）。

## 範例

基本與多重回傳：

```go
package main

import (
    "errors"
    "fmt"
)

func add(a, b int) int {
    return a + b
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}

func main() {
    fmt.Println(add(3, 4))

    if result, err := divide(10, 2); err == nil {
        fmt.Println("result:", result)
    } else {
        fmt.Println("error:", err)
    }
}
```

命名回傳值與 naked return：

```go
// split 把整數依比例拆成兩半並回傳
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return // 等同 return x, y
}
```

## 常見錯誤

- ❌ 仿照 C/Java 寫法：`func add(int a, int b) int` —— Go 的型別在參數名後，這樣會語法錯誤。
- ❌ 忽略多重回傳值時直接省略：`, err := f()` 是錯的，必須用 `_` 占位 → `_, err := f()`。
- ❌ 在長函式裡濫用 naked return，讀者得往回找參數定義；naked return 只適合非常短的函式。

## 最佳實踐

- ✅ **`error` 一律放在回傳值的最後一個位置**，呼叫端立刻檢查 `if err != nil`。
- ✅ 函式名稱用 camelCase；對外匯出時首字母大寫（`ReadFile`），對內首字母小寫（`parseLine`）。
- ✅ 避免回傳超過 3 個值；多了就用 struct 包起來，名稱更有語意也更容易擴充。

## 任務：字串合併

請修復 `concat` 函式的 Signature（加上輸入參數的型別 `string`，以及回傳的型別 `string`）。

## 延伸閱讀

- [A Tour of Go: Functions](https://go.dev/tour/basics/4) — BSD-3-Clause
- [A Tour of Go: Multiple results](https://go.dev/tour/basics/6) — BSD-3-Clause
- [A Tour of Go: Named return values](https://go.dev/tour/basics/7) — BSD-3-Clause
- [Effective Go: Functions](https://go.dev/doc/effective_go#functions) — BSD-3-Clause
- [Go by Example: Functions](https://gobyexample.com/functions) — CC BY 3.0
- [Go Spec: Function declarations](https://go.dev/ref/spec#Function_declarations) — BSD-3-Clause
