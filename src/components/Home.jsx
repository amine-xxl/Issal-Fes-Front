/**
 * Composant Home (Page d'accueil)
 * C'est la vitrine principale de l'application Issal Fes.
 * Elle présente les statistiques clés, la flotte de bus, les avis clients et les fonctionnalités.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightCircleFill,
  BusFrontFill,
  GeoAltFill,
  ClockFill,
  ShieldFillCheck,
  PeopleFill,
  StarFill,
  StarHalf,
  ThermometerSnow,
  PersonWheelchair,
  Wifi,
  Leaf,
} from "react-bootstrap-icons";
import "../index.css";

// ── Données des statistiques (section 2) ──
const STATS = [
  { icon: <BusFrontFill />, number: "120+", label: "Autobus Actifs" },
  { icon: <GeoAltFill />, number: "65", label: "Lignes Couvertes" },
  { icon: <PeopleFill />, number: "50K+", label: "Passagers / Jour" },
  { icon: <ClockFill />, number: "18H", label: "Service Quotidien" },
];

// ── Données des étiquettes de la flotte (section 3) ──
const TAGS = [
  [<ThermometerSnow />, "Climatisé"],
  [<PersonWheelchair />, "PMR Accessible"],
  [<Wifi />, "WiFi à Bord"],
  [<Leaf />, "Éco-Friendly"],
];

// ── Données des notes par étoile (section 4) ──
const RATING_BARS = [
  { star: 5, pct: 68 },
  { star: 4, pct: 22 },
  { star: 3, pct: 7 },
  { star: 2, pct: 2 },
  { star: 1, pct: 1 },
];

// ── Données des avis clients (section 4) ──
const REVIEWS = [
  {
    name: "Mehdi S.",
    stars: 5,
    text: "Service impeccable, bus toujours à l'heure. Je recommande vivement !",
  },
  {
    name: "Abderahmane F.",
    stars: 4.5,
    text: "Très bon confort, chauffeurs courtois. Légère amélioration souhaitée aux heures de pointe.",
  },
  {
    name: "Mohammed Sa.",
    stars: 4.5,
    text: "Le WiFi à bord est un vrai plus. Fès méritait ce niveau de transport !",
  },
];

// ── Données des cartes de fonctionnalités (section 5) ──
const FEATURES = [
  {
    icon: <ShieldFillCheck size={26} />,
    title: "Sécurité Garantie",
    desc: "Véhicules inspectés régulièrement, chauffeurs formés aux normes les plus strictes.",
  },
  {
    icon: <ClockFill size={26} />,
    title: "Ponctualité",
    desc: "Réseau optimisé, horaires respectés et suivi en temps réel de chaque ligne.",
  },
  {
    icon: <GeoAltFill size={26} />,
    title: "Couverture Totale",
    desc: "Du centre-ville aux quartiers périphériques, toute Fès est connectée.",
  },
  {
    icon: <StarFill size={26} />,
    title: "Confort Moderne",
    desc: "Bus climatisés, accessibles PMR, avec WiFi à bord sur les lignes principales.",
  },
];

export default function Home() {
  /**
   * État local (useState)
   * hoveredCard : Stocke l'index de la carte survolée pour appliquer des effets CSS.
   */
  const [hoveredCard, setHoveredCard] = useState(null);

  /**
   * Animation au Scroll (Scroll Reveal)
   * On utilise des Refs pour identifier les sections et déclencher les animations CSS 
   * via IntersectionObserver quand l'utilisateur fait défiler la page.
   */
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const videoRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const [statsVisible, setStatsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const sections = [
      { ref: statsRef, set: setStatsVisible },
      { ref: aboutRef, set: setAboutVisible },
      { ref: videoRef, set: setVideoVisible },
      { ref: featuresRef, set: setFeaturesVisible },
      { ref: ctaRef, set: setCtaVisible },
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
      { threshold: 0.15 },
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* ── SECTION 1 : HÉRO (Accroche principale) ── */}
      <section className="home-hero d-flex align-items-center position-relative">
        <div className="home-hero-overlay" />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            {/* Texte et Boutons d'appel à l'action */}
            <div className="col-lg-5 hero-text-enter">
              <span className="home-badge mb-3 d-inline-block">
                <BusFrontFill className="me-2" /> Transport Urbain - ISSAL FES
              </span>

              <h1 className="home-title mb-3">
                Savoir <span className="text-primary">Mieux</span>,<br />
                Se Déplacer <span className="text-primary">Mieux</span>.<br />
                Connectez‑vous
                <br />à Issal Fes.
              </h1>

              <p className="text-secondary fs-6 lh-lg mb-4">
                Issal Fes modernise le transport public — BUS — pour une
                mobilité fluide, sûre et accessible à tous les habitants de Fès.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/Tickets" className="btn-ctf-primary">
                  Acheter un Ticket <ArrowRightCircleFill />
                </Link>
                <Link to="/About" className="btn-ctf-ghost">
                  En Savoir Plus
                </Link>
              </div>
            </div>

            {/* Visuel du bus avec indicateurs dynamiques (Live) */}
            <div className="col-lg-7 hero-image-enter">
              <div className="position-relative">
                <img
                  src="busfes2.webp"
                  alt="Bus Issal Fes"
                  className="w-100 rounded-4 d-block home-bus-img"
                />

                <div className="home-live-badge">
                  <span className="home-green-dot" />
                  En Service
                </div>

                <div className="home-departure-pill">
                  <div className="home-departure-icon">
                    <BusFrontFill />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: 13 }}>
                      Ligne - 15 · Centre Ville
                    </div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: 11, marginTop: 2 }}
                    >
                      Prochain départ : <b className="text-primary">3 min</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : STATISTIQUES ── */}
      <section
        ref={statsRef}
        className={`home-stats py-5 scroll-reveal ${statsVisible ? "revealed" : ""}`}
      >
        <div className="container">
          <div className="row g-3 text-center text-white">
            {/* Génération des 4 stats depuis le tableau STATS */}
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="col-6 col-md-3 stat-item"
                style={{ "--si": i + 1 }}
              >
                <div className="fs-3 mb-2">{stat.icon}</div>
                <div className="home-stat-number">{stat.number}</div>
                <div className="home-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : LA FLOTTE ── */}
      <section
        ref={aboutRef}
        className={`home-section py-5 scroll-reveal ${aboutVisible ? "revealed" : ""}`}
      >
        <div className="container py-4">
          <div className="row align-items-center g-5">
            {/* Texte gauche */}
            <div className="col-lg-5 reveal-left">
              <span className="home-section-label">Notre Flotte</span>
              <h2 className="home-section-title mt-2 mb-3">
                Des Bus Modernes
                <br />
                pour Fès
              </h2>
              <p className="text-secondary lh-lg mb-3">
                Issal Fes opère une flotte de <strong>120+ autobus</strong> de
                dernière génération. Chaque véhicule est régulièrement inspecté
                pour garantir le confort et la sécurité.
              </p>
              <p className="text-secondary lh-lg mb-4">
                Nos bus desservent <strong>35 lignes</strong>, de la médina
                historique aux nouveaux quartiers, avec des passages toutes les{" "}
                <strong>8 minutes</strong> aux heures de pointe.
              </p>

              {/* Étiquettes depuis le tableau TAGS */}
              <div className="d-flex flex-wrap gap-2">
                {TAGS.map(([icon, label], i) => (
                  <span key={i} className="home-tag">
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Image droite avec cartes flottantes */}
            <div className="col-lg-7 reveal-right">
              <div className="position-relative">
                <img
                  src="busfes1.webp"
                  alt="Bus Issal Fes vue de côté"
                  className="w-100 rounded-4 d-block home-bus-img"
                />

                {/* Carte flottante blanche : nombre de bus */}
                <div className="home-float-card-white">
                  <div className="text-primary fs-5 mb-1">
                    <BusFrontFill />
                  </div>
                  <div className="home-float-number text-primary">120+</div>
                  <div className="home-float-label">Autobus en flotte</div>
                </div>

                {/* Carte flottante bleue : note de satisfaction */}
                <div className="home-float-card-blue">
                  <div className="text-warning fs-5 mb-1">
                    <StarFill />
                    <StarFill />
                    <StarFill />
                    <StarFill />
                    <StarHalf />
                  </div>
                  <div className="home-float-number">4.7/5</div>
                  <div className="home-float-label">
                    Satisfaction des clients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : VIDÉO + AVIS ── */}
      <section
        ref={videoRef}
        className={`home-section py-5 scroll-reveal ${videoVisible ? "revealed" : ""}`}
      >
        <div className="container pb-4">
          <div className="row align-items-stretch g-4">
            {/* Vidéo gauche — autoPlay, muette, en boucle */}
            <div className="col-lg-7 reveal-left">
              <div className="home-video-wrapper position-relative rounded-4 overflow-hidden">
                <video
                  src="yutongvid.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-100 h-100 object-fit-cover d-block"
                />
                <div className="home-video-label">
                  <span className="home-red-dot" />
                  Nos City Bus
                </div>
              </div>
            </div>

            {/* Panneau de notes droite */}
            <div className="col-lg-5 d-flex flex-column reveal-right">
              <div className="home-rating-panel flex-fill p-4 rounded-4">
                {/* Score global + barres */}
                <div className="d-flex align-items-center gap-4 pb-3 mb-3 border-bottom">
                  <div className="text-center" style={{ minWidth: 80 }}>
                    <div className="home-big-score text-primary">4.7</div>
                    <div className="text-warning" style={{ fontSize: 14 }}>
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarHalf />
                    </div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: 10, marginTop: 4 }}
                    >
                      sur 5 · 1 240 avis
                    </div>
                  </div>

                  {/* Barres de progression par étoile */}
                  <div className="flex-fill">
                    {RATING_BARS.map(({ star, pct }) => (
                      <div
                        key={star}
                        className="d-flex align-items-center gap-2 mb-1"
                      >
                        <span
                          className="text-secondary"
                          style={{ fontSize: 10, width: 6 }}
                        >
                          {star}
                        </span>
                        <StarFill size={9} className="text-warning" />
                        <div
                          className="flex-fill rounded-pill bg-light overflow-hidden"
                          style={{ height: 6 }}
                        >
                          <div
                            className="rounded-pill bg-warning"
                            style={{ height: "100%", width: `${pct}%` }}
                          />
                        </div>
                        <span
                          className="text-secondary"
                          style={{
                            fontSize: 10,
                            width: 24,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <h6
                  className="fw-bold text-uppercase mb-3"
                  style={{ fontSize: 12, letterSpacing: 1.5 }}
                >
                  Avis Récents
                </h6>

                {/* Avis clients depuis le tableau REVIEWS */}
                {REVIEWS.map((review, i) => (
                  <div
                    key={i}
                    className={`home-review-card ${i < REVIEWS.length - 1 ? "mb-2" : ""}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span
                        className="fw-bold"
                        style={{ fontSize: 13, color: "#1e3a5f" }}
                      >
                        {review.name}
                      </span>
                      {/* Affichage des étoiles pleines + demie si besoin */}
                      <span className="text-warning" style={{ fontSize: 12 }}>
                        {[...Array(Math.floor(review.stars))].map((_, j) => (
                          <StarFill key={j} />
                        ))}
                        {review.stars % 1 !== 0 && <StarHalf />}
                      </span>
                    </div>
                    <p
                      className="mb-0 text-secondary"
                      style={{ fontSize: 12, lineHeight: 1.6 }}
                    >
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : FONCTIONNALITÉS ── */}
      <section
        ref={featuresRef}
        className={`home-section py-5 scroll-reveal ${featuresVisible ? "revealed" : ""}`}
      >
        <div className="container py-3">
          <div className="text-center mb-5 reveal-up">
            <span className="home-section-label">Pourquoi Nous Choisir</span>
            <h2 className="home-section-title mt-2">Un Service d'Excellence</h2>
          </div>

          <div className="row g-4">
            {/* Cartes générées depuis le tableau FEATURES avec délai décalé via --fi */}
            {FEATURES.map((card, i) => (
              <div
                key={i}
                className="col-sm-6 col-lg-3 feature-card-stagger"
                style={{ "--fi": i }}
              >
                <div
                  className={`home-feature-card h-100 ${hoveredCard === i ? "home-feature-card--hovered" : ""}`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="text-primary fs-3 mb-3">{card.icon}</div>
                  <h4 className="fw-bold mb-2" style={{ fontSize: "0.98rem" }}>
                    {card.title}
                  </h4>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.86rem", lineHeight: 1.7 }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 : CTA ZELLIGE ── */}
      <section
        ref={ctaRef}
        className={`home-cta position-relative text-center overflow-hidden scroll-reveal ${ctaVisible ? "revealed" : ""}`}
      >
        {/* Image de fond zellige marocain */}
        <img src="zellige.jpg" alt="" className="home-cta-bg" />

        {/* Voile sombre par-dessus l'image */}
        <div className="home-cta-overlay" />

        {/* Décorations mauresques (arches + diamants aux coins) */}
        <div className="home-arch home-arch--top" />
        <div className="home-arch home-arch--bottom" />
        <div className="home-diamond home-diamond--tl" />
        <div className="home-diamond home-diamond--tr" />
        <div className="home-diamond home-diamond--bl" />
        <div className="home-diamond home-diamond--br" />

        <div className="container position-relative py-5" style={{ zIndex: 3 }}>
          <div className="home-cta-stars mb-3">✦ ✦ ✦</div>

          <span className="home-cta-subtitle d-inline-block mb-3">
            <h4>Bienvenue dans la Ville Millénaire</h4>
          </span>

          <h2 className="home-cta-title mb-3">
            Prêt à Prendre Le Bus
            <br />
            <em className="home-cta-em">à travers Fès ?</em>
          </h2>

          <p className="home-cta-desc mx-auto mb-4">
            <h3>
              De la médina antique aux boulevards modernes, Issal Fes vous
              transporte avec élégance et fiabilité.
            </h3>
          </p>

          {/* Séparateur doré */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <div className="home-divider-line" />
            <div className="home-divider-diamond" />
            <div className="home-divider-line" />
          </div>

          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link to="/Tickets" className="btn-cta-gold">
              Acheter un Ticket <ArrowRightCircleFill />
            </Link>
            <Link to="/Contact" className="btn-cta-ghost">
              Nous Contacter
            </Link>
          </div>

          <div className="home-cta-dots mt-4">◆ ◇ ◆</div>
        </div>
      </section>
    </div>
  );
}
