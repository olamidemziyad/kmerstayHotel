import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '../../services/hotelService'; // à adapter selon ton arbo

export default function HotelPreview() {
  const { id } = useParams();

  const {
    data: hotel,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id),
    enabled: !!id, // Ne lance la requête que si l'id est défini
  });

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur : {error.message}</p>;

  const images = hotel?.image_previews || [];

  return (
    <div className="px-4 mx-auto mb-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">{hotel.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[400px]">
        {images.map((img, index) => (
          <div key={index} className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
            <img
              src={img}
              alt={`Aperçu ${index + 1}`}
              className={`object-cover w-full h-full ${
                index === 0
                  ? 'rounded-l-lg'
                  : index === 2
                  ? 'rounded-tr-lg'
                  : index === images.length - 1
                  ? 'rounded-br-lg'
                  : ''
              }`}
            />
            {index === images.length - 1 && (
              <button className="absolute px-4 py-2 bg-white rounded-full shadow-lg bottom-4 right-4 hover:bg-gray-50">
                Voir plus
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
