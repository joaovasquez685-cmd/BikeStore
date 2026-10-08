import AdminOnly from "../components/templates/AdminOnly"
import DashboardPanel from "../components/organisms/DashboardPanel"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { usePageMeta } from "../hooks/usePageMeta"

export default function Dashboard(){
  usePageMeta("Dashboard e Informes | Veloce Bikes", "Dashboard e informes gerenciales. Métricas de ventas, pedidos y stock.")
  return (
    <AdminOnly mensaje="El tablero de control es exclusivo del rol administrador.">
      <section className="section"><div className="container">
        <SectionHead kicker="Tablero de Control" titulo="Dashboard e Informes" descripcion="Métricas de la operación comercial.">
          <Button to="/admin" variant="ghost">← Volver al panel</Button>
        </SectionHead>
        <DashboardPanel />
      </div></section>
    </AdminOnly>
  )
}
