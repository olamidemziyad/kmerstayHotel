const API_URL = "http://localhost:3000/api/users";


// Inscription
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/creates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to register');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Connexion
export async function loginUser(credentials) {
    console.log('🔐 credentials envoyés :', credentials);
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    console.log(data)
    if (!res.ok) throw new Error(data.message || data.error || "Erreur de connexion");

    // Stocker le token dans localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error("Erreur API login:", error.message);
    return { error: error.message };
  }
}

// Déconnexion
export function logoutUser() {
  localStorage.removeItem('token');
}

// Obtenir le token
export function getToken() {
  return localStorage.getItem('token');
}

// Vérifier si connecté
export function isLoggedIn() {
  return !!getToken();
}

// fetch avec Auth
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
