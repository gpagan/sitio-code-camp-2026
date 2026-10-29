// ===== P6 · Conversor de lempiras a dólares =====

// PERSONALIZA: el tipo de cambio. Este número es SOLO UN EJEMPLO.
// Antes de usarlo, cámbialo por el tipo de cambio del día que publica
// el Banco Central de Honduras (BCH).
const TIPO_DE_CAMBIO_INICIAL = 26.0;

// Los elementos de la página
const campoCantidad = document.querySelector("#cantidad");
const campoTipoCambio = document.querySelector("#tipo-cambio");
const etiquetaCantidad = document.querySelector("#etiqueta-cantidad");
const botonConvertir = document.querySelector("#boton-convertir");
const resultado = document.querySelector("#resultado");
const error = document.querySelector("#error");
const opcionesDireccion = document.querySelectorAll('input[name="direccion"]');
const atajos = document.querySelectorAll(".atajo");

campoTipoCambio.value = TIPO_DE_CAMBIO_INICIAL;

// ¿Hacia dónde convertimos? Devuelve "hnl-usd" o "usd-hnl"
function direccionElegida() {
  for (let i = 0; i < opcionesDireccion.length; i++) {
    if (opcionesDireccion[i].checked) {
      return opcionesDireccion[i].value;
    }
  }
  return "hnl-usd";
}

// Escribe un número como dinero: 1234.5 → "1,234.50"
function formatoDinero(numero) {
  return numero.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mostrarError(texto) {
  error.textContent = texto;
  resultado.textContent = "";
}

function convertir() {
  error.textContent = "";

  // Lo que escribe el usuario siempre llega como TEXTO: hay que convertirlo a número
  const cantidad = Number(campoCantidad.value);
  const tipoCambio = Number(campoTipoCambio.value);

  // ---------- Validar los datos antes de usarlos ----------
  if (campoCantidad.value === "") {
    mostrarError("Escribe una cantidad.");
    return;
  }
  if (isNaN(cantidad) || cantidad < 0) {
    mostrarError("La cantidad debe ser un número positivo.");
    return;
  }
  if (isNaN(tipoCambio) || tipoCambio <= 0) {
    mostrarError("El tipo de cambio debe ser mayor que 0.");
    return;
  }

  // ---------- Hacer la operación ----------
  if (direccionElegida() === "hnl-usd") {
    const dolares = cantidad / tipoCambio;
    resultado.textContent = "L " + formatoDinero(cantidad) + " = $ " + formatoDinero(dolares);
  } else {
    const lempiras = cantidad * tipoCambio;
    resultado.textContent = "$ " + formatoDinero(cantidad) + " = L " + formatoDinero(lempiras);
  }

  console.log("Conversión:", cantidad, direccionElegida(), "con tipo de cambio", tipoCambio);
}

// Cuando cambia la dirección, cambia la etiqueta del campo
function actualizarEtiqueta() {
  if (direccionElegida() === "hnl-usd") {
    etiquetaCantidad.textContent = "Cantidad en lempiras (L)";
  } else {
    etiquetaCantidad.textContent = "Cantidad en dólares ($)";
  }
  resultado.textContent = "";
}

// ---------- Eventos ----------
botonConvertir.addEventListener("click", convertir);

campoCantidad.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    convertir();
  }
});

for (let i = 0; i < opcionesDireccion.length; i++) {
  opcionesDireccion[i].addEventListener("change", actualizarEtiqueta);
}

for (let i = 0; i < atajos.length; i++) {
  atajos[i].addEventListener("click", function () {
    campoCantidad.value = atajos[i].dataset.valor;
    convertir();
  });
}
