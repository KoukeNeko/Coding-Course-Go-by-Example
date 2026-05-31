package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var counter int64
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		// TODO: Add 1 to wg, then launch a goroutine that
		//   1. atomically increments counter by 1
		//   2. calls wg.Done when finished (use defer)
	}

	// TODO: Wait for all goroutines to finish

	fmt.Printf("counter: %d\n", atomic.LoadInt64(&counter))
}
