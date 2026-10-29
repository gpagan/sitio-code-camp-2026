// ===== Reto del reciclaje =====
// Aparece un objeto y el jugador hace clic en el bote correcto.

// ---------- PERSONALIZA ----------
const DURACION = 60;        // segundos de juego
const PUNTOS_ACIERTO = 10;
const PUNTOS_ERROR = 5;

// Los objetos del juego. "tipo" debe ser "plastico", "papel" o "vidrio".
const OBJETOS = [
  { nombre: "Vaso desechable", emoji: "🥤", tipo: "plastico" },
  { nombre: "Envase de champú", emoji: "🧴", tipo: "plastico" },
  { nombre: "Bolsa plástica", emoji: "🛍️", tipo: "plastico" },
  { nombre: "Cepillo de dientes", emoji: "🪥", tipo: "plastico" },
  { nombre: "Periódico", emoji: "📰", tipo: "papel" },
  { nombre: "Caja de cartón", emoji: "📦", tipo: "papel" },
  { nombre: "Cuaderno viejo", emoji: "📓", tipo: "papel" },
  { nombre: "Sobre de carta", emoji: "✉️", tipo: "papel" },
  { nombre: "Botella de vidrio", emoji: "🍾", tipo: "vidrio" },
  { nombre: "Vaso de vidrio", emoji: "🥛", tipo: "vidrio" },
  { nombre: "Copa de vidrio", emoji: "🍷", tipo: "vidrio" }
];

const NOMBRE_BOTE = { plastico: "plástico", papel: "papel", vidrio: "vidrio" };

// ---------- Variables del juego ----------
let puntos = 0;
let aciertos = 0;
let errores = 0;
let tiempo = DURACION;
let objetoActual = null;
let temporizador = null;
let enJuego = false;

// ---------- Elementos de la página ----------
const textoPuntos = document.querySelector("#puntos");
const textoTiempo = document.querySelector("#tiempo");
const textoAciertos = document.querySelector("#aciertos");
const objetoEmoji = document.querySelector("#objeto-emoji");
const objetoNombre = document.querySelector("#objeto-nombre");
const mensaje = document.querySelector("#mensaje");
const botonIniciar = document.querySelector("#boton-iniciar");
const botes = document.querySelectorAll(".bote");

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoTiempo.textContent = tiempo;
  textoAciertos.textContent = aciertos;
}

function activarBotes(activos) {
  for (let i = 0; i < botes.length; i++) {
    botes[i].disabled = !activos;
  }
}

function iniciar() {
  puntos = 0;
  aciertos = 0;
  errores = 0;
  tiempo = DURACION;
  enJuego = true;
  mensaje.textContent = "";
  mensaje.className = "mensaje";
  botonIniciar.hidden = true;
  activarBotes(true);
  actualizarMarcador();
  siguienteObjeto();
  temporizador = setInterval(cadaSegundo, 1000);
}

// Elige un objeto al azar, distinto del anterior
function siguienteObjeto() {
  let nuevo = objetoActual;
  while (nuevo === objetoActual) {
    nuevo = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
  }
  objetoActual = nuevo;
  objetoEmoji.textContent = objetoActual.emoji;
  objetoNombre.textContent = objetoActual.nombre;
}

function clasificar(tipoElegido) {
  if (!enJuego) {
    return;
  }

  if (tipoElegido === objetoActual.tipo) {
    puntos = puntos + PUNTOS_ACIERTO;
    aciertos = aciertos + 1;
    mensaje.textContent = "¡Correcto! +" + PUNTOS_ACIERTO;
    mensaje.className = "mensaje bien";
  } else {
    puntos = Math.max(0, puntos - PUNTOS_ERROR); // nunca menos de 0
    errores = errores + 1;
    mensaje.textContent = "Ups, " + objetoActual.nombre.toLowerCase() + " va en " + NOMBRE_BOTE[objetoActual.tipo] + ".";
    mensaje.className = "mensaje mal";
  }

  actualizarMarcador();
  siguienteObjeto();
}

function cadaSegundo() {
  tiempo = tiempo - 1;
  actualizarMarcador();
  if (tiempo <= 0) {
    terminar();
  }
}

function terminar() {
  clearInterval(temporizador);
  enJuego = false;
  activarBotes(false);
  objetoEmoji.textContent = "🏁";
  objetoNombre.textContent = "¡Se acabó el tiempo!";
  mensaje.textContent = "Lograste " + puntos + " puntos con " + aciertos + " aciertos y " + errores + " errores.";
  mensaje.className = "mensaje bien";
  botonIniciar.textContent = "Jugar otra vez";
  botonIniciar.hidden = false;
}

// ---------- Eventos ----------
botonIniciar.addEventListener("click", iniciar);

for (let i = 0; i < botes.length; i++) {
  botes[i].addEventListener("click", function () {
    clasificar(botes[i].dataset.tipo);
  });
}
