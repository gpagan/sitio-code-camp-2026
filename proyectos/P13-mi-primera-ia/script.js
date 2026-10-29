// ===== P13 · Mi primera IA: lista de pasos y bitácora =====
// Este proyecto es "sin código" para el estudiante: este archivo solo
// hace que la guía recuerde los pasos marcados y las notas de la bitácora.

const CLAVE = "code-camp-p13";

const casillas = document.querySelectorAll(".check");
const textoCompletados = document.querySelector("#completados");
const textoTotal = document.querySelector("#total-pasos");
const filasBitacora = document.querySelector("#filas-bitacora");
const botonFila = document.querySelector("#boton-fila");

// ---------- Guardar y cargar (con try/catch por si el navegador no deja) ----------
function cargar() {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (texto) {
      return JSON.parse(texto);
    }
  } catch (error) {
    console.log("No se pudo cargar:", error);
  }
  return { pasos: [], bitacora: [] };
}

function guardar() {
  const datos = { pasos: [], bitacora: [] };
  for (let i = 0; i < casillas.length; i++) {
    datos.pasos.push(casillas[i].checked);
  }
  const filas = filasBitacora.querySelectorAll("tr");
  for (let i = 0; i < filas.length; i++) {
    const campos = filas[i].querySelectorAll("input");
    datos.bitacora.push([campos[0].value, campos[1].value, campos[2].value]);
  }
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch (error) {
    console.log("No se pudo guardar:", error);
  }
}

// ---------- Pasos ----------
function actualizarProgreso() {
  let hechos = 0;
  for (let i = 0; i < casillas.length; i++) {
    const paso = casillas[i].closest(".paso");
    if (casillas[i].checked) {
      hechos = hechos + 1;
      paso.classList.add("hecho");
    } else {
      paso.classList.remove("hecho");
    }
  }
  textoCompletados.textContent = hechos;
  textoTotal.textContent = casillas.length;
}

// ---------- Bitácora ----------
function agregarFila(valores) {
  const numero = filasBitacora.children.length + 1;
  const fila = document.createElement("tr");

  const celdaNumero = document.createElement("td");
  celdaNumero.textContent = numero;
  fila.appendChild(celdaNumero);

  const ejemplos = ["200", "Más fotos con poca luz", "Papel y Nada"];
  for (let i = 0; i < 3; i++) {
    const celda = document.createElement("td");
    const campo = document.createElement("input");
    campo.type = "text";
    campo.placeholder = ejemplos[i];
    campo.value = valores ? valores[i] : "";
    campo.addEventListener("input", guardar);
    celda.appendChild(campo);
    fila.appendChild(celda);
  }

  filasBitacora.appendChild(fila);
}

// ---------- Empezamos ----------
const datos = cargar();

for (let i = 0; i < casillas.length; i++) {
  casillas[i].checked = datos.pasos[i] === true;
  casillas[i].addEventListener("change", function () {
    actualizarProgreso();
    guardar();
  });
}

if (datos.bitacora.length > 0) {
  for (let i = 0; i < datos.bitacora.length; i++) {
    agregarFila(datos.bitacora[i]);
  }
} else {
  agregarFila(null);
  agregarFila(null);
  agregarFila(null);
}

botonFila.addEventListener("click", function () {
  agregarFila(null);
  guardar();
});

actualizarProgreso();
