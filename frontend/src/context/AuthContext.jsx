import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { authService, cartService } from "../services"

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => authService.getSession())
  const [ready, setReady] = useState(false)

  useEffect(() => { authService.init().finally(() => setReady(true)) }, [])

  const login = useCallback(async creds => {
    const u = await authService.login(creds)
    cartService.migrateGuest(u.id)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async datos => { await authService.register(datos) }, [])
  const logout = useCallback(async () => { await authService.logout(); setUser(null) }, [])

  const value = useMemo(() => ({
    user, ready, isAdmin: user?.rol === "administrador",
    login, register, logout,
    requestRecovery: authService.requestRecovery,
    resetPassword: authService.resetPassword,
    listUsers: authService.listUsers,
    setRol: authService.setRol,
    setActivoUsuario: authService.setActivo,
  }), [user, ready, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
