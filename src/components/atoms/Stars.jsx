import { estrellas } from "../../utils/format"

export default function Stars({ value, children, as: Tag = "p", ...rest }){
  return <Tag className="stars" aria-label={`Calificación ${value} de 5`} {...rest}>{estrellas(value)} {children}</Tag>
}
