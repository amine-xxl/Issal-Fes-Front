import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BusFrontFill,
  ExclamationTriangleFill,
  ArrowLeft,
  PlusCircleFill,
  PencilFill,
  ImageFill,
  CheckCircleFill,
  TrashFill,
  PlusLg,
  PeopleFill,
  GeoAltFill,
  CurrencyDollar,
  Link45deg,
  // FIX: Truck n'existe pas dans react-bootstrap-icons, remplacé par TruckFlatbed
  TruckFlatbed,
} from "react-bootstrap-icons";
import "../index.css";

/**
 * PAGE : AjoutNews
 * Formulaire polyvalent pour gérer Lignes, Actualités, Alertes, Affectations.
 */

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

const API_URL = "http://127.0.0.1:8000/api/admin";

export default function AjoutNews() {
  const { user, token } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [formRef, formVisible] = useScrollReveal(0.1);

  const isEditMode = location.state?.editMode  || false;
  const editId     = location.state?.editId    || null;
  const editData   = location.state?.editData  || null;
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "lignes");

  const [lignes,    setLignes]    = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  // ── États Lignes ──
  const [numero,      setNumero]      = useState("");
  const [depart,      setDepart]      = useState("");
  const [arrivee,     setArrivee]     = useState("");
  const [prix,        setPrix]        = useState(5.00);
  const [description, setDescription] = useState("");
  const [arretsAller,  setArretsAller]  = useState([""]);
  const [arretsRetour, setArretsRetour] = useState([""]);

  // ── États Actualités ──
  const [titre,        setTitre]        = useState("");
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contenu,      setContenu]      = useState("");

  // ── États Alertes ──
  const [message, setMessage] = useState("");
  const [type,    setType]    = useState("info");
  const [statut,  setStatut]  = useState("active");
  const [ligneId, setLigneId] = useState("");

  // ── États Chauffeurs ──
  const [chfUserId,   setChfUserId]   = useState("");
  const [chfLigneId,  setChfLigneId]  = useState("");
  const [chfBusNum,   setChfBusNum]   = useState("");
  const [chfModele,   setChfModele]   = useState("");
  const [chfCapacite, setChfCapacite] = useState(15);
  const [chfTrajet,   setChfTrajet]   = useState("");
  const [chfTarif,    setChfTarif]    = useState(5);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  // FIX: fetch lignes depuis l'endpoint public (pas admin)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lignes", {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setLignes(Array.isArray(data) ? data : []));

    if (activeTab === "chauffeurs") {
      fetch(`${API_URL}/chauffeurs`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setChauffeurs(Array.isArray(data) ? data : []));
    }

    // Pré-remplissage en mode édition
    if (isEditMode && editData) {
      if (activeTab === "lignes") {
        setNumero(editData.numero || "");
        setDepart(editData.depart || "");
        setArrivee(editData.arrivee || "");
        setPrix(editData.prix || 5.00);
        setDescription(editData.description || "");
        if (editData.itineraires) {
          const aller  = editData.itineraires.filter((i) => i.direction === "aller").map((i) => i.nom_arret);
          const retour = editData.itineraires.filter((i) => i.direction === "retour").map((i) => i.nom_arret);
          setArretsAller(aller.length  > 0 ? aller  : [""]);
          setArretsRetour(retour.length > 0 ? retour : [""]);
        }
      } else if (activeTab === "actualites") {
        setTitre(editData.titre || "");
        setContenu(editData.contenu || "");
        if (editData.image) {
          setImagePreview(
            editData.image.startsWith("http")
              ? editData.image
              : `http://127.0.0.1:8000${editData.image}`
          );
        }
      } else if (activeTab === "alertes") {
        setMessage(editData.message || "");
        setType(editData.type || "info");
        setStatut(editData.statut || "active");
        setLigneId(editData.ligne_id || "");
      } else if (activeTab === "chauffeurs") {
        setChfUserId(editData.id);
        if (editData.pro_info) {
          setChfLigneId(editData.pro_info.ligne_id  || "");
          setChfBusNum(editData.pro_info.numero_bus  || "");
          setChfModele(editData.pro_info.modele      || "");
          setChfCapacite(editData.pro_info.capacite  || 15);
          setChfTrajet(editData.pro_info.trajet      || "");
          setChfTarif(editData.pro_info.tarif        || 5);
        }
      }
    }
  }, [isEditMode, editData, activeTab, token]);

  const handleAddStop    = (dir) => {
    if (dir === "aller") setArretsAller([...arretsAller, ""]);
    else setArretsRetour([...arretsRetour, ""]);
  };

  const handleRemoveStop = (dir, index) => {
    if (dir === "aller") setArretsAller(arretsAller.filter((_, i) => i !== index));
    else setArretsRetour(arretsRetour.filter((_, i) => i !== index));
  };

  const handleUpdateStop = (dir, index, val) => {
    if (dir === "aller") {
      const s = [...arretsAller]; s[index] = val; setArretsAller(s);
    } else {
      const s = [...arretsRetour]; s[index] = val; setArretsRetour(s);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      let endpoint = "";
      let method   = "POST";
      let body     = null;
      let isMultipart = false;

      if (activeTab === "lignes") {
        endpoint = isEditMode ? `/lignes/${editId}` : "/lignes";
        // FIX: Laravel apiResource attend PUT pour update, on envoie PUT avec JSON
        method = isEditMode ? "PUT" : "POST";
        body   = JSON.stringify({
          numero, depart, arrivee, prix, description,
          arrets_aller:  arretsAller.filter(Boolean),
          arrets_retour: arretsRetour.filter(Boolean),
        });

      } else if (activeTab === "actualites") {
        // FIX: Pour les actualités, on utilise POST avec _method=PUT (route api.php accepte POST pour update)
        endpoint    = isEditMode ? `/actualites/${editId}` : "/actualites";
        method      = "POST";
        isMultipart = true;
        const fd    = new FormData();
        fd.append("titre",   titre);
        fd.append("contenu", contenu);
        if (imageFile) fd.append("image", imageFile);
        // _method non nécessaire car la route api.php accepte directement POST pour update
        body = fd;

      } else if (activeTab === "alertes") {
        endpoint = isEditMode ? `/alertes/${editId}` : "/alertes";
        method   = isEditMode ? "PUT" : "POST";
        body     = JSON.stringify({ ligne_id: ligneId, type, message, statut });

      } else if (activeTab === "chauffeurs") {
        // FIX: toujours POST pour updateOrCreate côté Laravel
        endpoint = "/chauffeurs";
        method   = "POST";
        body     = JSON.stringify({
          user_id:    chfUserId,
          ligne_id:   chfLigneId,
          numero_bus: chfBusNum,
          modele:     chfModele,
          capacite:   chfCapacite,
          trajet:     chfTrajet,
          tarif:      chfTarif,
        });
      }

      const headers = {
        Accept:        "application/json",
        Authorization: `Bearer ${token}`,
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      };

      const res = await fetch(`${API_URL}${endpoint}`, { method, headers, body });

      if (res.ok) {
        setStatus("success");
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur serveur:", errData);
        setStatus("error");
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      setStatus("error");
    }
  };

  const getReturnPath = () => (activeTab === "chauffeurs" ? "/Affectation" : "/Admin");

  const getHeroText = () => {
    if (activeTab === "chauffeurs") return "Affectation Chauffeur";
    const labels = { lignes: "une Ligne", actualites: "une Actualité", alertes: "une Alerte" };
    return isEditMode ? `Modifier ${labels[activeTab]}` : `Ajouter ${labels[activeTab]}`;
  };

  return (
    <div className="admin-page">
      <section
        ref={heroRef}
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            {isEditMode ? <PencilFill size={32} /> : <PlusCircleFill size={32} />}
          </div>
          <h1 className="contact-hero-title reveal-up">{getHeroText()}</h1>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up mt-3">
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={formRef} className={`scroll-reveal ${formVisible ? "revealed" : ""}`}>
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(getReturnPath())}>
              <ArrowLeft className="me-1" /> Retour
            </button>

            <div className="contact-form-card">
              {status === "success" ? (
                <div className="text-center py-4">
                  <CheckCircleFill size={56} className="text-success mb-3" />
                  <h3>{activeTab === "chauffeurs" ? "Affectation réussie !" : "Opération réussie !"}</h3>
                  <button
                    className="btn-ctf-primary mt-4 px-4 py-2"
                    style={{ borderRadius: "12px" }}
                    onClick={() => navigate(getReturnPath())}
                  >
                    Terminer
                  </button>
                </div>

              ) : status === "error" ? (
                <div className="text-center py-4">
                  <ExclamationTriangleFill size={52} className="text-danger mb-3" />
                  <h3>Une erreur est survenue</h3>
                  <p className="text-secondary">Vérifiez les données saisies et réessayez.</p>
                  <button
                    className="btn-ctf-primary mt-4 px-4 py-2"
                    style={{ borderRadius: "12px" }}
                    onClick={() => setStatus("idle")}
                  >
                    Réessayer
                  </button>
                </div>

              ) : (
                <form onSubmit={handleSubmit}>

                  {/* ── LIGNES ── */}
                  {activeTab === "lignes" && (
                    <>
                      <div className="mb-3">
                        <label className="contact-label">Numéro de ligne</label>
                        <input className="contact-input" value={numero} placeholder="Ex: 101" onChange={(e) => setNumero(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Point de départ</label>
                        <input className="contact-input" value={depart} placeholder="Ex: Gare Centrale" onChange={(e) => setDepart(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Point d'arrivée</label>
                        <input className="contact-input" value={arrivee} placeholder="Ex: Université" onChange={(e) => setArrivee(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Prix du billet (MAD)</label>
                        <input type="number" step="0.5" min="0" className="contact-input" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                      </div>

                      <div className="mb-4">
                        <label className="contact-label mb-2">Arrêts Aller</label>
                        <div className="d-flex flex-column gap-2">
                          {arretsAller.map((stop, i) => (
                            <div key={i} className="d-flex gap-2">
                              <input
                                className="contact-input"
                                value={stop}
                                placeholder={`Arrêt ${i + 1}`}
                                onChange={(e) => handleUpdateStop("aller", i, e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: "8px" }}
                                onClick={() => handleRemoveStop("aller", i)}
                                disabled={arretsAller.length === 1}
                              >
                                <TrashFill />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm mt-2"
                          style={{ borderRadius: "8px", fontSize: "12px" }}
                          onClick={() => handleAddStop("aller")}
                        >
                          <PlusLg className="me-1" /> Ajouter un arrêt
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="contact-label mb-2">Arrêts Retour</label>
                        <div className="d-flex flex-column gap-2">
                          {arretsRetour.map((stop, i) => (
                            <div key={i} className="d-flex gap-2">
                              <input
                                className="contact-input"
                                value={stop}
                                placeholder={`Arrêt ${i + 1}`}
                                onChange={(e) => handleUpdateStop("retour", i, e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: "8px" }}
                                onClick={() => handleRemoveStop("retour", i)}
                                disabled={arretsRetour.length === 1}
                              >
                                <TrashFill />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm mt-2"
                          style={{ borderRadius: "8px", fontSize: "12px" }}
                          onClick={() => handleAddStop("retour")}
                        >
                          <PlusLg className="me-1" /> Ajouter un arrêt
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="contact-label">Description</label>
                        <textarea
                          className="contact-input"
                          value={description}
                          placeholder="Brève description de la ligne..."
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* ── ACTUALITÉS ── */}
                  {activeTab === "actualites" && (
                    <>
                      <div className="mb-3">
                        <label className="contact-label">Titre</label>
                        <input className="contact-input" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Contenu</label>
                        <textarea className="contact-input" rows="5" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">
                          <ImageFill className="me-1" /> Image (optionnelle)
                        </label>
                        <input
                          type="file"
                          className="contact-input"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                          }}
                        />
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="mt-2 rounded-3 w-100"
                          style={{ maxHeight: 200, objectFit: "cover" }}
                        />
                      )}
                    </>
                  )}

                  {/* ── ALERTES ── */}
                  {activeTab === "alertes" && (
                    <>
                      <div className="mb-3">
                        <label className="contact-label">Ligne concernée</label>
                        <select className="contact-input" value={ligneId} onChange={(e) => setLigneId(e.target.value)} required>
                          <option value="">-- Sélectionnez une ligne --</option>
                          {lignes.map((l) => (
                            <option key={l.id} value={l.id}>
                              Ligne {l.numero} — {l.depart} → {l.arrivee}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Type d'alerte</label>
                        <select className="contact-input" value={type} onChange={(e) => setType(e.target.value)} required>
                          <option value="info">Info</option>
                          <option value="retard">Retard</option>
                          <option value="perturbation">Perturbation</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Statut</label>
                        <select className="contact-input" value={statut} onChange={(e) => setStatut(e.target.value)} required>
                          <option value="active">Active</option>
                          <option value="resolue">Résolue</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Message</label>
                        <textarea className="contact-input" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required />
                      </div>
                    </>
                  )}

                  {/* ── CHAUFFEURS ── */}
                  {activeTab === "chauffeurs" && (
                    <>
                      <div className="mb-4 p-3 admin-form-header rounded-3 d-flex align-items-center gap-3">
                        <div className="navbar-user-initial" style={{ width: 48, height: 48, fontSize: 20 }}>
                          {editData?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-grow-1">
                          {isEditMode ? (
                            <>
                              <h5 className="mb-0 fw-bold">{editData?.name}</h5>
                              <small className="text-muted">{editData?.email}</small>
                            </>
                          ) : (
                            <div>
                              <label className="contact-label mb-1">
                                <PeopleFill className="me-1" /> Sélectionner un chauffeur
                              </label>
                              <select
                                className="contact-input"
                                value={chfUserId}
                                onChange={(e) => setChfUserId(e.target.value)}
                                required
                              >
                                <option value="">-- Choisir un chauffeur --</option>
                                {chauffeurs.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.email})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="contact-label">
                            <BusFrontFill className="me-1" /> Ligne à assigner
                          </label>
                          <select className="contact-input" value={chfLigneId} onChange={(e) => setChfLigneId(e.target.value)} required>
                            <option value="">Choisir une ligne</option>
                            {lignes.map((l) => (
                              <option key={l.id} value={l.id}>
                                Ligne {l.numero} ({l.depart} → {l.arrivee})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          {/* FIX: TruckFlatbed remplace Truck */}
                          <label className="contact-label">
                            <TruckFlatbed className="me-1" /> Numéro du bus
                          </label>
                          <input className="contact-input" value={chfBusNum} onChange={(e) => setChfBusNum(e.target.value)} placeholder="Ex: F-1024" required />
                        </div>

                        <div className="col-md-6">
                          <label className="contact-label">
                            <TruckFlatbed className="me-1" /> Modèle du véhicule
                          </label>
                          <select className="contact-input" value={chfModele} onChange={(e) => setChfModele(e.target.value)} required>
                            <option value="">-- Choisir un modèle --</option>
                            <option value="Yutong ZK6128BEVG">Yutong ZK6128BEVG (Électrique)</option>
                            <option value="Yutong ZK6126HG">Yutong ZK6126HG (Diesel)</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="contact-label">
                            <PeopleFill className="me-1" /> Capacité (passagers)
                          </label>
                          <input type="number" min="1" className="contact-input" value={chfCapacite} onChange={(e) => setChfCapacite(e.target.value)} required />
                        </div>

                        <div className="col-md-6">
                          <label className="contact-label">
                            <GeoAltFill className="me-1" /> Description du trajet
                          </label>
                          <input className="contact-input" value={chfTrajet} onChange={(e) => setChfTrajet(e.target.value)} placeholder="Ex: Route Immouzer..." required />
                        </div>

                        <div className="col-md-6">
                          <label className="contact-label">
                            <CurrencyDollar className="me-1" /> Tarif (DH)
                          </label>
                          <input type="number" min="0" step="0.5" className="contact-input" value={chfTarif} onChange={(e) => setChfTarif(e.target.value)} required />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <button
                      type="submit"
                      className="btn-ctf-primary px-5 py-2"
                      style={{ fontSize: "15px", borderRadius: "12px" }}
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <><span className="contact-spinner me-2" /> Envoi...</>
                      ) : activeTab === "chauffeurs" ? (
                        <><Link45deg size={20} className="me-2" /> Affecter</>
                      ) : isEditMode ? (
                        "Enregistrer les modifications"
                      ) : (
                        "Ajouter au réseau"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}