import { SUB_NOMBRES } from "./AccessoryFilters"

const SUB_ICONOS = { cascos: "🪖", guantes: "🧤", ropa: "👕", iluminacion: "💡", seguridad: "🔒", hidratacion: "💧", herramientas: "🛠️", componentes: "⚙️" }

export default function SubTiles({ accesorios, activa, onSelect }){
  return (
    <div className="sub-tiles">
      {Object.keys(SUB_NOMBRES).map(k => {
        const n = accesorios.filter(p => p.subcategoria === k).length
        return (
          <button key={k} type="button" className={`sub-tile${activa === k ? " active" : ""}`} onClick={() => onSelect(k)}>
            <span className="ico">{SUB_ICONOS[k]}</span><b>{SUB_NOMBRES[k]}</b><small>{n} artículo{n !== 1 ? "s" : ""}</small>
          </button>
        )
      })}
    </div>
  )
}
