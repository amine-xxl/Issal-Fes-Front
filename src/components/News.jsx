import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightCircleFill,
  BusFrontFill,
  ExclamationTriangleFill,
  CalendarFill,
  InboxFill,
} from "react-bootstrap-icons";
import { articles, alerts, CATEGORIES, CATEGORY_COLORS } from "../data/TempData";
import "../index.css";

/* ── Hook scroll reveal (réutilisé depuis Home / Contact) ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Formate une date ISO en "28 avr. 2026" ── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function News() {
  /* Catégorie active pour le filtre */
  const [activeCategory, setActiveCategory] = useState("Tout");

  /* Articles filtrés selon la catégorie choisie */
  const filtered = activeCategory === "Tout"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  /* Article vedette (featured) — toujours le premier featured trouvé */
  const featured = articles.find((a) => a.featured);

  /* Articles secondaires (sans le featured) après filtrage */
  const grid = filtered.filter((a) => !a.featured || activeCategory !== "Tout");

  /* Refs pour les animations au scroll */
  const [heroRef,   heroVisible]   = useScrollReveal(0.1);
  const [alertRef,  alertVisible]  = useScrollReveal(0.1);
  const [gridRef,   gridVisible]   = useScrollReveal(0.1);

  return (
    <div className="news-page">
      {/* ====================================================
          HÉRO — En-tête de la page News
      ==================================================== */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        {/* Voile semi-transparent (réutilisé depuis Contact) */}
        <div className="contact-hero-overlay" />

        <div
          className="container position-relative text-center"
          style={{ zIndex: 1 }}
        >
          {/* Icône décorative */}
          <div className="contact-hero-icon reveal-up">
            <BusFrontFill size={32} />
          </div>

          {/* Titre */}
          <h1
            className="contact-hero-title reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            Actualités
          </h1>

          {/* Sous-titre */}
          <p
            className="contact-hero-subtitle reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            Nouveautés, perturbations, offres et événements
            <br />
            du réseau City Trans Fes.
          </p>

          {/* Séparateur décoratif (réutilisé depuis Contact) */}
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
          CORPS — Alertes + Filtres + Grille
      ==================================================== */}
      <section className="contact-body py-5">
        <div className="container py-3">
          {/* ── Bande d'alerte perturbation (si active) ── */}
          {alerts.length > 0 && (
            <div
              ref={alertRef}
              className={`scroll-reveal ${alertVisible ? "revealed" : ""}`}
            >
              {alerts.map((alert) => (
                <div key={alert.id} className="news-alert reveal-up mb-4">
                  <ExclamationTriangleFill
                    size={18}
                    className="news-alert-icon flex-shrink-0"
                  />
                  <div>
                    <span className="news-alert-title">
                      Perturbation — {alert.line}
                    </span>
                    <p className="news-alert-desc mb-0">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Article vedette (featured) — visible seulement sur "Tout" ── */}
          {activeCategory === "Tout" && featured && (
            <div className="news-featured mb-5 reveal-left">
              <div className="row g-0 align-items-stretch">
                {/* Image */}
                <div className="col-lg-5">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="news-featured-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* Fallback si pas d'image */}
                  <div className="news-featured-img-fallback">
                    <BusFrontFill size={48} />
                  </div>
                </div>

                {/* Contenu texte */}
                <div className="col-lg-7 d-flex flex-column justify-content-center p-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="news-badge news-badge-featured">
                      ★ À la une
                    </span>
                    <span
                      className={`news-badge ${CATEGORY_COLORS[featured.category]}`}
                    >
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="news-featured-title mb-2">{featured.title}</h2>
                  <p
                    className="text-secondary mb-3"
                    style={{ fontSize: 14, lineHeight: 1.7 }}
                  >
                    {featured.excerpt}
                  </p>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span className="news-date">
                      <CalendarFill className="me-1" size={11} />
                      {formatDate(featured.date)}
                    </span>
                    <Link
                      to="#"
                      className="btn-ctf-primary"
                      style={{ fontSize: 13, padding: "9px 20px" }}
                    >
                      Lire l'article <ArrowRightCircleFill />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Filtres de catégories ── */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`news-filter-btn ${activeCategory === cat ? "news-filter-btn--active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Grille d'articles ── */}
          <div
            ref={gridRef}
            className={`row g-4 scroll-reveal ${gridVisible ? "revealed" : ""}`}
          >
            {grid.length === 0 ? (
              /* Message si aucun article dans cette catégorie */
              <div className="col-12 text-center py-5 text-secondary">
                <h4>
                  <InboxFill /> <br />
                  Aucun article disponible
                </h4>
              </div>
            ) : (
              grid.map((article, i) => (
                <div
                  key={article.id}
                  className="col-sm-6 col-lg-4 feature-card-stagger"
                  style={{ "--fi": i }}
                >
                  <div className="news-card h-100">
                    {/* Image de la carte */}
                    <div className="news-card-img-wrap">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="news-card-img"
                        onError={(e) => {
                          e.target.parentElement.classList.add(
                            "news-card-img-wrap--fallback",
                          );
                        }}
                      />
                      <div className="news-card-img-fallback">
                        <BusFrontFill size={32} />
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="news-card-body">
                      <span
                        className={`news-badge ${CATEGORY_COLORS[article.category]}`}
                      >
                        {article.category}
                      </span>
                      <h5 className="news-card-title mt-2">{article.title}</h5>
                      <p className="news-card-excerpt">{article.excerpt}</p>
                      <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                        <span className="news-date">
                          <CalendarFill className="me-1" size={11} />
                          {formatDate(article.date)}
                        </span>
                        <Link to="#" className="news-read-more">
                          Lire →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Encart newsletter ── */}
          <div className="contact-newsletter-box mt-5 reveal-up">
            <div className="fs-4 mb-2">📬</div>
            <h6 className="fw-bold mb-1">Restez informé en temps réel</h6>
            <p className="mb-3" style={{ fontSize: 13, opacity: 0.85 }}>
              Recevez perturbations, nouveaux horaires et offres directement par
              email.
            </p>
            <Link
              to="/Contact"
              className="btn-ctf-primary"
              style={{ fontSize: 13, padding: "9px 22px" }}
            >
              S'abonner <ArrowRightCircleFill />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
