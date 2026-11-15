// =====================================================================
// api.js — Entregas 9, 10 y 11
// Todas las conexiones con el servidor pasan por este archivo.
//
// CONFIGURACIÓN: poné en API_URL la dirección de la API que les dieron
// (por ejemplo una de MockAPI: "https://xxxx.mockapi.io/api/v1").
// La API tiene que tener dos recursos: /plantas y /usuarios.
//
// Si API_URL queda vacía, el sitio funciona con un "servidor local"
// que guarda los datos en el navegador (localStorage) a partir del
// array de js/datos.js. Así se puede probar todo sin conexión.
// Si la API está configurada pero falla, el catálogo usa el array de
// respaldo y avisa al usuario.
// =====================================================================

const API_URL = "https://6afa20d86d8b86fb22d78191.mockapi.io/api/v1";

const DEMORA_LOCAL = 400; // ms, para ver el estado de carga en modo local
const CLAVE_PLANTAS = "viveroRaiz.plantas.v2";
const CLAVE_USUARIOS = "viveroRaiz.usuarios";

// Indica si la última lectura de plantas usó los datos de respaldo.
let usandoRespaldo = false;

function hayApi() {
  return API_URL.trim() !== "";
}

function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

// ---------- Petición genérica con fetch + async/await ----------
async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(API_URL + ruta, {
    headers: { "Content-Type": "application/json" },
    ...opciones
  });

  if (!respuesta.ok) {
    throw new Error("El servidor respondió con el código " + respuesta.status);
  }

  if (respuesta.status === 204) return null;
  return await respuesta.json();
}

// ---------- "Servidor local" en localStorage ----------
function leerLocal(clave, inicial) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  } catch (e) {
    // si el navegador no deja usar localStorage seguimos con los datos iniciales
  }
  return JSON.parse(JSON.stringify(inicial));
}

function guardarLocal(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (e) {
    throw new Error("No se pudieron guardar los datos en este navegador.");
  }
}

function siguienteId(lista) {
  return lista.reduce(function (max, item) {
    return Math.max(max, Number(item.id) || 0);
  }, 0) + 1;
}

// Normaliza lo que devuelve el servidor para que respete el contrato.
function normalizarPlanta(p) {
  return {
    id: p.id,
    nombre: String(p.nombre || ""),
    nombreCientifico: String(p.nombreCientifico || ""),
    categoria: String(p.categoria || ""),
    luz: String(p.luz || ""),
    riego: String(p.riego || ""),
    precio: Number(p.precio) || 0,
    stock: parseInt(p.stock, 10) || 0,
    fechaIngreso: String(p.fechaIngreso || "").slice(0, 10),
    aptaMascotas: p.aptaMascotas === true || p.aptaMascotas === "true",
    etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : [],
    foto: String(p.foto || ""),
    notas: String(p.notas || "")
  };
}

// =====================================================================
// PLANTAS
// =====================================================================

async function obtenerPlantas() {
  usandoRespaldo = false;

  if (hayApi()) {
    try {
      const datos = await pedir("/plantas");
      // Lectura de la estructura JSON: puede venir como array o como { plantas: [...] }
      const lista = Array.isArray(datos) ? datos : (datos.plantas || datos.data || []);
      return lista.map(normalizarPlanta);
    } catch (error) {
      console.error("Error al leer la API:", error);
      usandoRespaldo = true;
      return PLANTAS.map(normalizarPlanta);
    }
  }

  await esperar(DEMORA_LOCAL);
  return leerLocal(CLAVE_PLANTAS, PLANTAS).map(normalizarPlanta);
}

async function obtenerPlanta(id) {
  if (hayApi()) {
    try {
      return normalizarPlanta(await pedir("/plantas/" + encodeURIComponent(id)));
    } catch (error) {
      console.error("Error al leer la planta:", error);
      usandoRespaldo = true;
      const respaldo = PLANTAS.find(function (p) { return String(p.id) === String(id); });
      return respaldo ? normalizarPlanta(respaldo) : null;
    }
  }

  await esperar(DEMORA_LOCAL);
  const planta = leerLocal(CLAVE_PLANTAS, PLANTAS).find(function (p) {
    return String(p.id) === String(id);
  });
  return planta ? normalizarPlanta(planta) : null;
}

async function crearPlanta(planta) {
  if (hayApi()) {
    return normalizarPlanta(await pedir("/plantas", {
      method: "POST",
      body: JSON.stringify(planta)
    }));
  }

  await esperar(DEMORA_LOCAL);
  const lista = leerLocal(CLAVE_PLANTAS, PLANTAS);
  const nueva = { ...planta, id: siguienteId(lista) };
  lista.push(nueva);
  guardarLocal(CLAVE_PLANTAS, lista);
  return normalizarPlanta(nueva);
}

async function editarPlanta(id, planta) {
  if (hayApi()) {
    return normalizarPlanta(await pedir("/plantas/" + encodeURIComponent(id), {
      method: "PUT",
      body: JSON.stringify(planta)
    }));
  }

  await esperar(DEMORA_LOCAL);
  const lista = leerLocal(CLAVE_PLANTAS, PLANTAS);
  const indice = lista.findIndex(function (p) { return String(p.id) === String(id); });
  if (indice === -1) throw new Error("La planta que querés editar ya no existe.");
  lista[indice] = { ...planta, id: lista[indice].id };
  guardarLocal(CLAVE_PLANTAS, lista);
  return normalizarPlanta(lista[indice]);
}

async function eliminarPlanta(id) {
  if (hayApi()) {
    await pedir("/plantas/" + encodeURIComponent(id), { method: "DELETE" });
    return true;
  }

  await esperar(DEMORA_LOCAL);
  const lista = leerLocal(CLAVE_PLANTAS, PLANTAS);
  const filtrada = lista.filter(function (p) { return String(p.id) !== String(id); });
  if (filtrada.length === lista.length) throw new Error("La planta ya no existe.");
  guardarLocal(CLAVE_PLANTAS, filtrada);
  return true;
}

// =====================================================================
// USUARIOS (Entrega 11)
// =====================================================================

// Devuelve el usuario sin la contraseña, o null si los datos no coinciden.
async function iniciarSesionApi(correo, password) {
  let usuarios;

  if (hayApi()) {
    usuarios = await pedir("/usuarios");
    if (!Array.isArray(usuarios)) usuarios = usuarios.usuarios || usuarios.data || [];
  } else {
    await esperar(DEMORA_LOCAL);
    usuarios = leerLocal(CLAVE_USUARIOS, USUARIOS_INICIALES);
  }

  const usuario = usuarios.find(function (u) {
    return String(u.correo).toLowerCase() === correo.toLowerCase() && u.password === password;
  });

  if (!usuario) return null;
  return { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, correo: usuario.correo, rol: usuario.rol };
}

async function registrarUsuarioApi(usuario) {
  if (hayApi()) {
    const existentes = await pedir("/usuarios");
    const lista = Array.isArray(existentes) ? existentes : (existentes.usuarios || []);
    if (lista.some(function (u) { return String(u.correo).toLowerCase() === usuario.correo.toLowerCase(); })) {
      throw new Error("Ya existe una cuenta con ese correo.");
    }
    return await pedir("/usuarios", { method: "POST", body: JSON.stringify(usuario) });
  }

  await esperar(DEMORA_LOCAL);
  const lista = leerLocal(CLAVE_USUARIOS, USUARIOS_INICIALES);
  if (lista.some(function (u) { return u.correo.toLowerCase() === usuario.correo.toLowerCase(); })) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  const nuevo = { ...usuario, id: siguienteId(lista) };
  lista.push(nuevo);
  guardarLocal(CLAVE_USUARIOS, lista);
  return nuevo;
}
