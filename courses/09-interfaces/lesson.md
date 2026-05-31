# 介面 (Interfaces)

> Interface 描述「能做什麼」的型別集合，任何實作介面所有方法的型別都自動滿足該介面，無需顯式宣告 —— 這就是 Go 的 duck typing。

## 核心概念

- **隱式實作（duck typing）**：型別只要實作介面所列的方法，就自動滿足該介面；不需要寫 `implements` 等關鍵字。
- **方法集（method set）決定滿足與否**：型別 `T` 的方法集只含 receiver 為 `T` 的方法；型別 `*T` 的方法集包含 receiver 為 `T` 或 `*T` 的所有方法。
- **空介面 `interface{}` 與 `any`**：空介面被所有型別滿足；Go 1.18 起 `any` 是 `interface{}` 的內建別名，新程式碼建議用 `any`。
- **介面組合**：介面可內嵌其他介面（例：`io.ReadWriter` 內嵌 `Reader` 與 `Writer`），其型別集合為交集。
- **型別斷言與 type switch**：用 `v, ok := x.(T)` 安全取出底層型別；用 `switch v := x.(type)` 處理多種可能型別（詳見「型別斷言」章節）。

## 範例

隱式實作（無 `implements` 關鍵字）：

```go
package main

import "fmt"

type Greeter interface {
    Greet() string
}

type English struct{}
func (English) Greet() string { return "Hello" }

type Chinese struct{}
func (Chinese) Greet() string { return "你好" }

func sayHi(g Greeter) {
    fmt.Println(g.Greet())
}

func main() {
    sayHi(English{}) // Hello
    sayHi(Chinese{}) // 你好
}
```

編譯期介面實作檢查（標準函式庫常見手法）：

```go
// 若 *fileLogger 沒實作完整 io.Writer，這行會編譯失敗
var _ io.Writer = (*fileLogger)(nil)
```

## 常見錯誤

- ❌ **指標與值方法集混淆**：若方法 receiver 是 `*T`，則 `T` 的值無法滿足介面，必須傳 `&T{}`。
- ❌ **「nil interface」陷阱**：把帶有具體型別但值為 `nil` 的指標包成 interface 後，`iface == nil` 仍為 `false`（因為 interface 含「型別 + 值」兩部分）。
- ❌ **過度設計大介面**：在使用端定義包含一堆方法的大介面，違反「小介面」慣例，難以實作也難以測試。

## 最佳實踐

- ✅ **「接受介面、回傳具體型別」(accept interfaces, return structs)**：函式參數用介面以提高彈性，回傳值用具體型別以避免限制呼叫端。
- ✅ **單一方法介面命名加 -er**：例如 `Reader`、`Writer`、`Stringer`、`Closer`，方法名與介面名搭配明確。
- ✅ **用 `var _ MyInterface = (*MyType)(nil)` 編譯期保證實作**：在 type 與 interface 距離很遠的專案中特別有用。

## 任務

定義一個 `expense` 介面，要求實作 `cost() float64` 方法。
然後為 `email` 結構體實作這個方法。

訂閱中 (`isSubscribed = true`) 時每字 0.01；否則每字 0.05。

## 延伸閱讀

- [Go Spec: Interface types](https://go.dev/ref/spec#Interface_types) — BSD-3-Clause
- [Effective Go: Interfaces](https://go.dev/doc/effective_go#interfaces) — BSD-3-Clause
- [Effective Go: Interface conversions and type assertions](https://go.dev/doc/effective_go#interface_conversions) — BSD-3-Clause
- [Go by Example: Interfaces](https://gobyexample.com/interfaces) — CC BY 3.0
