import { useState, useEffect } from 'react';
import favoriteService from '../services/favoriteService';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache local pour éviter les appels API répétés
  const [favoriteStatusCache, setFavoriteStatusCache] = useState({});

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  // Charger tous les favoris de l'utilisateur
  const loadFavorites = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await favoriteService.getUserFavorites();
      if (response.success) {
        setFavorites(response.data);
        
        // Mettre à jour le cache
        const cache = {};
        response.data.forEach(fav => {
          cache[fav.hotel_id] = true;
        });
        setFavoriteStatusCache(cache);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des favoris:', err);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si un hôtel est en favoris
  const isFavorite = async (hotelId) => {
    if (!isAuthenticated()) return false;
    
    // Vérifier d'abord le cache
    if (favoriteStatusCache.hasOwnProperty(hotelId)) {
      return favoriteStatusCache[hotelId];
    }

    try {
      const response = await favoriteService.checkFavorite(hotelId);
      if (response.success) {
        // Mettre à jour le cache
        setFavoriteStatusCache(prev => ({
          ...prev,
          [hotelId]: response.isFavorite
        }));
        return response.isFavorite;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de la vérification:', err);
      return false;
    }
  };

  // Toggle favoris (ajouter/retirer)
  const toggleFavorite = async (hotelId, currentStatus = null) => {
    if (!isAuthenticated()) {
      throw new Error('Vous devez être connecté pour gérer vos favoris');
    }

    setLoading(true);
    setError(null);

    try {
      // Si on ne connaît pas le statut actuel, le vérifier
      const isCurrentlyFavorite = currentStatus !== null 
        ? currentStatus 
        : await isFavorite(hotelId);

      const response = await favoriteService.toggleFavorite(hotelId, isCurrentlyFavorite);
      
      if (response.success) {
        // Mettre à jour le cache
        setFavoriteStatusCache(prev => ({
          ...prev,
          [hotelId]: !isCurrentlyFavorite
        }));

        // Mettre à jour la liste des favoris
        if (isCurrentlyFavorite) {
          // Retirer de la liste
          setFavorites(prev => prev.filter(fav => fav.hotel_id !== hotelId));
        } else {
          // Recharger la liste pour avoir les nouvelles données
          loadFavorites();
        }

        return !isCurrentlyFavorite; // Retourner le nouveau statut
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les favoris au montage du composant
  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    isAuthenticated,
    isFavorite,
    toggleFavorite,
    loadFavorites,
    favoriteStatusCache
  };
};

export default useFavorites;