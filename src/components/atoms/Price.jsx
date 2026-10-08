import { fmt } from "../../utils/format"

export default function Price({ precio, anterior, className, as: Tag = "p" }){
  return (
    <Tag className={className}>
      {anterior ? <><s className="price-old">{fmt(anterior)}</s>{" "}</> : null}
      {fmt(precio)}
    </Tag>
  )
}
