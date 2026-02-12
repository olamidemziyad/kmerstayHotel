import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchHotels } from "../services/hotelService";
import { HotelCard } from "../components/HotelCard";
import { 
  Search, Loader2, AlertCircle, ArrowLeft, Filter, 
  SlidersHorizontal, MapPin, Star, DollarSign, Hotel,
  X, TrendingUp, Sparkles
} from "lucide-react";
import { useState } from "react";

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("query");
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const { data: results = [], isLoading, error, isError } = useQuery({
    queryKey: ["searchHotels", query],
    queryFn: () => searchHotels(query),
    enabled: !!query,
  });

  // Filtrage et tri des résultats
  const filteredAndSortedResults = results
    .filter((hotel) => {
      // Filtre par prix
      if (priceRange === "low" && hotel.price > 50000) return false;
      if (priceRange === "medium" && (hotel.price < 50000 || hotel.price > 100000)) return false;
      if (priceRange === "high" && hotel.price < 100000) return false;
      
      // Filtre par rating
      if (minRating > 0 && (!hotel.rating || hotel.rating < minRating)) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0; // relevance par défaut
    });

  const handleClearSearch = () => {
    navigate("/hotels");
  };

  const handleResetFilters = () => {
    setSortBy("relevance");
    setPriceRange("all");
    setMinRating(0);
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Aucune recherche</h2>
          <p className="text-blue-200 mb-6">Veuillez entrer un terme de recherche</p>
          <button
            onClick={() => navigate("/hotels")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les hôtels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Header avec breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Résultats de recherche
              </h1>
              <div className="flex items-center gap-2 text-blue-200">
                <Search className="w-5 h-5" />
                <span className="text-lg">
                  « <span className="text-white font-semibold">{query}</span> »
                </span>
              </div>
            </div>

            <button
              onClick={handleClearSearch}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
              <span>Effacer la recherche</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <p className="text-white text-lg font-medium">Recherche en cours...</p>
              <p className="text-blue-300 text-sm mt-2">Analyse de {query}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Erreur de recherche</h3>
              <p className="text-red-300 mb-6">{error?.message || "Une erreur est survenue"}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && !isError && (
          <>
            {/* Stats Bar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{filteredAndSortedResults.length}</p>
                      <p className="text-blue-200 text-sm">
                        {filteredAndSortedResults.length > 1 ? "hôtels trouvés" : "hôtel trouvé"}
                      </p>
                    </div>
                  </div>

                  {filteredAndSortedResults.length !== results.length && (
                    <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-lg px-3 py-2">
                      <Filter className="w-4 h-4 text-purple-300" />
                      <span className="text-purple-200 text-sm">Filtré sur {results.length}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    showFilters
                      ? "bg-blue-500/20 border-2 border-blue-400/50 text-blue-300"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filtres</span>
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 animate-in slide-in-from-top">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-400" />
                    Filtres et tri
                  </h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      Trier par
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="rating">Note la plus élevée</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-400" />
                      Fourchette de prix
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    >
                      <option value="all">Tous les prix</option>
                      <option value="low">Moins de 50 000 FCFA</option>
                      <option value="medium">50 000 - 100 000 FCFA</option>
                      <option value="high">Plus de 100 000 FCFA</option>
                    </select>
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      Note minimale
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    >
                      <option value="0">Toutes les notes</option>
                      <option value="3">3★ et plus</option>
                      <option value="4">4★ et plus</option>
                      <option value="4.5">4.5★ et plus</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedResults.length === 0 && (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Aucun résultat</h3>
                  <p className="text-blue-200 mb-6">
                    Aucun hôtel ne correspond à votre recherche "{query}"
                    {(priceRange !== "all" || minRating > 0) && " avec les filtres appliqués"}
                  </p>
                  <div className="space-y-3">
                    {(priceRange !== "all" || minRating > 0) && (
                      <button
                        onClick={handleResetFilters}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Supprimer les filtres
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/hotels")}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Voir tous les hôtels
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {filteredAndSortedResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedResults.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}