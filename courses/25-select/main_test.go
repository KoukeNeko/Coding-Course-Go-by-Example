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

	// The goroutine sleeps 2s; the 1s timeout in select must fire first.
	if !strings.Contains(output, "Timeout") {
		t.Fatalf("Expected output to contain 'Timeout' (the timeout case must fire first), but got %q", output)
	}
}
