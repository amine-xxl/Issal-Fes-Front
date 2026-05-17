import { createContext, useContext, useState, useEffect } from "react"
import { CheckCircleFill } from "react-bootstrap-icons"

// Contexte global — accessible partout dans l'app
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Au démarrage, on lit localStorage (si déjà connecté avant)
  const [user,  setUser]  = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // ── État pour le Toast (message de succès) ──
  const [toast, setToast] = useState(null)

  // Affiche un toast qui disparaît après 4 secondes
  function showToast(message) {
    setToast(message)
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Appelé après login/register réussi
  function login(userData, tokenData) {
    localStorage.setItem('user',  JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
    setUser(userData)
    setToken(tokenData)
    // Afficher le message de bienvenue
    showToast("Connexion réussie. Bienvenue ! 🎉")
  }

  // Appelé au logout
  function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    // Afficher le message de déconnexion
    showToast("Déconnexion réussie. À bientôt !")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showToast }}>
      {children}
      
      {/* ── Toast Global UI (s'affiche si toast !== null) ── */}
      {toast && (
        <div className="auth-toast">
          <div className="d-flex align-items-center gap-3">
            <CheckCircleFill className="auth-toast-icon" size={24} />
            <span className="fw-bold auth-toast-text">{toast}</span>
          </div>
          {/* Barre de progression (dure 4 secondes) */}
          <div className="auth-toast-progress" />
        </div>
      )}
    </AuthContext.Provider>
  )
}

// Hook raccourci pour utiliser le contexte dans n'importe quel composant
export function useAuth() {
  return useContext(AuthContext)
}