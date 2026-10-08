export default function FilterField({ label, id, children }){
  return (
    <div className="filter-group">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  )
}
