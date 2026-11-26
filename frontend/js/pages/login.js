// Validación del formulario de inicio de sesión.
// Funciona igual que registro.js: muestra el error debajo de cada campo y,
// si todo está bien, deja que el formulario se envíe a backend/login.php.
// El servidor debe volver a validar todo y revisar que el usuario exista.

const formulario = document.querySelector("#formulario-login");

// Cada regla recibe el valor del campo y regresa el mensaje de error, o "" si está bien.
const reglas = {
  correo(valor) {
    valor = valor.trim();
    if (valor === "") return "Escribe tu correo electrónico.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Escribe un correo válido.";
    return "";
  },
  password(valor) {
    return valor === "" ? "Escribe tu contraseña." : "";
  },
};

// Valida un campo y muestra (o borra) su mensaje. Regresa true si es válido.
function validar(campo) {
  const mensaje = reglas[campo.name](campo.value);
  const error = document.querySelector("#error-" + campo.name);

  error.textContent = mensaje;
  campo.classList.toggle("campo--invalido", mensaje !== "");
  campo.setAttribute("aria-invalid", mensaje !== "");
  return mensaje === "";
}

for (const nombre in reglas) {
  const campo = formulario.elements[nombre];

  // Al salir del campo se valida; después, se revalida mientras se escribe
  // para que el mensaje desaparezca en cuanto se corrige.
  campo.addEventListener("blur", () => validar(campo));
  campo.addEventListener("input", () => {
    if (campo.classList.contains("campo--invalido")) validar(campo);
  });
}

formulario.addEventListener("submit", (evento) => {
  let primeroInvalido = null;

  for (const nombre in reglas) {
    const campo = formulario.elements[nombre];
    if (!validar(campo) && !primeroInvalido) primeroInvalido = campo;
  }

  if (primeroInvalido) {
    evento.preventDefault();
    primeroInvalido.focus();
  }
});
