// =====================================================================
// planta.js — Entregas 8 y 9
// La ficha se arma según el identificador que viene en la URL:
// planta.html?id=3
// =====================================================================

function textoMascotas(apta) {
  return apta ? "Sí, no es tóxica" : "No, mantener fuera de su alcance";
}

function textoLuz(luz) {
  const textos = {
    "sol pleno": "Sol directo varias horas al día.",
    "media sombra": "Luz abundante pero filtrada.",
    "sombra": "Se adapta a ambientes con poca luz."
  };
  return textos[luz] || luz;
}

function textoRiego(riego) {
  const textos = {
    "bajo": "Cada 10 a 15 días, con el sustrato seco.",
    "medio": "Una vez por semana, aprox.",
    "alto": "Frecuente, sin encharcar."
  };
  return textos[riego] || riego;
}

function poner(id, texto) {
  document.getElementById(id).textContent = texto;
}

function mostrarFicha(planta) {
  document.title = planta.nombre + " | Vivero Raíz";
  poner("miga-nombre", planta.nombre);
  poner("ficha-categoria", planta.categoria);
  poner("ficha-nombre", planta.nombre);
  poner("ficha-cientifico", planta.nombreCientifico);
  poner("ficha-precio", "$ " + Number(planta.precio).toLocaleString("es-AR", { maximumFractionDigits: 2 }));

  poner("esp-categoria", planta.categoria.charAt(0).toUpperCase() + planta.categoria.slice(1));
  poner("esp-luz", planta.luz);
  poner("esp-riego", planta.riego);
  poner("esp-mascotas", planta.aptaMascotas ? "Sí" : "No");
  poner("esp-etiquetas", planta.etiquetas.length ? planta.etiquetas.join(" · ") : "—");
  poner("esp-stock", planta.stock > 0 ? planta.stock + " unidades" : "Sin stock por ahora");

  poner("cuidado-luz", textoLuz(planta.luz));
  poner("cuidado-riego", textoRiego(planta.riego));
  poner("cuidado-mascotas", textoMascotas(planta.aptaMascotas));
  poner("ficha-notas", planta.notas);

  // Galería: foto principal + dos vistas de detalle
  const principal = document.getElementById("foto-principal");
  principal.src = planta.foto;
  principal.alt = planta.nombre + " (" + planta.nombreCientifico + ") en maceta";

  const botones = document.querySelectorAll(".galeria-miniaturas button");
  botones.forEach(function (boton) {
    boton.querySelector("img").src = planta.foto;
    boton.addEventListener("click", function () {
      principal.classList.remove("zoom-2", "zoom-3");
      if (boton.dataset.vista) principal.classList.add(boton.dataset.vista);
      botones.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      boton.setAttribute("aria-pressed", "true");
    });
  });

  // Crédito de la foto (si es de Wikimedia Commons)
  const credito = document.getElementById("credito-foto");
  const datosCredito = typeof CREDITOS_FOTOS !== "undefined" ? CREDITOS_FOTOS[planta.foto] : null;
  if (datosCredito) {
    credito.textContent = "Foto: " + datosCredito.autor + " · " + datosCredito.licencia + " · ";
    const enlace = document.createElement("a");
    enlace.href = datosCredito.fuente;
    enlace.target = "_blank";
    enlace.rel = "noopener";
    enlace.textContent = "Wikimedia Commons";
    credito.appendChild(enlace);
  } else {
    credito.textContent = "";
  }

  document.getElementById("btn-consultar").href = "contacto.html?planta=" + encodeURIComponent(planta.nombre);
  document.getElementById("ficha").classList.remove("oculto");
}

document.addEventListener("DOMContentLoaded", async function () {
  const id = new URLSearchParams(window.location.search).get("id");
  const carga = document.getElementById("estado-carga");

  if (!id) {
    carga.classList.add("oculto");
    mostrarAlerta("aviso-ficha", "aviso", "No elegiste ninguna planta. Volvé al catálogo y tocá \"Ver ficha\".");
    return;
  }

  try {
    const planta = await obtenerPlanta(id);
    if (!planta) {
      mostrarAlerta("aviso-ficha", "aviso", "No encontramos esa planta. Puede que ya no esté en el catálogo.");
      return;
    }
    if (usandoRespaldo) {
      mostrarAlerta("aviso-ficha", "aviso", "No pudimos conectar con el servidor. Te mostramos la ficha guardada.");
    }
    mostrarFicha(planta);
  } catch (error) {
    console.error(error);
    mostrarAlerta("aviso-ficha", "error", "No pudimos cargar la ficha. Probá de nuevo en unos minutos.");
  } finally {
    carga.classList.add("oculto");
  }
});
