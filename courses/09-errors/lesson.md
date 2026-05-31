# 錯誤處理 (Errors)
Go 不使用 try-catch，而是將錯誤當作普通的值回傳。
內建的 `error` 是一個介面，最簡單的產生錯誤方式是使用 `errors.New()` 或 `fmt.Errorf()`.

## 任務：
實作一個除法函式 `divide`，當除數為 0 時，回傳一個明確的錯誤訊息 "cannot divide by zero"。