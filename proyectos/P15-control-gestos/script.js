// ===== P15 · Control por gestos =====
// La idea más importante del curso: lo que VE la IA se convierte en una ACCIÓN.
//
//   cámara → modelo (tu IA) → "Papel, 93 %" → la página se pone azul
//
// Usa el modelo que entrenaste en la clase 7 (carpeta "mi_modelo").

// ---------- PERSONALIZA ----------
// Dónde está tu modelo. Por defecto, la carpeta "mi_modelo" junto a este archivo.
const CARPETA_MODELO = "./mi_modelo/";
const CONFIANZA_MINIMA = 0.8;   // 0.8 = la IA debe estar 80 % segura

// Qué pasa con cada gesto. La clave es el nombre de la clase en minúsculas y sin tildes.
const ACCIONES = {
  piedra: { emoji: "✊", color: "#FF7A7A", texto: "#0F1B2D", mensaje: "¡Piedra!" },
  papel:  { emoji: "✋", color: "#5AD1F2", texto: "#0F1B2D", mensaje: "¡Papel!" },
  tijera: { emoji: "✌️", color: "#C8F25A", texto: "#0F1B2D", mensaje: "¡Tijera!" },
  nada:   { emoji: "👀", color: "#18283F", texto: "#F6F4EE", mensaje: "Muéstrame tu mano" }
};
// Si tu modelo tiene otras clases, se usan estos colores en orden
const COLORES_EXTRA = ["#FFB27A", "#B48CF2", "#F6D743", "#7BDE6A"];

// ---------- Variables ----------
let modelo = null;
let camara = null;
let gestoActual = null;       // el último gesto con suficiente confianza
const contadores = {};         // cuántas veces se activó cada gesto

// ---------- Elementos de la página ----------
const contenedorCamara = document.querySelector("#contenedor-camara");
const aviso = document.querySelector("#aviso");
const botonCamara = document.querySelector("#boton-camara");
const barras = document.querySelector("#barras");
const zonaAccion = document.querySelector("#zona-accion");
const emoji = document.querySelector("#emoji");
const mensaje = document.querySelector("#mensaje");
const confianza = document.querySelector("#confianza");
const contenedorContadores = document.querySelector("#contadores");

// Quita mayúsculas y tildes: "Tíjera " → "tijera"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// Devuelve la acción de una clase (o inventa una si no está en ACCIONES)
function accionDe(nombreClase, posicion) {
  const clave = normalizar(nombreClase);
  if (ACCIONES[clave]) {
    return ACCIONES[clave];
  }
  return {
    emoji: "🤖",
    color: COLORES_EXTRA[posicion % COLORES_EXTRA.length],
    texto: "#0F1B2D",
    mensaje: nombreClase
  };
}

// ---------- 1. Revisar que todo esté listo ----------
function revisarRequisitos() {
  if (location.protocol === "file:") {
    aviso.textContent = "Abre esta página con Live Server (clic derecho en index.html > Open with Live Server). Así puede leer tu carpeta mi_modelo.";
    return false;
  }
  if (typeof tmImage === "undefined") {
    aviso.textContent = "No se pudieron cargar las librerías de IA. Revisa tu conexión a internet.";
    return false;
  }
  return true;
}

// ---------- 2. Encender la cámara y cargar la IA ----------
async function encenderCamara() {
  if (!revisarRequisitos()) {
    return;
  }

  botonCamara.disabled = true;
  botonCamara.textContent = "Cargando tu IA...";

  try {
    modelo = await tmImage.load(CARPETA_MODELO + "model.json", CARPETA_MODELO + "metadata.json");
  } catch (error) {
    console.error(error);
    aviso.textContent = "No encontré tu modelo. Copia la carpeta mi_modelo (con model.json, metadata.json y weights.bin) dentro de la carpeta de este proyecto.";
    botonCamara.disabled = false;
    botonCamara.textContent = "Encender cámara";
    return;
  }

  try {
    camara = new tmImage.Webcam(320, 240, true); // ancho, alto, efecto espejo
    await camara.setup();                         // pide permiso para la cámara
    await camara.play();
  } catch (error) {
    console.error(error);
    aviso.textContent = "No se pudo encender la cámara. Da permiso a la cámara y cierra otras apps que la estén usando.";
    botonCamara.disabled = false;
    botonCamara.textContent = "Encender cámara";
    return;
  }

  contenedorCamara.innerHTML = "";
  contenedorCamara.appendChild(camara.canvas);
  botonCamara.textContent = "Cámara encendida";
  window.requestAnimationFrame(ciclo);
}

// ---------- 3. El ciclo: en cada cuadro la IA mira la cámara ----------
async function ciclo() {
  camara.update();
  await predecir();
  window.requestAnimationFrame(ciclo);
}

async function predecir() {
  // predicciones = [{ className: "Piedra", probability: 0.92 }, ...]
  const predicciones = await modelo.predict(camara.canvas);

  if (barras.children.length === 0) {
    crearBarras(predicciones);
  }

  let mejor = 0;
  for (let i = 0; i < predicciones.length; i++) {
    actualizarBarra(i, predicciones[i].probability);
    if (predicciones[i].probability > predicciones[mejor].probability) {
      mejor = i;
    }
  }

  const ganadora = predicciones[mejor];
  if (ganadora.probability >= CONFIANZA_MINIMA) {
    aplicarAccion(ganadora.className, mejor, ganadora.probability);
  } else {
    confianza.textContent = "No estoy segura... (" + Math.round(ganadora.probability * 100) + " %)";
  }
}

// ---------- 4. La acción ----------
function aplicarAccion(nombreClase, posicion, probabilidad) {
  const accion = accionDe(nombreClase, posicion);

  zonaAccion.style.backgroundColor = accion.color;
  zonaAccion.style.color = accion.texto;
  emoji.textContent = accion.emoji;
  mensaje.textContent = accion.mensaje;
  confianza.textContent = "Segura al " + Math.round(probabilidad * 100) + " %";

  // Contamos solo cuando CAMBIA el gesto (no 60 veces por segundo)
  if (nombreClase !== gestoActual) {
    gestoActual = nombreClase;
    contadores[nombreClase] = (contadores[nombreClase] || 0) + 1;
    dibujarContadores();
  }
}

function dibujarContadores() {
  contenedorContadores.innerHTML = "";
  const nombres = Object.keys(contadores);
  for (let i = 0; i < nombres.length; i++) {
    const etiqueta = document.createElement("span");
    etiqueta.className = "contador";
    etiqueta.textContent = nombres[i] + ": " + contadores[nombres[i]];
    contenedorContadores.appendChild(etiqueta);
  }
}

// ---------- Barras de confianza ----------
function crearBarras(predicciones) {
  for (let i = 0; i < predicciones.length; i++) {
    const fila = document.createElement("div");
    fila.className = "barra";
    fila.innerHTML =
      '<span class="nombre"></span>' +
      '<span class="fondo"><span class="relleno"></span></span>' +
      '<span class="porcentaje">0 %</span>';
    fila.querySelector(".nombre").textContent = predicciones[i].className;
    barras.appendChild(fila);
  }
}

function actualizarBarra(posicion, probabilidad) {
  const fila = barras.children[posicion];
  const porcentaje = Math.round(probabilidad * 100);
  fila.querySelector(".relleno").style.width = porcentaje + "%";
  fila.querySelector(".porcentaje").textContent = porcentaje + " %";
}

// ---------- Eventos ----------
botonCamara.addEventListener("click", encenderCamara);
revisarRequisitos();
