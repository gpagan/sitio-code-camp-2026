// ===== Rompe ladrillos (estilo Breakout) =====

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#0B1424";
const COLOR_PALETA = "#F6F4EE";
const COLOR_PELOTA = "#F6F4EE";
const COLORES_FILAS = ["#FF7A7A", "#FFB27A", "#F6D743", "#C8F25A", "#5AD1F2"];
const PUNTOS_POR_FILA = [50, 40, 30, 20, 10];
const VIDAS_INICIALES = 3;
const VELOCIDAD_PELOTA = 5;
const VELOCIDAD_PALETA = 9;

// ---------- Ladrillos ----------
const FILAS = 5;
const COLUMNAS = 10;
const ANCHO_LADRILLO = 68;
const ALTO_LADRILLO = 22;
const SEPARACION = 8;
const MARGEN_ARRIBA = 60;
// Centramos la pared de ladrillos
const MARGEN_IZQUIERDA = (ANCHO - (COLUMNAS * ANCHO_LADRILLO + (COLUMNAS - 1) * SEPARACION)) / 2;

// ---------- Objetos del juego ----------
const paleta = { ancho: 110, alto: 14, x: ANCHO / 2 - 55, y: ALTO - 40 };
const pelota = { x: 0, y: 0, radio: 9, vx: 0, vy: 0 };

let ladrillos = [];
let puntos = 0;
let vidas = VIDAS_INICIALES;
let estado = "esperando"; // "esperando", "jugando", "ganaste" o "perdiste"
let teclaIzquierda = false;
let teclaDerecha = false;

const textoPuntos = document.querySelector("#puntos");
const textoVidas = document.querySelector("#vidas");

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoVidas.textContent = vidas;
}

// Crea la pared: una lista con todos los ladrillos
function crearLadrillos() {
  ladrillos = [];
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      ladrillos.push({
        x: MARGEN_IZQUIERDA + columna * (ANCHO_LADRILLO + SEPARACION),
        y: MARGEN_ARRIBA + fila * (ALTO_LADRILLO + SEPARACION),
        fila: fila,
        activo: true
      });
    }
  }
}

function ponerPelotaEnPaleta() {
  pelota.x = paleta.x + paleta.ancho / 2;
  pelota.y = paleta.y - pelota.radio - 1;
  pelota.vx = 0;
  pelota.vy = 0;
}

function reiniciarJuego() {
  puntos = 0;
  vidas = VIDAS_INICIALES;
  crearLadrillos();
  estado = "esperando";
  ponerPelotaEnPaleta();
  actualizarMarcador();
}

// Espacio o clic: lanza la pelota, o empieza de nuevo si terminó
function lanzar() {
  if (estado === "esperando") {
    estado = "jugando";
    let direccion = 1;
    if (Math.random() < 0.5) {
      direccion = -1;
    }
    pelota.vx = 3 * direccion;
    pelota.vy = -VELOCIDAD_PELOTA;
  } else if (estado === "ganaste" || estado === "perdiste") {
    reiniciarJuego();
  }
}

// ---------- Movimiento ----------
function moverPaleta() {
  if (teclaIzquierda) {
    paleta.x = paleta.x - VELOCIDAD_PALETA;
  }
  if (teclaDerecha) {
    paleta.x = paleta.x + VELOCIDAD_PALETA;
  }
  paleta.x = limitar(paleta.x, 0, ANCHO - paleta.ancho);

  // Antes de lanzar, la pelota viaja sobre la paleta
  if (estado === "esperando") {
    ponerPelotaEnPaleta();
  }
}

function moverPelota() {
  pelota.x = pelota.x + pelota.vx;
  pelota.y = pelota.y + pelota.vy;

  // Paredes izquierda, derecha y techo
  if (pelota.x - pelota.radio < 0) {
    pelota.x = pelota.radio;
    pelota.vx = Math.abs(pelota.vx);
  }
  if (pelota.x + pelota.radio > ANCHO) {
    pelota.x = ANCHO - pelota.radio;
    pelota.vx = -Math.abs(pelota.vx);
  }
  if (pelota.y - pelota.radio < 0) {
    pelota.y = pelota.radio;
    pelota.vy = Math.abs(pelota.vy);
  }

  // Paleta: rebota con un ángulo según dónde pegó
  if (pelota.vy > 0 &&
      pelota.y + pelota.radio >= paleta.y &&
      pelota.y + pelota.radio <= paleta.y + paleta.alto + 8 &&
      pelota.x >= paleta.x - pelota.radio &&
      pelota.x <= paleta.x + paleta.ancho + pelota.radio) {
    pelota.y = paleta.y - pelota.radio;
    const impacto = (pelota.x - (paleta.x + paleta.ancho / 2)) / (paleta.ancho / 2); // de -1 a 1
    pelota.vx = impacto * 6;
    pelota.vy = -Math.abs(pelota.vy);
  }

  // Ladrillos
  for (let i = 0; i < ladrillos.length; i++) {
    const ladrillo = ladrillos[i];
    if (ladrillo.activo &&
        pelota.x + pelota.radio > ladrillo.x &&
        pelota.x - pelota.radio < ladrillo.x + ANCHO_LADRILLO &&
        pelota.y + pelota.radio > ladrillo.y &&
        pelota.y - pelota.radio < ladrillo.y + ALTO_LADRILLO) {
      ladrillo.activo = false;
      pelota.vy = -pelota.vy * 1.01; // cada ladrillo la acelera un poquito
      puntos = puntos + PUNTOS_POR_FILA[ladrillo.fila];
      actualizarMarcador();
      revisarSiGanaste();
      break; // un ladrillo por cuadro
    }
  }

  // Se cayó la pelota
  if (pelota.y - pelota.radio > ALTO) {
    vidas = vidas - 1;
    actualizarMarcador();
    if (vidas <= 0) {
      estado = "perdiste";
    } else {
      estado = "esperando";
    }
    ponerPelotaEnPaleta();
  }
}

function revisarSiGanaste() {
  for (let i = 0; i < ladrillos.length; i++) {
    if (ladrillos[i].activo) {
      return; // todavía queda al menos uno
    }
  }
  estado = "ganaste";
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujar() {
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Ladrillos
  for (let i = 0; i < ladrillos.length; i++) {
    const ladrillo = ladrillos[i];
    if (ladrillo.activo) {
      ctx.fillStyle = COLORES_FILAS[ladrillo.fila];
      ctx.fillRect(ladrillo.x, ladrillo.y, ANCHO_LADRILLO, ALTO_LADRILLO);
    }
  }

  // Paleta y pelota
  ctx.fillStyle = COLOR_PALETA;
  ctx.fillRect(paleta.x, paleta.y, paleta.ancho, paleta.alto);
  ctx.fillStyle = COLOR_PELOTA;
  ctx.beginPath();
  ctx.arc(pelota.x, pelota.y, pelota.radio, 0, Math.PI * 2);
  ctx.fill();

  // Mensajes
  if (estado === "esperando") {
    escribir("ESPACIO o clic para lanzar", ALTO / 2 + 60, 26, "#F6F4EE");
  } else if (estado === "ganaste") {
    escribir("¡Rompiste todos los ladrillos! 🏆", ALTO / 2, 40, "#C8F25A");
    escribir("ESPACIO o clic para jugar otra vez", ALTO / 2 + 50, 22, "#F6F4EE");
  } else if (estado === "perdiste") {
    escribir("Fin del juego", ALTO / 2, 48, "#FF7A7A");
    escribir("ESPACIO o clic para jugar otra vez", ALTO / 2 + 50, 22, "#F6F4EE");
  }
}

// ---------- El ciclo del juego ----------
function ciclo() {
  moverPaleta();
  if (estado === "jugando") {
    moverPelota();
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowLeft") {
    teclaIzquierda = true;
    evento.preventDefault();
  } else if (evento.key === "ArrowRight") {
    teclaDerecha = true;
    evento.preventDefault();
  } else if (evento.key === " ") {
    lanzar();
    evento.preventDefault();
  }
});

document.addEventListener("keyup", function (evento) {
  if (evento.key === "ArrowLeft") {
    teclaIzquierda = false;
  } else if (evento.key === "ArrowRight") {
    teclaDerecha = false;
  }
});

lienzo.addEventListener("mousemove", function (evento) {
  const rectangulo = lienzo.getBoundingClientRect();
  const x = (evento.clientX - rectangulo.left) * (ANCHO / rectangulo.width);
  paleta.x = limitar(x - paleta.ancho / 2, 0, ANCHO - paleta.ancho);
});

lienzo.addEventListener("click", lanzar);

// ¡Arrancamos!
reiniciarJuego();
ciclo();
