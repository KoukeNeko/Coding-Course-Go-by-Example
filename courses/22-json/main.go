package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func main() {
	u := User{ID: 1, Name: "Alice"}

	// TODO: Marshal u into JSON using json.Marshal,
	//       then print the resulting string.
	// Hint: json.Marshal returns ([]byte, error). Convert the bytes
	//       to a string with string(...) before printing.
	_ = u
	_ = json.Marshal // placeholder to keep the import; remove once used
}
