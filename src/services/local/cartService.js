import { leer, guardar, borrar, KEYS } from "./storage"

/** El carrito es por usuario ("guest" si no hay sesión). Con backend: GET/PUT /cart (ver http/cartService.js). */
export const cartService = {
  get(ownerId){ return leer(KEYS.cart(ownerId), []) },
  save(ownerId, items){ guardar(KEYS.cart(ownerId), items) },
  /** Al iniciar sesión, el carrito de invitado se fusiona con el del usuario. */
  migrateGuest(userId){
    const guest = leer(KEYS.cart("guest"), [])
    if (!guest.length) return
    guardar(KEYS.cart(userId), [...leer(KEYS.cart(userId), []), ...guest])
    borrar(KEYS.cart("guest"))
  },
}
