// ===== P9 · Cronómetro y cuenta regresiva =====

// ================= CRONÓMETRO =================
// Idea clave: guardamos el MOMENTO en que empezamos (Date.now() da los
// milisegundos desde 1970) y en cada actualización restamos: ahora - inicio.
// Así el tiempo es exacto aunque el navegador se atrase un poco.

const pantallaCronometro = document.querySelector("#pantalla-cronometro");
const botonIniciar = document.querySelector("#boton-iniciar");
const botonVuelta = document.querySelector("#boton-vuelta");
const botonReiniciar = document.querySelector("#boton-reiniciar");
const listaVueltas = document.querySelector("#vueltas");

let corriendo = false;
let inicio = 0;           // momento en que se presionó Iniciar
let acumulado = 0;        // milisegundos de veces anteriores (por las pausas)
let intervaloCronometro = null;

// Convierte milisegundos a "mm:ss.cc" (minutos, segundos, centésimas)
function formatoTiempo(milisegundos) {
  const minutos = Math.floor(milisegundos / 60000);
  const segundos = Math.floor((milisegundos % 60000) / 1000);
  const centesimas = Math.floor((milisegundos % 1000) / 10);
  return dosDigitos(minutos) + ":" + dosDigitos(segundos) + "." + dosDigitos(centesimas);
}

function dosDigitos(numero) {
  if (numero < 10) {
    return "0" + numero;
  }
  return String(numero);
}

function tiempoTranscurrido() {
  if (corriendo) {
    return acumulado + (Date.now() - inicio);
  }
  return acumulado;
}

function actualizarCronometro() {
  pantallaCronometro.textContent = formatoTiempo(tiempoTranscurrido());
}

function iniciarOPausar() {
  if (!corriendo) {
    // Iniciar (o continuar después de una pausa)
    corriendo = true;
    inicio = Date.now();
    intervaloCronometro = setInterval(actualizarCronometro, 10);
    botonIniciar.textContent = "Pausar";
    botonVuelta.disabled = false;
  } else {
    // Pausar: guardamos lo que llevamos
    acumulado = tiempoTranscurrido();
    corriendo = false;
    clearInterval(intervaloCronometro);
    botonIniciar.textContent = "Continuar";
    botonVuelta.disabled = true;
    actualizarCronometro();
  }
}

function marcarVuelta() {
  const elemento = document.createElement("li");
  elemento.textContent = formatoTiempo(tiempoTranscurrido());
  listaVueltas.appendChild(elemento);
}

function reiniciarCronometro() {
  clearInterval(intervaloCronometro);
  corriendo = false;
  acumulado = 0;
  botonIniciar.textContent = "Iniciar";
  botonVuelta.disabled = true;
  listaVueltas.innerHTML = "";
  actualizarCronometro();
}

botonIniciar.addEventListener("click", iniciarOPausar);
botonVuelta.addEventListener("click", marcarVuelta);
botonReiniciar.addEventListener("click", reiniciarCronometro);

// ================= CUENTA REGRESIVA =================
const campoSegundos = document.querySelector("#segundos");
const pantallaCuenta = document.querySelector("#pantalla-cuenta");
const botonCuenta = document.querySelector("#boton-cuenta");
const botonCancelar = document.querySelector("#boton-cancelar");

// PERSONALIZA: el mensaje al llegar a cero
const MENSAJE_FINAL = "¡Ya!";

let intervaloCuenta = null;

// Muestra un número con el efecto de "latido"
function mostrarNumero(texto) {
  pantallaCuenta.textContent = texto;
  pantallaCuenta.classList.remove("latido");
  void pantallaCuenta.offsetWidth; // reinicia la animación
  pantallaCuenta.classList.add("latido");
}

function empezarCuenta() {
  const total = Math.floor(Number(campoSegundos.value));
  if (!total || total < 1) {
    pantallaCuenta.textContent = "?";
    return;
  }

  let restantes = total;
  pantallaCuenta.classList.remove("ya");
  mostrarNumero(restantes);
  botonCuenta.disabled = true;
  botonCancelar.disabled = false;

  // Cada segundo restamos 1
  intervaloCuenta = setInterval(function () {
    restantes = restantes - 1;
    if (restantes > 0) {
      mostrarNumero(restantes);
    } else {
      terminarCuenta();
    }
  }, 1000);
}

function terminarCuenta() {
  clearInterval(intervaloCuenta);
  mostrarNumero(MENSAJE_FINAL);
  pantallaCuenta.classList.add("ya");
  botonCuenta.disabled = false;
  botonCancelar.disabled = true;
}

function cancelarCuenta() {
  clearInterval(intervaloCuenta);
  pantallaCuenta.classList.remove("ya");
  pantallaCuenta.textContent = campoSegundos.value;
  botonCuenta.disabled = false;
  botonCancelar.disabled = true;
}

botonCuenta.addEventListener("click", empezarCuenta);
botonCancelar.addEventListener("click", cancelarCuenta);
