import { useRef, useState, useEffect, useCallback } from "react"

/**
 * Magnifier (Lupa) - Componente de zoom tipo lupa para imágenes.
 * Al pasar el cursor sobre la imagen, muestra una lente circular que sigue el cursor
 * y muestra la imagen ampliada en esa zona.
 *
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {number} zoomFactor - Factor de ampliación (default: 3)
 * @param {number} lensSize - Tamaño de la lente en px (default: 180)
 * @param {object} style - Estilos adicionales para el contenedor
 * @param {object} imgStyle - Estilos adicionales para la imagen base
 */
export default function Magnifier({
  src,
  alt,
  zoomFactor = 3,
  lensSize = 180,
  style,
  imgStyle,
  className = "",
  ...rest
}) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 })

  // Obtener tamaño natural de la imagen
  useEffect(() => {
    if (!imgRef.current) return
    const img = imgRef.current
    if (img.complete && img.naturalWidth) {
      setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
      setImgLoaded(true)
    } else {
      img.onload = () => {
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
        setImgLoaded(true)
      }
    }
  }, [src])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !imgLoaded) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLensPos({ x, y })
    setIsInside(true)
  }, [imgLoaded])

  const handleMouseLeave = useCallback(() => {
    setIsInside(false)
  }, [])

  // Calcular estilos de la lente y la imagen ampliada
  const lensStyle = {
    position: "absolute",
    width: lensSize,
    height: lensSize,
    borderRadius: "50%",
    pointerEvents: "none",
    overflow: "hidden",
    boxShadow: "0 0 0 2px rgba(255,255,255,0.9), 0 8px 24px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.08)",
    left: lensPos.x - lensSize / 2,
    top: lensPos.y - lensSize / 2,
    transform: "translateZ(0)", // GPU acceleration
    zIndex: 10,
    opacity: isInside && imgLoaded ? 1 : 0,
    transition: "opacity 0.15s ease-out",
  }

  // Imagen dentro de la lente (ampliada)
  const containerRect = containerRef.current?.getBoundingClientRect()
  const containerWidth = containerRect?.width || 400
  const containerHeight = containerRect?.height || 400

  const zoomedWidth = containerWidth * zoomFactor
  const zoomedHeight = containerHeight * zoomFactor

  // Calcular el offset de la imagen ampliada para centrar en la posición del cursor
  // El cursor está en lensPos (relativo al contenedor)
  // La imagen ampliada debe moverse para que el punto bajo el cursor quede centrado en la lente
  const offsetX = (lensPos.x / containerWidth) * zoomedWidth - lensSize / 2
  const offsetY = (lensPos.y / containerHeight) * zoomedHeight - lensSize / 2

  const zoomedImgStyle = {
    width: zoomedWidth,
    height: zoomedHeight,
    position: "absolute",
    left: -offsetX,
    top: -offsetY,
    objectFit: "cover",
    transform: "translateZ(0)",
    willChange: "transform",
  }

  // Estilo para la imagen base (ocupar todo el contenedor)
  const baseImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    ...imgStyle,
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
        cursor: isInside ? "none" : "zoom-in",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsInside(true)}
      {...rest}
    >
      {/* Imagen base */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={baseImgStyle}
        loading="eager"
      />

      {/* Lente con imagen ampliada */}
      {isInside && imgLoaded && (
        <div className="magnifier-lens" style={lensStyle} aria-hidden="true">
          <img src={src} alt="" style={zoomedImgStyle} />
        </div>
      )}
    </div>
  )
}