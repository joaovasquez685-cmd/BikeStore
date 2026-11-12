import Modal from "../molecules/Modal"
import { useUi } from "../../hooks/useUi"

export default function SizeGuideModal(){
  const { guiaTallas, cerrarGuiaTallas } = useUi()
  if (!guiaTallas) return null
  return (
    <Modal titulo="Guía de tallas según tu altura" onClose={cerrarGuiaTallas}>
      <table className="specs-table guide-table">
        <thead><tr><th>Altura del ciclista</th><th>Talla MTB / Urbana</th><th>Talla Ruta</th></tr></thead>
        <tbody>
          <tr><td>1.50 – 1.60 m</td><td>S</td><td>48</td></tr>
          <tr><td>1.60 – 1.70 m</td><td>M</td><td>52</td></tr>
          <tr><td>1.70 – 1.78 m</td><td>L</td><td>54</td></tr>
          <tr><td>1.78 – 1.88 m</td><td>XL</td><td>56</td></tr>
          <tr><td>Más de 1.88 m</td><td>XL</td><td>58</td></tr>
        </tbody>
      </table>
      <p style={{ marginTop: 16, fontSize: ".9rem", color: "#6c757d" }}>
        BMX e infantil usan talla única según edad: BMX 20&quot; (8+ años), infantil 16&quot; (4-7 años) y 20&quot; (6-9 años).
      </p>
    </Modal>
  )
}
