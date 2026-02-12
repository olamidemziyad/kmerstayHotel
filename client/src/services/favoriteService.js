import apiClient from './axiosApi';

const favoriteService = {
  // Ajouter un hôtel aux favoris
  addFavorite: async (hotelId) => {
    try {
      const response = await apiClient.post(`/favorites/${hotelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'ajout aux favoris' };
    }
  },

  // Retirer un hôtel des favoris
  removeFavorite: async (hotelId) => {
    try {
      const response = await apiClient.delete(`/favorites/${hotelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression des favoris' };
    }
  },

  // Obtenir tous les favoris de l'utilisateur
  getUserFavorites: async () => {
    try {
      const response = await apiClient.get('/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des favoris' };
    }
  },

  // Vérifier si un hôtel est en favoris
  checkFavorite: async (hotelId) => {
    try {
      const response = await apiClient.get(`/favorites/check/${hotelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification' };
    }
  },

  // Toggle favoris (ajouter ou retirer selon l'état actuel)
  toggleFavorite: async (hotelId, isFavorite) => {
    if (isFavorite) {
      return await favoriteService.removeFavorite(hotelId);
    } else {
      return await favoriteService.addFavorite(hotelId);
    }
  }
};

export default favoriteService;