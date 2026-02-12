import React from "react";
import { Wifi, Coffee, Car, School as Pool } from "lucide-react";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '../../services/hotelService';

const iconsByAmenity = {
  wifi: <Wifi className="w-6 h-6" />,
  restaurant: <Coffee className="w-6 h-6" />,
  parking: <Car className="w-6 h-6" />,
  pool: <Pool className="w-6 h-6" />,
};

const labelsByAmenity = {
  wifi: "WiFi gratuit",
  restaurant: "Restaurant",
  parking: "Parking gratuit",
  pool: "Piscine",
};

export default function HotelInfo() {
  const { id } = useParams();

  const {
    data: hotel,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur : {error.message}</p>;
  if (!hotel) return <p>Hôtel non trouvé.</p>;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mt-20 text-2xl font-bold">À propos</h2>
          <p className="mb-6 text-gray-600">{hotel.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {hotel.amenities?.map((key, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {iconsByAmenity[key.toLowerCase()] || <span>❓</span>}
                <span>{labelsByAmenity[key.toLowerCase()] || key}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 m-auto bg-white rounded-lg shadow-lg h-fit">
          <div className="mb-4 text-2xl font-bold">
            À partir de {hotel.price?.toLocaleString() || "???"} FCFA
          </div>
          <button className="w-full py-3 mb-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
            Réserver
          </button>
          <div className="text-sm text-gray-600">
            Prix le plus bas par nuit trouvé au cours des 24 dernières heures.
          </div>
        </div>
      </div>
    </div>
  );
}
