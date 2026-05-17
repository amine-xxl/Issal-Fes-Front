import React from "react";
import { Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <div className="App">
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
        <Route path="/UserInfo"  element={<UserInfo />} />
        <Route path="/InfosPro"  element={<div>Infos Pro — Coming Soon</div>} />
      </Routes>
      <Footer />
    </div>
  );
}
