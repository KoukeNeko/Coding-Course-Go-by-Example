# 迴圈 (Loops)

> Go 只有 `for` 這一種迴圈關鍵字，但它能變化出三種形式（C-style、while-style、infinite），再加上 `range` 即可走訪集合。

## 核心概念

- **C-style 三段式**：`for init; condition; post { ... }`，適合有明確計數的迴圈。
- **while-style**：省略 init 與 post，只留條件：`for condition { ... }`，Go 沒有 `while` 關鍵字。
- **無限迴圈**：`for { ... }`，搭配 `break`/`return` 跳出。
- **`range` 走訪**：適用於陣列、切片、字串、map、channel；對字串會自動以 UTF-8 解碼出 rune 與位元組起始位置。
- **`break` 與 `continue`**：可搭配標籤（label）跳出或繼續外層迴圈，例如 `break OuterLoop`。

## 範例

三種基本形式：

```go
package main

import "fmt"

func main() {
    // 1. C-style 三段式
    sum := 0
    for i := 0; i < 10; i++ {
        sum += i
    }
    fmt.Println(sum)

    // 2. while-style（只有條件）
    n := 1
    for n < 100 {
        n *= 2
    }
    fmt.Println(n)

    // 3. infinite + break
    count := 0
    for {
        count++
        if count == 3 {
            break
        }
    }
    fmt.Println(count)
}
```

`range` 走訪集合：

```go
nums := []int{10, 20, 30}
for index, value := range nums {
    fmt.Println(index, value)
}

// 只要 key（用 _ 忽略 value）
for key := range myMap {
    fmt.Println(key)
}

// 字串會解碼出 rune
for pos, r := range "你好" {
    fmt.Printf("位置 %d: %c\n", pos, r)
}
```

## 常見錯誤

- ❌ **range 的回傳值是副本**：`for _, v := range users { v.Name = "x" }` 不會改動原 slice，要用索引：`users[i].Name = "x"`。
- ❌ **for-range 變數重用陷阱（Go 1.22 前）**：在 goroutine 中捕捉 range 變數會抓到同一個位址；Go 1.22+ 每次迭代新變數，但跨版本要小心。
- ❌ **誤把分隔符寫成逗號**：`for i := 0, i < n; i++` 會編譯錯誤，必須是分號 `;`。

## 最佳實踐

- ✅ **走訪集合優先用 `range`**：比手動 `for i := 0; i < len(s); i++` 清晰且不易越界。
- ✅ **無限迴圈搭配明確跳出條件**：把 `break` / `return` 放在迴圈內顯眼處，避免邏輯難追。
- ✅ **巢狀迴圈用標籤跳出**：用 `break OuterLoop` 一次跳出多層，避免用 flag 變數模擬。

## 任務

寫一個迴圈，印出從 1 到 5 的數字。

## 延伸閱讀

- [Effective Go: For](https://go.dev/doc/effective_go#for) — BSD-3-Clause
- [Go Spec: For statements](https://go.dev/ref/spec#For_statements) — BSD-3-Clause
- [Go by Example: For](https://gobyexample.com/for) — CC BY 3.0
- [Go by Example: Range](https://gobyexample.com/range) — CC BY 3.0
