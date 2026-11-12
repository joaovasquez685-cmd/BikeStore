import { useState } from "react"
import ColorSwatches from "../molecules/ColorSwatches"
import SizeSelector from "../molecules/SizeSelector"
import Stars from "../atoms/Stars"
import Price from "../atoms/Price"
import Button from "../atoms/Button"
import { etiquetaCategoria } from "../../utils/format"
import { useCart } from "../../hooks/useCart"
import { useUi } from "../../hooks/useUi"
import { avisar } from "../../utils/notify"

/** Columna derecha de la ficha: info, variantes (color/talla) y botón de compra. */
export default function ProductPurchasePanel({ p, colorIdx, onColor }){
  const [talla, setTalla] = useState(null)
  const { agregar } = useCart()
  const { abrirGuiaTallas } = useUi()
  const agotado = p.stock <= 0
  const stockColor = p.stockPorColor[colorIdx]

  const anadir = () => {
    if (agotado) return avisar(`⚠️ ${p.nombre} está AGOTADO por el momento.`)
    if (!talla) return avisar("⚠️ Por favor selecciona una TALLA antes de añadir al carrito.")
    if (stockColor <= 0) return avisar("⚠️ Este color se encuentra agotado. Elige otro color.")
    const r = agregar(p, talla, p.nombresColores[colorIdx])
    avisar(r.ok ? `✅ ${p.nombre} (Talla ${talla}, ${p.nombresColores[colorIdx]}) añadida al carrito.` : r.mensaje)
  }

  return (
    <div className="pdp__info">
      <p className="pdp__cat">{etiquetaCategoria(p)} · {p.marca}</p>
      <h1>{p.nombre}</h1>
      <Stars as="p" value={p.reviews.promedio} className="pdp__rating">
        <span>{p.reviews.promedio} · {p.reviews.total} reseñas</span>
      </Stars>
      <Price className="pdp__price" precio={p.precio} anterior={p.precioAnterior} />
      <p className={`stock-label ${agotado || stockColor <= 0 ? "stock-out" : "stock-ok"}`}>
        {agotado ? "PRODUCTO AGOTADO — sin unidades disponibles"
          : `Color ${p.nombresColores[colorIdx]}: ${stockColor > 0 ? stockColor + " unidades disponibles" : "AGOTADO en este color"}`}
      </p>
      <p style={{ marginTop: 20, color: "var(--ink-soft)", lineHeight: 1.7 }}>{p.descripcion}</p>

      <div className="variant-selector">
        <label>Color:</label>
        <ColorSwatches colores={p.colores} nombres={p.nombresColores} stocks={p.stockPorColor} selected={colorIdx} onSelect={onColor} />
      </div>
      <div className="variant-selector">
        <label>Talla: <button type="button" className="link-guide" onClick={abrirGuiaTallas}>📏 Guía de tallas</button></label>
        <SizeSelector tallas={p.tallas} selected={talla} onSelect={setTalla} />
      </div>

      <Button size="lg" onClick={anadir} disabled={agotado} style={{ width: "100%", marginTop: 20, ...(agotado ? { opacity: .5, cursor: "not-allowed", boxShadow: "none" } : {}) }}>
        {agotado ? "🚫 Producto agotado" : "🛒 Añadir al Carrito"}
      </Button>
    </div>
  )
}
