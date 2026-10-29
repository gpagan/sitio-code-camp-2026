// ===== J18 · Buscaminas =====
// El tablero es una MATRIZ (lista de filas). Cada casilla es un objeto:
//   { mina, abierta, bandera, vecinas }
// "vecinas" = cuántas minas hay en las 8 casillas de alrededor.

// ---------- PERSONALIZA ----------
const FILAS = 9;
const COLUMNAS = 9;
const MINAS = 10;

// ---------- Variables del juego ----------
let tablero = [];
let botones = [];          // los botones de la página, en la misma forma que el tablero
let minasColocadas = false; // las minas se ponen después del primer clic
let terminado = false;
let abiertas = 0;
let banderas = 0;
let segundos = 0;
let temporizador = null;

// ---------- Elementos de la página ----------
const contenedor = document.querySelector("#tablero");
const textoMinas = document.querySelector("#minas");
const textoTiempo = document.querySelector("#tiempo");
const botonCara = document.querySelector("#boton-cara");
const mensaje = document.querySelector("#mensaje");

// Las 8 direcciones alrededor de una casilla
const DIRECCIONES = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

function dentro(f, c) {
  return f >= 0 && f < FILAS && c >= 0 && c < COLUMNAS;
}

function crearTablero() {
  tablero = [];
  botones = [];
  contenedor.innerHTML = "";
  contenedor.style.gridTemplateColumns = "repeat(" + COLUMNAS + ", 40px)";

  for (let f = 0; f < FILAS; f++) {
    const fila = [];
    const filaBotones = [];
    for (let c = 0; c < COLUMNAS; c++) {
      fila.push({ mina: false, abierta: false, bandera: false, vecinas: 0 });

      const boton = document.createElement("button");
      boton.className = "casilla";
      boton.setAttribute("aria-label", "Fila " + (f + 1) + ", columna " + (c + 1));
      boton.addEventListener("click", function () {
        abrir(f, c);
      });
      // contextmenu = clic derecho
      boton.addEventListener("contextmenu", function (evento) {
        evento.preventDefault(); // que no salga el menú del navegador
        ponerBandera(f, c);
      });
      contenedor.appendChild(boton);
      filaBotones.push(boton);
    }
    tablero.push(fila);
    botones.push(filaBotones);
  }

  minasColocadas = false;
  terminado = false;
  abiertas = 0;
  banderas = 0;
  segundos = 0;
  clearInterval(temporizador);
  temporizador = null;
  textoMinas.textContent = MINAS;
  textoTiempo.textContent = 0;
  botonCara.textContent = "🙂";
  mensaje.textContent = "";
  mensaje.className = "mensaje";
}

// Pone las minas al azar, pero nunca en la primera casilla ni alrededor de ella
function colocarMinas(filaSegura, columnaSegura) {
  let puestas = 0;
  while (puestas < MINAS) {
    const f = Math.floor(Math.random() * FILAS);
    const c = Math.floor(Math.random() * COLUMNAS);
    const cerca = Math.abs(f - filaSegura) <= 1 && Math.abs(c - columnaSegura) <= 1;
    if (!tablero[f][c].mina && !cerca) {
      tablero[f][c].mina = true;
      puestas = puestas + 1;
    }
  }

  // Contamos las minas vecinas de cada casilla
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      let cuenta = 0;
      for (let i = 0; i < DIRECCIONES.length; i++) {
        const nf = f + DIRECCIONES[i][0];
        const nc = c + DIRECCIONES[i][1];
        if (dentro(nf, nc) && tablero[nf][nc].mina) {
          cuenta = cuenta + 1;
        }
      }
      tablero[f][c].vecinas = cuenta;
    }
  }
  minasColocadas = true;
}

function abrir(f, c) {
  const casilla = tablero[f][c];
  if (terminado || casilla.abierta || casilla.bandera) {
    return;
  }

  // Primer clic: ponemos las minas y arrancamos el reloj
  if (!minasColocadas) {
    colocarMinas(f, c);
    temporizador = setInterval(function () {
      segundos = segundos + 1;
      textoTiempo.textContent = segundos;
    }, 1000);
  }

  if (casilla.mina) {
    perder(f, c);
    return;
  }

  abrirZona(f, c);

  if (abiertas === FILAS * COLUMNAS - MINAS) {
    ganar();
  }
}

// RECURSIÓN: si una casilla no tiene minas vecinas, abrimos también
// a sus vecinas... y cada vecina hace lo mismo. Así se abren zonas enteras.
function abrirZona(f, c) {
  if (!dentro(f, c)) {
    return;
  }
  const casilla = tablero[f][c];
  if (casilla.abierta || casilla.bandera || casilla.mina) {
    return;
  }

  casilla.abierta = true;
  abiertas = abiertas + 1;
  const boton = botones[f][c];
  boton.classList.add("abierta");
  if (casilla.vecinas > 0) {
    boton.textContent = casilla.vecinas;
    boton.classList.add("n" + casilla.vecinas);
    return; // un número: aquí se detiene
  }

  // Cero minas alrededor: la función se llama a sí misma con cada vecina
  for (let i = 0; i < DIRECCIONES.length; i++) {
    abrirZona(f + DIRECCIONES[i][0], c + DIRECCIONES[i][1]);
  }
}

function ponerBandera(f, c) {
  const casilla = tablero[f][c];
  if (terminado || casilla.abierta) {
    return;
  }
  casilla.bandera = !casilla.bandera;
  if (casilla.bandera) {
    banderas = banderas + 1;
    botones[f][c].textContent = "🚩";
  } else {
    banderas = banderas - 1;
    botones[f][c].textContent = "";
  }
  textoMinas.textContent = MINAS - banderas;
}

function mostrarMinas() {
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      if (tablero[f][c].mina) {
        botones[f][c].textContent = "💣";
      }
    }
  }
}

function perder(f, c) {
  terminado = true;
  clearInterval(temporizador);
  mostrarMinas();
  botones[f][c].classList.add("mina");
  botonCara.textContent = "😵";
  mensaje.textContent = "¡Boom! Haz clic en la carita para jugar otra vez.";
  mensaje.className = "mensaje perdio";
}

function ganar() {
  terminado = true;
  clearInterval(temporizador);
  botonCara.textContent = "😎";
  mensaje.textContent = "🏆 ¡Ganaste en " + segundos + " segundos!";
  mensaje.className = "mensaje gano";
}

botonCara.addEventListener("click", crearTablero);

// Empezamos
crearTablero();
