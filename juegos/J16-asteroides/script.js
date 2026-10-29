// ===== J16 · Asteroides (estilo Asteroids) =====
// La nave apunta en un ÁNGULO. Para moverla en esa dirección usamos
// seno y coseno:  avance en x = cos(ángulo),  avance en y = sin(ángulo).

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#05080F";
const COLOR_NAVE = "#C8F25A";
const COLOR_ASTEROIDE = "#C9D3E0";
const COLOR_BALA = "#FFB27A";
const VELOCIDAD_GIRO = 0.08;     // radianes por cuadro
const EMPUJE = 0.15;             // qué tanto acelera
const FRICCION = 0.99;           // 1 = sin freno; menos = frena más
const VELOCIDAD_BALA = 8;
const VIDA_BALA = 55;            // cuadros que dura una bala
const ESPERA_DISPARO = 250;      // milisegundos entre disparos
const VIDAS_INICIALES = 3;
const ASTEROIDES_INICIALES = 4;

// Tamaños de asteroide: 3 = grande, 2 = mediano, 1 = pequeño
const RADIOS = { 3: 46, 2: 26, 1: 14 };
const PUNTOS = { 3: 20, 2: 50, 1: 100 };

// ---------- Objetos del juego ----------
const nave = { x: ANCHO / 2, y: ALTO / 2, angulo: -Math.PI / 2, vx: 0, vy: 0, radio: 14, invencible: 0 };
let balas = [];
let asteroides = [];
let puntos = 0;
let vidas = VIDAS_INICIALES;
let oleada = 1;
let estado = "esperando"; // "esperando", "jugando" o "fin"
let ultimoDisparo = 0;
const teclas = { izquierda: false, derecha: false, arriba: false, disparo: false };

const textoPuntos = document.querySelector("#puntos");
const textoVidas = document.querySelector("#vidas");
const textoOleada = document.querySelector("#oleada");

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoVidas.textContent = vidas;
  textoOleada.textContent = oleada;
}

// Si algo sale por un borde, aparece por el otro
function darLaVuelta(objeto) {
  if (objeto.x < 0) { objeto.x = objeto.x + ANCHO; }
  if (objeto.x > ANCHO) { objeto.x = objeto.x - ANCHO; }
  if (objeto.y < 0) { objeto.y = objeto.y + ALTO; }
  if (objeto.y > ALTO) { objeto.y = objeto.y - ALTO; }
}

function distancia(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------- Asteroides ----------
function crearAsteroide(x, y, tamano) {
  const angulo = Math.random() * Math.PI * 2;
  const rapidez = (0.6 + Math.random()) * (4 - tamano) * 0.6 + 0.4;
  // Forma irregular: 10 puntas a distancias distintas del centro
  const forma = [];
  for (let i = 0; i < 10; i++) {
    forma.push(0.75 + Math.random() * 0.35);
  }
  asteroides.push({
    x: x,
    y: y,
    vx: Math.cos(angulo) * rapidez,
    vy: Math.sin(angulo) * rapidez,
    tamano: tamano,
    radio: RADIOS[tamano],
    giro: 0,
    velocidadGiro: (Math.random() - 0.5) * 0.04,
    forma: forma
  });
}

function crearOleada() {
  const cantidad = ASTEROIDES_INICIALES + oleada - 1;
  for (let i = 0; i < cantidad; i++) {
    // Aparecen lejos de la nave, en un borde
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() * ANCHO;
      y = Math.random() < 0.5 ? 0 : ALTO;
    } else {
      x = Math.random() < 0.5 ? 0 : ANCHO;
      y = Math.random() * ALTO;
    }
    crearAsteroide(x, y, 3);
  }
}

function partirAsteroide(indice) {
  const asteroide = asteroides[indice];
  asteroides.splice(indice, 1);
  puntos = puntos + PUNTOS[asteroide.tamano];
  if (asteroide.tamano > 1) {
    crearAsteroide(asteroide.x, asteroide.y, asteroide.tamano - 1);
    crearAsteroide(asteroide.x, asteroide.y, asteroide.tamano - 1);
  }
  actualizarMarcador();
}

// ---------- Nave ----------
function reiniciarNave() {
  nave.x = ANCHO / 2;
  nave.y = ALTO / 2;
  nave.vx = 0;
  nave.vy = 0;
  nave.angulo = -Math.PI / 2; // apuntando hacia arriba
  nave.invencible = 120;      // 2 segundos sin poder chocar
}

function disparar(ahora) {
  if (ahora - ultimoDisparo < ESPERA_DISPARO) {
    return;
  }
  ultimoDisparo = ahora;
  balas.push({
    x: nave.x + Math.cos(nave.angulo) * nave.radio,
    y: nave.y + Math.sin(nave.angulo) * nave.radio,
    vx: Math.cos(nave.angulo) * VELOCIDAD_BALA + nave.vx,
    vy: Math.sin(nave.angulo) * VELOCIDAD_BALA + nave.vy,
    vida: VIDA_BALA
  });
}

function empezar() {
  puntos = 0;
  vidas = VIDAS_INICIALES;
  oleada = 1;
  balas = [];
  asteroides = [];
  reiniciarNave();
  crearOleada();
  actualizarMarcador();
  estado = "jugando";
}

// ---------- Actualizar ----------
function actualizar(ahora) {
  // Girar y acelerar
  if (teclas.izquierda) { nave.angulo = nave.angulo - VELOCIDAD_GIRO; }
  if (teclas.derecha) { nave.angulo = nave.angulo + VELOCIDAD_GIRO; }
  if (teclas.arriba) {
    nave.vx = nave.vx + Math.cos(nave.angulo) * EMPUJE;
    nave.vy = nave.vy + Math.sin(nave.angulo) * EMPUJE;
  }
  if (teclas.disparo) {
    disparar(ahora);
  }

  nave.vx = nave.vx * FRICCION;
  nave.vy = nave.vy * FRICCION;
  nave.x = nave.x + nave.vx;
  nave.y = nave.y + nave.vy;
  darLaVuelta(nave);
  if (nave.invencible > 0) {
    nave.invencible = nave.invencible - 1;
  }

  // Balas
  for (let i = balas.length - 1; i >= 0; i--) {
    const bala = balas[i];
    bala.x = bala.x + bala.vx;
    bala.y = bala.y + bala.vy;
    darLaVuelta(bala);
    bala.vida = bala.vida - 1;
    if (bala.vida <= 0) {
      balas.splice(i, 1);
    }
  }

  // Asteroides
  for (let i = 0; i < asteroides.length; i++) {
    const a = asteroides[i];
    a.x = a.x + a.vx;
    a.y = a.y + a.vy;
    a.giro = a.giro + a.velocidadGiro;
    darLaVuelta(a);
  }

  // Balas contra asteroides
  for (let i = balas.length - 1; i >= 0; i--) {
    for (let j = asteroides.length - 1; j >= 0; j--) {
      if (distancia(balas[i], asteroides[j]) < asteroides[j].radio) {
        balas.splice(i, 1);
        partirAsteroide(j);
        break;
      }
    }
  }

  // Asteroides contra la nave
  if (nave.invencible === 0) {
    for (let j = 0; j < asteroides.length; j++) {
      if (distancia(nave, asteroides[j]) < asteroides[j].radio + nave.radio * 0.7) {
        perderVida();
        break;
      }
    }
  }

  // ¿Se acabaron los asteroides? Nueva oleada
  if (asteroides.length === 0) {
    oleada = oleada + 1;
    crearOleada();
    actualizarMarcador();
  }
}

function perderVida() {
  vidas = vidas - 1;
  actualizarMarcador();
  if (vidas <= 0) {
    estado = "fin";
  } else {
    reiniciarNave();
  }
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujarNave() {
  // Parpadea mientras es invencible
  if (nave.invencible > 0 && Math.floor(nave.invencible / 6) % 2 === 0) {
    return;
  }
  ctx.save();
  ctx.translate(nave.x, nave.y);
  ctx.rotate(nave.angulo);
  ctx.strokeStyle = COLOR_NAVE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(nave.radio, 0);                         // punta
  ctx.lineTo(-nave.radio, -nave.radio * 0.7);
  ctx.lineTo(-nave.radio * 0.5, 0);
  ctx.lineTo(-nave.radio, nave.radio * 0.7);
  ctx.closePath();
  ctx.stroke();
  // Fuego del motor al acelerar
  if (teclas.arriba && estado === "jugando") {
    ctx.strokeStyle = COLOR_BALA;
    ctx.beginPath();
    ctx.moveTo(-nave.radio * 0.6, -5);
    ctx.lineTo(-nave.radio * 1.4 - Math.random() * 6, 0);
    ctx.lineTo(-nave.radio * 0.6, 5);
    ctx.stroke();
  }
  ctx.restore();
}

function dibujarAsteroide(a) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.giro);
  ctx.strokeStyle = COLOR_ASTEROIDE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < a.forma.length; i++) {
    const angulo = (i / a.forma.length) * Math.PI * 2;
    const r = a.radio * a.forma[i];
    const x = Math.cos(angulo) * r;
    const y = Math.sin(angulo) * r;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function dibujar() {
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  for (let i = 0; i < asteroides.length; i++) {
    dibujarAsteroide(asteroides[i]);
  }

  ctx.fillStyle = COLOR_BALA;
  for (let i = 0; i < balas.length; i++) {
    ctx.beginPath();
    ctx.arc(balas[i].x, balas[i].y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (estado !== "fin") {
    dibujarNave();
  }

  if (estado === "esperando") {
    escribir("Presiona ESPACIO para empezar", ALTO / 2 + 70, 28, "#F6F4EE");
  } else if (estado === "fin") {
    escribir("Fin del juego", ALTO / 2 - 10, 48, "#FF7A7A");
    escribir("Puntos: " + puntos + " · ESPACIO para jugar otra vez", ALTO / 2 + 40, 22, "#F6F4EE");
  }
}

// ---------- El ciclo del juego ----------
function ciclo(ahora) {
  if (estado === "jugando") {
    actualizar(ahora);
  }
  dibujar();
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
function cambiarTecla(evento, presionada) {
  if (evento.key === "ArrowLeft") {
    teclas.izquierda = presionada;
  } else if (evento.key === "ArrowRight") {
    teclas.derecha = presionada;
  } else if (evento.key === "ArrowUp") {
    teclas.arriba = presionada;
  } else if (evento.key === " ") {
    if (presionada && estado !== "jugando" && !evento.repeat) {
      empezar();
    } else {
      teclas.disparo = presionada && estado === "jugando";
    }
  } else {
    return;
  }
  evento.preventDefault();
}

document.addEventListener("keydown", function (evento) {
  cambiarTecla(evento, true);
});

document.addEventListener("keyup", function (evento) {
  cambiarTecla(evento, false);
});

// ¡Arrancamos! Unos asteroides de fondo mientras espera
crearOleada();
requestAnimationFrame(ciclo);
