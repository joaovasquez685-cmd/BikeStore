import { useState } from "react"
import AdminOnly from "../components/templates/AdminOnly"
import AdminProductsPanel from "../components/organisms/AdminProductsPanel"
import AdminUsersPanel from "../components/organisms/AdminUsersPanel"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { usePageMeta } from "../hooks/usePageMeta"

const TABS = [["productos", "📦 Productos"], ["usuarios", "👥 Usuarios"]]

function Contenido(){
  const [tab, setTab] = useState("productos")

  return (
    <section className="section"><div className="container">
      <SectionHead kicker="Panel de Administración" titulo="Gestión de la tienda" descripcion="Productos y usuarios.">
        <Button to="/dashboard" variant="ghost">📊 Ver Dashboard</Button>
      </SectionHead>
      <div className="admin-tabs">
        {TABS.map(([k, t]) => <Button key={k} variant={tab === k ? "primary" : "ghost"} onClick={() => setTab(k)}>{t}</Button>)}
      </div>
      {tab === "productos" && <AdminProductsPanel />}
      {tab === "usuarios" && <AdminUsersPanel />}
    </div></section>
  )
}

export default function Admin(){
  usePageMeta("Panel de Administración | Veloce Bikes", "Panel de administración exclusivo para gestionar productos y usuarios de Veloce Bikes.")
  return <AdminOnly mensaje="Esta sección es exclusiva para usuarios con rol administrador."><Contenido /></AdminOnly>
}