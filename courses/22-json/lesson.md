# JSON 編碼與解碼

> `encoding/json` 套件用 `Marshal` 把 Go 值轉成 JSON、用 `Unmarshal` 把 JSON 解析回 Go 值；結構體欄位**必須匯出**才會被處理，可用 struct tag 控制對外名稱。

## 核心概念

- **`json.Marshal(v) ([]byte, error)`**：把任何可序列化的值編碼成 JSON 位元組切片；`MarshalIndent` 可額外格式化（人類可讀的縮排）。
- **`json.Unmarshal(data, &v) error`**：把 JSON 解析到 `v` 所指的位置；目標必須是「指標」否則無法寫入。
- **匯出欄位才會被處理**：`encoding/json` 透過反射存取欄位，**只能看到匯出（大寫開頭）的欄位**；小寫欄位永遠被忽略。
- **Struct tag 控制對外名稱**：欄位後加 `` `json:"snake_name"` `` 控制 JSON 鍵名；`,omitempty` 表示零值就省略不輸出；`-` 表示完全不處理該欄位。
- **未知 JSON 結構用 `map[string]any` 或 `json.RawMessage`**：不知道 schema 時可以先解到 map；若想保留原始 JSON 給後續處理用 `RawMessage`。

## 範例

Marshal：

```go
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
}

func main() {
    u := User{ID: 1, Name: "Alice"} // Email 留空 → 因為 omitempty 不會出現
    data, err := json.Marshal(u)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(data)) // {"id":1,"name":"Alice"}
}
```

Unmarshal：

```go
raw := []byte(`{"id":2,"name":"Bob","email":"bob@example.com"}`)

var u User
if err := json.Unmarshal(raw, &u); err != nil {
    panic(err)
}
fmt.Printf("%+v\n", u) // {ID:2 Name:Bob Email:bob@example.com}
```

## 常見錯誤

- ❌ **欄位忘了大寫**：`name string` 會被 JSON 套件忽略，無論編碼或解碼。
- ❌ **`Unmarshal` 傳值而非指標**：`json.Unmarshal(raw, u)` 沒效，必須 `&u`。
- ❌ **忽略 `error`**：JSON 解析失敗回傳 error；吞掉它會讓後續邏輯在零值上跑出怪結果。

## 最佳實踐

- ✅ **欄位永遠加 struct tag**：對外 API 通常用 `snake_case`，靠 tag 對應；同時保留 Go 內部 `CamelCase`。
- ✅ **數值欄位需要區分「0」與「未提供」時用 `*int`**：因為 `int` 的零值就是 0，無法區分；指標可以是 `nil`。
- ✅ **大量資料用 `json.NewDecoder` / `Encoder`**：直接吃 `io.Reader` / 寫入 `io.Writer`，不必先讀進記憶體再解析。

## 任務

把結構體 `u := User{ID: 1, Name: "Alice"}` 用 `json.Marshal` 編碼成 JSON 字串並印出；預期輸出包含 `{"id":1,"name":"Alice"}`。

## 延伸閱讀

- [The Go Blog: JSON and Go](https://go.dev/blog/json) — BSD-3-Clause
- [Package encoding/json — pkg.go.dev](https://pkg.go.dev/encoding/json) — BSD-3-Clause
- [Go by Example: JSON](https://gobyexample.com/json) — CC BY 3.0
