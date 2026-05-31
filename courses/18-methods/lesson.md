# 方法 (Methods)
Go 語言沒有 class 關鍵字，但你可以在結構體 (Struct) 上定義「方法」。
方法的宣告方式，是在 `func` 與方法名稱之間，加上一個接收者 (Receiver)。

## 任務：
為 `Rectangle` 結構體定義一個名為 `Area` 的方法，該方法回傳矩形的面積 (長度乘以寬度)。