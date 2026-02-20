from flask import Blueprint, request, jsonify
from services.calculadora_service import (
    sumar, restar, multiplicar, dividir, potencia, raiz
)

calculadora_bp = Blueprint("calculadora", __name__)

@calculadora_bp.post("/sumar")
def ruta_sumar():
    datos = request.get_json()
    a = datos.get("a")
    b = datos.get("b")
    return jsonify({"resultado": sumar(a, b)})

@calculadora_bp.post("/restar")
def ruta_restar():
    datos = request.get_json()
    a = datos.get("a")
    b = datos.get("b")
    return jsonify({"resultado": restar(a, b)})

@calculadora_bp.post("/multiplicar")
def ruta_multiplicar():
    datos = request.get_json()
    a = datos.get("a")
    b = datos.get("b")
    return jsonify({"resultado": multiplicar(a, b)})

@calculadora_bp.post("/dividir")
def ruta_dividir():
    datos = request.get_json()
    a = datos.get("a")
    b = datos.get("b")
    return jsonify(dividir(a, b))

@calculadora_bp.post("/potencia")
def ruta_potencia():
    datos = request.get_json()
    a = datos.get("a")
    b = datos.get("b")
    return jsonify({"resultado": potencia(a, b)})

@calculadora_bp.post("/raiz")
def ruta_raiz():
    datos = request.get_json()
    a = datos.get("a")
    return jsonify(raiz(a))
