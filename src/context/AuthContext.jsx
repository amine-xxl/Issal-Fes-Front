import { createContext, useContext, useState } from "react"

// Contexte global — accessible partout dans l'app
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Au démarrage, on lit localStorage (si déjà connecté avant)
  const [user,  setUser]  = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // Appelé après login/register réussi
  function login(userData, tokenData) {
    localStorage.setItem('user',  JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
    setUser(userData)
    setToken(tokenData)
  }

  // Appelé au logout
  function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook raccourci pour utiliser le contexte dans n'importe quel composant
export function useAuth() {
  return useContext(AuthContext)
}