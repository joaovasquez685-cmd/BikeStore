import { useState } from "react"
import { Link } from "react-router-dom"
import CartList from "../components/organisms/CartList"
import CheckoutPanel from "../components/organisms/CheckoutPanel"
import OrderConfirmation from "../components/organisms/OrderConfirmation"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { useAuth } from "../hooks/useAuth"
import { usePageMeta } from "../hooks/usePageMeta"

export default function Cart(){
  usePageMeta("Carrito y Pago | Veloce Bikes", "Revisa tu carrito, modifica cantidades y completa el pago simulado. Envío gratis en compras superiores a $2.000.000.")
  const { user } = useAuth()
  const [pedido, setPedido] = useState(null)

  /* Tras pagar solo queda la confirmación centrada (el original ocultaba el resto con un MutationObserver). */
  if (pedido) return (
    <section className="section"><div className="container">
      <div style={{ maxWidth: 760, margin: "24px auto 0", width: "100%" }}><OrderConfirmation pedido={pedido} /></div>
    </div></section>
  )

  return (
    <section className="section"><div className="container">
      <SectionHead kicker="Tu Carrito" titulo="Revisa tu pedido" descripcion="Modifica cantidades y completa el pago simulado." />
      <div className="cart-layout">
        <div><CartList /></div>
        {user ? <CheckoutPanel onPagado={setPedido} /> : (
          <aside className="cart-summary">
            <div className="confirm-card" style={{ boxShadow: "none", border: "none", padding: "8px 0" }}>
              <div style={{ fontSize: "3rem" }}>🔒</div>
              <h2 style={{ margin: "10px 0 6px" }}>Crea tu cuenta para continuar</h2>
              <p style={{ color: "#5B6472" }}>Para completar tu compra es obligatorio estar registrado.<br />Tu pedido, tu recibo y tus datos quedarán guardados en tu cuenta.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
                <Button to="/login" state={{ from: "/carrito" }}>📝 Crear cuenta</Button>
                <Button to="/login" variant="ghost" state={{ from: "/carrito" }}>Ya tengo cuenta</Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div></section>
  )
}
