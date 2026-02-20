import math

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
        return {"error": "No se puede calcular una raiz negativa"}
    return a ** 0.5

def evaluar(expresion: str):
    # Reemplazar ^ por ** (potencia)
    expresion = expresion.replace("^", "**")
    # Namespace seguro con funciones matematicas (trig en grados)
    ns = {
        "__builtins__": {},
        "sin":  lambda x: math.sin(math.radians(x)),
        "cos":  lambda x: math.cos(math.radians(x)),
        "tan":  lambda x: math.tan(math.radians(x)),
        "sqrt": math.sqrt,
        "abs":  abs,
        "pi":   math.pi,
        "e":    math.e,
    }
    try:
        resultado = eval(expresion, {"__builtins__": {}}, ns)
        return float(resultado)
    except ZeroDivisionError:
        return {"error": "No se puede dividir entre cero"}
    except Exception:
        return {"error": "Expresion invalida"}
