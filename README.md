# calculator-py

Calculadora web con interfaz estilo **Command Palette**, construida con **Python + Flask** en el backend y **HTML/CSS/JS** vanilla en el frontend.

---

## Demo

> Escribe expresiones matemáticas completas como `(12.5 * 8) - 7^2 / 4` o `sin(30) * 100` y obtene el resultado al instante.

---

## Características

- Evaluación de expresiones matemáticas completas (no solo operaciones simples)
- Soporte para `+`, `-`, `*`, `/`, `^` (potencia), `sqrt()`, `sin()`, `cos()`, `tan()`, `pi`, `e`
- Funciones trigonométricas en **grados**
- Historial de operaciones con click para reutilizar
- Tema **oscuro / claro** con persistencia en `localStorage`
- Arquitectura **Controller → Service** en el backend
- API REST con Flask y CORS habilitado

---

## Tecnologías

| Capa       | Tecnología              |
|------------|-------------------------|
| Backend    | Python 3, Flask, flask-cors |
| Frontend   | HTML5, CSS3, JavaScript (vanilla) |
| API        | REST JSON               |

---

## Estructura del proyecto

```
calculator-py/
├── backend/
│   ├── app.py                        # Punto de entrada Flask
│   ├── requirements.txt              # Dependencias Python
│   ├── controllers/
│   │   └── calculadora_controller.py # Rutas HTTP (endpoints)
│   ├── services/
│   │   └── calculadora_service.py    # Lógica de negocio
│   └── utils/
│       └── __init__.py
├── frontend/
│   ├── index.html                    # Interfaz principal
│   ├── css/styles.css                # Estilos (tema oscuro/claro)
│   └── js/app.js                     # Lógica cliente
└── README.md
```

---

## Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/calculator-py.git
cd calculator-py
```

### 2. Crear entorno virtual e instalar dependencias

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

pip install -r backend/requirements.txt
```

### 3. Levantar el backend

```bash
cd backend
python app.py
```

El servidor queda en `http://127.0.0.1:5000`.

### 4. Abrir el frontend

Abre `frontend/index.html` directamente en el navegador, o usa la extensión **Live Server** de VS Code.

---

## Endpoints de la API

Base URL: `http://127.0.0.1:5000/api/calculadora`

| Método | Ruta         | Body JSON                        | Descripción                        |
|--------|--------------|----------------------------------|------------------------------------|
| POST   | `/evaluar`   | `{ "expresion": "2^8 + sqrt(9)" }` | Evalúa una expresión completa    |
| POST   | `/sumar`     | `{ "a": 5, "b": 3 }`            | Suma dos números                   |
| POST   | `/restar`    | `{ "a": 5, "b": 3 }`            | Resta dos números                  |
| POST   | `/multiplicar` | `{ "a": 5, "b": 3 }`          | Multiplica dos números             |
| POST   | `/dividir`   | `{ "a": 5, "b": 3 }`            | Divide (error si divisor es 0)     |
| POST   | `/potencia`  | `{ "a": 2, "b": 8 }`            | Calcula a elevado a b              |
| POST   | `/raiz`      | `{ "a": 16 }`                   | Raíz cuadrada (error si negativo)  |

### Ejemplo de respuesta exitosa
```json
{ "resultado": 89.5 }
```

### Ejemplo de respuesta con error
```json
{ "error": "No se puede dividir entre cero" }
```

---

## Atajos de teclado

| Tecla    | Acción              |
|----------|---------------------|
| `Enter`  | Calcular            |
| `Esc`    | Limpiar input       |
| `?`      | Mostrar ayuda       |

---

## Licencia

MIT
