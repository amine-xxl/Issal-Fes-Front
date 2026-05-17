import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightCircleFill,
  BusFrontFill,
  ExclamationTriangleFill,
  CalendarFill,
  InboxFill,
  Newspaper,
  GeoAltFill,
  Mailbox2Flag,
} from "react-bootstrap-icons";
import "../index.css";

/* ── Hook scroll reveal ── */
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

/* ── Formate une date ISO ── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const API_URL = "http://127.0.0.1:8000/api";

export default function News() {
  /* ── Data from API ── */
  const [actualites, setActualites] = useState([]);
  const [lignes, setLignes] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Filter State ── */
  const [activeTab, setActiveTab] = useState("actualites"); // "actualites" or "lignes"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, lignesRes, alertRes] = await Promise.all([
          fetch(`${API_URL}/actualites`, { headers: { Accept: "application/json" } }),
          fetch(`${API_URL}/lignes`, { headers: { Accept: "application/json" } }),
          fetch(`${API_URL}/alertes`, { headers: { Accept: "application/json" } }),
        ]);

        const actText = await actRes.text();
        const lignesText = await lignesRes.text();
        const alertText = await alertRes.text();

        if (actText) {
          const data = JSON.parse(actText);
          setActualites(Array.isArray(data) ? data : []);
        }
        if (lignesText) {
          const data = JSON.parse(lignesText);
          setLignes(Array.isArray(data) ? data : []);
        }
        if (alertText) {
          const data = JSON.parse(alertText);
          setAlertes(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Erreur chargement news:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Article vedette — le premier article */
  const featured = actualites.length > 0 ? actualites[0] : null;
  /* Articles secondaires (les autres) */
  const grid = actualites.length > 1 ? actualites.slice(1) : [];

  /* Refs pour les animations au scroll */
  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [alertRef, alertVisible] = useScrollReveal(0.1);
  const [gridRef, gridVisible] = useScrollReveal(0.1);

  /* Build full image URL */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  return (
    <div className="news-page">
      {/* ====================================================
          HÉRO — En-tête de la page News
      ==================================================== */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />

        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            <BusFrontFill size={32} />
          </div>

          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>
            Actualités & Lignes
          </h1>

          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            Nouveautés, perturbations, offres et événements
            <br />
            du réseau City Trans Fes.
          </p>

          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ====================================================
          CORPS — Alertes + Grille
      ==================================================== */}
      <section className="contact-body py-5">
        <div ref={alertRef} className={`container py-3 scroll-reveal ${alertVisible ? "revealed" : ""}`}>
          
          {/* ── Filter Buttons ── */}
          <div className="d-flex justify-content-center mb-5 reveal-up">
            <div className="admin-tabs">
              <button
                className={`admin-tab-btn ${activeTab === "actualites" ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("actualites")}
              >
                <Newspaper size={16} />
                <span>Actualités</span>
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "lignes" ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("lignes")}
              >
                <BusFrontFill size={16} />
                <span>Lignes</span>
              </button>
            </div>
          </div>

          {/* ── Loading state ── */}
          {loading && (
            <div className="text-center py-5">
              <div className="contact-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <p className="mt-3 text-secondary">Chargement...</p>
            </div>
          )}

          {/* ── Alertes perturbations actives ── */}
          {!loading && alertes.length > 0 && (
            <div className="mb-4">
              {alertes
                .filter((a) => a.statut === "active")
                .map((alert) => (
                  <div key={alert.id} className="news-alert reveal-up mb-4">
                    <ExclamationTriangleFill size={18} className="news-alert-icon flex-shrink-0" />
                    <div>
                      <span className="news-alert-title">
                        Perturbation — {alert.ligne ? `Ligne ${alert.ligne.numero}` : `Alerte #${alert.id}`}
                      </span>
                      <p className="news-alert-desc mb-0">{alert.message}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ── SECTION ACTUALITES ── */}
          {!loading && activeTab === "actualites" && (
            <>
              {/* Article vedette (featured) — le premier */}
              {featured && (
                <div className="news-featured mb-5 reveal-left position-relative overflow-hidden">
                  <div className="news-card-watermark" style={{ fontSize: 240, bottom: -60, right: -40 }}>
                    <Newspaper />
                  </div>
                  <div className="row g-0 align-items-stretch position-relative" style={{ zIndex: 1 }}>
                    {getImageUrl(featured.image) && (
                      <div className="col-lg-5">
                        <img
                          src={getImageUrl(featured.image)}
                          alt={featured.titre}
                          className="news-featured-img"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    )}

                    <div className={getImageUrl(featured.image) ? "col-lg-7 d-flex flex-column justify-content-center p-4" : "col-12 d-flex flex-column justify-content-center p-4"}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="news-badge news-badge-featured">★ À la une</span>
                      </div>
                      <h2 className="news-featured-title mb-2">{featured.titre}</h2>
                      <p className="text-secondary mb-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
                        {featured.contenu && featured.contenu.length > 200
                          ? featured.contenu.substring(0, 200) + "..."
                          : featured.contenu}
                      </p>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <span className="news-date">
                          <CalendarFill className="me-1" size={11} />
                          {formatDate(featured.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grille d'articles */}
              <div className="row g-4">
                {grid.length === 0 && !featured ? (
                  <div className="col-12 text-center py-5">
                    <div style={{ opacity: 0.5 }}>
                      <InboxFill size={48} />
                    </div>
                    <h4 className="mt-3 text-secondary fw-bold">Aucun article disponible</h4>
                    <p className="text-secondary">Les actualités apparaîtront ici dès qu'elles seront publiées.</p>
                  </div>
                ) : (
                  grid.map((article, i) => (
                    <div key={article.id} className="col-sm-6 col-lg-4 feature-card-stagger" style={{ "--fi": i }}>
                      <div className="news-card h-100 position-relative overflow-hidden">
                        <div className="news-card-watermark" style={{ fontSize: 120 }}>
                          <Newspaper />
                        </div>
                        {getImageUrl(article.image) && (
                          <div className="news-card-img-wrap">
                            <img
                              src={getImageUrl(article.image)}
                              alt={article.titre}
                              className="news-card-img"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          </div>
                        )}

                        <div className="news-card-body position-relative" style={{ zIndex: 1 }}>
                          <h5 className="news-card-title mt-2">{article.titre}</h5>
                          <p className="news-card-excerpt">
                            {article.contenu && article.contenu.length > 120
                              ? article.contenu.substring(0, 120) + "..."
                              : article.contenu}
                          </p>
                          <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                            <span className="news-date">
                              <CalendarFill className="me-1" size={11} />
                              {formatDate(article.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ── SECTION LIGNES ── */}
          {!loading && activeTab === "lignes" && (
            <div className="row g-4">
              {lignes.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <div style={{ opacity: 0.5 }}>
                    <BusFrontFill size={48} />
                  </div>
                  <h4 className="mt-3 text-secondary fw-bold">Aucune ligne disponible</h4>
                  <p className="text-secondary">Les lignes de bus apparaîtront ici.</p>
                </div>
              ) : (
                lignes.map((ligne, i) => (
                  <div key={ligne.id} className="col-sm-6 col-lg-4 feature-card-stagger" style={{ "--fi": i }}>
                    <div className="news-card h-100 position-relative overflow-hidden d-flex flex-column">
                      <div className="news-card-watermark" style={{ fontSize: 120 }}>
                        <BusFrontFill />
                      </div>
                      
                      <div className="news-card-body position-relative d-flex flex-column h-100" style={{ zIndex: 1, paddingTop: '24px' }}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="news-badge news-badge-featured" style={{ background: 'var(--brand)', color: 'white' }}>
                            Ligne {ligne.numero}
                          </span>
                        </div>
                        
                        <h5 className="news-card-title mt-2 mb-3">
                          <GeoAltFill className="me-2 text-danger" size={16} />
                          {ligne.depart} <ArrowRightCircleFill className="mx-1 text-secondary" size={14} /> {ligne.arrivee}
                        </h5>
                        
                        <p className="news-card-excerpt" style={{ flexGrow: 1 }}>
                          {ligne.description && ligne.description.length > 120
                            ? ligne.description.substring(0, 120) + "..."
                            : ligne.description}
                        </p>
                        
                        <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                          <span className="news-date">
                            <BusFrontFill className="me-1" size={12} />
                            City Trans Fes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Encart newsletter ── */}
          <div className="contact-newsletter-box mt-5 reveal-up">
            <div className="fs-4 mb-2"><Mailbox2Flag/></div>
            <h6 className="fw-bold mb-1">Restez informé en temps réel</h6>
            <p className="mb-3" style={{ fontSize: 13, opacity: 0.85 }}>
              Recevez perturbations, nouveaux horaires et offres directement par email.
            </p>
            <Link to="/Contact" className="btn-ctf-primary" style={{ fontSize: 13, padding: "9px 22px" }}>
              S'abonner <ArrowRightCircleFill />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
