import { productosSemilla } from "../../data/products"
import { leer, guardar, KEYS } from "./storage"

/* Misma versión de semilla que el sitio original: si cambia, el catálogo se reconstruye. */
const VERSION = "v50-2026-09-14"

function todos(){
  let all = leer(KEYS.products)
  const ver = localStorage.getItem(KEYS.productsVer)
  if (!all || ver !== VERSION || all.length < productosSemilla.length){
    all = productosSemilla.map(p => ({ ...p, activo: true }))
    guardar(KEYS.products, all)
    localStorage.setItem(KEYS.productsVer, VERSION)
  }
  return all
}

export const productService = {
  /** @param {{incluirInactivos?: boolean}} opts */
  async list({ incluirInactivos = false } = {}){
    const all = todos()
    return incluirInactivos ? all : all.filter(p => p.activo !== false)
  },
  async getById(id){
    return todos().find(p => p.id === id) || null
  },
  async create(datos){
    const all = todos()
    const nuevo = {
      ...datos, id: "p-" + Date.now(), reviews: { promedio: 5, total: 0 }, popularidad: 50,
      fecha: new Date().toISOString().slice(0, 10), activo: true,
    }
    all.push(nuevo)
    guardar(KEYS.products, all)
    return nuevo
  },
  async update(id, datos){
    const all = todos()
    const p = all.find(x => x.id === id)
    if (!p) throw new Error("Producto no encontrado.")
    Object.assign(p, datos)
    guardar(KEYS.products, all)
    return p
  },
  async setActivo(id, activo){
    const all = todos()
    const p = all.find(x => x.id === id)
    if (!p) throw new Error("Producto no encontrado.")
    p.activo = activo
    guardar(KEYS.products, all)
    return p
  },
  /** Descuenta stock por venta. Con backend esto ocurre dentro de la transacción del pedido. */
  async descontarStock(items){
    const all = todos()
    items.forEach(i => {
      const p = all.find(x => x.id === i.id)
      if (!p) return
      const idx = (p.nombresColores || []).indexOf(i.color)
      if (idx >= 0 && Array.isArray(p.stockPorColor)) p.stockPorColor[idx] = Math.max(0, (p.stockPorColor[idx] || 0) - i.cantidad)
      p.stock = Math.max(0, (p.stock || 0) - i.cantidad)
    })
    guardar(KEYS.products, all)
  },
}
