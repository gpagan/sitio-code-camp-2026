// ===== Dinosaurio corredor =====
// El dinosaurio corre solo; el jugador salta para esquivar los cactus.

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#0B1424";
const COLOR_SUELO = "#3A5274";
const COLOR_DINO = "#C8F25A";
const COLOR_CACTUS = "#7BDE6A";
const GRAVEDAD = 0.7;          // qué tan rápido cae
const FUERZA_SALTO = -13;      // qué tan alto salta (más negativo = más alto)
const VELOCIDAD_INICIAL = 6;
const ACELERACION = 0.003;     // cuánto se acelera en cada cuadro

// ---------- Objetos del juego ----------
const SUELO = 250;             // la altura (y) del piso
const dino = { x: 80, y: SUELO - 50, ancho: 44, alto: 50, vy: 0, enSuelo: true };

let obstaculos = [];
let velocidad = VELOCIDAD_INICIAL;
let puntos = 0;
let record = 0;
let estado = "esperando";      // "esperando", "jugando" o "fin"
let cuadrosParaSiguiente = 0;  // cuánto falta para el próximo cactus
let cuadro = 0;                // contador de cuadros, para animar las patas

const textoPuntos = document.querySelector("#puntos");
const textoRecord = document.querySelector("#record");

function aleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function actualizarMarcador() {
  textoPuntos.textContent = Math.floor(puntos);
  textoRecord.textContent = record;
}

function reiniciar() {
  obstaculos = [];
  velocidad = VELOCIDAD_INICIAL;
  puntos = 0;
  dino.y = SUELO - dino.alto;
  dino.vy = 0;
  dino.enSuelo = true;
  cuadrosParaSiguiente = 60;
  actualizarMarcador();
}

function saltar() {
  if (dino.enSuelo) {
    dino.vy = FUERZA_SALTO;
    dino.enSuelo = false;
  }
}

// Espacio, flecha arriba o clic
function accion() {
  if (estado === "jugando") {
    saltar();
  } else {
    reiniciar();
    estado = "jugando";
  }
}

function crearCactus() {
  const alto = aleatorio(30, 60);
  const ancho = aleatorio(18, 34);
  obstaculos.push({ x: ANCHO, y: SUELO - alto, ancho: ancho, alto: alto });
}

// ¿Se tocan dos rectángulos? (con un pequeño margen para ser justos)
function chocan(a, b) {
  const margen = 6;
  return a.x + margen < b.x + b.ancho &&
         a.x + a.ancho - margen > b.x &&
         a.y + margen < b.y + b.alto &&
         a.y + a.alto > b.y;
}

function actualizar() {
  cuadro = cuadro + 1;

  // Física del salto: la gravedad siempre jala hacia abajo
  dino.vy = dino.vy + GRAVEDAD;
  dino.y = dino.y + dino.vy;
  if (dino.y >= SUELO - dino.alto) {
    dino.y = SUELO - dino.alto;
    dino.vy = 0;
    dino.enSuelo = true;
  }

  // Nuevos cactus
  cuadrosParaSiguiente = cuadrosParaSiguiente - 1;
  if (cuadrosParaSiguiente <= 0) {
    crearCactus();
    cuadrosParaSiguiente = aleatorio(55, 110);
  }

  // Mover los cactus hacia la izquierda (recorremos al revés para poder borrar)
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].x = obstaculos[i].x - velocidad;
    if (obstaculos[i].x + obstaculos[i].ancho < 0) {
      obstaculos.splice(i, 1); // ya salió de la pantalla
    } else if (chocan(dino, obstaculos[i])) {
      terminar();
      return;
    }
  }

  velocidad = velocidad + ACELERACION;
  puntos = puntos + velocidad * 0.02;
  actualizarMarcador();
}

function terminar() {
  estado = "fin";
  if (Math.floor(puntos) > record) {
    record = Math.floor(puntos);
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

function dibujarDino() {
  const x = dino.x;
  const y = dino.y;
  ctx.fillStyle = COLOR_DINO;
  ctx.fillRect(x, y + 14, 34, 24);        // cuerpo
  ctx.fillRect(x + 20, y, 24, 18);        // cabeza
  ctx.fillRect(x - 8, y + 18, 10, 8);     // cola
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(x + 34, y + 5, 4, 4);      // ojo

  // Patas: se alternan para que parezca que corre
  ctx.fillStyle = COLOR_DINO;
  if (!dino.enSuelo || Math.floor(cuadro / 6) % 2 === 0) {
    ctx.fillRect(x + 6, y + 38, 7, 12);
    ctx.fillRect(x + 22, y + 38, 7, 8);
  } else {
    ctx.fillRect(x + 6, y + 38, 7, 8);
    ctx.fillRect(x + 22, y + 38, 7, 12);
  }
}

function dibujarCactus(cactus) {
  ctx.fillStyle = COLOR_CACTUS;
  ctx.fillRect(cactus.x, cactus.y, cactus.ancho, cactus.alto);        // tronco
  ctx.fillRect(cactus.x - 6, cactus.y + 12, 6, 14);                   // brazo izquierdo
  ctx.fillRect(cactus.x + cactus.ancho, cactus.y + 8, 6, 14);         // brazo derecho
}

function dibujar() {
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Suelo
  ctx.fillStyle = COLOR_SUELO;
  ctx.fillRect(0, SUELO, ANCHO, 3);

  for (let i = 0; i < obstaculos.length; i++) {
    dibujarCactus(obstaculos[i]);
  }
  dibujarDino();

  if (estado === "esperando") {
    escribir("Presiona ESPACIO para correr", 110, 28, "#F6F4EE");
  } else if (estado === "fin") {
    escribir("¡Chocaste!", 100, 40, "#FF7A7A");
    escribir("ESPACIO para intentarlo otra vez", 140, 20, "#F6F4EE");
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
    if (!evento.repeat) {   // ignora la tecla sostenida
      accion();
    }
  }
});

lienzo.addEventListener("click", accion);

// ¡Arrancamos!
reiniciar();
ciclo();
