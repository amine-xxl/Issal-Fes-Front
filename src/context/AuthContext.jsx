import { createContext, useContext, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  function login(userData, tokenData) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
    setUser(userData);
    setToken(tokenData);
    showToast(`Connexion réussie. Bienvenue ${userData.name} !`);
  }

  function logout() {
    // on appelle l'API pour révoquer le token côté serveur (bonne pratique Sanctum)
    if (token) {
      fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }).catch(() => {
        // Silently fail — on nettoie quand même côté client
      });
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    showToast("Déconnexion réussie. À bientôt !");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showToast }}>
      {children}

      {toast && (
        <div className="auth-toast">
          <div className="d-flex align-items-center gap-3">
            <CheckCircleFill className="auth-toast-icon" size={24} />
            <span className="fw-bold auth-toast-text">{toast}</span>
          </div>
          <div className="auth-toast-progress" />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
