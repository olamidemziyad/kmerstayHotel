import { useQuery } from "@tanstack/react-query";
import { fetchHotels, fetchHotelById, fetchRoomsByHotelId } from "../services/hotelApi";

export const useHotels = () => {
    return useQuery({
        queryKey: ["hotels"],
        queryFn: fetchHotels,
    });
};

export const useHotel = (hotelId) => {
    return useQuery({
        queryKey: ["hotels", hotelId],
        queryFn : () =>  fetchHotelById(hotelId),
        enabled:  !!hotelId, // Évite d'exécuter la requête si l'ID est null
    });
};


export const useHotelsId = (id) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/hotels/${id}`);
      if (!res.ok) throw new Error("Erreur lors du chargement de l'hôtel");
      return res.json();
    },
    enabled: !!id, // Ne lance la requête que si l’id existe
  });
};


export const useRooms = (hotelId) => {
  return useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => fetchRoomsByHotelId(hotelId),
    enabled: !!hotelId,
  });
};
