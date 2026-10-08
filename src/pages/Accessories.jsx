import { useMemo, useRef, useState } from "react"
import Hero from "../components/organisms/Hero"
import AccessoryFilters, { FILTROS_ACC_INICIAL } from "../components/organisms/AccessoryFilters"
import SubTiles from "../components/organisms/SubTiles"
import ProductGrid from "../components/organisms/ProductGrid"
import PromoBanner from "../components/organisms/PromoBanner"
import SearchBox from "../components/molecules/SearchBox"
import SectionHead from "../components/molecules/SectionHead"
import Select from "../components/atoms/Select"
import Button from "../components/atoms/Button"
import { useProducts } from "../hooks/useProducts"
import { usePageMeta } from "../hooks/usePageMeta"

const HERO_IMG = "https://image.qwenlm.ai/public_source/b4c07f46-da6d-4994-8e44-17a62f72ae34/641e31e99-324a-4a79-9598-51761e42764f4787.png"
const ORDEN = [
  { value: "popular", label: "Más populares" }, { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" }, { value: "nombre", label: "Nombre A-Z" },
]

export default function Accessories(){
  usePageMeta("Accesorios | Veloce Bikes", "Tienda de accesorios Veloce Bikes: 30 artículos en cascos, guantes, ropa, iluminación, seguridad, hidratación, herramientas y componentes.")
  const { productos } = useProducts()
  const [filtros, setFiltros] = useState(FILTROS_ACC_INICIAL)
  const [q, setQ] = useState("")
  const [orden, setOrden] = useState("popular")
  const catalogoRef = useRef(null)

  const accesorios = useMemo(() => productos.filter(p => p.categoria === "accesorios"), [productos])
  const lista = useMemo(() => {
    const t = q.trim().toLowerCase()
    let l = accesorios.filter(p =>
      (!t || p.nombre.toLowerCase().includes(t) || p.marca.toLowerCase().includes(t) || (p.subcategoria || "").includes(t)) &&
      (!filtros.sub || p.subcategoria === filtros.sub) && (!filtros.marca || p.marca === filtros.marca) && p.precio <= filtros.precio)
    if (orden === "precio-asc") l = l.sort((a, b) => a.precio - b.precio)
    else if (orden === "precio-desc") l = l.sort((a, b) => b.precio - a.precio)
    else if (orden === "nombre") l = l.sort((a, b) => a.nombre.localeCompare(b.nombre))
    else l = l.sort((a, b) => b.popularidad - a.popularidad)
    return l
  }, [accesorios, q, filtros, orden])

  const elegirSub = sub => {
    setFiltros(f => ({ ...f, sub: f.sub === sub ? "" : sub }))
    catalogoRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const limpiar = () => { setFiltros(FILTROS_ACC_INICIAL); setQ(""); setOrden("popular") }

  return (
    <>
      <Hero modifier="accessories-hero" imagen={HERO_IMG} alt="Accesorios de ciclismo" eyebrow="Equipamiento completo">
        <h1>Todo para tu <span className="accent">seguridad</span> y comodidad</h1>
        <p className="lead">30 artículos entre cascos certificados, ropa técnica, luces, candados, hidratación, herramientas y componentes.</p>
        <div className="hero__cta">
          <a href="#catalogo-acc" className="btn btn--lg">Ver catálogo</a>
          <Button to="/mantenimiento" variant="ghost-light">Agendar mantenimiento</Button>
        </div>
      </Hero>

      <section className="section"><div className="container">
        <SectionHead kicker="Subcategorías" titulo="Explora por tipo de accesorio" />
        <SubTiles accesorios={accesorios} activa={filtros.sub} onSelect={elegirSub} />
      </div></section>

      <section id="catalogo-acc" ref={catalogoRef} className="section" style={{ paddingTop: 0 }}><div className="container">
        <div className="catalog-layout">
          <AccessoryFilters filtros={filtros} onChange={setFiltros} onClear={limpiar} />
          <div className="catalog-main">
            <SearchBox value={q} onChange={setQ} lista={accesorios} placeholder="Buscar casco, guantes, luz..." label="Buscar accesorios" />
            <div className="sort-bar">
              <span>{lista.length} {lista.length === 1 ? "accesorio encontrado" : "accesorios encontrados"}</span>
              <Select aria-label="Ordenar resultados" value={orden} onChange={e => setOrden(e.target.value)} options={ORDEN} />
            </div>
            <ProductGrid lista={lista} comparable id="accesorios-grid" />
          </div>
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <PromoBanner eyebrow="🎁 Pack recomendado" titulo="Equípate seguro: casco + luces + candado"
          texto="Los tres esenciales del ciclista urbano con envío gratis si superas $2.000.000 en tu pedido."
          cta={<a href="#catalogo-acc" className="btn btn--light">Armar mi pack</a>} badge="ENVÍO GRATIS" />
      </div></section>
    </>
  )
}
