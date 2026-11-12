import { createContext, useCallback, useMemo, useState } from "react"

export const CompareContext = createContext(null)
export const MAX_COMPARAR = 3

export function CompareProvider({ children }){
  const [ids, setIds] = useState([])
  const [abierto, setAbierto] = useState(false)

  /** @returns {boolean} false si se alcanzó el máximo */
  const toggle = useCallback(id => {
    let ok = true
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_COMPARAR){ ok = false; return prev }
      return [...prev, id]
    })
    return ok
  }, [])
  const limpiar = useCallback(() => { setIds([]); setAbierto(false) }, [])

  const value = useMemo(() => ({ ids, toggle, limpiar, abierto, setAbierto }), [ids, toggle, limpiar, abierto])
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
