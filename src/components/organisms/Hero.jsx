import ProductImage from "../atoms/ProductImage"

/** Hero con foto de fondo oscurecida. `modifier`: "", "accessories-hero", "maintenance-hero". */
export default function Hero({ imagen, alt, modifier = "", eyebrow, children }){
  return (
    <section className={`hero ${modifier}`.trim()}>
      <div className="hero__media"><ProductImage src={imagen} alt={alt} loading="eager" /></div>
      <div className="hero__overlay" />
      <div className="container hero__content">
        <span className="eyebrow"><span className="dot" /> {eyebrow}</span>
        {children}
      </div>
    </section>
  )
}
