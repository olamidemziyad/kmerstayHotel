import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Star, 
  ImageIcon, 
  BedDouble, 
  MapPin, 
  Wifi,
  Waves,
  UtensilsCrossed,
  Car,
  Dumbbell,
  Sparkles,
  ChevronRight,
  Eye,
  TrendingUp
} from "lucide-react";

// Composant d'icône d'équipement
const AmenityIcon = ({ amenity }) => {
  const iconMap = {
    wifi: { icon: Wifi, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    pool: { icon: Waves, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    piscine: { icon: Waves, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    restaurant: { icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    parking: { icon: Car, color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-700" },
    gym: { icon: Dumbbell, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    spa: { icon: Sparkles, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" }
  };

  const normalized = amenity?.toLowerCase()
    .replace('wi-fi', 'wifi')
    .replace('salle de sport', 'gym')
    .replace('centre de bien-être', 'spa') || '';

  const match = Object.keys(iconMap).find(key => normalized.includes(key));
  if (!match) return null;

  const { icon: Icon, color, bg } = iconMap[match];

  return (
    <div 
      className={`${bg} ${color} p-2 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer group relative`}
      title={amenity}
    >
      <Icon className="w-4 h-4" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {amenity}
      </div>
    </div>
  );
};

// Composant Bouton Favori
const FavoriteButton = ({ hotelId, isFavorite: initialFavorite = false }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative p-2.5 rounded-full transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
          : 'bg-white/90 hover:bg-white backdrop-blur-sm shadow-md'
      } ${isAnimating ? 'animate-bounce' : ''}`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-300 ${
          isFavorite 
            ? 'fill-white text-white scale-110' 
            : 'text-gray-700 group-hover:text-red-500 group-hover:scale-110'
        }`}
      />
    </button>
  );
};

// Composant principal HotelCard
export function HotelCard({ hotel }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const navigate = useNavigate();


  if (!hotel) return null;

  const hasRooms = hotel.rooms && hotel.rooms.length > 0;
  const availableRooms = hotel.rooms?.filter((room) => room.is_available)?.length || 0;
  const minPrice = hasRooms ? Math.min(...hotel.rooms.map((room) => room.price)) : null;
  const secondaryImage = hotel.image_previews?.length > 1 ? hotel.image_previews[1] : null;
  const imageCount = hotel.image_previews?.length || 0;

  const handleClick = () => {
    navigate(`/hotel-preview/${hotel.id}`)
    console.log(`Navigating to hotel ${hotel.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-2"
    >
      {/* Image Container avec effet parallaxe */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
        {/* Images */}
        <div className="relative h-full w-full">
          <img
            src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
            alt={hotel.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } ${showSecondImage && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945";
            }}
          />
          
          {/* Image secondaire au hover */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${hotel.name} - vue 2`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                showSecondImage ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Overlay effet brillant */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full" 
             style={{ transitionDelay: '100ms' }} />

        {/* Badge de note - Top Left */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-2 rounded-full shadow-xl border border-white/50 transform transition-all duration-300 group-hover:scale-110">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {hotel.rating?.toFixed(1) || "4.5"}
          </span>
        </div>

        {/* Badge Populaire - Top Left (si applicable) */}
        {hotel.rating >= 4.5 && (
          <div className="absolute top-16 left-4 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white">Populaire</span>
          </div>
        )}

        {/* Compteur d'images - Top Right */}
        {imageCount > 0 && (
          <div className="absolute top-4 right-16 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{imageCount}</span>
          </div>
        )}

        {/* Bouton Favori - Top Right */}
        <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
          <FavoriteButton hotelId={hotel.id} />
        </div>

        {/* Bouton "Voir plus" au hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full font-bold shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
            onMouseEnter={() => secondaryImage && setShowSecondImage(true)}
            onMouseLeave={() => setShowSecondImage(false)}
          >
            <Eye className="w-5 h-5" />
            Voir les détails
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-grow p-5">
        {/* Titre et localisation */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1">
              {hotel.city}, {hotel.region}
            </span>
          </div>
        </div>

        {/* Équipements */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 5).map((amenity, index) => (
              <AmenityIcon key={index} amenity={amenity} />
            ))}
            {hotel.amenities.length > 5 && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg text-xs font-semibold">
                +{hotel.amenities.length - 5}
              </div>
            )}
          </div>
        )}

        {/* Infos chambres */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            <span className="font-medium">
              {availableRooms} {availableRooms > 1 ? 'chambres' : 'chambre'}
            </span>
          </div>
        </div>

        {/* Prix et CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              À partir de
            </p>
            {minPrice ? (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-FR").format(minPrice)}
                </span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  FCFA
                </span>
              </div>
            ) : (
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
                Prix sur demande
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              par nuit
            </p>
          </div>

          {/* Bouton Réserver */}
          <button className="group/btn relative px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Réserver
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Effet de brillance sur toute la carte */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      </div>
    </div>
  );
}