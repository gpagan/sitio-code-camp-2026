// ===== J5 · Golpea al topo =====
// Cada cierto tiempo aparece un topo (o una bomba) en un hoyo al azar.

// ---------- PERSONALIZA ----------
const DURACION = 30;                 // segundos de juego
const TIEMPO_VISIBLE_INICIAL = 1100; // milisegundos que el topo se queda afuera
const TIEMPO_VISIBLE_MINIMO = 450;
const PROBABILIDAD_BOMBA = 0.15;     // 15 % de las veces sale una bomba
const TOPO = "🐹";
const BOMBA = "💣";

// ---------- Variables del juego ----------
let puntos = 0;
let record = 0;
let tiempo = DURACION;
let enJuego = false;
let hoyoActivo = -1;        // qué hoyo tiene algo afuera (-1 = ninguno)
let queHay = "";            // "topo" o "bomba"
let temporizadorReloj = null;
let temporizadorTopo = null;

// ---------- Elementos de la página ----------
const campo = document.querySelector("#campo");
const textoPuntos = document.querySelector("#puntos");
const textoTiempo = document.querySelector("#tiempo");
const textoRecord = document.querySelector("#record");
const mensaje = document.querySelector("#mensaje");
const botonIniciar = document.querySelector("#boton-iniciar");

// Creamos los 9 hoyos con un ciclo
const hoyos = [];
for (let i = 0; i < 9; i++) {
  const hoyo = document.createElement("button");
  hoyo.className = "hoyo";
  hoyo.setAttribute("aria-label", "Hoyo " + (i + 1));
  hoyo.addEventListener("click", function () {
    golpear(i);
  });
  campo.appendChild(hoyo);
  hoyos.push(hoyo);
}

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoTiempo.textContent = tiempo;
  textoRecord.textContent = record;
}

// Mientras más avanza el juego, menos tiempo se queda el topo afuera
function tiempoVisible() {
  const avance = (DURACION - tiempo) / DURACION; // de 0 a 1
  return Math.max(TIEMPO_VISIBLE_MINIMO, TIEMPO_VISIBLE_INICIAL - avance * 700);
}

function esconder() {
  if (hoyoActivo !== -1) {
    hoyos[hoyoActivo].textContent = "";
    hoyos[hoyoActivo].classList.remove("arriba");
  }
  hoyoActivo = -1;
  queHay = "";
}

function sacarAlgo() {
  esconder();
  if (!enJuego) {
    return;
  }

  // Elegimos un hoyo al azar
  hoyoActivo = Math.floor(Math.random() * hoyos.length);
  if (Math.random() < PROBABILIDAD_BOMBA) {
    queHay = "bomba";
    hoyos[hoyoActivo].textContent = BOMBA;
  } else {
    queHay = "topo";
    hoyos[hoyoActivo].textContent = TOPO;
  }
  hoyos[hoyoActivo].classList.add("arriba");

  // Se esconde solo después de un rato y sale otro
  temporizadorTopo = setTimeout(sacarAlgo, tiempoVisible());
}

function golpear(posicion) {
  if (!enJuego || posicion !== hoyoActivo) {
    return;
  }

  const hoyo = hoyos[posicion];
  if (queHay === "topo") {
    puntos = puntos + 1;
    hoyo.classList.add("golpe");
  } else {
    puntos = Math.max(0, puntos - 3);
    hoyo.classList.add("boom");
    mensaje.textContent = "¡Boom! −3 puntos";
  }
  // Quitamos el color después de un momento
  setTimeout(function () {
    hoyo.classList.remove("golpe", "boom");
  }, 200);

  actualizarMarcador();
  clearTimeout(temporizadorTopo);
  sacarAlgo();
}

function iniciar() {
  puntos = 0;
  tiempo = DURACION;
  enJuego = true;
  mensaje.textContent = "";
  botonIniciar.hidden = true;
  actualizarMarcador();
  sacarAlgo();

  temporizadorReloj = setInterval(function () {
    tiempo = tiempo - 1;
    actualizarMarcador();
    if (tiempo <= 0) {
      terminar();
    }
  }, 1000);
}

function terminar() {
  enJuego = false;
  clearInterval(temporizadorReloj);
  clearTimeout(temporizadorTopo);
  esconder();
  if (puntos > record) {
    record = puntos;
    mensaje.textContent = "🏆 ¡Nuevo récord: " + puntos + " topos!";
  } else {
    mensaje.textContent = "Golpeaste " + puntos + " topos.";
  }
  actualizarMarcador();
  botonIniciar.textContent = "Jugar otra vez";
  botonIniciar.hidden = false;
}

botonIniciar.addEventListener("click", iniciar);
