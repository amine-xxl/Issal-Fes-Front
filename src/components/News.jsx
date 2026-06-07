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
  HandIndexThumbFill,
  XCircleFill,
} from "react-bootstrap-icons";
import "../index.css";

// URL de base de l'API Laravel
const API_URL = "http://127.0.0.1:8000/api";

// Formate une date ISO en français (ex: "1 jan 2026")
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Construit l'URL complète d'une image (relative ou absolue)
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `http://127.0.0.1:8000${imagePath}`;
}

// Tronque un texte à une longueur max et ajoute "..."
function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
}

export default function News() {
  /**
   * ÉTATS (Hooks useState) :
   * - actualites, lignes, alertes : Données récupérées depuis le serveur.
   * - selectedLigne : Gère la ligne à afficher dans la modale d'itinéraire.
   * - loading : État visuel pendant le chargement des données.
   * - activeTab : Bascule entre l'affichage "Actualités" et "Lignes".
   */
  const [actualites, setActualites] = useState([]);
  const [lignes, setLignes] = useState([]);
  const [alertes, setAlertes] = useState([]);

  // État pour la ligne sélectionnée (affichage itinéraire dans la modale)
  const [selectedLigne, setSelectedLigne] = useState(null);

  // Indique si les données sont encore en cours de chargement
  const [loading, setLoading] = useState(true);

  // Onglet actif : "actualites" ou "lignes"
  const [activeTab, setActiveTab] = useState("actualites");

  // Refs pour les animations scroll reveal
  const heroRef = useRef(null);
  const bodyRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  /**
   * Scroll Reveal
   * Utilise l'Intersection Observer pour déclencher des animations CSS
   * dès que les sections entrent dans le champ de vision de l'utilisateur.
   */
  useEffect(() => {
    const sections = [
      { ref: heroRef, set: setHeroVisible },
      { ref: bodyRef, set: setBodyVisible },
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

  /**
   * Récupération des données (API)
   * Au chargement du composant, on effectue 3 requêtes asynchrones en parallèle
   * via Promise.all pour optimiser le temps d'attente.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        // On lance les 3 requêtes en parallèle pour gagner du temps
        const [actRes, lignesRes, alertRes] = await Promise.all([
          fetch(`${API_URL}/actualites`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_URL}/lignes`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_URL}/alertes`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        const actData = await actRes.json(); // Récupère les actualités
        const lignesData = await lignesRes.json(); // Récupère les lignes
        const alertData = await alertRes.json(); // Récupère les alertes

        // On vérifie que la réponse est bien un tableau avant de l'utiliser
        if (Array.isArray(actData)) setActualites(actData);
        if (Array.isArray(lignesData)) setLignes(lignesData);
        if (Array.isArray(alertData)) setAlertes(alertData);
      } catch (e) {
        console.error("Erreur chargement news:", e);
      } finally {
        // Dans tous les cas, on arrête le spinner
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Le premier article est mis en avant (featured), les autres forment la grille
  const featured = actualites[0] || null;
  const grid = actualites.slice(1);

  return (
    <div className="news-page">
      {/*  HERO  */}
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

          <h1
            className="contact-hero-title reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            Actualités & Lignes
          </h1>

          <p
            className="contact-hero-subtitle reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            Nouveautés, perturbations, offres et événements
            <br />
            du réseau Issal Fes.
          </p>

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

      {/*  CORPS  */}
      <section className="contact-body py-5">
        <div
          ref={bodyRef}
          className={`container py-3 scroll-reveal ${bodyVisible ? "revealed" : ""}`}
        >
          {/* Boutons onglets Actualités / Lignes */}
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

          {/* Spinner de chargement */}
          {loading && (
            <div className="text-center py-5">
              <div
                className="contact-spinner"
                style={{ width: 32, height: 32, borderWidth: 3 }}
              />
              <p className="mt-3 text-secondary">Chargement...</p>
            </div>
          )}

          {/* Alertes actives : Affichage conditionnel des perturbations réseau */}
          {!loading &&
            alertes
              .filter((a) => a.statut === "active")
              .map((alert) => (
                <div key={alert.id} className="news-alert reveal-up mb-4">
                  <ExclamationTriangleFill
                    size={18}
                    className="news-alert-icon flex-shrink-0"
                  />
                  <div>
                    <span className="news-alert-title">
                      Perturbation —{" "}
                      {alert.ligne
                        ? `Ligne ${alert.ligne.numero}`
                        : `Alerte #${alert.id}`}
                    </span>
                    <p className="news-alert-desc mb-0">{alert.message}</p>
                  </div>
                </div>
              ))}

          {/*  ONGLET ACTUALITÉS  */}
          {!loading && activeTab === "actualites" && (
            <>
              {featured && (
                <div className="news-featured mb-5 reveal-left position-relative overflow-hidden">
                  <div
                    className="news-card-watermark"
                    style={{ fontSize: 240, bottom: -60, right: -40 }}
                  >
                    <Newspaper />
                  </div>

                  <div
                    className="row g-0 align-items-stretch position-relative"
                    style={{ zIndex: 1 }}
                  >
                    {getImageUrl(featured.image) && (
                      <div className="col-lg-5">
                        <img
                          src={getImageUrl(featured.image)}
                          alt={featured.titre}
                          className="news-featured-img"
                        />
                      </div>
                    )}

                    <div // Si une image existe, on prend 7 colonnes, sinon 12 pour le texte car le texte doit occuper toute la largeur
                      className={
                        getImageUrl(featured.image) // Si une image existe, on prend 7 colonnes, sinon 12 pour le texte
                          ? "col-lg-7 d-flex flex-column justify-content-center p-4" // Avec image : 7 colonnes pour le texte
                          : "col-12 d-flex flex-column justify-content-center p-4" // Sans image : 12 colonnes pour le texte
                      }
                    >
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="news-badge news-badge-featured">
                          ★ À la une
                        </span>
                      </div>
                      <h2 className="news-featured-title mb-2">
                        {featured.titre}
                      </h2>
                      <p
                        className="text-secondary mb-3"
                        style={{ fontSize: 14, lineHeight: 1.7 }}
                      >
                        {truncate(featured.contenu, 200)}
                      </p>
                      <span className="news-date">
                        <CalendarFill className="me-1" size={11} />
                        {formatDate(featured.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="row g-4">
                {grid.length === 0 && !featured ? (
                  <div className="col-12 text-center py-5">
                    <div style={{ opacity: 0.5 }}>
                      <InboxFill size={48} />
                    </div>
                    <h4 className="mt-3 text-secondary fw-bold">
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
                      <div className="news-card h-100 position-relative overflow-hidden">
                        <div
                          className="news-card-watermark"
                          style={{ fontSize: 120 }}
                        >
                          <Newspaper />
                        </div>

                        {getImageUrl(article.image) && (
                          <div className="news-card-img-wrap">
                            <img
                              src={getImageUrl(article.image)}
                              alt={article.titre}
                              className="news-card-img"
                            />
                          </div>
                        )}

                        <div
                          className="news-card-body position-relative"
                          style={{ zIndex: 1 }}
                        >
                          <h5 className="news-card-title mt-2">
                            {article.titre}
                          </h5>
                          <p className="news-card-excerpt">
                            {truncate(article.contenu, 120)}
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

          {/*  ONGLET LIGNES  */}
          {!loading && activeTab === "lignes" && (
            <div className="row g-4">
              {lignes.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <div style={{ opacity: 0.5 }}>
                    <BusFrontFill size={48} />
                  </div>
                  <h4 className="mt-3 text-secondary fw-bold">
                    Aucune ligne disponible
                  </h4>
                </div>
              ) : (
                lignes.map((ligne, i) => (
                  <div
                    key={ligne.id}
                    className="col-sm-6 col-lg-4 feature-card-stagger"
                    style={{ "--fi": i }}
                  >
                    {/* Le clic sur la carte ouvre la modale d'itinéraire détaillé */}
                    <div 
                      className="news-card h-100 position-relative overflow-hidden d-flex flex-column"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedLigne(ligne)}
                    >
                      <div
                        className="news-card-watermark"
                        style={{ fontSize: 120 }}
                      >
                        <BusFrontFill />
                      </div>

                      <div
                        className="news-card-body position-relative d-flex flex-column h-100"
                        style={{ zIndex: 1, paddingTop: 24 }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span
                            className="news-badge news-badge-featured"
                            style={{
                              background: "var(--brand)",
                              color: "white",
                            }}
                          >
                            Ligne {ligne.numero}
                          </span>
                          <HandIndexThumbFill className="text-muted hand-pointing-icon" size={18} title="Cliquez pour voir l'itinéraire" />
                        </div>

                        <h5 className="news-card-title mt-2 mb-3">
                          <GeoAltFill className="me-2 text-danger" size={16} />
                          {ligne.depart}{" "}
                          <ArrowRightCircleFill
                            className="mx-1 text-secondary"
                            size={14}
                          />{" "}
                          {ligne.arrivee}
                        </h5>

                        <p className="news-card-excerpt" style={{ flexGrow: 1 }}>
                          {truncate(ligne.description, 120)}
                        </p>

                        <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                          <span className="news-date">
                            <BusFrontFill className="me-1" size={12} />
                            Issal Fes
                          </span>
                          <span className="text-brand fw-bold" style={{ fontSize: 11 }}>
                            Voir trajet <ArrowRightCircleFill className="ms-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/*
            FONCTIONNALITÉ : Affiche visuellement les arrêts de bus pour les trajets "Aller" et "Retour".
            Le défilement est horizontal pour simuler une ligne de temps/parcours.
          */}
          {selectedLigne && (
            <div className="modal-backdrop-custom" onClick={() => setSelectedLigne(null)}>
              <div 
                className="modal-card" 
                style={{ maxWidth: "900px", width: "95%" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-brand-light rounded-circle text-brand">
                      <BusFrontFill size={28} />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1" style={{ color: "#1e3a5f" }}>
                        Itinéraire Ligne {selectedLigne.numero}
                      </h4>
                      <p className="text-secondary mb-0" style={{ fontSize: 14 }}>
                        {selectedLigne.depart} <ArrowRightCircleFill className="mx-1" /> {selectedLigne.arrivee}
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-link text-danger p-0" onClick={() => setSelectedLigne(null)}>
                    <XCircleFill size={32} />
                  </button>
                </div>

                <div className="modal-body py-2">
                  {/* Trajet ALLER */}
                  <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <span className="badge bg-primary px-3 py-2" style={{ fontSize: 12, borderRadius: 8 }}>TRAJET ALLER</span>
                      <div className="flex-grow-1 border-bottom" style={{ opacity: 0.1 }} />
                    </div>

                    <div className="trajet-view-horizontal overflow-auto pb-4" style={{ scrollbarWidth: "thin" }}>
                      <div className="d-flex align-items-center gap-0 min-width-max-content px-3">
                        <div className="trajet-stop trajet-stop--main">
                          <div className="trajet-dot trajet-dot--start" />
                          <span className="trajet-name">{selectedLigne.depart}</span>
                        </div>

                        {selectedLigne.itineraires && selectedLigne.itineraires
                          .filter(i => i.direction === "aller")
                          .map((stop) => (
                            <React.Fragment key={stop.id}>
                              <div className="trajet-line" />
                              <div className="trajet-stop">
                                <BusFrontFill size={10} className="mb-1 text-muted" style={{ opacity: 0.6 }} />
                                <div className="trajet-dot" />
                                <span className="trajet-name">{stop.nom_arret}</span>
                              </div>
                            </React.Fragment>
                          ))}

                        <div className="trajet-line" />
                        <div className="trajet-stop trajet-stop--main">
                          <div className="trajet-dot trajet-dot--end" />
                          <span className="trajet-name">{selectedLigne.arrivee}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trajet RETOUR */}
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <span className="badge bg-secondary px-3 py-2" style={{ fontSize: 12, borderRadius: 8 }}>TRAJET RETOUR</span>
                      <div className="flex-grow-1 border-bottom" style={{ opacity: 0.1 }} />
                    </div>

                    <div className="trajet-view-horizontal overflow-auto pb-4" style={{ scrollbarWidth: "thin" }}>
                      <div className="d-flex align-items-center gap-0 min-width-max-content px-3">
                        <div className="trajet-stop trajet-stop--main">
                          <div className="trajet-dot trajet-dot--start" />
                          <span className="trajet-name">{selectedLigne.arrivee}</span>
                        </div>

                        {selectedLigne.itineraires && selectedLigne.itineraires
                          .filter(i => i.direction === "retour")
                          .map((stop) => (
                            <React.Fragment key={stop.id}>
                              <div className="trajet-line" />
                              <div className="trajet-stop">
                                <BusFrontFill size={10} className="mb-1 text-muted" style={{ opacity: 0.6 }} />
                                <div className="trajet-dot" />
                                <span className="trajet-name">{stop.nom_arret}</span>
                              </div>
                            </React.Fragment>
                          ))}

                        <div className="trajet-line" />
                        <div className="trajet-stop trajet-stop--main">
                          <div className="trajet-dot trajet-dot--end" />
                          <span className="trajet-name">{selectedLigne.depart}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5 pt-3 border-top">
                  <button className="btn-ctf-primary px-5" onClick={() => setSelectedLigne(null)}>
                    Fermer la vue
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="contact-newsletter-box mt-5 reveal-up">
            <div className="fs-4 mb-2">
              <Mailbox2Flag />
            </div>
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
