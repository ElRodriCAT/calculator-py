import unittest
from calculator import (
    add, subtract, multiply, divide,
    power, square_root, modulo, factorial, percentage,
)


class TestBasicOperations(unittest.TestCase):

    def test_add(self):
        self.assertEqual(add(3, 4), 7)
        self.assertEqual(add(-1, 1), 0)
        self.assertAlmostEqual(add(0.1, 0.2), 0.3, places=10)

    def test_subtract(self):
        self.assertEqual(subtract(10, 4), 6)
        self.assertEqual(subtract(-1, -1), 0)

    def test_multiply(self):
        self.assertEqual(multiply(3, 4), 12)
        self.assertEqual(multiply(-2, 3), -6)
        self.assertEqual(multiply(0, 100), 0)

    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)
        self.assertAlmostEqual(divide(1, 3), 1 / 3)

    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            divide(5, 0)


class TestComplexOperations(unittest.TestCase):

    def test_power(self):
        self.assertEqual(power(2, 10), 1024)
        self.assertEqual(power(5, 0), 1)
        self.assertAlmostEqual(power(4, 0.5), 2.0)

    def test_square_root(self):
        self.assertAlmostEqual(square_root(9), 3.0)
        self.assertAlmostEqual(square_root(2), 1.4142135623730951)
        self.assertEqual(square_root(0), 0.0)

    def test_square_root_negative(self):
        with self.assertRaises(ValueError):
            square_root(-1)

    def test_modulo(self):
        self.assertEqual(modulo(10, 3), 1)
        self.assertEqual(modulo(9, 3), 0)

    def test_modulo_by_zero(self):
        with self.assertRaises(ValueError):
            modulo(5, 0)

    def test_factorial(self):
        self.assertEqual(factorial(0), 1)
        self.assertEqual(factorial(5), 120)
        self.assertEqual(factorial(10), 3628800)

    def test_factorial_invalid(self):
        with self.assertRaises(ValueError):
            factorial(-1)
        with self.assertRaises(ValueError):
            factorial(2.5)

    def test_percentage(self):
        self.assertEqual(percentage(200, 50), 100)
        self.assertAlmostEqual(percentage(150, 10), 15.0)


if __name__ == "__main__":
    unittest.main()
