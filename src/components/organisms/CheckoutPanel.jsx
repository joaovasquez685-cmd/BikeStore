import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormGroup from "../atoms/FormGroup"
import Button from "../atoms/Button"
import { useCart } from "../../hooks/useCart"
import { fmt } from "../../utils/format"
import { validarPago } from "../../utils/validators"
import { orderService } from "../../services"
import { useProducts } from "../../hooks/useProducts"
import { avisar } from "../../utils/notify"

/** Resumen del pedido + formulario de envío y pago simulado. Llama a orderService (hoy local, mañana REST). */
export default function CheckoutPanel({ onPagado }){
  const { items, subtotal, envio, total, vaciar } = useCart()
  const { refresh } = useProducts()
  const navigate = useNavigate()
  const [f, setF] = useState({ nombre: "", direccion: "", ciudad: "", telefono: "", titular: "", tarjeta: "", venc: "", cvv: "" })
  const [enviando, setEnviando] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const pagar = async e => {
    e.preventDefault()
    const err = validarPago({ titular: f.titular, tarjeta: f.tarjeta, vencimiento: f.venc, cvv: f.cvv })
    if (err) return avisar(err)
    setEnviando(true)
    try {
      const pedido = await orderService.create({
        items,
        direccion: { nombre: f.nombre, direccion: f.direccion, ciudad: f.ciudad, telefono: f.telefono },
        pago: { tarjeta: f.tarjeta },
      })
      vaciar()
      await refresh()          // el stock cambió: se vuelve a leer el catálogo
      onPagado(pedido)
    } catch (ex) {
      avisar(ex.message)
      if (ex.message.startsWith("🔒")) navigate("/login")
    } finally { setEnviando(false) }
  }

  return (
    <aside className="cart-summary">
      <h3>Resumen del Pedido</h3>
      <div className="summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
      <div className="summary-row"><span>Envío</span><span>{items.length ? (envio === 0 ? "¡Gratis! 🎉" : fmt(envio)) : "—"}</span></div>
      <div className="summary-row summary-total"><span>Total</span><span id="cart-total">{fmt(total)}</span></div>
      <form className="checkout-form" onSubmit={pagar}>
        <h4 style={{ margin: "20px 0 12px" }}>📦 Datos de envío</h4>
        <FormGroup label="Nombre completo" id="env-nombre" value={f.nombre} onChange={set("nombre")} required />
        <FormGroup label="Dirección" id="env-direccion" value={f.direccion} onChange={set("direccion")} required />
        <FormGroup label="Ciudad" id="env-ciudad" value={f.ciudad} onChange={set("ciudad")} required />
        <FormGroup label="Teléfono" id="env-telefono" type="tel" value={f.telefono} onChange={set("telefono")} required />
        <h4 style={{ margin: "20px 0 12px" }}>💳 Pago simulado</h4>
        <FormGroup label="Titular de la tarjeta" id="pago-titular" value={f.titular} onChange={set("titular")} required autoComplete="cc-name" />
        <FormGroup label="Número de tarjeta (16 dígitos)" id="pago-tarjeta" maxLength={19} placeholder="1234 5678 9012 3456" value={f.tarjeta} onChange={set("tarjeta")} required inputMode="numeric" autoComplete="cc-number" />
        <FormGroup label="Vencimiento (MM/AA)" id="pago-venc" placeholder="12/28" maxLength={5} value={f.venc} onChange={set("venc")} required autoComplete="cc-exp" />
        <FormGroup label="CVV" id="pago-cvv" maxLength={4} placeholder="123" value={f.cvv} onChange={set("cvv")} required inputMode="numeric" autoComplete="off" />
        <Button type="submit" size="lg" disabled={enviando || !items.length} style={{ width: "100%", marginTop: 16 }}>
          {enviando ? "Procesando…" : "Pagar y Confirmar Pedido"}
        </Button>
      </form>
    </aside>
  )
}
