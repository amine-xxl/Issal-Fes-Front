/**
 * Composant Navbar
 */

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  // FIX: ShieldLockFill n'existe pas dans react-bootstrap-icons, remplacé par ShieldFillCheck
  ShieldFillCheck,
  Link45deg,
} from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const collapseRef  = useRef(null);
  const togglerRef   = useRef(null);
  const dropdownRef  = useRef(null);
  const navbarRef    = useRef(null);

  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  // ── Thème ──
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme(e) {
    e.stopPropagation();
    setTheme(theme === "light" ? "dark" : "light");
  }

  // ── Dropdown compte ──
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function toggleDropdown(e) {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fermeture menu mobile ──
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

  useEffect(() => {
    function handleOutsideClick(e) {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // FIX: ferme le menu à chaque changement de route
  useEffect(() => {
    closeMenu();
    setDropdownOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  }

  const isAuthPage =
    location.pathname === "/Login" || location.pathname === "/Signup";

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow p-2 navbar-enter"
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Issal Fes" width="60" />
        </Link>

        {!isAuthPage && (
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
        )}

        <div className="collapse navbar-collapse" id="navbarNav" ref={collapseRef}>
          {!isAuthPage && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item nav-item-stagger" style={{ "--i": 1 }}>
                <Link to="/" className="nav-link mx-2" onClick={closeMenu}>
                  <HouseFill className="me-1" /> Home
                </Link>
              </li>

              {/* Tickets : caché pour les chauffeurs */}
              {(!user || user.role !== "chauffeur") && (
                <li className="nav-item nav-item-stagger" style={{ "--i": 2 }}>
                  <Link to="/Tickets" className="nav-link mx-2" onClick={closeMenu}>
                    <TicketFill className="me-1" /> Tickets
                  </Link>
                </li>
              )}

              {/* Infos Pro : chauffeurs seulement */}
              {user && user.role === "chauffeur" && (
                <li className="nav-item nav-item-stagger" style={{ "--i": 3 }}>
                  <Link to="/InfosPro" className="nav-link mx-2" onClick={closeMenu}>
                    <InfoCircleFill className="me-1" /> Infos Pro
                  </Link>
                </li>
              )}

              {/* Dashboard Admin */}
              {user && user.role === "admin" && (
                <>
                  <li className="nav-item nav-item-stagger" style={{ "--i": 3 }}>
                    <Link to="/Admin" className="nav-link mx-2" onClick={closeMenu}>
                      {/* FIX: ShieldFillCheck remplace ShieldLockFill */}
                      <ShieldFillCheck className="me-1" /> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item nav-item-stagger" style={{ "--i": 3.5 }}>
                    <Link to="/Affectation" className="nav-link mx-2" onClick={closeMenu}>
                      <Link45deg className="me-1" /> Affectation
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item nav-item-stagger" style={{ "--i": 4 }}>
                <Link to="/News" className="nav-link mx-2" onClick={closeMenu}>
                  <Newspaper className="me-1" /> News
                </Link>
              </li>

              <li className="nav-item nav-item-stagger" style={{ "--i": 5 }}>
                <Link to="/Contact" className="nav-link mx-2" onClick={closeMenu}>
                  <TelephoneFill className="me-1" /> Contact
                </Link>
              </li>

              <li className="nav-item nav-item-stagger" style={{ "--i": 6 }}>
                <Link to="/About" className="nav-link mx-2" onClick={closeMenu}>
                  <ExclamationCircleFill className="me-1" /> About
                </Link>
              </li>
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center flex-row gap-2">
            <li className="nav-item nav-item-stagger d-flex align-items-center me-2" style={{ "--i": 7 }}>
              <button className="theme-switch" onClick={toggleTheme} aria-label="Toggle dark mode">
                <MoonFill className="theme-icon-moon" size={14} />
                <SunFill className="theme-icon-sun" size={14} />
                <span className="theme-switch-thumb" />
              </button>
            </li>

            <li
              className="nav-item nav-item-stagger position-relative"
              style={{ "--i": 8 }}
              ref={dropdownRef}
            >
              <button
                className={`account-toggle-btn${dropdownOpen ? " active" : ""}`}
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                type="button"
              >
                {user ? (
                  <span className="navbar-user-initial">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <PersonCircle size={24} className="account-icon" />
                )}
                <span className="d-lg-none ms-2">
                  {user ? user.name.split(" ")[0] : "Account"}
                </span>
              </button>

              <div className={`profile-dropdown${dropdownOpen ? " open" : ""}`}>
                {user ? (
                  <>
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
                          <BusFrontFill className="me-1" style={{ color: "var(--brand)" }} />
                          {user.role === "client"
                            ? " Passager"
                            : user.role === "chauffeur"
                            ? " Chauffeur"
                            : " Admin"}
                        </p>
                      </div>
                    </div>

                    <div className="profile-dropdown__divider" />

                    <button
                      className="profile-dropdown__item"
                      onClick={() => { navigate("/UserInfo"); setDropdownOpen(false); }}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--info">
                        <PersonFill size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">Infos du Compte</span>
                    </button>

                    <div className="profile-dropdown__divider" />

                    <button className="profile-dropdown__item" onClick={handleLogout}>
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--logout">
                        <BoxArrowRight size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="profile-dropdown__header">
                      <div className="profile-dropdown__avatar">
                        <PersonCircle size={36} />
                      </div>
                      <div>
                        <p className="profile-dropdown__welcome">Bienvenue !</p>
                        <p className="profile-dropdown__subtitle">Connectez-vous à votre compte</p>
                      </div>
                    </div>

                    <div className="profile-dropdown__divider" />

                    <button
                      className="profile-dropdown__item"
                      onClick={() => { navigate("/Login"); setDropdownOpen(false); }}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--login">
                        <BoxArrowInRight size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">Login</span>
                    </button>

                    <button
                      className="profile-dropdown__item"
                      onClick={() => { navigate("/Signup"); setDropdownOpen(false); }}
                    >
                      <span className="profile-dropdown__item-icon profile-dropdown__item-icon--signup">
                        <PersonPlusFill size={16} />
                      </span>
                      <span className="profile-dropdown__item-text">Sign Up</span>
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