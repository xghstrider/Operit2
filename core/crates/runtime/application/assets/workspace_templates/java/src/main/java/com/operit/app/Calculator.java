package com.operit.app;

/**
 * A simple calculator class
 * Demonstrates class structure and unit testing
 */
public class Calculator {
    
    /**
     * Addition
     */
    public int add(int a, int b) {
        return a + b;
    }
    
    /**
     * Subtraction
     */
    public int subtract(int a, int b) {
        return a - b;
    }
    
    /**
     * Multiplication
     */
    public int multiply(int a, int b) {
        return a * b;
    }
    
    /**
     * Division
     */
    public double divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return (double) a / b;
    }
    
    /**
     * Calculates the sum of an array
     */
    public int sum(int[] numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
}
