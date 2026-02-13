import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { getProfile } from "../services/userService";
import { 
  Search, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Home, 
  Heart,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Shadow progressif au scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset search à chaque changement de page
  useEffect(() => setSearch(""), [location.pathname]);

  // Fermer les menus si on clique ailleurs
  useEffect(() => {
    if (isMobileMenuOpen || showUserMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, showUserMenu]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(" ").map(part => part[0]).join("").toUpperCase() || "U";
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-2xl py-2.5"
            : "bg-white/85 dark:bg-gray-900/85 backdrop-blur-lg py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo avec animation */}
            <div 
              className="flex items-center group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-2xl font-black text-2xl shadow-xl transform group-hover:scale-105 transition-all">
                  KmerStay
                </div>
              </div>
            </div>

            {/* Barre de recherche Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Rechercher un hôtel, une ville, une destination..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-32 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Rechercher
                  </button>
                </div>
              </form>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-pulse h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="animate-pulse h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              ) : user ? (
                <>
                  {/* Favoris */}
                  <button 
                    onClick={() => navigate("/favorites")}
                    className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                  >
                    <Heart className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </button>

                  {/* Notifications */}
                  <button className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
                    <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                      3
                    </span>
                  </button>

                  {/* Menu Utilisateur */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="relative w-11 h-11 rounded-full ring-2 ring-white dark:ring-gray-700 object-cover"
                          />
                        ) : (
                          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base ring-2 ring-white dark:ring-gray-700 shadow-lg">
                            {getInitials(user.fullName)}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
                      </div>
                      <div className="text-left hidden xl:block">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {user.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Membre
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slideDown">
                          {/* Header du menu */}
                          <div className="p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.fullName}
                                    className="w-16 h-16 rounded-full ring-4 ring-white object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white">
                                    {getInitials(user.fullName)}
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                              </div>
                              <div className="flex-1 text-white">
                                <div className="font-bold text-lg mb-1">
                                  {user.fullName}
                                </div>
                                <div className="text-sm opacity-90">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button 
                              onClick={() => {
                                navigate("/profile");
                                setShowUserMenu(false);
                              }}
                              className="w-full px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 group"
                            >
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-semibold">Mon profil</div>
                                <div className="text-xs text-gray-500">Gérer vos informations</div>
                              </div>
                            </button>

                            <button 
                              onClick={() => {
                                navigate("/favorites");
                                setShowUserMenu(false);
                              }}
                              className="w-full px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 group"
                            >
                              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <div className="font-semibold">Mes favoris</div>
                                <div className="text-xs text-gray-500">Hôtels sauvegardés</div>
                              </div>
                            </button>

                            <button className="w-full px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 group">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <div className="font-semibold">Paramètres</div>
                                <div className="text-xs text-gray-500">Préférences du compte</div>
                              </div>
                            </button>
                          </div>

                          {/* Déconnexion */}
                          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                            <button 
                              onClick={handleLogout}
                              className="w-full px-5 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 rounded-xl group"
                            >
                              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </div>
                              <span className="font-semibold text-red-600 dark:text-red-400">Déconnexion</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold group"
                  >
                    <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Connexion
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Inscription
                  </button>
                </>
              )}
            </div>

            {/* Menu Mobile Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute top-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-slideDown max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Recherche Mobile */}
            <div className="p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white/40 transition-all"
                />
              </form>
            </div>

            <div className="p-4 space-y-2">
              {/* Accueil */}
              <button
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Accueil</span>
              </button>

              {isLoading ? (
                <div className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-xl h-16"></div>
              ) : user ? (
                <>
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center gap-3 mb-2">
                    <div className="relative">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full ring-2 ring-blue-500 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ring-2 ring-blue-500">
                          {getInitials(user.fullName)}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Mon profil</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Mes favoris</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group mt-4"
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg group-hover:scale-110 transition-transform">
                      <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-semibold text-red-600 dark:text-red-400">Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <LogIn className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Connexion</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all group shadow-lg"
                  >
                    <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white">Inscription</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
