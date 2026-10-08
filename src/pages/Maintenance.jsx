import { useState } from "react"
import Hero from "../components/organisms/Hero"
import ServicePlans from "../components/organisms/ServicePlans"
import BookingForm from "../components/organisms/BookingForm"
import SectionHead from "../components/molecules/SectionHead"
import Button from "../components/atoms/Button"
import { usePageMeta } from "../hooks/usePageMeta"

const HERO_IMG = "https://images.unsplash.com/photo-1676531356064-0a527118baf4?fm=jpg&q=80&w=2000&auto=format&fit=crop"

export default function Maintenance(){
  usePageMeta("Mantenimiento | Veloce Bikes", "Servicio técnico y mantenimiento para bicicletas Veloce Bikes. Agenda tu cita, describe el problema y descarga tu recibo en PDF.")
  const [servicio, setServicio] = useState("")

  return (
    <>
      <Hero modifier="maintenance-hero" imagen={HERO_IMG} alt="Taller de mantenimiento para bicicletas Veloce Bikes" eyebrow="Servicio técnico especializado">
        <h1>Tu bici siempre lista para <span className="accent">rodar</span></h1>
        <p className="lead">Agenda mantenimiento básico, completo, reparación mayor o diagnóstico técnico. Al confirmar tu cita recibirás un recibo en PDF con todos los detalles.</p>
        <div className="hero__cta">
          <a href="#agendar" className="btn btn--lg">Agendar cita</a>
          <a href="#servicios" className="btn btn--ghost-light">Ver servicios</a>
        </div>
      </Hero>

      <section id="servicios" className="section"><div className="container">
        <SectionHead kicker="Planes de mantenimiento" titulo="Elige el servicio que necesita tu bicicleta" descripcion="Haz clic en una tarjeta para seleccionarla. Los precios son estimados." />
        <ServicePlans seleccionado={servicio} onSelect={setServicio} />
      </div></section>

      <section id="agendar" className="section"><div className="container">
        <SectionHead kicker="Agenda tu cita" titulo="Reserva tu mantenimiento" descripcion="Completa el formulario. Al confirmar podrás descargar tu recibo en PDF." />
        <div className="booking-layout">
          <div className="booking-form-card"><BookingForm servicio={servicio} onServicio={setServicio} /></div>
          <aside className="booking-info">
            <div className="info-card"><h3>🕒 Horarios de atención</h3>
              <ul className="hours-list">
                <li><strong>Lunes a viernes:</strong> 8:00 a.m. - 6:00 p.m.</li>
                <li><strong>Sábados:</strong> 8:00 a.m. - 2:00 p.m.</li>
                <li><strong>Domingos:</strong> Cerrado</li>
              </ul></div>
            <div className="info-card"><h3>✅ Beneficios</h3>
              <ul className="benefits-list">
                <li>Revisión técnica profesional</li><li>Garantía sobre mano de obra</li>
                <li>Repuestos cotizados antes de instalar</li><li>Recibo en PDF al confirmar tu cita</li>
              </ul></div>
            <div className="info-card info-card--accent"><h3>¿También necesitas accesorios?</h3>
              <p>Tenemos cascos, luces, guantes, herramientas y componentes para complementar tu bici.</p>
              <Button to="/accesorios" variant="light">Ver accesorios</Button></div>
          </aside>
        </div>
      </div></section>
    </>
  )
}
