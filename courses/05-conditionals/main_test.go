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

	if !strings.Contains(output, "Message sent") {
		t.Fatalf("Expected output to contain 'Message sent', but got '%s'", output)
	}
	if strings.Contains(output, "Message not sent") {
		t.Fatalf("Expected output NOT to contain 'Message not sent', but got '%s'", output)
	}
}
