import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BusFrontFill,
  GeoAltFill,
  ExclamationTriangleFill,
  ClockFill,
  InfoCircleFill,
  ArrowRightCircleFill,
  ShieldFill,
  CheckCircleFill,
  Tools,
} from "react-bootstrap-icons";
import "../index.css";

// URL de base de l'API Laravel
const API_URL = "http://127.0.0.1:8000/api";

export default function ProInfos() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(location.state?.justAssigned || false);

  // ── Refs pour les animations scroll reveal ──
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const timelineRef = useRef(null);
  const alertRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  // Sécurité : Redirige si non-chauffeur
  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    }
    if (user && user.role !== "chauffeur") {
      navigate("/");
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const sections = [
      { ref: heroRef, set: setHeroVisible },
      { ref: infoRef, set: setInfoVisible },
      { ref: timelineRef, set: setTimelineVisible },
      { ref: alertRef, set: setAlertVisible },
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
      { threshold: 0.1 }
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    // Fallback : Si après 1.5s rien n'est visible, on force l'affichage (évite la page blanche)
    const timeout = setTimeout(() => {
      setHeroVisible(true);
      setInfoVisible(true);
      setTimelineVisible(true);
      setAlertVisible(true);
    }, 1500);

    // Auto-hide success toast after 5s
    if (showSuccessToast) {
        const t = setTimeout(() => setShowSuccessToast(false), 5000);
        return () => { observer.disconnect(); clearTimeout(timeout); clearTimeout(t); };
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [showSuccessToast]);

  /**
   * EFFET : Récupération des données professionnelles
   */
  useEffect(() => {
    async function fetchProInfo() {
      try {
        const res = await fetch(`${API_URL}/pro-info`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else if (res.status === 404) {
          setError("Aucune affectation trouvée pour votre compte.");
        } else {
          setError("Erreur lors de la récupération des données.");
        }
      } catch (e) {
        console.error("Erreur fetch pro-info:", e);
        setError("Connexion au serveur impossible.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchProInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="contact-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  // ── CAS : AUCUNE DONNÉE (Error ou 404) ──
  if (error || !data) {
    return (
      <div className="pro-infos-page">
        <section className="contact-hero d-flex align-items-center justify-content-center revealed">
          <div className="contact-hero-overlay" />
          <div className="container position-relative text-center" style={{ zIndex: 1 }}>
             <div className="contact-hero-icon mb-4" style={{ backgroundColor: "#6c757d" }}>
               <ExclamationTriangleFill size={32} />
             </div>
             <h1 className="contact-hero-title">Service non assigné</h1>
             <p className="contact-hero-subtitle text-muted mt-3">
               {error || "Vous n'avez pas encore été affecté à une ligne de bus."}
               <br />
               Veuillez contacter votre administrateur pour recevoir votre ordre de mission.
             </p>
          </div>
        </section>
      </div>
    );
  }

  const { pro_info, alertes } = data;

  return (
    <div className="pro-infos-page">
      {/* ── TOAST DE SUCCÈS ── */}
      {showSuccessToast && (
        <div className="auth-toast d-flex align-items-center gap-3" style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 10000 }}>
            <CheckCircleFill className="text-success" size={24} />
            <div className="auth-toast-text">
                <strong className="d-block" style={{ color: "#16a34a" }}>Affectation réussie !</strong>
                <small style={{ color: "#16a34a" }}>Vos informations de service ont été mises à jour.</small>
            </div>
            <div className="auth-toast-progress" />
        </div>
      )}

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            <InfoCircleFill size={32} />
          </div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>
            Espace Chauffeur
          </h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            Bienvenue, {user?.name}. Retrouvez vos informations de service
            <br />
            et l'état de votre ligne en temps réel.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="py-5">
        <div className="container py-3">
          <div className="row g-4">
            
            {/* ── COLONNE GAUCHE : Bus & Ligne ── */}
            <div className="col-lg-5">
              <div 
                ref={infoRef}
                className={`contact-form-card mb-4 scroll-reveal ${infoVisible ? "revealed" : ""}`}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <BusFrontFill size={20} style={{ color: "var(--brand)" }} />
                  <h5 className="fw-bold mb-0">Affectation du jour</h5>
                </div>

                <div className="text-center mb-4">
                  <div className="bus-assignment-badge mb-3">
                    <span className="bus-number">{pro_info.numero_bus}</span>
                  </div>
                  <h6 className="text-secondary">{pro_info.modele}</h6>
                </div>

                <div className="line-info-box p-3 rounded-4 mb-4" style={{ backgroundColor: "var(--brand-light)", border: "1px solid var(--brand)" }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-dark px-3 py-2">Ligne {pro_info.ligne?.numero}</span>
                    <span className="text-success fw-bold d-flex align-items-center gap-1">
                      <CheckCircleFill size={14} /> En Service
                    </span>
                  </div>
                  <p className="fw-bold mb-0 mt-3" style={{ color: "#1e3a5f" }}>
                    {pro_info.ligne?.depart} <ArrowRightCircleFill className="mx-1" /> {pro_info.ligne?.arrivee}
                  </p>
                </div>

                {/* Image du bus (placeholder local) */}
                <div className="bus-image-preview rounded-4 overflow-hidden shadow-sm">
                  <img 
                    src="/busfes1.webp" 
                    alt="Mon Bus" 
                    className="w-100" 
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"; }}
                  />
                </div>
              </div>

              {/* ── Section Alertes ── */}
              <div 
                ref={alertRef}
                className={`contact-form-card scroll-reveal ${alertVisible ? "revealed" : ""}`}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <InfoCircleFill size={20} style={{ color: "#1e3a5f" }} />
                  <h5 className="fw-bold mb-0">Alertes Réseau</h5>
                </div>

                {alertes.length === 0 ? (
                  <p className="text-muted text-center py-3">Aucune alerte sur votre ligne.</p>
                ) : (
                  alertes.map((alert, i) => (
                    <div key={alert.id} className="admin-badge mb-3 d-flex gap-3 align-items-start p-3 w-100" style={{ 
                      backgroundColor: alert.type === 'perturbation' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(188, 200, 55, 0.1)',
                      border: `1px solid ${alert.type === 'perturbation' ? '#ef4444' : 'var(--brand)'}`,
                      borderRadius: '12px'
                    }}>
                      <div className={`p-2 rounded-3 ${alert.type === 'perturbation' ? 'bg-danger' : 'bg-brand'} text-white`}>
                        {alert.type === 'perturbation' ? <ExclamationTriangleFill size={14} /> : <InfoCircleFill size={14} />}
                      </div>
                      <div>
                        <span className={`badge ${alert.type === 'perturbation' ? 'bg-danger' : 'bg-brand'} mb-2`}>
                          {alert.type === 'perturbation' ? 'URGENT' : 'INFO'}
                        </span>
                        <p className="mb-0 text-dark fw-medium" style={{ fontSize: '13px' }}>{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── COLONNE DROITE : Timeline Itinéraire ── */}
            <div className="col-lg-7">
              <div 
                ref={timelineRef}
                className={`contact-form-card h-100 scroll-reveal ${timelineVisible ? "revealed" : ""}`}
              >
                <div className="d-flex align-items-center gap-2 mb-5">
                  <ClockFill size={20} style={{ color: "var(--brand)" }} />
                  <h5 className="fw-bold mb-0">Itinéraire détaillé — Arrêts</h5>
                </div>

                <div className="pro-timeline ps-4 ms-2 position-relative">
                  {/* Ligne verticale de fond */}
                  <div className="timeline-v-line" />

                  {pro_info.ligne?.itineraires?.map((stop, index, array) => {
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;
                    
                    return (
                      <div key={stop.id} className="timeline-item mb-5 position-relative" style={{ '--ti': index }}>
                        {/* Point d'arrêt */}
                        <div className={`timeline-dot ${isFirst || isLast ? 'timeline-dot--main' : ''}`}>
                          {isFirst || isLast ? <GeoAltFill size={14} /> : <div className="inner-dot" />}
                        </div>
                        
                        <div className="ms-4">
                          <h6 className={`mb-1 ${isFirst || isLast ? 'fw-bold text-dark' : 'text-secondary'}`}>
                            {stop.nom_arret}
                          </h6>
                          {isFirst && <span className="badge bg-success-light text-success p-1 px-2" style={{ fontSize: 10 }}>DÉPART</span>}
                          {isLast && <span className="badge bg-danger-light text-danger p-1 px-2" style={{ fontSize: 10 }}>TERMINUS</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-top">
                  <div className="d-flex align-items-center gap-3 text-secondary" style={{ fontSize: 13 }}>
                    <Tools size={18} />
                    <span>Un problème avec un arrêt ? Signalez-le <Link to="/Contact"> Dans notre espace contact</Link> .</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
