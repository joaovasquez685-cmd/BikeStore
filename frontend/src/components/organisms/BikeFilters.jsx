import FilterField from "../molecules/FilterField"
import Select from "../atoms/Select"
import Button from "../atoms/Button"

export const FILTROS_BICI_INICIAL = { cat: "", marca: "", precio: 13000000, talla: "", color: "", frenos: "" }

const CATS = [["montaña", "Montaña"], ["ruta", "Ruta"], ["urbana", "Urbana"], ["eléctrica", "Eléctrica"], ["bmx", "BMX"], ["infantil", "Infantil"]].map(([value, label]) => ({ value, label }))
const MARCAS = ["Veloce", "Trek", "Specialized", "GW", "Oxford"]
const TALLAS = ["S", "M", "L", "XL", "48", "52", "54", "56", "Única"]
const COLORES = ["Negro", "Blanco", "Rojo", "Azul", "Verde", "Gris", "Naranja", "Vino tinto"]
const FRENOS = ["Disco hidráulico", "Disco mecánico", "V-Brake", "U-Brake", "Zapata"]

export default function BikeFilters({ filtros, onChange, onClear }){
  const set = campo => e => onChange({ ...filtros, [campo]: e.target.value })
  return (
    <aside className="filters">
      <h3>Filtros</h3>
      <FilterField label="Categoría" id="filtro-cat"><Select id="filtro-cat" value={filtros.cat} onChange={set("cat")} options={CATS} placeholder="Todas" /></FilterField>
      <FilterField label="Marca" id="filtro-marca"><Select id="filtro-marca" value={filtros.marca} onChange={set("marca")} options={MARCAS} placeholder="Todas" /></FilterField>
      <FilterField label="Precio máximo" id="filtro-precio">
        <input type="range" id="filtro-precio" min="500000" max="13000000" step="100000" value={filtros.precio}
          onChange={e => onChange({ ...filtros, precio: Number(e.target.value) })} />
        <div className="price-range"><span>Hasta: ${Number(filtros.precio).toLocaleString("es-CO")}</span></div>
      </FilterField>
      <FilterField label="Talla" id="filtro-talla"><Select id="filtro-talla" value={filtros.talla} onChange={set("talla")} options={TALLAS} placeholder="Todas" /></FilterField>
      <FilterField label="Color" id="filtro-color"><Select id="filtro-color" value={filtros.color} onChange={set("color")} options={COLORES} placeholder="Todos" /></FilterField>
      <FilterField label="Tipo de frenos" id="filtro-frenos"><Select id="filtro-frenos" value={filtros.frenos} onChange={set("frenos")} options={FRENOS} placeholder="Todos" /></FilterField>
      <Button variant="ghost" onClick={onClear} style={{ width: "100%" }}>Limpiar filtros</Button>
    </aside>
  )
}
