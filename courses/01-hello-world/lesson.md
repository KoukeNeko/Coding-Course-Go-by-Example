# 入門與 Hello World

> 每個可執行的 Go 程式都必須屬於 `package main`，並擁有一個 `func main()` 作為進入點。

## 核心概念

- **`package` 宣告**：每個 Go 原始碼檔案的第一行必定是 `package` 宣告。可執行程式必須屬於 `package main`，函式庫則自訂套件名稱（如 `package utils`）。
- **`func main()`**：是程式的進入點，沒有參數、沒有回傳值；只有在 `package main` 中才有意義。
- **`import`**：用來引入標準函式庫或第三方套件，例如 `import "fmt"`。Go 編譯器嚴格要求：**匯入了卻沒用** 會直接編譯失敗。
- **`fmt.Println`**：屬於 `fmt`（format）套件，會將引數印出並自動加上換行；多個引數之間以空格分隔。
- **執行方式**：開發時用 `go run main.go` 直接執行；要部署成執行檔則用 `go build main.go` 編譯後再執行 `./main`。

## 範例

最小可執行的 Go 程式：

```go
package main

import "fmt"

func main() {
    fmt.Println("hello world")
}
```

當需要匯入多個套件時，慣例上使用「分組匯入（factored import）」：

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Println("Sqrt(2) =", math.Sqrt(2))
}
```

## 常見錯誤

- ❌ 寫成 `package Main` —— 套件名稱**區分大小寫**，必須全小寫的 `main`。
- ❌ `import "fmt"` 卻沒在程式裡使用 —— Go 會直接編譯失敗，這是刻意的設計（強迫程式整潔）。
- ❌ 把字串用單引號寫成 `'hello'` —— Go 的單引號代表 rune（單一 Unicode 字元），字串只能用雙引號 `"..."` 或反引號 `` `...` ``。

## 最佳實踐

- ✅ 多個 `import` 統一寫在 `import (...)` 區塊裡，而不是寫多個獨立的 `import` 行。
- ✅ 主程式檔案命名為 `main.go`，符合社群慣例。
- ✅ 字串字面值使用雙引號；如果需要包含換行或特殊字元，可改用反引號 `` ` ` `` 的原始字串。

## 任務

將原本印出 `"Hello World"` 的程式碼，修改為印出 `"starting textio server"`。

## 延伸閱讀

- [A Tour of Go: Welcome](https://go.dev/tour/welcome/1) — BSD-3-Clause
- [A Tour of Go: Packages](https://go.dev/tour/basics/1) — BSD-3-Clause
- [Effective Go: Names](https://go.dev/doc/effective_go#names) — BSD-3-Clause
- [Go by Example: Hello World](https://gobyexample.com/hello-world) — CC BY 3.0（Mark McGranaghan）
- [Go Spec: Program initialization and execution](https://go.dev/ref/spec#Program_initialization_and_execution) — BSD-3-Clause
