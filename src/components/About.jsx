/**
 * Page "À propos"
 * Présente le matériel roulant (Bus Yutong), les fonctionnalités de l'application
 * et l'équipe de développement.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BusFrontFill,
  PeopleFill,
  Speedometer,
  ShieldCheck,
  GearFill,
  StarFill,
  PhoneFill,
  MapFill,
  TicketFill,
  BellFill,
  Github,
  Linkedin,
  EnvelopeFill,
} from "react-bootstrap-icons";
import "../index.css";

export default function About() {
  // État pour gérer la photo actuellement affichée dans la galerie du bus
  const [activePhoto, setActivePhoto] = useState(0);

  /**
   * Logique d'animation au scroll (Scroll Reveal) :
   * On utilise des Refs pour cibler les sections et des états (booféens) 
   * pour déclencher les classes CSS d'animation (.revealed).
   */
  const heroRef = useRef(null);
  const busRef = useRef(null);
  const specsRef = useRef(null);
  const appRef = useRef(null);
  const teamRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [busVisible, setBusVisible] = useState(false);
  const [specsVisible, setSpecsVisible] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);

  // IntersectionObserver : Détecte quand un élément devient visible à l'écran
  useEffect(() => {
    const sections = [
      { ref: heroRef, set: setHeroVisible },
      { ref: busRef, set: setBusVisible },
      { ref: specsRef, set: setSpecsVisible },
      { ref: appRef, set: setAppVisible },
      { ref: teamRef, set: setTeamVisible },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si la section entre dans le viewport (seuil de 15%)
          if (entry.isIntersecting) {
            const found = sections.find((s) => s.ref.current === entry.target);
            if (found) found.set(true); // Active l'animation pour cette section
          }
        });
      },
      { threshold: 0.15 },
    );

    // On attache l'observateur à chaque section
    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    // Nettoyage de l'observateur lors du démontage du composant
    return () => observer.disconnect();
  }, []);

  // Données de la galerie
  const photos = [
    { src: "sideview.avif", caption: "Extérieur — vue latérale" },
    { src: "avantpic.webp", caption: "Extérieur — face avant" },
    { src: "interrior.png", caption: "Intérieur — espace passagers" },
    { src: "poste_conduite.webp", caption: "Intérieur — poste de conduite" },
  ];

  return (
    <div className="about-page">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />

        <div
          className="container position-relative text-center"
          style={{ zIndex: 1 }}
        >
          <div className="contact-hero-icon reveal-up">
            <BusFrontFill size={32} />
          </div>

          <h1 className="contact-hero-title reveal-up">À propos</h1>

          <p className="contact-hero-subtitle reveal-up">
            Découvrez le bus qui dessert Fès, l'application qui simplifie
            <br />
            vos déplacements, et l'équipe derrière le projet.
          </p>

          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up">
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ── BUS ── */}
      <section
        ref={busRef}
        className={`contact-body py-5 scroll-reveal ${busVisible ? "revealed" : ""}`}
      >
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 reveal-left">
              <span className="home-section-label d-block mb-2">Le Bus</span>

              <h2 className="home-section-title mb-3">
                Yutong <span style={{ color: "var(--brand)" }}>ZK6126HG</span>
              </h2>

              <p className="text-secondary mb-4" style={{ lineHeight: 1.9 }}>
                Le Yutong ZK6126HG est un bus urbain 12 mètres de grande
                capacité, conçu pour les réseaux de transport public à forte
                affluence. Avec son plancher bas, ses grandes portes d'accès et
                sa motorisation Euro IV, il offre un service fiable, confortable
                et accessible à tous les voyageurs du réseau Issal Fes.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <span className="home-tag">12 mètres</span>
                <span className="home-tag">Euro IV</span>
                <span className="home-tag">90+ passagers</span>
                <span className="home-tag">Plancher bas</span>
                <span className="home-tag">Climatisation</span>
              </div>
            </div>

            {/* Galerie photos */}
            <div className="col-lg-7 reveal-right">
              <div className="about-gallery">
                <div className="about-gallery-main position-relative rounded-4 overflow-hidden shadow-lg mb-3">
                  <img
                    src={photos[activePhoto].src}
                    alt={photos[activePhoto].caption}
                    className="about-gallery-img"
                  />
                  <div className="about-gallery-caption">
                    {photos[activePhoto].caption}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="d-flex gap-2">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhoto(index)}
                      className={`about-thumb ${activePhoto === index ? "about-thumb--active" : ""}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="about-thumb-img"
                      />
                      <span className="about-thumb-num">{index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECS ── */}
      <section
        ref={specsRef}
        className={`contact-body py-5 scroll-reveal ${specsVisible ? "revealed" : ""}`}
      >
        <div className="container py-3">
          <div className="text-center mb-5 reveal-up">
            <span className="home-section-label d-block mb-2">
              Fiche technique
            </span>
            <h2 className="home-section-title">Spécifications</h2>
          </div>

          <div className="row g-3 justify-content-center">
            {[
              { value: "12 m", label: "Longueur" },
              { value: "90 – 95 passagers", label: "Capacité" },
              { value: "Euro IV", label: "Norme émission" },
              { value: "192 kW", label: "Puissance" },
              { value: "34.4 L / 100 km", label: "Consommation" },
              { value: "3 075 mm", label: "Hauteur" },
              { value: "11 000 kg", label: "Poids à vide" },
              { value: "ZK6118GCRC", label: "Châssis" },
            ].map((spec, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="about-spec-card text-center">
                  <div className="about-spec-value">{spec.value}</div>
                  <div className="about-spec-label">{spec.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="about-quality-row d-flex flex-wrap justify-content-center gap-4 mt-5 reveal-up">
            <div className="about-quality-item d-flex align-items-center gap-2">
              <span className="about-quality-icon">
                <ShieldCheck size={20} />
              </span>
              <span className="small fw-500">
                Anti-corrosion électrophorèse
              </span>
            </div>
            <div className="about-quality-item d-flex align-items-center gap-2">
              <span className="about-quality-icon">
                <GearFill size={20} />
              </span>
              <span className="small fw-500">
                Châssis éprouvé en production de masse
              </span>
            </div>
            <div className="about-quality-item d-flex align-items-center gap-2">
              <span className="about-quality-icon">
                <StarFill size={20} />
              </span>
              <span className="small fw-500">Norme qualité internationale</span>
            </div>
            <div className="about-quality-item d-flex align-items-center gap-2">
              <span className="about-quality-icon">
                <Speedometer size={20} />
              </span>
              <span className="small fw-500">
                Performance optimisée en ville
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── APP ── */}
      <section
        ref={appRef}
        className={`contact-body py-5 scroll-reveal ${appVisible ? "revealed" : ""}`}
      >
        <div className="container py-3">
          <div className="text-center mb-5 reveal-up">
            <span className="home-section-label d-block mb-2">
              L'application
            </span>
            <h2 className="home-section-title">Issal Fes</h2>
            <p
              className="text-secondary mx-auto mt-3"
              style={{ maxWidth: 560, lineHeight: 1.9 }}
            >
              Une plateforme web moderne pour simplifier l'accès au transport
              public à Fès — horaires, lignes, tickets et actualités.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <MapFill size={22} />,
                title: "Lignes & Itinéraires",
                desc: "Consultez toutes les lignes et les arrêts sur une carte interactive.",
              },
              {
                icon: <TicketFill size={22} />,
                title: "Tickets en ligne",
                desc: "Achetez et rechargez vos titres de transport directement.",
              },
              {
                icon: <BellFill size={22} />,
                title: "Alertes en temps réel",
                desc: "Notifications pour les perturbations et changements d'horaires.",
              },
              {
                icon: <PhoneFill size={22} />,
                title: "100 % Mobile",
                desc: "Interface responsive pensée pour téléphone et tablette.",
              },
            ].map((feature, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="home-feature-card h-100 text-center">
                  <div className="about-feature-icon mx-auto mb-3">
                    {feature.icon}
                  </div>
                  <h6 className="fw-bold mb-2">{feature.title}</h6>
                  <p
                    className="text-secondary small mb-0"
                    style={{ lineHeight: 1.7 }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        ref={teamRef}
        className={`contact-body py-5 scroll-reveal ${teamVisible ? "revealed" : ""}`}
      >
        <div className="container py-3">
          <div className="text-center mb-5 reveal-up">
            <span className="home-section-label d-block mb-2">L'équipe</span>
            <h2 className="home-section-title">Les développeurs</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Dev 1 */}
            <div className="col-md-5">
              <div className="about-team-card text-center p-4">
                <div className="about-avatar mx-auto mb-3">
                  <span>MA</span>
                </div>
                <h5 className="fw-bold mb-1">Mohammed-Amine Rhazi</h5>
                <span className="about-role-badge mb-3 d-inline-block">
                  Développeur Full-Stack
                </span>
                <p
                  className="text-secondary small mb-4"
                  style={{ lineHeight: 1.7 }}
                >
                  Conception de l'interface React, animations et intégration API
                  Laravel.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="#"
                    className="about-social-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="#"
                    className="about-social-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:#" className="about-social-btn">
                    <EnvelopeFill size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Dev 2 */}
            <div className="col-md-5">
              <div className="about-team-card text-center p-4">
                <div className="about-avatar mx-auto mb-3">
                  <span>MS</span>
                </div>
                <h5 className="fw-bold mb-1">Mehdi Semlali</h5>
                <span className="about-role-badge mb-3 d-inline-block">
                  Développeur Full-Stack
                </span>
                <p
                  className="text-secondary small mb-4"
                  style={{ lineHeight: 1.7 }}
                >
                  Architecture backend Laravel, base de données et API REST.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="#"
                    className="about-social-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="#"
                    className="about-social-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:#" className="about-social-btn">
                    <EnvelopeFill size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-secondary mt-5 small reveal-up">
            <PeopleFill className="me-1" style={{ color: "var(--brand)" }} />
            Projet réalisé avec passion dans le cadre du cursus TSDD à l'ISTA
            Hay Al Adarissa, Fès — 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
