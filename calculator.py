import math


# Basic operations

def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


# Complex operations

def power(base, exponent):
    return base ** exponent


def square_root(n):
    if n < 0:
        raise ValueError("Cannot compute square root of a negative number")
    return math.sqrt(n)


def modulo(a, b):
    if b == 0:
        raise ValueError("Cannot compute modulo with divisor zero")
    return a % b


def factorial(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError("Factorial is only defined for non-negative integers")
    return math.factorial(n)


def percentage(value, percent):
    return value * percent / 100
