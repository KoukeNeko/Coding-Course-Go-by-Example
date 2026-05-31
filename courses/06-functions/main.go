package main

import "fmt"

// FIXME: Add types to s1, s2 and the return value
func concat(s1, s2) {
	return s1 + s2
}

func main() {
	fmt.Println(concat("Hello ", "World!"))
}