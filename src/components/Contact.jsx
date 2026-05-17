import React, { useState, useEffect, useRef } from "react";
import {
  EnvelopeFill,
  BusFrontFill,
  CheckCircleFill,
  ExclamationTriangleFill,
  PersonFill,
  ChatLeftTextFill,
  BellFill,
  GeoAltFill,
  TelephoneFill,
  ClockFill,
} from "react-bootstrap-icons";
import "../index.css";

/* ── Hook de révélation au scroll (réutilisé depuis Home) ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Sujets disponibles pour le problème signalé ── */
const SUBJECTS = [
  "Retard d'un bus",
  "Problème de ticket",
  "Comportement du conducteur",
  "État du véhicule",
  "Arrêt manquant",
  "Suggestion d'amélioration",
  "Autre",
];

export default function Contact() {
  /* ── État du formulaire ── */
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  /* ── État de soumission : null | "loading" | "success" | "error" ── */
  const [status, setStatus] = useState(null);

  /* ── Erreurs de validation par champ ── */
  const [errors, setErrors] = useState({});

  /* ── Refs pour les animations au scroll ── */
  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [formRef, formVisible] = useScrollReveal(0.1);
  const [infoRef, infoVisible] = useScrollReveal(0.1);

  /* ── Ref pour le timeout de soumission ── */
  const timeoutRef = useRef(null);

  /* ── Nettoie le timeout au démontage ── */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ── Met à jour un champ du formulaire ── */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    /* Efface l'erreur du champ modifié */
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  /* ── Validation simple avant envoi ── */
  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Votre nom est requis.";
    if (!form.email.trim()) newErrors.email = "Votre email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Format d'email invalide.";
    if (!form.subject) newErrors.subject = "Veuillez choisir un sujet.";
    if (!form.message.trim())
      newErrors.message = "Le message ne peut pas être vide.";
    return newErrors;
  }

  /* ── Simule l'envoi du formulaire (pas de vrai backend) ── */
  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("loading");
    /* Efface tout timeout précédent */
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    /* Simulation d'un délai réseau de 1.5 secondes */
    timeoutRef.current = setTimeout(() => {
      /* Succès simulé à 90% du temps, erreur à 10% pour démonstration */
      setStatus(Math.random() > 0.1 ? "success" : "error");
    }, 1500);
  }

  /* ── Réinitialise le formulaire après succès ── */
  function handleReset() {
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribe: false,
    });
    setErrors({});
    setStatus(null);
  }

  return (
    <div className="contact-page">
      {/* ====================================================
          EN-TÊTE HÉRO — Animation d'entrée de page
      ==================================================== */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        {/* Voile semi-transparent pour lisibilité */}
        <div className="contact-hero-overlay" />

        <div
          className="container position-relative text-center"
          style={{ zIndex: 1 }}
        >
          {/* Icône décorative animée */}
          <div className="contact-hero-icon reveal-up">
            <BusFrontFill size={32} />
          </div>

          {/* Titre principal */}
          <h1
            className="contact-hero-title reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            Contactez-nous
          </h1>

          {/* Sous-titre */}
          <p
            className="contact-hero-subtitle reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            Un problème ? Une suggestion ? Abonnez-vous à nos actualités.
            <br />
            Nous sommes à votre écoute.
          </p>

          {/* Séparateur décoratif */}
          <div
            className="d-flex align-items-center justify-content-center gap-3 reveal-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ====================================================
          CORPS PRINCIPAL — Formulaire + Infos de contact
      ==================================================== */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div className="row g-5 align-items-start">
            {/* ── COLONNE GAUCHE : Formulaire ── */}
            <div
              ref={formRef}
              className={`col-lg-7 scroll-reveal ${formVisible ? "revealed" : ""}`}
            >
              <div className="contact-form-card reveal-left">
                {/* ── État : Succès ── */}
                {status === "success" && (
                  <div className="contact-success-state text-center py-4">
                    <div className="contact-success-icon mb-3">
                      <CheckCircleFill size={56} className="text-success" />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: "#1e3a5f" }}>
                      Message envoyé !
                    </h3>
                    <p className="text-secondary mb-1">
                      Merci <strong>{form.name || "vous"}</strong>, votre
                      message a bien été reçu.
                    </p>
                    {form.subscribe && (
                      <p className="contact-subscribe-confirm mb-4">
                        <BellFill className="me-2" />
                        Vous êtes abonné(e) aux actualités City Trans Fes.
                      </p>
                    )}
                    <button className="btn-ctf-primary" onClick={handleReset}>
                      Envoyer un autre message
                    </button>
                  </div>
                )}

                {/* ── État : Erreur serveur ── */}
                {status === "error" && (
                  <div className="contact-error-state text-center py-4">
                    <div className="mb-3">
                      <ExclamationTriangleFill
                        size={52}
                        className="text-danger"
                      />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: "#1e3a5f" }}>
                      Une erreur est survenue
                    </h3>
                    <p className="text-secondary mb-4">
                      Impossible d'envoyer votre message pour le moment.
                      <br />
                      Veuillez réessayer ou nous appeler directement.
                    </p>
                    <button
                      className="btn-ctf-primary"
                      onClick={() => setStatus(null)}
                    >
                      Réessayer
                    </button>
                  </div>
                )}

                {/* ── Formulaire principal (visible si pas success/error) ── */}
                {(status === null || status === "loading") && (
                  <form onSubmit={handleSubmit}>
                    {/* En-tête du formulaire */}
                    <div className="mb-4">
                      <span className="home-section-label">
                        Formulaire de contact
                      </span>
                      <h2 className="contact-form-title mt-1">Écrivez-nous</h2>
                    </div>

                    {/* Champ : Nom complet */}
                    <div className="contact-field-group mb-3">
                      <label htmlFor="contact-name" className="contact-label">
                        <PersonFill className="me-2 text-primary" />
                        Nom complet
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ex : Mehdi Amine"
                        className={`contact-input ${errors.name ? "contact-input--error" : ""}`}
                        disabled={status === "loading"}
                        aria-describedby={
                          errors.name ? "contact-name-error" : undefined
                        }
                        aria-invalid={!!errors.name}
                      />
                      {/* Message d'erreur du champ */}
                      {errors.name && (
                        <span
                          id="contact-name-error"
                          className="contact-error-msg"
                        >
                          <ExclamationTriangleFill className="me-1" size={12} />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Champ : Adresse email */}
                    <div className="contact-field-group mb-3">
                      <label className="contact-label">
                        <EnvelopeFill className="me-2 text-primary" />
                        Adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Ex : aminemehdi@email.com"
                        className={`contact-input ${errors.email ? "contact-input--error" : ""}`}
                        disabled={status === "loading"}
                      />
                      {errors.email && (
                        <span className="contact-error-msg">
                          <ExclamationTriangleFill className="me-1" size={12} />
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Champ : Sujet (liste déroulante) */}
                    <div className="contact-field-group mb-3">
                      <label className="contact-label">
                        <ChatLeftTextFill className="me-2 text-primary" />
                        Sujet
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`contact-input contact-select ${errors.subject ? "contact-input--error" : ""}`}
                        disabled={status === "loading"}
                      >
                        <option value="">-- Choisissez un sujet --</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <span className="contact-error-msg">
                          <ExclamationTriangleFill className="me-1" size={12} />
                          {errors.subject}
                        </span>
                      )}
                    </div>

                    {/* Champ : Message */}
                    <div className="contact-field-group mb-3">
                      <label className="contact-label">
                        <ChatLeftTextFill className="me-2 text-primary" />
                        Votre message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Décrivez votre problème ou votre suggestion..."
                        className={`contact-input contact-textarea ${errors.message ? "contact-input--error" : ""}`}
                        disabled={status === "loading"}
                      />
                      {errors.message && (
                        <span className="contact-error-msg">
                          <ExclamationTriangleFill className="me-1" size={12} />
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Case à cocher : Abonnement aux actualités */}
                    <div className="contact-subscribe-row mb-4">
                      <label className="contact-subscribe-label">
                        <input
                          type="checkbox"
                          name="subscribe"
                          checked={form.subscribe}
                          onChange={handleChange}
                          className="contact-checkbox"
                          disabled={status === "loading"}
                        />
                        <div className="contact-subscribe-text">
                          <span className="fw-semibold">
                            <BellFill className="me-2 text-primary" size={13} />
                            S'abonner aux actualités City Trans Fes
                          </span>
                          <span className="contact-subscribe-desc">
                            Recevez les nouvelles lignes, horaires et offres
                            directement par email.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Bouton d'envoi */}
                    <button
                      type="submit"
                      className="btn-ctf-primary w-100 justify-content-center contact-submit-btn"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        /* Spinner pendant l'envoi simulé */
                        <>
                          <span className="contact-spinner" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <EnvelopeFill /> Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── COLONNE DROITE : Informations de contact ── */}
            <div
              ref={infoRef}
              className={`col-lg-5 scroll-reveal ${infoVisible ? "revealed" : ""}`}
            >
              <div className="contact-info-col reveal-right">
                {/* Carte : Adresse */}
                <div
                  className="contact-info-card contact-info-stagger"
                  style={{ "--ii": 1 }}
                >
                  <div className="contact-info-icon-wrap">
                    <GeoAltFill size={20} />
                  </div>
                  <div>
                    <h6 className="contact-info-title">Notre adresse</h6>
                    <p className="contact-info-text mb-0">
                      ISTA Hay Al Adarissa
                      <br />
                      Fès, Maroc
                    </p>
                  </div>
                </div>

                {/* Carte : Téléphone */}
                <div
                  className="contact-info-card contact-info-stagger"
                  style={{ "--ii": 2 }}
                >
                  <div className="contact-info-icon-wrap">
                    <TelephoneFill size={20} />
                  </div>
                  <div>
                    <h6 className="contact-info-title">Téléphone</h6>
                    <p className="contact-info-text mb-0">+212 612 345 678</p>
                  </div>
                </div>

                {/* Carte : Email */}
                <div
                  className="contact-info-card contact-info-stagger"
                  style={{ "--ii": 3 }}
                >
                  <div className="contact-info-icon-wrap">
                    <EnvelopeFill size={20} />
                  </div>
                  <div>
                    <h6 className="contact-info-title">Email</h6>
                    <a
                      href="mailto:contact@citytransfes.ma"
                      className="contact-info-text footer-link mb-0 d-block"
                    >
                      contact@citytransfes.ma
                    </a>
                  </div>
                </div>

                {/* Carte : Horaires */}
                <div
                  className="contact-info-card contact-info-stagger"
                  style={{ "--ii": 4 }}
                >
                  <div className="contact-info-icon-wrap">
                    <ClockFill size={20} />
                  </div>
                  <div>
                    <h6 className="contact-info-title">Horaires du support</h6>
                    <p className="contact-info-text mb-0">
                      Lun – Ven : 08h00 – 17h00
                      <br />
                      Sam : 09h00 – 13h00
                    </p>
                  </div>
                </div>

                {/* Encart abonnement newsletter */}
                <div
                  className="contact-newsletter-box contact-info-stagger"
                  style={{ "--ii": 5 }}
                >
                  <BellFill size={22} className="mb-2" />
                  <h6 className="fw-bold mb-1">Restez informé</h6>
                  <p className="mb-0" style={{ fontSize: 13, opacity: 0.85 }}>
                    Abonnez-vous via le formulaire pour recevoir toutes les
                    actualités, nouveautés de lignes et offres spéciales de City
                    Trans Fes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
