import { useCallback, useEffect, useState } from "react"
import AdminOnly from "../components/templates/AdminOnly"
import AdminProductsPanel from "../components/organisms/AdminProductsPanel"
import AdminUsersPanel from "../components/organisms/AdminUsersPanel"
import AdminAppointmentsPanel from "../components/organisms/AdminAppointmentsPanel"
import AdminReceiptsPanel from "../components/organisms/AdminReceiptsPanel"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { orderService, appointmentService } from "../services"
import { usePageMeta } from "../hooks/usePageMeta"

const TABS = [["productos", "📦 Productos"], ["usuarios", "👥 Usuarios"], ["citas", "📅 Citas"], ["recibos", "🧾 Recibos"]]

function Contenido(){
  const [tab, setTab] = useState("productos")
  const [pedidos, setPedidos] = useState([])
  const [citas, setCitas] = useState([])
  const recargar = useCallback(async () => {
    setPedidos(await orderService.list()); setCitas(await appointmentService.list())
  }, [])
  useEffect(() => { recargar() }, [recargar])

  return (
    <section className="section"><div className="container">
      <SectionHead kicker="Panel de Administración" titulo="Gestión de la tienda" descripcion="Productos, usuarios, citas y recibos descargables.">
        <Button to="/dashboard" variant="ghost">📊 Ver Dashboard</Button>
      </SectionHead>
      <div className="admin-tabs">
        {TABS.map(([k, t]) => <Button key={k} variant={tab === k ? "primary" : "ghost"} onClick={() => setTab(k)}>{t}</Button>)}
      </div>
      {tab === "productos" && <AdminProductsPanel />}
      {tab === "usuarios" && <AdminUsersPanel />}
      {tab === "citas" && <AdminAppointmentsPanel citas={citas} onChange={recargar} />}
      {tab === "recibos" && <AdminReceiptsPanel pedidos={pedidos} citas={citas} onChange={recargar} />}
    </div></section>
  )
}

export default function Admin(){
  usePageMeta("Panel de Administración | Veloce Bikes", "Panel de administración exclusivo para gestionar productos, usuarios, citas y recibos de Veloce Bikes.")
  return <AdminOnly mensaje="Esta sección es exclusiva para usuarios con rol administrador."><Contenido /></AdminOnly>
}
