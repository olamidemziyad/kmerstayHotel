import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronLeft, X, Grid3x3 } from 'lucide-react';
import { getHotelById } from '../../services/hotelService';
// import FavoriteButton from '../FavoriteButton'; // Assurez-vous que ce composant est stylé pour un thème sombre

// Composant pour l'état de chargement (skeleton)
const ImageGridSkeleton = () => (
    <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] max-h-[550px] rounded-2xl overflow-hidden">
                <div className="col-span-2 row-span-2 bg-gray-700/50"></div>
                <div className="bg-gray-700/50"></div>
                <div className="bg-gray-700/50"></div>
                <div className="bg-gray-700/50"></div>
                <div className="bg-gray-700/50"></div>
            </div>
        </div>
    </div>
);


export default function HotelImageGallery() {
    const { id } = useParams();
    const { data: hotel, isLoading, isError, error } = useQuery({
        queryKey: ['hotel', id],
        queryFn: () => getHotelById(id),
        enabled: !!id,
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    const images = hotel?.image_previews || [];

    // Gérer la fermeture de la galerie avec la touche "Échap"
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsFullscreenOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const openFullscreen = (index) => {
        setCurrentImageIndex(index);
        setIsFullscreenOpen(true);
    };

    const closeFullscreen = () => setIsFullscreenOpen(false);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (isLoading) return <ImageGridSkeleton />;

    if (isError) return (
        <div className="bg-gray-900 py-6">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-300">
                Erreur: {error.message}
            </div>
        </div>
    );

    if (images.length === 0) {
        return (
            <div className="bg-gray-900 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[50vh] max-h-[550px] flex items-center justify-center bg-gray-800 rounded-2xl">
                    <p className="text-gray-400">Aucune image disponible pour cet hôtel.</p>
                </div>
            </div>
        );
    }
    
    // Extrait les 5 premières images pour la grille
    const gridImages = images.slice(0, 5);

    return (
        <div className="bg-gray-900 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Grille d'images */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] max-h-[550px] rounded-2xl overflow-hidden group">
                    {/* Image principale */}
                    <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => openFullscreen(0)}>
                        <img src={gridImages[0]} alt="Vue principale de l'hôtel" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    </div>

                    {/* 4 petites images */}
                    {gridImages.slice(1).map((img, index) => (
                        <div key={index} className="relative cursor-pointer" onClick={() => openFullscreen(index + 1)}>
                            <img src={img} alt={`Vue ${index + 2} de l'hôtel`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                        </div>
                    ))}
                </div>

                {/* Bouton pour tout voir */}
                <button 
                    onClick={() => openFullscreen(0)}
                    className="absolute bottom-6 right-6 bg-white/90 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all flex items-center gap-2"
                >
                    <Grid3x3 size={18} />
                    Voir toutes les photos
                </button>
                
                {/* Bouton Favoris (Optionnel, peut être déplacé dans HotelHeader) */}
                {/* <div className="absolute top-6 right-6">
                    <FavoriteButton hotelId={hotel?.id} />
                </div> */}
            </div>

            {/* Modale plein écran */}
            {isFullscreenOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center animate-fade-in">
                    {/* Bouton Fermer */}
                    <button onClick={closeFullscreen} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10">
                        <X size={32} />
                    </button>

                    {/* Contenu de la galerie */}
                    <div className="relative w-full h-full flex items-center justify-center p-12">
                        {/* Bouton Précédent */}
                        <button onClick={prevImage} className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <ChevronLeft size={28} className="text-white" />
                        </button>
                        
                        <img 
                            src={images[currentImageIndex]} 
                            alt={`Vue ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                        
                        {/* Bouton Suivant */}
                        <button onClick={nextImage} className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <ChevronRight size={28} className="text-white" />
                        </button>

                        {/* Compteur d'images */}
                        <div className="absolute bottom-4 bg-black/50 text-white px-3 py-1 text-sm rounded-full">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Ajouter cette animation à votre CSS global ou tailwind.config.js */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}