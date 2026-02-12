import apiClient from "./axiosApi";

// Function to fetch hotels
export const getAllHotels = async () => {
  const response = await apiClient.get('/hotels');
  return response.data.data; // retourne directement le tableau d'hôtels
};

// Function to fetch a single hotel by ID
export const getHotelById = async (id) => {
  const response = await apiClient.get(`/hotels/${id}`);
  return response.data.data; // retourne directement l'objet hôtel
};

// Admin functions

// Crée un hôtel
export const createHotel = async (hotelData) => {
  const response = await apiClient.post("/hotels", hotelData);
  return response.data;
};

// Mettre à jour un hôtel
export const updateHotel = async (hotelId, hotelData) => {
  const response = await apiClient.put(`/hotels/${hotelId}`, hotelData);
  return response.data;
};

// Supprimer un hôtel
export const deleteHotel = async (hotelId) => {
  const response = await apiClient.delete(`/hotels/DELETE/${hotelId}`);
  return response.data;
};

// Upload image
export const uploadImage = async (formData) => {
  const response = await apiClient.post("/hotels/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Rechercher un hôtel avec recherche avancée par ville
export const searchHotels = async (city) => {
  const res = await apiClient.get("/hotels/search/by-city", {
    params: { city },
  });
  return res.data.data;
};


/* import apiClient from "./axiosApi";

// Function to fetch hotels
export const getAllHotels = async () => {
    const response = await apiClient.get('/hotels');
    // comme le backend renvoie un tableau d'hôtels, on peut directement retourner la réponse {message, toatal, data : hotels []
    return response.data.data; // retourne directement le tableau d'hôtels
};

// Function to fetch a single hotel by ID
export const getHotelById = async (id) => {
    const response = await apiClient.get(`/hotels/${id}`);
    // le backend est uniformé pour envoyer {message, data : hotel object}
    return response.data.data; // retourne directement l'objet hôtel
    
}

//Admin functions
// Crée un hôtel
export const createHotel = async (hotelData) => {
  const response = await apiClient.post("/hotels", hotelData);
  return response.data;
};

// Upload image
export const uploadImage = async (formData) => {
  const response = await apiClient.post("/hotels/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Rechercher un hôtel avec recherche avancée
export const searchHotels = async (city) => {
  const res = await apiClient.get("/hotels/search/by-city", {
    params: { city }, // envoie ?query=Douala
  });
  return res.data.data;
};

// Mettre à jour un hôtel
export const updateHotel = async (hotelId, hotelData) => {
  const response = await apiClient.put(`/hotels/${hotelId}`, hotelData);
  return response.data;
};

// Supprimer un hôtel
export const deleteHotel = async (hotelId) => {
  const response = await apiClient.delete(`/hotels/${hotelId}`);
  return response.data;
}; */