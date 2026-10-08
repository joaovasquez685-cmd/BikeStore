import { useState } from "react"
import { CAT_NOMBRES } from "../../utils/format"

/** Buscador con autocompletado (2+ letras, máx. 6 sugerencias). `lista` = productos sobre los que sugerir. */
export default function SearchBox({ value, onChange, lista, placeholder, label }){
  const [abierto, setAbierto] = useState(false)
  const q = value.trim().toLowerCase()
  const sugerencias = q.length < 2 ? [] : lista.filter(p =>
    p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q) || p.categoria.includes(q) || (p.subcategoria || "").includes(q)).slice(0, 6)

  return (
    <div className="search-box">
      <input type="search" id="search-input" value={value} placeholder={placeholder} aria-label={label}
        onChange={e => { onChange(e.target.value); setAbierto(true) }} onBlur={() => setTimeout(() => setAbierto(false), 150)} />
      {abierto && sugerencias.length > 0 && (
        <ul className="suggestions">
          {sugerencias.map(p => (
            <li key={p.id}>
              <button type="button" onMouseDown={() => { onChange(p.nombre); setAbierto(false) }}>
                {p.nombre} <small>· {CAT_NOMBRES[p.categoria] || p.categoria}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
