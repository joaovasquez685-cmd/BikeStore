const ETIQUETAS = { cuadro:"Material del cuadro", suspension:"Suspensión", velocidades:"Velocidades", frenos:"Frenos", rueda:"Tamaño de rueda", peso:"Peso", componentes:"Componentes", horquilla:"Horquilla", cargaMax:"Capacidad de carga", motor:"Motor", autonomia:"Autonomía", talla:"Tallas", certificacion:"Certificación", ventilacion:"Ventilación", material:"Material", palmilla:"Palmilla", cierre:"Cierre", lavado:"Lavado", proteccion:"Protección", impermeabilidad:"Impermeabilidad", bolsillos:"Bolsillos", badana:"Badana", tirantes:"Tirantes", columna:"Columna de agua", altura:"Altura", luminosidad:"Luminosidad", carga:"Carga", resistencia:"Resistencia", modos:"Modos", montaje:"Montaje", sensor:"Sensor", norma:"Norma", ajuste:"Ajuste", capacidad:"Capacidad", aislamiento:"Aislamiento", tapa:"Tapa", tornilleria:"Tornillería", compatibilidad:"Compatibilidad", incluye:"Incluye", presion:"Presión", manometro:"Manómetro", cabezal:"Cabezal", base:"Base", eslabones:"Eslabones", tratamiento:"Tratamiento", rango:"Rango", rodamientos:"Rodamientos", rosca:"Rosca", riel:"Riel", ancho:"Ancho", longitud:"Longitud", llaves:"Llaves", soporte:"Soporte", funda:"Funda", extra:"Extra", interiores:"Interior" }

export default function SpecsTable({ specs = {} }){
  return (
    <div className="table-scroll">
      <table className="specs-table">
        <tbody>
          {Object.entries(specs).map(([k, v]) => <tr key={k}><th scope="row">{ETIQUETAS[k] || k}</th><td>{v}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
