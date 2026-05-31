package main

import "fmt"

// TODO: Define expense interface

type email struct {
	isSubscribed bool
	body         string
}

// TODO: Implement cost() for email
// If subscribed, cost is 0.01 per character. Otherwise 0.05.

func main() {
	var e expense = email{isSubscribed: true, body: "Hello"}
	fmt.Println("Cost:", e.cost())
}