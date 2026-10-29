// ===== J11 · Pájaro saltarín (estilo Flappy Bird) =====

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_CIELO = "#5AD1F2";
const COLOR_SUELO = "#C9A15A";
const COLOR_TUBO = "#4FB548";
const COLOR_PAJARO = "#F6D743";
const GRAVEDAD = 0.45;
const ALETEO = -7.5;          // qué tan fuerte sube al aletear
const VELOCIDAD_TUBOS = 2.6;
const ESPACIO_ENTRE_TUBOS = 165;  // el hueco por donde pasa el pájaro
const DISTANCIA_ENTRE_TUBOS = 230;

// ---------- Objetos del juego ----------
const ALTO_SUELO = 70;
const ANCHO_TUBO = 70;
const pajaro = { x: 120, y: ALTO / 2, radio: 16, vy: 0 };

let tubos = [];
let puntos = 0;
let record = 0;
let estado = "esperando"; // "esperando", "jugando" o "fin"
let desplazamientoSuelo = 0;

const textoPuntos = document.querySelector("#puntos");
const textoRecord = document.querySelector("#record");

function aleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoRecord.textContent = record;
}

function reiniciar() {
  pajaro.y = ALTO / 2;
  pajaro.vy = 0;
  tubos = [];
  puntos = 0;
  // Primer tubo un poco lejos para dar tiempo
  crearTubo(ANCHO + 100);
  actualizarMarcador();
}

// Un "tubo" es en realidad dos: uno arriba y uno abajo, con un hueco entre ellos
function crearTubo(x) {
  const minimo = 60;
  const maximo = ALTO - ALTO_SUELO - ESPACIO_ENTRE_TUBOS - 60;
  tubos.push({ x: x, arribaHueco: aleatorio(minimo, maximo), contado: false });
}

function aletear() {
  if (estado === "jugando") {
    pajaro.vy = ALETEO;
  } else {
    reiniciar();
    estado = "jugando";
    pajaro.vy = ALETEO;
  }
}

// ¿El círculo del pájaro toca este rectángulo?
function tocaRectangulo(x, y, ancho, alto) {
  const cercanoX = Math.max(x, Math.min(pajaro.x, x + ancho));
  const cercanoY = Math.max(y, Math.min(pajaro.y, y + alto));
  const dx = pajaro.x - cercanoX;
  const dy = pajaro.y - cercanoY;
  return dx * dx + dy * dy < pajaro.radio * pajaro.radio;
}

function actualizar() {
  // Física: la gravedad jala hacia abajo
  pajaro.vy = pajaro.vy + GRAVEDAD;
  pajaro.y = pajaro.y + pajaro.vy;

  // Techo y suelo
  if (pajaro.y - pajaro.radio < 0) {
    pajaro.y = pajaro.radio;
    pajaro.vy = 0;
  }
  if (pajaro.y + pajaro.radio > ALTO - ALTO_SUELO) {
    terminar();
    return;
  }

  // Mover los tubos (al revés para poder borrar)
  for (let i = tubos.length - 1; i >= 0; i--) {
    const tubo = tubos[i];
    tubo.x = tubo.x - VELOCIDAD_TUBOS;

    const abajoHueco = tubo.arribaHueco + ESPACIO_ENTRE_TUBOS;
    if (tocaRectangulo(tubo.x, 0, ANCHO_TUBO, tubo.arribaHueco) ||
        tocaRectangulo(tubo.x, abajoHueco, ANCHO_TUBO, ALTO - ALTO_SUELO - abajoHueco)) {
      terminar();
      return;
    }

    // Un punto al pasar el tubo
    if (!tubo.contado && tubo.x + ANCHO_TUBO < pajaro.x) {
      tubo.contado = true;
      puntos = puntos + 1;
      actualizarMarcador();
    }

    if (tubo.x + ANCHO_TUBO < 0) {
      tubos.splice(i, 1);
    }
  }

  // Nuevo tubo cuando el último ya avanzó lo suficiente
  const ultimo = tubos[tubos.length - 1];
  if (!ultimo || ultimo.x < ANCHO - DISTANCIA_ENTRE_TUBOS) {
    crearTubo(ANCHO);
  }

  desplazamientoSuelo = (desplazamientoSuelo + VELOCIDAD_TUBOS) % 40;
}

function terminar() {
  estado = "fin";
  if (puntos > record) {
    record = puntos;
  }
  actualizarMarcador();
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujarPajaro() {
  ctx.save();
  ctx.translate(pajaro.x, pajaro.y);
  // Se inclina según la velocidad: sube mirando arriba, cae mirando abajo
  ctx.rotate(Math.max(-0.5, Math.min(1.2, pajaro.vy * 0.08)));
  ctx.fillStyle = COLOR_PAJARO;
  ctx.beginPath();
  ctx.arc(0, 0, pajaro.radio, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";                       // ojo
  ctx.beginPath();
  ctx.arc(6, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0F1B2D";
  ctx.beginPath();
  ctx.arc(8, -5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FF8A3D";                       // pico
  ctx.beginPath();
  ctx.moveTo(12, 1);
  ctx.lineTo(24, 5);
  ctx.lineTo(12, 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function dibujar() {
  ctx.fillStyle = COLOR_CIELO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Tubos
  ctx.fillStyle = COLOR_TUBO;
  for (let i = 0; i < tubos.length; i++) {
    const tubo = tubos[i];
    const abajoHueco = tubo.arribaHueco + ESPACIO_ENTRE_TUBOS;
    ctx.fillRect(tubo.x, 0, ANCHO_TUBO, tubo.arribaHueco);
    ctx.fillRect(tubo.x, abajoHueco, ANCHO_TUBO, ALTO - ALTO_SUELO - abajoHueco);
    // Bordes de los tubos
    ctx.fillRect(tubo.x - 5, tubo.arribaHueco - 20, ANCHO_TUBO + 10, 20);
    ctx.fillRect(tubo.x - 5, abajoHueco, ANCHO_TUBO + 10, 20);
  }

  // Suelo con rayas que se mueven
  ctx.fillStyle = COLOR_SUELO;
  ctx.fillRect(0, ALTO - ALTO_SUELO, ANCHO, ALTO_SUELO);
  ctx.fillStyle = "#B08A45";
  for (let x = -desplazamientoSuelo; x < ANCHO; x = x + 40) {
    ctx.fillRect(x, ALTO - ALTO_SUELO, 20, 8);
  }

  dibujarPajaro();

  if (estado === "esperando") {
    escribir("ESPACIO o clic para volar", ALTO / 2 - 80, 26, "#0F1B2D");
  } else if (estado === "fin") {
    escribir("¡Chocaste!", ALTO / 2 - 60, 44, "#0F1B2D");
    escribir("Puntos: " + puntos + " · ESPACIO para jugar otra vez", ALTO / 2 - 20, 18, "#0F1B2D");
  }
}

// ---------- El ciclo del juego ----------
function ciclo() {
  if (estado === "jugando") {
    actualizar();
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === " " || evento.key === "ArrowUp") {
    evento.preventDefault();
    if (!evento.repeat) {
      aletear();
    }
  }
});

lienzo.addEventListener("mousedown", aletear);

// ¡Arrancamos!
reiniciar();
ciclo();
