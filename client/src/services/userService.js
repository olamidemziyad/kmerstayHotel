// src/services/userService.js
import apiClient from "./axiosApi";

// Connexion utilisateur
export const loginUser = async (credentials) => {
  const response = await apiClient.post("/users/login", credentials);
  sessionStorage.setItem("token", response.data.data.token);
  return response.data.data; // { token, user }
};

// Inscription utilisateur
export const registerUser = async (userData) => {
  const response = await apiClient.post("/users/create", userData);
  return response.data; // user
};

// Récupération du profil utilisateur connecté
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token non trouvé. Veuillez vous reconnecter.");

  const response = await apiClient.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if ( !response.data.user) {
    throw new Error("Données utilisateur non trouvées");
  }

  return response.data.user;
};

// Mettre à jour le profil de l'utilisateur
// export const updateProfile = async (profileData) => {
//   try {
//     const response = await apiClient.put('/users/me', profileData);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
//   }
// };

export const toggleBanUser = async (id) => {
  try {
    const { data } = await apiClient.put(`/users/${id}`, { toggleBan: true });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors du bannissement");
  }
};
// Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors de la suppression");
  }
};
// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const { data } = await apiClient.get("/users");
    return data.data || [];  
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors du chargement des utilisateurs");
  }
};
// Supprimer un utilisateur par son ID
export const deleteUserById = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data; // retourne { message: "Utilisateur supprimé" } ou équivalent
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    throw error;
  }
};
// Activer / désactiver un utilisateur
export const toggleUserStatus = async (userId, isActive) => {
  try {
    // Ici, isActive = true pour activer, false pour désactiver
    const response = await apiClient.patch(`/users/${userId}/status`, { isActive });
    return response.data; // retourne { message: "Statut mis à jour", user: {...} }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut utilisateur:', error);
    throw error;
  }
};

// Mettre à jour le profil de l'utilisateur
export const updateProfile = async (profileData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await apiClient.put('/users/me', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
  }
};

// NOUVELLE FONCTION - Changer le mot de passe de l'utilisateur connecté
export const changePassword = async (passwordData) => {
  try {
    const token = sessionStorage.getItem("token");
    // passwordData devrait être un objet : { currentPassword, newPassword }
    const response = await apiClient.put('/users/me/password', passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    // Le message d'erreur du backend est important ici (ex: "Mot de passe actuel incorrect")
    throw new Error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
  }
};
