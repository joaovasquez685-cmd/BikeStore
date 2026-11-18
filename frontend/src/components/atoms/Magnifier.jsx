import { useRef, useState, useEffect, useCallback } from "react"

/**
 * Magnifier (Lupa) - Componente de zoom tipo lupa para imágenes.
 * Al pasar el cursor sobre la imagen, muestra una lente circular que sigue el cursor
 * y muestra la imagen ampliada en esa zona con zoom real.
 *
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {number} zoomFactor - Factor de ampliación (default: 4)
 * @param {number} lensSize - Tamaño de la lente en px (default: 200)
 * @param {object} style - Estilos adicionales para el contenedor
 * @param {object} imgStyle - Estilos adicionales para la imagen base
 */
export default function Magnifier({
  src,
  alt,
  zoomFactor = 4,
  lensSize = 200,
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
  const [imgRect, setImgRect] = useState(null) // {width, height, left, top} dentro del contenedor

  // Obtener tamaño y posición de la imagen real dentro del contenedor
  useEffect(() => {
    if (!imgRef.current) return
    const img = imgRef.current
    const checkLoaded = () => {
      if (img.complete && img.naturalWidth) {
        const containerRect = containerRef.current?.getBoundingClientRect()
        const imgRect = img.getBoundingClientRect()
        if (containerRect) {
          setImgRect({
            width: imgRect.width,
            height: imgRect.height,
            left: imgRect.left - containerRect.left,
            top: imgRect.top - containerRect.top,
          })
        }
        setImgLoaded(true)
      }
    }
    if (img.complete) {
      checkLoaded()
    } else {
      img.onload = checkLoaded
    }
  }, [src])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !imgLoaded || !imgRect) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Verificar si el cursor está sobre la imagen (no en el padding)
    const isOverImage = x >= imgRect.left && x <= imgRect.left + imgRect.width &&
                        y >= imgRect.top && y <= imgRect.top + imgRect.height

    if (isOverImage) {
      setLensPos({ x, y })
      setIsInside(true)
    } else {
      setIsInside(false)
    }
  }, [imgLoaded, imgRect])

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
  // La imagen ampliada debe tener tamaño = tamaño real de la imagen * zoomFactor
  // Y posicionarse para que el punto bajo el cursor quede centrado en la lente

  const containerRect = containerRef.current?.getBoundingClientRect()
  const containerWidth = containerRect?.width || 400
  const containerHeight = containerRect?.height || 400

  // Usar el tamaño real de la imagen renderizada (no el contenedor)
  const imgWidth = imgRect?.width || containerWidth
  const imgHeight = imgRect?.height || containerHeight
  const imgLeft = imgRect?.left || 0
  const imgTop = imgRect?.top || 0

  const zoomedWidth = imgWidth * zoomFactor
  const zoomedHeight = imgHeight * zoomFactor

  // Posición del cursor RELATIVA A LA IMAGEN (no al contenedor)
  const cursorXOnImg = lensPos.x - imgLeft
  const cursorYOnImg = lensPos.y - imgTop

  // Calcular offset para centrar el punto del cursor en la lente
  // La imagen ampliada se mueve para que cursorXOnImg * zoomFactor quede en el centro de la lente
  const offsetX = cursorXOnImg * zoomFactor - lensSize / 2
  const offsetY = cursorYOnImg * zoomFactor - lensSize / 2

  const zoomedImgStyle = {
    width: zoomedWidth,
    height: zoomedHeight,
    position: "absolute",
    left: -offsetX,
    top: -offsetY,
    objectFit: "cover",
    transform: "translateZ(0)",
    willChange: "transform, left, top",
  }

  // Estilo para la imagen base (ocupar todo el contenedor con contain)
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
      {isInside && imgLoaded && imgRect && (
        <div className="magnifier-lens" style={lensStyle} aria-hidden="true">
          <img src={src} alt="" style={zoomedImgStyle} />
        </div>
      )}
    </div>
  )
}