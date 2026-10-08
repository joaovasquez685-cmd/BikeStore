import { Link } from "react-router-dom"
import Logo from "../atoms/Logo"
import PayPills from "../molecules/PayPills"
import NewsletterForm from "../molecules/NewsletterForm"
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "../atoms/Icons"
import { useUi } from "../../hooks/useUi"

/**
 * variant:
 *  - "completo": inicio (redes, más enlaces)   - "tienda": catálogo, accesorios, producto, mantenimiento
 *  - "carrito": sin boletín y con más métodos de pago   - "minimo": login y paneles (solo línea inferior)
 */
export default function Footer({ variant = "tienda", leyenda }){
  const { abrirGuiaTallas } = useUi()
  const guia = <li><a href="#guia-tallas" onClick={e => { e.preventDefault(); abrirGuiaTallas() }}>Guía de tallas</a></li>
  const completo = variant === "completo"

  return (
    <footer className="footer">
      <div className="container">
        {variant !== "minimo" && (
          <>
            <div className="footer__grid">
              <div className="footer__brand">
                <Logo />
                <p>Tecnología y pasión sobre dos ruedas. Proyecto formativo SENA.</p>
                {completo && (
                  <div className="social">
                    <a href="#instagram" aria-label="Instagram"><InstagramIcon /></a>
                    <a href="#facebook" aria-label="Facebook"><FacebookIcon /></a>
                    <a href="#youtube" aria-label="YouTube"><YoutubeIcon /></a>
                  </div>
                )}
              </div>
              <div className="footer__col">
                <h3>Tienda</h3>
                <ul>
                  <li><Link to="/catalogo">Catálogo completo</Link></li>
                  {completo && <><li><Link to="/catalogo?cat=eléctrica">Eléctricas</Link></li><li><Link to="/catalogo?cat=montaña">Montaña</Link></li></>}
                  <li><Link to="/accesorios">Accesorios</Link></li>
                  <li><Link to="/mantenimiento">Mantenimiento</Link></li>
                  <li><Link to="/carrito">Mi carrito</Link></li>
                </ul>
              </div>
              <div className="footer__col">
                <h3>Ayuda</h3>
                <ul>
                  {variant !== "carrito" && guia}
                  <li><a href="#envios">Política de envíos</a></li>
                  <li><a href="#garantia">Garantía y devoluciones</a></li>
                  <li><a href="#contacto">Contacto</a></li>
                </ul>
              </div>
              {variant !== "carrito" && (
                <div className="footer__col">
                  <h3>Únete al pelotón</h3>
                  <p>Ofertas y guías de mantenimiento una vez al mes.</p>
                  <NewsletterForm />
                </div>
              )}
            </div>
            <PayPills metodos={variant === "carrito" ? ["VISA", "MasterCard", "PSE", "NEQUI", "Contraentrega"] : ["VISA", "PSE", "NEQUI"]} />
          </>
        )}
        <div className="footer__bottom">
          <p>© 2026 Veloce Bikes — Proyecto formativo SENA.</p>
          <p>{leyenda || "Hecho con React + Vite · Arquitectura atómica"}</p>
        </div>
      </div>
    </footer>
  )
}
