/**
 * Adaptadores REST. Contrato esperado del backend (JSON, prefijo VITE_API_URL):
 *
 *  POST   /auth/register            {nombre,email,password}      -> usuario
 *  POST   /auth/login               {email,password}             -> {token, user}
 *  GET    /auth/me                                                -> user
 *  POST   /auth/recovery            {email}
 *  POST   /auth/recovery/confirm    {email,code,newPassword}
 *  GET    /users                                                  (admin)
 *  PATCH  /users/:id                {rol?|activo?}               (admin)
 *  GET    /products?includeInactive=true|false
 *  GET    /products/:id
 *  POST   /products                 (admin)   PUT /products/:id (admin)   PATCH /products/:id {activo}
 *  POST   /orders                   {items,direccion,pago}  -> pedido (el servidor calcula totales,
 *                                    valida y descuenta stock en una transacción; NO recibe CVV completo
 *                                    en producción: usar pasarela de pago/tokenización)
 *  GET    /orders (admin)           DELETE /orders/:id (admin)
 *  GET    /appointments (admin)     POST /appointments   PATCH /appointments/:id {estado}   DELETE /appointments/:id
 *  GET    /cart   PUT /cart         (opcional; por defecto el carrito sigue en el cliente)
 */
import { http, tokenStore } from "./httpClient"
import { cartService as cartLocal } from "../local/cartService"

const SESSION_KEY = "veloce_session"
const guardarSesion = u => localStorage.setItem(SESSION_KEY, JSON.stringify(u))

export const productService = {
  list: ({ incluirInactivos = false } = {}) => http.get(`/products?includeInactive=${incluirInactivos}`),
  getById: id => http.get(`/products/${encodeURIComponent(id)}`).catch(() => null),
  create: datos => http.post("/products", datos),
  update: (id, datos) => http.put(`/products/${encodeURIComponent(id)}`, datos),
  setActivo: (id, activo) => http.patch(`/products/${encodeURIComponent(id)}`, { activo }),
  descontarStock: async () => {}, // lo hace el servidor al crear el pedido
}

export const authService = {
  async init(){},
  getSession(){ try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } },
  register: datos => http.post("/auth/register", datos),
  async login(credenciales){
    const { token, user } = await http.post("/auth/login", credenciales)
    tokenStore.set(token); guardarSesion(user)
    return user
  },
  async logout(){ tokenStore.set(null); localStorage.removeItem(SESSION_KEY) },
  requestRecovery: email => http.post("/auth/recovery", { email }).then(() => ({ simulatedCode: null })),
  resetPassword: datos => http.post("/auth/recovery/confirm", datos),
  listUsers: () => http.get("/users"),
  setRol: (id, rol) => http.patch(`/users/${encodeURIComponent(id)}`, { rol }),
  setActivo: (id, activo) => http.patch(`/users/${encodeURIComponent(id)}`, { activo }),
}

export const orderService = {
  create: datos => http.post("/orders", datos),
  list: () => http.get("/orders"),
  remove: id => http.delete(`/orders/${encodeURIComponent(id)}`),
}

export const appointmentService = {
  list: () => http.get("/appointments"),
  create: cita => http.post("/appointments", cita),
  setEstado: (id, estado) => http.patch(`/appointments/${encodeURIComponent(id)}`, { estado }),
  remove: id => http.delete(`/appointments/${encodeURIComponent(id)}`),
}

/* Carrito: se mantiene en el cliente hasta que exista /cart en el backend. */
export const cartService = cartLocal
