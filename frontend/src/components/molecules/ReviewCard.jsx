import { estrellas } from "../../utils/format"

export default function ReviewCard({ r }){
  return (
    <article className="review-card">
      <header><strong>{r.autor}</strong> <span className="stars">{estrellas(r.rating)}</span> <time>{r.fecha}</time></header>
      <p>{r.texto}</p>
    </article>
  )
}
