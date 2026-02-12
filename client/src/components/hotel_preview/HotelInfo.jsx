import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Wifi, Coffee, Car, Waves, BedDouble, ChevronRight, Tag, UtensilsCrossed,
    AirVent, Martini, Dumbbell, Bus, X
} from "lucide-react";
import { getHotelById } from '../../services/hotelService';

// Mapping des icônes plus robuste (gère la casse)
const iconsByAmenityLabel = {
    "wi-fi gratuit": <Wifi className="w-5 h-5 text-purple-400" />,
    "wifi": <Wifi className="w-5 h-5 text-purple-400" />,
    "restaurant": <UtensilsCrossed className="w-5 h-5 text-purple-400" />,
    "parking gratuit": <Car className="w-5 h-5 text-purple-400" />,
    "parking": <Car className="w-5 h-5 text-purple-400" />,
    "piscine": <Waves className="w-5 h-5 text-purple-400" />,
    "pool": <Waves className="w-5 h-5 text-purple-400" />,
    "climatisation": <AirVent className="w-5 h-5 text-purple-400" />,
    "bar": <Martini className="w-5 h-5 text-purple-400" />,
    "petit-déjeuner inclus": <Coffee className="w-5 h-5 text-purple-400" />,
    "salle de sport": <Dumbbell className="w-5 h-5 text-purple-400" />,
    "navette aéroport": <Bus className="w-5 h-5 text-purple-400" />,
};

const getAmenityIcon = (label) => {
    return iconsByAmenityLabel[label.toLowerCase()] || <Tag className="w-5 h-5 text-gray-500" />;
};

// Skeleton Loader pour le thème sombre
const HotelInfoSkeleton = () => (
    <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <hr className="border-t border-gray-700/50" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
                <div className="md:col-span-2 space-y-8">
                    {/* Skeleton "À propos" */}
                    <div>
                        <div className="h-8 w-1/3 bg-gray-700 rounded-lg mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-700 rounded-md"></div>
                            <div className="h-4 bg-gray-700 rounded-md w-11/12"></div>
                            <div className="h-4 bg-gray-700 rounded-md w-5/6"></div>
                        </div>
                    </div>
                     {/* Skeleton "Équipements" */}
                     <div>
                        <div className="h-8 w-1/3 bg-gray-700 rounded-lg mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-700 rounded-lg"></div>)}
                        </div>
                    </div>
                </div>
                 {/* Skeleton "Sidebar" */}
                <div className="h-48 bg-gray-800 rounded-2xl border border-gray-700"></div>
            </div>
        </div>
    </div>
);


export default function HotelDetails() {
    const { id } = useParams();
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

    const { data: hotel, isLoading, isError, error } = useQuery({
        queryKey: ['hotel', id],
        queryFn: () => getHotelById(id),
        enabled: !!id,
    });

    if (isLoading) return <HotelInfoSkeleton />;
    if (isError) return <div className="text-center py-12 text-red-400 bg-gray-900">Erreur : {error.message}</div>;
    if (!hotel) return <div className="text-center py-12 text-gray-400 bg-gray-900">Hôtel non trouvé.</div>;

    const availableRooms = hotel.rooms?.filter(r => r.is_available)?.length || 0;
    const hasRooms = hotel.rooms && hotel.rooms.length > 0;
    const minPrice = hasRooms ? Math.min(...hotel.rooms.map(r => r.price).filter(p => p > 0)) : null;
    const featuredAmenities = hotel.amenities?.slice(0, 6) || [];

    return (
        <div className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <hr className="border-t border-gray-700/50" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 py-12">
                    {/* Colonne principale (Description et Équipements) */}
                    <div className="md:col-span-2 space-y-10">
                        {/* Section "À propos" */}
                        <div>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">À propos de cet hôtel</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {hotel.description || "Aucune description n'est disponible pour cet établissement."}
                            </p>
                        </div>

                        {/* Section "Équipements" */}
                        {hotel.amenities?.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold mb-4 tracking-tight">Équipements populaires</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {featuredAmenities.map((label, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                                            {getAmenityIcon(label)}
                                            <span className="font-medium text-gray-200">{label}</span>
                                        </div>
                                    ))}
                                </div>
                                {hotel.amenities.length > 6 && (
                                    <button
                                        onClick={() => setIsAmenitiesModalOpen(true)}
                                        className="mt-6 font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-colors px-5 py-2.5 rounded-lg"
                                    >
                                        Afficher tous les {hotel.amenities.length} équipements
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar de réservation */}
                    <div className="h-fit sticky top-28">
                       <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
                            <div className="mb-5">
                                <p className="text-sm text-gray-400">À partir de</p>
                                {minPrice ? (
                                    <p className="text-4xl font-extrabold text-white">
                                        {new Intl.NumberFormat("fr-CM").format(minPrice)}
                                        <span className="text-lg font-medium text-gray-400"> FCFA</span>
                                    </p>
                                ) : (
                                    <p className="text-lg font-semibold text-gray-300">Aucun prix disponible</p>
                                )}
                                <p className="text-sm text-gray-400">par nuit</p>
                            </div>

                            <Link to={`/hotel-preview/${hotel.id}/rooms`} className="w-full py-3.5 mb-4 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30">
                                Voir les disponibilités
                                <ChevronRight className="w-5 h-5" />
                            </Link>

                             <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                                <BedDouble className="w-4 h-4" />
                                <span>{availableRooms} chambre{availableRooms !== 1 ? "s" : ""} disponible{availableRooms !== 1 ? "s" : ""}</span>
                            </div>
                       </div>
                    </div>
                </div>
            </div>

            {/* Modale pour tous les équipements */}
            {isAmenitiesModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsAmenitiesModalOpen(false)}
                >
                    <div className="bg-gray-800 w-full max-w-2xl max-h-[80vh] rounded-2xl p-6 border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Tous les équipements</h3>
                            <button onClick={() => setIsAmenitiesModalOpen(false)} className="p-2 rounded-full hover:bg-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[65vh] pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {hotel.amenities.map((label, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gray-700/60">
                                    {getAmenityIcon(label)}
                                    <span className="font-medium">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}