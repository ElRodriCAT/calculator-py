from calculator import (
    add, subtract, multiply, divide,
    power, square_root, modulo, factorial, percentage,
)


def show_menu():
    print("\n=== Calculadora ===")
    print("Operaciones básicas:")
    print("  1. Suma")
    print("  2. Resta")
    print("  3. Multiplicación")
    print("  4. División")
    print("Operaciones complejas:")
    print("  5. Potencia")
    print("  6. Raíz cuadrada")
    print("  7. Módulo")
    print("  8. Factorial")
    print("  9. Porcentaje")
    print("  0. Salir")


def get_number(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Por favor, introduce un número válido.")


def main():
    while True:
        show_menu()
        choice = input("\nElige una opción: ").strip()

        try:
            if choice == "0":
                print("¡Hasta luego!")
                break
            elif choice == "1":
                a = get_number("Primer número: ")
                b = get_number("Segundo número: ")
                print(f"Resultado: {add(a, b)}")
            elif choice == "2":
                a = get_number("Primer número: ")
                b = get_number("Segundo número: ")
                print(f"Resultado: {subtract(a, b)}")
            elif choice == "3":
                a = get_number("Primer número: ")
                b = get_number("Segundo número: ")
                print(f"Resultado: {multiply(a, b)}")
            elif choice == "4":
                a = get_number("Dividendo: ")
                b = get_number("Divisor: ")
                print(f"Resultado: {divide(a, b)}")
            elif choice == "5":
                base = get_number("Base: ")
                exp = get_number("Exponente: ")
                print(f"Resultado: {power(base, exp)}")
            elif choice == "6":
                n = get_number("Número: ")
                print(f"Resultado: {square_root(n)}")
            elif choice == "7":
                a = get_number("Dividendo: ")
                b = get_number("Divisor: ")
                print(f"Resultado: {modulo(a, b)}")
            elif choice == "8":
                n = int(get_number("Número entero: "))
                print(f"Resultado: {factorial(n)}")
            elif choice == "9":
                value = get_number("Valor: ")
                percent = get_number("Porcentaje (%): ")
                print(f"Resultado: {percentage(value, percent)}")
            else:
                print("Opción no válida. Inténtalo de nuevo.")
        except ValueError as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
