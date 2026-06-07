import React from "react";
import { Link } from "react-router-dom";
import {
  BusFrontFill,
  Discord,
  EnvelopeFill,
  Facebook,
  GeoAltFill,
  Instagram,
  Linkedin,
  TelephoneFill,
  TwitterX,
  Youtube,
} from "react-bootstrap-icons";
import "../index.css";

/**
 * Configuration des réseaux sociaux
 * On utilise un tableau d'objets pour générer dynamiquement les icônes (principe DRY : Don't Repeat Yourself).
 */
const socialLinks = [
  { icon: <Facebook />, href: "#", label: "Facebook" },
  { icon: <Instagram />, href: "#", label: "Instagram" },
  { icon: <Youtube />, href: "#", label: "YouTube" },
  { icon: <Linkedin />, href: "#", label: "LinkedIn" },
  { icon: <TwitterX />, href: "#", label: "Twitter/X" },
  { icon: <Discord />, href: "#", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="footer-root bg-body-tertiary p-4 mt-3">
      <div className="container">
        <div className="row text-center text-md-start">
          
          {/* Section Branding : Logo et Slogan */}
          <div className="col-md-4 mb-4 footer-col-enter" style={{ "--ci": 1 }}>
            <h5 className="fw-bold mb-2">Issal Fes</h5>
            <p className="small text-secondary">
              <BusFrontFill className="me-1" />
              Le Futur du Transport Public à Fès
            </p>
          </div>

          {/* Section Liens Rapides : Navigation interne via React Router Link */}
          <div className="col-md-4 mb-4 footer-col-enter" style={{ "--ci": 2 }}>
            <div className="row">
              <div className="col-6">
                <h6 className="fw-bold mb-2">Quick Links</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    <Link to="/" className="footer-link">Home</Link>
                  </li>
                  <li>
                    <Link to="/Tickets" className="footer-link">Tickets</Link>
                  </li>
                  <li>
                    <Link to="/News" className="footer-link">News</Link>
                  </li>
                  <li>
                    <Link to="/Contact" className="footer-link">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section Coordonnées : Adresse, Téléphone et Email */}
          <div className="col-md-4 mb-4 footer-col-enter" style={{ "--ci": 3 }}>
            <h6 className="fw-bold mb-2">Contact</h6>
            <p className="small mb-1">
              <GeoAltFill className="me-1 text-primary" />
              ISTA Hay Al Adarissa - Fès
            </p>
            <p className="small mb-1">
              <TelephoneFill className="me-1 text-primary" />
              +212 612 345 678
            </p>
            <p className="small mb-0">
              <EnvelopeFill className="me-1 text-primary" />
              <a href="mailto:contact@citytransfes.ma" className="footer-link">
                contact@citytransfes.ma
              </a>
            </p>
          </div>
        </div>

        <hr className="my-3" />

        {/* Barre de Copyright et Réseaux Sociaux */}
        <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-2">
          <p className="mb-0 small text-secondary">
            &copy; 2026 Issal Fes. Projet Fin Formation.
          </p>

          <div className="d-flex gap-3">
            {socialLinks.map(({ icon, href, label, color }, i) => (
              <a
                key={label}
                href={href}
                onClick={href === "#" ? (e) => e.preventDefault() : undefined}
                className="social-link"
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                // On passe l'index à la variable CSS --si pour l'animation décalée
                style={{ "--brand-color": color, "--si": i }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
