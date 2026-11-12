import { useState } from "react"
import Modal from "../molecules/Modal"
import FormGroup from "../atoms/FormGroup"
import Select from "../atoms/Select"
import Button from "../atoms/Button"
import { CAT_NOMBRES } from "../../utils/format"
import { avisar } from "../../utils/notify"

const BADGES = ["", "Más Vendida", "Novedad", "Oferta", "Últimas unidades"]
const FRENOS = ["Disco hidráulico", "Disco mecánico", "V-Brake", "U-Brake", "Zapata"]

function inicial(p){
  const sp = p?.specs || {}
  return {
    nombre: p?.nombre ?? "", marca: p?.marca ?? "", categoria: p?.categoria ?? "montaña", precio: p?.precio ?? "", stock: p?.stock ?? "",
    badge: p?.badge ?? "", imagen: p?.imagen ?? "", descripcion: p?.descripcion ?? "", tallas: p ? p.tallas.join(", ") : "S, M, L",
    c1n: p ? p.nombresColores[0] : "Negro", c1h: p ? p.colores[0] : "#1A1A2E",
    c2n: p?.nombresColores?.[1] ?? "", c2h: p?.colores?.[1] ?? "#6C757D",
    cuadro: sp.cuadro ?? "", suspension: sp.suspension ?? "", velocidades: sp.velocidades ?? "", frenos: sp.frenos ?? FRENOS[0], rueda: sp.rueda ?? "", peso: sp.peso ?? "",
  }
}

/** Alta (RF-17) y edición (RF-18) de producto. Devuelve el objeto a persistir mediante onSave(datos). */
export default function ProductFormModal({ producto, onClose, onSave }){
  const [f, setF] = useState(() => inicial(producto))
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const guardar = async e => {
    e.preventDefault()
    const stock = parseInt(f.stock, 10) || 0
    const c1n = f.c1n.trim() || "Negro", c1h = f.c1h.trim() || "#1A1A2E", c2n = f.c2n.trim(), c2h = f.c2h.trim() || "#6C757D"
    const datos = {
      nombre: f.nombre.trim(), categoria: f.categoria, marca: f.marca.trim(), precio: parseInt(f.precio, 10) || 0, stock,
      imagen: f.imagen.trim() || "placeholder.svg",
      descripcion: f.descripcion.trim() || "Producto registrado por el administrador.", badge: f.badge,
      tallas: f.tallas.split(",").map(s => s.trim()).filter(Boolean),
      colores: c2n ? [c1h, c2h] : [c1h], nombresColores: c2n ? [c1n, c2n] : [c1n],
      stockPorColor: c2n ? [Math.ceil(stock / 2), Math.floor(stock / 2)] : [stock],
      specs: {
        cuadro: f.cuadro.trim() || "Aluminio 6061", suspension: f.suspension.trim() || "Rígida", velocidades: f.velocidades.trim() || "1x7 (7 velocidades)",
        frenos: f.frenos, rueda: f.rueda.trim() || '29"', peso: f.peso.trim() || "13 kg",
        componentes: "Definidos por el administrador", horquilla: "Según modelo", cargaMax: "120 kg",
      },
    }
    if (!datos.nombre || !datos.precio) return avisar("⚠️ Nombre y precio son obligatorios.")
    /* Al editar solo el stock, se redistribuye entre los colores existentes (comportamiento original). */
    if (producto && producto.stock !== stock && producto.nombresColores?.length){
      const n = producto.nombresColores.length
      datos.nombresColores = producto.nombresColores
      datos.colores = producto.colores
      datos.stockPorColor = producto.nombresColores.map((_, i) => (i === 0 ? Math.ceil(stock / n) : Math.floor(stock / n)))
    }
    await onSave(datos)
  }

  const full = { gridColumn: "1/-1" }
  return (
    <Modal titulo={producto ? "Editar producto (RF-18)" : "Registrar producto (RF-17)"} onClose={onClose}>
      <form onSubmit={guardar}>
        <div className="form-grid">
          <FormGroup label="Nombre *" id="pf-nombre" required value={f.nombre} onChange={set("nombre")} />
          <FormGroup label="Marca *" id="pf-marca" required value={f.marca} onChange={set("marca")} />
          <FormGroup label="Categoría *" id="pf-categoria"><Select id="pf-categoria" required value={f.categoria} onChange={set("categoria")} options={Object.entries(CAT_NOMBRES).map(([value, label]) => ({ value, label }))} /></FormGroup>
          <FormGroup label="Precio (COP) *" id="pf-precio" type="number" min="0" required value={f.precio} onChange={set("precio")} />
          <FormGroup label="Stock total *" id="pf-stock" type="number" min="0" required value={f.stock} onChange={set("stock")} />
          <FormGroup label="Badge" id="pf-badge"><Select id="pf-badge" value={f.badge} onChange={set("badge")} options={BADGES.map(b => ({ value: b, label: b || "(ninguno)" }))} /></FormGroup>
          <FormGroup style={full} label="URL o ruta de imagen" id="pf-imagen" placeholder="https://..." value={f.imagen} onChange={set("imagen")} />
          <FormGroup style={full} label="Descripción" id="pf-desc" value={f.descripcion} onChange={set("descripcion")} />
          <FormGroup style={full} label="Tallas (separadas por coma)" id="pf-tallas" value={f.tallas} onChange={set("tallas")} />
          <FormGroup label="Color 1 (nombre)" id="pf-c1n" value={f.c1n} onChange={set("c1n")} />
          <FormGroup label="Color 1 (hex)" id="pf-c1h" value={f.c1h} onChange={set("c1h")} />
          <FormGroup label="Color 2 (nombre, opcional)" id="pf-c2n" value={f.c2n} onChange={set("c2n")} />
          <FormGroup label="Color 2 (hex)" id="pf-c2h" value={f.c2h} onChange={set("c2h")} />
          <FormGroup label="Cuadro" id="pf-cuadro" value={f.cuadro} onChange={set("cuadro")} />
          <FormGroup label="Suspensión" id="pf-susp" value={f.suspension} onChange={set("suspension")} />
          <FormGroup label="Velocidades" id="pf-vel" value={f.velocidades} onChange={set("velocidades")} />
          <FormGroup label="Frenos" id="pf-frenos"><Select id="pf-frenos" value={f.frenos} onChange={set("frenos")} options={FRENOS} /></FormGroup>
          <FormGroup label="Rueda" id="pf-rueda" value={f.rueda} onChange={set("rueda")} />
          <FormGroup label="Peso" id="pf-peso" value={f.peso} onChange={set("peso")} />
        </div>
        <Button type="submit" style={{ width: "100%", marginTop: 14 }}>💾 Guardar producto</Button>
      </form>
    </Modal>
  )
}
