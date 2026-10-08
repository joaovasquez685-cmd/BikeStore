import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom"
import MainLayout from "../components/templates/MainLayout"
import Home from "../pages/Home"
import Catalog from "../pages/Catalog"
import Accessories from "../pages/Accessories"
import ProductDetail from "../pages/ProductDetail"
import Cart from "../pages/Cart"
import Login from "../pages/Login"
import Maintenance from "../pages/Maintenance"
import NotFound from "../pages/NotFound"

/* El panel y el dashboard se cargan bajo demanda: los clientes nunca descargan ese código. */
const Admin = lazy(() => import("../pages/Admin"))
const Dashboard = lazy(() => import("../pages/Dashboard"))

/** Compatibilidad con los enlaces antiguos: /producto.html?id=xxx → /producto/xxx */
function LegacyProducto(){
  const [sp] = useSearchParams()
  const id = sp.get("id")
  return <Navigate to={id ? `/producto/${id}` : "/catalogo"} replace />
}

export default function AppRouter(){
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/accesorios" element={<Accessories />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mantenimiento" element={<Maintenance />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* URLs del sitio HTML original */}
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/catalogo.html" element={<Navigate to="/catalogo" replace />} />
            <Route path="/accesorios.html" element={<Navigate to="/accesorios" replace />} />
            <Route path="/carrito.html" element={<Navigate to="/carrito" replace />} />
            <Route path="/login.html" element={<Navigate to="/login" replace />} />
            <Route path="/mantenimiento.html" element={<Navigate to="/mantenimiento" replace />} />
            <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
            <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />
            <Route path="/producto.html" element={<LegacyProducto />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
