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

	if !strings.Contains(output, "Hello") {
		t.Fatalf("Expected output to contain 'Hello', but got %q", output)
	}
	if !strings.Contains(output, "123456") {
		t.Fatalf("Expected output to contain '123456', but got %q", output)
	}
}
