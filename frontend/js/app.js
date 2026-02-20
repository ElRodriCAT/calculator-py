const API_BASE = "http://127.0.0.1:5000/api/calculadora";

const displayEl    = document.getElementById("display");
const expressionEl = document.getElementById("expression");

// --- Estado de la calculadora ---
let estado = {
    primerNum:       null,    // primer operando guardado
    operacion:       null,    // operación seleccionada
    display:         "0",     // lo que se muestra en pantalla
    esperandoB:      false,   // ¿el próximo dígito es el segundo operando?
    calculado:       false,   // ¿se acaba de mostrar un resultado?
};

const SIMBOLOS = {
    sumar:       "+",
    restar:      "−",
    multiplicar: "×",
    dividir:     "÷",
    potencia:    "xʸ",
    raiz:        "√",
};

// --- Renderizar pantalla ---
function render() {
    displayEl.textContent = estado.display;
    displayEl.className   = "screen-display";
}

function mostrarExpresion(texto) {
    expressionEl.textContent = texto;
}

function mostrarError(msg) {
    displayEl.textContent = msg;
    displayEl.className   = "screen-display error";
    mostrarExpresion("");
    resetEstado();
}

function resetEstado() {
    estado = { primerNum: null, operacion: null, display: "0",
               esperandoB: false, calculado: false };
    // quitar botón activo
    document.querySelectorAll(".btn-op.active")
            .forEach(b => b.classList.remove("active"));
}

// --- Acciones ---
function presionarDigito(digito) {
    if (estado.calculado || estado.esperandoB) {
        estado.display    = digito;
        estado.esperandoB = false;
        estado.calculado  = false;
    } else {
        if (estado.display === "0") {
            estado.display = digito;
        } else {
            if (estado.display.length >= 12) return; // límite de dígitos
            estado.display += digito;
        }
    }
    render();
}

function presionarDecimal() {
    if (estado.esperandoB || estado.calculado) {
        estado.display    = "0.";
        estado.esperandoB = false;
        estado.calculado  = false;
    } else if (!estado.display.includes(".")) {
        estado.display += ".";
    }
    render();
}

function presionarOperacion(op, boton) {
    // Quitar clase activa de otros botones de operación
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
    boton.classList.add("active");

    if (op === "raiz") {
        // Raíz cuadrada: opera directamente sobre el número en pantalla
        estado.primerNum = parseFloat(estado.display);
        estado.operacion = "raiz";
        mostrarExpresion(`√ ${estado.primerNum}`);
        calcular();
        return;
    }

    // Si ya hay una operación pendiente y un segundo número, calcula primero
    if (estado.primerNum !== null && !estado.esperandoB && !estado.calculado) {
        ejecutarCalculo(parseFloat(estado.display));
        return;
    }

    estado.primerNum  = parseFloat(estado.display);
    estado.operacion  = op;
    estado.esperandoB = true;
    estado.calculado  = false;
    mostrarExpresion(`${estado.primerNum} ${SIMBOLOS[op]}`);
}

function presionarIgual() {
    if (estado.operacion === null || estado.esperandoB) return;
    ejecutarCalculo(parseFloat(estado.display));
}

async function ejecutarCalculo(b) {
    const a  = estado.primerNum;
    const op = estado.operacion;
    const body = op === "raiz" ? { a } : { a, b };

    // Deshabilitar todos los botones durante la petición
    document.querySelectorAll(".btn").forEach(b => b.disabled = true);
    displayEl.textContent = "…";

    try {
        const res  = await fetch(`${API_BASE}/${op}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        });
        const data = await res.json();

        if (data.error) {
            const exprAntes = expressionEl.textContent;
            mostrarExpresion(exprAntes);
            mostrarError(data.error);
        } else {
            const expr = op === "raiz"
                ? `√ ${a} =`
                : `${a} ${SIMBOLOS[op]} ${b} =`;
            mostrarExpresion(expr);

            // Redondear flotantes largos
            const res = parseFloat(data.resultado.toFixed(10));
            estado.display    = String(res);
            estado.primerNum  = null;
            estado.operacion  = null;
            estado.calculado  = true;
            estado.esperandoB = false;
            render();
            document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        }
    } catch {
        mostrarError("Sin conexión con el servidor");
    } finally {
        document.querySelectorAll(".btn").forEach(b => b.disabled = false);
    }
}

function calcular() {
    ejecutarCalculo(null);
}

// --- Delegación de eventos en el grid de botones ---
document.querySelector(".buttons").addEventListener("click", (e) => {
    const btn    = e.target.closest(".btn");
    if (!btn) return;
    const action = btn.dataset.action;

    switch (action) {
        case "digit":
            presionarDigito(btn.dataset.digit);
            break;
        case "decimal":
            presionarDecimal();
            break;
        case "op":
            presionarOperacion(btn.dataset.op, btn);
            break;
        case "equals":
            presionarIgual();
            break;
        case "clear":
            resetEstado();
            estado.display = "0";
            render();
            mostrarExpresion("");
            break;
        case "backspace":
            if (estado.calculado) { resetEstado(); estado.display = "0"; render(); break; }
            estado.display = estado.display.length > 1
                ? estado.display.slice(0, -1)
                : "0";
            render();
            break;
    }
});

// --- Teclado físico ---
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9")       presionarDigito(e.key);
    else if (e.key === ".")                  presionarDecimal();
    else if (e.key === "+")                  presionarOperacion("sumar",       document.querySelector('[data-op="sumar"]'));
    else if (e.key === "-")                  presionarOperacion("restar",      document.querySelector('[data-op="restar"]'));
    else if (e.key === "*")                  presionarOperacion("multiplicar", document.querySelector('[data-op="multiplicar"]'));
    else if (e.key === "/") { e.preventDefault(); presionarOperacion("dividir", document.querySelector('[data-op="dividir"]')); }
    else if (e.key === "Enter" || e.key === "=") presionarIgual();
    else if (e.key === "Backspace")           document.querySelector('[data-action="backspace"]').click();
    else if (e.key === "Escape")             document.querySelector('[data-action="clear"]').click();
});

// Render inicial
render();
