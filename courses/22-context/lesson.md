# Context 套件
在 Go 實務中，`context` 幾乎在每個 API 或資料庫呼叫中都會出現。它用來跨越多個 API 邊界傳遞**截止時間 (Deadlines)**、**取消訊號 (Cancel Signals)** 與**請求範圍的值 (Request-scoped Values)**。

## 任務：
使用 `context.WithTimeout` 建立一個超時為 50 毫秒的 Context，並利用 `<-ctx.Done()` 來捕捉超時訊號。