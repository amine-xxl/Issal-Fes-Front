import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PersonFill,
  LockFill,
  BellFill,
  ShieldFill,
  CalendarFill,
  SunFill,
  MoonFill,
  CheckCircleFill,
  ExclamationTriangleFill,
  EyeFill,
  EyeSlashFill,
  PencilFill,
  GearFill,
  TrashFill,
  BoxArrowRight,
} from "react-bootstrap-icons";

/**
 * COMPOSANT : UserInfo
 * RÔLE : Espace personnel de l'utilisateur permettant de gérer son profil.
 * Fonctionnalités : Modification du nom, changement de mot de passe,
 * bascule du thème (Clair/Sombre) et gestion des abonnements email.
 */

// ── URL de l'API Laravel ──
const API_URL = "http://127.0.0.1:8000/api";

// ── Formate une date ISO en français (ex: "12 mai 2026") ──
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UserInfo() {
  const navigate = useNavigate();

  // ── Contexte global : contient les infos de l'user connecté + fonctions de login/logout ──
  const { user, token, login, logout } = useAuth();

  /**
   * THÈME : Gère le mode sombre/clair.
   * On synchronise l'état avec le localStorage pour persister le choix.
   */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Applique l'attribut data-theme sur la balise <html> pour déclencher les variables CSS
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // ── Scroll Reveal : Animations au défilement ──
  const headerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const dangerRef = useRef(null);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [card1Visible, setCard1Visible] = useState(false);
  const [card2Visible, setCard2Visible] = useState(false);
  const [card3Visible, setCard3Visible] = useState(false);
  const [card4Visible, setCard4Visible] = useState(false);
  const [dangerVisible, setDangerVisible] = useState(false);

  useEffect(() => {
    const sections = [
      { ref: headerRef, set: setHeaderVisible },
      { ref: card1Ref, set: setCard1Visible },
      { ref: card2Ref, set: setCard2Visible },
      { ref: card3Ref, set: setCard3Visible },
      { ref: card4Ref, set: setCard4Visible },
      { ref: dangerRef, set: setDangerVisible },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = sections.find((s) => s.ref.current === entry.target);
            if (found) found.set(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // ── Section 1 : Informations personnelles (Update Nom) ──
  const [name, setName] = useState(user?.name || "");
  const [infoStatus, setInfoStatus] = useState(null); // null | "loading" | "success" | "error"
  const [infoError, setInfoError] = useState("");

  /**
   * FONCTION : handleUpdateName
   * Envoie une requête PUT à Laravel pour mettre à jour le nom de l'utilisateur.
   * Utilise le token Bearer (Sanctum) pour l'authentification.
   */
  async function handleUpdateName(e) {
    e.preventDefault();
    setInfoStatus("loading");
    setInfoError("");

    try {
      const res = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Token obligatoire pour l'API
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        // Met à jour les données dans le AuthContext global pour que la Navbar affiche le nouveau nom
        login(data.user, token);
        setInfoStatus("success");
        setTimeout(() => setInfoStatus(null), 3000);
      } else {
        setInfoError(data.message || "Erreur lors de la mise à jour.");
        setInfoStatus("error");
      }
    } catch {
      setInfoError("Serveur inaccessible.");
      setInfoStatus("error");
    }
  }

  // ── Section 2 : Sécurité (Update Mot de passe) ──
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passStatus, setPassStatus] = useState(null);
  const [passError, setPassError] = useState("");

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setPassError("");

    // Validation basique côté client
    if (newPassword !== confirmPassword) {
      setPassError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setPassStatus("loading");

    try {
      const res = await fetch(`${API_URL}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPassStatus("success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPassStatus(null), 3000);
      } else {
        setPassError(data.message || "Mot de passe actuel incorrect.");
        setPassStatus("error");
      }
    } catch {
      setPassError("Serveur inaccessible.");
      setPassStatus("error");
    }
  }

  // ── Section 3 : Notifications (Simulées via localStorage) ──
  const [subscribed, setSubscribed] = useState(
    localStorage.getItem("subscribed") === "true",
  );

  function toggleSubscription() {
    const newVal = !subscribed;
    setSubscribed(newVal);
    localStorage.setItem("subscribed", newVal);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Cas où l'utilisateur accède à la page sans être connecté
  if (!user) {
    return (
      <div className="container text-center mt-5 pt-5">
        <h4>Vous n'êtes pas connecté.</h4>
      </div>
    );
  }

  // Libellé métier du rôle
  const roleLabel =
    user.role === "client"
      ? "Passager"
      : user.role === "chauffeur"
        ? "Chauffeur"
        : "Admin";

  return (
    <div className="container pb-5" style={{ paddingTop: 110, maxWidth: 720 }}>
      {/* ══════════════════════════════════════════
          EN-TÊTE : Identité visuelle de l'utilisateur
      ══════════════════════════════════════════ */}
      <div 
        ref={headerRef} 
        className={`text-center mb-5 scroll-reveal ${headerVisible ? "revealed" : ""}`}
      >
        <div
          className="about-avatar mx-auto mb-3 reveal-up"
          style={{ width: 80, height: 80, fontSize: 32 }}
        >
          <span>{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <h4 className="fw-bold mb-1 reveal-up" style={{ animationDelay: "0.1s" }}>{user.name}</h4>
        <div className="reveal-up" style={{ animationDelay: "0.2s" }}>
          <span className="about-role-badge">{roleLabel}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — PARAMÈTRES DU COMPTE
          Modification du nom et de la sécurité.
      ══════════════════════════════════════════ */}
      <div 
        ref={card1Ref} 
        className={`contact-form-card mb-4 position-relative scroll-reveal ${card1Visible ? "revealed" : ""}`} 
        style={{ marginTop: 80 }}
      >
        <div 
          className="contact-hero-icon position-absolute start-50 translate-middle-x reveal-up" 
          style={{ top: -32, margin: 0, animation: 'none' }}
        >
          <GearFill size={32} />
        </div>

        <div className="d-flex align-items-center gap-2 mb-4">
          <PersonFill size={18} style={{ color: "var(--brand)" }} />
          <h6 className="fw-bold mb-0">Informations personnelles</h6>
        </div>

        <form onSubmit={handleUpdateName}>
          <div className="contact-field-group mb-3">
            <label className="contact-label">Nom complet</label>
            <input
              type="text"
              className="contact-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="contact-field-group mb-4">
            <label className="contact-label">Adresse email</label>
            <input
              type="email"
              className="contact-input"
              value={user.email}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
            <small className="text-secondary" style={{ fontSize: 11 }}>
              L'adresse email est l'identifiant unique et ne peut être changée.
            </small>
          </div>

          {infoStatus === "success" && (
            <div className="d-flex align-items-center gap-2 mb-3" style={{ color: "var(--brand)", fontSize: 13 }}>
              <CheckCircleFill size={14} /> <span>Nom mis à jour avec succès.</span>
            </div>
          )}
          {infoStatus === "error" && (
            <div className="d-flex align-items-center gap-2 mb-3 text-danger" style={{ fontSize: 13 }}>
              <ExclamationTriangleFill size={14} /> <span>{infoError}</span>
            </div>
          )}

          <button type="submit" className="btn-ctf-primary" disabled={infoStatus === "loading"}>
            <PencilFill size={13} />
            {infoStatus === "loading" ? "Mise à jour..." : "Enregistrer le nom"}
          </button>
        </form>

        <hr className="my-4" />

        <div className="d-flex align-items-center gap-2 mb-4">
          <LockFill size={16} style={{ color: "var(--brand)" }} />
          <h6 className="fw-bold mb-0">Sécurité — Mot de passe</h6>
        </div>

        <form onSubmit={handleUpdatePassword}>
          <div className="contact-field-group mb-3">
            <label className="contact-label">Mot de passe actuel</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input
                type={showOld ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <span className="auth-eye" onClick={() => setShowOld(!showOld)}>
                {showOld ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
          </div>

          <div className="contact-field-group mb-3">
            <label className="contact-label">Nouveau mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input
                type={showNew ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="auth-eye" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
          </div>

          <div className="contact-field-group mb-4">
            <label className="contact-label">Confirmer le nouveau mot de passe</label>
            <div className="auth-input-wrapper">
              <LockFill className="auth-input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeSlashFill /> : <EyeFill />}
              </span>
            </div>
          </div>

          {passStatus === "success" && (
            <div className="d-flex align-items-center gap-2 mb-3" style={{ color: "var(--brand)", fontSize: 13 }}>
              <CheckCircleFill size={14} /> <span>Mot de passe modifié avec succès.</span>
            </div>
          )}
          {passStatus === "error" && (
            <div className="d-flex align-items-center gap-2 mb-3 text-danger" style={{ fontSize: 13 }}>
              <ExclamationTriangleFill size={14} /> <span>{passError}</span>
            </div>
          )}

          <button type="submit" className="btn-ctf-primary" disabled={passStatus === "loading"}>
            <LockFill size={13} />
            {passStatus === "loading" ? "Mise à jour..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — PERSONNALISATION
          Gestion du mode sombre.
      ══════════════════════════════════════════ */}
      <div 
        ref={card2Ref}
        className={`contact-form-card mb-4 scroll-reveal ${card2Visible ? "revealed" : ""}`}
      >
        <div className="d-flex align-items-center gap-2 mb-4 reveal-up">
          <SunFill size={18} style={{ color: "var(--brand)" }} />
          <h6 className="fw-bold mb-0">Paramètres d'affichage</h6>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>
              {theme === "dark" ? <MoonFill className="me-2" size={14} /> : <SunFill className="me-2" size={14} />}
              Thème {theme === "dark" ? "Sombre" : "Clair"}
            </p>
            <small className="text-secondary" style={{ fontSize: 12 }}>
              Activez le mode sombre pour reposer vos yeux le soir.
            </small>
          </div>
          <button className="theme-switch" onClick={toggleTheme} aria-label="Toggle dark mode">
            <MoonFill className="theme-icon-moon" size={14} />
            <SunFill className="theme-icon-sun" size={14} />
            <span className="theme-switch-thumb" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — PRÉFÉRENCES DE CONTACT
      ══════════════════════════════════════════ */}
      <div 
        ref={card3Ref}
        className={`contact-form-card mb-4 scroll-reveal ${card3Visible ? "revealed" : ""}`}
      >
        <div className="d-flex align-items-center gap-2 mb-4 reveal-up">
          <BellFill size={18} style={{ color: "var(--brand)" }} />
          <h6 className="fw-bold mb-0">Newsletter & Alertes</h6>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>Abonnement aux actualités</p>
            <small className="text-secondary" style={{ fontSize: 12 }}>
              Recevez par email les changements d'itinéraires et les promos.
            </small>
          </div>
          <button
            onClick={toggleSubscription}
            className={`userinfo-toggle ${subscribed ? "userinfo-toggle--on" : ""}`}
            aria-label="Toggle notifications"
          >
            <span className="userinfo-toggle-thumb" />
          </button>
        </div>

        {subscribed && (
          <div className="d-flex align-items-center gap-2 mt-3" style={{ color: "var(--brand)", fontSize: 13 }}>
            <CheckCircleFill size={13} />
            <span>Vous recevrez nos prochaines actualités par email.</span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          SECTION 4 — STATUT DU COMPTE
          Données en lecture seule issues de la BDD.
      ══════════════════════════════════════════ */}
      <div 
        ref={card4Ref}
        className={`contact-form-card scroll-reveal ${card4Visible ? "revealed" : ""}`}
      >
        <div className="d-flex align-items-center gap-2 mb-4 reveal-up">
          <ShieldFill size={18} style={{ color: "var(--brand)" }} />
          <h6 className="fw-bold mb-0">État du compte</h6>
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span className="text-secondary" style={{ fontSize: 14 }}>Rôle</span>
            <span className="about-role-badge">{roleLabel}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span className="text-secondary" style={{ fontSize: 14 }}>
              <CalendarFill className="me-2" size={13} /> Membre depuis
            </span>
            <span className="fw-semibold" style={{ fontSize: 14 }}>{formatDate(user.created_at)}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2">
            <span className="text-secondary" style={{ fontSize: 14 }}>Statut</span>
            <span className="fw-semibold" style={{ fontSize: 13, color: user.active ? "var(--brand)" : "#dc3545" }}>
              {user.active ? "● Actif" : "● Suspendu"}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 5 — ZONE DE DÉCONNEXION
      ══════════════════════════════════════════ */}
      <div 
        ref={dangerRef}
        className={`contact-form-card mt-4 scroll-reveal ${dangerVisible ? "revealed" : ""}`}
        style={{ border: "1px solid rgba(239, 68, 68, 0.4)" }}
      >
        <div className="d-flex align-items-center gap-2 mb-4 reveal-up">
          <TrashFill size={18} style={{ color: "#ef4444" }} />
          <h6 className="fw-bold mb-0" style={{ color: "#ef4444" }}>Zone sensible</h6>
        </div>

        <div className="d-flex align-items-center justify-content-between reveal-up">
          <div>
            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>Se déconnecter</p>
            <small className="text-secondary" style={{ fontSize: 12 }}>
              Fermer votre session actuelle en toute sécurité.
            </small>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger d-flex align-items-center gap-2"
            style={{ fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: "10px" }}
          >
            <BoxArrowRight size={16} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
