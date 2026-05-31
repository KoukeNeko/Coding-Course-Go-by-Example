# 進階函式（First-class、閉包、高階函式）

> Go 的函式是「一等公民」(first-class)：可以指派給變數、當作參數傳遞、當作回傳值，也可以擷取外部變數形成閉包。

## 核心概念

- **函式型別**：`func(int) int` 本身就是個型別；未初始化的函式變數其值為 `nil`，呼叫 nil 函式會 panic。
- **函式作為值**：可指派給變數，也能傳入或回傳給其他函式（高階函式），常用於 callback、策略模式、迭代器。
- **匿名函式**：`func(...) ... { ... }` 直接寫一個沒有名字的函式，可立即呼叫或存起來。
- **閉包（closure）**：匿名函式會「擷取」外圍函式的變數，這些變數的生命週期會被閉包延長（逃逸到 heap）。多個閉包**共享**同一份外部變數。
- **變長參數 `...T`**：函式簽名最後一個參數加上 `...`，呼叫端可傳 0 到多個對應型別的引數；函式內取得的是 `[]T`。呼叫時若已有 slice，可用 `slice...` 展開傳入。

## 範例

高階函式 + 閉包累加器：

```go
package main

import "fmt"

// 回傳一個閉包；sum 被閉包擷取並在多次呼叫間累積
func makeAdder() func(int) int {
    sum := 0
    return func(value int) int {
        sum += value
        return sum
    }
}

func main() {
    add := makeAdder()
    fmt.Println(add(3)) // 3
    fmt.Println(add(5)) // 8（sum 被閉包記住了）
    fmt.Println(add(2)) // 10
}
```

變長參數：

```go
func sumAll(numbers ...int) int {
    total := 0
    for _, number := range numbers {
        total += number
    }
    return total
}

func main() {
    fmt.Println(sumAll(1, 2, 3))     // 6
    nums := []int{10, 20, 30}
    fmt.Println(sumAll(nums...))     // 60，用 ... 展開 slice
}
```

## 常見錯誤

- ❌ **for 迴圈中的閉包擷取迴圈變數**：在 Go 1.22 以前所有 goroutine/閉包會共享同一個 `i`；解法是在迴圈內 `i := i` 重新宣告，或把 `i` 當參數傳入閉包。Go 1.22+ 已改為每次迭代新變數，但跨版本相容仍需注意。
- ❌ **呼叫 nil 函式變數**：造成 panic；先檢查 `if fn != nil`。
- ❌ **誤把變長參數當固定切片**：`func f(xs ...int)` 與 `func f(xs []int)` 呼叫方式不同，混用會編譯錯誤。

## 最佳實踐

- ✅ 把短小的策略邏輯包成函式值傳入（例如 `sort.Slice(s, func(i, j int) bool { ... })`），避免為了一行邏輯定義整個型別。
- ✅ 閉包很方便但會延長變數生命週期；長期執行的服務裡，避免閉包意外抓住大型物件造成 memory leak。
- ✅ 變長參數只在語意上「自然零到多個」時使用（如 `fmt.Println`），不要為了少打一個 `[]int{}` 就濫用。

## 任務

呼叫 `mathOperation`，傳入 `5`、`3`、以及定義好的 `add` 函式；印出結果（預期：`8`）。

## 延伸閱讀

- [Go Spec: Function types / Function literals](https://go.dev/ref/spec#Function_types) — BSD-3-Clause
- [Effective Go: Functions](https://go.dev/doc/effective_go#functions) — BSD-3-Clause
- [Go by Example: Closures](https://gobyexample.com/closures) — CC BY 3.0
- [Go by Example: Variadic Functions](https://gobyexample.com/variadic-functions) — CC BY 3.0
