// ===== P7 · Dado y ruleta de decisiones =====

// Un número entero al azar entre minimo y maximo (incluidos)
function aleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

// Elige un elemento al azar de una lista
// (¡la computadora usará esta misma idea para elegir piedra, papel o tijera!)
function elegirAlAzar(lista) {
  return lista[aleatorio(0, lista.length - 1)];
}

// ================= EL DADO =================
const dado = document.querySelector("#dado");
const puntos = document.querySelectorAll("#dado .punto");
const valorDado = document.querySelector("#valor-dado");
const botonDado = document.querySelector("#boton-dado");
const historialDado = document.querySelector("#historial-dado");
const historial = []; // una lista con los últimos lanzamientos

// Qué casillas (de 0 a 8) se encienden para cada número
//  0 1 2
//  3 4 5
//  6 7 8
const CARAS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

function dibujarDado(numero) {
  // Primero apagamos todos los puntos
  for (let i = 0; i < puntos.length; i++) {
    puntos[i].classList.remove("encendido");
  }
  // Luego encendemos los de esa cara
  const casillas = CARAS[numero];
  for (let i = 0; i < casillas.length; i++) {
    puntos[casillas[i]].classList.add("encendido");
  }
}

function lanzarDado() {
  const numero = aleatorio(1, 6);

  // Reiniciamos la animación: quitamos la clase, forzamos al navegador a notarlo y la ponemos otra vez
  dado.classList.remove("rodando");
  void dado.offsetWidth;
  dado.classList.add("rodando");

  dibujarDado(numero);
  valorDado.textContent = "Salió " + numero;

  // Guardamos solo los últimos 5 lanzamientos
  historial.push(numero);
  if (historial.length > 5) {
    historial.shift(); // quita el más viejo
  }
  historialDado.textContent = "Últimos: " + historial.join(", ");
}

botonDado.addEventListener("click", lanzarDado);
dibujarDado(1);

// ================= LA RULETA =================
const campoOpciones = document.querySelector("#opciones");
const eleccion = document.querySelector("#eleccion");
const botonRuleta = document.querySelector("#boton-ruleta");

// PERSONALIZA: cuántas vueltas da antes de detenerse y qué tan rápido
const PASOS_DE_LA_RULETA = 18;
const MILISEGUNDOS_POR_PASO = 80;

// Convierte el texto del cuadro en una lista, una opción por línea
function leerOpciones() {
  const lineas = campoOpciones.value.split("\n");
  const opciones = [];
  for (let i = 0; i < lineas.length; i++) {
    const limpia = lineas[i].trim();
    if (limpia !== "") {
      opciones.push(limpia);
    }
  }
  return opciones;
}

function girarRuleta() {
  const opciones = leerOpciones();

  if (opciones.length < 2) {
    eleccion.textContent = "Escribe al menos 2 opciones";
    eleccion.classList.remove("elegido");
    return;
  }

  botonRuleta.disabled = true;
  eleccion.classList.remove("elegido");

  // Mostramos opciones al azar muy rápido, como una ruleta que gira
  let paso = 0;
  const intervalo = setInterval(function () {
    eleccion.textContent = elegirAlAzar(opciones);
    paso = paso + 1;

    if (paso >= PASOS_DE_LA_RULETA) {
      clearInterval(intervalo);
      const final = elegirAlAzar(opciones);
      eleccion.textContent = "🎉 " + final;
      eleccion.classList.add("elegido");
      botonRuleta.disabled = false;
    }
  }, MILISEGUNDOS_POR_PASO);
}

botonRuleta.addEventListener("click", girarRuleta);
