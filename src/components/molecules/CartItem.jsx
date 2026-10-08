import ProductImage from "../atoms/ProductImage"
import QtyControl from "./QtyControl"
import { fmt } from "../../utils/format"

export default function CartItem({ item, onQty, onRemove }){
  return (
    <div className="cart-item">
      <ProductImage src={item.imagen} alt={item.nombre} />
      <div className="cart-item__info">
        <h4>{item.nombre}</h4>
        <p>Talla: {item.talla} · Color: {item.color}</p>
        <p>{fmt(item.precio)} × {item.cantidad} = <strong>{fmt(item.precio * item.cantidad)}</strong></p>
        <QtyControl cantidad={item.cantidad} onChange={onQty} nombre={item.nombre} />
      </div>
      <button type="button" className="cart-item__remove" onClick={onRemove} aria-label={`Eliminar ${item.nombre}`}>🗑️</button>
    </div>
  )
}
