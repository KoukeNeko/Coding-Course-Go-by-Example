# 可見性 (Visibility / 匯出規則)

> Go 用「識別符的第一個字母大小寫」決定可見性：大寫即匯出（public，套件外可見）、小寫即套件私有（unexported）；這條規則套用在變數、函式、型別、欄位與方法上。

## 核心概念

- **單一規則：首字母大寫 = 匯出**：依 Go 規格，識別符需 (1) 首字母是 Unicode 大寫字母（Lu 類別）、(2) 宣告於 package block 或為欄位／方法名，才算匯出；其他一律為套件私有。
- **適用範圍**：`var Foo`、`func Bar`、`type Baz struct{}`、struct 內的欄位、interface 上的方法，規則皆一致。
- **struct 欄位的可見性影響 JSON/反射等套件**：`encoding/json` 只會處理**匯出**欄位，小寫欄位永遠不會被序列化或反序列化 —— 這是常踩的雷。
- **getter / setter 約定**：Go **不用** `GetXxx` 前綴，直接用名詞 `Xxx()`（對應私有欄位 `xxx`）；setter 才用 `SetXxx`。讓呼叫端讀起來像 `obj.Owner()` 而不是 `obj.GetOwner()`。
- **介面命名慣例**：單一方法 interface 通常以「方法名 + -er」命名（`Reader`、`Writer`、`Closer`），是 Go 風格的一部分。

## 範例

封裝過的 User：

```go
package account

import (
    "errors"
)

type User struct {
    ID       int64  // 匯出：套件外可讀寫
    Name     string // 匯出
    password string // 私有：外部無法直接看到或設定
}

// Password 是封裝過的 getter（不要叫 GetPassword）
func (u *User) Password() string {
    return u.password
}

// SetPassword 是封裝過的 setter，可在這裡做驗證
func (u *User) SetPassword(plain string) error {
    if len(plain) < 8 {
        return errors.New("password too short")
    }
    u.password = hash(plain)
    return nil
}

func hash(s string) string { return "***" }
```

JSON 編碼時小寫欄位被忽略：

```go
type Order struct {
    ID    string  `json:"id"`    // 會被序列化
    Total float64 `json:"total"` // 會被序列化
    note  string  // 不會出現在 JSON，因為 unexported
}
```

## 常見錯誤

- ❌ **以為 `Foo` 在所有檔案內都可見就叫匯出**：其實同 package 內不論大小寫都能互相看到；匯出與否只有「跨 package」才有差別。
- ❌ **`json.Unmarshal` 寫不進去**：目標 struct 的欄位是小寫，反序列化後值仍是零值，因為 json 套件碰不到 unexported 欄位。
- ❌ **匯出了大量內部細節**：把實作細節欄位寫成大寫，讓使用者依賴內部結構，日後重構就是 breaking change。

## 最佳實踐

- ✅ **預設先寫小寫，有需要外部用再升級成大寫**：符合「最小公開介面」原則，後續重構不會傷到呼叫端。
- ✅ **getter 命名不要加 `Get`**：用名詞；若需要 setter 才用 `SetXxx`。
- ✅ **需要被 `json` / `xml` 等套件處理的欄位記得匯出**，並用 struct tag 控制對外名稱。

## 任務

定義一個可以被外部存取的 `User` 結構體，並包含公開的 `Name` 欄位與私有的 `password` 欄位。

## 延伸閱讀

- [Effective Go: Names](https://go.dev/doc/effective_go#names) — BSD-3-Clause
- [Effective Go: Getters](https://go.dev/doc/effective_go#Getters) — BSD-3-Clause
- [Go Spec: Exported identifiers](https://go.dev/ref/spec#Exported_identifiers) — BSD-3-Clause
- [Go by Example: Structs](https://gobyexample.com/structs) — CC BY 3.0
