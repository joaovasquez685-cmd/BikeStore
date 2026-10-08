import { Link, NavLink } from "react-router-dom"
import Logo from "../atoms/Logo"
import { CartIcon } from "../atoms/Icons"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../hooks/useCart"

const ENLACES = [
  { to: "/", texto: "Inicio", end: true },
  { to: "/catalogo", texto: "Catálogo" },
  { to: "/accesorios", texto: "Accesorios" },
  { to: "/mantenimiento", texto: "Mantenimiento" },
]

function SesionNav(){
  const { user, isAdmin, logout } = useAuth()
  const liStyle = { display: "flex", alignItems: "center", gap: 10, fontSize: ".88rem", whiteSpace: "nowrap" }
  if (!user) return <li style={liStyle}><Link to="/login" style={{ fontWeight: 600, color: "var(--accent)" }}>Ingresar</Link></li>
  return (
    <li style={liStyle}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, color: "var(--ink)" }}>
        👤 {user.nombre.split(" ")[0]}
        {isAdmin && <span className="admin-pill">ADMIN</span>}
      </span>
      {isAdmin && <Link to="/admin" className="panel-link">Panel</Link>}
      <button type="button" className="logout-btn" onClick={logout}>Salir</button>
    </li>
  )
}

export default function Header(){
  const { count } = useCart()
  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />
        <nav className="nav">
          <ul className="nav__list">
            {ENLACES.map(l => (
              <li key={l.to}><NavLink to={l.to} end={l.end} className="nav__link">{l.texto}</NavLink></li>
            ))}
            <li>
              <NavLink to="/carrito" className="cart-icon" aria-label="Ver carrito">
                <CartIcon /><span className="cart-count" id="cart-count">{count}</span>
              </NavLink>
            </li>
            <SesionNav />
          </ul>
        </nav>
      </div>
    </header>
  )
}
