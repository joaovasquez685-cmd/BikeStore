export const emailValido = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)

const DEBILES = ["12345678","123456789","1234567890","11111111","00000000","password","contrasena","qwerty123","abc12345","admin123"]
export function validarFortaleza(pass){
  if (pass.length < 8) return "⚠️ La contraseña debe tener al menos 8 caracteres."
  if (DEBILES.includes(pass.toLowerCase())) return "⚠️ Esa contraseña aparece en filtraciones de datos públicas (como 12345678). Elige una más segura."
  if (!/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)) return "⚠️ La contraseña debe combinar al menos una letra y un número."
  return null
}

export function validarPago(d){
  const num = d.tarjeta.replace(/\s/g, "")
  if (!/^\d{16}$/.test(num)) return "⚠️ El número de tarjeta debe tener 16 dígitos."
  if (!d.titular.trim()) return "⚠️ Escribe el nombre del titular de la tarjeta."
  const m = d.vencimiento.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return "⚠️ Vencimiento inválido. Usa el formato MM/AA (ej: 12/28)."
  const mes = +m[1], anio = 2000 + +m[2], ahora = new Date()
  if (mes < 1 || mes > 12) return "⚠️ El mes de vencimiento no es válido."
  if (anio < ahora.getFullYear() || (anio === ahora.getFullYear() && mes < ahora.getMonth() + 1)) return "⚠️ La tarjeta está vencida."
  if (!/^\d{3,4}$/.test(d.cvv)) return "⚠️ El CVV debe tener 3 o 4 dígitos."
  return null
}

/** Horario real: L-V 8-18, sábados 8-14, domingos cerrado (el original no lo validaba). */
export function validarHorarioCita(fechaISO, hora){
  const [y, m, d] = fechaISO.split("-").map(Number)
  const dia = new Date(y, m - 1, d).getDay()
  if (dia === 0) return "⚠️ Los domingos permanecemos cerrados. Elige otro día."
  if (dia === 6 && Number(hora.slice(0, 2)) >= 14) return "⚠️ Los sábados atendemos hasta las 2:00 p.m. Elige una hora más temprana."
  return null
}
