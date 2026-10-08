export default function ColorSwatches({ colores, nombres, stocks, selected, onSelect }){
  return (
    <div className="color-options" id="color-options">
      {colores.map((c, i) => {
        const agotado = (stocks[i] || 0) <= 0
        return (
          <button key={c + i} type="button" className={`color-swatch${i === selected ? " selected" : ""}`}
            style={{ background: c, ...(agotado ? { opacity: .35 } : {}) }}
            title={`${nombres[i]}${agotado ? " (agotado)" : ""}`} aria-label={`Color ${nombres[i]}`} onClick={() => onSelect(i)} />
        )
      })}
    </div>
  )
}
