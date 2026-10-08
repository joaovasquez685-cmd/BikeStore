/** Acceso seguro a localStorage (JSON). Solo lo usan los adaptadores locales (modo demo). */
export function leer(key, porDefecto = null){
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? porDefecto : JSON.parse(raw)
  } catch {
    return porDefecto
  }
}
export function guardar(key, valor){ localStorage.setItem(key, JSON.stringify(valor)) }
export function borrar(key){ localStorage.removeItem(key) }

export const KEYS = {
  products: "veloce_products",
  productsVer: "veloce_products_ver",
  users: "veloce_users",
  session: "veloce_session",
  orders: "veloce_orders",
  orderSeq: "veloce_order_seq",
  citas: "veloce_citas",
  cart: id => "veloce_cart_" + id,
}
