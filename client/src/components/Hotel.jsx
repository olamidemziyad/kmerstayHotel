import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllHotels } from '../services/hotelService';
import HotelPageNavbar from './navbars/HotelPageNavbar';
import { 
  Star, Wifi, Waves, UtensilsCrossed, ParkingCircle, Bell, 
  Dumbbell, Sparkles, MapPin, ArrowRight, Loader2, AlertCircle,
  Search, SlidersHorizontal, TrendingUp, Grid3x3, List, Heart,
  Eye, Filter, X
} from 'lucide-react';

// Composant pour afficher les icônes des équipements
const AmenityIcon = ({ amenity }) => {
  const icons = {
    'wifi': { icon: Wifi, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    'pool': { icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    'piscine': { icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    'restaurant': { icon: UtensilsCrossed, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    'parking': { icon: ParkingCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    'gym': { icon: Dumbbell, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    'spa': { icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    'service': { icon: Bell, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  };

  const normalizedAmenity = amenity.toLowerCase()
    .replace('wi-fi', 'wifi')
    .replace('salle de sport', 'gym')
    .replace('centre de bien-être', 'spa');

  const amenityConfig = icons[normalizedAmenity] || icons['service'];
  const IconComponent = amenityConfig.icon;

  return (
    <div className={`${amenityConfig.bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
      <IconComponent className={`w-4 h-4 ${amenityConfig.color}`} />
    </div>
  );
};

// Skeleton Loader
const HotelSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-56 bg-white/20"></div>
    <div className="p-5 space-y-3">
      <div className="h-6 bg-white/20 rounded w-3/4"></div>
      <div className="h-4 bg-white/20 rounded w-1/2"></div>
      <div className="h-4 bg-white/20 rounded w-full"></div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-white/20 rounded-lg"></div>
        <div className="h-8 w-8 bg-white/20 rounded-lg"></div>
        <div className="h-8 w-8 bg-white/20 rounded-lg"></div>
      </div>
      <div className="h-10 bg-white/20 rounded-xl"></div>
    </div>
  </div>
);

function HotelList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState([]);

  const { data: hotels, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hotels'],
    queryFn: getAllHotels,
  });

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  // Filtrage et tri
  const filteredAndSortedHotels = hotels
    ?.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'city') return (a.city || '').localeCompare(b.city || '');
      return 0;
    }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <div className="h-12 bg-white/20 rounded-xl w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded-lg w-[600px] mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <HotelSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Erreur de chargement</h2>
          <p className="text-red-300 mb-6">{error?.message || "Impossible de charger les hôtels"}</p>
          <button 
            onClick={() => refetch()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <HotelPageNavbar/>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Sélection Premium</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Découvrez nos hôtels exceptionnels
          </h1>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            Sélectionnez parmi nos meilleures adresses pour un séjour inoubliable à Douala
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un hôtel ou une ville..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500/20 border-2 border-blue-400/50 text-blue-300'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Grid3x3 className="w-5 h-5" /> 
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500/20 border-2 border-blue-400/50 text-blue-300'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showFilters
                  ? 'bg-blue-500/20 border-2 border-blue-400/50 text-blue-300'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20 animate-in slide-in-from-top">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                  >
                    <option value="name">Nom</option>
                    <option value="rating">Note</option>
                    <option value="city">Ville</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-blue-200 text-lg">
            <span className="text-white font-semibold">{filteredAndSortedHotels.length}</span> hôtel{filteredAndSortedHotels.length > 1 ? 's' : ''} trouvé{filteredAndSortedHotels.length > 1 ? 's' : ''}
          </p>
          {favorites.length > 0 && (
            <p className="text-pink-300 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 fill-current" />
              {favorites.length} favori{favorites.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Hotels Grid/List */}
        {filteredAndSortedHotels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Aucun résultat</h3>
            <p className="text-blue-200 mb-6">Aucun hôtel ne correspond à votre recherche</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
          }>
            {filteredAndSortedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/40 hover:shadow-2xl hover:-translate-y-1 group"
              >
                {/* Image avec overlay */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={hotel.image_url || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/placeholder-hotel.jpg';
                    }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(hotel.id);
                    }}
                    className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                  >
                    {/* <Heart 
                      className={`w-5 h-5 transition-colors ${
                        favorites.includes(hotel.id)
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-gray-600'
                      }`}
                    /> */}
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-gray-800">
                      {hotel.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>

                  {/* View Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold transform scale-90 group-hover:scale-100 transition-transform">
                      <Eye className="w-5 h-5" />
                      <span>Aperçu</span>
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {hotel.name}
                  </h3>

                  <p className="text-sm text-blue-300 mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.city}, {hotel.region}
                  </p>

                  <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                    {hotel.description || "Hôtel confortable offrant un excellent séjour."}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities?.slice(0, 5).map((amenity, index) => (
                      <div key={index} title={amenity}>
                        <AmenityIcon amenity={amenity} />
                      </div>
                    ))}
                    {hotel.amenities?.length > 5 && (
                      <div className="bg-white/10 px-2 py-1 rounded-lg text-xs text-blue-300">
                        +{hotel.amenities.length - 5}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => navigate(`/hotel-preview/${hotel.id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] group/btn"
                  >
                    <span>Voir les chambres</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelList;