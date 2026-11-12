/* Logos de pago embebidos (sin red). MasterCard y Contraentrega quedan como texto, igual que el original. */
const LOGOS = {
  VISA: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20130%2040'%3E%3Ctext%20x='65'%20y='31'%20font-family='Arial,Helvetica,sans-serif'%20font-size='32'%20font-weight='700'%20font-style='italic'%20fill='%231A1F71'%20text-anchor='middle'%3EVISA%3C/text%3E%3C/svg%3E",
  PSE: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2040%2040'%3E%3Ccircle%20cx='20'%20cy='20'%20r='20'%20fill='%23004B87'/%3E%3Ccircle%20cx='7'%20cy='14'%20r='1.7'%20fill='%23FFD200'/%3E%3Ccircle%20cx='5'%20cy='20'%20r='1.7'%20fill='%23FFD200'/%3E%3Ccircle%20cx='7'%20cy='26'%20r='1.7'%20fill='%23FFD200'/%3E%3Ctext%20x='21'%20y='26'%20font-family='Arial,Helvetica,sans-serif'%20font-size='15'%20font-style='italic'%20fill='%23FFFFFF'%20text-anchor='middle'%3Epse%3C/text%3E%3C/svg%3E",
  NEQUI: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20150%2040'%3E%3Crect%20x='20'%20y='11'%20width='13'%20height='13'%20rx='2'%20fill='%23D80073'/%3E%3Ctext%20x='40'%20y='31'%20font-family='Arial,Helvetica,sans-serif'%20font-size='27'%20font-weight='700'%20fill='%232B0B3F'%3Enequi%3C/text%3E%3C/svg%3E",
}

function Pill({ nombre }){
  const url = LOGOS[nombre]
  if (!url) return <span className="pay-pill">{nombre}</span>
  return (
    <span className="pay-pill" role="img" aria-label={nombre}
      style={{ width: 58, height: 36, padding: "5px 8px", borderRadius: 8, background: `#fff url("${url}") center / contain no-repeat` }} />
  )
}

export default function PayPills({ metodos = ["VISA", "PSE", "NEQUI"] }){
  return (
    <div className="footer__pay">
      <span>Métodos de pago:</span>
      {metodos.map(m => <Pill key={m} nombre={m} />)}
    </div>
  )
}
