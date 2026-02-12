const API_URL = "http://localhost:3000/api/hotels";

// Récupère tous les hôtels

export async function getHotels() {
  try {
    // Envoie une requête GET à l'API pour récupérer les hôtels
    const res = await fetch(API_URL);
    // Vérifie si la réponse est correcte
    if (!res.ok) throw new Error("Erreur lors du chargement des hôtels");
    // Parse la réponse JSON
    const data = await res.json();
    console.log(data)
    // Retourne la liste des hôtels
    return data.data|| []; // selon la structure de ta réponse
  } catch (err) {
    console.error("Erreur API hôtels :", err.message);
    return [];
  }
}

export const fetchHotels = async () => {
  const response = await fetch("http://localhost:3000/api/hotels");
  const data = await response.json();
  console.log("Réponse API:", data); // 👀 Afficher la réponse pour vérifier
  return data;
};


export const fetchHotelById = async (hotelId) => {
  const response = await fetch(`${API_URL}/${hotelId}`);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement de l'hôtel");
  }
  return response.json();
};



export async function fetchRoomsByHotelId(hotelId) {
  const res = await fetch(`${API_URL}/${hotelId}/with-rooms`);
  if (!res.ok) throw new Error("Erreur lors du chargement des chambres");
  const data = await res.json();
  console.log("Rooms fetched:", data);
  return data;
}

