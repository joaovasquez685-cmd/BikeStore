import Button from "../components/atoms/Button"
import { usePageMeta } from "../hooks/usePageMeta"

export default function NotFound(){
  usePageMeta("Página no encontrada | Veloce Bikes")
  return (
    <section className="section"><div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: "4rem", marginBottom: 12 }}>🚲</div>
      <h2>Esta ruta no existe</h2>
      <p style={{ color: "var(--ink-soft)", margin: "16px 0 24px" }}>La página que buscas no está disponible.</p>
      <Button to="/" size="lg">Volver al inicio</Button>
    </div></section>
  )
}
