// ===== Carrera de teclas =====
// Aparece una palabra; el jugador la escribe y aparece la siguiente.

// ---------- PERSONALIZA ----------
const DURACION = 60; // segundos

// Palabras del juego. Al principio es mejor sin tildes ni ñ.
const PALABRAS = [
  "casa", "perro", "gato", "juego", "codigo", "mouse", "teclado", "pantalla",
  "internet", "boton", "variable", "funcion", "pagina", "color", "numero",
  "ciclo", "evento", "estrella", "planeta", "musica", "futbol", "honduras",
  "volcan", "playa", "rio", "montana", "computadora", "robot", "nube", "luz",
  "mango", "pupusa", "baleada", "cafe", "escuela", "amigo", "familia", "ciudad"
];

// ---------- Variables del juego ----------
let palabraActual = "";
let palabrasCompletadas = 0;
let tiempo = DURACION;
let temporizador = null;
let enJuego = false;

// ---------- Elementos de la página ----------
const textoTiempo = document.querySelector("#tiempo");
const textoPalabras = document.querySelector("#palabras");
const textoPpm = document.querySelector("#ppm");
const palabra = document.querySelector("#palabra");
const entrada = document.querySelector("#entrada");
const mensaje = document.querySelector("#mensaje");
const botonIniciar = document.querySelector("#boton-iniciar");

// Palabras por minuto = palabras escritas ÷ minutos que han pasado
function calcularPpm() {
  const segundosPasados = DURACION - tiempo;
  if (segundosPasados === 0) {
    return 0;
  }
  return Math.round(palabrasCompletadas / (segundosPasados / 60));
}

function actualizarMarcador() {
  textoTiempo.textContent = tiempo;
  textoPalabras.textContent = palabrasCompletadas;
  textoPpm.textContent = calcularPpm();
}

// Muestra una palabra nueva, con cada letra en su propia etiqueta <span>
function mostrarPalabra() {
  let nueva = palabraActual;
  while (nueva === palabraActual) {
    nueva = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  }
  palabraActual = nueva;

  palabra.innerHTML = "";
  for (let i = 0; i < palabraActual.length; i++) {
    const letra = document.createElement("span");
    letra.className = "letra";
    letra.textContent = palabraActual[i];
    palabra.appendChild(letra);
  }
}

// Se ejecuta cada vez que el jugador escribe algo
function alEscribir() {
  if (!enJuego) {
    return;
  }

  const texto = entrada.value.trim().toLowerCase();
  const letras = palabra.children;

  // Pintamos cada letra: verde si está bien, roja si está mal
  for (let i = 0; i < letras.length; i++) {
    if (i >= texto.length) {
      letras[i].className = "letra";
    } else if (texto[i] === palabraActual[i]) {
      letras[i].className = "letra correcta";
    } else {
      letras[i].className = "letra incorrecta";
    }
  }

  if (texto === palabraActual) {
    palabrasCompletadas = palabrasCompletadas + 1;
    entrada.value = "";
    mostrarPalabra();
    actualizarMarcador();
  }
}

function iniciar() {
  palabrasCompletadas = 0;
  tiempo = DURACION;
  enJuego = true;
  mensaje.textContent = "";
  botonIniciar.hidden = true;
  entrada.disabled = false;
  entrada.value = "";
  entrada.focus();
  mostrarPalabra();
  actualizarMarcador();
  temporizador = setInterval(cadaSegundo, 1000);
}

function cadaSegundo() {
  tiempo = tiempo - 1;
  actualizarMarcador();
  if (tiempo <= 0) {
    terminar();
  }
}

function terminar() {
  clearInterval(temporizador);
  enJuego = false;
  entrada.disabled = true;
  palabra.textContent = "🏁";
  mensaje.textContent = "Escribiste " + palabrasCompletadas + " palabras. Tu velocidad: " + calcularPpm() + " palabras por minuto.";
  botonIniciar.textContent = "Jugar otra vez";
  botonIniciar.hidden = false;
}

// ---------- Eventos ----------
botonIniciar.addEventListener("click", iniciar);
entrada.addEventListener("input", alEscribir);
