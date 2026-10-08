export default function PromoBanner({ eyebrow, titulo, texto, cta, badge }){
  return (
    <div className="promo">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{titulo}</h2>
        <p>{texto}</p>
        <div className="promo__cta">{cta}</div>
      </div>
      <div className="promo__badge">{badge}</div>
    </div>
  )
}
