import FilterField from "../molecules/FilterField"
import Select from "../atoms/Select"
import Button from "../atoms/Button"

export const FILTROS_ACC_INICIAL = { sub: "", marca: "", precio: 600000 }
export const SUB_NOMBRES = { cascos: "Cascos", guantes: "Guantes", ropa: "Ropa", iluminacion: "Iluminación", seguridad: "Seguridad", hidratacion: "Hidratación", herramientas: "Herramientas", componentes: "Componentes" }
const SUBS = Object.entries(SUB_NOMBRES).map(([value, label]) => ({ value, label }))
const MARCAS = ["Veloce", "Specialized", "Trek", "GW", "Shimano", "Park Tool", "CamelBak"]

export default function AccessoryFilters({ filtros, onChange, onClear }){
  const set = campo => e => onChange({ ...filtros, [campo]: e.target.value })
  return (
    <aside className="filters">
      <h3>Filtros</h3>
      <FilterField label="Subcategoría" id="filtro-sub"><Select id="filtro-sub" value={filtros.sub} onChange={set("sub")} options={SUBS} placeholder="Todas" /></FilterField>
      <FilterField label="Marca" id="filtro-marca-acc"><Select id="filtro-marca-acc" value={filtros.marca} onChange={set("marca")} options={MARCAS} placeholder="Todas" /></FilterField>
      <FilterField label="Precio máximo" id="filtro-precio-acc">
        <input type="range" id="filtro-precio-acc" min="20000" max="600000" step="10000" value={filtros.precio}
          onChange={e => onChange({ ...filtros, precio: Number(e.target.value) })} />
        <div className="price-range"><span>Hasta: ${Number(filtros.precio).toLocaleString("es-CO")}</span></div>
      </FilterField>
      <Button variant="ghost" onClick={onClear} style={{ width: "100%" }}>Limpiar filtros</Button>
    </aside>
  )
}
