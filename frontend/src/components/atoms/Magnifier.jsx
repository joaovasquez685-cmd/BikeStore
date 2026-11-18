import { useRef, useState, useLayoutEffect, useCallback } from "react"

/**
 * Magnifier (Lupa) - Zoom tipo tienda de fotografía (estilo Nike).
 *
 * Modos:
 *  - "lens"   : lente circular que sigue el cursor (por defecto)
 *  - "beside" : panel ampliado al lado de la imagen, al estilo react-image-magnify
 *
 * La matemática usa píxeles exactos (no porcentajes) sobre la imagen realmente
 * renderizada con object-fit: contain, por lo que el punto bajo el cursor siempre
 * queda centrado y la ampliación es real.
 *
 * @param {string} src            Imagen a ampliar
 * @param {string} alt
 * @param {number} zoomFactor     Factor de ampliación (default 2)
 * @param {number} lensSize       Diámetro de la lente en px (default 200)
 * @param {"lens"|"beside"} mode  Tipo de lupa
 * @param {object} style          Estilos del contenedor
 */
export default function Magnifier({
  src,
  alt,
  zoomFactor = 1,
  lensSize = 200,
  mode = "lens",
  style,
  className = "",
}) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const dimsRef = useRef(null)          // { iw, ih, ox, oy } de la imagen renderizada
  const [hover, setHover] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  /* Medir la imagen real (respetando object-fit: contain) antes del paint. */
  const measure = useCallback(() => {
    const c = containerRef.current
    const i = imgRef.current
    if (!c || !i) return
    const cr = c.getBoundingClientRect()
    const ir = i.getBoundingClientRect()
    if (!cr.width || !cr.height) return
    dimsRef.current = {
      iw: ir.width,
      ih: ir.height,
      ox: ir.left - cr.left,
      oy: ir.top - cr.top,
    }
  }, [])

  useLayoutEffect(() => {
    const img = imgRef.current
    if (!img) return
    measure()
    if (!img.complete) img.addEventListener("load", measure, { once: true })
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      img.removeEventListener("load", measure)
    }
  }, [measure])

  const handleMove = (e) => {
    const c = containerRef.current
    const d = dimsRef.current
    if (!c || !d) return
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top

    // Solo activar cuando el cursor está sobre el área real de la imagen
    const overImage =
      x >= d.ox && x <= d.ox + d.iw && y >= d.oy && y <= d.oy + d.ih
    setHover(overImage)
    if (overImage) setPos({ x, y })
  }

  const d = dimsRef.current
  const z = zoomFactor
  const show = hover && !!d

  /* ---- Cálculo del fondo ampliado (en px exactos) ---- */
  let zoomedW = 0, zoomedH = 0, bgX = 0, bgY = 0
  if (d) {
    zoomedW = d.iw * z
    zoomedH = d.ih * z
    // Coordenada del cursor dentro de la imagen ampliada
    const px = (pos.x - d.ox) * z
    const py = (pos.y - d.oy) * z
    // top-left de la imagen ampliada para que (px,py) caiga en el centro de la lente
    bgX = lensSize / 2 - px
    bgY = lensSize / 2 - py
  }

  const bg = {
    backgroundImage: `url("${src}")`,
    backgroundSize: `${zoomedW}px ${zoomedH}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    backgroundRepeat: "no-repeat",
  }

  /* ---- Lente circular ---- */
  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 20,
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
    overflow: "hidden",
    boxShadow:
      " inset 0 0 0 1px rgba(255,255,255,.35), inset 0 18px 28px -18px rgba(255,255,255,.65), 0 0 0 3px rgba(255,255,255,.95), 0 14px 32px -8px rgba(15,23,42,.35)",
    opacity: show ? 1 : 0,
    transition: "opacity .12s ease-out",
    ...bg,
  }

  /* ---- Panel lateral (modo beside) ---- */
  const besideSize = Math.min(420, lensSize * 1.6)
  const besideStyle = {
    position: "absolute",
    left: "100%",
    top: 0,
    marginLeft: 16,
    width: besideSize,
    height: besideSize,
    borderRadius: 16,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 30,
    background: "#fff",
    boxShadow: "0 0 0 1px var(--line, #e5e7eb), 0 24px 48px -16px rgba(15,23,42,.28)",
    backgroundImage: `url("${src}")`,
    backgroundSize: `${d ? d.iw * z : 0}px ${d ? d.ih * z : 0}px`,
    backgroundPosition: `${d ? besideSize / 2 - (pos.x - d.ox) * z : 0}px ${d ? besideSize / 2 - (pos.y - d.oy) * z : 0}px`,
    backgroundRepeat: "no-repeat",
    opacity: show ? 1 : 0,
    transition: "opacity .12s ease-out",
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
        overflow: "visible",
        background: "#fff",
        cursor: show ? "crosshair" : "zoom-in",
        touchAction: "manipulation",
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", borderRadius: 16 }}
      />

      {mode === "lens" && show && <div style={lensStyle} aria-hidden="true" />}
      {mode === "beside" && show && <div style={besideStyle} aria-hidden="true" />}
    </div>
  )
}