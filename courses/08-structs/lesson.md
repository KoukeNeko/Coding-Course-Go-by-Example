# 結構體 (Structs)

> Struct 是 Go 將一組具名欄位集合成一個型別的方式，用來表達「資料的形狀」，是 Go 物件導向風格的基礎。

## 核心概念

- **定義語法**：`type 名稱 struct { 欄位 型別 }`；欄位也可附帶 struct tag（如 `\`json:"name"\``）以供反射讀取。
- **三種初始化方式**：
  - 位置式 `User{1, "Alice", "alice@example.com"}` —— **必須列齊所有欄位**。
  - 欄位名稱式 `User{ID: 1, Name: "Alice"}` —— 可省略欄位（會取零值），**強烈推薦**。
  - 零值 `var u User` 或 `new(User)` —— 所有欄位皆為零值。
- **欄位存取一律用 `.`**：對指標也適用，Go 會自動解參考（`p.Name` 等同 `(*p).Name`）。
- **賦值是完整複製**：`a := b` 會複製整個 struct（含巢狀欄位），如果想共享狀態必須用指標 `*T`。
- **嵌入欄位（embedded fields）**：直接寫型別不寫欄位名，欄位名隱含為型別名；可達成「組合 > 繼承」效果，被嵌入型別的欄位與方法會被「升級（promote）」到外層。

## 範例

基本宣告與初始化：

```go
type User struct {
    ID    int
    Name  string
    Email string
}

func main() {
    alice := User{ID: 1, Name: "Alice", Email: "alice@example.com"}

    p := &alice           // 取址得到 *User
    p.Email = "new@x.com" // 直接用 . 存取，不用 (*p).Email

    var empty User        // 所有欄位為零值：{0 "" ""}
    _ = empty
}
```

嵌入結構體（composition）：

```go
type Animal struct {
    Name string
}

func (a Animal) Greet() string { return "Hi, I'm " + a.Name }

type Dog struct {
    Animal // 嵌入：Dog 自動擁有 Name 欄位與 Greet 方法
    Breed  string
}

func main() {
    d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
    fmt.Println(d.Name)    // 直接存取升級的欄位
    fmt.Println(d.Greet()) // 直接呼叫升級的方法
}
```

## 常見錯誤

- ❌ `User{1, "Alice"}` 想省略 Email —— 位置式初始化必須列齊；要省略請改用欄位名稱式。
- ❌ 以為 struct 賦值是參考傳遞 —— 實際上是值複製；要共享狀態請用 `*User`。
- ❌ struct 不能直接內含自己（會無限大），但可以用指標 `*T` 或 slice 包起來（如鏈結串列、樹）。

## 最佳實踐

- ✅ **初始化用欄位名稱**：可讀性高，未來新增欄位時不會破壞既有程式碼。
- ✅ **建構函式回傳指標**：Go 慣例 `func NewX(...) *X { return &X{...} }`，不需要先宣告再取址。
- ✅ **嵌入優於繼承**：當需要重用行為時，用 struct 嵌入（組合）而非試圖模擬類別繼承。

## 任務

定義一個 `messageToSend` 結構體，包含兩個欄位：
- `phoneNumber` (整數 `int`)
- `message` (字串 `string`)

並在 `main` 中初始化它。

## 延伸閱讀

- [Go Spec: Struct types](https://go.dev/ref/spec#Struct_types) — BSD-3-Clause
- [Effective Go: Composite literals](https://go.dev/doc/effective_go#composite_literals) — BSD-3-Clause
- [Effective Go: Embedding](https://go.dev/doc/effective_go#embedding) — BSD-3-Clause
- [Go by Example: Structs](https://gobyexample.com/structs) — CC BY 3.0
