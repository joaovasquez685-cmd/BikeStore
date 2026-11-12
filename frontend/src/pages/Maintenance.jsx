import ServicePlans from "../components/organisms/ServicePlans"
import BookingForm from "../components/organisms/BookingForm"
import { usePageMeta } from "../hooks/usePageMeta"

function Maintenance(){
  usePageMeta("Mantenimiento | Veloce Bikes", "Servicio técnico y mantenimiento para bicicletas Veloce Bikes. Agenda tu cita, describe el problema y descarga tu recibo en PDF.")
  return (
    <div>
      <h1>Mantenimiento Veloce Bikes</h1>
      <p>Servicio técnico y mantenimiento para bicicletas Veloce Bikes.</p>
      <ServicePlans />
      <BookingForm />
    </div>
  )
}

export default Maintenance