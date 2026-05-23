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

// Liste des sujets disponibles dans le menu déroulant
const SUJETS = [
  "Retard d'un bus",
  "Problème de ticket",
  "Comportement du conducteur",
  "État du véhicule",
  "Arrêt manquant",
  "Suggestion d'amélioration",
  "Autre",
];

export default function Contact() {
  // État du formulaire — tous les champs dans un seul objet
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  // Statut de la soumission : null = formulaire vide, "loading", "success", "error"
  const [status, setStatus] = useState(null);

  // Erreurs de validation renvoyées par Laravel (ex: champ vide, email invalide)
  const [errors, setErrors] = useState({});

  // Refs pour les animations scroll reveal
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  // Observer qui déclenche l'animation quand une section entre dans l'écran
  useEffect(() => {
    const sections = [
      { ref: heroRef, set: setHeroVisible },
      { ref: formRef, set: setFormVisible },
      { ref: infoRef, set: setInfoVisible },
    ];

    const observer = new IntersectionObserver( // API native pour détecter quand un élément entre dans le viewport (pas besoin de librairie externe)
      (entries) => { // entries contient les éléments observés qui ont changé de visibilité
        entries.forEach((entry) => { // Pour chaque élément qui a changé de visibilité
          if (entry.isIntersecting) { // Si la section est visible à l'écran
            // On cherche quelle section vient d'apparaître et on la marque visible
            const found = sections.find((s) => s.ref.current === entry.target);
            if (found) found.set(true);
          }
        });
      },
      { threshold: 0.1 }, // Une petite partie de la section doit être visible pour déclencher l'animation
    );

    // On attache l'observer à chaque section
    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    // Nettoyage quand le composant se démonte
    return () => observer.disconnect();
  }, []);

  // Mise à jour d'un champ quand l'utilisateur tape
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      // Si c'est une checkbox on prend checked, sinon la valeur texte
      [name]: type === "checkbox" ? checked : value,
    });

    // On efface l'erreur du champ dès que l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  }

  // Envoi du formulaire à l'API Laravel
  function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    setStatus("loading");
    setErrors({});

    fetch("http://127.0.0.1:8000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // On envoie du JSON
        Accept: "application/json", // Laravel renvoie du JSON et non du HTML
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (res.ok) {
          // Succès : le message a été enregistré
          setStatus("success");
        } else if (res.status === 422 && data?.errors) {
          // Erreur de validation Laravel (champs manquants ou invalides)
          setErrors(data.errors);
          setStatus("error");
        } else {
          // Autre erreur serveur
          setStatus("error");
        }
      })
      .catch(() => {
        // Erreur réseau (serveur éteint, pas de connexion...)
        setStatus("error");
      });
  }

  // Réinitialise tout pour permettre un nouvel envoi
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
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        {/* Voile semi-transparent par-dessus l'arabesque */}
        <div className="contact-hero-overlay" />

        <div
          className="container position-relative text-center"
          style={{ zIndex: 1 }}
        >
          <div className="contact-hero-icon reveal-up">
            <BusFrontFill size={32} />
          </div>

          <h1
            className="contact-hero-title reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            Contactez-nous
          </h1>

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

      {/* ── BODY : Formulaire + Infos ── */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div className="row g-5 align-items-start">
            {/* ── COLONNE GAUCHE : Formulaire ── */}
            <div
              ref={formRef}
              className={`col-lg-7 scroll-reveal ${formVisible ? "revealed" : ""}`} // On ajoute la classe "revealed" pour déclencher l'animation CSS quand la section devient visible
            >
              <div className="contact-form-card reveal-left">
                {/* Affichage si le message a été envoyé avec succès */}
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
                    {/* Message supplémentaire si l'utilisateur s'est abonné */}
                    {form.subscribe && (
                      <p className="contact-subscribe-confirm mb-4">
                        <BellFill className="me-2" />
                        Vous êtes abonné(e) aux actualités Issal Fes.
                      </p>
                    )}
                    <button className="btn-ctf-primary" onClick={handleReset}>
                      Envoyer un autre message
                    </button>
                  </div>
                )}

                {/* Affichage en cas d'erreur serveur */}
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

                {/* Formulaire principal — visible uniquement si pas de succès/erreur */}
                {(status === null || status === "loading") && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <span className="home-section-label">
                        Formulaire de contact
                      </span>
                      <h2 className="contact-form-title mt-1">Écrivez-nous</h2>
                    </div>

                    {/* Champ Nom */}
                    <div className="contact-field-group mb-3">
                      <label className="contact-label">
                        <PersonFill className="me-2 text-primary" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ex : Mehdi Amine"
                        className={`contact-input ${errors.name ? "contact-input--error" : ""}`}
                        disabled={status === "loading"}
                      />
                      {/* Erreur Laravel pour ce champ */}
                      {errors.name && (
                        <span className="contact-error-msg">
                          <ExclamationTriangleFill className="me-1" size={12} />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Champ Email */}
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

                    {/* Champ Sujet — liste déroulante */}
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
                        {/* On génère les options depuis le tableau SUJETS */}
                        {SUJETS.map((s) => (
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

                    {/* Champ Message */}
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

                    {/* Checkbox abonnement newsletter */}
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
                            S'abonner aux actualités Issal Fes
                          </span>
                          <span className="contact-subscribe-desc">
                            Recevez les nouvelles lignes, horaires et offres
                            directement par email.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Bouton d'envoi — désactivé pendant le chargement */}
                    <button
                      type="submit"
                      className="btn-ctf-primary w-100 justify-content-center contact-submit-btn"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
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
                {/* Adresse */}
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

                {/* Téléphone */}
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

                {/* Email */}
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
                      href="mailto:contact@issalfes.ma"
                      className="contact-info-text footer-link mb-0 d-block"
                    >
                      contact@issalfes.ma
                    </a>
                  </div>
                </div>

                {/* Horaires */}
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

                {/* Encart newsletter */}
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
