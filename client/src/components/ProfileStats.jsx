import React from "react";
import { Heart, Hotel, CalendarCheck, Star } from "lucide-react";

const ProfileStats = ({ stats }) => {
  // Valeurs par défaut si stats n'est pas encore chargé
  const {
    bookings = 0,
    favorites = 0,
    reviews = 0,
    hotels = 0,
  } = stats || {};

  const items = [
    {
      label: "Réservations",
      value: bookings,
      icon: <CalendarCheck className="w-6 h-6 text-blue-500" />,
    },
    {
      label: "Favoris",
      value: favorites,
      icon: <Heart className="w-6 h-6 text-red-500" />,
    },
    {
      label: "Avis",
      value: reviews,
      icon: <Star className="w-6 h-6 text-yellow-500" />,
    },
    {
      label: "Hôtels visités",
      value: hotels,
      icon: <Hotel className="w-6 h-6 text-green-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow"
        >
          {item.icon}
          <p className="text-xl font-bold mt-2">{item.value}</p>
          <p className="text-gray-600 text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
