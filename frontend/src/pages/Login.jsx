import AuthCard from "../components/organisms/AuthCard"
import { usePageMeta } from "../hooks/usePageMeta"

export default function Login(){
  usePageMeta("Ingresar | Veloce Bikes", "Inicia sesión o crea tu cuenta en Veloce Bikes. Recuperación de contraseña con código de 6 dígitos.")
  return <section className="section"><div className="container"><AuthCard /></div></section>
}
