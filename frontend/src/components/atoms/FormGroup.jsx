/** Campo con etiqueta. `as="textarea"` para áreas de texto. */
export default function FormGroup({ label, id, as: Tag = "input", className = "", style, children, ...rest }){
  return (
    <div className={`form-group ${className}`.trim()} style={style}>
      {label && <label htmlFor={id}>{label}</label>}
      {children || <Tag id={id} {...rest} />}
    </div>
  )
}
