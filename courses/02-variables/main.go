package main

import "fmt"

func main() {
	costPerMessage := 0.02
	numMessages := 4.0

	// FIXME: The math here is wrong
	totalCost := costPerMessage + numMessages

	fmt.Printf("Dora spent %.2f on text messages today\n", totalCost)
}