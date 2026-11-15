// =====================================================================
// intranet.js — Entregas 8, 9, 10 y 11
// listado.html: tabla generada desde los datos, baja con confirmación,
//               gráfico de stock por categoría (Chart.js).
// planta-form.html: alta y edición contra la API.
// =====================================================================

let plantasIntranet = [];
let grafico = null;

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML.replace(/"/g, "&quot;");
}

function formatearPrecio(numero) {
  return "$ " + Number(numero).toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

function formatearFecha(iso) {
  if (!iso) return "—";
  const partes = iso.split("-");
  return partes.length === 3 ? partes[2] + "/" + partes[1] + "/" + partes[0] : iso;
}

// Aviso de éxito o error después de cada operación (SweetAlert2, entrega 11)
function avisoIntranet(tipo, mensaje) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: tipo === "exito" ? "success" : "error",
    title: mensaje,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

// =====================================================================
// LISTADO
// =====================================================================

function crearFila(planta) {
  const fila = document.createElement("tr");
  fila.dataset.id = planta.id;
  fila.innerHTML = `
    <td><img class="miniatura" src="${escapar(planta.foto)}" alt="" width="56" height="40"></td>
    <td><strong>${escapar(planta.nombre)}</strong><br><span class="cientifico">${escapar(planta.nombreCientifico)}</span></td>
    <td><span class="chip">${escapar(planta.categoria)}</span></td>
    <td>${formatearPrecio(planta.precio)}</td>
    <td class="${planta.stock < 10 ? "stock-bajo" : ""}">${planta.stock}</td>
    <td>${formatearFecha(planta.fechaIngreso)}</td>
    <td>
      <div class="acciones-tabla">
        <a href="planta-form.html?id=${encodeURIComponent(planta.id)}" class="btn btn-borde btn-chico">Editar</a>
        <button type="button" class="btn btn-peligro btn-chico">Eliminar</button>
      </div>
    </td>`;

  fila.querySelector(".btn-peligro").addEventListener("click", function () {
    confirmarEliminacion(planta);
  });
  return fila;
}

function renderizarTabla(lista) {
  const cuerpo = document.getElementById("cuerpo-tabla");
  cuerpo.innerHTML = "";

  if (lista.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="7" class="sin-resultados">Todavía no hay plantas cargadas.</td></tr>';
  } else {
    lista
      .slice()
      .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); })
      .forEach(function (planta) { cuerpo.appendChild(crearFila(planta)); });
  }

  const total = lista.reduce(function (suma, p) { return suma + p.stock; }, 0);
  document.getElementById("contador-listado").textContent =
    lista.length + " plantas cargadas · " + total + " unidades en stock";

  dibujarGrafico(lista);
}

// Librería de datos: gráfico de stock por categoría con Chart.js
function dibujarGrafico(lista) {
  const lienzo = document.getElementById("grafico-stock");
  if (!lienzo || !window.Chart) return;

  const stockPorCategoria = CATEGORIAS.map(function (categoria) {
    return lista
      .filter(function (p) { return p.categoria === categoria; })
      .reduce(function (suma, p) { return suma + p.stock; }, 0);
  });

  if (grafico) {
    grafico.data.datasets[0].data = stockPorCategoria;
    grafico.update();
    return;
  }

  grafico = new Chart(lienzo, {
    type: "bar",
    data: {
      labels: CATEGORIAS.map(function (c) { return c.charAt(0).toUpperCase() + c.slice(1); }),
      datasets: [{
        label: "Unidades en stock",
        data: stockPorCategoria,
        backgroundColor: ["#0a5737", "#1b7a4e", "#4caf7d", "#a8e6cf"],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

async function confirmarEliminacion(planta) {
  const respuesta = await Swal.fire({
    title: "¿Eliminar " + planta.nombre + "?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#b3261e",
    cancelButtonColor: "#5b645e",
    focusCancel: true
  });

  if (!respuesta.isConfirmed) return;

  const fila = document.querySelector('tr[data-id="' + CSS.escape(String(planta.id)) + '"]');
  if (fila) fila.classList.add("eliminando");

  try {
    await eliminarPlanta(planta.id);
    // La tabla se actualiza sin recargar la página
    plantasIntranet = plantasIntranet.filter(function (p) { return String(p.id) !== String(planta.id); });
    renderizarTabla(plantasIntranet);
    avisoIntranet("exito", planta.nombre + " se eliminó del catálogo.");
  } catch (error) {
    if (fila) fila.classList.remove("eliminando");
    avisoIntranet("error", "No se pudo eliminar: " + error.message);
  }
}

async function iniciarListado() {
  const carga = document.getElementById("estado-carga");

  // Mensaje que deja el formulario después de guardar
  try {
    const pendiente = sessionStorage.getItem("viveroRaiz.mensaje");
    if (pendiente) {
      sessionStorage.removeItem("viveroRaiz.mensaje");
      avisoIntranet("exito", pendiente);
    }
  } catch (e) { /* sin sessionStorage */ }

  try {
    plantasIntranet = await obtenerPlantas();
    if (usandoRespaldo) {
      mostrarAlerta("intranet-aviso", "aviso",
        "El servidor no responde: estás viendo los datos de respaldo. Los cambios no se van a poder guardar hasta que vuelva la conexión.");
    }
    renderizarTabla(plantasIntranet);
  } catch (error) {
    mostrarAlerta("intranet-aviso", "error", "No pudimos cargar las plantas. Recargá la página en unos minutos.");
  } finally {
    carga.classList.add("oculto");
  }
}

// =====================================================================
// FORMULARIO DE PLANTA (alta y edición)
// =====================================================================

function leerFormularioPlanta(form) {
  return {
    nombre: valor("planta-nombre"),
    nombreCientifico: valor("planta-nombreCientifico"),
    categoria: valor("planta-categoria"),
    luz: form.querySelector('input[name="luz"]:checked').value,
    riego: valor("planta-riego"),
    precio: Number(valor("planta-precio")),
    stock: parseInt(valor("planta-stock"), 10),
    fechaIngreso: valor("planta-fechaIngreso"),
    aptaMascotas: form.querySelector('input[name="aptaMascotas"]:checked').value === "true",
    etiquetas: Array.from(form.querySelectorAll('input[name="etiquetas"]:checked')).map(function (c) { return c.value; }),
    foto: valor("planta-foto"),
    notas: valor("planta-notas")
  };
}

function precargarFormulario(form, planta) {
  document.getElementById("planta-id").value = planta.id;
  document.getElementById("planta-nombre").value = planta.nombre;
  document.getElementById("planta-nombreCientifico").value = planta.nombreCientifico;
  document.getElementById("planta-categoria").value = planta.categoria;
  document.getElementById("planta-riego").value = planta.riego;
  document.getElementById("planta-precio").value = planta.precio;
  document.getElementById("planta-stock").value = planta.stock;
  document.getElementById("planta-fechaIngreso").value = planta.fechaIngreso;
  document.getElementById("planta-foto").value = planta.foto;
  document.getElementById("planta-notas").value = planta.notas;

  form.querySelectorAll('input[name="luz"]').forEach(function (r) { r.checked = r.value === planta.luz; });
  form.querySelectorAll('input[name="aptaMascotas"]').forEach(function (r) { r.checked = r.value === String(planta.aptaMascotas); });
  form.querySelectorAll('input[name="etiquetas"]').forEach(function (c) { c.checked = planta.etiquetas.includes(c.value); });
}

async function iniciarFormulario() {
  const form = document.getElementById("form-planta");
  const id = new URLSearchParams(window.location.search).get("id");
  const boton = document.getElementById("btn-guardar");

  // Fecha de hoy por defecto en las altas
  if (!id) {
    document.getElementById("planta-fechaIngreso").value = new Date().toISOString().slice(0, 10);
  }

  // Edición: el formulario se abre precargado
  if (id) {
    document.getElementById("titulo-form-planta").textContent = "Editar planta";
    document.title = "Intranet · Editar planta | Vivero Raíz";
    boton.textContent = "Guardar cambios";
    const carga = document.getElementById("estado-carga");
    carga.classList.remove("oculto");
    form.classList.add("oculto");

    try {
      const planta = await obtenerPlanta(id);
      if (!planta) {
        mostrarAlerta("intranet-aviso", "error", "No encontramos la planta que querés editar.");
        return;
      }
      precargarFormulario(form, planta);
      form.classList.remove("oculto");
    } catch (error) {
      mostrarAlerta("intranet-aviso", "error", "No pudimos cargar los datos de la planta.");
    } finally {
      carga.classList.add("oculto");
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Entrega 10: se reutiliza la validación de validaciones.js
    if (!validarFormularioPlanta(form)) return;

    const planta = leerFormularioPlanta(form);
    const idEditar = document.getElementById("planta-id").value;

    boton.disabled = true;
    boton.textContent = "Guardando…";

    try {
      if (idEditar) {
        await editarPlanta(idEditar, planta);
        sessionStorage.setItem("viveroRaiz.mensaje", "Se guardaron los cambios de " + planta.nombre + ".");
      } else {
        await crearPlanta(planta);
        sessionStorage.setItem("viveroRaiz.mensaje", planta.nombre + " se agregó al catálogo.");
      }
      window.location.href = "listado.html";
    } catch (error) {
      avisoIntranet("error", "No se pudo guardar: " + error.message);
      boton.disabled = false;
      boton.textContent = idEditar ? "Guardar cambios" : "Guardar planta";
    }
  });
}

// =====================================================================
document.addEventListener("DOMContentLoaded", function () {
  if (!obtenerSesion()) return; // sesion.js ya redirige al login
  if (document.getElementById("tabla-plantas")) iniciarListado();
  if (document.getElementById("form-planta")) iniciarFormulario();
});
