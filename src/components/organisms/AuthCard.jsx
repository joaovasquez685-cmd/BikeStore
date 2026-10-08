import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import FormGroup from "../atoms/FormGroup"
import Button from "../atoms/Button"
import { useAuth } from "../../hooks/useAuth"
import { avisar } from "../../utils/notify"

export default function AuthCard(){
  const { login, register, requestRecovery, resetPassword } = useAuth()
  const navigate = useNavigate()
  const destino = useLocation().state?.from || "/"
  const [vista, setVista] = useState("login")
  const [f, setF] = useState({ email: "", pass: "", nombre: "", code: "", nueva: "" })
  const [paso2, setPaso2] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const intentar = async fn => { try { await fn() } catch (e) { avisar(e.message) } }

  const submitLogin = e => { e.preventDefault(); intentar(async () => { await login({ email: f.email.trim(), password: f.pass }); navigate(destino) }) }
  const submitRegistro = e => { e.preventDefault(); intentar(async () => {
    await register({ nombre: f.nombre.trim(), email: f.email.trim(), password: f.pass })
    await login({ email: f.email.trim(), password: f.pass })
    avisar("✅ Cuenta creada correctamente. ¡Bienvenido a Veloce Bikes!")
    navigate(destino)
  }) }
  const pedirCodigo = () => intentar(async () => {
    const { simulatedCode } = await requestRecovery(f.email.trim())
    if (simulatedCode) avisar(`📧 SIMULACIÓN DE CORREO\n\nHola, tu código de recuperación es: ${simulatedCode}\n(En producción este código llegaría por email.)`)
    else avisar("📧 Te enviamos un código de recuperación a tu correo.")
    setPaso2(true)
  })
  const submitReset = e => { e.preventDefault(); intentar(async () => {
    await resetPassword({ email: f.email.trim(), code: f.code.trim(), newPassword: f.nueva })
    avisar("✅ Contraseña restablecida. Ya puedes iniciar sesión.")
    setPaso2(false); setVista("login")
  }) }

  return (
    <div className="auth-card">
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Button style={{ flex: 1 }} variant={vista === "login" ? "primary" : "ghost"} onClick={() => setVista("login")}>Iniciar sesión</Button>
        <Button style={{ flex: 1 }} variant={vista === "registro" ? "primary" : "ghost"} onClick={() => setVista("registro")}>Crear cuenta</Button>
      </div>

      {vista === "login" && (
        <form onSubmit={submitLogin}>
          <FormGroup label="Correo electrónico" id="login-email" type="email" required placeholder="tu@email.com" value={f.email} onChange={set("email")} autoComplete="username" />
          <FormGroup label="Contraseña" id="login-pass" type="password" required placeholder="••••••••" value={f.pass} onChange={set("pass")} autoComplete="current-password" />
          <Button type="submit" size="lg" full>Ingresar</Button>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: ".88rem" }}>
            <button type="button" className="link-guide" onClick={() => setVista("recuperar")}>¿Olvidaste tu contraseña? Recupérala aquí</button>
          </p>
        </form>
      )}

      {vista === "registro" && (
        <form onSubmit={submitRegistro}>
          <FormGroup label="Nombre completo" id="reg-nombre" required placeholder="Tu nombre y apellido" value={f.nombre} onChange={set("nombre")} autoComplete="name" />
          <FormGroup label="Correo electrónico" id="reg-email" type="email" required placeholder="tu@email.com" value={f.email} onChange={set("email")} autoComplete="username" />
          <FormGroup label="Contraseña (mínimo 8 caracteres, letra y número)" id="reg-pass" type="password" required minLength={8} placeholder="••••••••" value={f.pass} onChange={set("pass")} autoComplete="new-password" />
          <Button type="submit" size="lg" full>Crear cuenta</Button>
        </form>
      )}

      {vista === "recuperar" && (
        <form onSubmit={submitReset}>
          <FormGroup label="Correo electrónico" id="rec-email" type="email" required placeholder="tu@email.com" value={f.email} onChange={set("email")} />
          <Button variant="ghost" full onClick={pedirCodigo}>Enviar código</Button>
          {paso2 && (
            <div style={{ marginTop: 16 }}>
              <FormGroup label="Código de 6 dígitos" id="rec-code" maxLength={6} placeholder="123456" required value={f.code} onChange={set("code")} />
              <FormGroup label="Nueva contraseña" id="rec-pass" type="password" required minLength={8} placeholder="••••••••" value={f.nueva} onChange={set("nueva")} autoComplete="new-password" />
              <Button type="submit" size="lg" full>Restablecer contraseña</Button>
            </div>
          )}
          <p style={{ textAlign: "center", marginTop: 14, fontSize: ".88rem" }}>
            <button type="button" className="link-guide" onClick={() => setVista("login")}>← Volver a iniciar sesión</button>
          </p>
        </form>
      )}
    </div>
  )
}
