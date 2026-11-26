// Validación del formulario de registro.
// Muestra el mensaje de error debajo de cada campo. El servidor (backend/registro.php)
// vuelve a validar todo, porque esta validación se puede saltar desde el navegador.

const formulario = document.querySelector("#formulario-registro");

// Cada regla recibe el valor del campo y regresa el mensaje de error, o "" si está bien.
const reglas = {
  nombre(valor) {
    valor = valor.trim();
    if (valor === "") return "Escribe tu nombre completo.";
    if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    return "";
  },
  telefono(valor) {
    if (valor.trim() === "") return "Escribe tu teléfono.";
    if (!/^[0-9 -]+$/.test(valor)) return "Usa solo números, espacios o guiones.";
    if (valor.replace(/\D/g, "").length !== 10) return "El teléfono debe tener 10 dígitos.";
    return "";
  },
  correo(valor) {
    valor = valor.trim();
    if (valor === "") return "Escribe tu correo electrónico.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Escribe un correo válido.";
    return "";
  },
  rol(valor) {
    return valor === "" ? "Elige una opción." : "";
  },
  password(valor) {
    if (valor === "") return "Escribe una contraseña.";
    if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return "";
  },
  password2(valor) {
    if (valor === "") return "Confirma tu contraseña.";
    if (valor !== formulario.password.value) return "Las contraseñas no coinciden.";
    return "";
  },
  acepto(_valor, campo) {
    return campo.checked ? "" : "Debes aceptar el aviso de privacidad.";
  },
};

// Valida un campo y muestra (o borra) su mensaje. Regresa true si es válido.
function validar(campo) {
  const mensaje = reglas[campo.name](campo.value, campo);
  const error = document.querySelector("#error-" + campo.name);

  error.textContent = mensaje;
  campo.classList.toggle("campo--invalido", mensaje !== "");
  campo.setAttribute("aria-invalid", mensaje !== "");
  return mensaje === "";
}

for (const nombre in reglas) {
  const campo = formulario.elements[nombre];

  // Al salir del campo se valida; después de eso, se revalida mientras se escribe
  // para que el mensaje desaparezca en cuanto se corrige.
  campo.addEventListener("blur", () => validar(campo));
  campo.addEventListener("input", () => {
    if (campo.classList.contains("campo--invalido")) validar(campo);
  });
  campo.addEventListener("change", () => validar(campo));
}

// Si cambia la contraseña y la confirmación ya tiene algo, se revisa que sigan coincidiendo.
formulario.password.addEventListener("input", () => {
  if (formulario.password2.value !== "") validar(formulario.password2);
});

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
