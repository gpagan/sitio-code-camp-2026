// ===== P10 · Quiz de mi tema favorito =====

// ---------- PERSONALIZA ----------
const TEMA = "Tecnología y ciencia";

// Una lista de preguntas. Cada una tiene: el texto, sus opciones y
// la posición de la respuesta correcta (0 = la primera opción).
const PREGUNTAS = [
  {
    texto: "¿Qué lenguaje se usa para darle colores y diseño a una página web?",
    opciones: ["HTML", "CSS", "Python", "Excel"],
    correcta: 1
  },
  {
    texto: "¿Qué etiqueta de HTML se usa para crear un enlace?",
    opciones: ["<a>", "<p>", "<img>", "<h1>"],
    correcta: 0
  },
  {
    texto: "¿Cuántos bits tiene un byte?",
    opciones: ["2", "4", "8", "10"],
    correcta: 2
  },
  {
    texto: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Tierra", "Saturno", "Marte", "Júpiter"],
    correcta: 3
  },
  {
    texto: "En JavaScript, ¿qué hace console.log()?",
    opciones: ["Borra la página", "Muestra un mensaje en la consola", "Abre una ventana nueva", "Apaga la computadora"],
    correcta: 1
  },
  {
    texto: "¿Cuál es la capital de Honduras?",
    opciones: ["San Pedro Sula", "La Ceiba", "Tegucigalpa", "Comayagua"],
    correcta: 2
  }
];

// ---------- Variables del quiz ----------
let indice = 0;     // qué pregunta vamos mostrando
let puntaje = 0;

// ---------- Elementos de la página ----------
const textoTema = document.querySelector("#tema");
const barra = document.querySelector("#barra");
const numeroPregunta = document.querySelector("#numero-pregunta");
const pregunta = document.querySelector("#pregunta");
const contenedorOpciones = document.querySelector("#opciones");
const mensaje = document.querySelector("#mensaje");
const botonSiguiente = document.querySelector("#boton-siguiente");
const pantallaFinal = document.querySelector("#final");
const textoPuntaje = document.querySelector("#puntaje");
const textoTotal = document.querySelector("#total");
const comentario = document.querySelector("#comentario");
const botonReiniciar = document.querySelector("#boton-reiniciar");

textoTema.textContent = TEMA;

function mostrarPregunta() {
  const actual = PREGUNTAS[indice];

  numeroPregunta.textContent = "Pregunta " + (indice + 1) + " de " + PREGUNTAS.length;
  barra.style.width = (indice / PREGUNTAS.length) * 100 + "%";
  pregunta.textContent = actual.texto;
  mensaje.textContent = "";
  mensaje.className = "mensaje";
  botonSiguiente.hidden = true;

  // Borramos los botones anteriores y creamos uno por cada opción
  contenedorOpciones.innerHTML = "";
  for (let i = 0; i < actual.opciones.length; i++) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = actual.opciones[i];   // textContent muestra "<a>" como texto
    boton.addEventListener("click", function () {
      responder(i);
    });
    contenedorOpciones.appendChild(boton);
  }
}

function responder(elegida) {
  const actual = PREGUNTAS[indice];
  const botones = contenedorOpciones.querySelectorAll(".opcion");

  // Desactivamos todas las opciones y marcamos la correcta en verde
  for (let i = 0; i < botones.length; i++) {
    botones[i].disabled = true;
  }
  botones[actual.correcta].classList.add("correcta");

  if (elegida === actual.correcta) {
    puntaje = puntaje + 1;
    mensaje.textContent = "¡Correcto!";
    mensaje.className = "mensaje bien";
  } else {
    botones[elegida].classList.add("incorrecta");
    mensaje.textContent = "La respuesta era: " + actual.opciones[actual.correcta];
    mensaje.className = "mensaje mal";
  }

  if (indice === PREGUNTAS.length - 1) {
    botonSiguiente.textContent = "Ver resultado";
  } else {
    botonSiguiente.textContent = "Siguiente";
  }
  botonSiguiente.hidden = false;
  botonSiguiente.focus();
}

function siguiente() {
  indice = indice + 1;
  if (indice < PREGUNTAS.length) {
    mostrarPregunta();
  } else {
    mostrarFinal();
  }
}

function mostrarFinal() {
  barra.style.width = "100%";
  numeroPregunta.textContent = "";
  pregunta.textContent = "¡Terminaste!";
  contenedorOpciones.innerHTML = "";
  mensaje.textContent = "";
  botonSiguiente.hidden = true;
  pantallaFinal.hidden = false;

  textoPuntaje.textContent = puntaje;
  textoTotal.textContent = PREGUNTAS.length;

  const porcentaje = puntaje / PREGUNTAS.length;
  if (porcentaje === 1) {
    comentario.textContent = "🏆 ¡Perfecto! Eres un experto.";
  } else if (porcentaje >= 0.6) {
    comentario.textContent = "👏 ¡Muy bien! Casi todas.";
  } else {
    comentario.textContent = "💪 Sigue practicando, ¡tú puedes!";
  }
}

function reiniciar() {
  indice = 0;
  puntaje = 0;
  pantallaFinal.hidden = true;
  mostrarPregunta();
}

botonSiguiente.addEventListener("click", siguiente);
botonReiniciar.addEventListener("click", reiniciar);

// Empezamos
mostrarPregunta();
