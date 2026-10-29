// ===== P14 · La cámara en mi página =====
// navigator.mediaDevices.getUserMedia pide permiso para usar la cámara.
// Lo que capta la cámara se muestra en una etiqueta <video>.

const video = document.querySelector("#video");
const aviso = document.querySelector("#aviso");
const botonCamara = document.querySelector("#boton-camara");
const botonFoto = document.querySelector("#boton-foto");
const casillaEspejo = document.querySelector("#espejo");
const botonesFiltro = document.querySelectorAll(".filtro");
const lienzo = document.querySelector("#lienzo");
const contenedorFotos = document.querySelector("#fotos");

// PERSONALIZA: cuántas fotos guardar como máximo en la página
const MAXIMO_DE_FOTOS = 6;

let flujo = null;          // el "flujo" de video que da la cámara
let filtroActual = "none";

// ---------- Encender y apagar ----------
async function encenderCamara() {
  // Algunos navegadores no tienen cámara disponible si la página no se abre bien
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    aviso.textContent = "Este navegador no deja usar la cámara aquí. Abre la página con Live Server en Google Chrome.";
    return;
  }

  botonCamara.disabled = true;
  aviso.textContent = "Pidiendo permiso para usar la cámara...";

  try {
    // await = "espera a que el usuario dé permiso"
    flujo = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    video.srcObject = flujo;
    aviso.hidden = true;
    botonCamara.textContent = "Apagar cámara";
    botonFoto.disabled = false;
  } catch (error) {
    console.error(error);
    // error.name dice qué pasó
    if (error.name === "NotAllowedError") {
      aviso.textContent = "No diste permiso. Haz clic en el candado junto a la dirección y permite la cámara.";
    } else if (error.name === "NotFoundError") {
      aviso.textContent = "No se encontró ninguna cámara. ¿Está conectada?";
    } else if (error.name === "NotReadableError") {
      aviso.textContent = "La cámara está ocupada. Cierra Meet o Zoom un momento e intenta otra vez.";
    } else {
      aviso.textContent = "No se pudo encender la cámara: " + error.name;
    }
  }
  botonCamara.disabled = false;
}

function apagarCamara() {
  // Detenemos cada "pista" del flujo (así se apaga la luz de la cámara)
  const pistas = flujo.getTracks();
  for (let i = 0; i < pistas.length; i++) {
    pistas[i].stop();
  }
  flujo = null;
  video.srcObject = null;
  aviso.hidden = false;
  aviso.textContent = "La cámara está apagada";
  botonCamara.textContent = "Encender cámara";
  botonFoto.disabled = true;
}

function encenderOApagar() {
  if (flujo === null) {
    encenderCamara();
  } else {
    apagarCamara();
  }
}

// ---------- Espejo y filtros ----------
function aplicarEspejo() {
  if (casillaEspejo.checked) {
    video.classList.add("espejo");
  } else {
    video.classList.remove("espejo");
  }
}

function elegirFiltro(boton) {
  filtroActual = boton.dataset.filtro;
  video.style.filter = filtroActual;   // el mismo "filter" de CSS
  for (let i = 0; i < botonesFiltro.length; i++) {
    botonesFiltro[i].classList.remove("activo");
  }
  boton.classList.add("activo");
}

// ---------- Tomar una foto ----------
function tomarFoto() {
  const ancho = video.videoWidth;
  const alto = video.videoHeight;
  if (!ancho || !alto) {
    return; // el video todavía no tiene imagen
  }

  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d");

  ctx.save();
  ctx.filter = filtroActual;            // mismo filtro que se ve en pantalla
  if (casillaEspejo.checked) {
    // Para el espejo: movemos el origen a la derecha y volteamos
    ctx.translate(ancho, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, ancho, alto); // "congela" el cuadro actual
  ctx.restore();

  // Convertimos el dibujo en una imagen
  const datosImagen = lienzo.toDataURL("image/png");

  const tarjeta = document.createElement("div");
  tarjeta.className = "foto";

  const imagen = document.createElement("img");
  imagen.src = datosImagen;
  imagen.alt = "Foto tomada con la cámara";

  const enlace = document.createElement("a");
  enlace.href = datosImagen;
  enlace.download = "mi-foto-" + Date.now() + ".png"; // descarga a tu computadora
  enlace.textContent = "Descargar";

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(enlace);
  contenedorFotos.prepend(tarjeta);

  // Borramos las fotos más viejas
  while (contenedorFotos.children.length > MAXIMO_DE_FOTOS) {
    contenedorFotos.removeChild(contenedorFotos.lastChild);
  }
}

// ---------- Eventos ----------
botonCamara.addEventListener("click", encenderOApagar);
botonFoto.addEventListener("click", tomarFoto);
casillaEspejo.addEventListener("change", aplicarEspejo);

for (let i = 0; i < botonesFiltro.length; i++) {
  botonesFiltro[i].addEventListener("click", function () {
    elegirFiltro(botonesFiltro[i]);
  });
}

aplicarEspejo();
