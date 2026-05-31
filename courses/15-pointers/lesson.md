# 指標 (Pointers)

> 指標是一個儲存「變數記憶體位址」的值，讓你可以在不複製整個資料的情況下，間接讀寫該變數。

## 核心概念

- **取址 `&`**：對變數使用 `&x`，會得到 `*T` 型別的指標（`T` 是 `x` 的型別）。
- **解參考 `*`**：對指標使用 `*p`，會取出指標指向的值；也可以對 `*p` 賦值來修改原變數。
- **`nil` 是零值**：未初始化的指標其值為 `nil`，對 `nil` 指標解參考會在執行時 panic。
- **值傳遞 vs 指標傳遞**：Go 的函式參數預設是**值傳遞**（傳副本）；要讓被呼叫函式修改呼叫端變數，就必須傳指標。
- **何時用指標**：(1) 需要修改參數、(2) 結構很大、想避免複製成本、(3) 結構內含 `sync.Mutex` 等不可複製欄位。簡單的基本型別、小結構、字串、介面值通常直接傳值即可。

## 範例

值傳遞 vs 指標傳遞：

```go
package main

import "fmt"

// 傳值：函式拿到的是副本，外面看不到變化
func zeroValue(value int) {
    value = 0
}

// 傳指標：函式可以直接改原變數
func zeroPointer(pointer *int) {
    *pointer = 0
}

func main() {
    number := 42
    zeroValue(number)
    fmt.Println("after zeroValue:", number) // 42

    zeroPointer(&number)
    fmt.Println("after zeroPointer:", number) // 0

    var nilPtr *int
    fmt.Println("nilPtr is nil:", nilPtr == nil) // true
    // *nilPtr = 1 // 會 panic: nil pointer dereference
}
```

## 常見錯誤

- ❌ **解參考 `nil` 指標**：造成執行時 panic；存取之前先檢查 `if p != nil`。
- ❌ **以為「回傳指向區域變數的指標」會 dangling**：在 Go 是**合法的**，編譯器會做逃逸分析自動配置到 heap（這與 C 不同）。
- ❌ **複製含 `sync.Mutex` 的結構**：必須使用指標 receiver / 指標傳遞，否則 mutex 內部狀態會錯亂。

## 最佳實踐

- ✅ **不確定時用指標 receiver**，但同一個型別的所有方法 receiver 風格要一致。
- ✅ **小型不可變值（int、string、time.Time）用值傳遞**；大型結構或要修改的對象用指標。
- ✅ 不要把 `*string`、`*int` 當作「可選參數」用；更乾淨的做法是用 zero value、選項函式或多回傳值。

## 任務

完成 `removeProfanity` 函式，它接收一個字串指標，並將該字串直接修改為 `"clean message"`。

## 延伸閱讀

- [Go Spec: Address operators / Pointer types](https://go.dev/ref/spec#Address_operators) — BSD-3-Clause
- [A Tour of Go: Pointers](https://go.dev/tour/moretypes/1) — BSD-3-Clause
- [Effective Go: Pointers vs. Values](https://go.dev/doc/effective_go#pointers_vs_values) — BSD-3-Clause
- [Go by Example: Pointers](https://gobyexample.com/pointers) — CC BY 3.0
