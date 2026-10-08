import Button from "../atoms/Button"
import { fmt } from "../../utils/format"
import { generarReciboPedido } from "../../utils/receipts"

export default function OrderConfirmation({ pedido }){
  return (
    <div className="confirm-card">
      <div style={{ fontSize: "3.2rem" }}>✅</div>
      <h2 style={{ margin: "10px 0 6px" }}>¡Pago procesado exitosamente!</h2>
      <p style={{ color: "#5B6472" }}>Tu pedido <strong style={{ color: "var(--accent)" }}>{pedido.id}</strong> quedó confirmado.<br />Recibirás el comprobante en tu correo (simulado).</p>
      <div className="confirm-box">
        <p><strong>Cliente:</strong> {pedido.usuarioNombre}</p>
        <p><strong>Envío a:</strong> {pedido.direccion.direccion}, {pedido.direccion.ciudad} · Tel: {pedido.direccion.telefono}</p>
        <p><strong>Pago:</strong> {pedido.pago.metodo} terminada en {pedido.pago.ultimos4}</p>
        <hr style={{ border: "none", borderTop: "1px dashed var(--line)", margin: "10px 0" }} />
        {pedido.items.map((i, k) => <p key={k}>{i.cantidad} × {i.nombre} (T {i.talla}, {i.color}) — {fmt(i.precio * i.cantidad)}</p>)}
        <hr style={{ border: "none", borderTop: "1px dashed var(--line)", margin: "10px 0" }} />
        <p style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ink)" }}>Total pagado: {fmt(pedido.total)}</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
        <Button onClick={() => generarReciboPedido(pedido)}>📄 Descargar recibo en PDF</Button>
        <Button to="/catalogo" variant="ghost">Seguir comprando</Button>
      </div>
    </div>
  )
}
