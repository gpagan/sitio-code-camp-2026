// ===== Clase 6: mi primer juego, "Adivina el número" =====
// Reglas en español, antes de programar:
// 1. La computadora elige un número del 1 al 100.
// 2. El jugador tiene 10 intentos.
// 3. Después de cada intento, el juego dice si el número es mayor o menor.
// 4. Al acertar o al acabarse los intentos, el juego termina y se puede volver a jugar.

// PERSONALIZA: rango e intentos
const NUMERO_MAXIMO = 100;
const INTENTOS_MAXIMOS = 10;

// Las piezas del juego (variables)
let numeroSecreto = elegirNumero();
let intentos = 0;
let record = null; // reto para casa: el menor número de intentos con que se ganó

// Los elementos de la página
const campo = document.querySelector("#campo-intento");
const botonEnviar = document.querySelector("#boton-enviar");
const pista = document.querySelector("#pista");
const temperatura = document.querySelector("#temperatura");
const intentosPrevios = document.querySelector("#intentos-previos");
const intentosRestantes = document.querySelector("#intentos-restantes");
const textoRecord = document.querySelector("#record");
const botonReiniciar = document.querySelector("#boton-reiniciar");

function elegirNumero() {
  return Math.floor(Math.random() * NUMERO_MAXIMO) + 1;
}

function revisarIntento() {
  const intento = Number(campo.value);

  // Validar: que sea un número dentro del rango
  if (!intento || intento < 1 || intento > NUMERO_MAXIMO) {
    pista.textContent = "Escribe un número del 1 al " + NUMERO_MAXIMO;
    pista.className = "pista";
    return;
  }

  intentos = intentos + 1;

  // Guardar el intento en la lista de intentos anteriores
  if (intentos === 1) {
    intentosPrevios.textContent = intento;
  } else {
    intentosPrevios.textContent = intentosPrevios.textContent + ", " + intento;
  }
  intentosRestantes.textContent = INTENTOS_MAXIMOS - intentos;

  if (intento === numeroSecreto) {
    pista.textContent = "¡Felicidades! Lo adivinaste en " + intentos + " intentos.";
    pista.className = "pista gano";
    temperatura.textContent = "";
    actualizarRecord();
    terminarJuego();
  } else if (intentos === INTENTOS_MAXIMOS) {
    pista.textContent = "¡Fin del juego! El número era " + numeroSecreto + ".";
    pista.className = "pista perdio";
    temperatura.textContent = "";
    terminarJuego();
  } else {
    if (intento < numeroSecreto) {
      pista.textContent = "El número secreto es MAYOR que " + intento;
    } else {
      pista.textContent = "El número secreto es MENOR que " + intento;
    }
    pista.className = "pista";
    // Mejora hecha con ayuda de la IA: pista "caliente o frío"
    temperatura.textContent = pistaDeTemperatura(intento);
  }

  campo.value = "";
  campo.focus();
}

// Mejora con IA: qué tan cerca está el intento del número secreto
function pistaDeTemperatura(intento) {
  const distancia = Math.abs(numeroSecreto - intento); // distancia sin signo
  if (distancia <= 3) {
    return "🔥 ¡Te quemas!";
  } else if (distancia <= 10) {
    return "♨️ Caliente";
  } else if (distancia <= 25) {
    return "🌤️ Tibio";
  } else {
    return "❄️ Frío";
  }
}

// Reto para casa de la clase 6: guardar el récord
function actualizarRecord() {
  if (record === null || intentos < record) {
    record = intentos;
    textoRecord.textContent = record + " intentos";
  }
}

function terminarJuego() {
  campo.disabled = true;
  botonEnviar.disabled = true;
  botonReiniciar.hidden = false;
}

function reiniciarJuego() {
  intentos = 0;
  numeroSecreto = elegirNumero();
  campo.disabled = false;
  botonEnviar.disabled = false;
  botonReiniciar.hidden = true;
  pista.textContent = "";
  pista.className = "pista";
  temperatura.textContent = "";
  intentosPrevios.textContent = "ninguno";
  intentosRestantes.textContent = INTENTOS_MAXIMOS;
  campo.value = "";
  campo.focus();
}

// Eventos
botonEnviar.addEventListener("click", revisarIntento);
botonReiniciar.addEventListener("click", reiniciarJuego);

// También se puede enviar con la tecla Enter
campo.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    revisarIntento();
  }
});
