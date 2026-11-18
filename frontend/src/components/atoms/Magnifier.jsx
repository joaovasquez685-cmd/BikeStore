import { useRef, useState } from "react"

/**
 * Magnifier (Lupa) - Zoom tipo lupa usando background-image.
 * Es la técnica más robusta y no causa saltos o distorsiones.
 */
export default function Magnifier({ src, alt, zoomFactor = 1.0, lensSize = 200, style, className = "" }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
      setPos({ x, y })
      setShow(true)
    } else {
      setShow(false)
    }
  }

  // Lente: el background es la imagen.
  // background-size: zoomFactor * 100% (si es 2, 200%)
  // background-position: calcula el offset para que el punto del cursor esté centrado
  const bSize = zoomFactor * 100
  const bPosX = (pos.x / ref.current?.offsetWidth * 100)
  const bPosY = (pos.y / ref.current?.offsetHeight * 100)

  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    border: "2px solid #fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
    zIndex: 10,
    backgroundImage: `url(${src})`,
    backgroundSize: `${bSize}% ${bSize}%`,
    // Esto centra el cursor en la lente usando una aproximación de desplazamiento
    backgroundPosition: `calc(${bPosX}% - ${lensSize/2}px) calc(${bPosY}% - ${lensSize/2}px)`,
    backgroundRepeat: "no-repeat",
    opacity: show ? 1 : 0,
    transition: "opacity .1s",
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
        cursor: "crosshair",
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setShow(false)}
    >
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      {show && <div style={lensStyle} aria-hidden="true" />}
    </div>
  )
}