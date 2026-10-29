// ===== P11 · Lista de tareas =====
// Cada tarea es un objeto: { id, texto, hecha }
// Todas las tareas viven en una lista (arreglo) llamada "tareas".

const CLAVE_GUARDADO = "code-camp-tareas"; // el nombre con que se guardan en el navegador

let tareas = cargarTareas();
let filtroActual = "todas";

// ---------- Elementos de la página ----------
const formulario = document.querySelector("#formulario");
const campoNueva = document.querySelector("#nueva-tarea");
const lista = document.querySelector("#lista");
const contador = document.querySelector("#contador");
const botonLimpiar = document.querySelector("#boton-limpiar");
const botonesFiltro = document.querySelectorAll(".filtro");

// ---------- Guardar y cargar en el navegador (localStorage) ----------
// localStorage guarda texto, así que convertimos la lista a texto con JSON.
// Usamos try/catch porque algunos navegadores no dejan guardar (modo incógnito).
function guardarTareas() {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(tareas));
  } catch (error) {
    console.log("No se pudo guardar:", error);
  }
}

function cargarTareas() {
  try {
    const texto = localStorage.getItem(CLAVE_GUARDADO);
    if (texto) {
      return JSON.parse(texto);
    }
  } catch (error) {
    console.log("No se pudo cargar:", error);
  }
  return [];
}

// ---------- Agregar, marcar y borrar ----------
function agregarTarea(texto) {
  tareas.push({ id: Date.now(), texto: texto, hecha: false });
  guardarTareas();
  dibujarLista();
}

function cambiarEstado(id) {
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id === id) {
      tareas[i].hecha = !tareas[i].hecha; // ! = lo contrario
    }
  }
  guardarTareas();
  dibujarLista();
}

function borrarTarea(id) {
  // filter crea una lista nueva SIN la tarea que tiene ese id
  tareas = tareas.filter(function (tarea) {
    return tarea.id !== id;
  });
  guardarTareas();
  dibujarLista();
}

function borrarHechas() {
  tareas = tareas.filter(function (tarea) {
    return !tarea.hecha;
  });
  guardarTareas();
  dibujarLista();
}

// ---------- Dibujar la lista en la página ----------
function tareasVisibles() {
  if (filtroActual === "pendientes") {
    return tareas.filter(function (tarea) { return !tarea.hecha; });
  }
  if (filtroActual === "hechas") {
    return tareas.filter(function (tarea) { return tarea.hecha; });
  }
  return tareas;
}

function dibujarLista() {
  lista.innerHTML = "";
  const visibles = tareasVisibles();

  if (visibles.length === 0) {
    const vacia = document.createElement("li");
    vacia.className = "vacia";
    vacia.textContent = "No hay tareas aquí. 🎉";
    lista.appendChild(vacia);
  }

  for (let i = 0; i < visibles.length; i++) {
    const tarea = visibles[i];

    // Creamos los elementos uno por uno
    const elemento = document.createElement("li");
    elemento.className = "tarea";
    if (tarea.hecha) {
      elemento.classList.add("hecha");
    }

    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.checked = tarea.hecha;
    casilla.setAttribute("aria-label", "Marcar como hecha");
    casilla.addEventListener("change", function () {
      cambiarEstado(tarea.id);
    });

    const texto = document.createElement("span");
    texto.className = "texto";
    texto.textContent = tarea.texto; // textContent: seguro, no interpreta HTML

    const botonBorrar = document.createElement("button");
    botonBorrar.className = "borrar";
    botonBorrar.textContent = "✕";
    botonBorrar.setAttribute("aria-label", "Borrar tarea");
    botonBorrar.addEventListener("click", function () {
      borrarTarea(tarea.id);
    });

    elemento.appendChild(casilla);
    elemento.appendChild(texto);
    elemento.appendChild(botonBorrar);
    lista.appendChild(elemento);
  }

  // Contador de pendientes
  let pendientes = 0;
  for (let i = 0; i < tareas.length; i++) {
    if (!tareas[i].hecha) {
      pendientes = pendientes + 1;
    }
  }
  if (pendientes === 1) {
    contador.textContent = "Te queda 1 tarea";
  } else {
    contador.textContent = "Te quedan " + pendientes + " tareas";
  }
}

// ---------- Eventos ----------
// "submit" ocurre al presionar el botón o Enter dentro del formulario
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue
  const texto = campoNueva.value.trim();
  if (texto === "") {
    return;
  }
  agregarTarea(texto);
  campoNueva.value = "";
  campoNueva.focus();
});

botonLimpiar.addEventListener("click", borrarHechas);

for (let i = 0; i < botonesFiltro.length; i++) {
  botonesFiltro[i].addEventListener("click", function () {
    filtroActual = botonesFiltro[i].dataset.filtro;
    for (let j = 0; j < botonesFiltro.length; j++) {
      botonesFiltro[j].classList.remove("activo");
    }
    botonesFiltro[i].classList.add("activo");
    dibujarLista();
  });
}

// Empezamos
dibujarLista();
