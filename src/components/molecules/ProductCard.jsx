import { Link } from "react-router-dom"
import ProductImage from "../atoms/ProductImage"
import Stars from "../atoms/Stars"
import Price from "../atoms/Price"
import Button from "../atoms/Button"
import { etiquetaCategoria } from "../../utils/format"
import { useCompare } from "../../hooks/useCompare"
import { useCart } from "../../hooks/useCart"
import { avisar } from "../../utils/notify"

/** `comparable` muestra el checkbox "Comparar" (solo en catálogo/accesorios, como en el original). */
export default function ProductCard({ p, comparable = false }){
  const { ids, toggle } = useCompare()
  const { agregar } = useCart()
  const agotado = p.stock <= 0
  const cat = etiquetaCategoria(p)

  const agregarRapido = () => {
    const r = agregar(p, p.tallas[0], p.nombresColores[0])
    avisar(r.ok ? `✅ ${p.nombre} agregado al carrito (Talla ${p.tallas[0]}, ${p.nombresColores[0]}).` : r.mensaje)
  }
  const onCompare = e => {
    if (!toggle(p.id)){ e.target.checked = false; avisar("Puedes comparar máximo 3 productos.") }
  }

  return (
    <article className="product-card">
      {agotado ? <span className="badge" style={{ background: "#5B6472" }}>Agotado</span> : (p.badge ? <span className="badge">{p.badge}</span> : null)}
      <Link to={`/producto/${p.id}`} aria-label={`Ver detalle de ${p.nombre}`}>
        <ProductImage src={p.imagen} alt={`${p.nombre} - categoría ${cat}`} className="product-card__img" loading="lazy" decoding="async"
          style={agotado ? { filter: "grayscale(1)", opacity: .55 } : undefined} />
      </Link>
      <div className="product-card__body">
        <h2 className="product-card__title">{p.nombre}</h2>
        <p className="product-card__cat">{cat} · {p.marca}</p>
        <Stars value={p.reviews.promedio}><span>({p.reviews.total})</span></Stars>
        <Price className="product-card__price" precio={p.precio} anterior={p.precioAnterior} />
        <div className="product-card__actions">
          <Button to={`/producto/${p.id}`}>Ver detalles</Button>
          <Button onClick={agregarRapido} disabled={agotado} title={agotado ? "Sin stock disponible" : "Agregar al carrito"}
            aria-label={`Agregar ${p.nombre} al carrito`}
            style={{ flex: "none", width: 44, padding: "10px 0", fontSize: "1.25rem", lineHeight: 1, borderRadius: 10,
              ...(agotado ? { opacity: .4, cursor: "not-allowed", boxShadow: "none" } : {}) }}>+</Button>
        </div>
        {comparable && (
          <label className="compare-check" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={ids.includes(p.id)} onChange={onCompare} /> Comparar
          </label>
        )}
      </div>
    </article>
  )
}
