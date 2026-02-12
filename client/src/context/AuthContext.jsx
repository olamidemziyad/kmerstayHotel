// -----------------------------
// File: src/context/AuthContext.jsx
// -----------------------------

import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiClient from "../services/axiosApi";
import { getProfile, loginUser } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Compatibilité entre authService et userService
  const initialToken =
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    null;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(!!initialToken);
  const [initialized, setInitialized] = useState(false);

  // 🧠 Initialisation : si un token existe, on tente de récupérer le profil
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!token) {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
        return;
      }

      try {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const profile = await getProfile();
        if (isMounted) setUser(profile);
      } catch (err) {
        console.error("❌ AuthProvider: Échec récupération profil", err);

        // Token invalide ou expiré → nettoyage complet
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        delete apiClient.defaults.headers.common["Authorization"];
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // 🔐 Connexion utilisateur
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials); // { token, user }

      // Le token est stocké dans sessionStorage par loginUser()
      const newToken =
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken") ||
        data?.token ||
        null;

      if (newToken) {
        setToken(newToken);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
      }

      const profile = data?.user ?? (newToken ? await getProfile() : null);
      setUser(profile ?? null);

      return profile;
    } catch (err) {
      console.error("❌ Erreur de connexion :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Déconnexion utilisateur
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  // 🟢 États utiles
  const isAuthenticated = !!user;
  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.isAdmin === true ||
      (Array.isArray(user.roles) && user.roles.includes("admin")));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initialized,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 🪄 Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return context;
};
