import { avisar } from "../../utils/notify"

export default function NewsletterForm(){
  const enviar = e => { e.preventDefault(); avisar("¡Gracias por suscribirte!"); e.target.reset() }
  return (
    <form className="newsletter" onSubmit={enviar}>
      <input type="email" placeholder="tu@email.com" required aria-label="Correo electrónico" />
      <button type="submit" className="btn">Suscribirme</button>
    </form>
  )
}
