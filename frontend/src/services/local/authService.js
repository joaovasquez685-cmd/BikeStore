import { leer, guardar, borrar, KEYS } from "./storage"
import { emailValido, validarFortaleza } from "../../utils/validators"

/* ⚠️ MODO DEMO: el hash y la sesión viven en el navegador. La seguridad real (hash con bcrypt/argon2,
   JWT/cookie httpOnly, autorización por rol) debe implementarla el backend: ver services/http/authService.js */
async function hashPass(texto){
  const conSal = texto + "_veloce_salt"
  if (window.crypto?.subtle){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(conSal))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
  }
  let h = 5381
  for (let i = 0; i < conSal.length; i++) h = ((h * 33) ^ conSal.charCodeAt(i)) >>> 0
  return "fb-" + h.toString(16)
}

const users = () => leer(KEYS.users, [])
const sesion = () => leer(KEYS.session, null)
const codigos = {}

async function asegurarAdmin(){
  const lista = users()
  const hashDefault = await hashPass(import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "Admin123*")
  const admin = lista.find(u => u.email === "admin@veloce.com")
  if (!admin){
    lista.push({ id: "u-admin", nombre: "Administrador Veloce", email: "admin@veloce.com", passHash: hashDefault, rol: "administrador", activo: true })
    guardar(KEYS.users, lista)
  } else if (admin.passHash === null){
    admin.passHash = hashDefault
    guardar(KEYS.users, lista)
  }
}
const publico = u => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol })

function exigirAdmin(){
  const s = sesion()
  if (!s || s.rol !== "administrador") throw new Error("⚠️ Solo el administrador puede realizar esta acción.")
}

export const authService = {
  async init(){ await asegurarAdmin() },
  getSession(){ return sesion() },

  async register({ nombre, email, password }){
    await asegurarAdmin()
    if (!nombre) throw new Error("⚠️ Escribe tu nombre completo.")
    if (!emailValido(email)) throw new Error("⚠️ El correo no es válido. Ejemplo correcto: nombre@dominio.com")
    if (users().find(u => u.email === email)) throw new Error("⚠️ Ya existe una cuenta registrada con este correo.")
    const err = validarFortaleza(password)
    if (err) throw new Error(err)
    const lista = users()
    const u = { id: "u-" + Date.now(), nombre, email, passHash: await hashPass(password), rol: "cliente", activo: true }
    lista.push(u)
    guardar(KEYS.users, lista)
    return publico(u)
  },

  async login({ email, password }){
    await asegurarAdmin()
    const u = users().find(x => x.email === email)
    if (!u) throw new Error("⚠️ No existe una cuenta con este correo.")
    if (!u.activo) throw new Error("⚠️ Tu cuenta está desactivada. Contacta a soporte.")
    if (await hashPass(password) !== u.passHash) throw new Error("⚠️ Contraseña incorrecta. Inténtalo de nuevo.")
    const s = publico(u)
    guardar(KEYS.session, s)
    return s
  },

  async logout(){ borrar(KEYS.session) },

  /** En producción el código llega por correo; aquí se devuelve para simularlo. */
  async requestRecovery(email){
    if (!emailValido(email)) throw new Error("⚠️ El correo no es válido.")
    if (!users().find(u => u.email === email)) throw new Error("⚠️ No existe una cuenta con este correo.")
    codigos[email] = String(Math.floor(100000 + Math.random() * 900000))
    return { simulatedCode: codigos[email] }
  },

  async resetPassword({ email, code, newPassword }){
    if (codigos[email] !== code) throw new Error("⚠️ El código ingresado no es válido.")
    const err = validarFortaleza(newPassword)
    if (err) throw new Error(err)
    const lista = users()
    lista.find(u => u.email === email).passHash = await hashPass(newPassword)
    guardar(KEYS.users, lista)
    delete codigos[email]
  },

  async listUsers(){ exigirAdmin(); return users().map(u => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, activo: u.activo })) },

  async setRol(id, rol){
    exigirAdmin()
    if (id === "u-admin") throw new Error("⚠️ El administrador principal no puede cambiar de rol.")
    const lista = users(); const u = lista.find(x => x.id === id)
    u.rol = rol; guardar(KEYS.users, lista)
    return u
  },

  async setActivo(id, activo){
    exigirAdmin()
    if (id === "u-admin") throw new Error("⚠️ El administrador principal no puede desactivarse.")
    const lista = users(); const u = lista.find(x => x.id === id)
    u.activo = activo; guardar(KEYS.users, lista)
    return u
  },
}
