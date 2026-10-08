import { Link } from "react-router-dom"

export default function Breadcrumbs({ categoria, nombre }){
  const esAcc = categoria === "accesorios"
  return (
    <nav aria-label="Migas de pan" className="breadcrumbs">
      <Link to="/">Inicio</Link>
      <span className="breadcrumbs__sep">›</span>
      <Link to={esAcc ? "/accesorios" : "/catalogo"}>{esAcc ? "Accesorios" : "Catálogo"}</Link>
      <span className="breadcrumbs__sep">›</span>
      <span aria-current="page">{nombre}</span>
    </nav>
  )
}
