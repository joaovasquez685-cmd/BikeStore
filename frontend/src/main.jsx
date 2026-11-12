import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/global.css"
import AppProviders from "./context/AppProviders"
import AppRouter from "./routes/AppRouter"

/* Recupera la ruta pedida cuando GitHub Pages sirvió public/404.html (ver ese archivo). */
const redirigida = sessionStorage.getItem("veloce_redirect")
if (redirigida){ sessionStorage.removeItem("veloce_redirect"); history.replaceState(null, "", redirigida) }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>
)
