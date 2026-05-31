# Switch 語句

> Go 的 `switch` 預設「自動 break」，每個 `case` 執行完就跳出；同一個 `case` 可列多個值，也可以不帶條件當作整潔的 if-else 鏈。

## 核心概念

- **預設自動 break**：每個 `case` 跑完不會繼續往下執行下一個 case；如果真的想要 fallthrough，需要用 `fallthrough` 關鍵字（罕用）。
- **`case` 可列多個值**：`case 1, 2, 3:` 表示三個值任一相符就執行。
- **可帶初始化語句**：`switch x := compute(); x { ... }`，類似 `if` 的初始化。
- **無條件 switch**：`switch { case cond1: ... case cond2: ... }` 完全沒有運算式，等同 `switch true`；當條件複雜時比一串 `if-else if` 更整潔。
- **Type switch**：`switch v := i.(type) { case int: ... }` 用來分派介面的動態型別（詳見「型別斷言」章節）。

## 範例

基本 switch + 多值 case：

```go
package main

import "fmt"

func main() {
    day := 3
    switch day {
    case 1, 2, 3, 4, 5:
        fmt.Println("Weekday")
    case 6, 7:
        fmt.Println("Weekend")
    default:
        fmt.Println("Invalid day")
    }
}
```

無條件 switch（取代複雜 if-else 鏈）：

```go
score := 78
switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
case score >= 60:
    fmt.Println("Pass")
default:
    fmt.Println("Fail")
}
```

## 常見錯誤

- ❌ **以為要寫 `break`**：Go 的 case 不會自動 fallthrough，加 `break` 多此一舉（且讓 C 背景的人誤會）。
- ❌ **濫用 `fallthrough`**：絕大多數情境不需要；真的要用時，請加註解說明意圖。
- ❌ **case 順序依賴**：在無條件 switch 中 case 由上往下檢查，第一個相符就執行；忘了這點容易寫出永遠走不到的分支。

## 最佳實踐

- ✅ **複雜 if-else 鏈優先改寫成 switch**：可讀性更好、結構更整齊。
- ✅ **`case 1, 2, 3:` 取代多個 OR**：別寫 `case x == 1 || x == 2 || x == 3`，直接列舉。
- ✅ **type switch 處理介面分派**：比一連串 `if _, ok := i.(T); ok` 更清晰。

## 任務

完成 `dayName` 變數的賦值：使用 `switch` 語句把 `day = 3` 對應到 `"Wednesday"`（提示：`1 -> Monday`、`2 -> Tuesday`、`3 -> Wednesday`、`4 -> Thursday`、`5 -> Friday`、其他 `-> Weekend`）。

## 延伸閱讀

- [A Tour of Go: Switch](https://go.dev/tour/flowcontrol/9) — BSD-3-Clause
- [Effective Go: Switch](https://go.dev/doc/effective_go#switch) — BSD-3-Clause
- [Effective Go: Type switch](https://go.dev/doc/effective_go#type_switch) — BSD-3-Clause
- [Go Spec: Switch statements](https://go.dev/ref/spec#Switch_statements) — BSD-3-Clause
- [Go by Example: Switch](https://gobyexample.com/switch) — CC BY 3.0
