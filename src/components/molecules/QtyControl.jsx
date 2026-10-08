export default function QtyControl({ cantidad, onChange, nombre }){
  return (
    <div className="qty" aria-label={`Cantidad de ${nombre}`}>
      <button type="button" onClick={() => onChange(-1)} aria-label="Disminuir cantidad">−</button>
      <span>{cantidad}</span>
      <button type="button" onClick={() => onChange(1)} aria-label="Aumentar cantidad">+</button>
    </div>
  )
}
