// ===== Juego de cierre · Piedra, papel o tijera con IA =====
// Junta todo el curso:
//   - P12: reglas, marcador, cuenta 3, 2, 1, historial y nueva partida
//   - P13: el modelo que entrenaste (clases Piedra, Papel, Tijera y Nada)
//   - P14 y P15: la cámara y convertir lo que ve la IA en una jugada

// ---------- PERSONALIZA ----------
// Dónde está tu modelo: la carpeta "mi_modelo" junto a este archivo.
const CARPETA_MODELO = "./mi_modelo/";
const CONFIANZA_MINIMA = 0.8;      // 0.8 = la IA debe estar 80 % segura
const MILISEGUNDOS_CUENTA = 700;   // cuánto dura cada número de la cuenta
const PUNTOS_PARA_GANAR = 3;
const RONDAS_EN_HISTORIAL = 5;

// ---------- Las reglas del juego (de P12) ----------
const JUGADAS = ["piedra", "papel", "tijera"];
const EMOJIS = { piedra: "✊", papel: "✋", tijera: "✌️" };
const LE_GANA_A = { piedra: "tijera", papel: "piedra", tijera: "papel" };

// ---------- Variables del juego ----------
let modelo = null;
let camara = null;
let ultimaPrediccion = { jugada: "nada", confianza: 0 };
let puntosJugador = 0;
let puntosComputadora = 0;
let jugando = false;
let partidaTerminada = false;

// ---------- Elementos de la página ----------
const contenedorCamara = document.querySelector("#contenedor-camara");
const avisoCamara = document.querySelector("#aviso-camara");
const botonCamara = document.querySelector("#boton-camara");
const barras = document.querySelector("#barras");
const textoPuntosJugador = document.querySelector("#puntos-jugador");
const textoPuntosComputadora = document.querySelector("#puntos-computadora");
const cuenta = document.querySelector("#cuenta");
const jugadaJugadorTexto = document.querySelector("#jugada-jugador");
const jugadaComputadoraTexto = document.querySelector("#jugada-computadora");
const resultado = document.querySelector("#resultado");
const botonJugar = document.querySelector("#boton-jugar");
const botonNueva = document.querySelector("#boton-nueva");
const botonesRespaldo = document.querySelectorAll("[data-jugada]");
const historial = document.querySelector("#historial");

// Quita mayúsculas y tildes: "Tíjera " → "tijera"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// =============== PARTE 1: LA CÁMARA Y LA IA (de P15) ===============

function revisarRequisitos() {
  if (location.protocol === "file:") {
    avisoCamara.textContent = "Abre esta página con Live Server (clic derecho en index.html > Open with Live Server). Así puede leer tu carpeta mi_modelo.";
    return false;
  }
  if (typeof tmImage === "undefined") {
    avisoCamara.textContent = "No se pudieron cargar las librerías de IA. Revisa tu conexión a internet. Mientras tanto, juega con los botones.";
    return false;
  }
  return true;
}

async function encenderCamara() {
  if (!revisarRequisitos()) {
    return;
  }

  botonCamara.disabled = true;
  botonCamara.textContent = "Cargando tu IA...";

  try {
    modelo = await tmImage.load(CARPETA_MODELO + "model.json", CARPETA_MODELO + "metadata.json");
  } catch (error) {
    console.error(error);
    avisoCamara.textContent = "No encontré tu modelo. Copia la carpeta mi_modelo (con model.json, metadata.json y weights.bin) dentro de la carpeta del juego.";
    botonCamara.disabled = false;
    botonCamara.textContent = "Encender cámara";
    return;
  }

  try {
    camara = new tmImage.Webcam(320, 240, true); // ancho, alto, efecto espejo
    await camara.setup();
    await camara.play();
  } catch (error) {
    console.error(error);
    avisoCamara.textContent = "No se pudo encender la cámara. Da permiso a la cámara y cierra otras apps que la usen. Mientras tanto, juega con los botones.";
    botonCamara.disabled = false;
    botonCamara.textContent = "Encender cámara";
    return;
  }

  contenedorCamara.innerHTML = "";
  contenedorCamara.appendChild(camara.canvas);
  botonCamara.textContent = "Cámara encendida";
  botonJugar.disabled = partidaTerminada;
  resultado.textContent = "¡Presiona Jugar ronda!";
  window.requestAnimationFrame(ciclo);
}

// En cada cuadro, la IA mira la cámara
async function ciclo() {
  camara.update();
  await predecir();
  window.requestAnimationFrame(ciclo);
}

async function predecir() {
  const predicciones = await modelo.predict(camara.canvas);

  if (barras.children.length === 0) {
    crearBarras(predicciones);
  }

  let mejor = predicciones[0];
  for (let i = 0; i < predicciones.length; i++) {
    actualizarBarra(i, predicciones[i].probability);
    if (predicciones[i].probability > mejor.probability) {
      mejor = predicciones[i];
    }
  }

  ultimaPrediccion = { jugada: normalizar(mejor.className), confianza: mejor.probability };
}

function crearBarras(predicciones) {
  for (let i = 0; i < predicciones.length; i++) {
    const fila = document.createElement("div");
    fila.className = "barra";
    fila.innerHTML =
      '<span class="nombre"></span>' +
      '<span class="fondo"><span class="relleno"></span></span>' +
      '<span class="porcentaje">0 %</span>';
    fila.querySelector(".nombre").textContent = predicciones[i].className;
    barras.appendChild(fila);
  }
}

function actualizarBarra(posicion, probabilidad) {
  const fila = barras.children[posicion];
  const porcentaje = Math.round(probabilidad * 100);
  fila.querySelector(".relleno").style.width = porcentaje + "%";
  fila.querySelector(".porcentaje").textContent = porcentaje + " %";
}

// =============== PARTE 2: EL JUEGO (de P12) ===============

function jugadaDeLaComputadora() {
  return JUGADAS[Math.floor(Math.random() * JUGADAS.length)];
}

function decidirGanador(jugadaJugador, jugadaComputadora) {
  if (jugadaJugador === jugadaComputadora) {
    return "empate";
  }
  if (LE_GANA_A[jugadaJugador] === jugadaComputadora) {
    return "jugador";
  }
  return "computadora";
}

function activarControles(activos) {
  botonJugar.disabled = !activos || camara === null;
  for (let i = 0; i < botonesRespaldo.length; i++) {
    botonesRespaldo[i].disabled = !activos;
  }
}

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

// jugadaFija: null = leer la cámara; "piedra", "papel" o "tijera" = botón de respaldo
function jugarRonda(jugadaFija) {
  if (jugando || partidaTerminada) {
    return;
  }
  jugando = true;
  activarControles(false);
  jugadaJugadorTexto.textContent = "❔";
  jugadaComputadoraTexto.textContent = "❔";
  resultado.textContent = jugadaFija ? "..." : "¡Prepara tu mano!";

  cuentaRegresiva(function () {
    if (jugadaFija) {
      resolverRonda(jugadaFija);
    } else {
      // Leemos lo que la IA ve justo al decir "¡Ya!"
      const jugada = ultimaPrediccion.jugada;
      if (JUGADAS.includes(jugada) && ultimaPrediccion.confianza >= CONFIANZA_MINIMA) {
        resolverRonda(jugada);
      } else {
        resultado.textContent = "No te vi bien. Pon tu mano frente a la cámara e intenta otra vez.";
      }
    }
    jugando = false;
    if (!partidaTerminada) {
      activarControles(true);
    }
  });
}

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
  historial.prepend(elemento);
  while (historial.children.length > RONDAS_EN_HISTORIAL) {
    historial.removeChild(historial.lastChild);
  }
}

function terminarPartida() {
  partidaTerminada = true;
  activarControles(false);
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
  resultado.textContent = "¡Nueva partida!";
  historial.innerHTML = "";
  botonNueva.hidden = true;
  activarControles(true);
}

// ---------- Eventos ----------
botonCamara.addEventListener("click", encenderCamara);
botonJugar.addEventListener("click", function () {
  jugarRonda(null);
});
botonNueva.addEventListener("click", nuevaPartida);

for (let i = 0; i < botonesRespaldo.length; i++) {
  botonesRespaldo[i].addEventListener("click", function () {
    jugarRonda(botonesRespaldo[i].dataset.jugada);
  });
}

revisarRequisitos();
