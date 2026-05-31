package main

import (
	"fmt"
	// TODO: import "unicode/utf8"
)

func main() {
	s := "Hello, 世界!"

	// TODO: Compute the number of runes in s and assign to runeCount.
	// Hint: len(s) gives the byte length, not the rune count.
	// Use utf8.RuneCountInString(s) from the "unicode/utf8" package.
	var runeCount int

	fmt.Printf("rune count: %d\n", runeCount)
}
