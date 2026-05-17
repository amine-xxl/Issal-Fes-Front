import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "bootstrap";
import logo from "../assets/Logo.png";
import "../index.css";
import {
  PersonCircle,
  BoxArrowInRight,
  PersonPlusFill,
  MoonFill,
  SunFill,
  BoxArrowRight,
  TicketFill,
  InfoCircleFill,
  BusFrontFill,
  HouseFill,
  Newspaper,
  TelephoneFill,
  ExclamationCircleFill,
  PersonFill,
  ShieldFill,
} from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const collapseRef = useRef(null);
  const togglerRef = useRef(null);
  const dropdownRef = useRef(null);
  const navbarRef = useRef(null); // ← ref pour détecter clic extérieur mobile
  const navigate = useNavigate();

  // ── Contexte global : user connecté + fonction logout ──
  const { user, logout } = useAuth();

  // ── Theme clair/sombre ──
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e) => {
    e.stopPropagation();
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ── État ouvert/fermé du dropdown account ──
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function toggleDropdown(e) {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  }

  // ── Fermer le dropdown si clic en dehors ──
  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // ── Fermer le menu mobile Bootstrap ──
  function closeMenu() {
    if (collapseRef.current) {
      const instance =
        Collapse.getInstance(collapseRef.current) ||
        new Collapse(collapseRef.current, { toggle: false });
      instance.hide();
    }
    if (togglerRef.current) {
      togglerRef.current.setAttribute("aria-expanded", "false");
    }
  }

  // ── Fermer le menu mobile quand on clique AILLEURS sur la page ──
  useEffect(() => {
    function handleOutsideNavClick(e) {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleOutsideNavClick);
    document.addEventListener("touchstart", handleOutsideNavClick); // ← support mobile
    return () => {
      document.removeEventListener("mousedown", handleOutsideNavClick);
      document.removeEventListener("touchstart", handleOutsideNavClick);
    };
  }, []);

  // ── Naviguer depuis le dropdown et tout fermer ──
  function handleDropdownNav(path) {
    setDropdownOpen(false);
    closeMenu();
    navigate(path);
  }

  // ── Logout : vider le contexte + rediriger ──
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  }

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow p-2 navbar-enter"
    >
      <div className="container-fluid">
        {/* ── Logo ── */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="City Trans Fes" width="60" height="60" />
        </Link>

        {/* ── Hamburger mobile ── */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          ref={togglerRef}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          ref={collapseRef}
        >
          {/* ── Liens principaux (gauche) ── */}
          <ul className="navbar-nav me-auto">
            {/* Home */}
            <li className="nav-item nav-item-stagger" style={{ "--i": 1 }}>
              <Link to="/" className="nav-link mx-2" onClick={closeMenu}>
                <HouseFill className="me-1" />
                Home
              </Link>
            </li>

            {/* Tickets — visible pour tout le monde (connecté ou non) */}
            <li className="nav-item nav-item-stagger" style={{ "--i": 2 }}>
              <Link to="/Tickets" className="nav-link mx-2" onClick={closeMenu}>
                <TicketFill className="me-1" />
                Tickets
              </Link>
            </li>

            {/* Infos Pro — visible SEULEMENT pour les chauffeurs connectés */}
            {user && user.role === "chauffeur" && (
              <li className="nav-item nav-item-stagger" style={{ "--i": 3 }}>
                <Link
                  to="/InfosPro"
                  className="nav-link mx-2"
                  onClick={closeMenu}
                >
                  <InfoCircleFill className="me-1" />
                  Infos Pro
                </Link>
              </li>
            )}

            {/* Dashboard — visible SEULEMENT pour l'admin */}
            {user && user.role === "admin" && (
              <li className="nav-item nav-item-stagger" style={{ "--i": 3 }}>
                <Link to="/Admin" className="nav-link mx-2" onClick={closeMenu}>
                  <ShieldFill className="me-1" />
                  Dashboard
                </Link>
              </li>
            )}
            {/* News */}
            <li className="nav-item nav-item-stagger" style={{ "--i": 4 }}>
              <Link to="/News" className="nav-link mx-2" onClick={closeMenu}>
                <Newspaper className="me-1" />
                News
              </Link>
            </li>

            {/* Contact */}
            <li className="nav-item nav-item-stagger" style={{ "--i": 5 }}>
              <Link to="/Contact" className="nav-link mx-2" onClick={closeMenu}>
                <TelephoneFill className="me-1" />
                Contact
              </Link>
            </li>

            {/* About */}
            <li className="nav-item nav-item-stagger" style={{ "--i": 6 }}>
              <Link to="/About" className="nav-link mx-2" onClick={closeMenu}>
                <ExclamationCircleFill className="me-1" />
                About
              </Link>
            </li>
          </ul>

          {/* ── Droite : theme switch + dropdown ── */}
          <ul className="navbar-nav ms-auto align-items-lg-center flex-row gap-2">
            {/* Theme switch */}
            <li
              className="nav-item nav-item-stagger d-flex align-items-center me-2"
              style={{ "--i": 7 }}
            >
              <button
                className="theme-switch"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                <MoonFill className="theme-icon-moon" size={14} />
                <SunFill className="theme-icon-sun" size={14} />
                <span className="theme-switch-thumb" />
              </button>
            </li>

            {/* Dropdown account */}
            <li
              className="nav-item nav-item-stagger position-relative"
              style={{ "--i": 8 }}
              ref={dropdownRef}
            >
              {/* Bouton toggle — affiche initiale si connecté, icône sinon */}
              <button
                className={`account-toggle-btn${dropdownOpen ? " active" : ""}`}
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                type="button"
              >
                {user ? (
                  /* Initiale du nom si connecté */
                  <span className="navbar-user-initial">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  /* Icône générique si non connecté */
                  <PersonCircle size={24} className="account-icon" />
                )}
                <span className="d-lg-none ms-2">
                  {user ? user.name.split(" ")[0] : "Account"}
                </span>
              </button>

              {/* ── Panel dropdown ── */}
              <div className={`profile-dropdown${dropdownOpen ? " open" : ""}`}>
                {/* ════════════════════════
                    CAS 1 : CONNECTÉ
                ════════════════════════ */}
                {user ? (
                  <>
                    {/* Header avec initiale + nom + rôle */}
                    <div className="profile-dropdown__header">
                      <div className="profile-dropdown__avatar">
                        <span style={{ fontSize: 20, fontWeight: 800 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="profile-dropdown__welcome">
                          Bienvenue, {user.name.split(" ")[0]} !
                        </p>
                        <p className="profile-dropdown__subtitle">
                          <BusFrontFill
                            className="me-1"
                            style={{ color: "var(--brand)" }}
                          />
                          {user.role === "client" ? " Passager" : user.role === "chauffeur" ? " Chauffeur" : " Admin"}
                        </p>
                      </div>
                    </div>

                    <div className="profile-dropdown__divider" />

                    {/* Infos du compte — accessible pour client ET chauffeur */}
                    <button
                      className="profile-dropdown__item"
                      onClick={() => handleDropdownNav("/UserInfo")}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--info">
                        <PersonFill size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">
                        Infos du Compte
                      </span>
                    </button>

                    <div className="profile-dropdown__divider" />

                    {/* Logout */}
                    <button
                      className="profile-dropdown__item"
                      onClick={handleLogout}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--logout">
                        <BoxArrowRight size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">
                        Se déconnecter
                      </span>
                    </button>
                  </>
                ) : (
                  /* ════════════════════════
                      CAS 2 : NON CONNECTÉ
                  ════════════════════════ */
                  <>
                    {/* Header générique */}
                    <div className="profile-dropdown__header">
                      <div className="profile-dropdown__avatar">
                        <PersonCircle size={36} />
                      </div>
                      <div>
                        <p className="profile-dropdown__welcome">Bienvenue !</p>
                        <p className="profile-dropdown__subtitle">
                          Connectez-vous à votre compte
                        </p>
                      </div>
                    </div>

                    <div className="profile-dropdown__divider" />

                    {/* Login */}
                    <button
                      className="profile-dropdown__item"
                      onClick={() => handleDropdownNav("/Login")}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--login">
                        <BoxArrowInRight size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">Login</span>
                    </button>

                    {/* Signup */}
                    <button
                      className="profile-dropdown__item"
                      onClick={() => handleDropdownNav("/Signup")}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--signup">
                        <PersonPlusFill size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">
                        Sign Up
                      </span>
                    </button>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
