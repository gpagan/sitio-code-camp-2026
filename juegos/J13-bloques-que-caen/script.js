// ===== Bloques que caen (estilo Tetris) =====
// El tablero es una cuadrícula de 10 columnas × 20 filas.

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const lienzoSiguiente = document.querySelector("#siguiente");
const ctxSiguiente = lienzoSiguiente.getContext("2d");

const COLUMNAS = 10;
const FILAS = 20;
const TAMANO = 30; // píxeles por celda

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#0B1424";
const COLOR_CUADRICULA = "#14223A";
const VELOCIDAD_INICIAL = 800;           // milisegundos entre cada caída
const PUNTOS_POR_LINEAS = [0, 100, 300, 500, 800]; // por 0, 1, 2, 3 o 4 líneas a la vez

// Las 7 piezas: 1 = hay bloque, 0 = vacío
const PIEZAS = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const COLORES = {
  I: "#5AD1F2", O: "#F6D743", T: "#B48CF2", S: "#7BDE6A",
  Z: "#FF7A7A", J: "#5B8CFF", L: "#FFB27A"
};

// ---------- Variables del juego ----------
let tablero = [];     // 20 filas × 10 columnas; null = vacío, o el color del bloque
let pieza = null;     // la pieza que está cayendo
let siguiente = null; // la pieza que viene después
let puntos = 0;
let lineas = 0;
let nivel = 1;
let intervaloCaida = VELOCIDAD_INICIAL;
let ultimaCaida = 0;
let estado = "esperando"; // "esperando", "jugando" o "fin"

const textoPuntos = document.querySelector("#puntos");
const textoLineas = document.querySelector("#lineas");
const textoNivel = document.querySelector("#nivel");

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoLineas.textContent = lineas;
  textoNivel.textContent = nivel;
}

function filaVacia() {
  const fila = [];
  for (let c = 0; c < COLUMNAS; c++) {
    fila.push(null);
  }
  return fila;
}

function crearTablero() {
  tablero = [];
  for (let f = 0; f < FILAS; f++) {
    tablero.push(filaVacia());
  }
}

// Copia una forma para no modificar la original al girarla
function copiarForma(forma) {
  const copia = [];
  for (let f = 0; f < forma.length; f++) {
    copia.push(forma[f].slice());
  }
  return copia;
}

function nuevaPieza() {
  const letras = Object.keys(PIEZAS); // ["I", "O", "T", ...]
  const letra = letras[Math.floor(Math.random() * letras.length)];
  const forma = copiarForma(PIEZAS[letra]);
  return {
    forma: forma,
    color: COLORES[letra],
    x: Math.floor((COLUMNAS - forma[0].length) / 2),
    y: 0
  };
}

// ¿Esta forma, en esta posición, choca con una pared, el piso u otro bloque?
function choca(forma, x, y) {
  for (let f = 0; f < forma.length; f++) {
    for (let c = 0; c < forma[f].length; c++) {
      if (forma[f][c] === 1) {
        const nuevaX = x + c;
        const nuevaY = y + f;
        if (nuevaX < 0 || nuevaX >= COLUMNAS || nuevaY >= FILAS) {
          return true;
        }
        if (nuevaY >= 0 && tablero[nuevaY][nuevaX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

// Gira una forma 90° a la derecha
function rotar(forma) {
  const nueva = [];
  for (let c = 0; c < forma[0].length; c++) {
    const fila = [];
    for (let f = forma.length - 1; f >= 0; f--) {
      fila.push(forma[f][c]);
    }
    nueva.push(fila);
  }
  return nueva;
}

function intentarRotar() {
  const rotada = rotar(pieza.forma);
  // Si choca al girar, probamos moverla un poco a los lados
  const desplazamientos = [0, -1, 1, -2, 2];
  for (let i = 0; i < desplazamientos.length; i++) {
    if (!choca(rotada, pieza.x + desplazamientos[i], pieza.y)) {
      pieza.forma = rotada;
      pieza.x = pieza.x + desplazamientos[i];
      return;
    }
  }
}

function mover(direccion) {
  if (!choca(pieza.forma, pieza.x + direccion, pieza.y)) {
    pieza.x = pieza.x + direccion;
  }
}

// Baja una fila. Si no puede, la pieza se queda fija.
function bajar() {
  if (!choca(pieza.forma, pieza.x, pieza.y + 1)) {
    pieza.y = pieza.y + 1;
    return true;
  }
  fijar();
  return false;
}

function soltarDeGolpe() {
  let filasBajadas = 0;
  while (!choca(pieza.forma, pieza.x, pieza.y + 1)) {
    pieza.y = pieza.y + 1;
    filasBajadas = filasBajadas + 1;
  }
  puntos = puntos + filasBajadas * 2;
  fijar();
}

// Copia la pieza al tablero y saca la siguiente
function fijar() {
  for (let f = 0; f < pieza.forma.length; f++) {
    for (let c = 0; c < pieza.forma[f].length; c++) {
      if (pieza.forma[f][c] === 1) {
        tablero[pieza.y + f][pieza.x + c] = pieza.color;
      }
    }
  }
  borrarLineas();

  pieza = siguiente;
  siguiente = nuevaPieza();
  dibujarSiguiente();

  // Si la nueva pieza ya choca al aparecer, se llenó el tablero
  if (choca(pieza.forma, pieza.x, pieza.y)) {
    estado = "fin";
  }
}

function filaCompleta(f) {
  for (let c = 0; c < COLUMNAS; c++) {
    if (tablero[f][c] === null) {
      return false;
    }
  }
  return true;
}

function borrarLineas() {
  let borradas = 0;
  for (let f = FILAS - 1; f >= 0; f--) {
    if (filaCompleta(f)) {
      tablero.splice(f, 1);           // quita la fila llena
      tablero.unshift(filaVacia());   // agrega una vacía arriba
      borradas = borradas + 1;
      f = f + 1;                      // revisa otra vez la misma posición
    }
  }

  if (borradas > 0) {
    puntos = puntos + PUNTOS_POR_LINEAS[borradas] * nivel;
    lineas = lineas + borradas;
    nivel = 1 + Math.floor(lineas / 10);
    intervaloCaida = Math.max(100, VELOCIDAD_INICIAL - (nivel - 1) * 70);
  }
  actualizarMarcador();
}

function empezar() {
  crearTablero();
  puntos = 0;
  lineas = 0;
  nivel = 1;
  intervaloCaida = VELOCIDAD_INICIAL;
  pieza = nuevaPieza();
  siguiente = nuevaPieza();
  dibujarSiguiente();
  actualizarMarcador();
  ultimaCaida = performance.now();
  estado = "jugando";
}

// ---------- Dibujo ----------
function dibujarCelda(contexto, x, y, color) {
  contexto.fillStyle = color;
  contexto.fillRect(x + 1, y + 1, TAMANO - 2, TAMANO - 2);
  contexto.fillStyle = "rgba(255, 255, 255, 0.25)"; // brillo arriba
  contexto.fillRect(x + 1, y + 1, TAMANO - 2, 4);
}

function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, lienzo.width / 2, y);
}

function dibujar() {
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);

  // Cuadrícula y bloques fijos
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      ctx.strokeStyle = COLOR_CUADRICULA;
      ctx.strokeRect(c * TAMANO, f * TAMANO, TAMANO, TAMANO);
      if (tablero[f] && tablero[f][c] !== null) {
        dibujarCelda(ctx, c * TAMANO, f * TAMANO, tablero[f][c]);
      }
    }
  }

  // La pieza que cae
  if (pieza !== null && estado === "jugando") {
    for (let f = 0; f < pieza.forma.length; f++) {
      for (let c = 0; c < pieza.forma[f].length; c++) {
        if (pieza.forma[f][c] === 1) {
          dibujarCelda(ctx, (pieza.x + c) * TAMANO, (pieza.y + f) * TAMANO, pieza.color);
        }
      }
    }
  }

  if (estado === "esperando") {
    escribir("ENTER o clic", 280, 26, "#F6F4EE");
    escribir("para empezar", 315, 26, "#F6F4EE");
  } else if (estado === "fin") {
    ctx.fillStyle = "rgba(11, 20, 36, 0.8)";
    ctx.fillRect(0, 230, lienzo.width, 120);
    escribir("Fin del juego", 280, 30, "#FF7A7A");
    escribir("ENTER para jugar otra vez", 320, 18, "#F6F4EE");
  }
}

function dibujarSiguiente() {
  ctxSiguiente.fillStyle = "#18283F";
  ctxSiguiente.fillRect(0, 0, lienzoSiguiente.width, lienzoSiguiente.height);
  const forma = siguiente.forma;
  // Centramos la pieza en la cajita
  const inicioX = (lienzoSiguiente.width - forma[0].length * TAMANO) / 2;
  const inicioY = (lienzoSiguiente.height - forma.length * TAMANO) / 2;
  for (let f = 0; f < forma.length; f++) {
    for (let c = 0; c < forma[f].length; c++) {
      if (forma[f][c] === 1) {
        dibujarCelda(ctxSiguiente, inicioX + c * TAMANO, inicioY + f * TAMANO, siguiente.color);
      }
    }
  }
}

// ---------- El ciclo del juego ----------
function ciclo(tiempo) {
  if (estado === "jugando" && tiempo - ultimaCaida >= intervaloCaida) {
    ultimaCaida = tiempo;
    bajar();
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter" && estado !== "jugando") {
    empezar();
    return;
  }
  if (estado !== "jugando") {
    return;
  }

  if (evento.key === "ArrowLeft") {
    mover(-1);
  } else if (evento.key === "ArrowRight") {
    mover(1);
  } else if (evento.key === "ArrowDown") {
    if (bajar()) {
      puntos = puntos + 1;
      actualizarMarcador();
    }
    ultimaCaida = performance.now();
  } else if (evento.key === "ArrowUp") {
    intentarRotar();
  } else if (evento.key === " ") {
    soltarDeGolpe();
  } else {
    return;
  }
  evento.preventDefault();
});

lienzo.addEventListener("click", function () {
  if (estado !== "jugando") {
    empezar();
  }
});

// ¡Arrancamos!
crearTablero();
requestAnimationFrame(ciclo);
