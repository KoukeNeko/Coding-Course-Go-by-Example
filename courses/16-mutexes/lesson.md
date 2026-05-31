# 互斥鎖 (Mutexes)
當多個 Goroutine 需要同時讀寫同一個變數時，會發生資料競爭 (Data Race)。
此時我們可以使用 `sync.Mutex` 提供的 `Lock()` 和 `Unlock()` 來保護臨界區段 (Critical Section)。

## 任務：
補全下面程式碼中的 `Lock()` 與 `Unlock()`，保護 `counter` 變數的安全寫入。