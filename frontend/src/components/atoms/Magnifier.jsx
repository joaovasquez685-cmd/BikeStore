import { useRef, useState, useCallback, useEffect } from "react"

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
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false })
  const [dimensions, setDimensions] = useState({ cw: 0, ch: 0, iw: 0, ih: 0, il: 0, it: 0 })

  // Actualizar dimensiones cuando la imagen cargue o cambie el tamaño
  const measure = useCallback(() => {
    const c = containerRef.current
    const i = imgRef.current
    if (!c || !i) return
    const cr = c.getBoundingClientRect()
    const ir = i.getBoundingClientRect()
    if (cr.width === 0 || cr.height === 0) return // aún no tiene layout
    setDimensions({
      cw: cr.width,
      ch: cr.height,
      iw: ir.width,
      ih: ir.height,
      il: ir.left - cr.left,
      it: ir.top - cr.top,
    })
  }, [])

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    measure()
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener("load", measure, { once: true })
    }
    // También medir en resize
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [src, measure])

  const handleMouseMove = useCallback((e) => {
    const c = containerRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const visible = x >= 0 && x <= r.width && y >= 0 && y <= r.height
    setPos({ x, y, visible })
  }, [])

  const { cw, ch, iw, ih, il, it } = dimensions
  const w = iw || cw
  const h = ih || ch
  const offX = il
  const offY = it

  // Pos del cursor relativa a la imagen
  const cx = pos.x - offX
  const cy = pos.y - offY

  // Limitar al rango de la imagen
  const clampedCX = Math.max(0, Math.min(cx, w))
  const clampedCY = Math.max(0, Math.min(cy, h))

  // Ancho y alto de la imagen dentro de la lente
  const lensW = w * zoomFactor
  const lensH = h * zoomFactor

  // Desplazamiento para centrar el punto del cursor en la lente
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
    willChange: "left,top",
    transition: "left .08s linear, top .08s linear",
  }

  // No renderizar nada si aún no hay dimensiones (evita pantalla blanca)
  if (cw === 0 || ch === 0) {
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
          ...style,
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="eager"
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </div>
    )
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