/* ==============================================
   INVITACIÓN XV AÑOS — JAVASCRIPT

   ÍNDICE
   0. Configuración  (lo único que normalmente tocas)
   1. Estrellas del fondo
   2. Mariposas (dibujo SVG y vuelo)
   3. Música
   4. Apertura del sobre
   5. Foto
   6. Quemado del papel (fuego, chispas, humo)
   7. Ver la invitación otra vez
============================================== */

"use strict";

/* ==============================================
   0. CONFIGURACIÓN
============================================== */

// ✏️ MÚSICA: ruta del archivo de audio. Déjala vacía ("") para no usar música.
// Ejemplo: "audio/musica.mp3"  (guarda el mp3 dentro de una carpeta "audio")
const RUTA_MUSICA = "";

// Velocidad a la que avanza el fuego (píxeles por segundo).
// Más alto = se quema más rápido. El tiempo total se ajusta solo al largo del papel.
const VELOCIDAD_QUEMADO = 320;
const DURACION_MINIMA = 6000;    // milisegundos
const DURACION_MAXIMA = 14000;   // milisegundos

// Cantidad de estrellas y mariposas (se reducen en celulares).
const esCelular = window.matchMedia("(max-width: 600px)").matches;
const CANTIDAD_ESTRELLAS = esCelular ? 70 : 110;
const CANTIDAD_MARIPOSAS = esCelular ? 5 : 7;

// ¿La persona pidió menos movimiento en su dispositivo?
const reducirMovimiento =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==============================================
   1. ESTRELLAS DEL FONDO
============================================== */

const universo = document.getElementById("universo");

for (let i = 0; i < CANTIDAD_ESTRELLAS; i++) {
    const estrella = document.createElement("span");
    estrella.className = "estrella";
    estrella.style.left = Math.random() * 100 + "%";
    estrella.style.top = Math.random() * 100 + "%";
    estrella.style.setProperty("--duracion", (1.5 + Math.random() * 4) + "s");
    estrella.style.animationDelay = Math.random() * 4 + "s";
    universo.appendChild(estrella);
}

/* ==============================================
   2. MARIPOSAS
   Cada mariposa es un dibujo SVG con 4 alas, venas y manchas.
   Vuelan solas: giran suavemente, se alejan de los bordes y
   apuntan hacia donde van.
============================================== */

/* Colores de las alas (centro claro → borde oscuro).
   ✏️ Puedes agregar o cambiar paletas. */
const PALETAS = [
    { id: "alaMorada", c1: "#ecd8ff", c2: "#a46ae0", c3: "#5b2a9a" },
    { id: "alaLila",   c1: "#f9e6ff", c2: "#c58cf0", c3: "#7a3fb5" },
    { id: "alaAzul",   c1: "#e0e8ff", c2: "#8aa2ee", c3: "#4a3fa8" },
    { id: "alaRosa",   c1: "#ffe4f4", c2: "#e68ad0", c3: "#8e3a8f" }
];

/* Degradados que usan todas las alas (se definen una sola vez) */
universo.insertAdjacentHTML("beforeend",
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    PALETAS.map((p) =>
        `<radialGradient id="${p.id}" cx="85%" cy="40%" r="95%">
            <stop offset="0" stop-color="${p.c1}"/>
            <stop offset=".55" stop-color="${p.c2}"/>
            <stop offset="1" stop-color="${p.c3}"/>
        </radialGradient>`
    ).join("") +
    "</defs></svg>"
);

/* Dibujo de la mariposa. El cuerpo está en x=50; el ala derecha
   es el ala izquierda reflejada. */
function dibujarMariposa(degradado) {
    const ala = `
        <path class="ala-sup" fill="url(#${degradado})"
              d="M49 36 C42 16 22 2 8 6 C1 8 1 22 8 33 C16 43 34 43 49 39 Z"/>
        <path class="ala-inf" fill="url(#${degradado})"
              d="M49 40 C38 42 24 44 18 54 C13 63 20 74 30 71 C41 68 48 54 49 46 Z"/>
        <path class="venas"
              d="M49 38 C36 30 22 20 10 12 M49 38 C34 38 20 36 8 30 M49 42 C38 48 28 56 22 66"/>
        <circle class="mancha" cx="17" cy="17" r="2.4"/>
        <circle class="mancha" cx="26" cy="25" r="1.6"/>
        <circle class="mancha" cx="12" cy="26" r="1.4"/>
        <circle class="mancha-dorada" cx="27" cy="62" r="2.2"/>
        <circle class="mancha" cx="34" cy="57" r="1.3"/>`;

    return `
    <svg class="mariposa-svg" viewBox="0 0 100 80" aria-hidden="true">
        <g class="alas alas-izq">${ala}</g>
        <g class="alas alas-der"><g transform="translate(100 0) scale(-1 1)">${ala}</g></g>
        <ellipse cx="50" cy="42" rx="2.2" ry="14" fill="#3a1b52"/>
        <circle cx="50" cy="27" r="2.8" fill="#3a1b52"/>
        <path d="M49 26 C47 18 44 14 41 12 M51 26 C53 18 56 14 59 12"
              fill="none" stroke="#3a1b52" stroke-width=".9" stroke-linecap="round"/>
        <circle cx="41" cy="12" r="1.1" fill="#3a1b52"/>
        <circle cx="59" cy="12" r="1.1" fill="#3a1b52"/>
    </svg>`;
}

const mariposas = [];

function normalizarAngulo(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
}

function colocarMariposa(m, ahora) {
    const vaiven = Math.sin(ahora / 350 + m.fase) * 5;           // sube y baja
    const grados = (m.direccion * 180) / Math.PI + 90;           // la cabeza apunta al frente
    m.elemento.style.transform =
        `translate3d(${m.x - 30}px, ${m.y - 24 + vaiven}px, 0) ` +
        `rotate(${grados}deg) scale(${m.escala})`;
}

function crearMariposa(indice) {
    const elemento = document.createElement("div");
    elemento.className = "mariposa-fondo";
    elemento.innerHTML = dibujarMariposa(PALETAS[indice % PALETAS.length].id);
    elemento.style.setProperty("--aleteo", (0.22 + Math.random() * 0.18) + "s");
    elemento.style.setProperty("--desfase", "-" + (Math.random() * 0.4) + "s");
    universo.appendChild(elemento);

    const m = {
        elemento,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        direccion: Math.random() * Math.PI * 2,
        velocidad: 35 + Math.random() * 40,          // píxeles por segundo
        giro: 0,
        giroObjetivo: 0,
        cambio: Math.random() * 2,
        escala: 0.65 + Math.random() * 0.75,
        fase: Math.random() * 6.28
    };

    mariposas.push(m);
    colocarMariposa(m, 0);
}

for (let i = 0; i < CANTIDAD_MARIPOSAS; i++) crearMariposa(i);

let ultimoCuadro = performance.now();

function volarMariposas(ahora) {
    const dt = Math.min(0.05, (ahora - ultimoCuadro) / 1000);
    ultimoCuadro = ahora;

    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    const margen = 70;

    for (const m of mariposas) {
        // De vez en cuando elige un nuevo rumbo
        m.cambio -= dt;
        if (m.cambio <= 0) {
            m.giroObjetivo = (Math.random() - 0.5) * 2.2;
            m.cambio = 0.6 + Math.random() * 1.6;
        }
        m.giro += (m.giroObjetivo - m.giro) * Math.min(1, dt * 2);
        m.direccion += m.giro * dt;

        // Si se acerca a un borde, regresa hacia el centro
        if (m.x < margen || m.x > ancho - margen || m.y < margen || m.y > alto - margen) {
            const haciaCentro = Math.atan2(alto / 2 - m.y, ancho / 2 - m.x);
            m.direccion += normalizarAngulo(haciaCentro - m.direccion) * Math.min(1, dt * 2.5);
        }

        // Avanza un poco más rápido y un poco más lento, como al revolotear
        const avance = m.velocidad * (0.8 + 0.4 * Math.sin(ahora / 400 + m.fase));
        m.x += Math.cos(m.direccion) * avance * dt;
        m.y += Math.sin(m.direccion) * avance * dt;

        colocarMariposa(m, ahora);
    }

    requestAnimationFrame(volarMariposas);
}

// Con "reducir movimiento" las mariposas se quedan quietas
if (!reducirMovimiento) requestAnimationFrame(volarMariposas);

/* ==============================================
   3. MÚSICA
   Solo funciona si pones una ruta en RUTA_MUSICA.
   Arranca al tocar el sobre (los navegadores exigen un toque).
============================================== */

const botonMusica = document.getElementById("botonMusica");
let audio = null;

function actualizarBotonMusica() {
    const sonando = audio && !audio.paused;
    botonMusica.classList.toggle("silenciada", !sonando);
    botonMusica.setAttribute("aria-pressed", String(Boolean(sonando)));
}

if (RUTA_MUSICA) {
    audio = new Audio(RUTA_MUSICA);
    audio.loop = true;
    audio.volume = 0.5;
    botonMusica.hidden = false;
    botonMusica.classList.add("silenciada");

    botonMusica.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().then(actualizarBotonMusica).catch(() => {});
        } else {
            audio.pause();
            actualizarBotonMusica();
        }
    });
}

function iniciarMusica() {
    if (!audio) return;
    audio.play().then(actualizarBotonMusica).catch(() => {});
}

/* ==============================================
   4. APERTURA DEL SOBRE
============================================== */

const contenedorSobre = document.getElementById("contenedorSobre");
const abrirSobreBoton = document.getElementById("abrirSobre");
const tarjetaInicial = document.getElementById("tarjetaInicial");
const leerInvitacion = document.getElementById("leerInvitacion");
const instruccion = document.getElementById("instruccion");
const invitacion = document.getElementById("invitacion");

let sobreAbierto = false;
let invitacionAbierta = false;

function abrirSobre(conTeclado) {
    if (sobreAbierto) return;
    sobreAbierto = true;

    contenedorSobre.classList.add("abierto");
    abrirSobreBoton.hidden = true;
    tarjetaInicial.removeAttribute("inert");
    instruccion.textContent = "Ahora toca «Leer invitación»";
    iniciarMusica();

    // Quien usa teclado sigue sin perder el foco
    if (conTeclado) {
        window.setTimeout(() => leerInvitacion.focus({ preventScroll: true }), 1300);
    }
}

function mostrarInvitacion() {
    if (!sobreAbierto || invitacionAbierta) return;
    invitacionAbierta = true;

    contenedorSobre.classList.add("caido");

    window.setTimeout(() => {
        contenedorSobre.style.display = "none";
        invitacion.classList.add("visible");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
}

// e.detail === 0 significa que el "clic" vino del teclado
abrirSobreBoton.addEventListener("click", (e) => abrirSobre(e.detail === 0));
leerInvitacion.addEventListener("click", mostrarInvitacion);

/* ==============================================
   5. FOTO DE LA QUINCEAÑERA
   Si la imagen existe se muestra; si no, se ve el texto de ejemplo.
============================================== */

const imagen = document.getElementById("foto");
const marcoFoto = document.getElementById("marcoFoto");

function revisarFoto() {
    marcoFoto.classList.toggle("con-foto", imagen.complete && imagen.naturalWidth > 0);
}

imagen.addEventListener("load", revisarFoto);
imagen.addEventListener("error", revisarFoto);
revisarFoto();   // por si la foto ya cargó antes de que corriera este script

/* ==============================================
   6. QUEMADO DEL PAPEL
   Un solo reloj controla todo, así nada se desfasa:
   - el papel se recorta de abajo hacia arriba (CSS: --quemado)
   - el fuego sube junto con el borde
   - la pantalla sube siguiendo el fuego
   - salen chispas y humo en el borde
============================================== */

const botonFinal = document.getElementById("botonFinal");
const papel = document.getElementById("papel");
const bordeFuego = document.getElementById("bordeFuego");
const despedida = document.getElementById("despedida");
const mensajeFinal = document.getElementById("mensajeFinal");
const mensajeSecundario = document.getElementById("mensajeSecundario");
const botonRepetir = document.getElementById("botonRepetir");

let quemadoIniciado = false;

botonFinal.addEventListener("click", iniciarQuemado);

/* Evita que la persona mueva la pantalla mientras se quema */
const teclasDeScroll = [" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"];
const frenarScroll = (e) => e.preventDefault();
const frenarTeclas = (e) => { if (teclasDeScroll.includes(e.key)) e.preventDefault(); };

function bloquearScroll(activar) {
    const accion = activar ? "addEventListener" : "removeEventListener";
    window[accion]("wheel", frenarScroll, { passive: false });
    window[accion]("touchmove", frenarScroll, { passive: false });
    window[accion]("keydown", frenarTeclas);
}

/* Dibuja el fuego como una tira de lenguas de llama (SVG).
   Cada lengua tiene 3 capas: naranja, naranja claro y amarillo. */
function crearFuego() {
    const NS = "http://www.w3.org/2000/svg";
    const ancho = Math.round(bordeFuego.offsetWidth);
    const alto = Math.round(bordeFuego.offsetHeight);

    // Forma de una lengua: base ancha y punta curva
    const forma = (cx, w, h, inclinacion) => {
        const x0 = cx - w / 2;
        const x1 = cx + w / 2;
        const punta = cx + inclinacion;
        return `M${x0} ${alto} ` +
               `C${x0 + w * 0.05} ${alto - h * 0.45} ${punta - w * 0.28} ${alto - h * 0.55} ${punta} ${alto - h} ` +
               `C${punta + w * 0.05} ${alto - h * 0.55} ${x1 - w * 0.02} ${alto - h * 0.35} ${x1} ${alto} Z`;
    };

    // ✏️ Colores del fuego, de afuera hacia adentro
    const capas = [
        { color: "#ff6a13", escala: 1 },
        { color: "#ffa21a", escala: 0.68 },
        { color: "#ffe600", escala: 0.4 }
    ];

    // Lenguas con tamaños e inclinaciones al azar
    const lenguas = [];
    for (let x = -10; x < ancho + 10; ) {
        const w = 28 + Math.random() * 22;
        lenguas.push({
            cx: x + w / 2,
            w: w,
            h: 45 + Math.random() * (alto - 55),
            inclinacion: (Math.random() - 0.5) * w * 0.7,
            duracion: 0.35 + Math.random() * 0.35,
            retraso: Math.random() * 0.6
        });
        x += w * 0.55;
    }

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "fuego-svg");
    svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
    svg.setAttribute("preserveAspectRatio", "none");

    // Primero todas las capas naranjas, luego las claras y al final las amarillas
    capas.forEach((capa) => {
        const grupo = document.createElementNS(NS, "g");

        lenguas.forEach((l) => {
            const g = document.createElementNS(NS, "g");
            g.setAttribute("class", "lengua");
            g.style.setProperty("--duracion-llama", l.duracion + "s");
            g.style.animationDelay = "-" + l.retraso + "s";

            const p = document.createElementNS(NS, "path");
            p.setAttribute("d", forma(l.cx, l.w * capa.escala, l.h * capa.escala, l.inclinacion * capa.escala));
            p.setAttribute("fill", capa.color);

            g.appendChild(p);
            grupo.appendChild(g);
        });

        svg.appendChild(grupo);
    });

    // Base amarilla continua, como en el dibujo de referencia
    const base = document.createElementNS(NS, "rect");
    base.setAttribute("x", 0);
    base.setAttribute("y", alto - 12);
    base.setAttribute("width", ancho);
    base.setAttribute("height", 12);
    base.setAttribute("fill", "#ffd800");
    svg.appendChild(base);

    const anterior = bordeFuego.querySelector(".fuego-svg");
    if (anterior) anterior.remove();
    bordeFuego.appendChild(svg);
}

function iniciarQuemado() {
    if (quemadoIniciado) return;
    quemadoIniciado = true;
    botonFinal.disabled = true;

    // Con "reducir movimiento": el papel solo se desvanece
    if (reducirMovimiento) {
        papel.classList.add("desvaneciendo");
        window.setTimeout(mostrarDespedida, 1100);
        return;
    }

    bloquearScroll(true);
    document.documentElement.style.scrollBehavior = "auto";   // sin "suavizado" mientras sigue el fuego
    crearFuego();
    papel.classList.add("quemando");

    // Mientras más largo el papel, más tiempo tarda (con límites)
    const duracion = Math.min(
        DURACION_MAXIMA,
        Math.max(DURACION_MINIMA, (papel.offsetHeight / VELOCIDAD_QUEMADO) * 1000)
    );

    const inicio = performance.now();
    let ultimoEfecto = 0;

    function paso(ahora) {
        const progreso = Math.max(0, Math.min(1, (ahora - inicio) / duracion));

        papel.style.setProperty("--quemado", progreso);
        seguirFuego(progreso);

        if (ahora - ultimoEfecto > 70) {
            ultimoEfecto = ahora;
            crearEfectosDeFuego(progreso);
        }

        if (progreso < 1) {
            requestAnimationFrame(paso);
        } else {
            papel.style.visibility = "hidden";
            bloquearScroll(false);
            mostrarDespedida();
        }
    }

    requestAnimationFrame(paso);
}

/* Mueve la pantalla para que el fuego quede siempre visible */
function seguirFuego(progreso) {
    const rect = papel.getBoundingClientRect();
    const bordeEnPantalla = rect.top + rect.height * (1 - progreso);
    const objetivo = window.scrollY + bordeEnPantalla - window.innerHeight * 0.6;
    const nuevo = window.scrollY + (Math.max(0, objetivo) - window.scrollY) * 0.2;
    window.scrollTo(0, nuevo);
}

function mostrarDespedida() {
    despedida.classList.add("visible");

    window.setTimeout(() => {
        mensajeFinal.classList.add("visible");
        mensajeSecundario.classList.add("visible");
        botonRepetir.classList.add("visible");
    }, 250);
}

/* Chispas y humo justo en el borde que se quema */
function crearEfectosDeFuego(progreso) {
    const rect = papel.getBoundingClientRect();
    const bordeY = rect.top + rect.height * (1 - progreso);

    // Si el borde no está en pantalla no hace falta dibujar nada
    if (bordeY < -40 || bordeY > window.innerHeight + 40) return;

    const izquierda = Math.max(rect.left, 0);
    const derecha = Math.min(rect.right, window.innerWidth);
    const ancho = Math.max(1, derecha - izquierda);

    const chispas = esCelular ? 3 : 4;
    for (let i = 0; i < chispas; i++) {
        crearChispa(izquierda + Math.random() * ancho, bordeY + (Math.random() - 0.5) * 14 - 6);
    }

    if (Math.random() > 0.45) {
        crearHumo(izquierda + Math.random() * ancho, bordeY - 10 + Math.random() * 10);
    }
}

function crearChispa(x, y) {
    const chispa = document.createElement("span");
    chispa.className = "chispa";
    chispa.style.left = x + "px";
    chispa.style.top = y + "px";
    chispa.style.setProperty("--tamano", (2 + Math.random() * 5) + "px");
    chispa.style.setProperty("--dx", ((Math.random() - 0.5) * 90) + "px");
    chispa.style.setProperty("--dy", (-25 - Math.random() * 100) + "px");
    chispa.style.setProperty("--duracion", (0.5 + Math.random() * 1.1) + "s");
    document.body.appendChild(chispa);
    window.setTimeout(() => chispa.remove(), 1700);
}

function crearHumo(x, y) {
    const humo = document.createElement("span");
    humo.className = "humo";
    humo.style.left = x + "px";
    humo.style.top = y + "px";
    humo.style.setProperty("--humo", (20 + Math.random() * 40) + "px");
    humo.style.setProperty("--dx", ((Math.random() - 0.5) * 70) + "px");
    humo.style.setProperty("--duracion", (1.2 + Math.random() * 1.5) + "s");
    document.body.appendChild(humo);
    window.setTimeout(() => humo.remove(), 3000);
}

/* ==============================================
   7. VER LA INVITACIÓN OTRA VEZ
   Quita la pantalla final y deja el papel como nuevo.
   (Abrir de nuevo el enlace también reinicia todo.)
============================================== */

botonRepetir.addEventListener("click", () => {
    [despedida, mensajeFinal, mensajeSecundario, botonRepetir]
        .forEach((el) => el.classList.remove("visible"));

    papel.classList.remove("quemando", "desvaneciendo");
    papel.style.removeProperty("--quemado");
    papel.style.visibility = "";

    document.documentElement.style.scrollBehavior = "";
    botonFinal.disabled = false;
    quemadoIniciado = false;

    window.scrollTo(0, 0);
});