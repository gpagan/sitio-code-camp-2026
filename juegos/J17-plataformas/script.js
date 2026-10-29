// ===== J17 · Plataformas =====
// El nivel es más ancho que la pantalla. La "cámara" es un número (camaraX)
// que dice qué parte del nivel se está viendo: todo se dibuja restando camaraX.

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const GRAVEDAD = 0.6;
const FUERZA_SALTO = -12.5;
const VELOCIDAD_MAXIMA = 4.5;
const ACELERACION = 0.6;
const VIDAS_INICIALES = 3;
const COLOR_JUGADOR = "#C8F25A";

// ---------- El nivel (x, y, ancho, alto en píxeles) ----------
const NIVEL_ANCHO = 2400;
const INICIO = { x: 60, y: 300 };

const PLATAFORMAS = [
  // El suelo, con huecos
  { x: 0, y: 400, ancho: 600, alto: 50 },
  { x: 720, y: 400, ancho: 500, alto: 50 },
  { x: 1340, y: 400, ancho: 380, alto: 50 },
  { x: 1840, y: 400, ancho: 560, alto: 50 },
  // Plataformas en el aire
  { x: 250, y: 310, ancho: 120, alto: 16 },
  { x: 420, y: 240, ancho: 120, alto: 16 },
  { x: 880, y: 300, ancho: 140, alto: 16 },
  { x: 1060, y: 220, ancho: 120, alto: 16 },
  { x: 1400, y: 300, ancho: 100, alto: 16 },
  { x: 1560, y: 230, ancho: 120, alto: 16 },
  { x: 1950, y: 300, ancho: 140, alto: 16 },
  { x: 2120, y: 230, ancho: 100, alto: 16 }
];

const PICOS = [
  { x: 820, y: 384, ancho: 60, alto: 16 },
  { x: 1500, y: 384, ancho: 60, alto: 16 },
  { x: 2000, y: 384, ancho: 80, alto: 16 }
];

const POSICIONES_MONEDAS = [
  [310, 280], [480, 210], [660, 330], [950, 270], [1120, 190], [1450, 270],
  [1620, 200], [1780, 330], [2020, 270], [2170, 200], [2250, 360]
];

const META = { x: 2320, y: 320, ancho: 30, alto: 80 };

// ---------- Variables del juego ----------
const jugador = { x: INICIO.x, y: INICIO.y, ancho: 28, alto: 36, vx: 0, vy: 0, enSuelo: false, mira: 1 };
let monedas = [];
let monedasRecogidas = 0;
let vidas = VIDAS_INICIALES;
let camaraX = 0;
let estado = "esperando"; // "esperando", "jugando", "ganaste" o "fin"
let cuadro = 0;
const teclas = { izquierda: false, derecha: false };

const textoMonedas = document.querySelector("#monedas");
const textoVidas = document.querySelector("#vidas");

function actualizarMarcador() {
  textoMonedas.textContent = monedasRecogidas + " / " + POSICIONES_MONEDAS.length;
  textoVidas.textContent = vidas;
}

// ¿Se tocan dos rectángulos?
function chocan(a, b) {
  return a.x < b.x + b.ancho && a.x + a.ancho > b.x && a.y < b.y + b.alto && a.y + a.alto > b.y;
}

function ponerEnInicio() {
  jugador.x = INICIO.x;
  jugador.y = INICIO.y;
  jugador.vx = 0;
  jugador.vy = 0;
}

function empezar() {
  monedas = [];
  for (let i = 0; i < POSICIONES_MONEDAS.length; i++) {
    monedas.push({ x: POSICIONES_MONEDAS[i][0], y: POSICIONES_MONEDAS[i][1], recogida: false });
  }
  monedasRecogidas = 0;
  vidas = VIDAS_INICIALES;
  ponerEnInicio();
  actualizarMarcador();
  estado = "jugando";
}

function saltar() {
  if (jugador.enSuelo) {
    jugador.vy = FUERZA_SALTO;
    jugador.enSuelo = false;
  }
}

function perderVida() {
  vidas = vidas - 1;
  actualizarMarcador();
  if (vidas <= 0) {
    estado = "fin";
  } else {
    ponerEnInicio();
  }
}

// ---------- Física y choques ----------
function actualizar() {
  cuadro = cuadro + 1;

  // Caminar: acelerar hacia un lado o frenar poco a poco
  if (teclas.izquierda) {
    jugador.vx = Math.max(jugador.vx - ACELERACION, -VELOCIDAD_MAXIMA);
    jugador.mira = -1;
  } else if (teclas.derecha) {
    jugador.vx = Math.min(jugador.vx + ACELERACION, VELOCIDAD_MAXIMA);
    jugador.mira = 1;
  } else {
    jugador.vx = jugador.vx * 0.8;
  }

  // 1) Movemos en X y corregimos si choca con una plataforma
  jugador.x = jugador.x + jugador.vx;
  for (let i = 0; i < PLATAFORMAS.length; i++) {
    const p = PLATAFORMAS[i];
    if (chocan(jugador, p)) {
      if (jugador.vx > 0) {
        jugador.x = p.x - jugador.ancho;
      } else if (jugador.vx < 0) {
        jugador.x = p.x + p.ancho;
      }
      jugador.vx = 0;
    }
  }
  jugador.x = Math.max(0, Math.min(NIVEL_ANCHO - jugador.ancho, jugador.x));

  // 2) Movemos en Y (con gravedad) y corregimos
  jugador.vy = jugador.vy + GRAVEDAD;
  jugador.y = jugador.y + jugador.vy;
  jugador.enSuelo = false;
  for (let i = 0; i < PLATAFORMAS.length; i++) {
    const p = PLATAFORMAS[i];
    if (chocan(jugador, p)) {
      if (jugador.vy > 0) {
        jugador.y = p.y - jugador.alto;   // aterrizó encima
        jugador.enSuelo = true;
      } else if (jugador.vy < 0) {
        jugador.y = p.y + p.alto;         // se pegó con la cabeza
      }
      jugador.vy = 0;
    }
  }

  // Monedas
  for (let i = 0; i < monedas.length; i++) {
    const m = monedas[i];
    if (!m.recogida && chocan(jugador, { x: m.x - 10, y: m.y - 10, ancho: 20, alto: 20 })) {
      m.recogida = true;
      monedasRecogidas = monedasRecogidas + 1;
      actualizarMarcador();
    }
  }

  // Picos o caída al vacío
  for (let i = 0; i < PICOS.length; i++) {
    if (chocan(jugador, PICOS[i])) {
      perderVida();
      return;
    }
  }
  if (jugador.y > ALTO + 100) {
    perderVida();
    return;
  }

  // Meta
  if (chocan(jugador, META)) {
    estado = "ganaste";
  }

  // La cámara sigue al jugador, sin salirse del nivel
  camaraX = jugador.x + jugador.ancho / 2 - ANCHO / 2;
  camaraX = Math.max(0, Math.min(NIVEL_ANCHO - ANCHO, camaraX));
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujarFondo() {
  const cielo = ctx.createLinearGradient(0, 0, 0, ALTO);
  cielo.addColorStop(0, "#5AD1F2");
  cielo.addColorStop(1, "#CFF3FC");
  ctx.fillStyle = cielo;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Colinas lejanas: se mueven más lento que el nivel (efecto de profundidad)
  ctx.fillStyle = "#9BD98F";
  for (let i = 0; i < 12; i++) {
    const x = i * 300 - camaraX * 0.3;
    ctx.beginPath();
    ctx.arc(x, 420, 160, Math.PI, 0);
    ctx.fill();
  }
}

function dibujar() {
  dibujarFondo();

  ctx.save();
  ctx.translate(-camaraX, 0); // todo lo de abajo se dibuja corrido por la cámara

  // Plataformas
  for (let i = 0; i < PLATAFORMAS.length; i++) {
    const p = PLATAFORMAS[i];
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(p.x, p.y, p.ancho, p.alto);
    ctx.fillStyle = "#4FB548";
    ctx.fillRect(p.x, p.y, p.ancho, 8);
  }

  // Picos: triángulos
  ctx.fillStyle = "#C9D3E0";
  for (let i = 0; i < PICOS.length; i++) {
    const pico = PICOS[i];
    for (let x = pico.x; x < pico.x + pico.ancho; x = x + 20) {
      ctx.beginPath();
      ctx.moveTo(x, pico.y + pico.alto);
      ctx.lineTo(x + 10, pico.y);
      ctx.lineTo(x + 20, pico.y + pico.alto);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Monedas: "giran" cambiando su ancho
  for (let i = 0; i < monedas.length; i++) {
    const m = monedas[i];
    if (!m.recogida) {
      const ancho = Math.abs(Math.sin(cuadro * 0.08 + i)) * 9 + 2;
      ctx.fillStyle = "#F6D743";
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, ancho, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Bandera de la meta
  ctx.fillStyle = "#5A3A22";
  ctx.fillRect(META.x, META.y, 6, META.alto);
  ctx.fillStyle = "#FF7A7A";
  ctx.beginPath();
  ctx.moveTo(META.x + 6, META.y);
  ctx.lineTo(META.x + 46, META.y + 14);
  ctx.lineTo(META.x + 6, META.y + 28);
  ctx.closePath();
  ctx.fill();

  // Jugador
  ctx.fillStyle = COLOR_JUGADOR;
  ctx.fillRect(jugador.x, jugador.y, jugador.ancho, jugador.alto);
  ctx.fillStyle = "#0F1B2D";
  const ojoX = jugador.mira === 1 ? jugador.x + 18 : jugador.x + 6;
  ctx.fillRect(ojoX, jugador.y + 8, 5, 6);

  ctx.restore();

  if (estado === "esperando") {
    escribir("Presiona ESPACIO para empezar", 120, 28, "#0F1B2D");
  } else if (estado === "ganaste") {
    escribir("🏁 ¡Llegaste a la meta!", 120, 40, "#0F1B2D");
    escribir("Monedas: " + monedasRecogidas + " de " + POSICIONES_MONEDAS.length + " · ESPACIO para jugar otra vez", 165, 20, "#0F1B2D");
  } else if (estado === "fin") {
    escribir("Fin del juego", 120, 44, "#C0392B");
    escribir("ESPACIO para intentarlo otra vez", 165, 20, "#0F1B2D");
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
  if (evento.key === "ArrowLeft") {
    teclas.izquierda = true;
  } else if (evento.key === "ArrowRight") {
    teclas.derecha = true;
  } else if (evento.key === " " || evento.key === "ArrowUp") {
    if (estado === "jugando") {
      saltar();
    } else if (!evento.repeat) {
      empezar();
    }
  } else {
    return;
  }
  evento.preventDefault();
});

document.addEventListener("keyup", function (evento) {
  if (evento.key === "ArrowLeft") {
    teclas.izquierda = false;
  } else if (evento.key === "ArrowRight") {
    teclas.derecha = false;
  }
});

// ¡Arrancamos!
empezar();
estado = "esperando";
ciclo();
