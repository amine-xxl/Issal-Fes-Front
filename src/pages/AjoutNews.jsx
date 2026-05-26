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
  TrashFill,
  PlusLg,
  PeopleFill,
  GeoAltFill,
  CurrencyDollar,
  Truck,
  Link45deg,
} from "react-bootstrap-icons";
import "../index.css";

/**
 * PAGE : AjoutNews
 * RÔLE : Formulaire polyvalent permettant de gérer :
 * - Lignes de bus, Actualités, Alertes, et Affectations chauffeurs.
 */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
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

  const isEditMode = location.state?.editMode || false;
  const editId = location.state?.editId || null;
  const editData = location.state?.editData || null;
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "lignes");

  const [lignes, setLignes] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [status, setStatus] = useState("idle");

  // ── ÉTATS : LIGNES ──
  const [numero, setNumero] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [description, setDescription] = useState("");
  const [arretsAller, setArretsAller] = useState([""]);
  const [arretsRetour, setArretsRetour] = useState([""]);

  // ── ÉTATS : ACTUALITÉS ──
  const [titre, setTitre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contenu, setContenu] = useState("");

  // ── ÉTATS : ALERTES ──
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [statut, setStatut] = useState("active");
  const [ligneId, setLigneId] = useState("");

  // ── ÉTATS : CHAUFFEURS ──
  const [chfUserId, setChfUserId] = useState("");
  const [chfLigneId, setChfLigneId] = useState("");
  const [chfBusNum, setChfBusNum] = useState("");
  const [chfModele, setChfModele] = useState("");
  const [chfCapacite, setChfCapacite] = useState(15);
  const [chfTrajet, setChfTrajet] = useState("");
  const [chfTarif, setChfTarif] = useState(5);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    // Fetch lines for dropdowns
    fetch("http://127.0.0.1:8000/api/lignes").then(res => res.json()).then(data => setLignes(Array.isArray(data) ? data : []));

    // Fetch chauffeurs for assignment
    if (activeTab === "chauffeurs") {
        fetch("http://127.0.0.1:8000/api/admin/chauffeurs", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json()).then(data => setChauffeurs(Array.isArray(data) ? data : []));
    }

    if (isEditMode && editData) {
      if (activeTab === "lignes") {
        setNumero(editData.numero || ""); setDepart(editData.depart || ""); setArrivee(editData.arrivee || ""); setDescription(editData.description || "");
        if (editData.itineraires) {
          const aller = editData.itineraires.filter(i => i.direction === 'aller').map(i => i.nom_arret);
          const retour = editData.itineraires.filter(i => i.direction === 'retour').map(i => i.nom_arret);
          setArretsAller(aller.length > 0 ? aller : [""]);
          setArretsRetour(retour.length > 0 ? retour : [""]);
        }
      } else if (activeTab === "actualites") {
        setTitre(editData.titre || ""); setContenu(editData.contenu || "");
        setImagePreview(editData.image ? (editData.image.startsWith("http") ? editData.image : `http://127.0.0.1:8000${editData.image}`) : "");
      } else if (activeTab === "alertes") {
        setMessage(editData.message || ""); setType(editData.type || "info"); setStatut(editData.statut || "active"); setLigneId(editData.ligne_id || "");
      } else if (activeTab === "chauffeurs") {
        setChfUserId(editData.id);
        if (editData.pro_info) {
          setChfLigneId(editData.pro_info.ligne_id || "");
          setChfBusNum(editData.pro_info.numero_bus || "");
          setChfModele(editData.pro_info.modele || "");
          setChfCapacite(editData.pro_info.capacite || 15);
          setChfTrajet(editData.pro_info.trajet || "");
          setChfTarif(editData.pro_info.tarif || 5);
        }
      }
    }
  }, [isEditMode, editData, activeTab, token]);

  const handleAddStop = (dir) => {
    if (dir === "aller") setArretsAller([...arretsAller, ""]);
    else setArretsRetour([...arretsRetour, ""]);
  };

  const handleRemoveStop = (dir, index) => {
    if (dir === "aller") setArretsAller(arretsAller.filter((_, i) => i !== index));
    else setArretsRetour(arretsRetour.filter((_, i) => i !== index));
  };

  const handleUpdateStop = (dir, index, val) => {
    if (dir === "aller") {
      const newStops = [...arretsAller];
      newStops[index] = val;
      setArretsAller(newStops);
    } else {
      const newStops = [...arretsRetour];
      newStops[index] = val;
      setArretsRetour(newStops);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      let endpoint = "";
      let method = isEditMode ? "PUT" : "POST";
      let body = null;
      let isMultipart = false;

      if (activeTab === "actualites") {
        endpoint = isEditMode ? `/actualites/${editId}` : "/actualites";
        const fd = new FormData();
        fd.append("titre", titre); fd.append("contenu", contenu);
        if (imageFile) fd.append("image", imageFile);
        if (isEditMode) fd.append("_method", "PUT");
        body = fd; isMultipart = true;
      } else if (activeTab === "chauffeurs") {
        endpoint = "/chauffeurs"; method = "POST";
        body = JSON.stringify({ user_id: chfUserId, ligne_id: chfLigneId, numero_bus: chfBusNum, modele: chfModele, capacite: chfCapacite, trajet: chfTrajet, tarif: chfTarif });
      } else {
        endpoint = activeTab === "lignes" ? (isEditMode ? `/lignes/${editId}` : "/lignes") : (isEditMode ? `/alertes/${editId}` : "/alertes");
        body = JSON.stringify(activeTab === "lignes" ? { numero, depart, arrivee, description, arrets_aller: arretsAller, arrets_retour: arretsRetour } : { ligne_id: ligneId, type, message, statut });
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: isMultipart ? "POST" : method,
        headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...(isMultipart ? {} : { "Content-Type": "application/json" }) },
        body
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (e) { setStatus("error"); }
  };

  const getSuccessText = () => {
    if (activeTab === "chauffeurs") return "Affectation réussie !";
    return "Opération réussie !";
  };

  const getReturnPath = () => {
    if (activeTab === "chauffeurs") return "/Affectation";
    return "/Admin";
  };

  const getHeroText = () => {
    if (activeTab === "chauffeurs") return "Affectation Chauffeur";
    const label = activeTab === "lignes" ? "une Ligne" : activeTab === "actualites" ? "une Actualité" : "une Alerte";
    return isEditMode ? `Modifier ${label}` : `Ajouter ${label}`;
  };

  return (
    <div className="admin-page">
      <section ref={heroRef} className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}>
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">{isEditMode ? <PencilFill size={32} /> : <PlusCircleFill size={32} />}</div>
          <h1 className="contact-hero-title reveal-up">{getHeroText()}</h1>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up mt-3">
            <div className="contact-divider-line" /><div className="contact-divider-diamond" /><div className="contact-divider-line" />
          </div>
        </div>
      </section>

      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={formRef} className={`scroll-reveal ${formVisible ? "revealed" : ""}`}>
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(getReturnPath())}><ArrowLeft /> Retour</button>

            <div className="contact-form-card">
              {status === "success" ? (
                <div className="text-center py-4">
                  <CheckCircleFill size={56} className="text-success mb-3" />
                  <h3>{getSuccessText()}</h3>
                  <button className="btn-ctf-primary mt-4 px-4 py-2" style={{ borderRadius: '12px' }} onClick={() => navigate(getReturnPath())}>Terminer</button>
                </div>
              ) : status === "error" ? (
                <div className="text-center py-4">
                  <ExclamationTriangleFill size={52} className="text-danger mb-3" />
                  <h3>Une erreur est survenue</h3>
                  <button className="btn-ctf-primary mt-4 px-4 py-2" style={{ borderRadius: '12px' }} onClick={() => setStatus("idle")}>Réessayer</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {activeTab === "lignes" && (
                    <>
                      <div className="mb-3">
                        <label className="contact-label">Numéro</label>
                        <input className="contact-input" value={numero} placeholder="Ex: 101" onChange={e => setNumero(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Départ</label>
                        <input className="contact-input" value={depart} placeholder="Ex: Gare Centrale" onChange={e => setDepart(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="contact-label">Arrivée</label>
                        <input className="contact-input" value={arrivee} placeholder="Ex: Université" onChange={e => setArrivee(e.target.value)} required />
                      </div>
                      
                      <div className="mb-4">
                        <label className="contact-label mb-2">Itinéraire (Arrêts Aller)</label>
                        <div className="d-flex flex-column gap-2">
                          {arretsAller.map((stop, i) => (
                            <div key={i} className="d-flex gap-2">
                              <input className="contact-input" value={stop} placeholder={`Nom de l'arrêt ${i+1}`} onChange={e => handleUpdateStop("aller", i, e.target.value)} required />
                              <button type="button" className="btn btn-outline-danger btn-sm" style={{ borderRadius: '8px' }} onClick={() => handleRemoveStop("aller", i)}><TrashFill /></button>
                            </div>
                          ))}
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-outline-primary btn-sm mt-2" 
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                            onClick={() => handleAddStop("aller")}
                        >
                            <PlusLg className="me-1" /> Ajouter un arrêt
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="contact-label mb-2">Itinéraire (Arrêts Retour)</label>
                        <div className="d-flex flex-column gap-2">
                          {arretsRetour.map((stop, i) => (
                            <div key={i} className="d-flex gap-2">
                              <input className="contact-input" value={stop} placeholder={`Nom de l'arrêt ${i+1}`} onChange={e => handleUpdateStop("retour", i, e.target.value)} required />
                              <button type="button" className="btn btn-outline-danger btn-sm" style={{ borderRadius: '8px' }} onClick={() => handleRemoveStop("retour", i)}><TrashFill /></button>
                            </div>
                          ))}
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-outline-primary btn-sm mt-2" 
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                            onClick={() => handleAddStop("retour")}
                        >
                            <PlusLg className="me-1" /> Ajouter un arrêt
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="contact-label">Description</label>
                        <textarea className="contact-input" value={description} placeholder="Brève description de la ligne..." onChange={e => setDescription(e.target.value)} required />
                      </div>
                    </>
                  )}

                  {activeTab === "actualites" && (
                    <>
                      <div className="mb-3"><label className="contact-label">Titre</label><input className="contact-input" value={titre} onChange={e => setTitre(e.target.value)} required /></div>
                      <div className="mb-3"><label className="contact-label">Contenu</label><textarea className="contact-input" rows="5" value={contenu} onChange={e => setContenu(e.target.value)} required /></div>
                      <div className="mb-3"><label className="contact-label"><ImageFill /> Image</label><input type="file" className="contact-input" onChange={e => { const f = e.target.files[0]; if(f){ setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} /></div>
                      {imagePreview && <img src={imagePreview} alt="" className="mt-2 rounded-3 w-100" style={{maxHeight:200, objectFit:'cover'}} />}
                    </>
                  )}

                  {activeTab === "alertes" && (
                    <>
                      <div className="mb-3"><label className="contact-label">Ligne</label><select className="contact-input" value={ligneId} onChange={e => setLigneId(e.target.value)} required><option value="">Sélectionnez</option>{lignes.map(l => <option key={l.id} value={l.id}>Ligne {l.numero}</option>)}</select></div>
                      <div className="mb-3"><label className="contact-label">Type</label><select className="contact-input" value={type} onChange={e => setType(e.target.value)} required><option value="info">Info</option><option value="retard">Retard</option><option value="perturbation">Perturbation</option></select></div>
                      <div className="mb-3"><label className="contact-label">Statut</label><select className="contact-input" value={statut} onChange={e => setStatut(e.target.value)} required><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                      <div className="mb-3"><label className="contact-label">Message</label><textarea className="contact-input" value={message} onChange={e => setMessage(e.target.value)} required /></div>
                    </>
                  )}

                  {activeTab === "chauffeurs" && (
                    <>
                      <div className="mb-4 p-3 admin-form-header rounded-3 d-flex align-items-center gap-3">
                        <div className="navbar-user-initial" style={{width:48, height:48, fontSize:20}}>{editData?.name?.charAt(0) || "?"}</div>
                        <div className="flex-grow-1">
                            {isEditMode ? (
                                <h5 className="mb-0 fw-bold">{editData?.name}</h5>
                            ) : (
                                <div>
                                    <label className="contact-label mb-1">Sélectionner un Chauffeur</label>
                                    <select className="contact-input" value={chfUserId} onChange={e => setChfUserId(e.target.value)} required>
                                        <option value="">-- Choisir un chauffeur --</option>
                                        {chauffeurs.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {isEditMode && <small className="text-muted">{editData?.email}</small>}
                        </div>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                            <label className="contact-label"><BusFrontFill className="me-2"/> Ligne à assigner</label>
                            <select className="contact-input" value={chfLigneId} onChange={e => setChfLigneId(e.target.value)} required>
                                <option value="">Choisir une ligne</option>
                                {lignes.map(l => <option key={l.id} value={l.id}>Ligne {l.numero} ({l.depart} - {l.arrivee})</option>)}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="contact-label"><Truck className="me-2"/> Numéro du Bus</label>
                            <input className="contact-input" value={chfBusNum} onChange={e => setChfBusNum(e.target.value)} placeholder="Ex: F-1024" required />
                        </div>
                        <div className="col-md-6">
                            <label className="contact-label"><Truck className="me-2"/> Modèle du véhicule</label>
                            <select className="contact-input" value={chfModele} onChange={e => setChfModele(e.target.value)} required>
                                <option value="">-- Choisir un modèle --</option>
                                <option value="Yutong ZK6128BEVG">Yutong ZK6128BEVG (Électrique)</option>
                                <option value="Yutong ZK6126HG">Yutong ZK6126HG (Diesel)</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="contact-label"><PeopleFill className="me-2"/> Capacité (Passagers)</label>
                            <input type="number" className="contact-input" value={chfCapacite} onChange={e => setChfCapacite(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="contact-label"><GeoAltFill className="me-2"/> Description Trajet</label>
                            <input className="contact-input" value={chfTrajet} onChange={e => setChfTrajet(e.target.value)} placeholder="Ex: Route Immouzer..." required />
                        </div>
                        <div className="col-md-6">
                            <label className="contact-label"><CurrencyDollar className="me-2"/> Tarif (DH)</label>
                            <input type="number" className="contact-input" value={chfTarif} onChange={e => setChfTarif(e.target.value)} required />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <button 
                        type="submit" 
                        className="btn-ctf-primary px-5 py-2" 
                        style={{ fontSize: '15px', borderRadius: '12px' }}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? (
                            "Envoi..."
                        ) : activeTab === 'chauffeurs' ? (
                            <><Link45deg size={20} className="me-2"/> Affecter</>
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
