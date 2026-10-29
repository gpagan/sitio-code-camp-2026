// ===== J12 · Simón dice =====
// Simón muestra una secuencia de colores que crece una por ronda.
// El jugador debe repetirla en el mismo orden.

// ---------- PERSONALIZA ----------
const NOTAS = [329.63, 261.63, 220.0, 164.81]; // frecuencias en hertz de cada color (mi, do, la, mi)
const DURACION_LUZ = 450;    // milisegundos que se enciende cada color
const PAUSA_ENTRE_LUCES = 180;

// ---------- Variables del juego ----------
let secuencia = [];      // la lista de colores de Simón, por ejemplo [2, 0, 3]
let posicionJugador = 0; // qué color de la secuencia toca repetir
let turnoDelJugador = false;
let record = 0;
let audio = null;        // el "sintetizador" del navegador (Web Audio)

// ---------- Elementos de la página ----------
const botones = document.querySelectorAll(".color");
const textoRonda = document.querySelector("#ronda");
const textoRecord = document.querySelector("#record");
const centro = document.querySelector("#centro");
const mensaje = document.querySelector("#mensaje");
const botonIniciar = document.querySelector("#boton-iniciar");

// Una pausa que se puede "esperar" con await
function esperar(milisegundos) {
  return new Promise(function (resolver) {
    setTimeout(resolver, milisegundos);
  });
}

// ---------- Sonido ----------
function tocarNota(color, duracion) {
  if (audio === null) {
    return;
  }
  const oscilador = audio.createOscillator(); // genera un tono
  const volumen = audio.createGain();         // controla el volumen
  oscilador.type = "sine";
  oscilador.frequency.value = NOTAS[color];
  volumen.gain.value = 0.15;
  oscilador.connect(volumen);
  volumen.connect(audio.destination);
  oscilador.start();
  oscilador.stop(audio.currentTime + duracion / 1000);
}

function tocarError() {
  if (audio === null) {
    return;
  }
  const oscilador = audio.createOscillator();
  const volumen = audio.createGain();
  oscilador.type = "sawtooth";
  oscilador.frequency.value = 110;
  volumen.gain.value = 0.12;
  oscilador.connect(volumen);
  volumen.connect(audio.destination);
  oscilador.start();
  oscilador.stop(audio.currentTime + 0.5);
}

// ---------- Luces ----------
async function encender(color, duracion) {
  botones[color].classList.add("encendido");
  tocarNota(color, duracion);
  await esperar(duracion);
  botones[color].classList.remove("encendido");
}

function activarBotones(activos) {
  for (let i = 0; i < botones.length; i++) {
    botones[i].disabled = !activos;
  }
}

// ---------- El juego ----------
async function iniciar() {
  // El navegador solo deja hacer sonido después de un clic del usuario
  if (audio === null) {
    try {
      audio = new AudioContext();
    } catch (error) {
      console.log("Sin sonido:", error);
    }
  }
  secuencia = [];
  botonIniciar.hidden = true;
  await siguienteRonda();
}

async function siguienteRonda() {
  turnoDelJugador = false;
  activarBotones(false);
  posicionJugador = 0;

  // Agregamos un color al azar a la secuencia
  secuencia.push(Math.floor(Math.random() * 4));
  textoRonda.textContent = secuencia.length;
  centro.textContent = "Mira";
  mensaje.textContent = "Mira la secuencia...";

  await esperar(600);

  // Mostramos toda la secuencia, color por color
  for (let i = 0; i < secuencia.length; i++) {
    await encender(secuencia[i], DURACION_LUZ);
    await esperar(PAUSA_ENTRE_LUCES);
  }

  centro.textContent = "Tú";
  mensaje.textContent = "Tu turno: repite la secuencia";
  turnoDelJugador = true;
  activarBotones(true);
}

async function presionar(color) {
  if (!turnoDelJugador) {
    return;
  }

  encender(color, 250); // sin await: se enciende mientras seguimos

  if (color !== secuencia[posicionJugador]) {
    perder();
    return;
  }

  posicionJugador = posicionJugador + 1;

  // ¿Completó toda la secuencia?
  if (posicionJugador === secuencia.length) {
    turnoDelJugador = false;
    activarBotones(false);
    if (secuencia.length > record) {
      record = secuencia.length;
      textoRecord.textContent = record;
    }
    mensaje.textContent = "¡Bien! Ronda " + secuencia.length + " superada";
    await esperar(700);
    await siguienteRonda();
  }
}

function perder() {
  turnoDelJugador = false;
  activarBotones(false);
  tocarError();
  centro.textContent = "Fin";
  mensaje.textContent = "¡Ups! Llegaste a la ronda " + secuencia.length + ".";
  botonIniciar.textContent = "Jugar otra vez";
  botonIniciar.hidden = false;
}

// ---------- Eventos ----------
for (let i = 0; i < botones.length; i++) {
  botones[i].addEventListener("click", function () {
    presionar(Number(botones[i].dataset.color));
  });
}

botonIniciar.addEventListener("click", iniciar);
activarBotones(false);
