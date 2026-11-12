import { createContext, useCallback, useMemo, useState } from "react"

export const UiContext = createContext(null)

/** Estado de UI compartido: la guía de tallas se abre desde el footer y desde la ficha de producto. */
export function UiProvider({ children }){
  const [guiaTallas, setGuiaTallas] = useState(false)
  const abrirGuiaTallas = useCallback(() => setGuiaTallas(true), [])
  const cerrarGuiaTallas = useCallback(() => setGuiaTallas(false), [])
  const value = useMemo(() => ({ guiaTallas, abrirGuiaTallas, cerrarGuiaTallas }), [guiaTallas, abrirGuiaTallas, cerrarGuiaTallas])
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}
