package main

import (
	"errors"
	"fmt"
)

// TODO: Implement divide(a, b float64) (float64, error)

func main() {
	result, err := divide(10, 0)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("Result:", result)
}