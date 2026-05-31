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

	// Rectangle{width:10, height:5}.Area() = 50
	if !strings.Contains(output, "Area: 50") {
		t.Fatalf("Expected output to contain 'Area: 50', but got %q", output)
	}
}
