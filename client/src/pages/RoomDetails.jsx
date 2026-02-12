import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../services/roomService";
import RoomNavBar from "../components/rooms/RoomNavBar"; 
import { 
  ImageIcon, Star, MapPin, Ruler, Wifi, Tv, Coffee, Bed, ArrowLeft, 
  CheckCircle, XCircle, Users, Maximize2, Calendar, Shield, Sparkles,
  ChevronLeft, ChevronRight, X, ZoomIn, Loader2, AlertCircle, Heart,
  Clock, Wind, Bath, Wifi as WifiIcon, TvIcon, UtensilsCrossed, Waves
} from "lucide-react";
import RoomBookingForm from "../components/RoomBookingForm";
import HotelPreviewBar from "../components/navbars/Hotel-Preview";

// Modal Galerie d'images
const ImageGalleryModal = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10 group"
      >
        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-20">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Badge d'équipement
const AmenityBadge = ({ icon: Icon, label, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    green: "bg-green-500/20 text-green-300 border-green-400/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-400/30"
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${colors[color]} border backdrop-blur-sm font-semibold transition-all hover:scale-105 hover:shadow-lg`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
};

// Icônes d'équipements
const getAmenityIcon = (amenity) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi')) return { icon: Wifi, color: 'blue' };
  if (lower.includes('tv')) return { icon: Tv, color: 'purple' };
  if (lower.includes('café') || lower.includes('coffee')) return { icon: Coffee, color: 'orange' };
  if (lower.includes('bain') || lower.includes('bath')) return { icon: Bath, color: 'blue' };
  if (lower.includes('air') || lower.includes('clim')) return { icon: Wind, color: 'green' };
  if (lower.includes('piscine') || lower.includes('pool')) return { icon: Waves, color: 'blue' };
  if (lower.includes('restaurant')) return { icon: UtensilsCrossed, color: 'orange' };
  return { icon: CheckCircle, color: 'green' };
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: room, isLoading, isError, error } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <HotelPreviewBar />
        <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <p className="text-white text-lg font-medium">Chargement des détails...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <HotelPreviewBar />
        <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Erreur de chargement</h3>
              <p className="text-red-300 mb-6">{error?.message || "Impossible de charger les détails"}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Retour
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [room.image_url, ...(room.additional_images || [])].filter(Boolean);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <RoomNavBar />

      {showGallery && (
        <ImageGalleryModal
          images={allImages}
          currentIndex={selectedImageIndex}
          onClose={() => setShowGallery(false)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold transition-all shadow-lg mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour aux chambres
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Section Galerie */}
          <div className="space-y-4">
            <div
              className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
              onClick={() => {
                setSelectedImageIndex(0);
                setShowGallery(true);
              }}
            >
              {room.image_url ? (
                <>
                  <img
                    src={room.image_url}
                    alt={`Chambre ${room.room_number}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-semibold flex items-center gap-2 shadow-xl">
                    <ImageIcon className="w-4 h-4" />
                    {allImages.length}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-4 left-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ImageIcon className="w-20 h-20 mb-4" />
                  <p className="text-lg font-medium">Aucune image</p>
                </div>
              )}
            </div>

            {room.additional_images?.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {room.additional_images.slice(0, 4).map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setShowGallery(true);
                    }}
                    className="relative h-24 bg-slate-700 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                  >
                    <img
                      src={img}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Détails */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold mb-3 shadow-xl">
                    <Sparkles className="w-4 h-4" />
                    Chambre Premium
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                    Chambre {room.room_number}
                  </h1>
                  {room.location && (
                    <div className="flex items-center text-blue-200">
                      <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="capitalize font-medium">{room.location}</span>
                    </div>
                  )}
                </div>

                {room.rating && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2.5 rounded-xl shadow-xl">
                    <Star className="w-5 h-5 fill-white" />
                    <span className="font-bold text-lg">{room.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <AmenityBadge icon={Ruler} label={`${room.size || 'N/A'} m²`} color="blue" />
                <AmenityBadge icon={Bed} label={room.bed_type || 'N/A'} color="purple" />
                <AmenityBadge icon={Users} label={`${room.capacity || 2} pers.`} color="orange" />
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 text-green-300 font-semibold border border-green-400/30 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5" />
                  Disponible
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                À propos
              </h3>
              <p className="text-blue-200 leading-relaxed">
                {room.description || "Chambre confortable avec tous les équipements modernes pour un séjour agréable."}
              </p>
            </div>

            {/* Équipements */}
            {room.amenities?.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Équipements inclus</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => {
                    const { icon: Icon, color } = getAmenityIcon(amenity);
                    const colorClasses = {
                      blue: 'text-blue-400',
                      purple: 'text-purple-400',
                      green: 'text-green-400',
                      orange: 'text-orange-400'
                    };
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all border border-white/10"
                      >
                        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
                        <span className="text-blue-200 font-medium text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prix */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-blue-300 mb-1 font-medium">Prix par nuit</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-white">
                      {room.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-semibold text-blue-200">FCFA</span>
                  </div>
                  {room.discount && (
                    <p className="text-sm text-green-300 font-semibold mt-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Économisez {room.discount}% - Offre spéciale
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-200 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Annulation gratuite jusqu'à 24h avant l'arrivée</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de réservation */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Réserver cette chambre
          </h2>
          <RoomBookingForm
            roomId={room.id}
            roomDetails={room}
            defaultCheckIn={start}
            defaultCheckOut={end}
            onSuccess={() => alert("Merci pour votre réservation !")}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}