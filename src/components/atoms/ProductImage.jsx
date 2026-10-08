import { useState } from "react"

const PLACEHOLDER = `${import.meta.env.BASE_URL}placeholder.svg`

/** <img> con respaldo automático si la foto remota falla (reemplaza los onerror inline del original). */
export default function ProductImage({ src, alt, ...rest }){
  const [fallo, setFallo] = useState(false)
  return <img src={fallo || !src ? PLACEHOLDER : src} alt={alt} onError={() => setFallo(true)} {...rest} />
}
