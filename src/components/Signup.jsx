import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PersonFill, EnvelopeFill, LockFill, EyeFill, EyeSlashFill, BusFrontFill } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import "../index.css";
import { Spinner } from "react-bootstrap";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [error,        setError]        = useState(null)
  const [errors,       setErrors]       = useState({})
  const [loading,      setLoading]      = useState(false)

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", password_confirmation: "",
    role: "client" // par défaut client
  })

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Checkbox : coché = chauffeur, décoché = client
  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.checked ? 'chauffeur' : 'client' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // sert pour les erreurs qui ne viennent pas de la validation ex:Serveur inaccessible, Erreur inattendue du serveur (500)
    setErrors({})

    try {
      const res  = await fetch('http://127.0.0.1:8000/api/register', {
        method:  'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' //Retourner les erreurs de validation au format JSON (au lieu de HTML par défaut (redirection vers la page Home))
         },
        body:    JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) { //setErrors si erreurs de validation (400)
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setError(data.message || "Erreur lors de l'inscription")
        }
        return
      }

      login(data.user, data.token)
      navigate('/')

    } catch (err) { //serveur down ou autre erreur réseau
      setError('Serveur inaccessible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="auth-card p-4 p-md-5 shadow-lg">

        <div className="text-center mb-4">
          <BusFrontFill className="auth-brand-icon mb-2" />
          <h2 className="auth-title">Issal Fes</h2>
          <p className="auth-subtitle">Créez votre compte pour commencer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field mb-3">
            <label className="auth-label">Nom complet</label>
            <div className="auth-input-wrapper">
              <PersonFill className="auth-input-icon" />
              <input type="text" name="name" className="auth-input"
                placeholder="Mohammed Amine"
                value={formData.name} onChange={handleChange} required />
            </div>
            {errors.name && <small className="text-danger">{errors.name[0]}</small>}
          </div>

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

          <div className="auth-field mb-3">
            <label className="auth-label">Confirmer le mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input type={showConfirm ? "text" : "password"} name="password_confirmation"
                className="auth-input" placeholder="••••••••"
                value={formData.password_confirmation} onChange={handleChange} required />
              <span className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
            {errors.password_confirmation && <small className="text-danger">{errors.password_confirmation[0]}</small>}
          </div>

          {/* Checkbox chauffeur */}
          <div className="form-check mb-4">
            <input type="checkbox" className="form-check-input" id="chauffeurCheck"
              onChange={handleRoleChange} />
            <label className="form-check-label" htmlFor="chauffeurCheck">
              Je suis chauffeur
            </label>
          </div>

          <button type="submit" className="auth-btn w-100 mb-3" disabled={loading}>
{loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Inscription...
              </>
            ) : (
              'S\'inscrire '
            )}          </button>

          <p className="text-center auth-switch mb-0">
            Déjà un compte ?{" "}
            <Link to="/Login" className="auth-link">Se connecter</Link>
          </p>
        </form>

      </div>
    </div>
  )
}