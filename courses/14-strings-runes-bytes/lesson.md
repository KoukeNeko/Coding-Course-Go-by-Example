# 字串、Rune 與 Byte

> Go 的 `string` 是「不可變的 byte 序列」，預設以 UTF-8 編碼；`byte` 是 `uint8` 的別名（代表單一位元組），`rune` 是 `int32` 的別名（代表單一 Unicode 碼點）。

## 核心概念

- **string 是不可變的 byte 序列**：`s[i]` 取出的是**位元組**（`byte`），不是字元；中文/emoji 通常佔 3-4 個位元組。
- **`len(s)` 是位元組長度，不是字元數**：要算字元數請用 `utf8.RuneCountInString(s)` 或 `len([]rune(s))`。
- **for-range 字串會自動以 UTF-8 解碼出 rune**：`for i, r := range s` 的 `i` 是位元組起始位置、`r` 是當下解出的 rune；這是走訪含多語字串最安全的方式。
- **三種轉換**：
  - `[]byte(s)` —— 取得位元組切片（會配新記憶體）。
  - `[]rune(s)` —— 依 UTF-8 解碼成 rune 切片（會配新記憶體）。
  - `string(b)` / `string(r)` —— 反向轉回字串。
- **`strings` 與 `strings.Builder`**：用 `strings.Contains/Split/ToUpper` 等做常見操作；要拼接大量字串請用 `strings.Builder`，效能遠優於用 `+` 串接。

## 範例

逐 byte vs 逐 rune 走訪：

```go
package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    s := "Hello, 世界!"

    fmt.Println("len in bytes:", len(s))                  // 14
    fmt.Println("rune count:  ", utf8.RuneCountInString(s)) // 10

    // 逐 byte 走訪（會把「世」拆成 3 個位元組）
    for i := 0; i < len(s); i++ {
        fmt.Printf("%d:%x ", i, s[i])
    }
    fmt.Println()

    // 逐 rune 走訪（正確）
    for i, r := range s {
        fmt.Printf("%d:%c ", i, r)
    }
    fmt.Println()
}
```

字串拼接 — `+` vs `strings.Builder`：

```go
import "strings"

// 1000 次小拼接：用 Builder 速度顯著快很多
var b strings.Builder
for i := 0; i < 1000; i++ {
    b.WriteString("x")
}
result := b.String()
```

## 常見錯誤

- ❌ **用 `len(s)` 算字元數**：`len("你好")` 是 6 不是 2（UTF-8 中每個字元佔 3 個位元組）。
- ❌ **用 `s[i]` 取單一中文字元**：取到的是位元組，組合起來不一定是合法的 UTF-8 字元。
- ❌ **大量字串拼接用 `+`**：每次 `+` 都會配置新字串、複製內容；長迴圈下會是 O(n²)。改用 `strings.Builder`。

## 最佳實踐

- ✅ **走訪含多語字串用 `for i, r := range s`**：自動處理 UTF-8 解碼。
- ✅ **需要修改字串就轉成 `[]rune` 或 `[]byte`**：在切片上改完再轉回字串。
- ✅ **多次拼接用 `strings.Builder`、知道長度上限的話呼叫 `b.Grow(n)`**：可進一步避免內部 reallocation。

## 任務

計算字串 `s` 包含的 rune 數量（不是位元組），並印出 `"rune count: 10"`。

提示：可用 `unicode/utf8` 套件的 `utf8.RuneCountInString(s)`。

## 延伸閱讀

- [The Go Blog: Strings, bytes, runes and characters in Go](https://go.dev/blog/strings) — BSD-3-Clause
- [Package strings — pkg.go.dev](https://pkg.go.dev/strings) — BSD-3-Clause
- [Package unicode/utf8 — pkg.go.dev](https://pkg.go.dev/unicode/utf8) — BSD-3-Clause
- [Go by Example: Strings and Runes](https://gobyexample.com/strings-and-runes) — CC BY 3.0
- [Go by Example: String Functions](https://gobyexample.com/string-functions) — CC BY 3.0
