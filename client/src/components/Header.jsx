// src/components/Header.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/userService"; // Assurez-vous que le chemin est correct
import { User, LogIn, UserPlus, Search, Heart, Bell, Menu, X } from "lucide-react";

// Helper pour générer les initiales de l'utilisateur
const getInitials = (name = "") => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Gestion du style de la barre de navigation au scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // Garder les données fraîches pendant 5 minutes
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Pour que react-query rafraîchisse l'état de l'utilisateur, une redirection est plus fiable
    window.location.href = '/login';
  };
  
  // Composant pour le menu utilisateur sur grand écran
  const UserMenuDesktop = () => (
    <div className="flex items-center gap-4">
       <button className="text-gray-300 hover:text-white transition-colors">
            <Heart size={22} />
        </button>
        <button className="text-gray-300 hover:text-white transition-colors">
            <Bell size={22} />
        </button>
      {isLoading ? (
        <div className="h-10 w-32 animate-pulse rounded-full bg-gray-700"></div>
      ) : user ? (
        <div className="group relative flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold text-sm">
                {getInitials(user.fullName)}
            </div>
            <div className="text-left hidden md:block">
                <p className="font-semibold text-white truncate max-w-[100px]">{user.fullName}</p>
                <p className="text-xs text-gray-400">Membre</p>
            </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-white font-semibold rounded-full hover:bg-gray-700 transition-colors"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            Inscription
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-transparent pt-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span
              onClick={() => navigate("/")}
              className="text-3xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
            >
              KmerStay
            </span>
          </div>

          {/* Barre de recherche centrale (visible sur grand écran) */}
          <div className="hidden lg:flex flex-grow items-center justify-center px-8">
             <div className="w-full max-w-xl relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher un hôtel, une ville..."
                    className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                    Rechercher
                </button>
             </div>
          </div>

          {/* Menu utilisateur (visible sur grand écran) */}
          <div className="hidden lg:flex items-center">
            <UserMenuDesktop />
          </div>

          {/* Bouton Menu Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
              aria-label="Ouvrir le menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu déroulant Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900/95 backdrop-blur-md pb-4 px-4 space-y-4">
            {/* Recherche mobile */}
            <div className="relative pt-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher un hôtel..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
          {/* Liens et profil utilisateur mobile */}
          {user ? (
            <div className="space-y-3">
                 <div className="flex items-center gap-3 px-2 py-2" onClick={() => navigate('/profile')}>
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold text-sm">
                        {getInitials(user.fullName)}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{user.fullName}</p>
                         <p className="text-xs text-gray-400">Voir le profil</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left text-gray-300 rounded-md hover:bg-gray-800"
                >
                    <LogOut size={20} /> Déconnexion
                </button>
            </div>
           
          ) : (
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left text-gray-300 rounded-md hover:bg-gray-800"
                >
                    <LogIn size={20}/> Connexion
                </button>
                 <button
                    onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-white rounded-md bg-purple-600 hover:bg-purple-700"
                >
                    <UserPlus size={20}/> Inscription
                </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}