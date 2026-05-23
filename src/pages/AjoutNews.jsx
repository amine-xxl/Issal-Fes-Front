import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BusFrontFill,
  Newspaper,
  ExclamationTriangleFill,
  ArrowLeft,
  PlusCircleFill,
  PencilFill,
  ImageFill,
  CheckCircleFill,
} from "react-bootstrap-icons";
import "../index.css";

/* ── Hook de révélation au scroll ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function AjoutNews() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "http://127.0.0.1:8000/api/admin";

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [formRef, formVisible] = useScrollReveal(0.1);

  // Detect edit mode from navigation state
  const isEditMode = location.state?.editMode || false;
  const editId = location.state?.editId || null;
  const editData = location.state?.editData || null;

  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "lignes");

  // Lignes list for Alerte dropdown
  const [lignes, setLignes] = useState([]);

  // Form states — Lignes
  const [numero, setNumero] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [description, setDescription] = useState("");

  // Form states — Actualites
  const [titre, setTitre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contenu, setContenu] = useState("");

  // Form states — Alertes
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [statut, setStatut] = useState("active");
  const [ligneId, setLigneId] = useState("");

  // ── État de la validation du formulaire ──
  // "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  // Pre-fill form if editing
  useEffect(() => {
    if (isEditMode && editData) {
      if (activeTab === "lignes") {
        setNumero(editData.numero || "");
        setDepart(editData.depart || "");
        setArrivee(editData.arrivee || "");
        setDescription(editData.description || "");
      } else if (activeTab === "actualites") {
        setTitre(editData.titre || "");
        setContenu(editData.contenu || "");
        if (editData.image) {
          const url = editData.image.startsWith("http") ? editData.image : `http://127.0.0.1:8000${editData.image}`;
          setImagePreview(url);
        }
      } else if (activeTab === "alertes") {
        setLigneId(editData.ligne_id || "");
        setType(editData.type || "info");
        setMessage(editData.message || "");
        setStatut(editData.statut || "active");
      }
    }
  }, [isEditMode, editData, activeTab]);

  // Fetch lignes for alerte dropdown
  useEffect(() => {
    const fetchLignes = async () => {
      try {
        const response = await fetch(`${API_URL}/lignes`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setLignes(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Erreur chargement lignes:", e);
      }
    };
    fetchLignes();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      let response;

      if (activeTab === "actualites") {
        if (!titre || !contenu) {
          setStatus("error");
          return;
        }
        const endpoint = isEditMode ? `/actualites/${editId}` : "/actualites";

        const formData = new FormData();
        formData.append("titre", titre);
        formData.append("contenu", contenu);
        if (imageFile) formData.append("image", imageFile);
        if (isEditMode) formData.append("_method", "PUT");

        response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        let endpoint = "";
        let body = {};
        const method = isEditMode ? "PUT" : "POST";

        if (activeTab === "lignes") {
          if (!numero || !depart || !arrivee || !description) {
            setStatus("error");
            return;
          }
          endpoint = isEditMode ? `/lignes/${editId}` : "/lignes";
          body = { numero, depart, arrivee, description };
        } else if (activeTab === "alertes") {
          if (!ligneId || !type || !message || !statut) {
            setStatus("error");
            return;
          }
          endpoint = isEditMode ? `/alertes/${editId}` : "/alertes";
          body = { ligne_id: ligneId, type, message, statut };
        }

        response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setStatus("error");
    }
  };

  const tabLabel = activeTab === "lignes" ? "une Ligne" : activeTab === "actualites" ? "une Actualité" : "une Alerte";
  const heroIcon = isEditMode ? <PencilFill size={32} /> : <PlusCircleFill size={32} />;
  const heroTitle = isEditMode ? `Modifier ${tabLabel}` : `Ajouter ${tabLabel}`;
  const heroSubtitle = isEditMode
    ? "Modifiez les informations ci-dessous puis enregistrez."
    : "Remplissez le formulaire ci-dessous pour ajouter un nouvel élément.";

  return (
    <div className="admin-page">
      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            {heroIcon}
          </div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>
            {heroTitle}
          </h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            {heroSubtitle}
            <br />
            Sélectionnez le type à l'aide des boutons.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BODY — Form
      ══════════════════════════════════════════════ */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={formRef} className={`scroll-reveal ${formVisible ? "revealed" : ""}`}>

            {/* Back button */}
            <button className="btn btn-outline-secondary mb-4 reveal-up" onClick={() => navigate("/Admin")}>
              <ArrowLeft className="me-2" /> Retour au Dashboard
            </button>

            <div className="contact-form-card reveal-up" style={{ animationDelay: "0.1s" }}>

              {/* ── Tab Pills (same style as Admin) ── */}
              {!isEditMode && (
                <div className="admin-tabs mb-4">
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === "lignes" ? "admin-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("lignes")}
                  >
                    <BusFrontFill size={16} />
                    <span>Lignes</span>
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === "actualites" ? "admin-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("actualites")}
                  >
                    <Newspaper size={16} />
                    <span>Actualités</span>
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${activeTab === "alertes" ? "admin-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("alertes")}
                  >
                    <ExclamationTriangleFill size={16} />
                    <span>Alertes</span>
                  </button>
                </div>
              )}

              {/* Show which type we're editing */}
              {isEditMode && (
                <div className="text-center mb-4">
                  <span className="admin-badge admin-badge--info" style={{ fontSize: 14, padding: "8px 20px" }}>
                    {activeTab === "lignes" ? "Ligne" : activeTab === "actualites" ? "Actualité" : "Alerte"}
                  </span>
                </div>
              )}

              {/* ── État : Succès ── */}
              {status === "success" && (
                <div className="contact-success-state text-center py-4">
                  <div className="contact-success-icon mb-3">
                    <CheckCircleFill size={56} className="text-success" />
                  </div>
                  <h3 className="fw-bold mb-2" style={{ color: "#1e3a5f" }}>Opération réussie !</h3>
                  <p className="text-secondary mb-4">L'élément a été {isEditMode ? "modifié" : "ajouté"} avec succès.</p>
                  <div className="d-flex justify-content-center gap-3">
                    <button className="btn-ctf-primary" onClick={() => navigate("/Admin")}>
                      Retour au Dashboard
                    </button>
                    {!isEditMode && (
                      <button className="btn-ctf-ghost" onClick={() => {
                        setStatus("idle");
                        // Reset forms
                        setTitre(""); setContenu(""); setImageFile(null); setImagePreview("");
                        setNumero(""); setDepart(""); setArrivee(""); setDescription("");
                        setLigneId(""); setType("info"); setMessage(""); setStatut("active");
                      }}>
                        Ajouter un autre
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── État : Erreur ── */}
              {status === "error" && (
                <div className="contact-error-state text-center py-4">
                  <div className="mb-3">
                    <ExclamationTriangleFill size={52} className="text-danger" />
                  </div>
                  <h3 className="fw-bold mb-2" style={{ color: "#1e3a5f" }}>Une erreur est survenue</h3>
                  <p className="text-secondary mb-4">Vérifiez les champs du formulaire ou votre connexion réseau.</p>
                  <button className="btn-ctf-primary" onClick={() => setStatus("idle")}>
                    Réessayer
                  </button>
                </div>
              )}

              {/* ── Formulaire (Affiché si pas succès/erreur) ── */}
              {(status === "idle" || status === "loading") && (
                <form onSubmit={handleSubmit}>
                  {/* ── Ligne form ── */}
                  {activeTab === "lignes" && (
                    <>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Numéro</label>
                        <input type="text" className="contact-input" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex : L01" required />
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Départ</label>
                        <input type="text" className="contact-input" value={depart} onChange={(e) => setDepart(e.target.value)} placeholder="Ex : Bab Ftouh" required />
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Arrivée</label>
                        <input type="text" className="contact-input" value={arrivee} onChange={(e) => setArrivee(e.target.value)} placeholder="Ex : Ain Chkef" required />
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Description</label>
                        <textarea className="contact-input contact-textarea" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description de la ligne..." required></textarea>
                      </div>
                    </>
                  )}

                  {/* ── Actualite form ── */}
                  {activeTab === "actualites" && (
                    <>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Titre</label>
                        <input type="text" className="contact-input" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre de l'actualité" required />
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Contenu</label>
                        <textarea className="contact-input contact-textarea" rows="4" value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Contenu de l'actualité..." required></textarea>
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label"><ImageFill className="me-2" />Image (optionnel)</label>
                        <input type="file" className="contact-input" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                          <div className="mt-2">
                            <img src={imagePreview} alt="Aperçu" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 12, objectFit: "cover" }} />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ── Alerte form ── */}
                  {activeTab === "alertes" && (
                    <>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Ligne concernée</label>
                        <select className="contact-input contact-select" value={ligneId} onChange={(e) => setLigneId(e.target.value)} required>
                          <option value="">-- Choisir une ligne --</option>
                          {lignes.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.numero} — {l.depart} → {l.arrivee}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Type</label>
                        <select className="contact-input contact-select" value={type} onChange={(e) => setType(e.target.value)} required>
                          <option value="info">Info</option>
                          <option value="retard">Retard</option>
                          <option value="perturbation">Perturbation</option>
                        </select>
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Message</label>
                        <textarea className="contact-input contact-textarea" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message de l'alerte..." required></textarea>
                      </div>
                      <div className="contact-field-group mb-3">
                        <label className="contact-label">Statut</label>
                        <select className="contact-input contact-select" value={statut} onChange={(e) => setStatut(e.target.value)} required>
                          <option value="active">Active</option>
                          <option value="resolue">Résolue</option>
                        </select>
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn-ctf-primary w-100 justify-content-center contact-submit-btn mt-3" disabled={status === "loading"}>
                    {status === "loading" ? "Chargement..." : isEditMode ? <><PencilFill /> Enregistrer les modifications</> : <><PlusCircleFill /> Ajouter {tabLabel}</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
