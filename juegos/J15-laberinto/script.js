// ===== J15 · Laberinto con niveles =====
// Cada nivel es una MATRIZ: una lista de filas, y cada fila es un texto.
// Cada letra es una casilla:
//   #  pared        .  piso         J  jugador (inicio)
//   L  llave        P  puerta       S  salida (meta)

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");

// ---------- PERSONALIZA: diseña tus propios niveles ----------
// Reglas: todas las filas del mismo largo, un solo J y un solo S,
// y al menos una llave por cada puerta.
const NIVELES = [
  [
    "###############",
    "#J..#.........#",
    "#.#.#.#####.#.#",
    "#.#...#...#.#.#",
    "#.#####.#.#.#.#",
    "#.....#.#...#.#",
    "#####.#.#####.#",
    "#.....#.....#.#",
    "#.#########.#.#",
    "#...........#S#",
    "###############"
  ],
  [
    "###############",
    "#J....#.....L.#",
    "#.###.#.#####.#",
    "#.#...#.....#.#",
    "#.#.#######.#.#",
    "#.#...........#",
    "#.#######.#####",
    "#.......#.....#",
    "#######.#.###.#",
    "#S.....P#.....#",
    "###############"
  ],
  [
    "###############",
    "#J.....#.....L#",
    "#.###.##.###..#",
    "#...#....#....#",
    "##########P####",
    "#L............#",
    "#.###########.#",
    "#.....#.......#",
    "#######P#######",
    "#S............#",
    "###############"
  ]
];

const COLORES = {
  pared: "#3A5274",
  piso: "#0B1424",
  jugador: "#C8F25A",
  salida: "#F6D743"
};

const TAMANO = 40; // píxeles por casilla

// ---------- Variables del juego ----------
let nivel = 0;
let mapa = [];          // la matriz del nivel actual (se puede modificar)
let jugador = { fila: 0, columna: 0 };
let llaves = 0;
let movimientos = 0;
let movimientosTotales = 0;
let estado = "jugando"; // "jugando", "pasando" o "ganaste"

const textoNivel = document.querySelector("#nivel");
const textoLlaves = document.querySelector("#llaves");
const textoMovimientos = document.querySelector("#movimientos");
const mensaje = document.querySelector("#mensaje");

function actualizarMarcador() {
  textoNivel.textContent = nivel + 1;
  textoLlaves.textContent = llaves;
  textoMovimientos.textContent = movimientos;
}

// Copia el nivel a una matriz de letras que sí podemos cambiar
// (por ejemplo, cuando recogemos una llave la casilla pasa a ser piso)
function cargarNivel(numero) {
  nivel = numero;
  mapa = [];
  for (let f = 0; f < NIVELES[numero].length; f++) {
    const fila = NIVELES[numero][f].split(""); // "#J.." → ["#", "J", ".", "."]
    for (let c = 0; c < fila.length; c++) {
      if (fila[c] === "J") {
        jugador = { fila: f, columna: c };
        fila[c] = ".";
      }
    }
    mapa.push(fila);
  }
  llaves = 0;
  movimientos = 0;
  estado = "jugando";
  mensaje.textContent = "Nivel " + (numero + 1) + " de " + NIVELES.length;

  // El lienzo se ajusta al tamaño del mapa
  lienzo.width = mapa[0].length * TAMANO;
  lienzo.height = mapa.length * TAMANO;
  actualizarMarcador();
}

// Intenta mover al jugador una casilla
function mover(df, dc) {
  if (estado !== "jugando") {
    return;
  }
  const f = jugador.fila + df;
  const c = jugador.columna + dc;
  const casilla = mapa[f][c];

  if (casilla === "#") {
    return; // pared: no se mueve
  }

  if (casilla === "P") {
    if (llaves === 0) {
      mensaje.textContent = "🔒 Necesitas una llave para abrir esta puerta.";
      return;
    }
    llaves = llaves - 1;
    mapa[f][c] = ".";     // la puerta se abre y desaparece
    mensaje.textContent = "🚪 ¡Abriste una puerta!";
  }

  if (casilla === "L") {
    llaves = llaves + 1;
    mapa[f][c] = ".";
    mensaje.textContent = "🔑 ¡Encontraste una llave!";
  }

  jugador = { fila: f, columna: c };
  movimientos = movimientos + 1;
  actualizarMarcador();

  if (casilla === "S") {
    completarNivel();
  }
}

function completarNivel() {
  movimientosTotales = movimientosTotales + movimientos;
  if (nivel === NIVELES.length - 1) {
    estado = "ganaste";
    mensaje.textContent = "🏆 ¡Terminaste los " + NIVELES.length + " niveles en " + movimientosTotales + " movimientos! Presiona Enter para jugar otra vez.";
  } else {
    estado = "pasando";
    mensaje.textContent = "🏁 ¡Nivel completado en " + movimientos + " movimientos!";
    setTimeout(function () {
      cargarNivel(nivel + 1);
    }, 900);
  }
}

// ---------- Dibujo ----------
function dibujarEmoji(emoji, f, c) {
  ctx.font = (TAMANO - 10) + "px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, c * TAMANO + TAMANO / 2, f * TAMANO + TAMANO / 2 + 2);
}

function dibujar() {
  for (let f = 0; f < mapa.length; f++) {
    for (let c = 0; c < mapa[f].length; c++) {
      const casilla = mapa[f][c];
      const x = c * TAMANO;
      const y = f * TAMANO;

      if (casilla === "#") {
        ctx.fillStyle = COLORES.pared;
        ctx.fillRect(x, y, TAMANO, TAMANO);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(x, y, TAMANO, 6);
      } else {
        ctx.fillStyle = COLORES.piso;
        ctx.fillRect(x, y, TAMANO, TAMANO);
      }

      if (casilla === "L") {
        dibujarEmoji("🔑", f, c);
      } else if (casilla === "P") {
        dibujarEmoji("🚪", f, c);
      } else if (casilla === "S") {
        ctx.fillStyle = COLORES.salida;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x, y, TAMANO, TAMANO);
        ctx.globalAlpha = 1;
        dibujarEmoji("🏁", f, c);
      }
    }
  }

  // El jugador: un círculo
  ctx.fillStyle = COLORES.jugador;
  ctx.beginPath();
  ctx.arc(jugador.columna * TAMANO + TAMANO / 2, jugador.fila * TAMANO + TAMANO / 2, TAMANO / 2 - 6, 0, Math.PI * 2);
  ctx.fill();
}

function ciclo() {
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowUp") {
    mover(-1, 0);
  } else if (evento.key === "ArrowDown") {
    mover(1, 0);
  } else if (evento.key === "ArrowLeft") {
    mover(0, -1);
  } else if (evento.key === "ArrowRight") {
    mover(0, 1);
  } else if (evento.key === "r" || evento.key === "R") {
    if (estado === "jugando") {
      cargarNivel(nivel);
    }
  } else if (evento.key === "Enter" && estado === "ganaste") {
    movimientosTotales = 0;
    cargarNivel(0);
  } else {
    return;
  }
  evento.preventDefault();
});

// ¡Arrancamos!
cargarNivel(0);
ciclo();
