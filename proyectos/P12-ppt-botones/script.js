// ===== P12 · Piedra, papel o tijera con botones =====
// Junta piezas de proyectos anteriores:
//   - P7: la computadora elige al azar de una lista
//   - P9: la cuenta regresiva 3, 2, 1
//   - P8: ganar, perder y reiniciar

// ---------- PERSONALIZA ----------
const PUNTOS_PARA_GANAR = 3;
const MILISEGUNDOS_CUENTA = 500;  // cuánto dura cada número de la cuenta
const RONDAS_EN_HISTORIAL = 5;

// ---------- Las reglas del juego ----------
const JUGADAS = ["piedra", "papel", "tijera"];
const EMOJIS = { piedra: "✊", papel: "✋", tijera: "✌️" };
// Qué le gana a qué: la piedra le gana a la tijera, etc.
const LE_GANA_A = { piedra: "tijera", papel: "piedra", tijera: "papel" };

// ---------- Variables del juego ----------
let puntosJugador = 0;
let puntosComputadora = 0;
let jugando = false;       // true mientras corre la cuenta regresiva
let partidaTerminada = false;

// ---------- Elementos de la página ----------
const textoPuntosJugador = document.querySelector("#puntos-jugador");
const textoPuntosComputadora = document.querySelector("#puntos-computadora");
const cuenta = document.querySelector("#cuenta");
const jugadaJugadorTexto = document.querySelector("#jugada-jugador");
const jugadaComputadoraTexto = document.querySelector("#jugada-computadora");
const resultado = document.querySelector("#resultado");
const botonesJugada = document.querySelectorAll(".jugada");
const botonNueva = document.querySelector("#boton-nueva");
const historial = document.querySelector("#historial");

// ---------- Funciones del juego ----------

// P7: elegir al azar
function jugadaDeLaComputadora() {
  return JUGADAS[Math.floor(Math.random() * JUGADAS.length)];
}

// Decide quién gana: devuelve "empate", "jugador" o "computadora"
function decidirGanador(jugadaJugador, jugadaComputadora) {
  if (jugadaJugador === jugadaComputadora) {
    return "empate";
  }
  if (LE_GANA_A[jugadaJugador] === jugadaComputadora) {
    return "jugador";
  }
  return "computadora";
}

function activarBotones(activos) {
  for (let i = 0; i < botonesJugada.length; i++) {
    botonesJugada[i].disabled = !activos;
  }
}

// P9: la cuenta regresiva. Al terminar, ejecuta la función "alTerminar".
function cuentaRegresiva(alTerminar) {
  let numero = 3;
  cuenta.textContent = numero;
  const intervalo = setInterval(function () {
    numero = numero - 1;
    if (numero > 0) {
      cuenta.textContent = numero;
    } else {
      clearInterval(intervalo);
      cuenta.textContent = "¡Ya!";
      alTerminar();
    }
  }, MILISEGUNDOS_CUENTA);
}

// Se llama cuando el jugador elige su jugada
function jugarRonda(jugadaJugador) {
  if (jugando || partidaTerminada) {
    return;
  }
  jugando = true;
  activarBotones(false);
  jugadaJugadorTexto.textContent = "❔";
  jugadaComputadoraTexto.textContent = "❔";
  resultado.textContent = "...";

  cuentaRegresiva(function () {
    resolverRonda(jugadaJugador);
    jugando = false;
    if (!partidaTerminada) {
      activarBotones(true);
    }
  });
}

// Muestra las jugadas, decide quién gana y actualiza el marcador
function resolverRonda(jugadaJugador) {
  const jugadaComputadora = jugadaDeLaComputadora();
  jugadaJugadorTexto.textContent = EMOJIS[jugadaJugador];
  jugadaComputadoraTexto.textContent = EMOJIS[jugadaComputadora];

  const ganador = decidirGanador(jugadaJugador, jugadaComputadora);
  if (ganador === "empate") {
    resultado.textContent = "¡Empate!";
  } else if (ganador === "jugador") {
    puntosJugador = puntosJugador + 1;
    resultado.textContent = "¡Ganaste esta ronda!";
  } else {
    puntosComputadora = puntosComputadora + 1;
    resultado.textContent = "La computadora gana esta ronda.";
  }

  textoPuntosJugador.textContent = puntosJugador;
  textoPuntosComputadora.textContent = puntosComputadora;
  agregarAlHistorial(jugadaJugador, jugadaComputadora, ganador);

  if (puntosJugador === PUNTOS_PARA_GANAR || puntosComputadora === PUNTOS_PARA_GANAR) {
    terminarPartida();
  }
}

function agregarAlHistorial(jugadaJugador, jugadaComputadora, ganador) {
  const textos = { empate: "empate", jugador: "ganaste", computadora: "perdiste" };
  const elemento = document.createElement("li");
  elemento.textContent = EMOJIS[jugadaJugador] + " vs " + EMOJIS[jugadaComputadora] + " → " + textos[ganador];
  historial.prepend(elemento); // la más nueva arriba
  while (historial.children.length > RONDAS_EN_HISTORIAL) {
    historial.removeChild(historial.lastChild);
  }
}

function terminarPartida() {
  partidaTerminada = true;
  activarBotones(false);
  if (puntosJugador > puntosComputadora) {
    resultado.textContent = "🏆 ¡Ganaste la partida " + puntosJugador + " a " + puntosComputadora + "!";
  } else {
    resultado.textContent = "🤖 La computadora ganó " + puntosComputadora + " a " + puntosJugador + ". ¡Revancha!";
  }
  botonNueva.hidden = false;
}

function nuevaPartida() {
  puntosJugador = 0;
  puntosComputadora = 0;
  partidaTerminada = false;
  textoPuntosJugador.textContent = 0;
  textoPuntosComputadora.textContent = 0;
  jugadaJugadorTexto.textContent = "❔";
  jugadaComputadoraTexto.textContent = "❔";
  cuenta.textContent = "";
  resultado.textContent = "¡Elige tu jugada!";
  historial.innerHTML = "";
  botonNueva.hidden = true;
  activarBotones(true);
}

// ---------- Eventos ----------
for (let i = 0; i < botonesJugada.length; i++) {
  botonesJugada[i].addEventListener("click", function () {
    jugarRonda(botonesJugada[i].dataset.jugada);
  });
}

botonNueva.addEventListener("click", nuevaPartida);
