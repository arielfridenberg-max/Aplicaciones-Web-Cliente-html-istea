// =====================================================================
// catalogo.js — Entregas 7, 8 y 9
// El catálogo se genera a partir de los datos (que llegan de la API o
// del array de respaldo) y se filtra sin recargar la página.
// =====================================================================

const POR_PAGINA = 6;

let todasLasPlantas = [];
let paginaActual = 1;

// ---------- Formato ----------
function formatearPrecio(numero) {
  return "$ " + Number(numero).toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML.replace(/"/g, "&quot;");
}

// ---------- Entrega 8: una función arma UNA tarjeta ----------
function crearTarjeta(planta) {
  const nombre = escapar(planta.nombre);
  const cientifico = escapar(planta.nombreCientifico);
  const articulo = document.createElement("article");
  articulo.className = "producto";
  articulo.dataset.nombre = planta.nombre.toLowerCase();
  articulo.dataset.categoria = planta.categoria;
  articulo.dataset.precio = planta.precio;

  const enlaceFicha = "planta.html?id=" + encodeURIComponent(planta.id);

  articulo.innerHTML = `
    <button type="button" class="producto-imagen" aria-label="Ampliar imagen de ${nombre}">
      <img src="${escapar(planta.foto)}" alt="${nombre} (${cientifico}) en maceta" width="400" height="260" loading="lazy">
    </button>
    <div class="producto-cuerpo">
      <span class="chip">${escapar(planta.categoria)}</span>
      <h2>${nombre}</h2>
      <p class="cientifico">${cientifico}</p>
      <p class="precio">${formatearPrecio(planta.precio)}</p>
      <a href="${enlaceFicha}" class="btn btn-oscuro">Ver ficha</a>
    </div>`;

  articulo.querySelector(".producto-imagen").addEventListener("click", function () {
    abrirVisor(planta);
  });

  return articulo;
}

// ---------- Entrega 8: otra función arma la LISTA completa ----------
function renderizarCatalogo(lista) {
  const grilla = document.getElementById("grilla-catalogo");
  grilla.innerHTML = "";
  lista.forEach(function (planta) {
    grilla.appendChild(crearTarjeta(planta));
  });
}

// ---------- Entrega 7 (reescrita en la 8): filtros sobre el array ----------
function leerFiltros() {
  return {
    texto: document.getElementById("buscar").value.trim().toLowerCase(),
    categoria: document.getElementById("filtro-categoria").value,
    orden: document.getElementById("orden").value
  };
}

function sinTildes(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function filtrarPlantas(lista, filtros) {
  const buscado = sinTildes(filtros.texto);

  const resultado = lista.filter(function (planta) {
    const coincideTexto =
      buscado === "" ||
      sinTildes(planta.nombre.toLowerCase()).includes(buscado) ||
      sinTildes(planta.nombreCientifico.toLowerCase()).includes(buscado);
    const coincideCategoria = filtros.categoria === "" || planta.categoria === filtros.categoria;
    return coincideTexto && coincideCategoria;
  });

  resultado.sort(function (a, b) {
    switch (filtros.orden) {
      case "nombre-desc": return b.nombre.localeCompare(a.nombre, "es");
      case "precio-asc": return a.precio - b.precio;
      case "precio-desc": return b.precio - a.precio;
      default: return a.nombre.localeCompare(b.nombre, "es");
    }
  });

  return resultado;
}

function actualizarCatalogo() {
  const filtradas = filtrarPlantas(todasLasPlantas, leerFiltros());
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = filtradas.slice(inicio, inicio + POR_PAGINA);

  renderizarCatalogo(pagina);

  // Contador y mensaje de "no encontramos"
  const contador = document.getElementById("contador");
  if (filtradas.length === 0) {
    contador.textContent = "0 plantas encontradas";
  } else {
    contador.textContent =
      "Mostrando " + (inicio + 1) + "–" + (inicio + pagina.length) + " de " +
      filtradas.length + (filtradas.length === 1 ? " planta" : " plantas");
  }
  document.getElementById("sin-resultados").classList.toggle("oculto", filtradas.length > 0);

  renderizarPaginacion(totalPaginas, filtradas.length);
}

function renderizarPaginacion(totalPaginas, cantidad) {
  const nav = document.getElementById("paginacion");
  nav.innerHTML = "";
  if (cantidad <= POR_PAGINA) return;

  function boton(texto, pagina, deshabilitado, actual) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = texto;
    b.disabled = deshabilitado;
    if (actual) b.setAttribute("aria-current", "page");
    b.addEventListener("click", function () {
      paginaActual = pagina;
      actualizarCatalogo();
      document.getElementById("contador").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return b;
  }

  nav.appendChild(boton("← Anterior", paginaActual - 1, paginaActual === 1, false));
  for (let i = 1; i <= totalPaginas; i++) {
    nav.appendChild(boton(String(i), i, false, i === paginaActual));
  }
  nav.appendChild(boton("Siguiente →", paginaActual + 1, paginaActual === totalPaginas, false));
}

// ---------- Visor de imagen en la misma página ----------
function abrirVisor(planta) {
  const visor = document.getElementById("visor");
  const img = document.getElementById("visor-img");
  img.src = planta.foto;
  img.alt = planta.nombre + " en maceta";
  document.getElementById("visor-titulo").textContent = planta.nombre;
  document.getElementById("visor-link").href = "planta.html?id=" + encodeURIComponent(planta.id);
  visor.classList.remove("oculto");
  document.body.classList.add("sin-scroll");
  document.getElementById("visor-cerrar").focus();
}

function cerrarVisor() {
  document.getElementById("visor").classList.add("oculto");
  document.body.classList.remove("sin-scroll");
}

// ---------- Inicio ----------
document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("form-filtros");
  const carga = document.getElementById("estado-carga");

  // Categoría que llega desde el inicio: catalogo.html?categoria=interior
  const categoriaUrl = new URLSearchParams(window.location.search).get("categoria");
  if (categoriaUrl && CATEGORIAS.includes(categoriaUrl)) {
    document.getElementById("filtro-categoria").value = categoriaUrl;
  }

  // Filtra mientras se escribe y al cambiar los selects
  document.getElementById("buscar").addEventListener("input", function () {
    paginaActual = 1;
    actualizarCatalogo();
  });
  document.getElementById("filtro-categoria").addEventListener("change", function () {
    paginaActual = 1;
    actualizarCatalogo();
  });
  document.getElementById("orden").addEventListener("change", actualizarCatalogo);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    paginaActual = 1;
    actualizarCatalogo();
  });

  // Limpiar filtros: vuelve al estado inicial
  form.addEventListener("reset", function () {
    setTimeout(function () {
      paginaActual = 1;
      history.replaceState(null, "", "catalogo.html");
      actualizarCatalogo();
      document.getElementById("buscar").focus();
    }, 0);
  });

  // Visor
  document.getElementById("visor-cerrar").addEventListener("click", cerrarVisor);
  document.getElementById("visor").addEventListener("click", function (e) {
    if (e.target.id === "visor") cerrarVisor();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarVisor();
  });

  // Entrega 9: datos desde la API, con estado de carga y manejo de errores
  try {
    todasLasPlantas = await obtenerPlantas();
    document.getElementById("total-plantas").textContent = todasLasPlantas.length;

    if (usandoRespaldo) {
      mostrarAlerta("aviso-catalogo", "aviso",
        "No pudimos conectar con el servidor. Te mostramos el catálogo guardado; los precios y el stock pueden no estar actualizados.");
    }
    actualizarCatalogo();
  } catch (error) {
    console.error(error);
    mostrarAlerta("aviso-catalogo", "error", "No pudimos cargar el catálogo. Recargá la página en unos minutos.");
  } finally {
    carga.classList.add("oculto");
  }
});
