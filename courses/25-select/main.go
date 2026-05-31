package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)

	go func() {
		time.Sleep(2 * time.Second)
		ch1 <- "result 1"
	}()

	// TODO: Use select to wait for ch1 or timeout after 1 second
	// select {
	// case res := <-ch1: ...
	// case <-time.After(1 * time.Second): ...
	// }
}