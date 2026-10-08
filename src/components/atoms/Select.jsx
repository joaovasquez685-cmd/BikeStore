/** <select> nativo con las opciones como datos: options = [{value,label}] o ["texto"]. */
export default function Select({ options, placeholder, ...rest }){
  return (
    <select {...rest}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(o => {
        const { value, label } = typeof o === "string" ? { value: o, label: o } : o
        return <option key={value} value={value}>{label}</option>
      })}
    </select>
  )
}
