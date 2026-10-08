import { useEffect, useMemo, useState } from "react"
import KpiCard from "../molecules/KpiCard"
import Button from "../atoms/Button"
import Tag from "../atoms/Tag"
import Select from "../atoms/Select"
import { orderService } from "../../services"
import { useProducts } from "../../hooks/useProducts"
import { CAT_NOMBRES, fmt } from "../../utils/format"
import { avisar } from "../../utils/notify"

const celda = { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }
const tarjeta = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: 24 }
const campo = { padding: "10px 14px", border: "1.5px solid var(--line)", borderRadius: 10 }

/** CSV seguro: comillas escapadas, BOM UTF-8 para que Excel muestre bien las tildes. */
const csv = v => `"${String(v).replace(/"/g, '""')}"`

export default function DashboardPanel(){
  const { productos } = useProducts()
  const [pedidos, setPedidos] = useState([])
  const [desde, setDesde] = useState(""); const [hasta, setHasta] = useState(""); const [cat, setCat] = useState("")
  useEffect(() => { orderService.list().then(setPedidos).catch(e => avisar(e.message)) }, [])

  const filtrados = useMemo(() => pedidos.filter(p => {
    const fecha = p.fecha.slice(0, 10)
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    if (cat && !p.items.some(i => i.categoria === cat)) return false
    return true
  }), [pedidos, desde, hasta, cat])

  const ventas = filtrados.reduce((s, p) => s + p.total, 0)
  const unidades = filtrados.reduce((s, p) => s + p.items.reduce((a, i) => a + i.cantidad, 0), 0)
  const porProducto = {}
  filtrados.forEach(p => p.items.forEach(i => { porProducto[i.nombre] = (porProducto[i.nombre] || 0) + i.cantidad }))
  const top = Object.entries(porProducto).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const bajoStock = productos.filter(p => p.stock <= 5)

  const exportarCSV = () => {
    /* Corrección: el original exportaba TODOS los pedidos ignorando los filtros activos. */
    let out = "﻿ID,Fecha,Cliente,Total,Estado\n"
    filtrados.forEach(p => { out += [csv(p.id), p.fecha.slice(0, 10), csv(p.usuarioNombre), p.total, csv(p.estado)].join(",") + "\n" })
    const url = URL.createObjectURL(new Blob([out], { type: "text/csv;charset=utf-8" }))
    const a = document.createElement("a"); a.href = url; a.download = "pedidos_veloce.csv"; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="dash-filters">
        <div className="form-group" style={{ margin: 0 }}><label htmlFor="dash-desde">Desde</label><input type="date" id="dash-desde" value={desde} onChange={e => setDesde(e.target.value)} style={campo} /></div>
        <div className="form-group" style={{ margin: 0 }}><label htmlFor="dash-hasta">Hasta</label><input type="date" id="dash-hasta" value={hasta} onChange={e => setHasta(e.target.value)} style={campo} /></div>
        <div className="form-group" style={{ margin: 0 }}><label htmlFor="dash-cat">Categoría</label>
          <Select id="dash-cat" value={cat} onChange={e => setCat(e.target.value)} placeholder="Todas" style={campo} options={Object.entries(CAT_NOMBRES).map(([value, label]) => ({ value, label }))} />
        </div>
        <Button variant="ghost" onClick={() => { setDesde(""); setHasta(""); setCat("") }}>Limpiar filtros</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        <KpiCard titulo="Ventas totales" valor={fmt(ventas)} destacado />
        <KpiCard titulo="Cantidad de pedidos" valor={filtrados.length} />
        <KpiCard titulo="Unidades vendidas" valor={unidades} />
        <KpiCard titulo="Ticket promedio" valor={fmt(filtrados.length ? ventas / filtrados.length : 0)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }}>
        <div style={tarjeta}>
          <h3>🏆 Productos más vendidos</h3>
          <div style={{ marginTop: 16 }}>
            {top.length ? top.map(([n, c]) => <div key={n} style={celda}><span>{n}</span><strong>{c} uds</strong></div>) : <p style={{ color: "var(--ink-soft)" }}>Sin datos en el período.</p>}
          </div>
        </div>
        <div style={tarjeta}>
          <h3>🔔 Alertas de stock bajo</h3>
          <div style={{ marginTop: 16 }}>
            {bajoStock.length ? bajoStock.map(p => <div key={p.id} style={celda}><span>{p.nombre}</span><strong style={{ color: "var(--bad)" }}>{p.stock} uds</strong></div>)
              : <p style={{ color: "var(--ok)" }}>✅ Todo el stock está en niveles saludables.</p>}
          </div>
        </div>
      </div>

      <div style={tarjeta}>
        <h3>🧾 Pedidos del período</h3>
        <div className="table-scroll" style={{ marginTop: 16 }}>
          <table className="specs-table">
            <thead><tr><th>N° Pedido</th><th>Fecha</th><th>Cliente</th><th>Ítems</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {filtrados.length ? filtrados.map(p => (
                <tr key={p.id}><td><strong>{p.id}</strong></td><td>{p.fecha.slice(0, 10)}</td><td>{p.usuarioNombre}</td>
                  <td>{p.items.reduce((a, i) => a + i.cantidad, 0)}</td><td>{fmt(p.total)}</td><td><Tag tone="on">{p.estado}</Tag></td></tr>
              )) : <tr><td colSpan="6" style={{ textAlign: "center", padding: 24, color: "var(--ink-soft)" }}>Sin pedidos en el período.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={exportarCSV}>📥 Exportar a Excel (CSV)</Button>
          <Button variant="ghost" onClick={() => window.print()}>🖨️ Exportar a PDF</Button>
        </div>
      </div>
    </div>
  )
}
