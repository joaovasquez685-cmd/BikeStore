import { useMemo } from "react"
import Hero from "../components/organisms/Hero"
import CategoryGrid from "../components/organisms/CategoryGrid"
import ProductGrid from "../components/organisms/ProductGrid"
import PromoBanner from "../components/organisms/PromoBanner"
import TrustBlock from "../components/organisms/TrustBlock"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { Link } from "react-router-dom"
import { useProducts } from "../hooks/useProducts"
import { usePageMeta } from "../hooks/usePageMeta"

const HERO_IMG = "https://image.qwenlm.ai/public_source/c4e4968e-2348-4ce3-95ae-1397f6d95640/8c3569782-1f9f-49fd-a96f-cf9d7962e9607049.png"

export default function Home(){
  usePageMeta("Veloce Bikes | Tienda de Bicicletas Premium")
  const { productos } = useProducts()
  /* Corrección: el original ordenaba el arreglo global con sort() (mutaba el catálogo). Aquí se copia. */
  const top = useMemo(() => [...productos].sort((a, b) => b.popularidad - a.popularidad).slice(0, 4), [productos])

  return (
    <>
      <Hero imagen={HERO_IMG} alt="Ciclista en montaña" eyebrow="Temporada 2026 · Nuevos modelos">
        <h1>Rueda más lejos.<span className="accent">Vive más rápido.</span></h1>
        <p className="lead">Bicicletas de montaña, ruta, ciudad y eléctricas con garantía de 2 años, envío asegurado y asesoría de ciclistas expertos.</p>
        <div className="hero__cta">
          <Button to="/catalogo" size="lg">Explorar catálogo</Button>
          <a href="#categorias" className="btn btn--ghost-light">Ver categorías</a>
        </div>
        <div className="hero__stats">
          <div className="stat"><b>20+</b><span>modelos disponibles</span></div>
          <div className="stat"><b>4.8★</b><span>calificación promedio</span></div>
          <div className="stat"><b>2 años</b><span>de garantía real</span></div>
          <div className="stat"><b>24 h</b><span>despacho nacional</span></div>
        </div>
      </Hero>

      <section id="categorias" className="section"><div className="container">
        <SectionHead kicker="Catálogo" titulo="Encuentra tu terreno"><Link to="/catalogo" className="link-more">Ver todo →</Link></SectionHead>
        <CategoryGrid />
      </div></section>

      <section className="section"><div className="container">
        <SectionHead kicker="Top ventas" titulo="Las favoritas de la comunidad"><Link to="/catalogo" className="link-more">Ver todas →</Link></SectionHead>
        <ProductGrid lista={top} id="top-ventas" />
      </div></section>

      <section className="section"><div className="container">
        <PromoBanner eyebrow="🎉 Oferta de septiembre" titulo="Hasta $500.000 de descuento en ruta y eléctricas"
          texto='Filtra por "Oferta" en el catálogo y asegura tu bici antes de que se agote el stock.'
          cta={<Button to="/catalogo" variant="light">Ver ofertas</Button>} badge="-15%" />
      </div></section>

      <section className="section"><div className="container"><TrustBlock /></div></section>
    </>
  )
}
