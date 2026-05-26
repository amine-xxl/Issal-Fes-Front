import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PencilFill,
  Link45deg,
  PeopleFill,
  PlusCircleFill,
} from "react-bootstrap-icons";
import "../index.css";

/**
 * PAGE : Affectation
 * RÔLE : Gestion des affectations chauffeurs (Lignes & Bus).
 * Accessible uniquement aux administrateurs.
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

export default function Affectation() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/admin";

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [tableRef, tableVisible] = useScrollReveal(0.1);

  const [chauffeurs, setChauffeurs] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const fetchChauffeurs = async () => {
    try {
      const response = await fetch(`${API_URL}/chauffeurs`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setChauffeurs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur API:", error);
    }
  };

  const handleEdit = (item) => {
    navigate("/ajout-news", {
      state: {
        activeTab: "chauffeurs",
        editMode: true,
        editId: item.id,
        editData: item,
      },
    });
  };

  return (
    <div className="admin-page">
      {/* ── HERO ── */}
      <section ref={heroRef} className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}>
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            <Link45deg size={32} />
          </div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>Affectations</h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>Gérez les missions et les véhicules de vos chauffeurs.</p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" /><div className="contact-divider-diamond" /><div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={tableRef} className={`scroll-reveal ${tableVisible ? "revealed" : ""}`}>
            
            <div className="d-flex justify-content-end mb-3 reveal-up" style={{ animationDelay: "0.1s" }}>
                <button
                  className="btn-ctf-primary"
                  onClick={() =>
                    navigate("/ajout-news", { state: { activeTab: "chauffeurs" } })
                  }
                >
                  <PlusCircleFill className="me-2" />
                  Ajouter
                </button>
            </div>

            <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Chauffeur</th>
                      <th>Email</th>
                      <th>Ligne Assignée</th>
                      <th>Bus</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chauffeurs.length === 0 ? (
                      <tr><td colSpan="5" className="admin-table-empty">Aucun chauffeur trouvé</td></tr>
                    ) : (
                      chauffeurs.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-bold">{item.name}</td>
                          <td style={{ fontSize: 12 }}>{item.email}</td>
                          <td>
                            {item.pro_info ? (
                                <span className="badge bg-dark">Ligne {item.pro_info.ligne?.numero || item.pro_info.ligne_id}</span>
                            ) : (
                                <span className="text-danger italic">Non assigné</span>
                            )}
                          </td>
                          <td>
                             {item.pro_info ? (
                                 <div className="d-flex flex-column">
                                     <span className="fw-bold" style={{ color: "var(--brand-dark)" }}>{item.pro_info.numero_bus}</span>
                                     <small className="text-muted" style={{ fontSize: 10 }}>{item.pro_info.modele}</small>
                                 </div>
                             ) : "—"}
                          </td>
                          <td>
                            <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(item)} title="Modifier l'affectation">
                              <PencilFill size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
