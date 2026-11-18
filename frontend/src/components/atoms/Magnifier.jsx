import { useRef, useState } from "react"

/**
 * Magnifier (Lupa) - Zoom tipo lupa usando background-image technique.
 *
 * La lente es un círculo con background-image donde:
 *   - background-size = 100% × zoomFactor → la imagen se amplía zoomFactor veces
 *   - background-position = posición para que el punto bajo el cursor quede en el centro de la lente
 */
export default function Magnifier({ src, alt, zoomFactor = 4, lensSize = 200, style, className = "" }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, cw: 0, ch: 0 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
      setPos({ x, y, cw: r.width, ch: r.height })
      setShow(true)
    } else {
      setShow(false)
    }
  }

  // Renderizado inicial sin lente (espera a tener dimensiones)
  if (!show || pos.cw === 0) {
    return (
      <div
        ref={ref}
        className={`magnifier ${className}`}
        style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: "#fff", ...style }}
      >
        <img src={src} alt={alt} loading="eager" draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      </div>
    )
  }

  const d = pos
  const zw = zoomFactor * 100 // background-size en % (relativo al contenedor del bg)

  // Posición del cursor relativa al rectangulo de la imagen base (considerando object-fit: contain)
  // Como no tenemos imgRend aún, usamos el contenedor completo
  // El background-size es 400%, asi que el img original ocupa el 100% del fondo
  // Para centrar el punto (cx, cy) en el centro de la lente (lensSize/2):
  //   bgPosX = cx / (cw * zoomFactor - lensSize) * 100
  // pero calculado correctamente:
  const cx = d.x
  const cy = d.y
  // Background-position en porcentajes: cuanto más a la derecha/bajo el cursor, más a la derecha/bajo el background
  const bpx = ((cx * zoomFactor - lensSize / 2) / (d.cw * zoomFactor)) * 100
  const bpy = ((cy * zoomFactor - lensSize / 2) / (d.ch * zoomFactor)) * 100

  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    overflow: "hidden",
    backgroundImage: `url(${src})`,
    backgroundSize: `${zw}% ${zw}%`,
    backgroundPosition: `${bpx}% ${bpy}%`,
    backgroundRepeat: "no-repeat",
    boxShadow: "0 0 0 3px rgba(255,255,255,.95), 0 8px 24px rgba(0,0,0,.18)",
    left: d.x - lensSize / 2,
    top: d.y - lensSize / 2,
    zIndex: 10,
    opacity: 1,
  }

  return (
    <div
      ref={ref}
      className={`magnifier ${className}`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        cursor: "crosshair",
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setShow(false)}
    >
      {/* Imagen base */}
      <img src={src} alt={alt} loading="eager" draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />

      {/* Lente */}
      {show && (
        <div className="magnifier-lens" style={lensStyle} aria-hidden="true" />
      )}
    </div>
  )
}