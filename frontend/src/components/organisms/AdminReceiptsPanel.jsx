export default function AdminReceiptsPanel({ pedidos, citas, onChange }){
  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>🔧 Recibos de citas (mantenimiento)</h3>
      {citas.length ? citas.map(c => (
        <div>
          <p>Pedido: {c.pedido}</p>
          <p>Servicio: {c.servicio}</p>
          <p>Fecha: {c.fecha}</p>
          <p>Estado: {c.estado}</p>
        </div>
      )) : <p>Aún no hay citas registradas.</p>}
    </div>
  )
}