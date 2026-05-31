package main

import "fmt"

func removeProfanity(message *string) {
	// TODO: Modify the value at the pointer to be "clean message"
}

func main() {
	msg := "some bad words"
	removeProfanity(&msg)
	fmt.Println(msg)
}