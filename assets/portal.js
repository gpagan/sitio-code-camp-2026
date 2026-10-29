// ===== Code Camp Vacacional 2026 · Vitrina del curso =====

const REPOSITORIO = "https://github.com/grpagan/code-camp-2026";
const WHATSAPP = "50432743312";
const MENSAJE_WHATSAPP = "Hola, Guillermo. Vi la página del Code Camp Vacacional 2026 y quiero información para inscribir a mi hijo o hija.";
const FIN_PRONTO_PAGO = new Date("2026-11-16T00:00:00-06:00"); // hora de Honduras

const MISIONES = [
  { numero: "Misión 1", titulo: "Tu primera página", clases: ["Clase 1 · Cómo funciona la computadora y el internet", "Clase 2 · Cómo piensa un programador", "Clase 3 · Flexbox y grid"] },
  { numero: "Misión 2", titulo: "Haz que piense", clases: ["Clase 4 · Variables y decisiones", "Clase 5 · Funciones, eventos y azar", "Clase 6 · Mi primer juego completo"] },
  { numero: "Misión 3", titulo: "Entrena tu propia IA", clases: ["Clase 7 · Cómo aprende una máquina", "Clase 8 · La IA como asistente", "Clase 9 · La cámara y el control por gestos"] },
  { numero: "Misión 4", titulo: "El juego final", clases: ["Clase 10 · Piedra, papel o tijera con botones", "Clase 11 · Conectar la IA y la cámara", "Clase 12 · Presentación con la familia"] }
];

const PROYECTOS = [
  { codigo: "P1", carpeta: "P01-sobre-mi", titulo: "Página \"Sobre mí\"", nivel: "Básico", clase: "Clase 1", aprende: "HTML: títulos, párrafos, imágenes, listas y enlaces.", pieza: "La página del juego" },
  { codigo: "P2", carpeta: "P02-ficha-videojuego", titulo: "Ficha de mi videojuego favorito", nivel: "Básico", clase: "Clase 2", aprende: "CSS: colores, fuentes, bordes, sombras y modelo de caja.", pieza: "El diseño del juego" },
  { codigo: "P3", carpeta: "P03-galeria", titulo: "Galería de fotos", nivel: "Básico", clase: "Clase 3", aprende: "Flexbox, grid, efectos al pasar el mouse y diseño para celular.", pieza: "La distribución de la pantalla" },
  { codigo: "P4", carpeta: "P04-saludo-inteligente", titulo: "Saludo inteligente", nivel: "Básico", clase: "Clase 4", aprende: "Variables, decisiones y la consola: saluda según la hora.", pieza: "Los mensajes del juego" },
  { codigo: "P5", carpeta: "P05-botones-interactivos", titulo: "Botones interactivos", nivel: "Básico", clase: "Clase 5", aprende: "Funciones, clics, teclas, azar y un cuadro que se mueve con las flechas.", pieza: "Los botones del juego" },
  { codigo: "P6", carpeta: "P06-conversor-lempiras", titulo: "Conversor de lempiras a dólares", nivel: "Básico", clase: "Clase 4", aprende: "Leer lo que escribe el usuario, hacer operaciones y validar datos.", pieza: "Revisar datos antes de usarlos" },
  { codigo: "P7", carpeta: "P07-dado-y-ruleta", titulo: "Dado y ruleta de decisiones", nivel: "Básico", clase: "Clase 5", aprende: "Azar con listas y animaciones con CSS.", pieza: "La jugada de la computadora" },
  { codigo: "P8", carpeta: "P08-adivina-el-numero", titulo: "Adivina el número", nivel: "Intermedio", clase: "Clase 6", aprende: "Un juego completo: intentos, pistas, ganar, perder y reiniciar.", pieza: "La estructura de un juego" },
  { codigo: "P9", carpeta: "P09-cronometro", titulo: "Cronómetro y cuenta regresiva", nivel: "Intermedio", clase: "Clase 8", aprende: "Medir el tiempo; iniciar, pausar y reiniciar.", pieza: "La cuenta 3, 2, 1" },
  { codigo: "P10", carpeta: "P10-quiz", titulo: "Quiz de mi tema favorito", nivel: "Intermedio", clase: "Reto de la semana 3", aprende: "Listas de preguntas, recorrerlas y llevar el puntaje.", pieza: "El marcador" },
  { codigo: "P11", carpeta: "P11-lista-tareas", titulo: "Lista de tareas", nivel: "Intermedio", clase: "Reto de la semana 3", aprende: "Crear y borrar elementos, y guardar datos en el navegador.", pieza: "Crear elementos desde el código" },
  { codigo: "P12", carpeta: "P12-ppt-botones", titulo: "Piedra, papel o tijera con botones", nivel: "Intermedio", clase: "Clase 10", aprende: "Reglas, comparar jugadas, marcador y fin de partida.", pieza: "La lógica del juego" },
  { codigo: "P13", carpeta: "P13-mi-primera-ia", titulo: "Mi primera IA, sin código", nivel: "Intermedio", clase: "Clase 7", aprende: "Entrenar un modelo en Teachable Machine: datos, clases y sesgo.", pieza: "El modelo del juego" },
  { codigo: "P14", carpeta: "P14-camara", titulo: "La cámara en mi página", nivel: "Avanzado", clase: "Clase 9", aprende: "Encender la cámara desde JavaScript, permisos y efecto espejo.", pieza: "La cámara del juego", camara: true },
  { codigo: "P15", carpeta: "P15-control-gestos", titulo: "Control por gestos", nivel: "Avanzado", clase: "Clase 9", aprende: "Cargar el modelo de IA y convertir lo que ve en una acción.", pieza: "Jugar con la mano", camara: true }
];

const JUEGOS = [
  { codigo: "J1", carpeta: "J01-reto-reciclaje", titulo: "Reto del reciclaje", nivel: "Básico", controles: "Mouse", aprende: "Listas de objetos, temporizador y puntaje." },
  { codigo: "J2", carpeta: "J02-profesor-matematicas", titulo: "Profesor de matemáticas", nivel: "Básico", controles: "Teclado", aprende: "Ejercicios al azar con tiempo, niveles y vidas." },
  { codigo: "J3", carpeta: "J03-memoria-parejas", titulo: "Memoria de parejas", nivel: "Básico", controles: "Mouse", aprende: "Mezclar al azar, comparar cartas y crear elementos." },
  { codigo: "J4", carpeta: "J04-carrera-teclas", titulo: "Carrera de teclas", nivel: "Básico", controles: "Teclado", aprende: "Comparar texto letra por letra y medir la velocidad." },
  { codigo: "J5", carpeta: "J05-golpea-al-topo", titulo: "Golpea al topo", nivel: "Básico", controles: "Mouse", aprende: "Elementos que aparecen al azar, temporizadores y clics." },
  { codigo: "J6", carpeta: "J06-ahorcado", titulo: "Adivina la palabra", nivel: "Básico", controles: "Teclado o mouse", aprende: "Trabajar con texto: letras, palabra oculta e intentos." },
  { codigo: "J7", carpeta: "J07-tenis-retro", titulo: "Tenis retro", nivel: "Intermedio", controles: "Flechas o mouse", aprende: "Dibujar en pantalla, el ciclo del juego, choques y un rival automático." },
  { codigo: "J8", carpeta: "J08-rompe-ladrillos", titulo: "Rompe ladrillos", nivel: "Intermedio", controles: "Flechas o mouse", aprende: "Choques con muchos objetos, rebotes y vidas." },
  { codigo: "J9", carpeta: "J09-serpiente", titulo: "Serpiente", nivel: "Intermedio", controles: "Flechas", aprende: "Cuadrícula, listas que crecen y velocidad." },
  { codigo: "J10", carpeta: "J10-dinosaurio-corredor", titulo: "Dinosaurio corredor", nivel: "Intermedio", controles: "Barra espaciadora", aprende: "Gravedad y salto, obstáculos al azar y aceleración." },
  { codigo: "J11", carpeta: "J11-pajaro-saltarin", titulo: "Pájaro saltarín", nivel: "Intermedio", controles: "Barra espaciadora o clic", aprende: "Gravedad, obstáculos en movimiento y puntaje." },
  { codigo: "J12", carpeta: "J12-simon-dice", titulo: "Simón dice", nivel: "Intermedio", controles: "Mouse", aprende: "Secuencias que crecen, turnos y sonidos." },
  { codigo: "J13", carpeta: "J13-bloques-que-caen", titulo: "Bloques que caen", nivel: "Avanzado", controles: "Flechas y barra espaciadora", aprende: "Matrices, rotar piezas y borrar líneas." },
  { codigo: "J14", carpeta: "J14-invasores-espacio", titulo: "Invasores del espacio", nivel: "Avanzado", controles: "Flechas y barra espaciadora", aprende: "Muchos objetos a la vez, disparos y oleadas." },
  { codigo: "J15", carpeta: "J15-laberinto", titulo: "Laberinto con niveles", nivel: "Avanzado", controles: "Flechas", aprende: "Mapas hechos con matrices, paredes, llaves y niveles." },
  { codigo: "J16", carpeta: "J16-asteroides", titulo: "Asteroides", nivel: "Avanzado", controles: "Flechas y barra espaciadora", aprende: "Movimiento en ángulo y pantalla que da la vuelta." },
  { codigo: "J17", carpeta: "J17-plataformas", titulo: "Plataformas", nivel: "Avanzado", controles: "Flechas y barra espaciadora", aprende: "Saltar entre plataformas, recoger monedas y una cámara que sigue al jugador." },
  { codigo: "J18", carpeta: "J18-buscaminas", titulo: "Buscaminas", nivel: "Avanzado", controles: "Mouse", aprende: "Matrices, contar minas vecinas y abrir zonas vacías." }
];

const NIVELES = ["Todos", "Básico", "Intermedio", "Avanzado"];

// ---------- Utilidades ----------
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function claseNivel(nivel) {
  return nivel.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function enlaceCodigo(ruta) {
  return REPOSITORIO + "/tree/main/" + ruta;
}

function boton(texto, href, clase) {
  const a = crear("a", "boton boton-chico " + clase, texto);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

// ---------- Misiones ----------
function dibujarMisiones() {
  const contenedor = document.querySelector("#lista-misiones");
  MISIONES.forEach(function (mision) {
    const tarjeta = crear("article", "mision");
    tarjeta.appendChild(crear("span", "mision-num", mision.numero));
    tarjeta.appendChild(crear("h3", "", mision.titulo));
    const lista = crear("ul");
    mision.clases.forEach(function (clase) { lista.appendChild(crear("li", "", clase)); });
    tarjeta.appendChild(lista);
    contenedor.appendChild(tarjeta);
  });
}

// ---------- Tarjetas ----------
function crearTarjeta(item, carpetaBase, textoBoton) {
  const ruta = carpetaBase + "/" + item.carpeta;
  const tarjeta = crear("article", "tarjeta");
  tarjeta.dataset.nivel = item.nivel;

  const imagen = crear("a", "tarjeta-imagen");
  imagen.href = ruta + "/";
  imagen.target = "_blank";
  imagen.rel = "noopener";
  imagen.setAttribute("aria-label", textoBoton + ": " + item.titulo);
  const img = crear("img");
  img.src = "img/capturas/" + item.carpeta + ".jpg";
  img.alt = "";
  img.loading = "lazy";
  img.width = 640;
  img.height = 400;
  imagen.appendChild(img);
  imagen.appendChild(crear("span", "tarjeta-codigo", item.codigo));
  tarjeta.appendChild(imagen);

  const cuerpo = crear("div", "tarjeta-cuerpo");
  const etiquetas = crear("div", "etiquetas");
  etiquetas.appendChild(crear("span", "etiqueta " + claseNivel(item.nivel), item.nivel));
  etiquetas.appendChild(crear("span", "etiqueta", item.clase || item.controles));
  if (item.camara) etiquetas.appendChild(crear("span", "etiqueta camara", "Usa la cámara"));
  cuerpo.appendChild(etiquetas);
  cuerpo.appendChild(crear("h3", "", item.titulo));
  cuerpo.appendChild(crear("p", "", item.aprende));
  if (item.pieza) {
    const pieza = crear("p", "tarjeta-pieza");
    pieza.appendChild(crear("b", "", "Pieza del juego final: "));
    pieza.appendChild(document.createTextNode(item.pieza));
    cuerpo.appendChild(pieza);
  }

  const botones = crear("div", "tarjeta-botones");
  botones.appendChild(boton(textoBoton, ruta + "/", "boton-oscuro"));
  botones.appendChild(boton("Ver código", enlaceCodigo(ruta), "boton-borde-oscuro"));
  cuerpo.appendChild(botones);

  tarjeta.appendChild(cuerpo);
  return tarjeta;
}

function dibujarTarjetas(selector, lista, carpetaBase, textoBoton) {
  const contenedor = document.querySelector(selector);
  lista.forEach(function (item) {
    contenedor.appendChild(crearTarjeta(item, carpetaBase, textoBoton));
  });
}

// ---------- Filtros por nivel ----------
function prepararFiltros() {
  document.querySelectorAll(".filtros").forEach(function (grupo) {
    const destino = document.getElementById(grupo.dataset.destino);
    NIVELES.forEach(function (nivel) {
      const b = crear("button", "filtro", nivel);
      b.type = "button";
      b.setAttribute("aria-pressed", nivel === "Todos" ? "true" : "false");
      b.addEventListener("click", function () {
        grupo.querySelectorAll(".filtro").forEach(function (otro) { otro.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        destino.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
          tarjeta.hidden = nivel !== "Todos" && tarjeta.dataset.nivel !== nivel;
        });
      });
      grupo.appendChild(b);
    });
  });
}

// ---------- Enlaces ----------
function prepararEnlaces() {
  const whatsapp = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MENSAJE_WHATSAPP);
  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.href = whatsapp;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll(".js-codigo").forEach(function (a) {
    a.href = enlaceCodigo(a.dataset.ruta);
  });
  document.querySelectorAll(".js-repo").forEach(function (a) {
    a.href = REPOSITORIO;
  });
}

// ---------- Pronto pago: se oculta al pasar la fecha ----------
function revisarProntoPago() {
  if (new Date() >= FIN_PRONTO_PAGO) {
    const promo = document.querySelector("#precio-promo");
    promo.hidden = true;
    promo.parentElement.style.gridTemplateColumns = "1fr";
  }
}

dibujarMisiones();
dibujarTarjetas("#lista-proyectos", PROYECTOS, "proyectos", "Probar");
dibujarTarjetas("#lista-juegos", JUEGOS, "juegos", "Jugar");
prepararFiltros();
prepararEnlaces();
revisarProntoPago();
