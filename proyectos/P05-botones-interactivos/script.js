// ===== Clase 5: funciones, eventos y repeticiones =====

// ---------- 1. Contador ----------
let meGusta = 0;

const botonMeGusta = document.querySelector("#boton-me-gusta");
const textoContador = document.querySelector("#contador");
const mensajeContador = document.querySelector("#mensaje-contador");

// Evento: "cuando hagan clic en este botón, ejecuta esta receta"
botonMeGusta.addEventListener("click", function () {
  meGusta = meGusta + 1;
  textoContador.textContent = meGusta;

  // Reto para casa: un mensaje especial al llegar a 10 clics
  if (meGusta === 10) {
    mensajeContador.textContent = "¡Llegaste a 10! 🎉";
  }
});

// ---------- 2. Color al azar ----------
// Una función que devuelve un número entero al azar entre 0 y maximo
function numeroAlAzar(maximo) {
  return Math.floor(Math.random() * (maximo + 1));
}

// Convierte un número (0 a 255) a dos letras hexadecimales, por ejemplo 255 → "FF"
function aHexadecimal(numero) {
  let texto = numero.toString(16).toUpperCase();
  if (texto.length < 2) {
    texto = "0" + texto;
  }
  return texto;
}

function colorAlAzar() {
  const rojo = numeroAlAzar(255);
  const verde = numeroAlAzar(255);
  const azul = numeroAlAzar(255);
  return "#" + aHexadecimal(rojo) + aHexadecimal(verde) + aHexadecimal(azul);
}

const botonColor = document.querySelector("#boton-color");
const codigoColor = document.querySelector("#codigo-color");

botonColor.addEventListener("click", function () {
  const nuevoColor = colorAlAzar();
  document.body.style.backgroundColor = nuevoColor;
  codigoColor.textContent = nuevoColor;
});

// ---------- 3. Mensaje sorpresa ----------
// PERSONALIZA: escribe tus propios mensajes
const mensajes = [
  "¡Hoy vas a programar algo increíble!",
  "Un error es solo una pista para mejorar.",
  "La computadora hace exactamente lo que le dices.",
  "Paso a paso se llega lejos.",
  "¡Tu juego va a quedar genial!"
];

const botonSorpresa = document.querySelector("#boton-sorpresa");
const mensajeSorpresa = document.querySelector("#mensaje-sorpresa");

botonSorpresa.addEventListener("click", function () {
  const posicion = numeroAlAzar(mensajes.length - 1);
  mensajeSorpresa.textContent = mensajes[posicion];
});

// ---------- 4. Repeticiones con for ----------
// Repite 10 veces sin copiar y pegar
let estrellas = "";
for (let i = 0; i < 10; i = i + 1) {
  estrellas = estrellas + "★";
}
document.querySelector("#estrellas").textContent = estrellas;

// ---------- 5. Mover un cuadro con las flechas ----------
// Esta es la base de los juegos retro del proyecto final
const zona = document.querySelector("#zona");
const cuadro = document.querySelector("#cuadro");
const PASO = 20; // cuántos píxeles se mueve en cada tecla

let x = 0;
let y = 0;

// El evento "keydown" ocurre cada vez que se presiona una tecla
document.addEventListener("keydown", function (evento) {
  // evento.key dice qué tecla se presionó
  if (evento.key === "ArrowRight") {
    x = x + PASO;
  } else if (evento.key === "ArrowLeft") {
    x = x - PASO;
  } else if (evento.key === "ArrowDown") {
    y = y + PASO;
  } else if (evento.key === "ArrowUp") {
    y = y - PASO;
  } else {
    return; // otra tecla: no hacemos nada
  }

  // Evita que la página se desplace con las flechas
  evento.preventDefault();

  // No dejamos que el cuadro se salga de la zona
  const maximoX = zona.clientWidth - cuadro.offsetWidth;
  const maximoY = zona.clientHeight - cuadro.offsetHeight;
  if (x < 0) { x = 0; }
  if (y < 0) { y = 0; }
  if (x > maximoX) { x = maximoX; }
  if (y > maximoY) { y = maximoY; }

  cuadro.style.left = x + "px";
  cuadro.style.top = y + "px";
});
