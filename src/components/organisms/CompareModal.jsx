import Modal from "../molecules/Modal"
import { useCompare } from "../../hooks/useCompare"
import { useProducts } from "../../hooks/useProducts"
import { CAT_NOMBRES, fmt } from "../../utils/format"

const FILAS = [
  ["Precio", p => fmt(p.precio)], ["Categoría", p => CAT_NOMBRES[p.categoria] || p.categoria], ["Marca", p => p.marca],
  ["Cuadro", p => p.specs.cuadro || "—"], ["Frenos", p => p.specs.frenos || "—"], ["Rueda", p => p.specs.rueda || "—"],
  ["Velocidades", p => p.specs.velocidades || "—"], ["Peso", p => p.specs.peso || "—"], ["Carga máx.", p => p.specs.cargaMax || "—"],
  ["Stock", p => (p.stock <= 0 ? "Agotado" : p.stock + " u.")],
]

export default function CompareModal(){
  const { ids, abierto, setAbierto } = useCompare()
  const { productos } = useProducts()
  if (!abierto) return null
  const ps = ids.map(id => productos.find(p => p.id === id)).filter(Boolean)
  return (
    <Modal titulo="Comparar productos" onClose={() => setAbierto(false)}>
      <div className="table-scroll">
        <table className="specs-table compare-table">
          <thead><tr><th scope="col" />{ps.map(p => <th key={p.id} scope="col">{p.nombre}</th>)}</tr></thead>
          <tbody>
            {FILAS.map(([n, f]) => <tr key={n}><th scope="row">{n}</th>{ps.map(p => <td key={p.id}>{f(p)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
