// ===== Clase 4: variables y decisiones =====

// 1. Variables: cajas con nombre que guardan un dato
const ahora = new Date();          // la fecha y hora de la computadora
const hora = ahora.getHours();     // un número del 0 al 23
const minutos = ahora.getMinutes();
const dia = ahora.getDay();        // 0 = domingo, 1 = lunes ... 6 = sábado

// La consola (tecla F12) es tu mejor amiga: aquí ves lo que pasa
console.log("Son las", hora, "horas y hoy es el día número", dia);

// 2. Decisiones: si pasa esto, haz aquello; si no, haz lo otro
let saludo;
let claseDelFondo;

if (hora < 12) {
  saludo = "¡Buenos días!";
  claseDelFondo = "manana";
} else if (hora < 19) {
  saludo = "¡Buenas tardes!";
  claseDelFondo = "tarde";
} else {
  saludo = "¡Buenas noches!";
  claseDelFondo = "noche";
}

// 3. Cambiar la página desde JavaScript
document.querySelector("#saludo").textContent = saludo;
document.body.classList.add(claseDelFondo);

// Mostramos la hora con dos dígitos en los minutos (por ejemplo 7:05)
let textoMinutos = minutos;
if (minutos < 10) {
  textoMinutos = "0" + minutos;
}
document.querySelector("#hora").textContent = "Son las " + hora + ":" + textoMinutos;

// ===== Misión del día: un mensaje distinto según el día de la semana =====
// Una lista (arreglo) con los nombres de los días, en el mismo orden que getDay()
const nombresDias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

let mensaje;
if (dia === 5) {
  mensaje = "¡Último día de la semana!";
} else if (dia === 0 || dia === 6) {
  mensaje = "¡Es fin de semana, a descansar!";
} else {
  mensaje = "Hoy es " + nombresDias[dia] + ". ¡A programar!";
}

document.querySelector("#mensaje-dia").textContent = mensaje;
