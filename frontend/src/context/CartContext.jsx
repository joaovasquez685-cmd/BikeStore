import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { cartService } from "../services"
import { useAuth } from "../hooks/useAuth"
import { calcularEnvio, calcularSubtotal } from "../utils/shipping"

export const CartContext = createContext(null)

export function CartProvider({ children }){
  const { user } = useAuth()
  const owner = user?.id || "guest"
  const [items, setItems] = useState(() => cartService.get(owner))

  /* Recarga el carrito al cambiar de usuario (login/logout). */
  useEffect(() => { setItems(cartService.get(owner)) }, [owner])

  const persist = useCallback(next => { setItems(next); cartService.save(owner, next) }, [owner])

  /** Devuelve {ok, mensaje}. El stock máximo de la variante (color) limita la cantidad. */
  const agregar = useCallback((p, talla, color) => {
    if (p.stock <= 0) return { ok: false, mensaje: `⚠️ ${p.nombre} está AGOTADO por el momento.` }
    const idx = p.nombresColores.indexOf(color)
    const stock = p.stockPorColor[idx] ?? 0
    if (stock <= 0) return { ok: false, mensaje: `⚠️ ${p.nombre} está agotada en el color ${color}.` }
    const next = items.map(i => ({ ...i }))
    const ex = next.find(i => i.id === p.id && i.talla === talla && i.color === color)
    if (ex) ex.cantidad = Math.min(ex.cantidad + 1, stock)
    else next.push({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, talla, color, cantidad: 1, categoria: p.categoria })
    persist(next)
    return { ok: true, mensaje: `✅ ${p.nombre} (Talla ${talla}, ${color}) añadido al carrito.` }
  }, [items, persist])

  /** delta ±1; `stockMax` lo calcula quien llama a partir del catálogo vigente. */
  const cambiarCantidad = useCallback((index, delta, stockMax = 99) => {
    const next = items.map(i => ({ ...i }))
    const it = next[index]; if (!it) return null
    it.cantidad += delta
    let aviso = null
    if (it.cantidad <= 0) next.splice(index, 1)
    else if (it.cantidad > stockMax){ it.cantidad = stockMax; aviso = `⚠️ Solo hay ${stockMax} unidades disponibles de este modelo y color.` }
    persist(next)
    return aviso
  }, [items, persist])

  const quitar = useCallback(index => persist(items.filter((_, i) => i !== index)), [items, persist])
  const vaciar = useCallback(() => persist([]), [persist])

  const value = useMemo(() => {
    const subtotal = calcularSubtotal(items)
    const envio = items.length ? calcularEnvio(subtotal) : 0
    return {
      items, agregar, cambiarCantidad, quitar, vaciar,
      count: items.reduce((s, i) => s + i.cantidad, 0),
      subtotal, envio, total: subtotal + envio,
    }
  }, [items, agregar, cambiarCantidad, quitar, vaciar])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
