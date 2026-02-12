import { useState } from 'react';
import { Star, Share2, Heart, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '../../services/hotelService'; 
import FavoriteButton from '../FavoriteButton'; 

// Un composant de chargement (skeleton) stylisé pour le thème sombre
const HotelHeaderSkeleton = () => (
    <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="h-10 bg-gray-700 rounded-lg w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded-md w-1/2"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-11 w-32 bg-gray-700 rounded-lg"></div>
                    <div className="h-11 w-36 bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


export default function HotelHeader() {
    const { id } = useParams();
    const [showShareFeedback, setShowShareFeedback] = useState(false);
    // Supposons que l'état des favoris vienne des données utilisateur à l'avenir
    const [isFavorite, setIsFavorite] = useState(false); 

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

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareFeedback(true);
            setTimeout(() => setShowShareFeedback(false), 2000); // Le message disparaît après 2s
        } catch (err) {
            console.error('Impossible de copier le lien:', err);
        }
    };

    if (isLoading) {
        return <HotelHeaderSkeleton />;
    }

    if (isError) {
        return (
            <div className="bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
                        <p className="text-red-300 font-semibold text-lg">Oops! Une erreur est survenue.</p>
                        <p className="text-red-400 mt-1">{error.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const rating = hotel?.rating || 4.5; // Donnée de secours
    const reviewCount = hotel?.reviewCount || 245; // Donnée de secours

    return (
        <div className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    {/* Informations principales */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                            {hotel?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300">
                            {/* Note */}
                            <div className="flex items-center">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="ml-2 font-bold text-white">{rating.toFixed(1)}</span>
                                <a href="#reviews" className="ml-2 hover:underline">
                                    ({reviewCount} avis)
                                </a>
                            </div>

                            <span className="hidden sm:inline text-gray-600">•</span>

                            {/* Localisation */}
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="ml-2">{hotel?.city}, {hotel?.region}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-3 mt-4 md:mt-0">
                        <div className="relative">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Partager cet hôtel"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="font-semibold">Partager</span>
                            </button>
                            {showShareFeedback && (
                                <div className="absolute top-full right-0 mt-2 bg-green-600 text-white text-xs rounded-md py-1 px-3 shadow-lg animate-fade-in-up">
                                    Lien copié !
                                </div>
                            )}
                        </div>
                         <FavoriteButton hotelId={hotel.id} size="large" showText={true} /> 
                        
                    </div>
                </div>
            </div>

            {/* Animation pour le tooltip (peut aussi être mis dans tailwind.config.js) */}
            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}