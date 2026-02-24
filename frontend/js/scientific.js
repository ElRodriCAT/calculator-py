

"use strict";


const state = {
  expr: "",       // Expresión que ve el usuario
  hasResult: false, // true luego de pulsar =, para sobrescribir al teclear
};


const elExpr   = document.getElementById("sciExpr");
const elResult = document.getElementById("sciResult");


/**
 * Convierte la expresión "legible" del usuario en JS válido y la evalúa
 * usando new Function() con funciones matemáticas inyectadas como parámetros.
 * No se usa eval() directamente. Se valida con una whitelist de caracteres.
 *
 * @param {string} raw - Expresión como la escribe el usuario
 * @returns {number} Resultado numérico
 */
function safeEvaluate(raw) {
  // 1. Sustituir funciones y operadores propios antes de sanear
  let expr = raw
    .replace(/sin\(/g,  "_sin(")   // sin()  → helper en grados
    .replace(/cos\(/g,  "_cos(")   // cos()
    .replace(/tan\(/g,  "_tan(")   // tan()
    .replace(/log\(/g,  "_log(")   // log()  → base 10
    .replace(/ln\(/g,   "_ln(")    // ln()   → natural
    .replace(/√\(/g,    "_sqrt(")  // √()
    .replace(/∛\(/g,    "_cbrt(")  // ∛()
    .replace(/π/g,      "(Math.PI)")
    .replace(/\be\b/g,  "(Math.E)") // constante e (solo si está sola)
    .replace(/\^/g,     "**")       // potencia
    .replace(/×/g,      "*")
    .replace(/÷/g,      "/");

  // 2. Whitelist: solo se permiten los tokens que esperamos
  if (!/^[\d\s+\-*/().**%_a-zA-Z.]+$/.test(expr)) {
    throw new SyntaxError("Expresión con caracteres no permitidos");
  }

  // 3. Crear función con los helpers matemáticos como parámetros
  const fn = new Function(
    "_sin", "_cos", "_tan", "_log", "_ln", "_sqrt", "_cbrt",
    `"use strict"; return (${expr});`
  );

  // 4. Ejecutar inyectando los helpers
  const result = fn(
    (deg) => Math.sin(deg * Math.PI / 180),   // sinDeg
    (deg) => Math.cos(deg * Math.PI / 180),   // cosDeg
    (deg) => Math.tan(deg * Math.PI / 180),   // tanDeg
    Math.log10,
    Math.log,
    Math.sqrt,
    Math.cbrt
  );

  if (!isFinite(result)) throw new RangeError("Resultado no finito (∞ o NaN)");
  return result;
}

// ─── Utilidades de display ────────────────────────────────────────────────────

/** Muestra la expresión en el display superior */
function renderExpr(text, isError = false) {
  elExpr.textContent = text || "0";
  elExpr.classList.toggle("error", isError);
}

/** Muestra el resultado en el display inferior */
function renderResult(text, isError = false) {
  elResult.textContent = text;
  elResult.classList.toggle("error", isError);
}

/** Formatea un número evitando notación científica innecesaria */
function formatNumber(n) {
  // Hasta 10 dígitos significativos para evitar ruido flotante
  const str = parseFloat(n.toPrecision(10)).toString();
  return str;
}

// ─── Acciones de la calculadora ──────────────────────────────────────────────

/**
 * Inserta texto al final de la expresión.
 * Si acaba de mostrarse un resultado, el siguiente carácter de operador
 * continúa la expresión; cualquier otro reemplaza.
 */
function actionInsert(value) {
  const isOperator = /^[+\-*\/^%]$/.test(value);

  if (state.hasResult) {
    if (isOperator) {
      // Continuar encadenando desde el resultado actual
      state.expr = elResult.textContent + value;
    } else {
      // Nuevo número/función: empezar de cero
      state.expr = value;
    }
    state.hasResult = false;
    renderResult("");
  } else {
    state.expr += value;
  }

  renderExpr(state.expr);
}

/** Agrega ^2 al final de la expresión */
function actionPow2() { actionInsert("^2"); }

/** Agrega ^3 al final de la expresión */
function actionPow3() { actionInsert("^3"); }

/** Elimina el último carácter de la expresión */
function actionDelete() {
  if (state.hasResult) {
    actionClear();
    return;
  }
  state.expr = state.expr.slice(0, -1);
  renderExpr(state.expr);
}

/** Resetea todo */
function actionClear() {
  state.expr = "";
  state.hasResult = false;
  renderExpr("0");
  renderResult("");
}

/** Invierte el signo de toda la expresión (envuelve con paréntesis negados) */
function actionSign() {
  if (!state.expr) return;
  if (state.expr.startsWith("-(") && state.expr.endsWith(")")) {
    state.expr = state.expr.slice(2, -1);
  } else {
    state.expr = `-(${ state.expr })`;
  }
  renderExpr(state.expr);
}

/** Evalúa la expresión y muestra el resultado */
function actionEquals() {
  if (!state.expr) return;

  try {
    const result = safeEvaluate(state.expr);
    const formatted = formatNumber(result);
    renderExpr(state.expr);   // mantiene lo que se escribió
    renderResult(formatted);
    state.hasResult = true;
  } catch (err) {
    renderResult("Error: " + (err.message || "expresión inválida"), true);
    state.hasResult = false;
  }
}

// ─── Mapa de acciones ─────────────────────────────────────────────────────────

const actionMap = {
  insert:  (btn) => actionInsert(btn.dataset.value),
  pow2:    ()    => actionPow2(),
  pow3:    ()    => actionPow3(),
  delete:  ()    => actionDelete(),
  clear:   ()    => actionClear(),
  sign:    ()    => actionSign(),
  equals:  ()    => actionEquals(),
};

// ─── Event listeners ─────────────────────────────────────────────────────────

/** Delegación de eventos en la grilla */
document.querySelector(".sci-grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".sci-btn");
  if (!btn) return;

  const action = btn.dataset.action;
  const handler = actionMap[action];
  if (handler) handler(btn);
});

/** Teclado: permite usar la calculadora sin mouse */
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key === "Enter" || key === "=")      { actionEquals(); return; }
  if (key === "Escape" || key === "c")     { actionClear();  return; }
  if (key === "Backspace")                 { actionDelete(); return; }

  // Dígitos y operadores directos
  if (/^[0-9]$/.test(key))                { actionInsert(key); return; }
  if (["+", "-", "*", "/", "^", "%", "(", ")", "."].includes(key)) {
    actionInsert(key);
    return;
  }
});
