import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import ProductImage from "../components/atoms/ProductImage"
import Button from "../components/atoms/Button"
import Breadcrumbs from "../components/molecules/Breadcrumbs"
import ReviewCard from "../components/molecules/ReviewCard"
import ProductPurchasePanel from "../components/organisms/ProductPurchasePanel"
import SpecsTable from "../components/organisms/SpecsTable"
import { useProducts } from "../hooks/useProducts"
import { usePageMeta } from "../hooks/usePageMeta"
import { generarResenas } from "../utils/reviews"

export default function ProductDetail(){
  const { id } = useParams()
  const { getById } = useProducts()
  const navigate = useNavigate()
  const [p, setP] = useState(undefined)   // undefined=cargando, null=no existe
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => { setP(undefined); setColorIdx(0); getById(id).then(setP) }, [id, getById])

  const jsonLd = useMemo(() => p && p.activo !== false ? ({
    "@context": "https://schema.org/", "@type": "Product", name: p.nombre, image: [p.imagen], description: p.descripcion,
    brand: { "@type": "Brand", name: p.marca },
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.reviews.promedio, reviewCount: p.reviews.total },
    offers: { "@type": "Offer", priceCurrency: "COP", price: p.precio, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  }) : null, [p])
  usePageMeta(p ? `${p.nombre} | Veloce Bikes` : "Detalle del Producto | Veloce Bikes", p?.descripcion, jsonLd)
  const resenas = useMemo(() => (p ? generarResenas(p) : []), [p])

  if (p === undefined) return <p className="container" style={{ padding: "48px 16px" }}>Cargando…</p>
  if (p === null) return <h2 className="container" style={{ padding: "48px 16px" }}>Producto no encontrado.</h2>
  if (p.activo === false) return <h2 className="container" style={{ padding: "48px 16px" }}>🚫 Este producto fue inactivado por el administrador y ya no está disponible para la venta.</h2>

  const volver = () => (window.history.length > 1 ? navigate(-1) : navigate(p.categoria === "accesorios" ? "/accesorios" : "/catalogo"))

  return (
    <>
      <div className="container pdp-topbar">
        <Button variant="ghost" className="btn--back" onClick={volver} aria-label="Volver a la página anterior">← Volver</Button>
        <Breadcrumbs categoria={p.categoria} nombre={p.nombre} />
      </div>
      <section className="pdp container">
        <div className="pdp__gallery">
          <div className="zoom-wrap">
            <ProductImage src={p.imagen} alt={p.nombre} loading="eager" style={p.stock <= 0 ? { filter: "grayscale(1)", opacity: .6 } : undefined} />
          </div>
        </div>
        <ProductPurchasePanel p={p} colorIdx={colorIdx} onColor={setColorIdx} />
      </section>
      <section className="section container">
        <h2 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Especificaciones Técnicas</h2>
        <SpecsTable specs={p.specs} />
      </section>
      <section className="section container">
        <h2 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Reseñas de Clientes</h2>
        <div id="reviews-list">{resenas.map((r, i) => <ReviewCard key={i} r={r} />)}</div>
      </section>
    </>
  )
}
