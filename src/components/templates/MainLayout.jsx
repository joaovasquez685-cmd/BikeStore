import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "../organisms/Header"
import Footer from "../organisms/Footer"
import CompareBar from "../molecules/CompareBar"
import CompareModal from "../organisms/CompareModal"
import SizeGuideModal from "../organisms/SizeGuideModal"

const FOOTER_POR_RUTA = { "/": "completo", "/carrito": "carrito", "/login": "minimo", "/admin": "minimo", "/dashboard": "minimo" }
const LEYENDA_ADMIN = { "/admin": "Panel administrativo · Acceso por rol", "/dashboard": "Informes gerenciales · Solo administradores" }

/** Plantilla común: header + contenido de la ruta + footer + barras/modales globales. */
export default function MainLayout(){
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer variant={FOOTER_POR_RUTA[pathname] || "tienda"} leyenda={LEYENDA_ADMIN[pathname]} />
      <CompareBar />
      <CompareModal />
      <SizeGuideModal />
    </>
  )
}
