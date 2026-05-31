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

	// 50ms timeout fires before the 100ms work → ctx.Done() wins.
	if !strings.Contains(output, "cancelled") && !strings.Contains(output, "deadline exceeded") {
		t.Fatalf("Expected output to contain 'cancelled' or 'deadline exceeded', but got %q", output)
	}
}
