import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/userService";
import { User, LogOut, LogIn, UserPlus, Home, Bell, Heart } from "lucide-react";

export default function HotelPreviewBar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled ? "bg-white/90 shadow-lg py-2" : "bg-white/80 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-2xl font-bold text-blue-600 hover:scale-105 transform transition-transform">
            KmerStay
          </span>
        </div>

        {/* Recherche */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Rechercher un hôtel, une ville, une destination..."
            className="flex-1 px-4 py-2 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-r-xl hover:scale-105 transform transition-transform">
            Rechercher
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="relative">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">3</span>
          </button>
          <button className="relative">
            <Bell className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
            <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full px-1">3</span>
          </button>

          {isLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-full" />
          ) : user ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium hover:text-blue-600">
                  {user.fullName}
                </span>
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-200">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Inscription
              </button>
            </>
          )}
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => { navigate("/"); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </button>

            {isLoading ? (
              <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
            ) : user ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span>{user.fullName}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Inscription</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
