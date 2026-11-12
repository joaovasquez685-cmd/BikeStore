import { Link } from "react-router-dom"
import ProductImage from "../atoms/ProductImage"
import cityCommuter from "../../assets/img/city-commuter.png"
import { useProducts } from "../../hooks/useProducts"

const IMG = "https://image.qwenlm.ai/public_source/c4e4968e-2348-4ce3-95ae-1397f6d95640/"
const CATEGORIAS = [
  { cat: "montaña", titulo: "Montaña", alt: "Bicicletas de montaña", img: IMG + "5c3569782-1f9f-49fd-a96f-cf9d7962e9602128.png" },
  { cat: "ruta", titulo: "Ruta", alt: "Bicicletas de ruta", img: IMG + "1c3569782-1f9f-49fd-a96f-cf9d7962e9609134.png" },
  { cat: "urbana", titulo: "Urbana", alt: "Bicicletas urbanas", img: cityCommuter },
  { cat: "eléctrica", titulo: "Eléctrica", alt: "Bicicletas eléctricas", img: IMG + "3c3569782-1f9f-49fd-a96f-cf9d7962e9607739.png" },
  { cat: "bmx", titulo: "BMX", alt: "Bicicletas BMX", img: IMG + "1c3569782-1f9f-49fd-a96f-cf9d7962e9601054.png" },
  { cat: "infantil", titulo: "Infantil", alt: "Bicicletas infantiles", img: IMG + "0c3569782-1f9f-49fd-a96f-cf9d7962e9608494.png" },
]

/** El contador de modelos ahora sale del catálogo real (antes estaba escrito a mano en el HTML). */
export default function CategoryGrid(){
  const { productos } = useProducts()
  return (
    <div className="cat-grid">
      {CATEGORIAS.map(c => {
        const n = productos.filter(p => p.categoria === c.cat).length
        return (
          <Link key={c.cat} to={`/catalogo?cat=${c.cat}`} className="cat-tile">
            <ProductImage src={c.img} alt={c.alt} loading="lazy" />
            <div className="cat-tile__overlay" />
            <div className="cat-tile__label"><h3>{c.titulo}</h3><small>{n} modelo{n !== 1 ? "s" : ""}</small></div>
          </Link>
        )
      })}
    </div>
  )
}
