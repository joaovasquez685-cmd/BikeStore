import { useCallback, useEffect, useState } from "react"
import ProductImage from "../atoms/ProductImage"
import Tag from "../atoms/Tag"
import Button from "../atoms/Button"
import Select from "../atoms/Select"
import ProductFormModal from "./ProductFormModal"
import { useProducts } from "../../hooks/useProducts"
import { CAT_NOMBRES, fmt } from "../../utils/format"
import { avisar } from "../../utils/notify"

const inputEstilo = { padding: "10px 16px", border: "1.5px solid var(--line)", borderRadius: 10 }

export default function AdminProductsPanel(){
  const { listAll, crear, actualizar, setActivo } = useProducts()
  const [todos, setTodos] = useState([])
  const [q, setQ] = useState("")
  const [cat, setCat] = useState("")
  const [form, setForm] = useState(null)   // null=cerrado, {}=nuevo, producto=editar

  const cargar = useCallback(async () => setTodos(await listAll()), [listAll])
  useEffect(() => { cargar() }, [cargar])

  const lista = todos.filter(p => (!q || p.nombre.toLowerCase().includes(q.toLowerCase()) || p.marca.toLowerCase().includes(q.toLowerCase())) && (!cat || p.categoria === cat))

  const guardar = async datos => {
    try {
      const editando = form?.id
      if (editando) await actualizar(form.id, datos); else await crear(datos)
      setForm(null); await cargar()
      avisar(editando ? "✅ Producto actualizado correctamente (RF-18)." : "✅ Producto registrado correctamente (RF-17).")
    } catch (e) { avisar(e.message) }
  }
  const alternar = async p => {
    try {
      const nuevo = p.activo === false
      await setActivo(p.id, nuevo); await cargar()
      avisar(nuevo ? "✅ Producto activado: vuelve a aparecer en el catálogo." : "🚫 Producto inactivado: ya no aparece en el catálogo (RF-19).")
    } catch (e) { avisar(e.message) }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <input type="search" placeholder="Buscar por nombre o marca..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 200, ...inputEstilo }} />
        <Select value={cat} onChange={e => setCat(e.target.value)} placeholder="Todas las categorías" style={{ ...inputEstilo, width: "auto" }}
          options={Object.entries(CAT_NOMBRES).map(([value, label]) => ({ value, label }))} />
        <Button onClick={() => setForm({})}>+ Registrar producto</Button>
      </div>
      <div className="table-scroll">
        <table className="specs-table">
          <thead><tr><th></th><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {lista.length ? lista.map(p => (
              <tr key={p.id}>
                <td><ProductImage src={p.imagen} alt="" style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 8, background: "#EDEFF2", ...(p.stock <= 0 ? { filter: "grayscale(1)", opacity: .6 } : {}) }} /></td>
                <td><strong>{p.nombre}</strong><br /><small style={{ color: "#5B6472" }}>{p.marca} · {CAT_NOMBRES[p.categoria] || p.categoria}</small></td>
                <td>{fmt(p.precio)}</td>
                <td>{p.stock <= 0 ? <strong style={{ color: "var(--bad)" }}>0 (agotado)</strong> : p.stock}</td>
                <td>{p.activo === false ? <Tag tone="off">Inactivo</Tag> : <Tag tone="on">Activo</Tag>}</td>
                <td><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button type="button" className="mini-btn" onClick={() => setForm(p)}>✏️ Editar</button>
                  <button type="button" className="mini-btn" onClick={() => alternar(p)}>{p.activo === false ? "✅ Activar" : "🚫 Inactivar"}</button>
                </div></td>
              </tr>
            )) : <tr><td colSpan="6" style={{ textAlign: "center", padding: 24, color: "#5B6472" }}>Sin resultados para la búsqueda.</td></tr>}
          </tbody>
        </table>
      </div>
      {form && <ProductFormModal producto={form.id ? form : null} onClose={() => setForm(null)} onSave={guardar} />}
    </div>
  )
}
