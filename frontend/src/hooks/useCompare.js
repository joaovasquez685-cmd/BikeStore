import { useContext } from "react"
import { CompareContext } from "../context/CompareContext"

export function useCompare(){
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error("useCompare debe usarse dentro de <CompareProvider>")
  return ctx
}
