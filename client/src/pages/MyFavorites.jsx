import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Eye, Sparkles, TrendingUp } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import FavoriteButton from '../components/FavoriteButton';
import NavBar from '../components/NavBar';

const MyFavorites = () => {
  const { favorites, loading, error, isAuthenticated, loadFavorites } = useFavorites();
  const [isDeleting, setIsDeleting] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavorites();
    }
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-3xl opacity-20"></div>
            <Heart className="relative w-20 h-20 text-pink-500 mx-auto mb-6 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Mes Favoris
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Connectez-vous pour accéder à votre collection d'hôtels préférés
          </p>
          <Link 
            to="/login" 
            className="relative inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            <Sparkles className="relative w-5 h-5" />
            <span className="relative">Se connecter</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl w-64 animate-pulse mb-4"></div>
            <div className="h-6 bg-slate-800/50 rounded-xl w-48 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden animate-pulse">
                <div className="h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-700/50 rounded-xl mb-3"></div>
                  <div className="h-4 bg-slate-700/50 rounded-lg w-2/3 mb-4"></div>
                  <div className="h-10 bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-3">Erreur de chargement</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={loadFavorites}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 font-semibold"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NavBar />
      <div style={{ height: '100px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header moderne avec glassmorphism */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-pink-500 to-violet-600 p-4 rounded-2xl">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                  Mes Favoris
                </h1>
                <p className="text-gray-400 text-lg">
                  {favorites.length === 0 
                    ? "Aucun hôtel favori pour le moment" 
                    : `${favorites.length} hôtel${favorites.length > 1 ? 's' : ''} dans votre collection`
                  }
                </p>
              </div>
            </div>

            {favorites.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Liste
                </button>
              </div>
            )}
          </div>

          {/* Stats cards */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-pink-500/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-3 rounded-xl">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Favoris</p>
                    <p className="text-2xl font-bold text-white">{favorites.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-violet-500/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-3 rounded-xl">
                    <Star className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Note Moyenne</p>
                    <p className="text-2xl font-bold text-white">
                      {(favorites.reduce((acc, f) => acc + (f.hotel?.rating || 0), 0) / favorites.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-3 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dernier Ajout</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(favorites[favorites.length - 1]?.createdAt || favorites[favorites.length - 1]?.date_de_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Heart className="relative w-32 h-32 text-gray-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Votre collection est vide
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
              Découvrez nos hôtels exceptionnels et créez votre collection personnelle en un clic ❤️
            </p>
            <Link 
              to="/" 
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <Eye className="relative w-6 h-6" />
              <span className="relative">Découvrir les hôtels</span>
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {favorites.map((favorite) => (
              <FavoriteCard 
                key={favorite.id} 
                favorite={favorite}
                onRemove={() => loadFavorites()}
                isDeleting={isDeleting === favorite.hotel_id}
                setIsDeleting={setIsDeleting}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FavoriteCard = ({ favorite, onRemove, isDeleting, setIsDeleting, viewMode }) => {
  const hotel = favorite.hotel;
  const [isHovered, setIsHovered] = useState(false);

  if (!hotel) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 text-center">
        <p className="text-gray-400">Hôtel non trouvé</p>
      </div>
    );
  }

  const handleRemove = async () => {
    setIsDeleting(favorite.hotel_id);
    setTimeout(() => {
      onRemove();
      setIsDeleting(null);
    }, 1000);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
            <img 
              src={hotel.image_url || '/placeholder-hotel.jpg'} 
              alt={hotel.name || hotel.nom}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={(e) => { e.target.src = '/placeholder-hotel.jpg'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4">
              <FavoriteButton hotelId={hotel.id} size="medium" showText={false} />
            </div>
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
              {new Date(favorite.createdAt || favorite.date_de_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div className="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {hotel.name || hotel.nom}
              </h3>
              
              <div className="flex items-center text-gray-400 mb-4">
                <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">
                  {hotel.city || hotel.ville}{hotel.region && `, ${hotel.region}`}
                </span>
              </div>

              {hotel.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(hotel.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-semibold text-white">
                    {hotel.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              {hotel.price && (
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    {hotel.price}€
                  </span>
                  <span className="text-gray-400 text-sm"> /nuit</span>
                </div>
              )}
              
              <Link 
                to={`/hotel-preview/${hotel.id}`}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 text-sm font-semibold"
              >
                Voir détails
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={hotel.image_url || '/placeholder-hotel.jpg'} 
          alt={hotel.name || hotel.nom}
          className={`w-full h-56 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => { e.target.src = '/placeholder-hotel.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4">
          <FavoriteButton hotelId={hotel.id} size="medium" showText={false} />
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
          {new Date(favorite.createdAt || favorite.date_de_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all duration-300">
          {hotel.name || hotel.nom}
        </h3>
        
        <div className="flex items-center text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-2 text-purple-400" />
          <span className="text-sm">
            {hotel.city || hotel.ville}{hotel.region && `, ${hotel.region}`}
          </span>
        </div>

        {hotel.rating && (
          <div className="flex items-center mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < Math.floor(hotel.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-semibold text-white">
              {hotel.rating.toFixed(1)}
            </span>
          </div>
        )}

        {hotel.price && (
          <div className="mb-5">
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              {hotel.price}€
            </span>
            <span className="text-gray-400 text-sm"> /nuit</span>
          </div>
        )}

        <Link 
          to={`/hotel-preview/${hotel.id}`}
          className="block w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white text-center py-3 rounded-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 text-sm font-semibold group/btn overflow-hidden relative"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
          <span className="relative">Voir détails</span>
        </Link>
      </div>
    </div>
  );
};

export default MyFavorites;