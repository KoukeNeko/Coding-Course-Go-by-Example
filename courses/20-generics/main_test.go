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

	// printSlice should print every element of both slices: 1,2,3 and A,B,C
	mustContain := []string{"1", "2", "3", "A", "B", "C"}
	for _, want := range mustContain {
		if !strings.Contains(output, want) {
			t.Fatalf("Expected output to contain %q, but got %q", want, output)
		}
	}
}
