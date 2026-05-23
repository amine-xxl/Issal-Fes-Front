import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  PersonFill,
  EnvelopeFill,
  BusFrontFill,
  ShieldFill,
  CalendarFill,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";

// Formate une date ISO en français (ex: "12 mai 2026")
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UserInfo() {
  // Récupère le user connecté depuis le contexte global
  const { user } = useAuth();

  // Si pas connecté, on affiche un message simple
  if (!user) {
    return (
      <div className="container text-center mt-5 pt-5">
        <h4>Vous n'êtes pas connecté.</h4>
      </div>
    );
  }

  // Libellé du rôle en français
  const roleLabel =
    user.role === "client"
      ? "Passager"
      : user.role === "chauffeur"
        ? "Chauffeur"
        : "Admin";

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", marginTop: "55px" }}
    >
      <div className="auth-card p-4 p-md-5 w-100" style={{ maxWidth: 480 }}>
        {/* Avatar avec initiale + nom + badge rôle */}
        <div className="text-center mb-4">
          <div
            className="about-avatar mx-auto mb-3"
            style={{ width: 80, height: 80, fontSize: 32 }}
          >
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h4 className="fw-bold">{user.name}</h4>
          <span className="about-role-badge">{roleLabel}</span>
        </div>

        <hr />

        {/* Liste des infos du compte */}
        <div className="d-flex flex-column gap-3 mt-3">
          {/* Nom complet */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              <PersonFill size={18} />
            </div>
            <div>
              <h6 className="contact-info-title">Nom complet</h6>
              <p className="contact-info-text mb-0">{user.name}</p>
            </div>
          </div>

          {/* Adresse email */}
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
              <p className="contact-info-text mb-0">{roleLabel}</p>
            </div>
          </div>

          {/* Date d'inscription — vient du champ created_at de la table users */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              <CalendarFill size={18} />
            </div>
            <div>
              <h6 className="contact-info-title">Membre depuis</h6>
              <p className="contact-info-text mb-0">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          {/* Statut du compte — vient du champ "active" (boolean) de la table users */}
          <div className="contact-info-card">
            <div className="contact-info-icon-wrap">
              {user.active ? (
                <CheckCircleFill size={18} style={{ color: "var(--brand)" }} />
              ) : (
                <XCircleFill size={18} className="text-danger" />
              )}
            </div>
            <div>
              <h6 className="contact-info-title">Statut du compte</h6>
              <p className="contact-info-text mb-0">
                {user.active ? "Compte actif" : "Compte désactivé"}
              </p>
            </div>
          </div>

          {/* Affiché uniquement si le user est chauffeur */}
          {user.role === "chauffeur" && (
            <div className="contact-info-card">
              <div className="contact-info-icon-wrap">
                <BusFrontFill size={18} />
              </div>
              <div>
                <h6 className="contact-info-title">Type de compte</h6>
                <p className="contact-info-text mb-0">
                  Chauffeur actif — Issal Fes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
