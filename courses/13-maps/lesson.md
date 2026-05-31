# 映射表 (Maps)

> Map 是 Go 內建的雜湊表（hash map），用 `make(map[K]V)` 建立；它是參考型別，且走訪順序「不保證」、每次可能不同。

## 核心概念

- **建立方式**：`m := make(map[string]int)`、字面值 `m := map[string]int{"a": 1}`，或附容量提示 `make(map[string]int, 100)`。
- **`comma, ok` 判斷鍵存在**：`v, ok := m[k]`；若 `k` 不存在，`v` 為 value 型別的零值、`ok` 為 `false`。**必須用這個寫法區分「值是零值」與「不存在」。**
- **`delete(m, k)`**：移除鍵；即使 `k` 不存在也不會 panic。Go 1.21+ 還有 `clear(m)` 一次清空所有元素。
- **走訪無序**：`for k, v := range m` 每次執行順序可能不同，這是 Go 故意的（避免程式依賴特定順序）。
- **`nil` map 可讀不可寫**：`var m map[string]int` 是 `nil`，讀 `m["x"]` 回傳零值，但寫 `m["x"] = 1` 會 **panic**，必須先 `make` 才能寫入。

## 範例

建立、寫入、讀取、刪除：

```go
package main

import "fmt"

func main() {
    counts := make(map[string]int)
    counts["apple"]++ // 利用零值：apple 變成 1
    counts["apple"]++ // 2

    // comma, ok 寫法
    if v, ok := counts["banana"]; ok {
        fmt.Println("有 banana:", v)
    } else {
        fmt.Println("沒有 banana") // 走這條
    }

    delete(counts, "apple")
}
```

需要穩定順序就先取出 keys 排序：

```go
import "sort"

m := map[string]int{"a": 1, "b": 2, "c": 3}

keys := make([]string, 0, len(m))
for k := range m {
    keys = append(keys, k)
}
sort.Strings(keys)
for _, k := range keys {
    fmt.Println(k, m[k])
}
```

## 常見錯誤

- ❌ **寫入 nil map**：`var m map[string]int; m["a"] = 1` 會 panic，必須先 `m = make(map[string]int)`。
- ❌ **誤把零值當「不存在」**：`if m["count"] == 0` 無法區分「鍵不存在」與「鍵存在但值為 0」，必須用 `v, ok := m[k]`。
- ❌ **依賴 range 順序**：寫測試或業務邏輯時假設順序固定，會在不同 Go 版本或執行間出現詭異 bug。

## 最佳實踐

- ✅ **需要穩定順序就排序 keys**：先把 key 蒐集到 slice、排序後再走訪。
- ✅ **預估容量用 hint**：`make(map[string]int, 1000)` 可減少 rehash 成本。
- ✅ **map 非並行安全**：多 goroutine 同時讀寫會 race；要嘛用 `sync.RWMutex` 保護，要嘛用 `sync.Map`（適合讀多寫少場景）。

## 任務

創建一個 map 來儲存使用者的年齡（字串對應整數）。

加入 `"Alice" -> 25`，並檢查 `"Bob"` 是否存在；若不存在請印出 `"Bob not found"`。

## 延伸閱讀

- [Effective Go: Maps](https://go.dev/doc/effective_go#maps) — BSD-3-Clause
- [Go Spec: Map types](https://go.dev/ref/spec#Map_types) — BSD-3-Clause
- [Go by Example: Maps](https://gobyexample.com/maps) — CC BY 3.0
- [Package sync — sync.Map](https://pkg.go.dev/sync#Map) — BSD-3-Clause
