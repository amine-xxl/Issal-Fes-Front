import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PersonFill,
  EnvelopeFill,
  LockFill,
  EyeFill,
  EyeSlashFill,
  BusFrontFill,
} from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Signup() {
  // Afficher ou cacher les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Erreur générale (serveur inaccessible, etc.)
  const [error, setError] = useState(null);

  // Erreurs de validation par champ renvoyées par Laravel
  const [errors, setErrors] = useState({});

  // Spinner pendant l'envoi
  const [loading, setLoading] = useState(false);

  // Données du formulaire — role "client" par défaut
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client",
  });

  const { login } = useAuth(); // Stocke user + token après inscription réussie
  const navigate = useNavigate();

  // Mise à jour d'un champ texte
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Checkbox "Je suis chauffeur" : coché = chauffeur, décoché = client
  function handleRoleChange(e) {
    setFormData({
      ...formData,
      role: e.target.checked ? "chauffeur" : "client",
    });
  }

  // Envoi du formulaire à l'API Laravel
  async function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Laravel renvoie du JSON et non du HTML
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Erreurs de validation Laravel (champ vide, email déjà pris, etc.)
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setError(data.message || "Erreur lors de l'inscription");
        }
        return;
      }

      // Succès : on connecte l'utilisateur et on redirige
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      // Erreur réseau (serveur éteint, pas de connexion...)
      setError("Serveur inaccessible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="auth-card p-4 p-md-5 shadow-lg">
        {/* En-tête */}
        <div className="text-center mb-4">
          <BusFrontFill className="auth-brand-icon mb-2" />
          <h2 className="auth-title">Issal Fes</h2>
          <p className="auth-subtitle">Créez votre compte pour commencer</p>
        </div>

        {/* Erreur générale */}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div className="auth-field mb-3">
            <label className="auth-label">Nom complet</label>
            <div className="auth-input-wrapper">
              <PersonFill className="auth-input-icon" />
              <input
                type="text"
                name="name"
                className="auth-input"
                placeholder="Mohammed Amine"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {errors.name && (
              <small className="text-danger">{errors.name[0]}</small>
            )}
          </div>

          {/* Email */}
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

          {/* Mot de passe */}
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

          {/* Confirmation mot de passe */}
          <div className="auth-field mb-3">
            <label className="auth-label">Confirmer le mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                className="auth-input"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              <span
                className="auth-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
            {errors.password_confirmation && (
              <small className="text-danger">
                {errors.password_confirmation[0]}
              </small>
            )}
          </div>

          {/* Checkbox rôle chauffeur */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="chauffeurCheck"
              onChange={handleRoleChange}
            />
            <label className="form-check-label" htmlFor="chauffeurCheck">
              Je suis chauffeur
            </label>
          </div>

          {/* Bouton inscription */}
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
                Inscription...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>

          <p className="text-center auth-switch mb-0">
            Déjà un compte ?{" "}
            <Link to="/Login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
