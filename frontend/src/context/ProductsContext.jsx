import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { productService } from "../services"

export const ProductsContext = createContext(null)
const listAllProductos = () => productService.list({ incluirInactivos: true })

export function ProductsProvider({ children }){
  const [productos, setProductos] = useState([])   // solo activos (lo que ve el cliente)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setProductos(await productService.list())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => ({
    productos, loading, error, refresh,
    getById: productService.getById,                        // incluye inactivos (para el mensaje "inactivado")
    listAll: listAllProductos,                              // panel admin
    /* referencias estables: evitan re-renders/efectos en cadena en los consumidores */
    crear: async d => { const p = await productService.create(d); await refresh(); return p },
    actualizar: async (id, d) => { const p = await productService.update(id, d); await refresh(); return p },
    setActivo: async (id, a) => { const p = await productService.setActivo(id, a); await refresh(); return p },
  }), [productos, loading, error, refresh])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
