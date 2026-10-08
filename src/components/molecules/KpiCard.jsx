export default function KpiCard({ titulo, valor, destacado = false }){
  return (
    <div className="kpi-card" style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: 20 }}>
      <p style={{ fontSize: ".8rem", color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".08em" }}>{titulo}</p>
      <b style={{ fontSize: "1.8rem", fontWeight: 800, ...(destacado ? { color: "var(--accent)" } : {}) }}>{valor}</b>
    </div>
  )
}
