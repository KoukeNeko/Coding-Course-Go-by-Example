# 併發與通道 (Concurrency & Channels)
Go 語言內建了輕量級執行緒 `goroutine`。
為了在多個 goroutine 之間安全地傳遞資料，我們使用 `channel`。
使用 `make(chan Type)` 建立通道，並使用 `<-` 符號收發資料。

## 任務：
在一個新的 goroutine 中將訊息 "Ping" 送入通道，並在主執行緒中接收它。