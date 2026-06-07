import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PencilFill,
  TrashFill,
  PlusCircleFill,
  BusFrontFill,
  Newspaper,
  ExclamationTriangleFill,
  ShieldFill,
  EnvelopeFill,
  CheckCircleFill,
} from "react-bootstrap-icons";
import "../index.css";

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

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/admin";

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [tableRef, tableVisible] = useScrollReveal(0.1);

  const [activeTab, setActiveTab] = useState("lignes"); // les onglets : "lignes", "actualites", "alertes", "messages"
  const [lignes, setLignes] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetchLignes(); fetchActualites(); fetchAlertes(); fetchMessages();
  }, []);

  const API_BASE = "http://127.0.0.1:8000/api";

  const fetchLignes = async () => {
    try {
      const res = await fetch(`${API_BASE}/lignes`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setLignes(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Err lignes:", err); }
  };

  const fetchActualites = async () => {
    try {
      const res = await fetch(`${API_BASE}/actualites`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setActualites(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Err actualites:", err); }
  };

  const fetchAlertes = async () => {
    try {
      const res = await fetch(`${API_BASE}/alertes`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setAlertes(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Err alertes:", err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Err messages:", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    let endpoint = "";
    if (activeTab === "lignes") endpoint = `/lignes/${id}`;
    else if (activeTab === "actualites") endpoint = `/actualites/${id}`;
    else if (activeTab === "alertes") endpoint = `/alertes/${id}`;
    else endpoint = `/messages/${id}`;

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        if (activeTab === "lignes") fetchLignes();
        else if (activeTab === "actualites") fetchActualites();
        else if (activeTab === "alertes") fetchAlertes();
        else fetchMessages();
      }
    } catch (err) { console.error("Err delete:", err); }
  };

  const handleEdit = (item) => {
    navigate("/ajout-news", { state: { activeTab, editMode: true, editId: item.id, editData: item } });
  };

  const truncateText = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="admin-page">
      <section ref={heroRef} className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}>
        <div className="contact-hero-overlay" /><div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up"><ShieldFill size={32} /></div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>Dashboard Admin</h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>Gérez les lignes, actualités et alertes de Issal Fes.</p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}><div className="contact-divider-line" /><div className="contact-divider-diamond" /><div className="contact-divider-line" /></div>
        </div>
      </section>

      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={tableRef} className={`scroll-reveal ${tableVisible ? "revealed" : ""}`}>
             <div className="admin-tabs reveal-up"> {/* Onglets de navigation */}
              <button className={`admin-tab-btn ${activeTab === "lignes" ? "admin-tab-btn--active" : ""}`} onClick={() => setActiveTab("lignes")}><BusFrontFill size={16} /> <span>Lignes</span></button>
              <button className={`admin-tab-btn ${activeTab === "actualites" ? "admin-tab-btn--active" : ""}`} onClick={() => setActiveTab("actualites")}><Newspaper size={16} /> <span>Actualités</span></button>
              <button className={`admin-tab-btn ${activeTab === "alertes" ? "admin-tab-btn--active" : ""}`} onClick={() => setActiveTab("alertes")}><ExclamationTriangleFill size={16} /> <span>Alertes</span></button>
              <button className={`admin-tab-btn ${activeTab === "messages" ? "admin-tab-btn--active" : ""}`} onClick={() => setActiveTab("messages")}><EnvelopeFill size={16} /> <span>Messages</span></button>
            </div>

            <div className="d-flex justify-content-end mb-3 reveal-up" style={{ animationDelay: "0.1s" }}>
              {activeTab !== "messages" && (
                <button className="btn-ctf-primary" onClick={() => navigate("/ajout-news", { state: { activeTab } })}><PlusCircleFill /> Ajouter</button>
              )}
            </div>

            <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                {activeTab === "lignes" && (
                  <table className="admin-custom-table">
                    <thead><tr><th>Numéro</th><th>Départ</th><th>Arrivée</th><th>Prix</th><th>Description</th><th>Actions</th></tr></thead>
                    <tbody>
                      {lignes.length === 0 ? <tr><td colSpan="6" className="admin-table-empty">Aucune donnée</td></tr> : 
                        lignes.map(item => (<tr key={item.id}><td>{item.numero}</td><td>{item.depart}</td><td>{item.arrivee}</td><td>{item.prix} MAD</td><td>{truncateText(item.description)}</td>
                          <td><div className="d-flex gap-2"><button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}><PencilFill size={13} /></button>
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}><TrashFill size={13} /></button></div></td></tr>))
                      }
                    </tbody>
                  </table>
                )}

                {activeTab === "actualites" && (
                  <table className="admin-custom-table">
                    <thead><tr><th>Image</th><th>Titre</th><th>Contenu</th><th>Actions</th></tr></thead>
                    <tbody>
                      {actualites.length === 0 ? <tr><td colSpan="4" className="admin-table-empty">Aucune donnée</td></tr> : 
                        actualites.map(item => (<tr key={item.id}><td>{item.image && <img src={item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`} alt="" style={{width:40, height:40, objectFit:'cover', borderRadius:8}} />}</td>
                          <td>{item.titre}</td><td>{truncateText(item.contenu)}</td><td><div className="d-flex gap-2"><button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}><PencilFill size={13} /></button>
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}><TrashFill size={13} /></button></div></td></tr>))
                      }
                    </tbody>
                  </table>
                )}

                {activeTab === "alertes" && (
                  <table className="admin-custom-table">
                    <thead><tr><th>Ligne</th><th>Type</th><th>Message</th><th>Statut</th><th>Actions</th></tr></thead>
                    <tbody>
                      {alertes.length === 0 ? <tr><td colSpan="5" className="admin-table-empty">Aucune donnée</td></tr> : 
                        alertes.map(item => (<tr key={item.id}><td>{item.ligne?.numero || item.ligne_id}</td><td><span className={`admin-badge admin-badge--${item.type === 'retard' ? 'warning' : item.type === 'perturbation' ? 'danger' : 'info'}`}>{item.type}</span></td>
                          <td>{truncateText(item.message)}</td><td><span className={`admin-badge admin-badge--${item.statut === 'active' ? 'success' : 'muted'}`}>{item.statut}</span></td>
                          <td><div className="d-flex gap-2"><button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}><PencilFill size={13} /></button>
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}><TrashFill size={13} /></button></div></td></tr>))
                      }
                    </tbody>
                  </table>
                )}

                {activeTab === "messages" && (
                  <table className="admin-custom-table">
                    <thead><tr><th>Nom</th><th>Email</th><th>Sujet</th><th>Message</th><th>Actions</th></tr></thead>
                    <tbody>
                      {messages.length === 0 ? <tr><td colSpan="5" className="admin-table-empty">Aucun message</td></tr> : 
                        messages.map(item => (<tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td>{item.subject}</td><td>{truncateText(item.message)}</td>
                          <td><button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}><TrashFill size={13} /></button></td></tr>))
                      }
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
