# 映射表 (Maps)
Map 是一種 Key-Value 的資料結構。你可以使用 `make(map[KeyType]ValueType)` 來初始化它。
讀取時，可以同時接收第二個布林值來確認該 Key 是否存在。

## 任務：
創建一個 map 來儲存使用者的年齡 (字串對應整數)。
加入 "Alice" -> 25，並檢查 "Bob" 是否存在，若不存在請印出 "Bob not found"。