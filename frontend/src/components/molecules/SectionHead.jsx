export default function SectionHead({ kicker, titulo, descripcion, id, children }){
  return (
    <div className="section-head" id={id}>
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2>{titulo}</h2>
        {descripcion && <p style={{ color: "var(--ink-soft)", marginTop: 8 }}>{descripcion}</p>}
      </div>
      {children}
    </div>
  )
}
