export const CAT_NOMBRES = { montaña:"Montaña", ruta:"Ruta", urbana:"Urbana", eléctrica:"Eléctrica", bmx:"BMX", infantil:"Infantil", accesorios:"Accesorios" }
export const fmt = n => "$" + Number(n || 0).toLocaleString("es-CO")
export const estrellas = r => { const f = Math.round(r); return "★".repeat(f) + "☆".repeat(5 - f) }
export const capitalizar = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "")
export const etiquetaCategoria = p => (p.subcategoria ? capitalizar(p.subcategoria) : (CAT_NOMBRES[p.categoria] || p.categoria))
/** Fecha local YYYY-MM-DD (evita el desfase de toISOString(), que usa UTC). */
export const fechaLocalISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const MAPA_HTML = { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }
export const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g, c => MAPA_HTML[c])
