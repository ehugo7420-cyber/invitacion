/* =========================================================
INVITACIÓN XV AÑOS - JAVASCRIPT DOCUMENTADO
Controla las animaciones y la navegación de las seis hojas.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

// -------------------------------------------------------
// 1. ELEMENTOS PRINCIPALES DEL HTML
// -------------------------------------------------------

const escenaInicio = document.getElementById("escenaInicio");
const contenedorSobre = document.getElementById("contenedorSobre");
const botonAbrir = document.getElementById("botonAbrir");

const experiencia = document.getElementById("experiencia");
const hojas = [...document.querySelectorAll(".hoja")];

const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");

const contadorPagina = document.getElementById("contadorPagina");
const puntosProgreso = document.getElementById("puntosProgreso");

const destellosCambio = document.getElementById("destellosCambio");

const pantallaFinal = document.getElementById("pantallaFinal");
const botonRepetir = document.getElementById("botonRepetir");

// Variables que indican la página actual y si hay una animación activa.
let paginaActual = 0;
let cambiando = false;


// -------------------------------------------------------
// 2. ESTRELLAS DEL FONDO
// Se crean estrellas en posiciones aleatorias.
// -------------------------------------------------------

const contenedorEstrellas = document.getElementById("estrellas");

for (let i = 0; i < 85; i++) {

const estrella = document.createElement("span");

estrella.className = "estrella";

estrella.style.left = `${Math.random() * 100}%`;
estrella.style.top = `${Math.random() * 100}%`;

estrella.style.setProperty(
    "--duracion",
    `${2 + Math.random() * 4}s`
);

estrella.style.animationDelay =
    `${Math.random() * 4}s`;

// Algunas estrellas tendrán un tamaño mayor.
if (Math.random() > .75) {
    estrella.style.width = "3px";
    estrella.style.height = "3px";
}

contenedorEstrellas.appendChild(estrella);
}


// -------------------------------------------------------
// 3. MARIPOSAS ANIMADAS
// Se crea un dibujo SVG para cada mariposa.
// -------------------------------------------------------

const contenedorMariposas = document.getElementById("mariposas");

const dibujoMariposa = `
<svg viewBox="0 0 40 32" aria-hidden="true">
    <path d="M20 15 C8 -2 0 3 5 15 C9 24 16 21 20 17 C24 21 31 24 35 15 C40 3 32 -2 20 15Z"/>
    <path d="M20 15 C14 20 13 29 19 29 C22 27 21 21 20 15Z"/>
</svg>
`;

for (let i = 0; i < 5; i++) {

const mariposa = document.createElement("div");

mariposa.className = "mariposa";
mariposa.innerHTML = dibujoMariposa;

mariposa.style.left =
    `${8 + Math.random() * 84}%`;

mariposa.style.top =
    `${12 + Math.random() * 76}%`;

mariposa.style.setProperty(
    "--vuelo",
    `${7 + Math.random() * 7}s`
);

mariposa.style.animationDelay =
    `${Math.random() * -8}s`;

contenedorMariposas.appendChild(mariposa);
}


// -------------------------------------------------------
// 4. INDICADORES DE LAS SEIS PÁGINAS
// Se crea un punto por cada hoja de la invitación.
// -------------------------------------------------------

hojas.forEach((_, indice) => {

const punto = document.createElement("span");

punto.className = "punto";
punto.setAttribute("aria-hidden", "true");

if (indice === 0) {
    punto.classList.add("activo");
}

puntosProgreso.appendChild(punto);
});


// -------------------------------------------------------
// 5. ACTUALIZAR BOTONES Y PROGRESO
// Actualiza el número de página y los puntos.
// -------------------------------------------------------

function actualizarControles() {

botonAnterior.disabled =
    paginaActual === 0 || cambiando;

botonSiguiente.disabled = cambiando;

// En la última hoja, el botón cambia su texto.
botonSiguiente.textContent =
    paginaActual === hojas.length - 1
    ? "Finalizar ✧"
    : "Siguiente ✧";

contadorPagina.textContent =
    `${paginaActual + 1} de ${hojas.length}`;

// Resalta el punto de la hoja actual.
[...puntosProgreso.children].forEach((punto, i) => {

    punto.classList.toggle(
    "activo",
    i === paginaActual
    );

});
}


// -------------------------------------------------------
// 6. DESTELLOS ENTRE LAS HOJAS
// Genera pequeñas partículas cuando cambia la página.
// -------------------------------------------------------

function crearDestellos() {

destellosCambio.innerHTML = "";

const rect = destellosCambio.getBoundingClientRect();

for (let i = 0; i < 22; i++) {

    const particula = document.createElement("span");

    particula.className = "particula";

    particula.style.left =
    `${25 + Math.random() * 50}%`;

    particula.style.top =
    `${25 + Math.random() * 50}%`;

    particula.style.setProperty(
    "--dx",
    `${(Math.random() - .5) * rect.width * .7}px`
    );

    particula.style.setProperty(
    "--dy",
    `${(Math.random() - .5) * rect.height * .65}px`
    );

    particula.style.animationDelay =
    `${Math.random() * .18}s`;

    destellosCambio.appendChild(particula);
}

// Elimina las partículas después de la animación.
window.setTimeout(() => {

    destellosCambio.innerHTML = "";

}, 1000);
}


// -------------------------------------------------------
// 7. ABRIR EL SOBRE
// Primero se abre el sobre y después aparece la primera hoja.
// -------------------------------------------------------

function abrirInvitacion() {

// Evita que el botón se presione varias veces.
if (botonAbrir.disabled) return;

botonAbrir.disabled = true;

// Se abre la solapa del sobre.
contenedorSobre.classList.add("abierto");

// El sobre comienza a desaparecer.
window.setTimeout(() => {

    contenedorSobre.classList.add("saliendo");

}, 950);

// Se oculta la portada y aparece la invitación.
window.setTimeout(() => {

    escenaInicio.classList.add("oculto");

    experiencia.classList.remove("oculto");

    hojas[0].classList.add("entrando");

    actualizarControles();

}, 1550);
}


// -------------------------------------------------------
// 8. CAMBIAR DE PÁGINA
// Permite avanzar y retroceder entre las seis hojas.
// -------------------------------------------------------

function cambiarPagina(direccion) {

// No permite cambiar de página mientras hay una animación.
if (cambiando) return;

const nuevaPagina = paginaActual + direccion;

// Si se intenta avanzar después de la última hoja,
// se muestra la pantalla final.
if (nuevaPagina >= hojas.length) {

    finalizarInvitacion();

    return;
}

// No permite retroceder antes de la primera hoja.
if (nuevaPagina < 0) return;

cambiando = true;

const hojaAnterior = hojas[paginaActual];
const hojaNueva = hojas[nuevaPagina];

// Aparecen partículas decorativas.
crearDestellos();

// La hoja actual comienza a desaparecer.
hojaAnterior.classList.remove("activa", "entrando");
hojaAnterior.classList.add("saliendo");

// La siguiente hoja comienza a aparecer.
hojaNueva.classList.add("activa", "entrando");

// Actualiza el número de página.
paginaActual = nuevaPagina;

actualizarControles();

// Espera a que termine la transición.
window.setTimeout(() => {

    hojaAnterior.classList.remove("saliendo");
    hojaNueva.classList.remove("entrando");

    cambiando = false;

    actualizarControles();

}, 820);
}


// -------------------------------------------------------
// 9. MOSTRAR LA DESPEDIDA
// Se ejecuta al terminar de recorrer las seis hojas.
// -------------------------------------------------------

function finalizarInvitacion() {

experiencia.classList.add("oculto");

pantallaFinal.classList.remove("oculto");

lanzarDestellosFinales();
}


// -------------------------------------------------------
// 10. DESTELLOS DE LA PANTALLA FINAL
// -------------------------------------------------------

function lanzarDestellosFinales() {

for (let i = 0; i < 18; i++) {

    const estrella = document.createElement("span");

    estrella.className = "estrella";

    estrella.style.left =
    `${Math.random() * 100}%`;

    estrella.style.top =
    `${Math.random() * 100}%`;

    estrella.style.setProperty(
    "--duracion",
    `${1.5 + Math.random() * 2}s`
    );

    pantallaFinal.appendChild(estrella);

    // Elimina cada estrella después de cinco segundos.
    window.setTimeout(() => {

    estrella.remove();

    }, 5000);
}
}


// -------------------------------------------------------
// 11. REINICIAR LA INVITACIÓN
// Permite volver a la portada y comenzar nuevamente.
// -------------------------------------------------------

function reiniciar() {

paginaActual = 0;
cambiando = false;

pantallaFinal.classList.add("oculto");
experiencia.classList.add("oculto");

// Restablece el estado de todas las hojas.
hojas.forEach((hoja, i) => {

    hoja.classList.remove(
    "activa",
    "saliendo",
    "entrando"
    );

    // La primera hoja queda preparada para mostrarse.
    if (i === 0) {
    hoja.classList.add("activa");
    }
});

// Cierra y restablece el sobre.
contenedorSobre.classList.remove(
    "abierto",
    "saliendo"
);

botonAbrir.disabled = false;

// Regresa a la portada.
escenaInicio.classList.remove("oculto");

actualizarControles();

// Desplaza la página hacia arriba.
window.scrollTo({
    top: 0,
    behavior: "smooth"
});
}


// -------------------------------------------------------
// 12. EVENTOS DE LOS BOTONES
// Relaciona los botones del HTML con sus funciones.
// -------------------------------------------------------

// Botón para abrir el sobre.
botonAbrir.addEventListener(
"click",
abrirInvitacion
);

// Botón para avanzar.
botonSiguiente.addEventListener(
"click",
() => cambiarPagina(1)
);

// Botón para retroceder.
botonAnterior.addEventListener(
"click",
() => cambiarPagina(-1)
);

// Botón para volver a comenzar.
botonRepetir.addEventListener(
"click",
reiniciar
);


// -------------------------------------------------------
// 13. AVANZAR TOCANDO LA HOJA
// También permite pasar de página tocando el papel.
// -------------------------------------------------------

hojas.forEach((hoja) => {

hoja.addEventListener("click", (evento) => {

    // No cambia de página si se presiona un botón o enlace.
    if (evento.target.closest("button, a")) return;

    cambiarPagina(1);
});
});


// -------------------------------------------------------
// 14. ESTADO INICIAL
// Actualiza los botones al cargar la invitación.
// -------------------------------------------------------

actualizarControles();

});