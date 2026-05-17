// src/data/TempData.js
// Données temporaires — à remplacer par fetch("/api/news") plus tard via useNews.js

/* ── Import des images (obligatoire avec Create React App) ── */
import fakedatanews from "../assets/fakedatanews.jpg";
/* ── Articles de news ── */
export const articles = [
  {
    id: 2,
    title: "Nouveaux horaires d'été — service étendu jusqu'à 23h",
    category: "Horaires",
    date: "2026-04-21",
    excerpt:
      "À partir du 1er juin, les lignes principales circuleront jusqu'à 23h00 du dimanche au jeudi pour mieux répondre aux besoins des habitants.",
    image: fakedatanews,
    featured: false,
  },
  {
    id: 3,
    title: "Pass mensuel étudiant à 60 DH — offre de rentrée",
    category: "Offres & Tarifs",
    date: "2026-04-15",
    excerpt:
      "Les étudiants peuvent bénéficier d'un pass mensuel illimité au tarif préférentiel sur présentation de leur carte universitaire valide.",
    image: fakedatanews,
    featured: false,
  },
  {
    id: 4,
    title: "Nouvel arrêt : Université Sidi Mohamed Ben Abdellah",
    category: "Lignes & Réseau",
    date: "2026-04-08",
    excerpt:
      "La ligne 7 intègre désormais un arrêt devant l'université, réduisant considérablement le temps de trajet pour des milliers d'étudiants chaque jour.",
    image: fakedatanews,
    featured: false,
  },
  {
    id: 5,
    title: "Application mobile City Trans Fes disponible sur Android",
    category: "Événements",
    date: "2026-03-30",
    excerpt:
      "Suivez vos lignes en temps réel, consultez les horaires et achetez vos tickets depuis votre smartphone. Disponible gratuitement sur le Play Store.",
    image: fakedatanews,
    featured: false,
  },
  {
    id: 6,
    title: "Bilan 2025 : 18 millions de passagers transportés",
    category: "Événements",
    date: "2026-03-20",
    excerpt:
      "City Trans Fes publie son rapport annuel 2025 avec une hausse de 12% de la fréquentation. Un record pour le réseau de transport public fassi.",
    image: fakedatanews,
    featured: false,
  },
];

/* ── Alertes perturbations actives ── */
export const alerts = [
  {
    id: 1,
    line: "Ligne 12",
    message:
      "Déviation jusqu'au 10 mai suite aux travaux Av. Hassan II. Arrêts temporaires : Place Florence et Bd Allal Al Fassi.",
    until: "2026-05-10",
  },
];

/* ── Catégories disponibles pour le filtre ── */
export const CATEGORIES = [
  "Tout",
  "Lignes & Réseau",
  "Horaires",
  "Perturbations",
  "Offres & Tarifs",
  "Événements",
];

/* ── Couleur de badge par catégorie ── */
export const CATEGORY_COLORS = {
  "Lignes & Réseau": "badge-green",
  "Horaires":        "badge-blue",
  "Perturbations":   "badge-red",
  "Offres & Tarifs": "badge-amber",
  "Événements":      "badge-purple",
};