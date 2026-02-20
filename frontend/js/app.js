const API_BASE = "http://127.0.0.1:5000/api/calculadora";

const inputExpr    = document.getElementById("inputExpr");
const inputCard    = document.getElementById("inputCard");
const btnCalcular  = document.getElementById("btnCalcular");
const resultValue  = document.getElementById("resultValue");
const resultStatus = document.getElementById("resultStatus");
const historialLista = document.getElementById("historialLista");
const btnLimpiarHist = document.getElementById("btnLimpiarHist");
const themeToggle  = document.getElementById("themeToggle");
const btnTheme     = document.getElementById("btnTheme");

// ---- Tema claro / oscuro ----
function aplicarTema(claro) {
    document.body.classList.toggle("light", claro);
    themeToggle.checked = claro;
    // Icono del boton: sol = oscuro activo, luna = claro activo
    btnTheme.textContent = claro ? "\u263D" : "\u2600";
    localStorage.setItem("tema", claro ? "light" : "dark");
}

// Cargar preferencia guardada (o preferencia del sistema)
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado) {
    aplicarTema(temaGuardado === "light");
} else {
    aplicarTema(window.matchMedia("(prefers-color-scheme: light)").matches);
}

// Eventos del toggle y del boton
themeToggle.addEventListener("change", () => aplicarTema(themeToggle.checked));
btnTheme.addEventListener("click",    () => aplicarTema(!themeToggle.checked));

// Glow en el input al enfocar
inputExpr.addEventListener("focus", () => inputCard.classList.add("focused"));
inputExpr.addEventListener("blur",  () => inputCard.classList.remove("focused"));

// Botones de operadores: insertan texto en el input
document.querySelector(".operators-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".op-btn");
    if (!btn) return;
    const insert = btn.dataset.insert;
    insertarEnInput(insert === "( )" ? "(" : insert);
    inputExpr.focus();
});

function insertarEnInput(texto) {
    const s   = inputExpr.selectionStart;
    const e   = inputExpr.selectionEnd;
    const val = inputExpr.value;
    inputExpr.value = val.slice(0, s) + texto + val.slice(e);
    const pos = s + texto.length;
    inputExpr.setSelectionRange(pos, pos);
}

// Calcular
btnCalcular.addEventListener("click", () => calcular());

inputExpr.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter")  { ev.preventDefault(); calcular(); }
    if (ev.key === "Escape") { limpiarTodo(); }
    if (ev.key === "?")      { ev.preventDefault(); mostrarAyuda(); }
});

async function calcular() {
    const expr = inputExpr.value.trim();
    if (!expr) { setStatus("Escribe una expresion primero", "error"); return; }

    btnCalcular.disabled = true;
    resultValue.textContent = "";
    setStatus("Calculando...", "");

    try {
        const res  = await fetch(API_BASE + "/evaluar", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ expresion: expr }),
        });
        const data = await res.json();

        if (data.error) {
            setStatus("\u2717 " + data.error, "error");
            agregarHistorial(expr, data.error, true);
        } else {
            const valor = formatear(data.resultado);
            resultValue.textContent = "= " + valor;
            setStatus("\u2713 Operaci\u00f3n v\u00e1lida", "ok");
            agregarHistorial(expr, valor, false);
        }
    } catch {
        setStatus("\u2717 Sin conexi\u00f3n con el servidor", "error");
    } finally {
        btnCalcular.disabled = false;
    }
}

function formatear(num) {
    const r = parseFloat(num.toFixed(10));
    return String(r);
}

function setStatus(texto, tipo) {
    resultStatus.textContent = texto;
    resultStatus.className = "result-status" + (tipo ? " " + tipo : "");
}

function limpiarTodo() {
    inputExpr.value = "";
    resultValue.textContent = "";
    setStatus("", "");
    inputExpr.focus();
}

function mostrarAyuda() {
    alert(
        "Sintaxis disponible:\n" +
        "  + - * /          Operaciones basicas\n" +
        "  ^                Potencia  (ej: 2^8)\n" +
        "  sqrt(x)          Raiz cuadrada\n" +
        "  sin(x)  cos(x)   Trigonometria en grados\n" +
        "  tan(x)           Tangente en grados\n" +
        "  ( )              Parentesis\n" +
        "  pi, e            Constantes\n\n" +
        "Ejemplos:\n" +
        "  (12.5 * 8) - 7^2 / 4\n" +
        "  sin(30) * 100\n" +
        "  sqrt(144) + pi"
    );
}

function agregarHistorial(expr, resultado, esError) {
    const item = document.createElement("div");
    item.className = "hist-item" + (esError ? " error" : "");

    const exprEl = document.createElement("span");
    exprEl.className   = "hist-expr";
    exprEl.textContent = expr;

    const resEl = document.createElement("span");
    resEl.className   = "hist-result";
    resEl.textContent = "= " + resultado;

    item.appendChild(exprEl);
    item.appendChild(resEl);

    // Click rellena el input con esa expresion
    item.addEventListener("click", () => {
        inputExpr.value = expr;
        inputExpr.focus();
    });

    historialLista.prepend(item);
    while (historialLista.children.length > 30) historialLista.lastChild.remove();
}

btnLimpiarHist.addEventListener("click", () => {
    historialLista.innerHTML = "";
});