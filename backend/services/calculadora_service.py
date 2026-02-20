def sumar(a, b):
    return a + b

def restar(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return {"error": "No se puede dividir entre cero"}
    return a / b

def potencia(a, b):
    return a ** b

def raiz(a):
    if a < 0:
        return {"error": "No se puede calcular una raíz negativa"}
    return a ** 0.5
