import React, { useState, useEffect } from 'react';
import useFavorites from '../hooks/useFavorites';

const FavoriteButton = ({ hotelId, size = 'medium', showText = false }) => {
  const { isAuthenticated, isFavorite, toggleFavorite, loading } = useFavorites();
  const [isHotelFavorite, setIsHotelFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Tailles du bouton
  const sizes = {
    small: { icon: '16px', text: 'text-sm', padding: 'p-1' },
    medium: { icon: '20px', text: 'text-base', padding: 'p-2' },
    large: { icon: '24px', text: 'text-lg', padding: 'p-3' }
  };

  const currentSize = sizes[size] || sizes.medium;

  // Vérifier le statut au montage
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated() && hotelId) {
        const status = await isFavorite(hotelId);
        setIsHotelFavorite(status);
      }
    };
    
    checkStatus();
  }, [hotelId, isAuthenticated, isFavorite]);

  // Gérer le clic sur le bouton
  const handleToggle = async () => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      setMessage('Vous devez être connecté pour ajouter des favoris');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const newStatus = await toggleFavorite(hotelId, isHotelFavorite);
      setIsHotelFavorite(newStatus);
      
      // Message de succès
      setMessage(newStatus ? 'Ajouté aux favoris !' : 'Retiré des favoris');
      setTimeout(() => setMessage(''), 2000);
      
    } catch (error) {
      setMessage(error.message || 'Une erreur est survenue');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Bouton favoris */}
      <button
        onClick={handleToggle}
        disabled={isLoading || loading}
        className={`
          ${currentSize.padding}
          rounded-full 
          transition-all 
          duration-200 
          flex 
          items-center 
          gap-2
          ${isHotelFavorite 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
          }
          ${isLoading || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
          focus:outline-none 
          focus:ring-2 
          focus:ring-red-500 
          focus:ring-opacity-50
        `}
        title={isHotelFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {/* Icône coeur */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 24 24"
          fill={isHotelFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isLoading ? 'animate-pulse' : ''}`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        
        {/* Texte optionnel */}
        {showText && (
          <span className={`${currentSize.text} font-medium`}>
            {isHotelFavorite ? 'Favoris' : 'Ajouter'}
          </span>
        )}
        
        {/* Indicateur de chargement */}
        {(isLoading || loading) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      {/* Message de feedback */}
      {message && (
        <div className={`
          absolute 
          top-full 
          left-1/2 
          transform 
          -translate-x-1/2 
          mt-2 
          px-3 
          py-1 
          rounded 
          text-sm 
          whitespace-nowrap
          z-10
          ${message.includes('erreur') || message.includes('connecté') 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
          }
        `}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;