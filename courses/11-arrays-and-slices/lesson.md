# 陣列與切片 (Arrays & Slices)

> Array 是固定長度的「值型別」（長度是型別的一部分），Slice 是可動態擴展的「視窗」（pointer + length + capacity），背後仍指向某個底層陣列。99% 的 Go 程式只用 slice。

## 核心概念

- **陣列 vs 切片**：`[5]int` 與 `[6]int` 是不同型別，且賦值是完整複製；`[]int` 沒有長度，是輕量描述符。
- **`make([]T, len, cap)`**：建立 slice 並指定長度與（可選）容量；不指定 cap 則 cap = len。
- **`append`**：當 `len` 超過 `cap` 時會配置新的底層陣列（容量通常翻倍），舊 slice 不受影響；切記要把回傳值賦回去：`s = append(s, x)`。
- **底層陣列共享**：`b := a[1:4]` 不複製資料，修改 `b` 會影響 `a`；對大檔案 slice 一小段會讓整個底層陣列無法被 GC。
- **三索引切片 `a[low:high:max]`**：明確限制新 slice 的 cap，防止 append 意外覆蓋到原陣列後方的資料。

## 範例

陣列 vs 切片基本操作：

```go
// 陣列：長度固定，是值型別
var arr [3]int = [3]int{1, 2, 3}

// 切片：用字面值或 make
sli := []int{1, 2, 3}
s := make([]int, 0, 4) // len=0, cap=4
s = append(s, 1, 2, 3) // len=3, cap=4
fmt.Println(len(s), cap(s)) // 3 4
```

底層陣列共享問題與三索引切片解法：

```go
data := []int{1, 2, 3, 4, 5}
sub := data[1:3]      // [2 3]，與 data 共享底層陣列
sub[0] = 99
fmt.Println(data)     // [1 99 3 4 5]  ← 被改了！

// 用三索引切片把 cap 限制住，append 必觸發複製
safe := data[1:3:3]    // len=2, cap=2
safe = append(safe, 0) // 觸發新底層陣列，不影響 data
fmt.Println(data)      // [1 99 3 4 5]  ← 不變
```

## 常見錯誤

- ❌ **忘記接 append 回傳值**：`append(s, 1)` 不會修改 `s`，必須 `s = append(s, 1)`。
- ❌ **以為 slice 傳入函式是傳值**：slice header 是傳值，但底層陣列共享，函式內改元素會反映到呼叫端。
- ❌ **小段子切片造成記憶體泄漏**：從 1GB 的 buffer 切 100 bytes 回傳，會卡住整個 1GB 不被回收；應 `copy` 到新 slice 後回傳。

## 最佳實踐

- ✅ **預估大小用 `make` 加 cap**：減少 append 時的重新配置與資料搬移成本。
- ✅ **回傳前 `copy` 避免泄漏**：若 slice 來源是大 buffer 而你只要小段，用 `c := make([]T, len(b)); copy(c, b)` 切斷對底層陣列的參考。
- ✅ **nil slice 完全可用**：`var s []int` 的 `s` 是 nil，但 `len(s)`、`append(s, ...)`、`range s` 都正常運作，不必先 `make`。

## 任務

宣告一個字串切片 `messages`，並使用 `append` 加上兩個字串 `"Hello"` 與 `"World"`，然後印出結果。

## 延伸閱讀

- [The Go Blog: Go Slices — usage and internals](https://go.dev/blog/slices-intro) — BSD-3-Clause
- [Effective Go: Slices](https://go.dev/doc/effective_go#slices) — BSD-3-Clause
- [Effective Go: Arrays](https://go.dev/doc/effective_go#arrays) — BSD-3-Clause
- [Go by Example: Slices](https://gobyexample.com/slices) — CC BY 3.0
- [Go by Example: Arrays](https://gobyexample.com/arrays) — CC BY 3.0
