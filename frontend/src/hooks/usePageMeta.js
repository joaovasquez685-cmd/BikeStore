import { useEffect } from "react"

const DESCRIPCION_BASE = "Veloce Bikes - Tienda de bicicletas premium. Montaña, ruta, urbana y eléctricas. Envío asegurado, garantía 2 años y asesoría experta."

/** Título, meta description y JSON-LD por página (SEO que el original hacía a mano en cada HTML). */
export function usePageMeta(titulo, descripcion = DESCRIPCION_BASE, jsonLd = null){
  useEffect(() => {
    document.title = titulo
    let meta = document.querySelector('meta[name="description"]')
    if (!meta){ meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta) }
    meta.content = descripcion
    let script = null
    if (jsonLd){
      script = document.createElement("script")
      script.type = "application/ld+json"
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => { if (script) script.remove() }
  }, [titulo, descripcion, jsonLd])
}
