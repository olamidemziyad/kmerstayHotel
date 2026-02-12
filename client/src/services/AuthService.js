// src/services/authService.js

import apiClient from './axiosApi';

/**
 * Récupère les données de l'utilisateur connecté via l'API.
 * @returns {Promise<Object|null>} Les données de l'utilisateur ou null si non connecté.
 */
export const getCurrentUser = async () => {
  try {
    // Supposons que votre API a une route pour obtenir le profil de l'utilisateur
    // en se basant sur le token d'authentification envoyé dans les headers.
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    // Si la requête échoue (par exemple, 401 Unauthorized), cela signifie que le token est invalide ou absent.
    console.error("Erreur lors de la récupération de l'utilisateur actuel:", error);
    // On peut aussi gérer la suppression du token invalide ici pour déconnecter l'utilisateur automatiquement.
    // localStorage.removeItem('authToken'); 
    return null;
  }
};

/**
 * Fonction de connexion de l'utilisateur.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Les données de l'utilisateur et le token.
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  // Stocker le token dans le localStorage ou les cookies
  const { token, user } = response.data;
  sessionStorage.setItem('authToken', token);
  return user;
};

// ... autres fonctions d'authentification (logout, register, etc.)