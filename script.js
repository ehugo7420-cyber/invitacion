/* =========================================================
   INVITACIÓN XV AÑOS - JAVASCRIPT
   Navegación por seis hojas y animaciones.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Elementos principales
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

  const botonMusica = document.getElementById("botonMusica");
  const textoMusica = document.getElementById("textoMusica");
  const musica = document.getElementById("musica");

  let paginaActual = 0;
  let cambiando = false;

  // -------------------------------------------------------
  // ESTRELLAS DEL FONDO
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

    estrella.style.animationDelay = `${Math.random() * 4}s`;

    if (Math.random() > .75) {
      estrella.style.width = "3px";
      estrella.style.height = "3px";
    }

    contenedorEstrellas.appendChild(estrella);
  }

  // -------------------------------------------------------
  // MARIPOSAS ANIMADAS
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

    mariposa.style.left = `${8 + Math.random() * 84}%`;
    mariposa.style.top = `${12 + Math.random() * 76}%`;

    mariposa.style.setProperty(
      "--vuelo",
      `${7 + Math.random() * 7}s`
    );

    mariposa.style.animationDelay = `${Math.random() * -8}s`;

    contenedorMariposas.appendChild(mariposa);
  }

  // -------------------------------------------------------
  // INDICADORES DE LAS PÁGINAS
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
  // ACTUALIZAR BOTONES Y PROGRESO
  // -------------------------------------------------------

  function actualizarControles() {

    botonAnterior.disabled =
      paginaActual === 0 || cambiando;

    botonSiguiente.disabled = cambiando;

    botonSiguiente.textContent =
      paginaActual === hojas.length - 1
        ? "Finalizar ✧"
        : "Siguiente ✧";

    contadorPagina.textContent =
      `${paginaActual + 1} de ${hojas.length}`;

    [...puntosProgreso.children].forEach((punto, i) => {
      punto.classList.toggle(
        "activo",
        i === paginaActual
      );
    });
  }

  // -------------------------------------------------------
  // GENERAR DESTELLOS ENTRE LAS HOJAS
  // -------------------------------------------------------

  function crearDestellos() {

    destellosCambio.innerHTML = "";

    const rect = destellosCambio.getBoundingClientRect();

    for (let i = 0; i < 22; i++) {

      const particula = document.createElement("span");

      particula.className = "particula";

      particula.style.left = `${25 + Math.random() * 50}%`;
      particula.style.top = `${25 + Math.random() * 50}%`;

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

    window.setTimeout(() => {
      destellosCambio.innerHTML = "";
    }, 1000);
  }

  // -------------------------------------------------------
  // ABRIR EL SOBRE
  // -------------------------------------------------------

  function abrirInvitacion() {

    if (botonAbrir.disabled) return;

    botonAbrir.disabled = true;

    // Se abre la solapa y sale la carta.
    contenedorSobre.classList.add("abierto");

    // El sobre cae después de abrirse.
    window.setTimeout(() => {
      contenedorSobre.classList.add("saliendo");
    }, 950);

    // Aparece la primera hoja.
    window.setTimeout(() => {

      escenaInicio.classList.add("oculto");

      experiencia.classList.remove("oculto");

      hojas[0].classList.add("entrando");

      actualizarControles();

    }, 1550);
  }

  // -------------------------------------------------------
  // CAMBIAR DE PÁGINA
  // -------------------------------------------------------

  function cambiarPagina(direccion) {

    if (cambiando) return;

    const nuevaPagina = paginaActual + direccion;

    // Si se termina la última hoja, mostrar despedida.
    if (nuevaPagina >= hojas.length) {
      finalizarInvitacion();
      return;
    }

    if (nuevaPagina < 0) return;

    cambiando = true;

    const hojaAnterior = hojas[paginaActual];
    const hojaNueva = hojas[nuevaPagina];

    // Efecto de partículas.
    crearDestellos();

    // La hoja actual cae.
    hojaAnterior.classList.remove("activa", "entrando");
    hojaAnterior.classList.add("saliendo");

    // La siguiente hoja aparece.
    hojaNueva.classList.add("activa", "entrando");

    paginaActual = nuevaPagina;

    actualizarControles();

    // Esperar a que termine la animación.
    window.setTimeout(() => {

      hojaAnterior.classList.remove("saliendo");
      hojaNueva.classList.remove("entrando");

      cambiando = false;

      actualizarControles();

    }, 820);
  }

  // -------------------------------------------------------
  // MOSTRAR LA DESPEDIDA
  // -------------------------------------------------------

  function finalizarInvitacion() {

    experiencia.classList.add("oculto");

    pantallaFinal.classList.remove("oculto");

    lanzarDestellosFinales();
  }

  function lanzarDestellosFinales() {

    for (let i = 0; i < 18; i++) {

      const estrella = document.createElement("span");

      estrella.className = "estrella";

      estrella.style.left = `${Math.random() * 100}%`;
      estrella.style.top = `${Math.random() * 100}%`;

      estrella.style.setProperty(
        "--duracion",
        `${1.5 + Math.random() * 2}s`
      );

      pantallaFinal.appendChild(estrella);

      window.setTimeout(() => {
        estrella.remove();
      }, 5000);
    }
  }

  // -------------------------------------------------------
  // REINICIAR LA INVITACIÓN
  // -------------------------------------------------------

  function reiniciar() {

    paginaActual = 0;
    cambiando = false;

    pantallaFinal.classList.add("oculto");
    experiencia.classList.add("oculto");

    hojas.forEach((hoja, i) => {

      hoja.classList.remove(
        "activa",
        "saliendo",
        "entrando"
      );

      if (i === 0) {
        hoja.classList.add("activa");
      }
    });

    contenedorSobre.classList.remove(
      "abierto",
      "saliendo"
    );

    botonAbrir.disabled = false;

    escenaInicio.classList.remove("oculto");

    actualizarControles();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // -------------------------------------------------------
  // EVENTOS DE LOS BOTONES
  // -------------------------------------------------------

  botonAbrir.addEventListener(
    "click",
    abrirInvitacion
  );

  botonSiguiente.addEventListener(
    "click",
    () => cambiarPagina(1)
  );

  botonAnterior.addEventListener(
    "click",
    () => cambiarPagina(-1)
  );

  botonRepetir.addEventListener(
    "click",
    reiniciar
  );

  // También se puede avanzar tocando la hoja.
  hojas.forEach((hoja) => {

    hoja.addEventListener("click", (evento) => {

      if (evento.target.closest("button, a")) return;

      cambiarPagina(1);
    });
  });

  // -------------------------------------------------------
  // CONTROL DE MÚSICA
  // -------------------------------------------------------

  botonMusica.addEventListener("click", async () => {

    // Si todavía no se agregó una canción.
    if (!musica.querySelector("source")) {

      textoMusica.textContent = "Añade música";

      window.setTimeout(() => {
        textoMusica.textContent = "Música";
      }, 1800);

      return;
    }

    try {

      if (musica.paused) {

        await musica.play();

        textoMusica.textContent = "Silenciar";

        botonMusica.setAttribute(
          "aria-label",
          "Silenciar música"
        );

      } else {

        musica.pause();

        textoMusica.textContent = "Música";

        botonMusica.setAttribute(
          "aria-label",
          "Activar música"
        );
      }

    } catch (error) {

      textoMusica.textContent = "No disponible";
    }
  });

  // Estado inicial.
  actualizarControles();

});
