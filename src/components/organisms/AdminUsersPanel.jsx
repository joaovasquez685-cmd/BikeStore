import { useCallback, useEffect, useState } from "react"
import Tag from "../atoms/Tag"
import { useAuth } from "../../hooks/useAuth"
import { avisar } from "../../utils/notify"

export default function AdminUsersPanel(){
  const { listUsers, setRol, setActivoUsuario } = useAuth()
  const [users, setUsers] = useState([])
  const [q, setQ] = useState("")
  const cargar = useCallback(async () => setUsers(await listUsers()), [listUsers])
  useEffect(() => { cargar().catch(e => avisar(e.message)) }, [cargar])

  const lista = users.filter(u => !q || u.nombre.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  const accion = async fn => { try { await fn(); await cargar() } catch (e) { avisar(e.message) } }

  const cambiarRol = u => accion(async () => {
    const rol = u.rol === "administrador" ? "cliente" : "administrador"
    await setRol(u.id, rol); avisar(`✅ Ahora ${u.nombre} tiene rol: ${rol}.`)
  })
  const alternar = u => accion(async () => {
    await setActivoUsuario(u.id, !u.activo)
    avisar(!u.activo ? `✅ Cuenta de ${u.nombre} activada.` : `🚫 Cuenta de ${u.nombre} desactivada: no podrá iniciar sesión.`)
  })

  return (
    <div>
      <div className="admin-toolbar">
        <input type="search" placeholder="Buscar por nombre o correo..." value={q} onChange={e => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "10px 16px", border: "1.5px solid var(--line)", borderRadius: 10 }} />
      </div>
      <div className="table-scroll">
        <table className="specs-table">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {lista.length ? lista.map(u => (
              <tr key={u.id}>
                <td><strong>{u.nombre}</strong></td><td>{u.email}</td>
                <td>{u.rol === "administrador" ? <Tag tone="on">Administrador</Tag> : <Tag>Cliente</Tag>}</td>
                <td>{u.activo ? <Tag tone="on">Activa</Tag> : <Tag tone="off">Desactivada</Tag>}</td>
                <td><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button type="button" className="mini-btn" onClick={() => cambiarRol(u)}>{u.rol === "administrador" ? "⬇️ Hacer cliente" : "⬆️ Hacer admin"}</button>
                  <button type="button" className="mini-btn" onClick={() => alternar(u)}>{u.activo ? "🚫 Desactivar" : "✅ Activar"}</button>
                </div></td>
              </tr>
            )) : <tr><td colSpan="5" style={{ textAlign: "center", padding: 24, color: "#5B6472" }}>Sin resultados.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
