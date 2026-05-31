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

	if !strings.Contains(output, "Cleanup complete") {
		t.Fatalf("Expected output to contain 'Cleanup complete', but got %q", output)
	}

	// "Cleanup complete" must appear AFTER both other prints (defer = LIFO at end).
	cleanupIdx := strings.Index(output, "Cleanup complete")
	finishedIdx := strings.Index(output, "Work finished!")
	if cleanupIdx < finishedIdx {
		t.Fatalf("Expected 'Cleanup complete' to appear AFTER 'Work finished!', but got %q", output)
	}
}
