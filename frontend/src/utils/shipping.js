export const ENVIO_GRATIS_DESDE = 2000000
export const COSTO_ENVIO = 60000
export const calcularEnvio = subtotal => (subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO)
export const calcularSubtotal = items => items.reduce((s, i) => s + i.precio * i.cantidad, 0)
