/**
 * Page AchatTicket - Issal Fès
 * Permet aux clients de consulter les lignes et d'acheter des billets.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  BusFront, 
  TicketPerforated, 
  ArrowRight, 
  GeoAltFill, 
  PersonBadge, 
  CheckCircleFill, 
  ExclamationTriangleFill,
  ClockFill,
  TicketFill,
  Search
} from "react-bootstrap-icons";
import "../index.css";

export default function AchatTicket() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // État des données
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLigne, setSelectedLigne] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // État de l'achat
  const [buying, setBuying] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [buyError, setBuyError] = useState(null);

  // Animation au scroll
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  /**
   * ── Chargement initial des lignes ──
   */
  useEffect(() => {
    fetchLignes();

    // Intersection Observer pour les animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setHeroVisible(true);
            if (entry.target === contentRef.current) setContentVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [user, token]);

  async function fetchLignes() {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/lignes", {
        headers: {
          "Accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des lignes.");
      const data = await res.json();
      setLignes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * ── Handler pour l'achat d'un billet ──
   */
  async function handleAchat() {
    if (!user) {
        navigate("/Login");
        return;
    }
    if (!selectedLigne || buying) return;

    setBuying(true);
    setBuyError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/billets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ligne_id: selectedLigne.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "L'achat a échoué. Veuillez réessayer.");
      }

      setSuccessMsg("Votre billet a bien été acheté !");
    } catch (err) {
      setBuyError(err.message);
    } finally {
      setBuying(false);
    }
  }

  // Filtrage des lignes par numéro ou destination
  const filteredLignes = lignes.filter(l => 
    l.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * ── Rendu ──
   */
  return (
    <div className="ticket-page" style={{ minHeight: "100vh" }}>
      
      {/* ── HERO SECTION ── */}
      <section 
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            <TicketFill size={32} />
          </div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>
            Acheter un <span style={{ color: "var(--brand)" }}>Billet</span>
          </h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            Sélectionnez votre ligne et voyagez en toute sérénité avec Issal Fès.
            <br />
            Tickets valables sur tout le réseau urbain.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ── CONTENU PRINCIPAL ── */}
      <section className="py-5" ref={contentRef}>
        <div className={`container scroll-reveal ${contentVisible ? "revealed" : ""}`}>
          
          {!user ? (
            <div className="row justify-content-center m-auto" style={{ maxWidth: "900px" }}>
              <div className="col-lg-6">
                <div className="auth-card text-center p-5 reveal-up shadow-lg">
                  <div className="mb-4">
                    <BusFront size={64} style={{ color: "var(--brand)" }} />
                  </div>
                  <h2 className="fw-bold mb-3 auth-title">Espace Voyageur</h2>
                  <p className="text-muted mb-4 auth-subtitle">
                    Pour acheter un billet et consulter les détails complets de votre itinéraire, 
                    veuillez vous connecter à votre compte client.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/Login" className="btn-ctf-primary px-4 text-decoration-none">Se connecter</Link>
                    <Link to="/Signup" className="btn-ctf-ghost px-4 text-decoration-none">S'inscrire</Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Barre de recherche */}
              <div className="row mb-4 reveal-up" style={{ animationDelay: "0.4s" }}>
                <div className="col-lg-8 mx-auto">
                    <div className="position-relative">
                        <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input 
                            type="text" 
                            className="auth-input ps-5" 
                            placeholder="Rechercher une ligne (ex: L15, Bab Ftouh...)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5 reveal-up">
                  <div className="spinner-border text-success" role="status" style={{ color: "var(--brand)" }}>
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center shadow-sm reveal-up" style={{ borderRadius: "15px" }}>
                  <ExclamationTriangleFill className="me-2" /> {error}
                </div>
              ) : (
                <div className="row g-4 mb-5">
                  {/* Liste des lignes */}
                  <div className="col-lg-8 reveal-left">
                    <div className="row g-3">
                      {filteredLignes.length > 0 ? filteredLignes.map((ligne, idx) => (
                        <div key={ligne.id} className="col-md-6">
                          <div 
                            className={`card h-100 border-2 reveal-up ticket-card-item ${selectedLigne?.id === ligne.id ? "selected" : ""}`}
                            style={{ 
                              borderRadius: "18px", 
                              cursor: "pointer", 
                              transition: "all 0.3s ease",
                              "--i": idx % 10,
                              animationDelay: `${idx * 0.05}s`
                            }}
                            onClick={() => {
                                setSelectedLigne(ligne);
                                setSuccessMsg(null);
                                setBuyError(null);
                            }}
                          >
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="bg-brand p-2 rounded-3 text-white fw-bold shadow-sm" style={{ background: "var(--brand)", minWidth: "45px", textAlign: "center" }}>
                                  {ligne.numero}
                                </div>
                                <div className="text-end">
                                  <span className="fw-bold fs-5 brand-text">{ligne.prix} MAD</span>
                                </div>
                              </div>
                              <h5 className="fw-bold mb-1 card-title-text">{ligne.depart} <ArrowRight className="mx-1" size={14} /> {ligne.arrivee}</h5>
                              <p className="small text-muted mb-0 description-text">{ligne.description}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <ExclamationTriangleFill size={40} className="mb-3 opacity-25" />
                            <p>Aucune ligne ne correspond à votre recherche.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Panneau de détail et achat */}
                  <div className="col-lg-4 reveal-right">
                    <div className={`card shadow-lg border-0 sticky-top auth-card details-panel`} style={{ top: "100px", borderRadius: "20px", overflow: "hidden" }}>
                      {selectedLigne ? (
                        <>
                          <div className="p-4 text-white" style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-dark))" }}>
                            <div className="d-flex align-items-center gap-3 mb-2">
                              <TicketPerforated size={24} />
                              <h4 className="mb-0 fw-bold">Détails du Billet</h4>
                            </div>
                            <p className="mb-0 opacity-75">Ligne {selectedLigne.numero} — {selectedLigne.prix} MAD</p>
                          </div>
                          
                          <div className="card-body p-4">
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                                    <GeoAltFill style={{ color: "var(--brand)" }} />
                                    <span className="fw-bold card-title-text">Itinéraire complet</span>
                                </div>
                                
                                {/* Timeline Aller */}
                                <div className="mb-4">
                                    <p className="small fw-bold text-uppercase text-muted mb-3 ls-1 d-flex align-items-center gap-2">
                                        <span className="bg-brand-light p-1 rounded px-2 itinerary-badge-aller" style={{color:'var(--brand-dark)'}}>Sens Aller</span>
                                        <ArrowRight />
                                        <span className="itinerary-text">{selectedLigne.depart} → {selectedLigne.arrivee}</span>
                                    </p>
                                    <div className="ps-3 border-start border-2 ms-2 timeline-border">
                                        {selectedLigne.itineraires?.filter(it => it.direction === 'aller').sort((a,b) => a.ordre - b.ordre).map((stop, i, arr) => (
                                            <div key={stop.id} className="position-relative mb-3">
                                                <div className="position-absolute translate-middle-x" style={{ left: "-1.1rem", top: "5px" }}>
                                                    <div className="bg-white rounded-circle border border-2 timeline-dot" style={{ width: "12px", height: "12px" }} />
                                                </div>
                                                <div className="ps-2">
                                                    <span className="d-block fw-bold small card-title-text">{stop.nom_arret}</span>
                                                    {i === 0 && <span className="badge bg-success-subtle text-success small py-1 px-2 mt-1" style={{ fontSize: "10px" }}>Départ</span>}
                                                    {i === arr.length - 1 && <span className="badge bg-danger-subtle text-danger small py-1 px-2 mt-1" style={{ fontSize: "10px" }}>Arrivée</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline Retour */}
                                <div>
                                    <p className="small fw-bold text-uppercase text-muted mb-3 ls-1 d-flex align-items-center gap-2">
                                        <span className="bg-secondary-subtle p-1 rounded px-2 itinerary-badge-retour text-dark">Sens Retour</span>
                                        <ArrowRight />
                                        <span className="itinerary-text">{selectedLigne.arrivee} → {selectedLigne.depart}</span>
                                    </p>
                                    <div className="ps-3 border-start border-2 ms-2 timeline-border-retour">
                                        {selectedLigne.itineraires?.filter(it => it.direction === 'retour').sort((a,b) => a.ordre - b.ordre).map((stop, i, arr) => (
                                            <div key={stop.id} className="position-relative mb-3">
                                                <div className="position-absolute translate-middle-x" style={{ left: "-1.1rem", top: "5px" }}>
                                                    <div className="bg-white rounded-circle border border-2 timeline-dot-retour" />
                                                </div>
                                                <div className="ps-2">
                                                    <span className="d-block fw-bold small card-title-text">{stop.nom_arret}</span>
                                                    {i === 0 && <span className="badge bg-success-subtle text-success small py-1 px-2 mt-1" style={{ fontSize: "10px" }}>Départ</span>}
                                                    {i === arr.length - 1 && <span className="badge bg-danger-subtle text-danger small py-1 px-2 mt-1" style={{ fontSize: "10px" }}>Arrivée</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div className="profile-info-box p-3 rounded-3 mb-4 d-flex align-items-center gap-3 border">
                                <PersonBadge size={28} className="profile-icon-dark" />
                                <div>
                                    <p className="small text-muted mb-0">Émis au nom de :</p>
                                    <p className="fw-bold mb-0 card-title-text">{user.name}</p>
                                </div>
                            </div>

                            {successMsg && (
                                <div className="alert alert-success border-0 small py-2 mb-3 d-flex align-items-center gap-2">
                                    <CheckCircleFill /> {successMsg}
                                </div>
                            )}
                            {buyError && (
                                <div className="alert alert-danger border-0 small py-2 mb-3 d-flex align-items-center gap-2">
                                    <ExclamationTriangleFill /> {buyError}
                                </div>
                            )}

                            <button className="btn-ctf-primary w-100 py-3 shadow-sm auth-btn" disabled={buying} onClick={handleAchat}>
                                {buying ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>Acheter ce billet</>
                                )}
                            </button>
                            <p className="text-center mt-3 small text-muted">
                                <ClockFill className="me-1" /> Stimulation de l'achat (Paiement à venir)
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="card-body p-5 text-center text-muted">
                          <div className="mb-3 opacity-25">
                            <BusFront size={80} />
                          </div>
                          <p className="mb-0">Veuillez sélectionner une ligne pour voir les détails et acheter un billet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .timeline-border { border-color: var(--brand) !important; }
        .timeline-dot { width: 12px; height: 12px; background-color: #fff !important; border-color: var(--brand) !important; }
        
        .timeline-border-retour { border-color: #adb5bd !important; }
        .timeline-dot-retour { width: 12px; height: 12px; background-color: #fff !important; border-color: #adb5bd !important; }

        /* Profile Box */
        .profile-info-box {
            background-color: #f8f9fa;
            border-color: #eee !important;
        }
        .profile-icon-dark { color: #6c757d; }

        /* Card Styles */
        .ticket-card-item {
            background: #ffffff;
            border: 1.5px solid #eee;
        }
        .ticket-card-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .ticket-card-item.selected {
            border-color: var(--brand) !important;
            background: var(--brand-light) !important;
        }

        /* Dark Mode Support */
        [data-theme='dark'] .ticket-card-item {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme='dark'] .ticket-card-item.selected {
            background: rgba(188, 200, 55, 0.15) !important;
            border-color: var(--brand) !important;
        }
        [data-theme='dark'] .card-title-text { color: #f8f9fa !important; }
        [data-theme='dark'] .description-text { color: #aaa !important; }
        [data-theme='dark'] .brand-text { color: var(--brand) !important; }
        
        [data-theme='dark'] .details-panel {
            background: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme='dark'] .itinerary-badge-aller { background-color: rgba(188, 200, 55, 0.2) !important; color: var(--brand) !important; }
        [data-theme='dark'] .itinerary-badge-retour { background-color: rgba(255, 255, 255, 0.1) !important; color: #eee !important; }
        [data-theme='dark'] .itinerary-text { color: #ccc !important; }
        
        [data-theme='dark'] .timeline-dot, 
        [data-theme='dark'] .timeline-dot-retour { 
            background-color: #222 !important; 
        }

        [data-theme='dark'] .profile-info-box {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme='dark'] .profile-icon-dark { color: #aaa; }
      `}</style>
    </div>
  );
}
