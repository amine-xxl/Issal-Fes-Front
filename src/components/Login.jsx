import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill, BusFrontFill } from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData]         = useState({ email: "", password: "" })
  const [error, setError]               = useState(null)
  const [errors, setErrors]             = useState({})
  const [loading, setLoading]           = useState(false)

  const { login } = useAuth()   // fonction login du contexte
  const navigate  = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setErrors({})

    try {
      // Appel API Laravel
      const res  = await fetch('http://127.0.0.1:8000/api/login', {
        method:  'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' //Retourner les erreurs de validation au format JSON (au lieu de HTML par défaut (redirection vers la page Home))
         },
        body:    JSON.stringify(formData)
      })

      const data = await res.json()

      // Mauvais identifiants
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setError(data.message || 'Identifiants incorrects')
        }
        return
      }

      // Stocker user + token, rediriger
      login(data.user, data.token)
      navigate('/')

    } catch (err) {
      setError('Serveur inaccessible !')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="auth-card p-4 p-md-5 shadow-lg">

        <div className="text-center mb-4">
          <BusFrontFill className="auth-brand-icon mb-2" />
          <h2 className="auth-title">Issal Fes</h2>
          <p className="auth-subtitle">Bienvenue ! Connectez-vous à votre compte</p>
        </div>

        {/* Erreur API */}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field mb-3">
            <label className="auth-label">Adresse Email</label>
            <div className="auth-input-wrapper">
              <EnvelopeFill className="auth-input-icon" />
              <input type="email" name="email" className="auth-input"
                placeholder="vous@exemple.ma"
                value={formData.email} onChange={handleChange} required />
            </div>
            {errors.email && <small className="text-danger">{errors.email[0]}</small>}
          </div>

          <div className="auth-field mb-3">
            <label className="auth-label">Mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input type={showPassword ? "text" : "password"} name="password"
                className="auth-input" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required />
              <span className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
            {errors.password && <small className="text-danger">{errors.password[0]}</small>}
          </div>

          <button type="submit" className="auth-btn w-100 mb-3" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>

          <p className="text-center auth-switch mb-0">
            Pas encore de compte ?{" "}
            <Link to="/Signup" className="auth-link">Créer un compte</Link>
          </p>
        </form>

      </div>
    </div>
  )
}