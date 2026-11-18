import { useRef, useState, useCallback } from "react"

/**
 * Magnifier (Lupa) - Componente de zoom tipo lupa para imágenes.
 * Al pasar el cursor sobre la imagen, muestra una lente circular que sigue el cursor
 * y muestra la imagen ampliada en esa zona con zoom real.
 *
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {number} zoomFactor - Factor de ampliación (default: 4)
 * @param {number} lensSize - Tamaño de la lente en px (default: 200)
 */
export default function Magnifier({ src, alt, zoomFactor = 4, lensSize = 200, style, className = "" }) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [pos, setPos] = useState({ x: -999, y: -999, visible: false })
  // Rectangulo renderizado de la imagen dentro del contenedor
  const [imgRend, setImgRend] = useState(null) // {l, t, w, h} relativos al contenedor

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const update = () => {
      const c = containerRef.current
      const i = imgRef.current
      if (!c || !i) return
      const cr = c.getBoundingClientRect()
      const ir = i.getBoundingClientRect()
      setImgRend({
        l: ir.left - cr.left,
        t: ir.top - cr.top,
        w: ir.width,
        h: ir.height,
      })
    }
    // Intentar leer inmediatamente (si ya está cargada)
    if (img.complete && img.naturalWidth > 0) {
      update()
    } else {
      img.addEventListener("load", update, { once: true })
    }
  }, [src])

  const handleMouseMove = useCallback((e) => {
    const c = containerRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    // Solo mostrar si está dentro del contenedor
    const visible = x >= 0 && x <= r.width && y >= 0 && y <= r.height
    setPos({ x, y, visible })
  }, [])

  // Calcular coordenadas de la imagen dentro de la lente
  // Si hay info del rect rendido, usarlo; sino usar el tamaño completo del contenedor
  const containerW = containerRef.current?.offsetWidth || 400
  const containerH = containerRef.current?.offsetHeight || 400
  const w = imgRend ? imgRend.w : containerW
  const h = imgRend ? imgRend.h : containerH
  const offX = imgRend ? imgRend.l : 0
  const offY = imgRend ? imgRend.t : 0

  // Pos del cursor relativa a la imagen
  const cx = pos.x - offX
  const cy = pos.y - offY

  // Limitar al rango de la imagen
  const clampedCX = Math.max(0, Math.min(cx, w))
  const clampedCY = Math.max(0, Math.min(cy, h))

  // Ancho y alto de la porción visible en la lente
  const lensW = w * zoomFactor
  const lensH = h * zoomFactor

  // Desplazamiento de la imagen ampliada dentro de la lente
  // El punto bajo el cursor debe quedar centrado en la lente (lensSize/2)
  const destOX = clampedCX * zoomFactor - lensSize / 2
  const destOY = clampedCY * zoomFactor - lensSize / 2

  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    overflow: "hidden",
    boxShadow: "0 0 0 2px rgba(255,255,255,.9), 0 6px 20px rgba(0,0,0,.2)",
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
    zIndex: 10,
    opacity: pos.visible ? 1 : 0,
    transition: "opacity .12s ease-out",
  }

  const zoomedImgStyle = {
    width: lensW,
    height: lensH,
    position: "absolute",
    left: -destOX,
    top: -destOY,
    display: "block",
    transform: "translateZ(0)",
    willChange: "left,top",
    transition: "left .08s linear, top .08s linear",
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
        cursor: pos.visible ? "none" : "zoom-in",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos(p => ({ ...p, visible: false }))}
    >
      {/* Imagen base: ocupa todo el contenedor */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />

      {/* Lente con imagen ampliada */}
      {pos.visible && (
        <div className="magnifier-lens" style={lensStyle} aria-hidden="true">
          <img src={src} alt="" style={zoomedImgStyle} draggable={false} />
        </div>
      )}
    </div>
  )
}