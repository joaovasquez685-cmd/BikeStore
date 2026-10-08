import { PLANES } from "../../data/services"

export default function ServicePlans({ seleccionado, onSelect }){
  return (
    <div className="services-grid">
      {PLANES.map(s => (
        <article key={s.id} className={`service-card${seleccionado === s.id ? " is-selected" : ""}`} onClick={() => onSelect(s.id)}>
          {s.popular && <span className="badge--popular">Popular</span>}
          <div className="service-card__icon">{s.icono}</div>
          <h3>{s.titulo}</h3>
          <p>{s.desc}</p>
          <ul className="service-list">{s.items.map(i => <li key={i}>✅ {i}</li>)}</ul>
          <div className="service-card__price"><span className="price-from">Desde</span><span className="price-value">{s.precio}</span></div>
          <a href="#agendar" className="btn">Agendar</a>
        </article>
      ))}
    </div>
  )
}
