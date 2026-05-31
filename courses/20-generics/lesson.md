# 泛型 (Generics)

> 泛型讓你用「型別參數」寫一份可重用的函式或型別，編譯期保有完整型別安全，不必再用 `interface{}` + 型別斷言。Go 從 **1.18** 開始支援。

## 核心概念

- **型別參數語法**：`func F[T any](x T) T { ... }`、`type List[T any] struct { ... }`，方括號內宣告型別參數與其約束。
- **Type constraint（型別約束）**：約束本身是 interface，表示允許的型別集合。內建：`any`（= `interface{}`，任何型別）、`comparable`（支援 `==`、`!=`）。
- **Type set 與 `|`、`~`**：可在 interface 內用 `int | string | float64` 列舉、用 `~int` 表示「底層型別是 int 的所有型別」。
- **`constraints` 套件**：`golang.org/x/exp/constraints` 提供 `Ordered`、`Integer`、`Float`、`Signed`、`Unsigned`。Go 1.21+ `Ordered` 已內建為 `cmp.Ordered`。
- **Type inference（型別推導）**：呼叫泛型函式時通常可省略型別引數，編譯器從實參推導；推導失敗時才需手動寫 `F[int](...)`。

## 範例

簡單的泛型函式：

```go
package main

import "fmt"

func printSlice[T any](s []T) {
    for _, v := range s {
        fmt.Println(v)
    }
}

func main() {
    printSlice([]int{1, 2, 3})
    printSlice([]string{"A", "B", "C"})
}
```

帶約束的泛型函式 + 泛型容器：

```go
import "golang.org/x/exp/constraints"

// 約束為「可排序」的型別
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(v T)    { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
    var zero T
    if len(s.items) == 0 {
        return zero, false
    }
    last := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return last, true
}

func main() {
    fmt.Println(Min(3, 7))     // 3，自動推導 T = int
    fmt.Println(Min("a", "b")) // a

    stack := &Stack[string]{}
    stack.Push("hello")
    stack.Push("world")
    fmt.Println(stack.Pop()) // world true
}
```

## 常見錯誤

- ❌ **濫用泛型**：只在「同一份邏輯要套用在多種不相關型別」時才用；單一型別的場合直接寫具體型別更清楚。
- ❌ **約束選錯**：想用 `<` 卻只用 `any`；改用 `constraints.Ordered` 或自訂 `interface { ~int | ~float64 }`。
- ❌ **誤以為 `comparable` 包含 slice/map**：slice、map、function 都不是 strictly comparable，無法滿足 `comparable`。

## 最佳實踐

- ✅ **先寫具體型別，反覆出現才抽成泛型**：和 DRY 原則一樣，但「兩三次重複」不一定要立刻泛型化。
- ✅ **盡量使用約束 + type set 而不是 `any`**：可以呼叫更多運算子、編譯期錯誤更清楚。
- ✅ **方法不能有額外型別參數**：泛型只在函式與型別宣告層級；方法只能用 receiver 既有的型別參數。

## 任務

實作一個泛型函式 `printSlice`，它能夠接收並印出任何型別的切片。

## 延伸閱讀

- [The Go Blog: An Introduction To Generics](https://go.dev/blog/intro-generics) — BSD-3-Clause
- [Go Spec: Type parameters](https://go.dev/ref/spec#Type_parameters) — BSD-3-Clause
- [golang.org/x/exp/constraints](https://pkg.go.dev/golang.org/x/exp/constraints) — BSD-3-Clause
- [Tutorial: Getting started with generics](https://go.dev/doc/tutorial/generics) — BSD-3-Clause
- [Go by Example: Generics](https://gobyexample.com/generics) — CC BY 3.0
