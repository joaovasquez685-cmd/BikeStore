export default function AdminAppointmentsPanel({ citas, onChange }){
  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {citas.length ? citas.map(c => (
          <tr>
            <td>{c.fechaPreferida}</td>
            <td>{c.hora}</td>
            <td>{c.servicio}</td>
            <td>{c.estado}</td>
            <td>{c.observaciones}</td>
          </tr>
        )) : <tr><td colSpan="6" style={{ textAlign: "center", padding: 24, color: "var(--ink-soft)" }}>No hay citas agendadas.</td></tr>}
      </tbody>
    </table>
  )
}