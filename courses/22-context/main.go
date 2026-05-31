package main

import (
	"context"
	"fmt"
	"time"
)

func main() {
	// TODO: Create a context with a 50ms timeout
	// ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	// defer cancel()

	// TODO: Simulate work by waiting on <-ctx.Done()
	// select {
	// case <-time.After(100 * time.Millisecond):
	//     fmt.Println("Work finished")
	// case <-ctx.Done():
	//     fmt.Println("Work cancelled:", ctx.Err())
	// }
}