import Tag from "../atoms/Tag"
import { generarReciboCita } from "../../utils/receipts"
import { avisar } from "../../utils/notify"
import { appointmentService } from "../../services"

export default function AdminAppointmentsPanel({ citas, onChange }){
  const cambiar = async (id, estado) => {
    try { await appointmentService.setEstado(id, estado); await onChange(); avisar(`Cita ${id} marcada como ${estado}.`) }
    catch (e) { avisar(e.message) }
  }
  return (
    <div className="table-scroll">
      <table className="specs-table">
        <thead><tr><th>ID</th><th>Cliente</th><th>Servicio</th><th>Fecha y hora</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {citas.length ? citas.map(c => (
            <tr key={c.id}>
              <td><small>{c.id}</small></td>
              <td><strong>{c.nombre}</strong><br /><small>{c.telefono}</small></td>
              <td>{c.nombreServicio}</td>
              <td>{c.fechaPreferida} · {c.hora}</td>
              <td><Tag tone={c.estado === "pendiente" ? "off" : "on"}>{c.estado}</Tag></td>
              <td><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button type="button" className="mini-btn" onClick={() => cambiar(c.id, "confirmada")}>✅ Confirmar</button>
                <button type="button" className="mini-btn" onClick={() => cambiar(c.id, "cancelada")}>❌ Cancelar</button>
                <button type="button" className="mini-btn" onClick={() => generarReciboCita(c)}>📄 PDF</button>
              </div></td>
            </tr>
          )) : <tr><td colSpan="6" style={{ textAlign: "center", padding: 24, color: "var(--ink-soft)" }}>No hay citas agendadas.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
