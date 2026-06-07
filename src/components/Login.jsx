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
  /**
   * États locaux :
   * - showPassword : Gère la visibilité du texte dans le champ mot de passe.
   * - formData : Stocke les entrées utilisateur (email, password).
   * - loading : Indique si la requête vers l'API est en cours.
   * - error / errors : Gèrent les messages d'erreur globaux ou par champ.
   */
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // useAuth() permet d'accéder aux données globales de l'utilisateur connecté
  const { login } = useAuth(); 
  const navigate = useNavigate();

  // Met à jour l'état formData dynamiquement lors de la saisie
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  /**
   * handleSubmit : Envoie les données au serveur Laravel.
   * Si l'authentification réussit, on stocke le token et on redirige.
   */
  async function handleSubmit(e) {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // En cas d'erreur 422 (validation) ou 401 (mauvais identifiants)
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setError(data.message || "Identifiants et/ou Mot De Passe incorrects");
        }
        return;
      }

      // Appel de la fonction login du contexte pour persister la session (localStorage + état React)
      login(data.user, data.token);
      
      // Redirection vers la page d'accueil après succès
      navigate("/");
    } catch (err) {
      setError("Serveur inaccessible !");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="auth-card p-4 p-md-5 shadow-lg">
        {/* En-tête : Logo et slogan */}
        <div className="text-center mb-4">
          <BusFrontFill className="auth-brand-icon mb-2" />
          <h2 className="auth-title">Issal Fes</h2>
          <p className="auth-subtitle">
            Bienvenue ! Connectez-vous à votre compte
          </p>
        </div>

        {/* Alerte d'erreur générale */}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Saisie Email */}
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
            {errors.email && (
              <small className="text-danger">{errors.email[0]}</small>
            )}
          </div>

          {/* Saisie Mot de passe avec bascule afficher/masquer */}
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

          {/* Bouton de validation dynamique (affiche un spinner lors du chargement) */}
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

          {/* Lien de redirection vers l'inscription */}
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
