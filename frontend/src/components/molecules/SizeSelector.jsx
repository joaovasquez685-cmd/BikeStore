export default function SizeSelector({ tallas, selected, onSelect }){
  return (
    <div id="talla-options">
      {tallas.map(t => (
        <button key={t} type="button" className={`talla-btn${t === selected ? " selected" : ""}`} onClick={() => onSelect(t)}>{t}</button>
      ))}
    </div>
  )
}
