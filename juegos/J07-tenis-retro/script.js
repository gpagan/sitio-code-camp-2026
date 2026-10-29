// ===== Tenis retro (estilo Pong) =====
// Dos paletas y una pelota. La computadora controla la paleta de la derecha.

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d"); // el "pincel" para dibujar en el lienzo
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#0B1424";
const COLOR_JUGADOR = "#C8F25A";
const COLOR_COMPUTADORA = "#5AD1F2";
const COLOR_PELOTA = "#F6F4EE";
const PUNTOS_PARA_GANAR = 5;
const VELOCIDAD_JUGADOR = 7;
const VELOCIDAD_COMPUTADORA = 4.5; // más alto = computadora más difícil
const VELOCIDAD_PELOTA = 5;
const VELOCIDAD_MAXIMA = 13;

// ---------- Objetos del juego ----------
const ANCHO_PALETA = 14;
const ALTO_PALETA = 90;
const jugador = { x: 24, y: ALTO / 2 - ALTO_PALETA / 2 };
const computadora = { x: ANCHO - 24 - ANCHO_PALETA, y: ALTO / 2 - ALTO_PALETA / 2 };
const pelota = { x: ANCHO / 2, y: ALTO / 2, radio: 9, vx: 0, vy: 0 };

let puntosJugador = 0;
let puntosComputadora = 0;
let estado = "esperando"; // "esperando", "jugando" o "fin"
let teclaArriba = false;
let teclaAbajo = false;

const textoJugador = document.querySelector("#puntos-jugador");
const textoComputadora = document.querySelector("#puntos-computadora");

// ---------- Funciones de ayuda ----------
// Mantiene un valor entre un mínimo y un máximo
function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function actualizarMarcador() {
  textoJugador.textContent = puntosJugador;
  textoComputadora.textContent = puntosComputadora;
}

// Pone la pelota en el centro y la lanza hacia un lado (1 = derecha, -1 = izquierda)
function sacar(direccion) {
  pelota.x = ANCHO / 2;
  pelota.y = ALTO / 2;
  pelota.vx = VELOCIDAD_PELOTA * direccion;
  pelota.vy = Math.random() * 6 - 3;
}

function empezar() {
  if (estado === "jugando") {
    return;
  }
  if (estado === "fin") {
    puntosJugador = 0;
    puntosComputadora = 0;
    actualizarMarcador();
  }
  estado = "jugando";
  let direccion = 1;
  if (Math.random() < 0.5) {
    direccion = -1;
  }
  sacar(direccion);
}

// ---------- Movimiento ----------
function moverPaletas() {
  if (teclaArriba) {
    jugador.y = jugador.y - VELOCIDAD_JUGADOR;
  }
  if (teclaAbajo) {
    jugador.y = jugador.y + VELOCIDAD_JUGADOR;
  }
  jugador.y = limitar(jugador.y, 0, ALTO - ALTO_PALETA);

  // La "inteligencia" de la computadora: sigue a la pelota, pero con velocidad limitada
  const centro = computadora.y + ALTO_PALETA / 2;
  if (centro < pelota.y - 10) {
    computadora.y = computadora.y + VELOCIDAD_COMPUTADORA;
  } else if (centro > pelota.y + 10) {
    computadora.y = computadora.y - VELOCIDAD_COMPUTADORA;
  }
  computadora.y = limitar(computadora.y, 0, ALTO - ALTO_PALETA);
}

// ¿La pelota toca esta paleta?
function tocaPaleta(paleta) {
  return pelota.x + pelota.radio > paleta.x &&
         pelota.x - pelota.radio < paleta.x + ANCHO_PALETA &&
         pelota.y + pelota.radio > paleta.y &&
         pelota.y - pelota.radio < paleta.y + ALTO_PALETA;
}

// Rebota más hacia arriba o hacia abajo según dónde pegó en la paleta
function rebotarEnPaleta(paleta, direccion) {
  const impacto = (pelota.y - (paleta.y + ALTO_PALETA / 2)) / (ALTO_PALETA / 2); // de -1 a 1
  const velocidad = Math.min(Math.abs(pelota.vx) * 1.06, VELOCIDAD_MAXIMA);
  pelota.vx = velocidad * direccion;
  pelota.vy = impacto * 6;
}

function moverPelota() {
  pelota.x = pelota.x + pelota.vx;
  pelota.y = pelota.y + pelota.vy;

  // Rebote arriba y abajo
  if (pelota.y - pelota.radio < 0) {
    pelota.y = pelota.radio;
    pelota.vy = -pelota.vy;
  }
  if (pelota.y + pelota.radio > ALTO) {
    pelota.y = ALTO - pelota.radio;
    pelota.vy = -pelota.vy;
  }

  // Rebote en las paletas
  if (pelota.vx < 0 && tocaPaleta(jugador)) {
    pelota.x = jugador.x + ANCHO_PALETA + pelota.radio;
    rebotarEnPaleta(jugador, 1);
  }
  if (pelota.vx > 0 && tocaPaleta(computadora)) {
    pelota.x = computadora.x - pelota.radio;
    rebotarEnPaleta(computadora, -1);
  }

  // ¿Alguien anotó?
  if (pelota.x < -pelota.radio) {
    puntosComputadora = puntosComputadora + 1;
    anotar(1);
  } else if (pelota.x > ANCHO + pelota.radio) {
    puntosJugador = puntosJugador + 1;
    anotar(-1);
  }
}

function anotar(direccionDelSaque) {
  actualizarMarcador();
  if (puntosJugador >= PUNTOS_PARA_GANAR || puntosComputadora >= PUNTOS_PARA_GANAR) {
    estado = "fin";
    pelota.x = ANCHO / 2;
    pelota.y = ALTO / 2;
    pelota.vx = 0;
    pelota.vy = 0;
  } else {
    sacar(direccionDelSaque);
  }
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujar() {
  // Fondo
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Línea punteada del centro
  ctx.strokeStyle = "#23354F";
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 14]);
  ctx.beginPath();
  ctx.moveTo(ANCHO / 2, 0);
  ctx.lineTo(ANCHO / 2, ALTO);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paletas
  ctx.fillStyle = COLOR_JUGADOR;
  ctx.fillRect(jugador.x, jugador.y, ANCHO_PALETA, ALTO_PALETA);
  ctx.fillStyle = COLOR_COMPUTADORA;
  ctx.fillRect(computadora.x, computadora.y, ANCHO_PALETA, ALTO_PALETA);

  // Pelota
  ctx.fillStyle = COLOR_PELOTA;
  ctx.beginPath();
  ctx.arc(pelota.x, pelota.y, pelota.radio, 0, Math.PI * 2);
  ctx.fill();

  // Mensajes
  if (estado === "esperando") {
    escribir("Presiona ESPACIO o haz clic para empezar", ALTO / 2 - 40, 26, "#F6F4EE");
  } else if (estado === "fin") {
    if (puntosJugador > puntosComputadora) {
      escribir("¡Ganaste! 🏆", ALTO / 2 - 50, 48, COLOR_JUGADOR);
    } else {
      escribir("La computadora ganó", ALTO / 2 - 50, 48, COLOR_COMPUTADORA);
    }
    escribir("ESPACIO o clic para jugar otra vez", ALTO / 2 + 50, 22, "#F6F4EE");
  }
}

// ---------- El ciclo del juego: se repite unas 60 veces por segundo ----------
function ciclo() {
  moverPaletas();
  if (estado === "jugando") {
    moverPelota();
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowUp") {
    teclaArriba = true;
    evento.preventDefault();
  } else if (evento.key === "ArrowDown") {
    teclaAbajo = true;
    evento.preventDefault();
  } else if (evento.key === " ") {
    empezar();
    evento.preventDefault();
  }
});

document.addEventListener("keyup", function (evento) {
  if (evento.key === "ArrowUp") {
    teclaArriba = false;
  } else if (evento.key === "ArrowDown") {
    teclaAbajo = false;
  }
});

// Con el mouse: la paleta sigue al puntero
lienzo.addEventListener("mousemove", function (evento) {
  const rectangulo = lienzo.getBoundingClientRect();
  const y = (evento.clientY - rectangulo.top) * (ALTO / rectangulo.height);
  jugador.y = limitar(y - ALTO_PALETA / 2, 0, ALTO - ALTO_PALETA);
});

lienzo.addEventListener("click", empezar);

// ¡Arrancamos!
ciclo();
