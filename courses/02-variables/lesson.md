# 變數與基本型別

> Go 是靜態強型別語言，可以用 `var` 完整宣告，也可以在函式內用 `:=` 搭配型別推斷；未顯式賦值的變數會被初始化為該型別的「零值」。

## 核心概念

- **三種宣告方式**：
  - `var name string` — 宣告 + 採用零值（`""`）。
  - `var name = "Ada"` — 宣告 + 由值推斷型別。
  - `name := "Ada"` — 短宣告，只能用在「函式內」，型別自動推斷。
- **零值（zero value）**：所有變數宣告後都有確定的初值，沒有 C 的「未初始化垃圾值」問題。常見零值：數值 `0`、布林 `false`、字串 `""`、指標 / 介面 / slice / map / channel / 函式 `nil`。
- **基本型別**：`bool`、`string`、`int / int8 / int16 / int32 / int64`、`uint / uint8(byte) / uint16 / uint32 / uint64 / uintptr`、`float32 / float64`、`complex64 / complex128`、`rune`（= `int32`）。
- **沒有隱式轉型**：`int` 與 `float64` 不能直接相加，必須用 `float64(i)` 顯式轉換。
- **未使用即報錯**：宣告了卻沒被使用的區域變數會編譯失敗，這是 Go 維持「整潔」的方式之一。

## 範例

```go
package main

import "fmt"

func main() {
    var name string = "Ada"   // 明確型別
    var age = 30              // 由值推斷成 int
    height := 1.68            // 短宣告，型別為 float64

    var isStudent bool        // 零值 false
    var score int             // 零值 0
    var nickname string       // 零值 ""

    fmt.Println(name, age, height, isStudent, score, nickname)
}
```

分組宣告與平行賦值：

```go
var (
    width  = 100
    height = 50
)

x, y := 3, 4   // 同時宣告兩個變數
x, y = y, x    // 一行交換值，不需要中介變數
```

## 常見錯誤

- ❌ 在函式外用 `:=` 宣告變數 —— 短宣告只能用在函式內，套件層級的全域變數一律用 `var`。
- ❌ `i := 1; i := 2` —— 對已存在變數重新使用 `:=` 會失敗，除非**左側至少有一個新變數**。
- ❌ `var a int = 1; var b float64 = a` —— 沒有隱式轉型，必須寫 `var b float64 = float64(a)`。

## 最佳實踐

- ✅ 函式內優先使用 `:=`；只在需要明確指定型別或宣告零值變數時才用 `var`。
- ✅ 整數除非有特殊需求一律用 `int`；浮點數預設用 `float64`。
- ✅ 變數名稱使用 camelCase（如 `userName`），只有要對外匯出時才用大寫開頭。

## 任務：修復帳單 Bug

目前的程式碼在計算總費用時出現了邏輯錯誤（使用了加號而不是乘號）。請修復第 10 行的 Bug，讓計算結果正確。

## 延伸閱讀

- [A Tour of Go: Variables](https://go.dev/tour/basics/8) — BSD-3-Clause
- [A Tour of Go: Zero values](https://go.dev/tour/basics/12) — BSD-3-Clause
- [A Tour of Go: Short variable declarations](https://go.dev/tour/basics/10) — BSD-3-Clause
- [Effective Go: Declarations](https://go.dev/doc/effective_go#declarations) — BSD-3-Clause
- [Go by Example: Variables](https://gobyexample.com/variables) — CC BY 3.0
- [Go Spec: Variable declarations](https://go.dev/ref/spec#Variable_declarations) — BSD-3-Clause
