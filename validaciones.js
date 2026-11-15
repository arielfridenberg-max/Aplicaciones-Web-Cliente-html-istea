// =====================================================================
// validaciones.js — Entrega 6 (y reutilizado en las entregas 10 y 11)
// Menú hamburguesa y validación de todos los formularios del sitio.
// Los errores se muestran DENTRO de la página, nunca con alert().
// =====================================================================

// ---------- Funciones auxiliares ----------
function mostrarError(idCampo, mensaje) {
  const bloque = document.getElementById("error-" + idCampo);
  const campo = document.getElementById(idCampo);
  if (bloque) {
    bloque.textContent = mensaje;
    bloque.classList.add("visible");
  }
  if (campo) {
    campo.classList.add("campo-invalido");
    campo.setAttribute("aria-invalid", "true");
    if (bloque) campo.setAttribute("aria-describedby", bloque.id);
  }
}

function limpiarError(idCampo) {
  const bloque = document.getElementById("error-" + idCampo);
  const campo = document.getElementById(idCampo);
  if (bloque) {
    bloque.textContent = "";
    bloque.classList.remove("visible");
  }
  if (campo) {
    campo.classList.remove("campo-invalido");
    campo.removeAttribute("aria-invalid");
  }
}

function limpiarErrores(formulario) {
  formulario.querySelectorAll(".error").forEach(function (bloque) {
    bloque.textContent = "";
    bloque.classList.remove("visible");
  });
  formulario.querySelectorAll(".campo-invalido").forEach(function (campo) {
    campo.classList.remove("campo-invalido");
    campo.removeAttribute("aria-invalid");
  });
}

function estaVacio(texto) {
  return texto.trim() === "";
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function telefonoValido(telefono) {
  return /^[\d\s()+-]{6,20}$/.test(telefono);
}

function urlValida(url) {
  return /^(https?:\/\/[^\s]+|[\w./-]+\.(svg|png|jpe?g|webp|gif))$/i.test(url.trim());
}

function valor(id) {
  const campo = document.getElementById(id);
  return campo ? campo.value.trim() : "";
}

// Lleva el foco al primer campo con error.
function enfocarPrimerError(formulario) {
  const primero = formulario.querySelector(".campo-invalido");
  if (primero) primero.focus();
}

// Muestra un bloque de alerta maquetado (entrega 5).
function mostrarAlerta(idBloque, tipo, mensaje) {
  const bloque = document.getElementById(idBloque);
  if (!bloque) return;
  bloque.className = "alerta alerta-" + tipo;
  bloque.textContent = mensaje;
}

function ocultarAlerta(idBloque) {
  const bloque = document.getElementById(idBloque);
  if (bloque) bloque.classList.add("oculto");
}

// Avisos de éxito / error con SweetAlert2 (entrega 11)
function avisar(tipo, titulo, texto) {
  return Swal.fire({
    icon: tipo === "exito" ? "success" : "error",
    title: titulo,
    text: texto,
    confirmButtonColor: "#0a5737"
  });
}

// =====================================================================
// Validación de una planta (reutilizada por la intranet, entrega 10)
// Devuelve true si todo está bien.
// =====================================================================
function validarFormularioPlanta(formulario) {
  limpiarErrores(formulario);
  let ok = true;

  if (estaVacio(valor("planta-nombre"))) {
    mostrarError("planta-nombre", "Ingresá el nombre de la planta.");
    ok = false;
  }

  if (estaVacio(valor("planta-nombreCientifico"))) {
    mostrarError("planta-nombreCientifico", "Ingresá el nombre científico.");
    ok = false;
  }

  if (valor("planta-categoria") === "") {
    mostrarError("planta-categoria", "Elegí una categoría.");
    ok = false;
  }

  if (estaVacio(valor("planta-foto"))) {
    mostrarError("planta-foto", "Ingresá la URL de la foto.");
    ok = false;
  } else if (!urlValida(valor("planta-foto"))) {
    mostrarError("planta-foto", "La URL no es válida. Ej: https://…/foto.jpg o img/foto.jpg");
    ok = false;
  }

  if (!formulario.querySelector('input[name="luz"]:checked')) {
    const bloque = document.getElementById("error-planta-luz");
    bloque.textContent = "Elegí cuánta luz necesita.";
    bloque.classList.add("visible");
    ok = false;
  }

  if (valor("planta-riego") === "") {
    mostrarError("planta-riego", "Elegí el nivel de riego.");
    ok = false;
  }

  const precio = valor("planta-precio");
  if (precio === "") {
    mostrarError("planta-precio", "Ingresá el precio.");
    ok = false;
  } else if (isNaN(Number(precio)) || Number(precio) <= 0) {
    mostrarError("planta-precio", "El precio tiene que ser un número mayor a 0.");
    ok = false;
  }

  const stock = valor("planta-stock");
  if (stock === "") {
    mostrarError("planta-stock", "Ingresá el stock.");
    ok = false;
  } else if (!/^\d+$/.test(stock)) {
    mostrarError("planta-stock", "El stock tiene que ser un número entero, sin decimales.");
    ok = false;
  }

  if (valor("planta-fechaIngreso") === "") {
    mostrarError("planta-fechaIngreso", "Indicá la fecha de ingreso.");
    ok = false;
  }

  if (!ok) enfocarPrimerError(formulario);
  return ok;
}

// =====================================================================
// Todo se ejecuta cuando la página termina de cargar
// =====================================================================
document.addEventListener("DOMContentLoaded", function () {

  // ===== MENÚ HAMBURGUESA =====
  const botonMenu = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      const abierto = menu.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      botonMenu.textContent = abierto ? "✕" : "☰";
    });
  }

  // Quita el error de un campo apenas el usuario lo corrige.
  document.querySelectorAll("form[novalidate] input, form[novalidate] select, form[novalidate] textarea").forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo.id) limpiarError(campo.id);
    });
    campo.addEventListener("change", function () {
      if (campo.name === "luz") {
        const bloque = document.getElementById("error-planta-luz");
        if (bloque) bloque.classList.remove("visible");
      }
      if (campo.type === "checkbox" && campo.id) limpiarError(campo.id);
    });
  });

  // ===== FORMULARIO DE CONTACTO =====
  const formContacto = document.getElementById("form-contacto");

  if (formContacto) {
    // Si viene desde una ficha: contacto.html?planta=Lavanda
    const plantaConsultada = new URLSearchParams(window.location.search).get("planta");
    if (plantaConsultada) {
      document.getElementById("motivo").value = "encargo";
      document.getElementById("mensaje").value = "Hola, quería consultar por la planta " + plantaConsultada + ". ";
    }

    formContacto.addEventListener("submit", function (e) {
      e.preventDefault();
      limpiarErrores(formContacto);
      let hayErrores = false;

      if (estaVacio(valor("nombre"))) {
        mostrarError("nombre", "Ingresá tu nombre y apellido.");
        hayErrores = true;
      }

      if (estaVacio(valor("email"))) {
        mostrarError("email", "Ingresá tu correo.");
        hayErrores = true;
      } else if (!emailValido(valor("email"))) {
        mostrarError("email", "El formato del correo no es válido.");
        hayErrores = true;
      }

      if (valor("telefono") !== "" && !telefonoValido(valor("telefono"))) {
        mostrarError("telefono", "El teléfono solo puede tener números, espacios, + y guiones.");
        hayErrores = true;
      }

      if (valor("motivo") === "") {
        mostrarError("motivo", "Elegí un motivo.");
        hayErrores = true;
      }

      if (estaVacio(valor("mensaje"))) {
        mostrarError("mensaje", "Escribí tu mensaje.");
        hayErrores = true;
      } else if (valor("mensaje").length < 10) {
        mostrarError("mensaje", "Contanos un poco más (mínimo 10 caracteres).");
        hayErrores = true;
      }

      if (hayErrores) {
        enfocarPrimerError(formContacto);
        return;
      }

      const nombre = valor("nombre").split(" ")[0];
      avisar("exito", "¡Gracias, " + nombre + "!", "Recibimos tu consulta. Te respondemos dentro de las 48 horas hábiles.");
      formContacto.reset();
    });
  }

  // ===== LOGIN (entrega 6 + login real en la 11) =====
  const formLogin = document.getElementById("form-login");

  if (formLogin) {
    // Si ya hay sesión, no tiene sentido volver a loguearse.
    if (typeof obtenerSesion === "function" && obtenerSesion()) {
      mostrarAlerta("login-aviso", "aviso", "Ya iniciaste sesión. Podés ir directo a la intranet.");
    }

    formLogin.addEventListener("submit", async function (e) {
      e.preventDefault();
      limpiarErrores(formLogin);
      ocultarAlerta("login-error");
      let hayErrores = false;

      const email = valor("login-email");
      const password = document.getElementById("login-password").value;

      if (estaVacio(email)) {
        mostrarError("login-email", "Ingresá tu correo.");
        hayErrores = true;
      } else if (!emailValido(email)) {
        mostrarError("login-email", "El formato del correo no es válido.");
        hayErrores = true;
      }

      if (password === "") {
        mostrarError("login-password", "Ingresá tu contraseña.");
        hayErrores = true;
      }

      if (hayErrores) {
        enfocarPrimerError(formLogin);
        return;
      }

      const boton = formLogin.querySelector('button[type="submit"]');
      boton.disabled = true;
      boton.textContent = "Ingresando…";

      try {
        const usuario = await iniciarSesionApi(email, password);
        if (!usuario) {
          document.getElementById("login-error").classList.remove("oculto");
          document.getElementById("login-password").value = "";
          document.getElementById("login-password").focus();
          return;
        }
        guardarSesion(usuario, document.getElementById("login-recordar").checked);
        const volver = new URLSearchParams(window.location.search).get("volver");
        const destino = volver && /^[\w-]+\.html(\?[\w=&%-]*)?$/.test(volver) ? volver : "listado.html";
        window.location.href = destino;
      } catch (error) {
        mostrarAlerta("login-aviso", "error", "No pudimos conectar con el servidor. Probá de nuevo en unos minutos.");
      } finally {
        boton.disabled = false;
        boton.textContent = "Ingresar";
      }
    });
  }

  // ===== REGISTRO =====
  const formRegistro = document.getElementById("form-registro");

  if (formRegistro) {
    formRegistro.addEventListener("submit", async function (e) {
      e.preventDefault();
      limpiarErrores(formRegistro);
      ocultarAlerta("registro-error");
      let hayErrores = false;

      if (estaVacio(valor("reg-nombre"))) {
        mostrarError("reg-nombre", "Ingresá tu nombre.");
        hayErrores = true;
      }

      if (estaVacio(valor("reg-apellido"))) {
        mostrarError("reg-apellido", "Ingresá tu apellido.");
        hayErrores = true;
      }

      if (valor("reg-telefono") !== "" && !telefonoValido(valor("reg-telefono"))) {
        mostrarError("reg-telefono", "El teléfono no es válido.");
        hayErrores = true;
      }

      const email = valor("reg-email");
      if (estaVacio(email)) {
        mostrarError("reg-email", "Ingresá tu correo.");
        hayErrores = true;
      } else if (!emailValido(email)) {
        mostrarError("reg-email", "El formato del correo no es válido.");
        hayErrores = true;
      }

      const pass1 = document.getElementById("reg-password").value;
      const pass2 = document.getElementById("reg-password2").value;
      const errorPass = document.getElementById("error-reg-password");

      function errorContrasena(mensaje) {
        errorPass.textContent = mensaje;
        errorPass.classList.add("visible");
        document.getElementById("reg-password").classList.add("campo-invalido");
        document.getElementById("reg-password2").classList.add("campo-invalido");
        hayErrores = true;
      }

      if (pass1 === "" || pass2 === "") {
        errorContrasena("Completá las dos contraseñas.");
      } else if (pass1.length < 8) {
        errorContrasena("La contraseña tiene que tener al menos 8 caracteres.");
      } else if (pass1 !== pass2) {
        errorContrasena("Las contraseñas no coinciden.");
      }

      if (valor("reg-rol") === "") {
        mostrarError("reg-rol", "Elegí tu rol en el vivero.");
        hayErrores = true;
      }

      if (!document.getElementById("reg-terminos").checked) {
        mostrarError("reg-terminos", "Tenés que aceptar los términos y condiciones.");
        hayErrores = true;
      }

      if (hayErrores) {
        enfocarPrimerError(formRegistro);
        return;
      }

      const boton = formRegistro.querySelector('button[type="submit"]');
      boton.disabled = true;
      boton.textContent = "Creando cuenta…";

      try {
        await registrarUsuarioApi({
          nombre: valor("reg-nombre"),
          apellido: valor("reg-apellido"),
          correo: email,
          password: pass1,
          rol: valor("reg-rol"),
          telefono: valor("reg-telefono"),
          nacimiento: valor("reg-nacimiento"),
          novedades: document.getElementById("reg-novedades").checked
        });
        formRegistro.reset();
        await avisar("exito", "Cuenta creada", "Ya podés ingresar con tu correo y contraseña.");
        window.location.href = "login.html";
      } catch (error) {
        mostrarAlerta("registro-error", "error", error.message || "No pudimos crear la cuenta. Probá de nuevo.");
      } finally {
        boton.disabled = false;
        boton.textContent = "Crear cuenta";
      }
    });
  }
});
