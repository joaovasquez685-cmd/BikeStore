import { useRef, useState, useCallback, useLayoutEffect } from "react"

/**
 * Magnifier (Lupa) - Componente de zoom tipo lupa para imágenes.
 * Usamos background-image + background-size/background-position para evitar
 * problemas de overlap/positonning con imgs anidados.
 *
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {number} zoomFactor - Factor de ampliación (default: 4)
 * @param {number} lensSize - Tamaño de la lente en px (default: 200)
 */
export default function Magnifier({
  src,
  alt,
  zoomFactor = 4,
  lensSize = 200,
  style,
  className = "",
}) {
  const containerRef = useRef(null)
  const [showLens, setShowLens] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  // Guardamos dims en ref mutable
  const dimsRef = useRef(null)

  // Calcular dimensiones de la imagen real (con object-fit: contain)
  const calcDims = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cr = c.getBoundingClientRect()
    dimsRef.current = {
      w: cr.width,
      h: cr.height,
    }
  }, [])

  useLayoutEffect(() => {
    calcDims()
    window.addEventListener("resize", calcDims)
    return () => window.removeEventListener("resize", calcDims)
  }, [calcDims])

  const handleMouseMove = useCallback((e) => {
    const c = containerRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const inContainer = x >= 0 && x <= r.width && y >= 0 && y <= r.height
    if (!inContainer) {
      setShowLens(false)
      return
    }
    setShowLens(true)
    setPos({ x, y })
  }, [])

  const d = dimsRef.current
  const containerW = d ? d.w : 400
  const containerH = d ? d.h : 400

  // Si no tenemos dims todavía, renderizamos solo la imagen base
  if (!d || containerW === 0 || containerH === 0) {
    return (
      <div
        ref={containerRef}
        className={`magnifier ${className}`}
        style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: "#fff", ...style }}
      >
        <img src={src} alt={alt} loading="eager" draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      </div>
    )
  }

  // Pos del cursor relativa al contenedor (0..w, 0..h)
  const cx = Math.max(0, Math.min(pos.x, containerW))
  const cy = Math.max(0, Math.min(pos.y, containerH))

  // La imagen ampliada tiene tamaño = container × zoomFactor
  // background-size usa porcentajes relativos al contenedor del background (la lente)
  // Para que la imagen ocupe X veces el tamaño del contenedor:
  const bgSizeX = zoomFactor * 100
  const bgSizeY = zoomFactor * 100

  // background-position: el porcentaje indica qué parte de la imagen ampliada
  // aparece en el borde izquierdo/superior de la lente
  // Cuando cx=0 (cursor arriba-izq): queremos ver la parte izquierda de la imagen ampliada
  // La posición en pixeles del punto bajo el cursor en la imagen ampliada es: cx*zoomFactor, cy*zoomFactor
  // Queremos que ese punto quede en el centro de la lente: (lensSize/2, lensSize/2)
  // Entonces: pozX * zoomFactor - bgOffsetX = lensSize/2
  //   => bgOffsetX = cx*zoomFactor - lensSize/2
  // En porcentaje relativo al fondo (bgSizeW = containerW*zoomFactor):
  //   pozX% = bgOffsetX / (containerW * zoomFactor) * 100
  const bgPosX = ((cx * zoomFactor - lensSize / 2) / (containerW * zoomFactor)) * 100
  const bgPosY = ((cy * zoomFactor - lensSize / 2) / (containerH * zoomFactor)) * 100

  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    overflow: "hidden",
    backgroundImage: `url(${src})`,
    backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
    backgroundRepeat: "no-repeat",
    boxShadow: "0 0 0 2px rgba(255,255,255,.92), 0 6px 24px rgba(0,0,0,.18)",
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
    zIndex: 10,
    opacity: showLens ? 1 : 0,
    transition: "opacity .1s ease-out",
  }

  return (
    <div
      ref={containerRef}
      className={`magnifier ${className}`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        cursor: showLens ? "none" : "zoom-in",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowLens(false)}
    >
      {/* Imagen base */}
      <img src={src} alt={alt} loading="eager" draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />

      {/* Lente zoom con background-image technique */}
      {showLens && (
        <div className="magnifier-lens" style={lensStyle} aria-hidden="true" />
      )}
    </div>
  )
}