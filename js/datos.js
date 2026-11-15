// =====================================================================
// datos.js — Entrega 8: "Los datos por un lado"
// Array de plantas que respeta el contrato de datos del proyecto.
// Desde la entrega 9 los datos vienen de la API (js/api.js) y este
// array queda como RESPALDO por si el servidor no responde.
// =====================================================================

const CATEGORIAS = ["interior", "exterior", "suculenta", "aromática"];
const OPCIONES_LUZ = ["sol pleno", "media sombra", "sombra"];
const OPCIONES_RIEGO = ["bajo", "medio", "alto"];
const ETIQUETAS = ["purificadora", "floración", "colgante", "resistente"];

const PLANTAS = [
  {
    id: 1,
    nombre: "Costilla de Adán",
    nombreCientifico: "Monstera deliciosa",
    categoria: "interior",
    luz: "media sombra",
    riego: "medio",
    precio: 12400,
    stock: 15,
    fechaIngreso: "2026-03-02",
    aptaMascotas: false,
    etiquetas: ["purificadora"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Monstera_deliciosa2.jpg/500px-Monstera_deliciosa2.jpg",
    notas: "Luz indirecta brillante. Regar solo cuando los primeros centímetros del sustrato estén secos. Limpiar las hojas con un paño húmedo."
  },
  {
    id: 2,
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    categoria: "exterior",
    luz: "sol pleno",
    riego: "bajo",
    precio: 6900,
    stock: 22,
    fechaIngreso: "2026-02-14",
    aptaMascotas: false,
    etiquetas: ["floración", "resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Mostar_Lavender_bush.jpg/500px-Mostar_Lavender_bush.jpg",
    notas: "Necesita entre 6 y 8 horas de sol directo. Evitar encharcamientos. Podar después de la floración para que mantenga la forma."
  },
  {
    id: 3,
    nombre: "Cactus bola",
    nombreCientifico: "Echinocactus grusonii",
    categoria: "suculenta",
    luz: "sol pleno",
    riego: "bajo",
    precio: 4200,
    stock: 30,
    fechaIngreso: "2026-01-20",
    aptaMascotas: true,
    etiquetas: ["resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Echinocactus_grusonii_%28aka%29.jpg/500px-Echinocactus_grusonii_%28aka%29.jpg",
    notas: "Mucha luz y riego muy escaso: cada 15 días en verano y casi nada en invierno. Sustrato para cactus con buen drenaje."
  },
  {
    id: 4,
    nombre: "Potus",
    nombreCientifico: "Epipremnum aureum",
    categoria: "interior",
    luz: "sombra",
    riego: "medio",
    precio: 5100,
    stock: 40,
    fechaIngreso: "2026-03-10",
    aptaMascotas: false,
    etiquetas: ["purificadora", "colgante", "resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Money_Plant_%28Epipremnum_aureum%29_4.jpg/500px-Money_Plant_%28Epipremnum_aureum%29_4.jpg",
    notas: "Se adapta a ambientes con poca luz. Ideal para colgar o dejar caer desde un estante. Regar una vez por semana."
  },
  {
    id: 5,
    nombre: "Ficus lira",
    nombreCientifico: "Ficus lyrata",
    categoria: "interior",
    luz: "media sombra",
    riego: "medio",
    precio: 18700,
    stock: 8,
    fechaIngreso: "2026-02-28",
    aptaMascotas: false,
    etiquetas: ["purificadora"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Starr_031108-0130_Ficus_lyrata.jpg/500px-Starr_031108-0130_Ficus_lyrata.jpg",
    notas: "No le gustan los cambios de lugar ni las corrientes de aire. Luz abundante pero filtrada."
  },
  {
    id: 6,
    nombre: "Romero",
    nombreCientifico: "Salvia rosmarinus",
    categoria: "exterior",
    luz: "sol pleno",
    riego: "bajo",
    precio: 3800,
    stock: 25,
    fechaIngreso: "2026-01-05",
    aptaMascotas: true,
    etiquetas: ["resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Rosemary_in_bloom.JPG/500px-Rosemary_in_bloom.JPG",
    notas: "Muy resistente a la sequía. Pleno sol y sustrato aireado. Se puede cosechar todo el año para la cocina."
  },
  {
    id: 7,
    nombre: "Albahaca",
    nombreCientifico: "Ocimum basilicum",
    categoria: "aromática",
    luz: "sol pleno",
    riego: "alto",
    precio: 2900,
    stock: 35,
    fechaIngreso: "2026-03-15",
    aptaMascotas: true,
    etiquetas: [],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Ocimum_basilicum_8zz.jpg/500px-Ocimum_basilicum_8zz.jpg",
    notas: "Riego frecuente sin encharcar. Cortar las flores apenas aparecen para que siga dando hojas."
  },
  {
    id: 8,
    nombre: "Menta",
    nombreCientifico: "Mentha spicata",
    categoria: "aromática",
    luz: "media sombra",
    riego: "alto",
    precio: 3100,
    stock: 28,
    fechaIngreso: "2026-03-12",
    aptaMascotas: false,
    etiquetas: ["resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Minze.jpg/500px-Minze.jpg",
    notas: "Crece muy rápido: conviene tenerla sola en su maceta. Sustrato siempre algo húmedo."
  },
  {
    id: 9,
    nombre: "Echeveria",
    nombreCientifico: "Echeveria elegans",
    categoria: "suculenta",
    luz: "sol pleno",
    riego: "bajo",
    precio: 3500,
    stock: 50,
    fechaIngreso: "2026-02-03",
    aptaMascotas: true,
    etiquetas: ["resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Echeveria_elegans_-_1.png/500px-Echeveria_elegans_-_1.png",
    notas: "Regar por el borde de la maceta sin mojar la roseta. Mucha luz para que mantenga su color."
  },
  {
    id: 10,
    nombre: "Aloe vera",
    nombreCientifico: "Aloe barbadensis",
    categoria: "suculenta",
    luz: "sol pleno",
    riego: "bajo",
    precio: 4800,
    stock: 18,
    fechaIngreso: "2026-01-28",
    aptaMascotas: false,
    etiquetas: ["purificadora", "resistente"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/A_potted_aloe_vera_plant.jpg/500px-A_potted_aloe_vera_plant.jpg",
    notas: "Dejar secar completamente el sustrato entre riegos. Proteger de las heladas."
  },
  {
    id: 11,
    nombre: "Helecho de Boston",
    nombreCientifico: "Nephrolepis exaltata",
    categoria: "interior",
    luz: "sombra",
    riego: "alto",
    precio: 6400,
    stock: 12,
    fechaIngreso: "2026-03-05",
    aptaMascotas: true,
    etiquetas: ["purificadora", "colgante"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Boston_Fern_%282873392811%29.png/500px-Boston_Fern_%282873392811%29.png",
    notas: "Le gusta la humedad ambiente: pulverizar las hojas en verano. Evitar el sol directo."
  },
  {
    id: 12,
    nombre: "Jazmín estrella",
    nombreCientifico: "Trachelospermum jasminoides",
    categoria: "exterior",
    luz: "sol pleno",
    riego: "medio",
    precio: 8900,
    stock: 14,
    fechaIngreso: "2026-02-18",
    aptaMascotas: true,
    etiquetas: ["floración", "colgante"],
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Trachelospermum_jasminoides1215878198.jpg/500px-Trachelospermum_jasminoides1215878198.jpg",
    notas: "Trepadora perfumada. Necesita un soporte o enrejado. Florece en primavera y verano."
  }
];

// Créditos de las fotos (Wikimedia Commons). Las licencias CC piden nombrar al autor.
const CREDITOS_FOTOS = {
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Monstera_deliciosa2.jpg/500px-Monstera_deliciosa2.jpg": { autor: "Kurt Stueber", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Monstera_deliciosa2.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Mostar_Lavender_bush.jpg/500px-Mostar_Lavender_bush.jpg": { autor: "Jiaminglimjm", licencia: "CC0", fuente: "https://commons.wikimedia.org/wiki/File:Mostar_Lavender_bush.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Echinocactus_grusonii_%28aka%29.jpg/500px-Echinocactus_grusonii_%28aka%29.jpg": { autor: "André Karwath", licencia: "CC BY-SA 2.5", fuente: "https://commons.wikimedia.org/wiki/File:Echinocactus_grusonii_(aka).jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Money_Plant_%28Epipremnum_aureum%29_4.jpg/500px-Money_Plant_%28Epipremnum_aureum%29_4.jpg": { autor: "Mokkie", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Money_Plant_(Epipremnum_aureum)_4.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Starr_031108-0130_Ficus_lyrata.jpg/500px-Starr_031108-0130_Ficus_lyrata.jpg": { autor: "Forest & Kim Starr", licencia: "CC BY 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Starr_031108-0130_Ficus_lyrata.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Rosemary_in_bloom.JPG/500px-Rosemary_in_bloom.JPG": { autor: "Margalob", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Rosemary_in_bloom.JPG" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Ocimum_basilicum_8zz.jpg/500px-Ocimum_basilicum_8zz.jpg": { autor: "David J. Stang", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Ocimum_basilicum_8zz.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Minze.jpg/500px-Minze.jpg": { autor: "Simon Eugster", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Minze.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Echeveria_elegans_-_1.png/500px-Echeveria_elegans_-_1.png": { autor: "EriaWei", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Echeveria_elegans_-_1.png" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/A_potted_aloe_vera_plant.jpg/500px-A_potted_aloe_vera_plant.jpg": { autor: "Lionsleeps23", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:A_potted_aloe_vera_plant.jpg" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Boston_Fern_%282873392811%29.png/500px-Boston_Fern_%282873392811%29.png": { autor: "Homer Edward Price", licencia: "CC BY 2.0", fuente: "https://commons.wikimedia.org/wiki/File:Boston_Fern_(2873392811).png" },
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Trachelospermum_jasminoides1215878198.jpg/500px-Trachelospermum_jasminoides1215878198.jpg": { autor: "Scott Zona", licencia: "CC BY 2.0", fuente: "https://commons.wikimedia.org/wiki/File:Trachelospermum_jasminoides1215878198.jpg" }
};

// Usuario de prueba para entrar a la intranet mientras no haya API.
const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: "Admin",
    apellido: "Vivero",
    correo: "admin@viveroraiz.com",
    password: "vivero123",
    rol: "administracion"
  }
];
