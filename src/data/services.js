export const PRECIOS_SERVICIOS = { basico: 45000, completo: 95000, mayor: 150000, diagnostico: 25000 }
export const NOMBRES_SERVICIOS = { basico: "Mantenimiento Básico", completo: "Mantenimiento Completo", mayor: "Reparación Mayor", diagnostico: "Solo Diagnóstico" }

export const PLANES = [
  { id: "basico", icono: "🔧", titulo: "Mantenimiento Básico", desc: "Ideal para bicicletas con uso normal que necesitan ajuste general.", precio: "$45.000",
    items: ["Ajuste de frenos", "Ajuste de cambios", "Lubricación de cadena", "Revisión de presión", "Revisión rápida de tornillería"] },
  { id: "completo", icono: "⚙️", titulo: "Mantenimiento Completo", desc: "Servicio recomendado para bicicletas con uso frecuente o rutas largas.", precio: "$95.000", popular: true,
    items: ["Todo lo del básico", "Limpieza profunda", "Ajuste de rodamientos", "Centrado básico de ruedas", "Revisión de transmisión"] },
  { id: "mayor", icono: "🛠️", titulo: "Reparación Mayor", desc: "Para bicicletas con fallas, golpes, piezas dañadas o problemas mecánicos.", precio: "$150.000",
    items: ["Diagnóstico detallado", "Cambio de componentes", "Revisión de suspensión", "Revisión de frenos", "Cotización de repuestos"] },
]

export const EXTRAS = {
  prioritario: { texto: "Atención prioritaria", valor: 20000 },
  limpieza: { texto: "Limpieza profunda adicional", valor: 30000 },
  recogida: { texto: "Recogida a domicilio", valor: 25000 },
  entrega: { texto: "Entrega a domicilio", valor: 25000 },
}

export const HORAS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(h => {
  const n = Number(h.slice(0, 2)); const h12 = n > 12 ? n - 12 : n
  return { value: h, label: `${String(h12).padStart(2, "0")}:00 ${n >= 12 ? "p.m." : "a.m."}` }
})
