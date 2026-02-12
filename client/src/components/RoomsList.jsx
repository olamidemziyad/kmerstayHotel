// src/pages/RoomsList.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoomsByHotel } from "../services/roomService";
import { BedDouble, ImageIcon, Star, ArrowRight, Filter, Calendar, Home, X, Tag, Banknote, Undo2 } from "lucide-react";


// SKELETON LOADER - Pour un chargement plus fluide
const RoomCardSkeleton = () => (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-transparent p-4 animate-pulse">
        <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-5 w-3/4 bg-gray-700 rounded-md mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded-md mb-4"></div>
        <div className="flex justify-between items-center">
            <div className="h-6 w-1/3 bg-gray-700 rounded-md"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

export default function RoomsList() {
    const { id: hotelId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // États des filtres
    const [filters, setFilters] = useState({
        start: searchParams.get('start') || '',
        end: searchParams.get('end') || '',
        type: searchParams.get('type') || 'all',
        maxPrice: searchParams.get('maxPrice') || ''
    });

    // Filtres appliqués qui déclenchent la requête
    const [appliedFilters, setAppliedFilters] = useState(filters);

    // Mettre à jour les filtres lorsque les paramètres de l'URL changent
    useEffect(() => {
        setFilters({
            start: searchParams.get('start') || '',
            end: searchParams.get('end') || '',
            type: searchParams.get('type') || 'all',
            maxPrice: searchParams.get('maxPrice') || ''
        });
        setAppliedFilters({
            start: searchParams.get('start') || '',
            end: searchParams.get('end') || '',
            type: searchParams.get('type') || 'all',
            maxPrice: searchParams.get('maxPrice') || ''
        });
    }, [searchParams]);

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ["rooms", hotelId, appliedFilters],
        queryFn: () => getRoomsByHotel(hotelId, appliedFilters),
        enabled: !!hotelId,
        keepPreviousData: true // Pour une expérience de filtrage plus fluide
    });

    const rooms = response?.data || [];
    const totalCount = response?.count || 0;

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.start) params.set('start', filters.start);
        if (filters.end) params.set('end', filters.end);
        if (filters.type !== 'all') params.set('type', filters.type);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ start: '', end: '', type: 'all', maxPrice: '' });
        setSearchParams(new URLSearchParams());
    };

    const getRoomAvailabilityStatus = (room) => {
        const hasDateFilters = appliedFilters.start && appliedFilters.end;
        if (hasDateFilters) {
            return {
                isAvailable: true,
                statusText: "Disponible aux dates choisies",
                statusColor: "bg-green-500",
            };
        }
        return {
            isAvailable: room.is_available,
            statusText: room.is_available ? "Disponible maintenant" : "Actuellement occupée",
            statusColor: room.is_available ? "bg-green-500" : "bg-red-500",
        };
    };

    const hasActiveFilters = Object.values(appliedFilters).some(v => v && v !== 'all');
    const today = new Date().toISOString().split('T')[0];

    if (isError) return (
        <div className="bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto pt-32 px-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
                    <X className="w-12 h-12 mx-auto text-red-400 mb-4" />
                    <h3 className="text-xl font-bold text-white">Erreur de chargement des chambres</h3>
                    <p className="mt-2 text-red-300">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg">Réessayer</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* <HotelPreviewBar /> */}
            <main className="pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Panneau de filtres */}
                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-10">
                        <div className="flex items-center gap-3 mb-5">
                            <Filter className="w-6 h-6 text-purple-400" />
                            <h3 className="text-2xl font-bold">Trouvez votre chambre idéale</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Inputs pour les filtres */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5"><Calendar size={14}/> Arrivée</label>
                                <input type="date" name="start" value={filters.start} onChange={handleFilterChange} min={today} className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5"><Calendar size={14}/> Départ</label>
                                <input type="date" name="end" value={filters.end} onChange={handleFilterChange} min={filters.start || today} className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5"><Home size={14}/> Type</label>
                                <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                    <option value="all">Tous</option>
                                    <option value="Simple">Simple</option>
                                    <option value="Double">Double</option>
                                    <option value="Suite">Suite</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5"><Banknote size={14}/> Prix max (FCFA)</label>
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} min={0} placeholder="Ex: 50000" className="bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"/>
                            </div>
                             {/* Boutons d'action */}
                            <div className="flex flex-col justify-end gap-2 md:col-span-2 lg:col-span-1">
                                <button onClick={applyFilters} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">Appliquer</button>
                                {hasActiveFilters && <button onClick={clearFilters} className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"><Undo2 size={14}/> Réinitialiser</button>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Titre et nombre de résultats */}
                    <div className="flex justify-between items-baseline mb-8">
                        <h2 className="text-4xl font-extrabold tracking-tight">Nos chambres</h2>
                        {!isLoading && <p className="text-gray-400">{totalCount} chambre{totalCount !== 1 ? 's' : ''} trouvée{totalCount !== 1 ? 's' : ''}</p>}
                    </div>

                    {/* Contenu de la liste */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => <RoomCardSkeleton key={i} />)}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-20 bg-gray-800/50 rounded-2xl">
                            <BedDouble className="w-20 h-20 mx-auto text-gray-600" />
                            <h3 className="mt-4 text-2xl font-bold">Aucune chambre trouvée</h3>
                            <p className="mt-2 text-gray-400">{hasActiveFilters ? "Essayez d'ajuster ou de réinitialiser vos filtres." : "Aucune chambre n'est disponible pour le moment."}</p>
                            <div className="mt-8">
                                {hasActiveFilters && <button onClick={clearFilters} className="font-semibold bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">Réinitialiser les filtres</button>}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map((room) => {
                                const availability = getRoomAvailabilityStatus(room);
                                return (
                                    <div key={room.id} onClick={() => availability.isAvailable && navigate(`/rooms/${room.id}?start=${appliedFilters.start}&end=${appliedFilters.end}`)} className={`bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 flex flex-col group transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1 ${availability.isAvailable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                                        <div className="h-48 relative overflow-hidden">
                                            {room.image_url ? <img src={room.image_url} alt={`Chambre ${room.room_number}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /> : <div className="flex items-center justify-center h-full bg-gray-700 text-gray-500"><ImageIcon className="w-16 h-16" /></div>}
                                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-gray-900/70 text-white px-2.5 py-1 text-xs rounded-full backdrop-blur-sm">
                                                <div className={`w-2 h-2 rounded-full ${availability.statusColor}`}></div>
                                                <span>{availability.statusText}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1">{room.type}</h4>
                                                <p className="text-gray-400 text-sm mb-3">{room.size} m² • {room.bed_type}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div>
                                                    <p className="text-gray-400 text-xs">Prix / nuit</p>
                                                    <p className="text-xl font-bold text-white">{room.price.toLocaleString('fr-CM')} FCFA</p>
                                                </div>
                                                {availability.isAvailable && (
                                                    <div className="bg-purple-600 text-white p-3 rounded-full transition-transform group-hover:scale-110">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}