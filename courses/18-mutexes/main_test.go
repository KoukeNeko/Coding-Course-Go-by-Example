package main

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"
)

func TestOutput(t *testing.T) {
	oldStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	main()

	w.Close()
	os.Stdout = oldStdout

	var buf bytes.Buffer
	io.Copy(&buf, r)
	output := buf.String()

	// With proper Lock/Unlock, all 1000 increments must complete and yield 1000.
	if !strings.Contains(output, "Counter: 1000") {
		t.Fatalf("Expected output to contain 'Counter: 1000', but got %q", output)
	}
}
