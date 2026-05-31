package main

import "fmt"

func main() {
	messageLen := 10
	maxLen := 20

	fmt.Printf("Trying to send a message of length %v, max length is %v\n", messageLen, maxLen)

	// FIXME: Fix the comparison operator
	if messageLen > maxLen {
		fmt.Println("Message sent")
	} else {
		fmt.Println("Message not sent")
	}
}