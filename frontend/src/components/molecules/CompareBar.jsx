import { useCompare } from "../../hooks/useCompare"
import Button from "../atoms/Button"

export default function CompareBar(){
  const { ids, limpiar, setAbierto } = useCompare()
  if (!ids.length) return null
  return (
    <div className="compare-bar" id="compare-bar">
      <span>{ids.length} de 3 seleccionados</span>
      <Button onClick={() => setAbierto(true)}>Comparar</Button>
      <Button variant="ghost" onClick={limpiar}>Limpiar</Button>
    </div>
  )
}
