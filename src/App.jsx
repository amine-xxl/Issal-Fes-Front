/**
 * Composant racine de l'application (Entry Point).
 * Ce fichier définit la structure globale de l'interface (Navbar, Routes, Footer)
 * et gère le routage principal via React Router.
 */

import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import News from "./components/News";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./index.css";
import UserInfo from "./components/UserInfo";
import Admin from "./pages/Admin";
import AjoutNews from "./pages/AjoutNews";
import ProInfos from "./pages/ProInfos";
import Affectation from "./pages/Affectation";

/**
 * Composant TopLoadingBar
 * Affiche une barre de progression discrète en haut de l'écran lors du changement de route.
 * Utilise la 'key' pour forcer le redéclenchement de l'animation CSS à chaque navigation.
 */
function TopLoadingBar() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Incrémente la clé à chaque changement d'URL pour relancer l'animation définie dans index.css
    setKey(prev => prev + 1);
  }, [location.pathname]);

  return <div key={key} className="top-loading-bar" />;
}

export default function App() {
  return (
    <div className="App">
      {/* Composants persistants sur toutes les pages */}
      <TopLoadingBar />
      <Navbar />

      {/* Système de routage : définit quel composant afficher selon l'URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Tickets" />
        <Route path="/About" element={<About />} />
        <Route path="/News" element={<News />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/UserInfo" element={<UserInfo />} />
        <Route path="/InfosPro" element={<ProInfos />} />
        
        {/* Routes d'administration */}
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Affectation" element={<Affectation />} />
        <Route path="/ajout-news" element={<AjoutNews />} />
      </Routes>

      <Footer />
    </div>
  );
}
