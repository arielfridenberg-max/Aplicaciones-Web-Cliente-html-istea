// =====================================================================
// sesion.js — Entrega 11
// Sesión guardada en el navegador, header que cambia según el usuario
// e intranet protegida.
// =====================================================================

const CLAVE_SESION = "viveroRaiz.sesion";

// "recordar" = true  -> localStorage (queda abierta al cerrar el navegador)
// "recordar" = false -> sessionStorage (se cierra al cerrar la pestaña)
function guardarSesion(usuario, recordar) {
  const datos = JSON.stringify(usuario);
  try {
    if (recordar) {
      localStorage.setItem(CLAVE_SESION, datos);
      sessionStorage.removeItem(CLAVE_SESION);
    } else {
      sessionStorage.setItem(CLAVE_SESION, datos);
      localStorage.removeItem(CLAVE_SESION);
    }
  } catch (e) {
    console.error("No se pudo guardar la sesión", e);
  }
}

function obtenerSesion() {
  try {
    const datos = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  } catch (e) {
    return null;
  }
}

function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_SESION);
  } catch (e) { /* nada que hacer */ }
  window.location.href = "index.html";
}

// Intranet protegida: las páginas con <body data-privada="true">
// redirigen al login si no hay sesión.
(function protegerPagina() {
  if (document.body && document.body.dataset.privada === "true" && !obtenerSesion()) {
    const destino = window.location.pathname.split("/").pop() + window.location.search;
    window.location.replace("login.html?volver=" + encodeURIComponent(destino));
  }
})();

// Header: saluda con el nombre y ofrece cerrar sesión.
function actualizarHeader() {
  const usuario = obtenerSesion();
  const item = document.getElementById("nav-sesion");
  if (!usuario || !item) return;

  item.textContent = "";

  const saludo = document.createElement("span");
  saludo.className = "saludo";
  saludo.textContent = "Hola, " + usuario.nombre;

  const intranet = document.createElement("a");
  intranet.href = "listado.html";
  intranet.className = "btn btn-oscuro btn-chico";
  intranet.textContent = "Intranet";

  const salir = document.createElement("button");
  salir.type = "button";
  salir.className = "btn btn-borde btn-chico";
  salir.textContent = "Cerrar sesión";
  salir.addEventListener("click", confirmarCierreSesion);

  item.classList.add("nav-sesion-activa");
  item.append(saludo, intranet, salir);
}

function confirmarCierreSesion() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#0a5737"
  }).then(function (r) {
    if (r.isConfirmed) cerrarSesion();
  });
}

document.addEventListener("DOMContentLoaded", actualizarHeader);
