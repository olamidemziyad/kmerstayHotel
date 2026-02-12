import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Eye, Loader2, AlertCircle } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import FavoriteButton from './FavoriteButton';

const ProfileFavorites = () => {
  const { favorites, loading, error, isAuthenticated, loadFavorites } = useFavorites();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated()) {
        await loadFavorites();
      }
      setLocalLoading(false);
    };
    
    loadData();
  }, []);

  // État de chargement
  if (localLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Mes Hôtels Favoris</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Chargement...
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl border animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Mes Hôtels Favoris</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h4>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setLocalLoading(true);
              loadFavorites().finally(() => setLocalLoading(false));
            }}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec compteur */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mes Hôtels Favoris</h3>
          <p className="text-sm text-gray-600 mt-1">
            {favorites.length === 0 
              ? "Aucun hôtel favori pour le moment" 
              : `${favorites.length} hôtel${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        {favorites.length > 0 && (
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            <Eye className="w-4 h-4" />
            Explorer plus d'hôtels
          </Link>
        )}
      </div>

      {/* Liste vide */}
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
          <div className="relative inline-block mb-6">
            <Heart className="w-20 h-20 text-gray-200 mx-auto" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-blue-500 fill-current animate-pulse" />
            </div>
          </div>
          
          <h4 className="text-xl font-semibold text-gray-900 mb-3">
            Votre liste de favoris est vide
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            Découvrez nos magnifiques hôtels et ajoutez vos coups de cœur ❤️ en cliquant sur l'icône cœur.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Eye className="w-5 h-5" />
            Découvrir nos hôtels
          </Link>
        </div>
      ) : (
        /* Grille des favoris */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <FavoriteCard 
              key={favorite.id} 
              favorite={favorite}
              onRemove={loadFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant carte de favori optimisé pour le profil
const FavoriteCard = ({ favorite, onRemove }) => {
  const hotel = favorite.hotel;
  const [imageError, setImageError] = useState(false);

  if (!hotel) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Hôtel non trouvé</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Image avec overlay */}
      <div className="relative overflow-hidden">
        <img 
          src={imageError ? '/placeholder-hotel.jpg' : (hotel.image_url || '/placeholder-hotel.jpg')} 
          alt={hotel.name || hotel.nom}
          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Bouton favoris */}
        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity">
          <FavoriteButton 
            hotelId={hotel.id} 
            size="small"
            showText={false}
          />
        </div>
        
        {/* Badge date d'ajout */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {formatDate(favorite.createdAt || favorite.date_de_creation)}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {hotel.name || hotel.nom}
        </h4>
        
        {/* Localisation */}
        <div className="flex items-center text-gray-600 mb-3 text-sm">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {hotel.city || hotel.ville}{hotel.region && `, ${hotel.region}`}
          </span>
        </div>

        {/* Prix et rating */}
        <div className="flex items-center justify-between mb-3">
          {hotel.rating && (
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-xs text-gray-600 font-medium">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {hotel.price && (
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">
                {hotel.price}€
              </span>
              <span className="text-xs text-gray-500 block">
                /nuit
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <Link 
          to={`/hotel/${hotel.id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium transform group-hover:scale-105 shadow-md hover:shadow-lg"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
};

export default ProfileFavorites;