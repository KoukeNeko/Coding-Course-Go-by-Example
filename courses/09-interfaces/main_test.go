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

	// email{isSubscribed: true, body: "Hello"} → cost is 0.01 * len("Hello") = 0.05
	if !strings.Contains(output, "0.05") {
		t.Fatalf("Expected output to contain '0.05' (cost for subscribed 5-char email), but got %q", output)
	}
}
