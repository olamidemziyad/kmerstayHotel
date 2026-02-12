import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, XCircle, ArrowLeft, MapPin, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { getUserFavorites, removeFromFavorites, /*addToFavorites */} from '../services/favoriteService';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const userFavorites = await getUserFavorites();
      
      // getUserFavorites retourne maintenant directement un tableau
      const favoritesArray = Array.isArray(userFavorites) ? userFavorites : [];
      
      console.log('📋 Favoris chargés:', favoritesArray.length, 'éléments');
      setFavorites(favoritesArray);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des favoris:', err);
      
      // Afficher un message d'erreur spécifique selon le type d'erreur
      if (err.message.includes('serveur')) {
        setError('Le service favoris est temporairement indisponible. Veuillez réessayer plus tard.');
      } else {
        setError(err.message || 'Erreur lors du chargement des favoris');
      }
      
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = async (hotelId) => {
    if (!hotelId || hotelId === 'undefined') {
      alert('ID de l\'hôtel manquant');
      return;
    }

    if (!window.confirm('Retirer cet hôtel de vos favoris ?')) return;
    
    setRemovingId(hotelId);
    try {
      console.log('🗑️ Suppression du favori avec ID:', hotelId);
      await removeFromFavorites(hotelId);
      
      // Mise à jour optimiste de l'état local
      setFavorites(prev => prev.filter(fav => fav.hotelId !== hotelId && fav.id !== hotelId));
      
      // Afficher un message de succès
      showSuccessMessage('Hôtel retiré de vos favoris');
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
      alert(err.message || 'Erreur lors de la suppression du favori');
    } finally {
      setRemovingId(null);
    }
  };

  const showSuccessMessage = (message) => {
    // Créer un élément de notification temporaire
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const handleRetry = () => {
    loadFavorites();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500 mb-4" />
        <p className="text-gray-600">Chargement de vos favoris...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} hôtel{favorites.length !== 1 ? 's' : ''} dans vos favoris
            </p>
          </div>
        </div>
        
        {/* Bouton de rafraîchissement */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualiser la liste"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Liste des favoris */}
      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Parcourez nos hôtels et cliquez sur le cœur pour ajouter ceux qui vous plaisent à vos favoris !
          </p>
          <Link
            to="/home"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir des hôtels
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const hotel = favorite.hotel || favorite; // Flexibilité selon la structure des données
            const hotelId = favorite.hotelId || favorite.id || hotel?.id;
            
            return (
              <div key={favorite.id || hotelId} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                {/* Image de l'hôtel */}
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <img
                    src={hotel?.image_url || hotel?.imageUrl || "/placeholder-hotel.jpg"}
                    alt={hotel?.name || "Hôtel"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder-hotel.jpg";
                    }}
                  />
                  
                  {/* Overlay sombre au survol */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Bouton retirer des favoris */}
                  <button
                    onClick={() => handleRemoveFavorite(hotelId)}
                    disabled={removingId === hotelId}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white rounded-full p-2 shadow-md transition-all duration-200 disabled:opacity-50"
                    title="Retirer des favoris"
                  >
                    {removingId === hotelId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    )}
                  </button>

                  {/* Note de l'hôtel */}
                  {hotel?.rating && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {hotel.rating}
                      </span>
                    </div>
                  )}

                  {/* Badge de disponibilité si disponible */}
                  {hotel?.available && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Disponible
                    </div>
                  )}
                </div>

                {/* Informations de l'hôtel */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2">
                    {hotel?.name || "Nom de l'hôtel"}
                  </h3>
                  
                  {/* Localisation */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {hotel?.city && hotel?.region 
                        ? `${hotel.city}, ${hotel.region}`
                        : hotel?.city || hotel?.region || hotel?.address || "Localisation non disponible"
                      }
                    </span>
                  </div>

                  {/* Type d'hébergement et prix */}
                  <div className="flex items-center justify-between mb-3">
                    {hotel?.accommodation_type && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {hotel.accommodation_type}
                      </span>
                    )}
                    {hotel?.price_per_night && (
                      <span className="text-sm font-semibold text-blue-600">
                        {hotel.price_per_night}€/nuit
                      </span>
                    )}
                  </div>
                  
                  {/* Date d'ajout aux favoris */}
                  {favorite.created_at && (
                    <p className="text-xs text-gray-400 mb-3">
                      Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  
                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Link
                      to={`/hotel/${hotelId}`}
                      className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Voir l'hôtel
                    </Link>
                    {hotel?.available && (
                      <Link
                        to={`/booking/${hotelId}`}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Réserver
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}