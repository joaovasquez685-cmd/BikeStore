const BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "")
const TOKEN_KEY = "veloce_token"

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: t => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)),
}

/** Cliente fetch único: agrega JWT, serializa JSON y normaliza errores en `Error(message)`. */
async function request(method, path, body){
  const headers = { "Content-Type": "application/json" }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw new Error("⚠️ No se pudo conectar con el servidor. Inténtalo de nuevo.")
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok){
    if (res.status === 401) tokenStore.set(null)
    throw new Error(data?.message || `Error ${res.status}`)
  }
  return data
}

export const http = {
  get: p => request("GET", p),
  post: (p, b) => request("POST", p, b),
  put: (p, b) => request("PUT", p, b),
  patch: (p, b) => request("PATCH", p, b),
  delete: p => request("DELETE", p),
}
