package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

const (
	serverPort              = ":8080"
	executionTimeoutSeconds = 20
	dockerImage             = "golang:alpine"
	maxMemoryLimit          = "512m"
	cpuLimit                = "1.0"
	pidsLimit               = "200"
	tempDirPattern          = "go-exec-*"
)

// ExecuteRequest represents the incoming JSON payload.
type ExecuteRequest struct {
	Code string `json:"code"`
}

// ExecuteResponse represents the outgoing JSON payload.
type ExecuteResponse struct {
	Output string `json:"output"`
}

func main() {
	setupRoutes()
	log.Printf("Starting server on port %s...", serverPort)
	if err := http.ListenAndServe(serverPort, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// setupRoutes configures the HTTP endpoints.
func setupRoutes() {
	http.HandleFunc("/api/execute", handleExecute)
}

// handleExecute is the HTTP handler for code execution.
func handleExecute(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for frontend integration
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	requestPayload, err := parseExecuteRequest(r.Body)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	tempDirectoryPath, err := prepareTempDirectory(requestPayload.Code)
	if err != nil {
		log.Printf("Error creating temp directory: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	// Always ensure cleanup runs after execution finishes
	defer cleanUpTempDirectory(tempDirectoryPath)

	executionOutput, executionError, isTimeout := executeCodeInSandbox(tempDirectoryPath)
	if isTimeout {
		http.Error(w, "Execution timeout", http.StatusRequestTimeout)
		return
	}

	// executionError usually happens when user code has compilation errors or runtime panics.
	// We want to return the output (which contains the error message) rather than failing the HTTP request.
	if executionError != nil {
		executionOutput += fmt.Sprintf("\n(Error: %v)", executionError)
	}

	sendExecuteResponse(w, executionOutput)
}

// parseExecuteRequest reads the request body and decodes the JSON payload.
func parseExecuteRequest(body io.Reader) (ExecuteRequest, error) {
	var request ExecuteRequest
	decoder := json.NewDecoder(body)
	if err := decoder.Decode(&request); err != nil {
		return ExecuteRequest{}, err
	}
	return request, nil
}

// sendExecuteResponse encodes the output as JSON and sends it to the client.
func sendExecuteResponse(w http.ResponseWriter, output string) {
	response := ExecuteResponse{Output: output}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}

// prepareTempDirectory creates a temporary directory and writes the Go source code into it.
func prepareTempDirectory(code string) (string, error) {
	tempDirectoryPath, err := os.MkdirTemp("", tempDirPattern)
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}

	sourceFilePath := filepath.Join(tempDirectoryPath, "main.go")
	if err := os.WriteFile(sourceFilePath, []byte(code), 0644); err != nil {
		cleanUpTempDirectory(tempDirectoryPath)
		return "", fmt.Errorf("failed to write source file: %w", err)
	}

	// To mount into Docker, macOS requires the path to be absolute and fully resolved (no symlinks).
	absolutePath, err := filepath.EvalSymlinks(tempDirectoryPath)
	if err != nil {
		cleanUpTempDirectory(tempDirectoryPath)
		return "", fmt.Errorf("failed to resolve absolute path: %w", err)
	}

	return absolutePath, nil
}

// cleanUpTempDirectory removes the temporary directory and all its contents.
func cleanUpTempDirectory(path string) {
	if err := os.RemoveAll(path); err != nil {
		log.Printf("Failed to remove temp directory %s: %v", path, err)
	}
}

// executeCodeInSandbox runs the Go code within a highly restricted Docker container.
func executeCodeInSandbox(directoryPath string) (output string, err error, isTimeout bool) {
	// Create a context with a strict timeout to prevent infinite loops (RCE mitigation).
	ctx, cancel := context.WithTimeout(context.Background(), executionTimeoutSeconds*time.Second)
	defer cancel()

	randomID := fmt.Sprintf("%d", time.Now().UnixNano())
	containerName := fmt.Sprintf("go-exec-%s", randomID)

	// Construct the secure Docker run command.
	// WHY: We use extremely strict limits to prevent DoS, fork bombs, and container breakouts.
	dockerArgs := []string{
		"run",
		"--rm",                              // Automatically remove container when it exits
		"--name", containerName,
		"--network", "none",                 // Disable networking to prevent outbound attacks
		"--user", "1000:1000",               // Run as non-root user
		"--memory", maxMemoryLimit,          // Limit memory to prevent OOM
		"--memory-swap", maxMemoryLimit,     // Disable swap
		"--cpus", cpuLimit,                  // Limit CPU usage
		"--pids-limit", pidsLimit,           // Prevent fork bombs
		"--cap-drop", "ALL",                 // Drop all Linux capabilities
		"--security-opt", "no-new-privileges",// Prevent privilege escalation
		"--tmpfs", "/tmp:exec",              // Provide writable, executable temp memory for Go cache
		"-e", "GOCACHE=/tmp",                // Override GOCACHE to use the tmpfs
		"-e", "GOPROXY=off",
		"-e", "CGO_ENABLED=0",
		"-e", "GOTELEMETRY=off",
		"-v", fmt.Sprintf("%s:/app:ro", directoryPath), // Mount code directory as read-only
		"-w", "/app",                        // Set working directory
		dockerImage,
		"go", "run", "main.go",
	}

	defer func() {
		// Clean up container just in case it's left running (e.g., timeout)
		exec.Command("docker", "rm", "-f", containerName).Run()
	}()

	command := exec.CommandContext(ctx, "docker", dockerArgs...)

	var stdoutBuffer, stderrBuffer bytes.Buffer
	command.Stdout = &stdoutBuffer
	command.Stderr = &stderrBuffer

	executionErr := command.Run()

	// Check if the error was due to our context timeout
	if ctx.Err() == context.DeadlineExceeded {
		return "", errors.New("execution timed out"), true
	}

	// Combine stdout and stderr for the user to see compilation/runtime errors
	combinedOutput := stdoutBuffer.String() + stderrBuffer.String()

	return combinedOutput, executionErr, false
}
