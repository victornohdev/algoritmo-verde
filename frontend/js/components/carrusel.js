// Carrusel de la Main Page: avance automático, flechas y puntos.
// Las diapositivas están escritas directamente en index.html.

const carrusel = document.querySelector(".carrusel");
const pista = carrusel.querySelector(".carrusel__pista");
const puntos = carrusel.querySelectorAll(".carrusel__punto");
const total = puntos.length;
const SEGUNDOS = 6;

let actual = 0;
let temporizador;

function ir(indice) {
  actual = (indice + total) % total;
  pista.style.transform = "translateX(-" + actual * 100 + "%)";
  puntos.forEach((punto, i) => punto.classList.toggle("activo", i === actual));
}

function iniciar() {
  temporizador = setInterval(() => ir(actual + 1), SEGUNDOS * 1000);
}

function detener() {
  clearInterval(temporizador);
}

carrusel.querySelector(".carrusel__flecha--prev").addEventListener("click", () => ir(actual - 1));
carrusel.querySelector(".carrusel__flecha--next").addEventListener("click", () => ir(actual + 1));
puntos.forEach((punto, i) => punto.addEventListener("click", () => ir(i)));

// Se pausa mientras el mouse está encima
carrusel.addEventListener("mouseenter", detener);
carrusel.addEventListener("mouseleave", iniciar);

ir(0);
iniciar();
