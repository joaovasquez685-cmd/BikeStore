const ITEMS = [
  { ico: "🚚", titulo: "Envío gratis", texto: "En compras superiores a $2.000.000 a todo Colombia." },
  { ico: "", titulo: "Garantía 2 años", texto: "Cubrimos cuadro y componentes originales." }, // el escudo 🛡️ lo pinta el CSS (.trust-item:nth-child(2))
  { ico: "↩️", titulo: "Devolución 30 días", texto: "Si no te enamoras, te devolvemos tu dinero." },
  { ico: "🔒", titulo: "Pago seguro", texto: "Tarjetas, PSE, Nequi." },
]

export default function TrustBlock(){
  return (
    <div className="trust">
      {ITEMS.map(i => (
        <div className="trust-item" key={i.titulo}>
          <div className="trust-ico">{i.ico}</div>
          <div><h3>{i.titulo}</h3><p>{i.texto}</p></div>
        </div>
      ))}
    </div>
  )
}
