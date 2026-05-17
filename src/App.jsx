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

// Composant pour la barre de progression en haut
function TopLoadingBar() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // A chaque changement de page, on force le re-rendu de la barre
    setKey(prev => prev + 1);
  }, [location.pathname]);

  return <div key={key} className="top-loading-bar" />;
}

export default function App() {
  return (
    <div className="App">
      <TopLoadingBar />
      <Navbar />
      <Routes>
        {/* Routes principales — une seule par page, React Router est case-sensitive */}
        <Route path="/" element={<Home />} />
        <Route path="/Tickets" />
        <Route path="/About" element={<About />} />
        <Route path="/News" element={<News />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/UserInfo" element={<UserInfo />} />
        <Route path="/InfosPro" element={<div>Infos Pro — Coming Soon</div>} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/ajout-news" element={<AjoutNews />} />
      </Routes>
      <Footer />
    </div>
  );
}
