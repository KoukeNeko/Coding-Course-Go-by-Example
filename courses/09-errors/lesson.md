# 錯誤處理 (Errors)

> Go 把錯誤視為「值」，由內建的 `error` 介面回傳，呼叫端用 `if err != nil` 顯式檢查；Go 1.13 起新增了錯誤包裹（wrapping）與 `errors.Is`/`errors.As` 來檢視錯誤鏈。

## 核心概念

- **`error` 是內建介面**：`type error interface { Error() string }`。任何實作 `Error()` 方法的型別都是錯誤。
- **建立錯誤的三種方式**：
  - `errors.New("訊息")` —— 簡單字串。
  - `fmt.Errorf("格式 %s", x)` —— 格式化。
  - 自訂型別實作 `Error() string` —— 攜帶結構化資訊。
- **包裹錯誤 `%w`**：`fmt.Errorf("操作失敗: %w", err)` 會建立可被 `Unwrap()` 的錯誤鏈，保留原始錯誤資訊。
- **檢查錯誤的兩個工具**：
  - `errors.Is(err, target)` —— 比對「是否為某個特定錯誤值」（可穿透整個鏈）。
  - `errors.As(err, &target)` —— 比對「是否為某個型別」並取出該型別的指標。
- **錯誤即值的哲學**：Go 不使用 try/catch 例外，而要求每處呼叫顯式檢查；`panic` 僅用於不可恢復的程式錯誤（詳見「defer / panic / recover」章節）。

## 範例

建立、包裹與比對：

```go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("找不到項目") // sentinel error

func findUser(id int) (string, error) {
    if id <= 0 {
        return "", fmt.Errorf("findUser: 無效 id %d: %w", id, ErrNotFound)
    }
    return "Alice", nil
}

func main() {
    _, err := findUser(0)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("找不到，使用預設值")
    }
}
```

自訂錯誤型別 + `errors.As`：

```go
type ValidationError struct {
    Field string
    Msg   string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("驗證失敗: %s %s", e.Field, e.Msg)
}

func handle(err error) {
    var verr *ValidationError
    if errors.As(err, &verr) {
        fmt.Printf("欄位 %s 有問題\n", verr.Field) // 可拿到結構化資訊
        return
    }
    fmt.Println("未知錯誤:", err)
}
```

## 常見錯誤

- ❌ **忽略 err**：`result, _ := doSomething()` 把錯誤吞掉，會導致後續程式碼在無效資料上爆炸。
- ❌ **用 `==` 比對被包裹的錯誤**：`err == ErrNotFound` 對於被 `%w` 包過的錯誤回傳 false，應改用 `errors.Is`。
- ❌ **用 `panic` 取代錯誤回傳**：在函式庫中對可預期的失敗 `panic`，會迫使呼叫端用 `recover`，違反 Go 慣例。

## 最佳實踐

- ✅ **錯誤訊息小寫且不加標點**：例如 `"open file: permission denied"`，因為訊息常被另一段訊息串接。
- ✅ **包裹時加上脈絡**：用 `fmt.Errorf("動作: %w", err)` 累積呼叫鏈資訊，但只在「需要讓呼叫端能用 `errors.Is/As` 比對」時用 `%w`，純記錄用 `%v` 即可。
- ✅ **Sentinel 錯誤導出**：對於呼叫端需要程式化判斷的錯誤，導出為 `var ErrXxx = errors.New(...)`（如 `io.EOF`、`sql.ErrNoRows`）。

## 任務

實作一個除法函式 `divide`，當除數為 0 時，回傳一個明確的錯誤訊息 `"cannot divide by zero"`。

## 延伸閱讀

- [The Go Blog: Error handling and Go](https://go.dev/blog/error-handling-and-go) — BSD-3-Clause
- [The Go Blog: Working with Errors in Go 1.13](https://go.dev/blog/go1.13-errors) — BSD-3-Clause
- [Effective Go: Errors](https://go.dev/doc/effective_go#errors) — BSD-3-Clause
- [Go by Example: Errors](https://gobyexample.com/errors) — CC BY 3.0
- [Package errors — pkg.go.dev](https://pkg.go.dev/errors) — BSD-3-Clause
