// ===== Profesor de matemáticas =====
// El profesor da un ejercicio con tiempo límite y el estudiante escribe la respuesta.

// ---------- PERSONALIZA ----------
const SEGUNDOS_POR_EJERCICIO = 10;
const ACIERTOS_PARA_SUBIR = 5;
const VIDAS_INICIALES = 3;

// Cada nivel dice qué operaciones usa y qué tan grandes son los números
const NIVELES = [
  { nombre: "Sumas", operaciones: ["+"], maximo: 10 },
  { nombre: "Sumas y restas", operaciones: ["+", "-"], maximo: 20 },
  { nombre: "Tablas de multiplicar", operaciones: ["×"], maximo: 10 },
  { nombre: "Todo mezclado", operaciones: ["+", "-", "×"], maximo: 12 },
  { nombre: "Reto final", operaciones: ["+", "-", "×", "÷"], maximo: 12 }
];

const FRASES_ACIERTO = ["¡Excelente!", "¡Muy bien!", "¡Eres un genio!", "¡Correcto!", "¡Sigue así!"];
const FRASES_ERROR = ["Casi, casi.", "No pasa nada, sigue intentando.", "Uy, esa no era."];

// ---------- Variables del juego ----------
let nivel = 0;              // posición en la lista NIVELES (0 = nivel 1)
let puntos = 0;
let vidas = VIDAS_INICIALES;
let aciertosEnNivel = 0;
let respuestaCorrecta = 0;
let decimasRestantes = 0;   // el tiempo, en décimas de segundo
let temporizador = null;
let enJuego = false;

// ---------- Elementos de la página ----------
const textoPuntos = document.querySelector("#puntos");
const textoNivel = document.querySelector("#nivel");
const textoVidas = document.querySelector("#vidas");
const profesor = document.querySelector("#profesor");
const nombreNivel = document.querySelector("#nombre-nivel");
const ejercicio = document.querySelector("#ejercicio");
const barraTiempo = document.querySelector("#tiempo-restante");
const campoRespuesta = document.querySelector("#respuesta");
const botonResponder = document.querySelector("#boton-responder");
const mensaje = document.querySelector("#mensaje");
const botonIniciar = document.querySelector("#boton-iniciar");

// Un número entero al azar entre minimo y maximo (incluidos)
function aleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoNivel.textContent = nivel + 1;
  textoVidas.textContent = "❤️".repeat(vidas) || "💔";
  nombreNivel.textContent = "Nivel " + (nivel + 1) + ": " + NIVELES[nivel].nombre;
}

function iniciar() {
  nivel = 0;
  puntos = 0;
  vidas = VIDAS_INICIALES;
  aciertosEnNivel = 0;
  enJuego = true;
  campoRespuesta.disabled = false;
  botonResponder.disabled = false;
  botonIniciar.hidden = true;
  mensaje.textContent = "";
  profesor.textContent = "👨‍🏫 ¡Vamos! Responde rápido.";
  actualizarMarcador();
  nuevoEjercicio();
}

// Crea un ejercicio según el nivel actual
function nuevoEjercicio() {
  const datos = NIVELES[nivel];
  const operacion = elegirAlAzar(datos.operaciones);
  let a = aleatorio(1, datos.maximo);
  let b = aleatorio(1, datos.maximo);

  if (operacion === "+") {
    respuestaCorrecta = a + b;
  } else if (operacion === "-") {
    // Para no tener resultados negativos, el primero siempre es el mayor
    if (b > a) {
      const temporal = a;
      a = b;
      b = temporal;
    }
    respuestaCorrecta = a - b;
  } else if (operacion === "×") {
    respuestaCorrecta = a * b;
  } else {
    // División exacta: primero inventamos la respuesta y luego el dividendo
    respuestaCorrecta = a;
    a = a * b;
  }

  ejercicio.textContent = a + " " + operacion + " " + b + " = ?";
  campoRespuesta.value = "";
  campoRespuesta.focus();

  // Reiniciamos el reloj
  clearInterval(temporizador);
  decimasRestantes = SEGUNDOS_POR_EJERCICIO * 10;
  dibujarTiempo();
  temporizador = setInterval(cadaDecima, 100);
}

function cadaDecima() {
  decimasRestantes = decimasRestantes - 1;
  dibujarTiempo();
  if (decimasRestantes <= 0) {
    perderVida("⏰ ¡Se acabó el tiempo! Era " + respuestaCorrecta + ".");
  }
}

function dibujarTiempo() {
  const porcentaje = (decimasRestantes / (SEGUNDOS_POR_EJERCICIO * 10)) * 100;
  barraTiempo.style.width = porcentaje + "%";
  if (porcentaje < 30) {
    barraTiempo.classList.add("poco");
  } else {
    barraTiempo.classList.remove("poco");
  }
}

function responder() {
  if (!enJuego || campoRespuesta.value === "") {
    return;
  }

  const respuesta = Number(campoRespuesta.value);

  if (respuesta === respuestaCorrecta) {
    // Más puntos si respondes rápido
    const bono = Math.ceil(decimasRestantes / 10);
    puntos = puntos + 10 + bono;
    aciertosEnNivel = aciertosEnNivel + 1;
    profesor.textContent = "👨‍🏫 " + elegirAlAzar(FRASES_ACIERTO);
    mensaje.textContent = "+" + (10 + bono) + " puntos";
    mensaje.className = "mensaje bien";

    if (aciertosEnNivel >= ACIERTOS_PARA_SUBIR && nivel < NIVELES.length - 1) {
      nivel = nivel + 1;
      aciertosEnNivel = 0;
      mensaje.textContent = "🎉 ¡Subiste al nivel " + (nivel + 1) + "!";
    }

    actualizarMarcador();
    nuevoEjercicio();
  } else {
    perderVida("❌ " + elegirAlAzar(FRASES_ERROR) + " La respuesta era " + respuestaCorrecta + ".");
  }
}

function perderVida(texto) {
  vidas = vidas - 1;
  mensaje.textContent = texto;
  mensaje.className = "mensaje mal";
  actualizarMarcador();

  if (vidas <= 0) {
    terminar();
  } else {
    nuevoEjercicio();
  }
}

function terminar() {
  clearInterval(temporizador);
  enJuego = false;
  campoRespuesta.disabled = true;
  botonResponder.disabled = true;
  ejercicio.textContent = "Fin";
  profesor.textContent = "👨‍🏫 ¡Buen trabajo! Llegaste al nivel " + (nivel + 1) + " con " + puntos + " puntos.";
  botonIniciar.textContent = "Jugar otra vez";
  botonIniciar.hidden = false;
}

// ---------- Eventos ----------
botonIniciar.addEventListener("click", iniciar);
botonResponder.addEventListener("click", responder);

campoRespuesta.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    responder();
  }
});
