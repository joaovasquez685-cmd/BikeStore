import { useEffect } from "react"

export default function Modal({ titulo, onClose, children }){
  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", esc)
    return () => document.removeEventListener("keydown", esc)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal__head"><h3>{titulo}</h3>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar ventana">×</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
