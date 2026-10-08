import { leer, guardar, KEYS } from "./storage"
import { authService } from "./authService"
import { validarHorarioCita } from "../../utils/validators"

export const appointmentService = {
  async list(){ return leer(KEYS.citas, []) },

  async create(cita){
    const msg = validarHorarioCita(cita.fechaPreferida, cita.hora)
    if (msg) throw new Error(msg)
    const citas = leer(KEYS.citas, [])
    if (citas.some(c => c.fechaPreferida === cita.fechaPreferida && c.hora === cita.hora && c.estado !== "cancelada"))
      throw new Error("⚠️ Ya existe una cita agendada en esa fecha y hora. Por favor elige otro horario.")
    const nueva = { ...cita, id: "CT-" + Date.now(), fechaRegistro: new Date().toISOString(), estado: "pendiente" }
    guardar(KEYS.citas, [...citas, nueva])
    return nueva
  },

  async setEstado(id, estado){
    const citas = leer(KEYS.citas, [])
    const c = citas.find(x => x.id === id)
    if (!c) throw new Error("⚠️ Cita no encontrada.")
    c.estado = estado
    guardar(KEYS.citas, citas)
    return c
  },

  async remove(id){
    const s = authService.getSession()
    if (!s || s.rol !== "administrador") throw new Error("⚠️ Solo el administrador puede eliminar recibos.")
    guardar(KEYS.citas, leer(KEYS.citas, []).filter(c => c.id !== id))
  },
}
