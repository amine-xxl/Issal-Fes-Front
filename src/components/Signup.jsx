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
  /**
   * - showPassword, showConfirm : Pour basculer la visibilité des mots de passe.
   * - error, errors : Pour gérer les messages d'erreur globaux ou par champ (validation).
   * - loading : Gère l'état visuel du bouton pendant la requête API.
   * - formData : Regroupe toutes les données du formulaire d'inscription.
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Erreur générale (serveur inaccessible, etc.)
  const [error, setError] = useState(null);

  // Erreurs de validation par champ renvoyées par Laravel (ex: email déjà pris)
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

  const { login } = useAuth(); // Hook personnalisé pour stocker user + token
  const navigate = useNavigate();

  // Mise à jour d'un champ texte dynamiquement
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Checkbox "Je suis chauffeur" : définit le rôle dans l'état
  function handleRoleChange(e) {
    setFormData({
      ...formData,
      role: e.target.checked ? "chauffeur" : "client",
    });
  }

  /**
   * handleSubmit
   * Envoie les données à l'API Laravel (/register).
   * Gère les erreurs de validation 422 et la redirection vers l'accueil en cas de succès.
   */
  async function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Important pour recevoir les erreurs de validation en JSON
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Erreurs de validation Laravel (champ vide, mot de passe trop court, etc.)
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setError(data.message || "Erreur lors de l'inscription");
        }
        return;
      }

      // Succès : on enregistre les infos dans le contexte et on redirige
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      // Erreur réseau (serveur éteint)
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

        {/* Affichage de l'erreur globale */}
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
            {/* Erreur spécifique au champ 'name' */}
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

          {/* Mot de passe avec bouton "voir" */}
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

          {/* Checkbox rôle chauffeur : change dynamiquement le rôle envoyé au serveur */}
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

          {/* Bouton avec état de chargement */}
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
