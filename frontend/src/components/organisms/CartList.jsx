import { Link } from "react-router-dom"
import CartItem from "../molecules/CartItem"
import { useCart } from "../../hooks/useCart"
import { useProducts } from "../../hooks/useProducts"
import { avisar } from "../../utils/notify"

export default function CartList(){
  const { items, cambiarCantidad, quitar } = useCart()
  const { productos } = useProducts()

  const onQty = (i, delta) => {
    const it = items[i]
    const p = productos.find(x => x.id === it.id)
    const stock = p ? (p.stockPorColor[p.nombresColores.indexOf(it.color)] ?? 99) : 99
    const aviso = cambiarCantidad(i, delta, stock)
    if (aviso) avisar(aviso)
  }

  if (!items.length) return (
    <p className="empty-msg">Tu carrito está vacío. <Link to="/catalogo" style={{ color: "var(--accent)", fontWeight: 600 }}>Ver catálogo</Link> · <Link to="/accesorios" style={{ color: "var(--accent)", fontWeight: 600 }}>Ver accesorios</Link></p>
  )
  return (
    <div className="cart-items">
      {items.map((item, i) => <CartItem key={`${item.id}-${item.talla}-${item.color}`} item={item} onQty={d => onQty(i, d)} onRemove={() => quitar(i)} />)}
    </div>
  )
}
