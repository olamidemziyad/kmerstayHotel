// src/services/slideService.js
import apiClient from "./axiosApi"; 

export const getHotelSlides = async () => {
  const res = await apiClient.get("/hotels?limit=5"); 
  return res.data.data.map(hotel => ({
    id: hotel.id, // ⚡ important pour la navigation
    image: hotel.image_url,
    title: hotel.name,
    subtitle: hotel.city,
  }));
};
