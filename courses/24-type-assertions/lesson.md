# 空介面與型別斷言 (Type Assertions)

> 型別斷言 `i.(T)` 用來從介面值取回底層的具體型別；單值形式失敗會 panic，雙值形式 `v, ok := i.(T)` 則用 `ok` 安全告知是否成功。

## 核心概念

- **基本語法 `i.(T)`**：在介面值 `i` 上斷言「動態型別是不是 `T`」；若是，結果就是該 `T` 的具體值；若不是，**直接 panic**。
- **安全的 comma-ok 形式 `v, ok := i.(T)`**：失敗不會 panic —— `v` 為 `T` 的零值、`ok` 為 `false`。判型先安全檢查，是 idiomatic Go。
- **可斷言到介面型別**：`T` 不必是具體型別；斷言到另一個介面 `T` 代表「檢查 `i` 的動態型別是否實作了 `T`」，常用於檢查 `error` 是否實作 `net.Error`、`fmt.Stringer` 等。
- **type switch (`switch v := i.(type)`)**：需要對多種型別做不同處理時，用 type switch 比一連串斷言更清楚；每個 `case` 內的 `v` 已是該 `case` 對應的型別。
- **`nil` 介面斷言一定失敗**：對動態值為 `nil` 的介面做斷言，雙值形式回傳 `ok=false`，單值形式 panic。

## 範例

安全形式 + type switch：

```go
package main

import "fmt"

func describe(value any) string {
    switch v := value.(type) {
    case nil:
        return "nil"
    case string:
        return fmt.Sprintf("string of length %d", len(v))
    case int, int64:
        return fmt.Sprintf("integer %d", v)
    default:
        return fmt.Sprintf("unknown type %T", v)
    }
}

func main() {
    fmt.Println(describe("hello"))
    fmt.Println(describe(42))
    fmt.Println(describe(3.14))
}
```

斷言到介面以檢查能力（capability check）：

```go
import (
    "errors"
    "io"
)

func writeIfPossible(target any, payload []byte) error {
    writer, ok := target.(io.Writer)
    if !ok {
        return errors.New("target does not support writing")
    }
    _, err := writer.Write(payload)
    return err
}
```

## 常見錯誤

- ❌ **用單值形式對未知型別做斷言**：`v := i.(MyType)`，一旦型別不符就直接 panic；production 程式碼幾乎都應改用 comma-ok。
- ❌ **混淆型別轉換與型別斷言**：`int(x)` 是 conversion（編譯期）；`i.(int)` 是 assertion（執行期且只能用在介面上）。
- ❌ **在 type switch 的 `default` case 內以為 `v` 是 `T`**：在 `default` 裡 `v` 仍是原本的介面型別，不是任何具體型別。

## 最佳實踐

- ✅ **預設用雙值 comma-ok 形式**，只有真的「型別保證一定對」（例如剛從一個只放某種型別的容器拿出來）才用單值。
- ✅ **多型別分支用 type switch、單一型別檢查用斷言**：程式可讀性最佳。
- ✅ **錯誤型別檢查優先考慮 `errors.As`**：它是處理 wrapped error 的標準做法，效果類似型別斷言但能穿透 `fmt.Errorf("%w", ...)` 的包裝。

## 任務

嘗試將空介面變數 `i` 斷言為 `string` 型別，斷言成功時印出該字串（預期輸出：`hello`）；斷言失敗時印出 `"Not a string"`。

## 延伸閱讀

- [Go Spec: Type assertions](https://go.dev/ref/spec#Type_assertions) — BSD-3-Clause
- [Effective Go: Interface conversions and type assertions](https://go.dev/doc/effective_go#interface_conversions) — BSD-3-Clause
- [The Go Blog: Error handling and Go](https://go.dev/blog/error-handling-and-go) — BSD-3-Clause
- [Go by Example: Type Switches](https://gobyexample.com/type-switches) — CC BY 3.0
