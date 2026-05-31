# Select 語句
`select` 讓一個 goroutine 可以同時等待多個 channel 的通訊操作。它會阻塞直到其中一個 case 可以執行。如果多個 case 同時就緒，它會隨機挑選一個。

這在處理超時 (Timeout) 或是等待多個非同步任務時非常實用。

## 任務：
完成 `select` 區塊，等待接收 `ch1` 的訊息或是等待 1 秒的超時 (`time.After`)。