# 方法 (Methods)

> 方法就是「綁定到某個型別上的函式」，透過 receiver 與該型別關聯；Go 沒有 class，方法 + 結構 + 介面就構成物件導向風格。

## 核心概念

- **方法宣告語法**：`func (receiver Type) MethodName(...) ... { ... }`，receiver 寫在函式名之前。
- **Value receiver vs Pointer receiver**：
  - `func (p Point) Foo()` —— 拿到的是副本，改動不影響呼叫端。
  - `func (p *Point) Foo()` —— 拿到指標，可修改原值；也避免大型結構複製成本。
- **Method set 規則**：
  - 型別 `T` 的 method set 只含 receiver 為 `T` 的方法。
  - 型別 `*T` 的 method set 包含 receiver 為 `T` 與 `*T` 的所有方法。
  - 這直接影響「某個型別是否實作某 interface」。
- **Receiver 必須是「定義在同一個 package 的具名型別」**：不能對 `int` 直接定義方法，但可以 `type MyInt int` 後再定義。
- **語法糖**：對可定址的值呼叫 pointer receiver 方法時，Go 會自動取址（`b.Write` → `(&b).Write`）；對指標呼叫 value receiver 方法時，Go 自動解參考。

## 範例

值 receiver 與指標 receiver 的對比：

```go
package main

import (
    "fmt"
    "math"
)

type Point struct {
    X, Y float64
}

// Value receiver：只是讀，不會修改
func (p Point) Length() float64 {
    return math.Sqrt(p.X*p.X + p.Y*p.Y)
}

// Pointer receiver：要修改原物件
func (p *Point) Scale(factor float64) {
    p.X *= factor
    p.Y *= factor
}

func main() {
    p := Point{3, 4}
    fmt.Println(p.Length()) // 5

    p.Scale(2)              // 自動取址 → (&p).Scale(2)
    fmt.Println(p)          // {6 8}

    pp := &Point{1, 1}
    fmt.Println(pp.Length()) // 1.414...，自動解參考
}
```

## 常見錯誤

- ❌ **混用 value 與 pointer receiver**：同一型別的方法 receiver 風格不一致，會讓 method set 與 interface 實作判斷變得難懂；應全部統一。
- ❌ **對「結果是值的呼叫」用 pointer receiver**：例如 `getPoint().Scale(2)`，因為 `getPoint()` 的回傳值不可定址，無法自動取址，會編譯錯誤。
- ❌ **把含 mutex/atomic 欄位的結構用 value receiver**：會複製 mutex，互斥失效，必須用指標 receiver。

## 最佳實踐

- ✅ **預設用 pointer receiver**，除非該型別本質就是不可變的小值（如 `time.Time`、自訂的 `Vector3` 之類）。
- ✅ **同型別所有方法的 receiver 風格要一致**，這樣 method set 與實作的 interface 才容易推理。
- ✅ **方法只放「跟這個型別本質強相關」的邏輯**，工具型輔助函式留在 package level；避免把 method 當 namespace 用。

## 任務

為 `Rectangle` 結構體定義一個名為 `Area` 的方法，該方法回傳矩形的面積（長度乘以寬度）。

## 延伸閱讀

- [Go Spec: Method declarations](https://go.dev/ref/spec#Method_declarations) — BSD-3-Clause
- [Go Spec: Method sets](https://go.dev/ref/spec#Method_sets) — BSD-3-Clause
- [Effective Go: Methods / Pointers vs. Values](https://go.dev/doc/effective_go#methods) — BSD-3-Clause
- [Go FAQ: Should I define methods on values or pointers?](https://go.dev/doc/faq#methods_on_values_or_pointers) — BSD-3-Clause
- [Go by Example: Methods](https://gobyexample.com/methods) — CC BY 3.0
