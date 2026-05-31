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

	// divide(10, 2) → quotient=5, remainder=0; we ignore quotient and print remainder.
	if !strings.Contains(output, "Remainder: 0") {
		t.Fatalf("Expected output to contain 'Remainder: 0', but got %q", output)
	}
}
