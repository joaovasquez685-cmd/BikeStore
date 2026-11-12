import Button from "../atoms/Button"
import { useAuth } from "../../hooks/useAuth"

/** Guard de rol para las pantallas de administración (en producción la autorización real la hace el backend). */
export default function AdminOnly({ mensaje, children }){
  const { isAdmin, ready } = useAuth()
  if (!ready) return null
  if (isAdmin) return children
  return (
    <section className="section"><div className="container">
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "4rem", marginBottom: 20 }}>🔒</div>
        <h2>Acceso restringido</h2>
        <p style={{ color: "var(--ink-soft)", margin: "16px 0 24px" }}>{mensaje}</p>
        <Button to="/login" size="lg">Iniciar sesión</Button>
      </div>
    </div></section>
  )
}
