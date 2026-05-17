import React from "react";
import { useAuth } from "../context/AuthContext";
import { PersonFill, EnvelopeFill, BusFrontFill, ShieldFill } from "react-bootstrap-icons";

export default function UserInfo() {
  // ── Récupérer le user depuis le contexte ──
  const { user } = useAuth()

  // Si pas connecté, message simple
  if (!user) {
    return (
      <div className="container text-center mt-5 pt-5">
        <h4>Vous n'êtes pas connecté.</h4>
      </div>
    )
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '55px' }}>
      <div className="auth-card p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: 480 }}>

        {/* Avatar avec initiale */}
        <div className="text-center mb-4">
          <div className="about-avatar mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h4 className="fw-bold">{user.name}</h4>
          {/* Badge rôle */}
          <span className="about-role-badge">
            {user.role === 'client' ? ' Passager' : ' Chauffeur'}
          </span>
        </div>

        <hr />

        {/* Infos du compte */}
        <div className="d-flex flex-column gap-3 mt-3">

          {/* Nom */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              <PersonFill size={18} />
            </div>
            <div>
              <h6 className="contact-info-title">Nom complet</h6>
              <p className="contact-info-text mb-0">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              <EnvelopeFill size={18} />
            </div>
            <div>
              <h6 className="contact-info-title">Adresse Email</h6>
              <p className="contact-info-text mb-0">{user.email}</p>
            </div>
          </div>

          {/* Rôle */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              <ShieldFill size={18} />
            </div>
            <div>
              <h6 className="contact-info-title">Rôle</h6>
              <p className="contact-info-text mb-0">
                {user.role === 'client' ? 'Passager (Client)' : 'Chauffeur'}
              </p>
            </div>
          </div>

          {/* Bus (si chauffeur) */}
          {user.role === 'chauffeur' && (
            <div className="contact-info-card">
              <div className="contact-info-icon-wrap">
                <BusFrontFill size={18} />
              </div>
              <div>
                <h6 className="contact-info-title">Statut</h6>
                <p className="contact-info-text mb-0">Chauffeur actif</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}