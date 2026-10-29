// ===== Bonus · Mi CV del futuro =====
// Todo tu CV está en estos datos. Cámbialos por los tuyos.
// Recuerda: NO escribas tu dirección, tu teléfono ni datos privados.

// ---------- PERSONALIZA: quién quieres ser ----------
const YO = {
  nombre: "Ana",
  titulo: "Ingeniera en Inteligencia Artificial",
  lema: "Quiero usar la tecnología para que en Honduras todos puedan aprender.",
  avatar: "👩🏽‍💻",          // un emoji o una letra; no hace falta una foto
  edadHoy: 14,               // tu edad en este momento
  anioDelFuturo: 2040,       // el año de tu CV del futuro
  sobreMi: "Soy ingeniera en inteligencia artificial y lidero un equipo que crea aplicaciones para escuelas de Honduras. Empecé a programar a los 14 años en un Code Camp, haciendo un juego de piedra, papel o tijera con mi propia IA. Me gusta resolver problemas reales y enseñar a otros lo que aprendo."
};

// ---------- PERSONALIZA: tu camino, en orden ----------
// anio: el año de la meta · titulo: qué lograste · detalle: cómo o por qué
const HITOS = [
  { anio: 2026, titulo: "Code Camp Vacacional", detalle: "Programé mi primer juego con inteligencia artificial y lo presenté a mi familia." },
  { anio: 2028, titulo: "Primer lugar en una feria de ciencias", detalle: "Presenté una app que ayuda a estudiar matemáticas." },
  { anio: 2030, titulo: "Me gradúo del colegio", detalle: "Con buenas notas en matemáticas e inglés." },
  { anio: 2034, titulo: "Termino la universidad", detalle: "Ingeniería en Sistemas, con mi proyecto final sobre IA en la educación." },
  { anio: 2036, titulo: "Mi primer trabajo en tecnología", detalle: "Desarrolladora en una empresa que crea software para escuelas." },
  { anio: 2040, titulo: "Lidero mi propio equipo", detalle: "Creamos herramientas de IA que usan miles de estudiantes." }
];

// ---------- PERSONALIZA: estudios ----------
const ESTUDIOS = [
  { titulo: "Ingeniería en Sistemas", lugar: "Universidad en Honduras", anio: 2034 },
  { titulo: "Maestría en Inteligencia Artificial", lugar: "Estudios en línea", anio: 2038 },
  { titulo: "Code Camp Vacacional", lugar: "Mi primer curso de programación", anio: 2026 }
];

// ---------- PERSONALIZA: habilidades (nivel de 0 a 100) ----------
const HABILIDADES = [
  { nombre: "JavaScript", nivel: 90 },
  { nombre: "Inteligencia artificial", nivel: 85 },
  { nombre: "Trabajo en equipo", nivel: 95 },
  { nombre: "Hablar en público", nivel: 75 },
  { nombre: "Diseño", nivel: 70 }
];

const IDIOMAS = ["Español · nativo", "Inglés · avanzado", "Francés · básico"];

// ---------- PERSONALIZA: lo que quieres lograr ----------
const LOGROS = [
  { icono: "🏫", titulo: "Una app para 100 escuelas", detalle: "Que los estudiantes practiquen con un tutor de IA, aunque tengan poco internet." },
  { icono: "🏆", titulo: "Ganar un hackatón", detalle: "Con un equipo de amigos, resolviendo un problema de mi comunidad." },
  { icono: "👩‍🏫", titulo: "Enseñar a programar", detalle: "Dar un Code Camp a jóvenes, como el que yo recibí." },
  { icono: "🌎", titulo: "Trabajar con personas de otros países", detalle: "Y mostrar el talento que hay en Honduras." }
];

const VALORES = ["Honestidad", "Curiosidad", "Perseverancia", "Ayudar a otros", "Responsabilidad"];

// ---------- PERSONALIZA: tu carta (puedes usar varias líneas) ----------
const CARTA = `Querida Ana del ${YO.anioDelFuturo}:

Hoy tengo ${YO.edadHoy} años y acabo de programar mi primer juego. Me equivoqué muchas veces, pero aprendí que un error es solo una pista.
Espero que sigas siendo curiosa, que ayudes a los demás y que nunca dejes de aprender.`;

const FIRMA = "Ana, en 2026";

// PERSONALIZA: los colores del botón "Cambiar color"
const COLORES = ["#C8F25A", "#5AD1F2", "#FFB84D", "#FF8FB1", "#B79CFF"];


// =====================================================================
// De aquí para abajo, el código que arma la página con tus datos.
// =====================================================================

const anioActual = new Date().getFullYear();

// Una función pequeña para no repetir: crea un elemento con su clase y su texto
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) {
    elemento.className = clase;
  }
  if (texto !== undefined) {
    elemento.textContent = texto; // textContent: seguro, no interpreta HTML
  }
  return elemento;
}

// ---------- Encabezado y datos rápidos ----------
function llenarEncabezado() {
  document.querySelector("#avatar").textContent = YO.avatar;
  document.querySelector("#nombre").textContent = YO.nombre;
  document.querySelector("#titulo").textContent = YO.titulo;
  document.querySelector("#lema").textContent = "“" + YO.lema + "”";
  document.querySelector("#anio-futuro").textContent = YO.anioDelFuturo;
  document.querySelector("#sobre-mi").textContent = YO.sobreMi;

  const aniosQueFaltan = Math.max(0, YO.anioDelFuturo - anioActual);
  document.querySelector("#dato-anios").textContent = aniosQueFaltan;
  document.querySelector("#dato-edad").textContent = YO.edadHoy + aniosQueFaltan;
  document.querySelector("#dato-hitos").textContent = HITOS.length;
}

// ---------- Línea del tiempo ----------
function dibujarLineaDeTiempo() {
  const lista = document.querySelector("#linea-tiempo");

  for (let i = 0; i < HITOS.length; i++) {
    const hito = HITOS[i];
    const edadEnEseAnio = YO.edadHoy + (hito.anio - anioActual);

    const elemento = crear("li", "hito");
    const encabezado = crear("div");
    encabezado.appendChild(crear("span", "hito-anio", hito.anio));
    encabezado.appendChild(crear("span", "hito-edad", " · a los " + edadEnEseAnio + " años"));

    // Decisión: si el año ya llegó, la meta está cumplida
    if (hito.anio <= anioActual) {
      elemento.classList.add("cumplido");
      encabezado.appendChild(crear("span", "sello", "¡Cumplido!"));
    }

    elemento.appendChild(encabezado);
    elemento.appendChild(crear("p", "hito-titulo", hito.titulo));
    elemento.appendChild(crear("p", "hito-detalle", hito.detalle));
    lista.appendChild(elemento);
  }
}

// ---------- Estudios, idiomas, valores y logros ----------
function dibujarEstudios() {
  const lista = document.querySelector("#estudios");
  for (let i = 0; i < ESTUDIOS.length; i++) {
    const estudio = ESTUDIOS[i];
    const elemento = crear("li");
    elemento.appendChild(crear("b", "", estudio.titulo));
    elemento.appendChild(crear("span", "", estudio.lugar + " · " + estudio.anio));
    lista.appendChild(elemento);
  }
}

function dibujarLista(selector, datos, etiqueta, clase) {
  const contenedor = document.querySelector(selector);
  for (let i = 0; i < datos.length; i++) {
    contenedor.appendChild(crear(etiqueta, clase, datos[i]));
  }
}

function dibujarLogros() {
  const contenedor = document.querySelector("#logros");
  for (let i = 0; i < LOGROS.length; i++) {
    const logro = LOGROS[i];
    const tarjeta = crear("article", "logro");
    tarjeta.appendChild(crear("div", "logro-icono", logro.icono));
    tarjeta.appendChild(crear("p", "logro-titulo", logro.titulo));
    tarjeta.appendChild(crear("p", "logro-detalle", logro.detalle));
    contenedor.appendChild(tarjeta);
  }
}

// ---------- Habilidades con barras animadas ----------
function dibujarHabilidades() {
  const contenedor = document.querySelector("#habilidades");
  const rellenos = [];

  for (let i = 0; i < HABILIDADES.length; i++) {
    const habilidad = HABILIDADES[i];
    // Validar: el nivel debe estar entre 0 y 100
    const nivel = Math.min(100, Math.max(0, Number(habilidad.nivel) || 0));

    const fila = crear("div", "habilidad");
    const nombre = crear("div", "habilidad-nombre");
    nombre.appendChild(crear("span", "", habilidad.nombre));
    nombre.appendChild(crear("span", "", nivel + " %"));

    const barra = crear("div", "barra");
    const relleno = crear("div", "barra-relleno");
    relleno.dataset.nivel = nivel;
    barra.appendChild(relleno);

    fila.appendChild(nombre);
    fila.appendChild(barra);
    contenedor.appendChild(fila);
    rellenos.push(relleno);
  }

  // Un momento después de dibujarlas, las llenamos: así se ve la animación
  setTimeout(function () {
    for (let i = 0; i < rellenos.length; i++) {
      rellenos[i].style.width = rellenos[i].dataset.nivel + "%";
    }
  }, 300);
}

// ---------- Carta y pie ----------
function llenarCarta() {
  document.querySelector("#carta").textContent = CARTA;
  document.querySelector("#firma").textContent = FIRMA;

  const hoy = new Date();
  document.querySelector("#fecha-hoy").textContent = hoy.toLocaleDateString("es-HN", {
    day: "numeric", month: "long", year: "numeric"
  });
}

// ---------- Botones ----------
let colorActual = 0;

function cambiarColor() {
  colorActual = (colorActual + 1) % COLORES.length; // % vuelve a 0 al llegar al final
  document.documentElement.style.setProperty("--acento", COLORES[colorActual]);
}

document.querySelector("#boton-color").addEventListener("click", cambiarColor);

// ---------- Ayuda en pantalla ----------
const ayuda = document.querySelector("#ayuda");

function mostrarAyuda(titulo, pasos) {
  document.querySelector("#ayuda-texto").textContent = titulo;
  const lista = document.querySelector("#ayuda-pasos");
  lista.innerHTML = "";
  for (let i = 0; i < pasos.length; i++) {
    lista.appendChild(crear("li", "", pasos[i]));
  }
  ayuda.hidden = false;
}

document.querySelector("#cerrar-ayuda").addEventListener("click", function () {
  ayuda.hidden = true;
});

// ---------- Guardar en PDF ----------
function guardarEnPdf() {
  // Antes de imprimir, las barras se muestran completas
  const rellenos = document.querySelectorAll(".barra-relleno");
  for (let i = 0; i < rellenos.length; i++) {
    rellenos[i].style.width = rellenos[i].dataset.nivel + "%";
  }
  mostrarAyuda("Para guardar tu CV en PDF:", [
    "En la ventana que se abre, en «Destino», elige «Guardar como PDF».",
    "En «Más opciones», activa «Gráficos de fondo» para que se vean los colores.",
    "Presiona «Guardar» y elige una carpeta. Ponle de nombre «CV-del-futuro-" + YO.nombre + "»."
  ]);
  // Esperamos un momento para que se vea la ayuda y las barras llenas
  setTimeout(function () {
    window.print();
  }, 600);
}

document.querySelector("#boton-imprimir").addEventListener("click", guardarEnPdf);

// ---------- Compartir por WhatsApp ----------
// Arma un mensaje de texto con lo más importante del CV
function resumenDelCv() {
  let texto = "🚀 *Mi CV del futuro · " + YO.anioDelFuturo + "*\n";
  texto = texto + YO.avatar + " *" + YO.nombre + "* · " + YO.titulo + "\n";
  texto = texto + "_“" + YO.lema + "”_\n\n";
  texto = texto + "*Mi camino:*\n";
  for (let i = 0; i < HITOS.length; i++) {
    texto = texto + "• " + HITOS[i].anio + ": " + HITOS[i].titulo + "\n";
  }
  texto = texto + "\n*Lo que quiero lograr:*\n";
  for (let i = 0; i < LOGROS.length; i++) {
    texto = texto + LOGROS[i].icono + " " + LOGROS[i].titulo + "\n";
  }
  texto = texto + "\nHecho por mí en el Code Camp Vacacional 2026 💻";
  return texto;
}

function compartirPorWhatsApp() {
  // encodeURIComponent convierte el texto para que viaje bien dentro de un enlace
  const enlace = "https://wa.me/?text=" + encodeURIComponent(resumenDelCv());
  window.open(enlace, "_blank");

  mostrarAyuda("Se abrió WhatsApp con un resumen de tu CV:", [
    "Elige a quién enviarlo: tu mamá, tu papá o el grupo de tu familia.",
    "Para enviar el CV completo, primero guárdalo con «Guardar en PDF».",
    "Luego, en el chat de WhatsApp, toca el clip 📎 > Documento y elige tu archivo PDF.",
    "Comparte solo con personas de confianza."
  ]);
}

document.querySelector("#boton-whatsapp").addEventListener("click", compartirPorWhatsApp);

// ---------- Empezamos ----------
document.title = "CV del futuro · " + YO.nombre;
llenarEncabezado();
dibujarLineaDeTiempo();
dibujarEstudios();
dibujarHabilidades();
dibujarLista("#idiomas", IDIOMAS, "li", "");
dibujarLista("#valores", VALORES, "span", "pastilla");
dibujarLogros();
llenarCarta();
