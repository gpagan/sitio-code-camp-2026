// ===== J6 · Adivina la palabra (ahorcado) =====

// ---------- PERSONALIZA ----------
// Palabras con su pista. Pueden llevar tildes y ñ.
const PALABRAS = [
  { palabra: "COMPUTADORA", pista: "Máquina donde programamos" },
  { palabra: "TECLADO", pista: "Tiene letras y números" },
  { palabra: "JAVASCRIPT", pista: "El lenguaje que hace pensar a una página" },
  { palabra: "VARIABLE", pista: "Una caja con nombre que guarda un dato" },
  { palabra: "BALEADA", pista: "Comida típica de Honduras" },
  { palabra: "COPÁN", pista: "Ruinas mayas de Honduras" },
  { palabra: "MONTAÑA", pista: "Más alta que una colina" },
  { palabra: "CÁMARA", pista: "Con ella tu IA te ve la mano" },
  { palabra: "ALGORITMO", pista: "Pasos ordenados para resolver un problema" },
  { palabra: "GUACAMAYA", pista: "Ave nacional de Honduras" }
];
const ERRORES_MAXIMOS = 6;
const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

// ---------- Variables del juego ----------
let actual = null;          // { palabra, pista }
let letrasProbadas = [];    // las letras que ya se intentaron
let errores = 0;
let terminado = false;

// ---------- Elementos de la página ----------
const textoPista = document.querySelector("#pista");
const textoPalabra = document.querySelector("#palabra");
const textoErrores = document.querySelector("#errores");
const mensaje = document.querySelector("#mensaje");
const botonNueva = document.querySelector("#boton-nueva");
const teclado = document.querySelector("#teclado");
const partes = document.querySelectorAll("#dibujo .parte");

// Quita las tildes para comparar: "Á" → "A" (la Ñ se queda igual)
function sinTilde(letra) {
  if (letra === "Ñ") {
    return "Ñ";
  }
  return letra.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Creamos un botón por cada letra
const teclas = {};
for (let i = 0; i < LETRAS.length; i++) {
  const letra = LETRAS[i];
  const tecla = document.createElement("button");
  tecla.className = "tecla";
  tecla.textContent = letra;
  tecla.addEventListener("click", function () {
    probarLetra(letra);
  });
  teclado.appendChild(tecla);
  teclas[letra] = tecla;
}

// Muestra la palabra con guiones bajos en las letras no adivinadas
function dibujarPalabra() {
  let texto = "";
  for (let i = 0; i < actual.palabra.length; i++) {
    const letra = actual.palabra[i];
    if (letrasProbadas.includes(sinTilde(letra))) {
      texto = texto + letra;
    } else {
      texto = texto + "_";
    }
  }
  textoPalabra.textContent = texto;
  return texto;
}

function dibujarAhorcado() {
  for (let i = 0; i < partes.length; i++) {
    if (i < errores) {
      partes[i].classList.add("visible");
    } else {
      partes[i].classList.remove("visible");
    }
  }
  textoErrores.textContent = errores;
}

function probarLetra(letra) {
  if (terminado || letrasProbadas.includes(letra)) {
    return;
  }
  letrasProbadas.push(letra);

  // ¿La letra está en la palabra?
  let esta = false;
  for (let i = 0; i < actual.palabra.length; i++) {
    if (sinTilde(actual.palabra[i]) === letra) {
      esta = true;
    }
  }

  teclas[letra].disabled = true;
  if (esta) {
    teclas[letra].classList.add("acierto");
  } else {
    teclas[letra].classList.add("fallo");
    errores = errores + 1;
  }

  const visible = dibujarPalabra();
  dibujarAhorcado();

  if (!visible.includes("_")) {
    terminar(true);
  } else if (errores >= ERRORES_MAXIMOS) {
    terminar(false);
  }
}

function terminar(gano) {
  terminado = true;
  if (gano) {
    mensaje.textContent = "🎉 ¡Adivinaste!";
    mensaje.className = "mensaje gano";
  } else {
    textoPalabra.textContent = actual.palabra;
    mensaje.textContent = "La palabra era " + actual.palabra;
    mensaje.className = "mensaje perdio";
  }
  for (const letra in teclas) {
    teclas[letra].disabled = true;
  }
  botonNueva.hidden = false;
  botonNueva.focus();
}

function nuevaPalabra() {
  // Elegimos una palabra distinta de la anterior
  let siguiente = actual;
  while (siguiente === actual) {
    siguiente = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  }
  actual = siguiente;
  letrasProbadas = [];
  errores = 0;
  terminado = false;
  mensaje.textContent = "";
  mensaje.className = "mensaje";
  botonNueva.hidden = true;
  textoPista.textContent = "Pista: " + actual.pista + " (" + actual.palabra.length + " letras)";

  for (const letra in teclas) {
    teclas[letra].disabled = false;
    teclas[letra].classList.remove("acierto", "fallo");
  }
  dibujarPalabra();
  dibujarAhorcado();
}

// También se juega con el teclado de la computadora
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter" && terminado) {
    nuevaPalabra();
    return;
  }
  const letra = sinTilde(evento.key.toUpperCase());
  if (letra.length === 1 && LETRAS.includes(letra)) {
    probarLetra(letra);
  }
});

botonNueva.addEventListener("click", nuevaPalabra);

// Empezamos
nuevaPalabra();
