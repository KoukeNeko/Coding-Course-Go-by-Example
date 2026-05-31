# 空白識別符號 (`_`)

> `_` 是 Go 的「丟掉這個值」佔位符，可用在多回傳值中忽略不需要的值、迴圈中忽略 index/value、強制觸發 import 的 init 副作用，或在編譯期驗證型別實作了某介面。

## 核心概念

- **多回傳值中丟值**：Go 強制「宣告就要用」，但有時你只想要其中幾個回傳值；用 `_` 占位即可，例如 `_, err := os.Stat(path)`。
- **for-range 中忽略 index 或 value**：`for _, v := range slice` 忽略 index；`for k := range m` 自動忽略 value（也可寫 `for k, _ := range m`，但前者更慣用）。
- **`import _ "pkg"` 觸發 init 副作用**：純粹為了執行該套件的 `init()`（例如 SQL driver 註冊、`net/http/pprof` 註冊 handler），不直接用該套件的名稱。
- **`var _ Iface = (*T)(nil)` 編譯期介面檢查**：用來保證 `*T` 確實實作了 `Iface`；若沒實作則編譯失敗，比執行期斷言早一步發現問題。
- **`_ = something` 暫時抑制「未使用」錯誤**：開發 / debug 中用來壓抑 `"declared and not used"` 編譯錯誤，但**不要留在 production**。

## 範例

三種常見用法集合：

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/lib/pq" // 只為觸發 driver 註冊，不直接使用 pq
)

func loadUsers(db *sql.DB) error {
    rows, err := db.Query("SELECT id, name FROM users")
    if err != nil {
        return err
    }
    defer rows.Close()

    for rows.Next() {
        var id int64
        var name string
        if err := rows.Scan(&id, &name); err != nil {
            return err
        }
        _ = id // 範例中暫時不用 id，避免 "unused" 錯誤
        fmt.Println(name)
    }
    return rows.Err()
}
```

編譯期檢查 type 實作了 interface：

```go
import "io"

type fileLogger struct{ /* ... */ }

func (l *fileLogger) Write(p []byte) (int, error) {
    // ...
    return len(p), nil
}

// 若 *fileLogger 沒有完整實作 io.Writer，這行編譯就會失敗
var _ io.Writer = (*fileLogger)(nil)
```

## 常見錯誤

- ❌ **用 `_` 把 error 丟掉**：`v, _ := strconv.Atoi(s)` 忽略 error 是隱藏 bug 的最快方式；除非已用其他方式保證不會失敗，否則一定要處理。
- ❌ **以為 `import _ "pkg"` 跟 `import "pkg"` 一樣**：差別在前者不會在程式中用該套件名稱；適合「只想要 side effect」這種純註冊情境。
- ❌ **把 `_ = something` 留在正式版**：通常是 debug 時暫時壓制錯誤忘了刪；code review 時應該抓出來。

## 最佳實踐

- ✅ **error 一定處理，別用 `_` 跳過**：就算只是 `log` 也好；確定無錯誤可能時，寫註解說明為何忽略。
- ✅ **side-effect import 統一放一個區塊並加註解**：讓讀者一眼看出這是為了註冊而非真正使用。
- ✅ **想保證型別實作介面，寫一行 `var _ Iface = (*T)(nil)`**：這是 Go 社群通用的契約檢查手法，出現在很多標準函式庫源碼裡。

## 任務

呼叫 `divide(10, 2)`，它會回傳 `(商, 餘數)`。但我們只對餘數感興趣，請使用 `_` 忽略商數，並印出餘數。

## 延伸閱讀

- [Effective Go: The blank identifier](https://go.dev/doc/effective_go#blank) — BSD-3-Clause
- [Effective Go: Import for side effect](https://go.dev/doc/effective_go#blank_import) — BSD-3-Clause
- [Effective Go: Interface checks](https://go.dev/doc/effective_go#blank_implements) — BSD-3-Clause
- [Go Spec: Blank identifier](https://go.dev/ref/spec#Blank_identifier) — BSD-3-Clause
