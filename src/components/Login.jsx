import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeFill,
  LockFill,
  EyeFill,
  EyeSlashFill,
  BusFrontFill,
} from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Login() {
  // Afficher ou cacher le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // Données du formulaire (email + mot de passe)
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Erreur générale (ex: serveur inaccessible, mauvais identifiants)
  const [error, setError] = useState(null);

  // Erreurs de validation par champ renvoyées par Laravel
  const [errors, setErrors] = useState({});

  // Indique si la requête est en cours (pour désactiver le bouton)
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Fonction login du contexte global (stocke user + token)
  const navigate = useNavigate();

  // Mise à jour d'un champ quand l'utilisateur tape
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Envoi du formulaire à l'API Laravel
  async function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Laravel renvoie du JSON et non du HTML
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Erreur de validation (ex: champ vide) ou mauvais identifiants
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setError(
            data.message || "Identifiants et/ou Mot De Passe incorrects",
          );
        }
        return;
      }

      // Succès : on stocke le user et le token, puis on redirige vers l'accueil
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      // Erreur réseau (serveur éteint, pas de connexion...)
      setError("Serveur inaccessible !");
    } finally {
      // Dans tous les cas, on arrête le spinner
      setLoading(false);
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="auth-card p-4 p-md-5 shadow-lg">
        {/* En-tête avec logo et titre */}
        <div className="text-center mb-4">
          <BusFrontFill className="auth-brand-icon mb-2" />
          <h2 className="auth-title">Issal Fes</h2>
          <p className="auth-subtitle">
            Bienvenue ! Connectez-vous à votre compte
          </p>
        </div>

        {/* Message d'erreur général (affiché si error !== null) */}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Champ Email */}
          <div className="auth-field mb-3">
            <label className="auth-label">Adresse Email</label>
            <div className="auth-input-wrapper">
              <EnvelopeFill className="auth-input-icon" />
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="vous@exemple.ma"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Erreur Laravel pour ce champ */}
            {errors.email && (
              <small className="text-danger">{errors.email[0]}</small>
            )}
          </div>

          {/* Champ Mot de passe avec bouton voir/cacher */}
          <div className="auth-field mb-3">
            <label className="auth-label">Mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Icône eye pour afficher/masquer le mot de passe */}
              <span
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
            {errors.password && (
              <small className="text-danger">{errors.password[0]}</small>
            )}
          </div>

          {/* Bouton de connexion — désactivé pendant le chargement */}
          <button
            type="submit"
            className="auth-btn w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>

          <p className="text-center auth-switch mb-0">
            Pas encore de compte ?{" "}
            <Link to="/Signup" className="auth-link">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
