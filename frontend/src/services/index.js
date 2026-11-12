/**
 * Punto único de acceso a datos. Contextos y páginas importan SOLO de aquí.
 * VITE_USE_API=true cambia de localStorage (demo) a la API REST sin tocar ningún componente.
 */
import * as local from "./local"
import * as http from "./http"

export const USE_API = import.meta.env.VITE_USE_API === "true"
const impl = USE_API ? http : local

export const productService = impl.productService
export const authService = impl.authService
export const orderService = impl.orderService
export const appointmentService = impl.appointmentService
export const cartService = impl.cartService
