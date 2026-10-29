// ===== Invasores del espacio (estilo Space Invaders) =====

const lienzo = document.querySelector("#lienzo");
const ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width;
const ALTO = lienzo.height;

// ---------- PERSONALIZA ----------
const COLOR_FONDO = "#05080F";
const COLOR_NAVE = "#C8F25A";
const COLOR_BALA = "#F6F4EE";
const COLOR_BALA_ENEMIGA = "#FF7A7A";
const COLORES_FILAS = ["#FF7A7A", "#FFB27A", "#5AD1F2", "#B48CF2"];
const PUNTOS_FILAS = [40, 30, 20, 10];
const VIDAS_INICIALES = 3;
const VELOCIDAD_NAVE = 6;
const VELOCIDAD_BALA = 9;
const VELOCIDAD_BALA_ENEMIGA = 4.5;
const ESPERA_ENTRE_DISPAROS = 350; // milisegundos
const PROBABILIDAD_DISPARO_ENEMIGO = 0.02; // en cada cuadro

// ---------- Invasores ----------
const FILAS_ALIENS = 4;
const COLUMNAS_ALIENS = 9;
const ANCHO_ALIEN = 40;
const ALTO_ALIEN = 28;
const SEPARACION_X = 20;
const SEPARACION_Y = 18;
const BAJADA = 20; // cuánto bajan al tocar un borde

// ---------- Objetos del juego ----------
const nave = { x: ANCHO / 2 - 25, y: ALTO - 60, ancho: 50, alto: 24 };

let aliens = [];
let balas = [];
let balasEnemigas = [];
let direccionAliens = 1; // 1 = derecha, -1 = izquierda
let oleada = 1;
let puntos = 0;
let vidas = VIDAS_INICIALES;
let estado = "esperando"; // "esperando", "jugando" o "fin"
let ultimoDisparo = 0;
let avisoOleadaHasta = 0;
let teclaIzquierda = false;
let teclaDerecha = false;
let teclaDisparo = false;

const textoPuntos = document.querySelector("#puntos");
const textoVidas = document.querySelector("#vidas");
const textoOleada = document.querySelector("#oleada");

function actualizarMarcador() {
  textoPuntos.textContent = puntos;
  textoVidas.textContent = vidas;
  textoOleada.textContent = oleada;
}

function crearAliens() {
  aliens = [];
  const anchoTotal = COLUMNAS_ALIENS * ANCHO_ALIEN + (COLUMNAS_ALIENS - 1) * SEPARACION_X;
  const inicioX = (ANCHO - anchoTotal) / 2;
  for (let fila = 0; fila < FILAS_ALIENS; fila++) {
    for (let columna = 0; columna < COLUMNAS_ALIENS; columna++) {
      aliens.push({
        x: inicioX + columna * (ANCHO_ALIEN + SEPARACION_X),
        y: 70 + fila * (ALTO_ALIEN + SEPARACION_Y),
        ancho: ANCHO_ALIEN,
        alto: ALTO_ALIEN,
        fila: fila,
        vivo: true
      });
    }
  }
  direccionAliens = 1;
}

function reiniciar() {
  puntos = 0;
  vidas = VIDAS_INICIALES;
  oleada = 1;
  balas = [];
  balasEnemigas = [];
  nave.x = ANCHO / 2 - nave.ancho / 2;
  crearAliens();
  actualizarMarcador();
}

function aliensVivos() {
  const vivos = [];
  for (let i = 0; i < aliens.length; i++) {
    if (aliens[i].vivo) {
      vivos.push(aliens[i]);
    }
  }
  return vivos;
}

// ¿Se tocan dos rectángulos?
function chocan(a, b) {
  return a.x < b.x + b.ancho && a.x + a.ancho > b.x && a.y < b.y + b.alto && a.y + a.alto > b.y;
}

// ---------- Movimiento ----------
function moverNave() {
  if (teclaIzquierda) {
    nave.x = nave.x - VELOCIDAD_NAVE;
  }
  if (teclaDerecha) {
    nave.x = nave.x + VELOCIDAD_NAVE;
  }
  nave.x = Math.max(0, Math.min(ANCHO - nave.ancho, nave.x));
}

function disparar(ahora) {
  if (ahora - ultimoDisparo < ESPERA_ENTRE_DISPAROS) {
    return; // todavía no se recarga
  }
  ultimoDisparo = ahora;
  balas.push({ x: nave.x + nave.ancho / 2 - 2, y: nave.y - 12, ancho: 4, alto: 12 });
}

function moverAliens() {
  const vivos = aliensVivos();
  if (vivos.length === 0) {
    return;
  }

  // Mientras menos quedan, más rápido van
  const velocidad = 0.5 + oleada * 0.3 + (aliens.length - vivos.length) * 0.05;

  // Buscamos el invasor más a la izquierda y el más a la derecha
  let izquierda = ANCHO;
  let derecha = 0;
  for (let i = 0; i < vivos.length; i++) {
    izquierda = Math.min(izquierda, vivos[i].x);
    derecha = Math.max(derecha, vivos[i].x + ANCHO_ALIEN);
  }

  const tocaBorde = (direccionAliens === 1 && derecha + velocidad > ANCHO - 10) ||
                    (direccionAliens === -1 && izquierda - velocidad < 10);

  for (let i = 0; i < vivos.length; i++) {
    if (tocaBorde) {
      vivos[i].y = vivos[i].y + BAJADA;
    } else {
      vivos[i].x = vivos[i].x + velocidad * direccionAliens;
    }
    // ¿Llegaron hasta la nave?
    if (vivos[i].y + ALTO_ALIEN >= nave.y) {
      estado = "fin";
    }
  }

  if (tocaBorde) {
    direccionAliens = -direccionAliens;
  }
}

function disparosEnemigos() {
  if (Math.random() < PROBABILIDAD_DISPARO_ENEMIGO + oleada * 0.005) {
    const vivos = aliensVivos();
    if (vivos.length > 0) {
      const tirador = vivos[Math.floor(Math.random() * vivos.length)];
      balasEnemigas.push({ x: tirador.x + ANCHO_ALIEN / 2 - 2, y: tirador.y + ALTO_ALIEN, ancho: 4, alto: 12 });
    }
  }
}

function moverBalas() {
  // Recorremos al revés para poder borrar sin saltarnos ninguna
  for (let i = balas.length - 1; i >= 0; i--) {
    balas[i].y = balas[i].y - VELOCIDAD_BALA;
    if (balas[i].y + balas[i].alto < 0) {
      balas.splice(i, 1);
    }
  }
  for (let i = balasEnemigas.length - 1; i >= 0; i--) {
    balasEnemigas[i].y = balasEnemigas[i].y + VELOCIDAD_BALA_ENEMIGA;
    if (balasEnemigas[i].y > ALTO) {
      balasEnemigas.splice(i, 1);
    }
  }
}

function revisarChoques(ahora) {
  // Nuestras balas contra los invasores
  for (let i = balas.length - 1; i >= 0; i--) {
    for (let j = 0; j < aliens.length; j++) {
      if (aliens[j].vivo && chocan(balas[i], aliens[j])) {
        aliens[j].vivo = false;
        puntos = puntos + PUNTOS_FILAS[aliens[j].fila];
        balas.splice(i, 1);
        actualizarMarcador();
        break;
      }
    }
  }

  // Balas enemigas contra nuestra nave
  for (let i = balasEnemigas.length - 1; i >= 0; i--) {
    if (chocan(balasEnemigas[i], nave)) {
      balasEnemigas.splice(i, 1);
      vidas = vidas - 1;
      actualizarMarcador();
      if (vidas <= 0) {
        estado = "fin";
      }
    }
  }

  // ¿Destruimos a todos? Viene una oleada nueva, más rápida
  if (aliensVivos().length === 0) {
    oleada = oleada + 1;
    balasEnemigas = [];
    crearAliens();
    actualizarMarcador();
    avisoOleadaHasta = ahora + 1500;
  }
}

// ---------- Dibujo ----------
function escribir(texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = "bold " + tamano + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(texto, ANCHO / 2, y);
}

function dibujarAlien(alien, ahora) {
  const x = alien.x;
  const y = alien.y;
  ctx.fillStyle = COLORES_FILAS[alien.fila];
  ctx.fillRect(x + 6, y, 28, 18);            // cabeza
  ctx.fillRect(x, y + 6, 40, 8);             // brazos
  // Patas: cambian de posición para que parezca que caminan
  if (Math.floor(ahora / 400) % 2 === 0) {
    ctx.fillRect(x + 6, y + 18, 6, 10);
    ctx.fillRect(x + 28, y + 18, 6, 10);
  } else {
    ctx.fillRect(x + 12, y + 18, 6, 10);
    ctx.fillRect(x + 22, y + 18, 6, 10);
  }
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(x + 12, y + 6, 5, 5);         // ojos
  ctx.fillRect(x + 23, y + 6, 5, 5);
}

function dibujarNave() {
  ctx.fillStyle = COLOR_NAVE;
  ctx.beginPath();
  ctx.moveTo(nave.x + nave.ancho / 2, nave.y);
  ctx.lineTo(nave.x + nave.ancho, nave.y + nave.alto);
  ctx.lineTo(nave.x, nave.y + nave.alto);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(nave.x + nave.ancho / 2 - 3, nave.y - 6, 6, 8); // cañón
}

function dibujar(ahora) {
  ctx.fillStyle = COLOR_FONDO;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  for (let i = 0; i < aliens.length; i++) {
    if (aliens[i].vivo) {
      dibujarAlien(aliens[i], ahora);
    }
  }

  ctx.fillStyle = COLOR_BALA;
  for (let i = 0; i < balas.length; i++) {
    ctx.fillRect(balas[i].x, balas[i].y, balas[i].ancho, balas[i].alto);
  }
  ctx.fillStyle = COLOR_BALA_ENEMIGA;
  for (let i = 0; i < balasEnemigas.length; i++) {
    ctx.fillRect(balasEnemigas[i].x, balasEnemigas[i].y, balasEnemigas[i].ancho, balasEnemigas[i].alto);
  }

  dibujarNave();

  if (estado === "esperando") {
    escribir("Presiona ESPACIO para empezar", ALTO / 2 + 60, 28, "#F6F4EE");
  } else if (estado === "fin") {
    escribir("Fin del juego", ALTO / 2 + 20, 48, "#FF7A7A");
    escribir("Puntos: " + puntos + " · ESPACIO para jugar otra vez", ALTO / 2 + 70, 22, "#F6F4EE");
  } else if (ahora < avisoOleadaHasta) {
    escribir("¡Oleada " + oleada + "!", ALTO / 2 + 40, 40, "#C8F25A");
  }
}

// ---------- El ciclo del juego ----------
function ciclo(ahora) {
  if (estado === "jugando") {
    moverNave();
    if (teclaDisparo) {
      disparar(ahora);
    }
    moverAliens();
    disparosEnemigos();
    moverBalas();
    revisarChoques(ahora);
  }
  dibujar(ahora);
  requestAnimationFrame(ciclo);
}

// ---------- Controles ----------
document.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowLeft") {
    teclaIzquierda = true;
  } else if (evento.key === "ArrowRight") {
    teclaDerecha = true;
  } else if (evento.key === " ") {
    if (estado === "jugando") {
      teclaDisparo = true;
    } else if (!evento.repeat) {
      reiniciar();
      estado = "jugando";
    }
  } else {
    return;
  }
  evento.preventDefault();
});

document.addEventListener("keyup", function (evento) {
  if (evento.key === "ArrowLeft") {
    teclaIzquierda = false;
  } else if (evento.key === "ArrowRight") {
    teclaDerecha = false;
  } else if (evento.key === " ") {
    teclaDisparo = false;
  }
});

// ¡Arrancamos!
crearAliens();
requestAnimationFrame(ciclo);
