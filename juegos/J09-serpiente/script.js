// ===== Serpiente (estilo Snake) =====
// El tablero es una cuadrícula de 20 × 20 celdas.

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#0B1424";
const COLOR_CUADRICULA = "#101D33";
const COLOR_SERPIENTE = "#C8F25A";
const COLOR_CABEZA = "#8FC21E";
const COLOR_FRUTA = "#FF7A7A";
const VELOCIDAD_INICIAL = 140; // milisegundos entre cada paso (menos = más rápido)
const VELOCIDAD_MINIMA = 60;
const ACELERACION = 4;         // cuánto se acelera con cada fruta

// ---------- Cuadrícula ----------
const CELDAS = 20;
const TAMANO = ANCHO / CELDAS; // 30 píxeles por celda

// ---------- Variables del juego ----------
let serpiente = [];            // lista de celdas; la primera es la cabeza
let direccion = { x: 1, y: 0 };
let siguienteDireccion = { x: 1, y: 0 };
let fruta = { x: 0, y: 0 };
let puntos = 0;
let record = 0;
let velocidad = VELOCIDAD_INICIAL;
let estado = "esperando";      // "esperando", "jugando" o "fin"
let ultimoPaso = 0;

const textoPuntos = document.querySelector("#puntos");
const textoRecord = document.querySelector("#record");

function aleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoRecord.textContent = record;
}

function reiniciar() {
  serpiente = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direccion = { x: 1, y: 0 };
  siguienteDireccion = { x: 1, y: 0 };
  puntos = 0;
  velocidad = VELOCIDAD_INICIAL;
  colocarFruta();
  actualizarMarcador();
}

// ¿Hay un pedazo de serpiente en esta celda?
function estaEnSerpiente(x, y) {
  for (let i = 0; i < serpiente.length; i++) {
    if (serpiente[i].x === x && serpiente[i].y === y) {
      return true;
    }
  }
  return false;
}

// Pone la fruta en una celda libre al azar
function colocarFruta() {
  let libre = false;
  while (!libre) {
    fruta = { x: aleatorio(0, CELDAS - 1), y: aleatorio(0, CELDAS - 1) };
    libre = !estaEnSerpiente(fruta.x, fruta.y);
  }
}

// No se permite dar la vuelta en U (por ejemplo, de derecha a izquierda)
function cambiarDireccion(x, y) {
  if (x === -direccion.x && y === -direccion.y) {
    return;
  }
  siguienteDireccion = { x: x, y: y };
}

// Un paso de la serpiente
function paso() {
  direccion = siguienteDireccion;
  const cabeza = { x: serpiente[0].x + direccion.x, y: serpiente[0].y + direccion.y };

  // ¿Chocó con la pared o con su propia cola?
  const fueraDelTablero = cabeza.x < 0 || cabeza.x >= CELDAS || cabeza.y < 0 || cabeza.y >= CELDAS;
  if (fueraDelTablero || estaEnSerpiente(cabeza.x, cabeza.y)) {
    terminar();
    return;
  }

  serpiente.unshift(cabeza); // agrega la nueva cabeza al inicio

  if (cabeza.x === fruta.x && cabeza.y === fruta.y) {
    // Comió: crece (no quitamos la cola) y se acelera
    puntos = puntos + 1;
    velocidad = Math.max(VELOCIDAD_MINIMA, velocidad - ACELERACION);
    colocarFruta();
    actualizarMarcador();
  } else {
    serpiente.pop(); // quita la cola: así parece que avanza
  }
}

function terminar() {
  estado = "fin";
  if (puntos > record) {
    record = puntos;
  }
  actualizarMarcador();
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

  // Cuadrícula tipo tablero de ajedrez
  ctx.fillStyle = COLOR_CUADRICULA;
  for (let fila = 0; fila < CELDAS; fila++) {
    for (let columna = 0; columna < CELDAS; columna++) {
      if ((fila + columna) % 2 === 0) {
        ctx.fillRect(columna * TAMANO, fila * TAMANO, TAMANO, TAMANO);
      }
    }
  }

  // Fruta
  ctx.fillStyle = COLOR_FRUTA;
  ctx.beginPath();
  ctx.arc(fruta.x * TAMANO + TAMANO / 2, fruta.y * TAMANO + TAMANO / 2, TAMANO / 2 - 4, 0, Math.PI * 2);
  ctx.fill();

  // Serpiente
  for (let i = 0; i < serpiente.length; i++) {
    if (i === 0) {
      ctx.fillStyle = COLOR_CABEZA;
    } else {
      ctx.fillStyle = COLOR_SERPIENTE;
    }
    ctx.fillRect(serpiente[i].x * TAMANO + 2, serpiente[i].y * TAMANO + 2, TAMANO - 4, TAMANO - 4);
  }

  if (estado === "esperando") {
    escribir("Presiona ESPACIO para empezar", ALTO / 2 - 60, 28, "#F6F4EE");
  } else if (estado === "fin") {
    escribir("¡Chocaste!", ALTO / 2 - 20, 48, "#FF7A7A");
    escribir("Comiste " + puntos + " frutas · ESPACIO para jugar otra vez", ALTO / 2 + 30, 20, "#F6F4EE");
  }
}

// ---------- El ciclo del juego ----------
// "tiempo" lo da el navegador: los milisegundos desde que abrió la página
function ciclo(tiempo) {
  if (estado === "jugando" && tiempo - ultimoPaso >= velocidad) {
    ultimoPaso = tiempo;
    paso();
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowUp") {
    cambiarDireccion(0, -1);
  } else if (evento.key === "ArrowDown") {
    cambiarDireccion(0, 1);
  } else if (evento.key === "ArrowLeft") {
    cambiarDireccion(-1, 0);
  } else if (evento.key === "ArrowRight") {
    cambiarDireccion(1, 0);
  } else if (evento.key === " ") {
    if (estado !== "jugando") {
      reiniciar();
      estado = "jugando";
    }
  } else {
    return;
  }
  evento.preventDefault();
});

// ¡Arrancamos!
reiniciar();
requestAnimationFrame(ciclo);
