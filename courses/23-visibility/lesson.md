# 可見性 (Visibility)
與其他語言的 `public` 或 `private` 關鍵字不同，Go 是利用**變數或函式名稱的首字母大小寫**來決定其是否可以被其他套件存取。
- **大寫字母開頭**: 可被外部套件匯出與存取 (Exported / Public)。
- **小寫字母開頭**: 只能在同一個套件內存取 (Unexported / Private)。

## 任務：
定義一個可以被外部存取的 `User` 結構體，並包含公開的 `Name` 欄位與私有的 `password` 欄位。