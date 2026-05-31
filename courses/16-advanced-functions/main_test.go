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

	// mathOperation(5, 3, add) returns 8
	if !strings.Contains(output, "8") {
		t.Fatalf("Expected output to contain '8' (result of add(5, 3)), but got %q", output)
	}
}
