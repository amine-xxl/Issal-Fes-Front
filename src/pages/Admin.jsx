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

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/admin";

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [tableRef, tableVisible] = useScrollReveal(0.1);

  const [activeTab, setActiveTab] = useState("lignes");
  const [lignes, setLignes] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetchLignes();
    fetchActualites();
    fetchAlertes();
  }, []);

  const makeRequest = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);
      const text = await response.text();
      if (!text) return method === "GET" ? [] : {};
      return JSON.parse(text);
    } catch (error) {
      console.error("Erreur API:", error);
      return method === "GET" ? [] : {};
    }
  };

  const fetchLignes = async () => {
    const data = await makeRequest("/lignes");
    setLignes(Array.isArray(data) ? data : []);
  };
  const fetchActualites = async () => {
    const data = await makeRequest("/actualites");
    setActualites(Array.isArray(data) ? data : []);
  };
  const fetchAlertes = async () => {
    const data = await makeRequest("/alertes");
    setAlertes(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    const endpoint =
      activeTab === "lignes" ? `/lignes/${id}` :
      activeTab === "actualites" ? `/actualites/${id}` :
      `/alertes/${id}`;
    await makeRequest(endpoint, "DELETE");
    if (activeTab === "lignes") fetchLignes();
    else if (activeTab === "actualites") fetchActualites();
    else fetchAlertes();
  };

  // Navigate to AjoutNews for editing — pass item data + mode
  const handleEdit = (item) => {
    navigate("/ajout-news", {
      state: {
        activeTab,
        editMode: true,
        editId: item.id,
        editData: item,
      },
    });
  };

  const truncateText = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

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
            <ShieldFill size={32} />
          </div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>
            Dashboard Admin
          </h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            Gérez les lignes, actualités et alertes de City Trans Fes.
            <br />
            Ajoutez, modifiez ou supprimez en toute simplicité.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BODY — Custom tabs + Custom table (no Bootstrap table)
      ══════════════════════════════════════════════ */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={tableRef} className={`scroll-reveal ${tableVisible ? "revealed" : ""}`}>

            {/* ── Custom Tab Pills ── */}
            <div className="admin-tabs reveal-up">
              <button
                className={`admin-tab-btn ${activeTab === "lignes" ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("lignes")}
              >
                <BusFrontFill size={16} />
                <span>Lignes</span>
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "actualites" ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("actualites")}
              >
                <Newspaper size={16} />
                <span>Actualités</span>
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "alertes" ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("alertes")}
              >
                <ExclamationTriangleFill size={16} />
                <span>Alertes</span>
              </button>
            </div>

            {/* ── Add Button ── */}
            <div className="d-flex justify-content-end mb-3 reveal-up" style={{ animationDelay: "0.1s" }}>
              <button
                className="btn-ctf-primary"
                onClick={() => navigate("/ajout-news", { state: { activeTab } })}
              >
                <PlusCircleFill />
                Ajouter
              </button>
            </div>

            {/* ── Table LIGNES ── */}
            {activeTab === "lignes" && (
              <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Numéro</th>
                      <th>Départ</th>
                      <th>Arrivée</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.length === 0 ? (
                      <tr><td colSpan="5" className="admin-table-empty">Aucune donnée</td></tr>
                    ) : (
                      lignes.map((item) => (
                        <tr key={item.id}>
                          <td>{truncateText(item.numero)}</td>
                          <td>{truncateText(item.depart)}</td>
                          <td>{truncateText(item.arrivee)}</td>
                          <td>{truncateText(item.description)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}>
                                <PencilFill size={13} />
                              </button>
                              <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}>
                                <TrashFill size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Table ACTUALITES ── */}
            {activeTab === "actualites" && (
              <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Titre</th>
                      <th>Contenu</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actualites.length === 0 ? (
                      <tr><td colSpan="4" className="admin-table-empty">Aucune donnée</td></tr>
                    ) : (
                      actualites.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.image ? (
                              <img src={item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.titre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                            ) : (
                              <div style={{ width: 50, height: 50, backgroundColor: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 10, color: '#999' }}>Aucune</span>
                              </div>
                            )}
                          </td>
                          <td>{truncateText(item.titre)}</td>
                          <td>{truncateText(item.contenu)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}>
                                <PencilFill size={13} />
                              </button>
                              <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}>
                                <TrashFill size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Table ALERTES ── */}
            {activeTab === "alertes" && (
              <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Ligne</th>
                      <th>Type</th>
                      <th>Message</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertes.length === 0 ? (
                      <tr><td colSpan="5" className="admin-table-empty">Aucune donnée</td></tr>
                    ) : (
                      alertes.map((item) => (
                        <tr key={item.id}>
                          <td>{item.ligne ? item.ligne.numero : item.ligne_id}</td>
                          <td>
                            <span className={`admin-badge ${item.type === "retard" ? "admin-badge--warning" : item.type === "perturbation" ? "admin-badge--danger" : "admin-badge--info"}`}>
                              {item.type}
                            </span>
                          </td>
                          <td>{truncateText(item.message)}</td>
                          <td>
                            <span className={`admin-badge ${item.statut === "active" ? "admin-badge--success" : "admin-badge--muted"}`}>
                              {item.statut}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)}>
                                <PencilFill size={13} />
                              </button>
                              <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(item.id)}>
                                <TrashFill size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
