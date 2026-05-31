# 字串格式化 (fmt)

> `fmt` 套件提供 `Println`、`Printf`、`Sprintf` 三大常用函式；格式動詞（verb）以 `%` 開頭，控制每個值的呈現方式。

## 核心概念

- **`Println(a, b)`**：引數間自動以空格分隔並換行；不需要 format string。
- **`Printf(format, args...)`**：依格式字串輸出，不會自動換行（需自行加 `\n`）。
- **`Sprintf(format, args...)`**：與 `Printf` 同理但**不輸出**，把格式化結果回傳為 `string`。
- **常用 verb 對照表**：

  | Verb | 用途 | 範例輸出 |
  |------|------|---------|
  | `%v` / `%+v` / `%#v` | 預設格式 / 含欄位名 / Go 語法 | `{1 2}` / `{X:1 Y:2}` / `main.Point{X:1, Y:2}` |
  | `%T` | 值的型別 | `int`, `*main.User` |
  | `%d` / `%b` / `%o` / `%x` / `%X` | 十進位 / 二進位 / 八進位 / 16 進位 | `255` / `11111111` / `377` / `ff` / `FF` |
  | `%f` / `%.2f` / `%e` / `%g` | 浮點數 | `3.140000` / `3.14` / `3.14e+00` |
  | `%s` / `%q` | 字串 / 帶引號的字串 | `hello` / `"hello"` |
  | `%t` / `%c` / `%p` | 布林 / rune / 指標位址 | `true` / `A` / `0xc0000140b0` |
  | `%%` | 印出單一 `%` | `%` |

- **`Errorf` + `%w`**：`fmt.Errorf("op failed: %w", err)` 用 `%w` 包裹原始錯誤，後續可用 `errors.Is/As` 比對（詳見錯誤處理章節）。

## 範例

各種 verb 一次看：

```go
package main

import "fmt"

type Point struct {
    X, Y int
}

func main() {
    p := Point{1, 2}
    fmt.Println("hello", "world")    // hello world （自動加空格與換行）

    fmt.Printf("%v\n", p)             // {1 2}
    fmt.Printf("%+v\n", p)            // {X:1 Y:2}
    fmt.Printf("%#v\n", p)            // main.Point{X:1, Y:2}
    fmt.Printf("%T\n", p)             // main.Point

    fmt.Printf("%d in hex is %x\n", 255, 255) // 255 in hex is ff
    fmt.Printf("Pi is %.2f\n", 3.14159)        // Pi is 3.14
    fmt.Printf("%-10s|%10s|\n", "left", "right")
}
```

用 `Sprintf` 組字串：

```go
name := "Ada"
greeting := fmt.Sprintf("Hello, %s! You are user #%d.", name, 7)
fmt.Println(greeting)
```

## 常見錯誤

- ❌ 用 `Printf` 卻忘了寫 `\n`，下一行輸出黏在一起。
- ❌ verb 與引數型別不符（如對字串用 `%d`），會出現 `%!d(string=...)` 錯誤標記。
- ❌ 用 `+` 一段一段串字串組訊息（效能差又難讀），應改用 `Sprintf` 或 `strings.Builder`。

## 最佳實踐

- ✅ 想「印給人看」用 `%v` / `%+v`；想「印給程式讀」用 `%#v` 或 `%q`。
- ✅ 對外回傳的錯誤訊息使用 `fmt.Errorf("...: %w", err)`，保留錯誤鏈以利除錯。
- ✅ 浮點數呈現給使用者時務必指定精度（如 `%.2f`），避免一串小數位。

## 任務

使用 `fmt.Sprintf` 建立一段歡迎訊息，並將浮點數格式化為小數第一位。

預期輸出範例：`Hi Saul Goodman, your open rate is 30.5%`

## 延伸閱讀

- [Package fmt — pkg.go.dev](https://pkg.go.dev/fmt) — BSD-3-Clause
- [Effective Go: Printing](https://go.dev/doc/effective_go#printing) — BSD-3-Clause
- [The Go Blog: Error handling and Go](https://go.dev/blog/error-handling-and-go) — BSD-3-Clause
- [Go by Example: String Formatting](https://gobyexample.com/string-formatting) — CC BY 3.0
