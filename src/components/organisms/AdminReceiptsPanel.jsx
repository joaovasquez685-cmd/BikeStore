import { fmt } from "../../utils/format"
import { generarReciboPedido, generarReciboCita } from "../../utils/receipts"
import { orderService, appointmentService } from "../../services"
import { avisar, confirmar } from "../../utils/notify"

const btnBorrar = { borderColor: "var(--bad)", color: "var(--bad)" }
const vacio = (n, txt) => <tr><td colSpan={n} style={{ textAlign: "center", padding: 24, color: "var(--ink-soft)" }}>{txt}</td></tr>

export default function AdminReceiptsPanel({ pedidos, citas, onChange }){
  const borrarPedido = async id => {
    if (!confirmar(`⚠️ ¿Eliminar DEFINITIVAMENTE el recibo de venta ${id}?\nEsta acción no se puede deshacer.`)) return
    try { await orderService.remove(id); await onChange(); avisar(`✅ Recibo ${id} eliminado del historial.`) } catch (e) { avisar(e.message) }
  }
  const borrarCita = async id => {
    if (!confirmar(`⚠️ ¿Eliminar DEFINITIVAMENTE el comprobante de cita ${id}?\nEsta acción no se puede deshacer.`)) return
    try { await appointmentService.remove(id); await onChange(); avisar(`✅ Comprobante ${id} eliminado del historial.`) } catch (e) { avisar(e.message) }
  }

  return (
    <div>
      <div className="info-card" style={{ marginBottom: 24 }}>
        <h3>🗄️ Historial permanente de recibos</h3>
        <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginTop: 6 }}>
          Cada venta y cada cita quedan guardadas en el sistema. Pulsa <strong>📄 PDF</strong> en cualquier fila para regenerar y descargar el recibo cuando lo necesites, incluso días después.
        </p>
      </div>

      <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>🛒 Recibos de venta (pedidos)</h3>
      <div className="table-scroll" style={{ marginBottom: 32 }}>
        <table className="specs-table">
          <thead><tr><th>N° Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Recibo</th><th>Eliminar</th></tr></thead>
          <tbody>
            {pedidos.length ? pedidos.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td><td>{new Date(o.fecha).toLocaleString("es-CO")}</td><td>{o.usuarioNombre}</td><td>{fmt(o.total)}</td>
                <td><button type="button" className="mini-btn" onClick={() => generarReciboPedido(o)}>📄 PDF</button></td>
                <td><button type="button" className="mini-btn" style={btnBorrar} onClick={() => borrarPedido(o.id)}>🗑️ Eliminar</button></td>
              </tr>
            )) : vacio(6, "Aún no hay ventas registradas.")}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>🔧 Recibos de citas (mantenimiento)</h3>
      <div className="table-scroll">
        <table className="specs-table">
          <thead><tr><th>N° Cita</th><th>Fecha cita</th><th>Cliente</th><th>Servicio</th><th>Total est.</th><th>Recibo</th><th>Eliminar</th></tr></thead>
          <tbody>
            {citas.length ? citas.map(c => (
              <tr key={c.id}>
                <td><strong>{c.id}</strong></td><td>{c.fechaPreferida} · {c.hora}</td><td>{c.nombre}</td><td>{c.nombreServicio}</td><td>{fmt(c.totalEstimado)}</td>
                <td><button type="button" className="mini-btn" onClick={() => generarReciboCita(c)}>📄 PDF</button></td>
                <td><button type="button" className="mini-btn" style={btnBorrar} onClick={() => borrarCita(c.id)}>🗑️ Eliminar</button></td>
              </tr>
            )) : vacio(7, "Aún no hay citas registradas.")}
          </tbody>
        </table>
      </div>
    </div>
  )
}
