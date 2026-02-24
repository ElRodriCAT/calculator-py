const CATEGORY_UNITS = {
  length: [
    { value: "m", label: "Metros" },
    { value: "km", label: "Kilometros" },
    { value: "cm", label: "Centimetros" },
    { value: "in", label: "Pulgadas" },
    { value: "ft", label: "Pies" }
  ],
  weight: [
    { value: "kg", label: "Kilogramos" },
    { value: "g", label: "Gramos" },
    { value: "lb", label: "Libras" }
  ],
  temperature: [
    { value: "c", label: "Celsius" },
    { value: "f", label: "Fahrenheit" },
    { value: "k", label: "Kelvin" }
  ]
};

const categorySelect = document.getElementById("category");
const fromUnitSelect = document.getElementById("fromUnit");
const toUnitSelect = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const resultValue = document.getElementById("resultValue");
const errorMessage = document.getElementById("errorMessage");
const convertBtn = document.getElementById("convertBtn");

const decimals = 4;

function initConverter() {
  populateUnits(categorySelect.value);
  categorySelect.addEventListener("change", handleCategoryChange);
  fromUnitSelect.addEventListener("change", handleUnitChange);
  toUnitSelect.addEventListener("change", handleUnitChange);
  inputValue.addEventListener("input", handleInput);
  convertBtn.addEventListener("click", convert);
}

function populateUnits(category) {
  const units = CATEGORY_UNITS[category];
  fromUnitSelect.innerHTML = "";
  toUnitSelect.innerHTML = "";

  units.forEach((unit, index) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = unit.value;
    optionFrom.textContent = unit.label;

    const optionTo = document.createElement("option");
    optionTo.value = unit.value;
    optionTo.textContent = unit.label;

    if (index === 0) {
      optionFrom.selected = true;
    }

    if (index === 1 || units.length === 1) {
      optionTo.selected = true;
    }

    fromUnitSelect.appendChild(optionFrom);
    toUnitSelect.appendChild(optionTo);
  });

  resetResult();
}

function handleCategoryChange(event) {
  populateUnits(event.target.value);
  clearError();
}

function handleInput() {
  if (!inputValue.value.trim()) {
    resetResult();
  }
  clearError();
}

function handleUnitChange() {
  resetResult();
  clearError();
}

function convert() {
  const rawValue = inputValue.value.trim();
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  const category = categorySelect.value;

  if (!rawValue) {
    setError("Ingresa un valor para convertir.");
    resultValue.textContent = "--";
    return;
  }

  const numericValue = Number(rawValue);
  if (Number.isNaN(numericValue)) {
    setError("El valor ingresado no es valido.");
    resultValue.textContent = "--";
    return;
  }

  clearError();

  let result;
  if (category === "length") {
    result = convertLength(numericValue, fromUnit, toUnit);
  } else if (category === "weight") {
    result = convertWeight(numericValue, fromUnit, toUnit);
  } else if (category === "temperature") {
    result = convertTemperature(numericValue, fromUnit, toUnit);
  }

  resultValue.textContent = formatResult(result);
}

function convertLength(value, from, to) {
  const factors = {
    m: 1,
    km: 1000,
    cm: 0.01,
    in: 0.0254,
    ft: 0.3048
  };

  const valueInMeters = value * factors[from];
  return valueInMeters / factors[to];
}

function convertWeight(value, from, to) {
  const factors = {
    kg: 1,
    g: 0.001,
    lb: 0.453592
  };

  const valueInKg = value * factors[from];
  return valueInKg / factors[to];
}

function convertTemperature(value, from, to) {
  if (from === to) {
    return value;
  }

  let celsiusValue = value;
  if (from === "f") {
    celsiusValue = (value - 32) * (5 / 9);
  } else if (from === "k") {
    celsiusValue = value - 273.15;
  }

  if (to === "c") {
    return celsiusValue;
  }
  if (to === "f") {
    return celsiusValue * (9 / 5) + 32;
  }
  return celsiusValue + 273.15;
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    setError("No se pudo calcular el resultado.");
    return "--";
  }

  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

function setError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

function resetResult() {
  resultValue.textContent = "--";
}

document.addEventListener("DOMContentLoaded", initConverter);
