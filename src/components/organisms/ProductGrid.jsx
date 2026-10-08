import ProductCard from "../molecules/ProductCard"

export default function ProductGrid({ lista, comparable = false, id }){
  return (
    <div className="product-grid" id={id}>
      {lista.length
        ? lista.map(p => <ProductCard key={p.id} p={p} comparable={comparable} />)
        : <p className="empty-msg">No se encontraron productos con estos criterios.</p>}
    </div>
  )
}
