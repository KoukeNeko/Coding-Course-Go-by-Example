export interface Chapter {
  id: string;
  title: string;
  description: string;
  initialCode: string;
}

export const chapters: Chapter[] = [
  {
    id: "hello-world",
    title: "1. 入門與 Hello World",
    description: `
# Welcome to Go Programming
在這堂課中，我們將學習 Go 語言的基本架構。每個可執行的 Go 程式都必須包含 \`package main\`，並且有一個 \`main\` 函式。

## 任務：
將原本印出 \`"Hello World"\` 的程式碼，修改為印出 \`"starting textio server"\`。
    `,
    initialCode: `package main

import "fmt"

func main() {
\tfmt.Println("Hello World")
}
`
  },
  {
    id: "variables",
    title: "2. 變數與基本型別",
    description: `
# 變數與基本型別
Go 是靜態強型別語言。常見型別包含 \`int\`, \`float64\`, \`bool\`, \`string\` 等。
我們可以使用 \`var\` 來宣告，或是使用 \`:=\` 短宣告語法（會自動推導型別）。

## 任務：修復帳單 Bug
目前的程式碼在計算總費用時出現了邏輯錯誤（使用了加號而不是乘號）。
請修復第 10 行的 Bug，讓計算結果正確。
    `,
    initialCode: `package main

import "fmt"

func main() {
\tcostPerMessage := 0.02
\tnumMessages := 4.0

\t// FIXME: The math here is wrong
\ttotalCost := costPerMessage + numMessages

\tfmt.Printf("Dora spent %.2f on text messages today\\n", totalCost)
}
`
  },
  {
    id: "constants",
    title: "3. 常數 (Constants)",
    description: `
# 常數
常數在編譯時期就決定了它的值，宣告後無法被修改，且必須使用 \`const\` 關鍵字（不能使用 \`:=\`）。

## 任務：計算秒數
請利用已知的 \`secondsInMinute\` 與 \`minutesInHour\`，計算並宣告 \`secondsInHour\` 常數。
    `,
    initialCode: `package main

import "fmt"

const secondsInMinute = 60
const minutesInHour = 60

func main() {
\t// TODO: Declare secondsInHour
\t// const secondsInHour = ???
\t
\t// fmt.Println("There are", secondsInHour, "seconds in an hour")
}
`
  },
  {
    id: "formatting",
    title: "4. 字串格式化",
    description: `
# 字串格式化
Go 的 \`fmt\` 套件提供了 \`Printf\` (印出) 與 \`Sprintf\` (回傳字串)。
常見的動詞包含：
- \`%v\` : 預設格式
- \`%s\` : 字串
- \`%d\` : 整數 (10進位)
- \`%.1f\` : 浮點數 (取到小數第一位)

## 任務：
使用 \`fmt.Sprintf\` 建立一段歡迎訊息，並將浮點數格式化為小數第一位。
    `,
    initialCode: `package main

import "fmt"

func main() {
\tname := "Saul Goodman"
\topenRate := 30.5

\t// TODO: Use fmt.Sprintf
\t// Expected output: "Hi Saul Goodman, your open rate is 30.5%"
\tmsg := ""
\t
\tfmt.Println(msg)
}
`
  },
  {
    id: "conditionals",
    title: "5. 條件控制",
    description: `
# 條件控制
Go 的 \`if\` 判斷式不需要括號。你也可以在 \`if\` 內加入一個簡短的初始化語句。

## 任務：
修改第 11 行的運算子。當 \`messageLen\` **小於或等於** \`maxLen\` 時，應該要印出 "Message sent"。
    `,
    initialCode: `package main

import "fmt"

func main() {
\tmessageLen := 10
\tmaxLen := 20

\tfmt.Printf("Trying to send a message of length %v, max length is %v\\n", messageLen, maxLen)

\t// FIXME: Fix the comparison operator
\tif messageLen > maxLen {
\t\tfmt.Println("Message sent")
\t} else {
\t\tfmt.Println("Message not sent")
\t}
}
`
  },
  {
    id: "functions",
    title: "6. 函式 (Functions)",
    description: `
# 函式
函式可以讓我們將程式碼拆解成獨立且容易理解的單元。
在 Go 中，參數的型別寫在參數名稱之後。

## 任務：字串合併
請修復 \`concat\` 函式的 Signature（加上輸入參數的型別 \`string\`，以及回傳的型別 \`string\`）。
    `,
    initialCode: `package main

import "fmt"

// FIXME: Add types to S1, S2 and the return value
func concat(s1, s2) {
\treturn s1 + s2
}

func main() {
\tfmt.Println(concat("Hello ", "World!"))
}
`
  }
];
