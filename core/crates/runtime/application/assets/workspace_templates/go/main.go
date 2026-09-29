package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println("🚀 Welcome to the Operit Go project!")
	fmt.Println(strings.Repeat("=", 50))
	fmt.Println("This is a Go project template, you can:")
	fmt.Println("  ✨ Write and compile Go code")
	fmt.Println("  📦 Manage dependencies with go mod")
	fmt.Println("  ⚡ Take advantage of Go's concurrency")
	fmt.Println(strings.Repeat("=", 50))

	// Sample code
	greeting := "Hello from Operit!"
	fmt.Printf("\n%s\n\n", greeting)

	// Simple calculation example
	numbers := []int{1, 2, 3, 4, 5}
	sum := 0
	for _, num := range numbers {
		sum += num
	}
	fmt.Printf("The sum of array %v is: %d\n", numbers, sum)

	// Concurrency example
	fmt.Println("\n✅ Program ran successfully!")
	fmt.Println("💡 Tip: after editing main.go, run go run main.go")
}
