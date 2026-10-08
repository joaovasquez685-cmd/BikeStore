import { leer, guardar, KEYS } from "./storage"
import { productService } from "./productService"
import { authService } from "./authService"
import { calcularEnvio, calcularSubtotal } from "../../utils/shipping"

function siguienteNumero(){
  const seq = parseInt(localStorage.getItem(KEYS.orderSeq) || "0", 10) + 1
  localStorage.setItem(KEYS.orderSeq, String(seq))
  return `VB-${new Date().getFullYear()}-${String(seq).padStart(6, "0")}`
}

export const orderService = {
  /**
   * Crea el pedido. Requiere sesión (regla "compra obligatoria con cuenta").
   * @param {{items: object[], direccion: object, pago: {tarjeta: string}}} datos
   */
  async create({ items, direccion, pago }){
    const s = authService.getSession()
    if (!s) throw new Error("🔒 Para completar tu compra primero inicia sesión o crea una cuenta.")
    if (!items.length) throw new Error("Tu carrito está vacío.")

    /* Mejora: se valida el stock vigente antes de cobrar (el original podía vender más de lo disponible). */
    const catalogo = await productService.list({ incluirInactivos: true })
    for (const i of items){
      const p = catalogo.find(x => x.id === i.id)
      const disponible = p ? (p.stockPorColor?.[p.nombresColores.indexOf(i.color)] ?? p.stock) : 0
      if (!p || p.activo === false || disponible < i.cantidad)
        throw new Error(`⚠️ "${i.nombre}" (${i.color}) ya no tiene stock suficiente. Ajusta tu carrito.`)
    }

    const subtotal = calcularSubtotal(items)
    const envio = calcularEnvio(subtotal)
    const pedido = {
      id: siguienteNumero(),
      fecha: new Date().toISOString(),
      usuarioId: s.id,
      usuarioNombre: s.nombre,
      email: s.email,
      items, subtotal, envio, total: subtotal + envio,
      /* nunca se guarda el número completo ni el CVV */
      pago: { metodo: "Tarjeta (pago simulado)", ultimos4: pago.tarjeta.replace(/\s/g, "").slice(-4) },
      direccion,
      estado: "pagado",
    }
    guardar(KEYS.orders, [...leer(KEYS.orders, []), pedido])
    await productService.descontarStock(items)
    return pedido
  },

  async list(){ return leer(KEYS.orders, []) },

  async remove(id){
    const s = authService.getSession()
    if (!s || s.rol !== "administrador") throw new Error("⚠️ Solo el administrador puede eliminar recibos.")
    guardar(KEYS.orders, leer(KEYS.orders, []).filter(o => o.id !== id))
  },
}
