import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import BikeFilters, { FILTROS_BICI_INICIAL } from "../components/organisms/BikeFilters"
import ProductGrid from "../components/organisms/ProductGrid"
import SearchBox from "../components/molecules/SearchBox"
import SectionHead from "../components/molecules/SectionHead"
import Select from "../components/atoms/Select"
import { useProducts } from "../hooks/useProducts"
import { usePageMeta } from "../hooks/usePageMeta"

const ORDEN = [
  { value: "popular", label: "Más populares" }, { value: "novedad", label: "Novedades" },
  { value: "precio-asc", label: "Precio: menor a mayor" }, { value: "precio-desc", label: "Precio: mayor a menor" },
]

export default function Catalog(){
  usePageMeta("Catálogo de Bicicletas | Veloce Bikes", "Catálogo completo de bicicletas Veloce Bikes. Montaña, ruta, urbana, eléctrica, BMX e infantil. Filtros combinados, comparador y envío a todo Colombia.")
  const { productos } = useProducts()
  const [params] = useSearchParams()
  const [filtros, setFiltros] = useState({ ...FILTROS_BICI_INICIAL, cat: params.get("cat") || "" })
  const [q, setQ] = useState("")
  const [orden, setOrden] = useState("popular")

  /* Los enlaces del inicio (/catalogo?cat=ruta) cambian la categoría aunque ya estemos en el catálogo. */
  useEffect(() => { setFiltros(f => ({ ...f, cat: params.get("cat") || "" })) }, [params])

  const bicis = useMemo(() => productos.filter(p => p.categoria !== "accesorios"), [productos])
  const lista = useMemo(() => {
    const t = q.trim().toLowerCase()
    let l = bicis.filter(p =>
      (!t || p.nombre.toLowerCase().includes(t) || p.marca.toLowerCase().includes(t) || p.categoria.includes(t)) &&
      (!filtros.cat || p.categoria === filtros.cat) && (!filtros.marca || p.marca === filtros.marca) &&
      p.precio <= filtros.precio && (!filtros.talla || p.tallas.includes(filtros.talla)) &&
      (!filtros.color || p.nombresColores.includes(filtros.color)) && (!filtros.frenos || p.specs?.frenos === filtros.frenos))
    if (orden === "novedad") l = l.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    else if (orden === "precio-asc") l = l.sort((a, b) => a.precio - b.precio)
    else if (orden === "precio-desc") l = l.sort((a, b) => b.precio - a.precio)
    else l = l.sort((a, b) => b.popularidad - a.popularidad)
    return l
  }, [bicis, q, filtros, orden])

  const limpiar = () => { setFiltros(FILTROS_BICI_INICIAL); setQ(""); setOrden("popular") }

  return (
    <section className="section"><div className="container">
      <SectionHead kicker="Catálogo" titulo="Encuentra tu bici ideal"
        descripcion={<>20 modelos en 6 categorías · ¿Buscas cascos o repuestos? <Link to="/accesorios" style={{ color: "var(--accent)", fontWeight: 600 }}>Ver accesorios →</Link></>} />
      <div className="catalog-layout">
        <BikeFilters filtros={filtros} onChange={setFiltros} onClear={limpiar} />
        <div className="catalog-main">
          <SearchBox value={q} onChange={setQ} lista={bicis} placeholder="Buscar por nombre, marca o categoría..." label="Buscar productos" />
          <div className="sort-bar">
            <span>{lista.length} {lista.length === 1 ? "bicicleta encontrada" : "bicicletas encontradas"}</span>
            <Select aria-label="Ordenar resultados" value={orden} onChange={e => setOrden(e.target.value)} options={ORDEN} />
          </div>
          <ProductGrid lista={lista} comparable id="product-grid" />
        </div>
      </div>
    </div></section>
  )
}
