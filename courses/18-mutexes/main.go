package main

import (
	"fmt"
	"sync"
	"time"
)

type SafeCounter struct {
	mu sync.Mutex
	counter int
}

func (c *SafeCounter) Increment() {
	// TODO: Lock the mutex before incrementing and Unlock it after
	c.counter++
}

func main() {
	c := &SafeCounter{}
	for i := 0; i < 1000; i++ {
		go c.Increment()
	}
	time.Sleep(100 * time.Millisecond)
	fmt.Println("Counter:", c.counter)
}