import { useRef, useState } from "react"

/**
 * Magnifier (Lupa) - Simple implementation using CSS transform
 * Shows a circular magnified view that follows the cursor
 */
export default function Magnifier({ src, alt, zoomFactor = 2, lensSize = 200, style, className = "" }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top

    // Only show if cursor is within the image container
    if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
      setShow(true)
      setPos({ x, y })
    } else {
      setShow(false)
    }
  }

  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    boxShadow: "0 0 0 2px rgba(255,255,255,.9), 0 6px 20px rgba(0,0,0,.15)",
    zIndex: 10,
    opacity: show ? 1 : 0,
    transition: "opacity .1s ease-out",
    left: pos.x - lensSize / 2,
    top: pos.y - lensSize / 2,
  }

  const zoomedImgStyle = {
    position: "absolute",
    width: lensSize * zoomFactor,
    height: lensSize * zoomFactor,
    transform: `scale(${zoomFactor})`,
    transformOrigin: `${pos.x}px ${pos.y}px`,
    display: "block",
    zIndex: 10,
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
      {/* Base image */}
      <img
        src={src}
        alt={alt}
        loading="eager"
        draggable="false"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block"
        }}
      />

      {/* Magnifier lens */}
      {show && (
        <div style={lensStyle} aria-hidden="true">
          <img
            src={src}
            alt={alt}
            style={{
              position: "absolute",
              width: lensSize * zoomFactor,
              height: lensSize * zoomFactor,
              transform: `scale(${zoomFactor})`,
              transformOrigin: `${pos.x}px ${pos.y}px`,
              display: "block",
              zIndex: 10,
            }}
          />
        </div>
      )}
    </div>
  )
}