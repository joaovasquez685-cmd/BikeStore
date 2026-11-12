import { useEffect, useRef, useState } from "react"

/**
 * Dropdown personalizado y animado (antes: vanilla JS con setInterval de 300 ms).
 * Mantiene un <select> real oculto para conservar la validación `required` del formulario.
 */
export default function VSelect({ id, value, onChange, options, placeholder = "", required = false }){
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fuera = e => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false) }
    const esc = e => { if (e.key === "Escape") setAbierto(false) }
    document.addEventListener("click", fuera)
    document.addEventListener("keydown", esc)
    return () => { document.removeEventListener("click", fuera); document.removeEventListener("keydown", esc) }
  }, [])

  const todas = [{ value: "", label: placeholder }, ...options]
  const elegida = todas.find(o => o.value === value)

  return (
    <div className={`vselect${abierto ? " is-open" : ""}`} ref={ref}>
      <select id={id} value={value} required={required} onChange={e => onChange(e.target.value)} tabIndex={-1} aria-hidden="true">
        {todas.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button type="button" className="vselect__btn" aria-haspopup="listbox" aria-expanded={abierto} onClick={() => setAbierto(a => !a)}>
        <span className={`vselect__label${value ? "" : " is-placeholder"}`}>{elegida ? elegida.label : ""}</span>
        <span className="vselect__arrow" />
      </button>
      <div className="vselect__panel" role="listbox">
        {todas.map(o => (
          <button key={o.value} type="button" role="option" aria-selected={o.value === value}
            className={`vselect__option${o.value === value ? " is-selected" : ""}`}
            onClick={() => { onChange(o.value); setAbierto(false) }}>
            <span className="vselect__check">{o.value === value ? "✓" : ""}</span>{o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
