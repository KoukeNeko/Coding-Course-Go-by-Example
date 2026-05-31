package main

import "fmt"

func mathOperation(a int, b int, op func(int, int) int) int {
	return op(a, b)
}

func main() {
	add := func(x, y int) int { return x + y }
	// TODO: Call mathOperation with 5, 3 and the add function
	
}