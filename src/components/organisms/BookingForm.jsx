import { useMemo, useState } from "react"
import FormGroup from "../atoms/FormGroup"
import VSelect from "../atoms/VSelect"
import Button from "../atoms/Button"
import { PRECIOS_SERVICIOS, NOMBRES_SERVICIOS, EXTRAS, HORAS } from "../../data/services"
import { appointmentService } from "../../services"
import { fmt, fechaLocalISO } from "../../utils/format"
import { generarReciboCita } from "../../utils/receipts"
import { avisar, confirmar } from "../../utils/notify"

const TIPOS_BICI = ["Montaña", "Ruta", "Urbana", "Eléctrica", "BMX", "Infantil", "Otra"].map(v => ({ value: v, label: v }))
const SERVICIOS = [
  { value: "basico", label: "Mantenimiento Básico - $45.000" },
  { value: "completo", label: "Mantenimiento Completo - $95.000" },
  { value: "mayor", label: "Reparación Mayor - desde $150.000" },
  { value: "diagnostico", label: "Solo Diagnóstico - $25.000" },
]
const URGENCIAS = [{ value: "normal", label: "Normal" }, { value: "prioritario", label: "Prioritario + $20.000" }]
const VACIO = { nombre: "", telefono: "", correo: "", ciudad: "", tipoBici: "", marcaBici: "", descripcion: "", servicio: "", urgencia: "normal", fecha: "", hora: "", limpieza: false, recogida: false, entrega: false }

function minFecha(){ const d = new Date(); d.setDate(d.getDate() + 1); return fechaLocalISO(d) }

export default function BookingForm({ servicio, onServicio }){
  const [f, setF] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value })
  const sv = servicio ?? f.servicio          // el servicio puede venir de las tarjetas (estado elevado)
  const cambiarServicio = v => { setF(prev => ({ ...prev, servicio: v })); onServicio(v) }

  const { extras, total } = useMemo(() => {
    const ex = []
    if (f.urgencia === "prioritario") ex.push(EXTRAS.prioritario)
    if (f.limpieza) ex.push(EXTRAS.limpieza)
    if (f.recogida) ex.push(EXTRAS.recogida)
    if (f.entrega) ex.push(EXTRAS.entrega)
    return { extras: ex, total: (PRECIOS_SERVICIOS[sv] || 0) + ex.reduce((s, x) => s + x.valor, 0) }
  }, [sv, f.urgencia, f.limpieza, f.recogida, f.entrega])

  const enviar = async e => {
    e.preventDefault()
    if (!sv) return avisar("⚠️ Selecciona un tipo de servicio.")
    if (!f.fecha || !f.hora) return avisar("⚠️ Selecciona fecha y hora para la cita.")
    setEnviando(true)
    try {
      const cita = await appointmentService.create({
        nombre: f.nombre.trim(), telefono: f.telefono.trim(), correo: f.correo.trim(), ciudad: f.ciudad.trim(),
        tipoBici: f.tipoBici, marcaBici: f.marcaBici.trim(), descripcion: f.descripcion.trim(),
        tipoServicio: sv, nombreServicio: NOMBRES_SERVICIOS[sv], urgencia: f.urgencia,
        extras: extras.map(x => x.texto), fechaPreferida: f.fecha, hora: f.hora, totalEstimado: total,
      })
      avisar(`✅ Cita agendada correctamente.\n\nNúmero de cita: ${cita.id}\nServicio: ${cita.nombreServicio}\nFecha: ${cita.fechaPreferida} a las ${cita.hora}\nTotal estimado: ${fmt(cita.totalEstimado)}`)
      if (confirmar("🧾 ¿Deseas descargar el recibo de tu cita en PDF?")) generarReciboCita(cita)
      setF(VACIO); onServicio("")
    } catch (ex) { avisar(ex.message) } finally { setEnviando(false) }
  }

  return (
    <form id="form-cita" className="booking-form" onSubmit={enviar}>
      <div className="form-section">
        <h3>👤 Datos del cliente</h3>
        <div className="form-grid">
          <FormGroup label="Nombre completo *" id="nombre" required placeholder="Ej: Juan Pérez" value={f.nombre} onChange={set("nombre")} />
          <FormGroup label="Teléfono *" id="telefono" type="tel" required placeholder="Ej: 3001234567" value={f.telefono} onChange={set("telefono")} />
          <FormGroup label="Correo electrónico" id="correo" type="email" placeholder="Ej: correo@dominio.com" value={f.correo} onChange={set("correo")} />
          <FormGroup label="Ciudad" id="ciudad" placeholder="Ej: Palmira" value={f.ciudad} onChange={set("ciudad")} />
        </div>
      </div>

      <div className="form-section">
        <h3>🚲 Datos de la bicicleta</h3>
        <div className="form-grid">
          <FormGroup label="Tipo de bicicleta *" id="tipo-bici"><VSelect id="tipo-bici" required value={f.tipoBici} onChange={v => setF({ ...f, tipoBici: v })} options={TIPOS_BICI} placeholder="Selecciona una opción" /></FormGroup>
          <FormGroup label="Marca / Modelo" id="marca-bici" placeholder="Ej: Veloce Trailblazer X1" value={f.marcaBici} onChange={set("marcaBici")} />
        </div>
        <FormGroup style={{ marginTop: 16 }} label="Describe el problema o solicitud" id="descripcion" as="textarea" rows={4}
          placeholder="Ej: los cambios saltan, los frenos suenan, necesita limpieza, etc." value={f.descripcion} onChange={set("descripcion")} />
      </div>

      <div className="form-section">
        <h3>🧰 Servicio requerido</h3>
        <div className="form-grid">
          <FormGroup label="Tipo de servicio *" id="tipo-servicio"><VSelect id="tipo-servicio" required value={sv} onChange={cambiarServicio} options={SERVICIOS} placeholder="Selecciona un servicio" /></FormGroup>
          <FormGroup label="Urgencia" id="urgencia"><VSelect id="urgencia" value={f.urgencia} onChange={v => setF({ ...f, urgencia: v })} options={URGENCIAS} /></FormGroup>
        </div>
        <div className="checkbox-group">
          <label className="checkbox-label"><input type="checkbox" checked={f.limpieza} onChange={set("limpieza")} /> Limpieza profunda adicional + $30.000</label>
          <label className="checkbox-label"><input type="checkbox" checked={f.recogida} onChange={set("recogida")} /> Recogida a domicilio + $25.000</label>
          <label className="checkbox-label"><input type="checkbox" checked={f.entrega} onChange={set("entrega")} /> Entrega a domicilio + $25.000</label>
        </div>
      </div>

      <div className="form-section">
        <h3>📅 Fecha y hora</h3>
        <div className="form-grid">
          <FormGroup label="Fecha preferida *" id="fecha" type="date" required min={minFecha()} value={f.fecha} onChange={set("fecha")} />
          <FormGroup label="Hora preferida *" id="hora"><VSelect id="hora" required value={f.hora} onChange={v => setF({ ...f, hora: v })} options={HORAS} placeholder="Selecciona una hora" /></FormGroup>
        </div>
      </div>

      <div className="booking-summary">
        <h3>Resumen de la cita</h3>
        <div className="resumen-content">
          {!sv ? <p className="resumen-empty">Selecciona un servicio para ver el resumen.</p> : (
            <>
              <p><strong>Servicio:</strong> {NOMBRES_SERVICIOS[sv]}</p>
              <p><strong>Precio base:</strong> {fmt(PRECIOS_SERVICIOS[sv])}</p>
              <p><strong>Extras:</strong> {extras.length ? extras.map(x => x.texto).join(", ") : "Ninguno"}</p>
              <small>El valor final puede variar si se requieren repuestos.</small>
            </>
          )}
        </div>
        <div className="resumen-total"><span>Total estimado:</span><strong>{fmt(sv ? total : 0)}</strong></div>
      </div>

      <Button type="submit" size="lg" full disabled={enviando} style={{ marginTop: 24 }}>Confirmar cita</Button>
    </form>
  )
}
