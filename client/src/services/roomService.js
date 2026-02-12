// src/services/roomService.js
import apiClient from "./axiosApi";

// Récupère les chambres disponibles d'un hôtel (avec tous les filtres)
export const getRoomsByHotel = async (hotelId, filters = {}) => {
  const { start, end, type, maxPrice, sort } = filters;

  const params = {};
  if (start && end) {
    params.start = start;
    params.end = end;
  }
  if (type && type !== 'all') {
    params.type = type;
  }
  if (maxPrice) {
    params.maxPrice = maxPrice;
  }
  if (sort) {
    params.sort = sort;
  }

  console.log('🔍 SERVICE - Params envoyés à l\'API:', params);

  const res = await apiClient.get(`/hotels/${hotelId}/rooms`, { params });
  console.log('🔍 SERVICE - Réponse reçue:', res.data);

  return res.data; // Retourne la réponse complète (data, count, debug)
};

// Récupère un aperçu limité des chambres par catégorie pour l'aperçu hôtel
export const getRoomsPreviewByHotel = async (hotelId, limit = 2) => {
  console.log('🔍 SERVICE - Récupération aperçu chambres:', { hotelId, limit });

  const res = await apiClient.get(`/hotels/${hotelId}/rooms/preview`, { 
    params: { limit } 
  });
  console.log('🔍 SERVICE - Aperçu reçu:', res.data);

  return res.data;
};

// Récupère une chambre par ID
export const getRoomById = async (roomId) => {
  const res = await apiClient.get(`/rooms/${roomId}`);
  return res.data.data;
};

// Vérifier la disponibilité d'une chambre
export const checkRoomAvailability = async (roomId, start, end) => {
  const res = await apiClient.get(`/rooms/${roomId}/availability`, {
    params: { start, end },
  });
  return res.data.available;
};

// Récupérer les périodes réservées d'une chambre
export const getRoomBookedDates = async (roomId) => {
  const res = await apiClient.get(`/rooms/${roomId}/booked-dates`);
  return res.data.booked;
};
