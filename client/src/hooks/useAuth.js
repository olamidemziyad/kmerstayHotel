// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from "react";
import { getProfile } from "../services/userService";

/**
 * Vérifie si l'utilisateur est authentifié
 */
const isAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

/**
 * Hook personnalisé pour gérer l'authentification
 * @returns {Object} État et fonctions d'authentification
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour charger l'utilisateur
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!isAuthenticated()) {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      const currentUser = await getProfile();
      
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error);
      // Token invalide - nettoyer
      sessionStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    // Optionnel : rediriger vers la page d'accueil
    window.location.href = "/";
  }, []);

  // Fonction pour rafraîchir l'utilisateur après une mise à jour
  const refreshUser = useCallback(() => {
    loadUser();
  }, [loadUser]);

  // Charger l'utilisateur au montage
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isLoggedIn,
    isLoading,
    logout,
    refreshUser,
    loadUser
  };
};