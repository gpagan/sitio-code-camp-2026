// ===== Memoria de parejas =====

// ---------- PERSONALIZA ----------
// Cambia los símbolos por los de tu tema favorito. Deben ser 8 distintos.
const SIMBOLOS = ["🐶", "🐱", "🦊", "🐼", "🐸", "🦁", "🐵", "🐧"];
const TIEMPO_PARA_VER = 900; // milisegundos que se ven dos cartas distintas

// ---------- Variables del juego ----------
let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;    // mientras se ocultan dos cartas, no se puede hacer clic
let intentos = 0;
let parejas = 0;
let segundos = 0;
let temporizador = null;

// ---------- Elementos de la página ----------
const tablero = document.querySelector("#tablero");
const textoIntentos = document.querySelector("#intentos");
const textoParejas = document.querySelector("#parejas");
const textoTiempo = document.querySelector("#tiempo");
const mensaje = document.querySelector("#mensaje");
const botonReiniciar = document.querySelector("#boton-reiniciar");

// Mezcla una lista (algoritmo de Fisher-Yates)
function mezclar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporal = copia[i];
    copia[i] = copia[j];
    copia[j] = temporal;
  }
  return copia;
}

function actualizarMarcador() {
  textoIntentos.textContent = intentos;
  textoParejas.textContent = parejas + " / " + SIMBOLOS.length;
  textoTiempo.textContent = segundos + " s";
}

function crearTablero() {
  // Reiniciamos todo
  clearInterval(temporizador);
  temporizador = null;
  primeraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  intentos = 0;
  parejas = 0;
  segundos = 0;
  mensaje.textContent = "";
  tablero.innerHTML = "";
  actualizarMarcador();

  // Cada símbolo aparece dos veces, en orden al azar
  const cartas = mezclar(SIMBOLOS.concat(SIMBOLOS));

  for (let i = 0; i < cartas.length; i++) {
    const carta = document.createElement("button");
    carta.className = "carta";
    carta.dataset.simbolo = cartas[i];
    carta.innerHTML = '<span class="tapa">?</span><span class="simbolo"></span>';
    carta.querySelector(".simbolo").textContent = cartas[i];
    carta.addEventListener("click", function () {
      voltear(carta);
    });
    tablero.appendChild(carta);
  }
}

function voltear(carta) {
  // Casos en los que no se hace nada
  if (bloqueado || carta === primeraCarta || carta.classList.contains("encontrada")) {
    return;
  }

  // El reloj empieza con la primera carta
  if (temporizador === null) {
    temporizador = setInterval(function () {
      segundos = segundos + 1;
      actualizarMarcador();
    }, 1000);
  }

  carta.classList.add("volteada");

  if (primeraCarta === null) {
    primeraCarta = carta;
    return;
  }

  segundaCarta = carta;
  intentos = intentos + 1;
  actualizarMarcador();
  revisarPareja();
}

function revisarPareja() {
  if (primeraCarta.dataset.simbolo === segundaCarta.dataset.simbolo) {
    primeraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    parejas = parejas + 1;
    primeraCarta = null;
    segundaCarta = null;
    actualizarMarcador();

    if (parejas === SIMBOLOS.length) {
      ganar();
    }
  } else {
    // No son pareja: las dejamos ver un momento y las volvemos a tapar
    bloqueado = true;
    setTimeout(function () {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      primeraCarta = null;
      segundaCarta = null;
      bloqueado = false;
    }, TIEMPO_PARA_VER);
  }
}

function ganar() {
  clearInterval(temporizador);
  mensaje.textContent = "🎉 ¡Lo lograste en " + intentos + " intentos y " + segundos + " segundos!";
}

botonReiniciar.addEventListener("click", crearTablero);

// Empezamos
crearTablero();
