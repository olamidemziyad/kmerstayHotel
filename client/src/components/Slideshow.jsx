import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  X,
  Loader2
} from "lucide-react";
import { getHotelSlides } from "../services/slideService";

export function Slideshow() {
  const { data: slides = [], isLoading, isError } = useQuery({
    queryKey: ["slides"],
    queryFn: getHotelSlides,
  });

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const limitedSlides = slides.slice(0, 7);

  // Auto-play effect
  useEffect(() => {
    if (limitedSlides.length > 0 && isPlaying && !isAnimating) {
      const timer = setInterval(() => {
        setDirection("next");
        setCurrent((prev) => (prev + 1) % limitedSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [limitedSlides.length, isPlaying, isAnimating]);

  // Animation control
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [current]);

  const prev = () => {
    if (!isAnimating) {
      setDirection("prev");
      setCurrent((curr) => (curr === 0 ? limitedSlides.length - 1 : curr - 1));
    }
  };

  const next = () => {
    if (!isAnimating) {
      setDirection("next");
      setCurrent((curr) => (curr + 1) % limitedSlides.length);
    }
  };

  const goToSlide = (index) => {
    if (index !== current && !isAnimating) {
      setDirection(index > current ? "next" : "prev");
      setCurrent(index);
    }
  };

  const handleSlideClick = (hotelId) => {
    window.location.href = `/hotel-preview/${hotelId}`;
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <p className="text-xl font-bold text-white animate-pulse">
            Chargement des destinations...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || limitedSlides.length === 0) {
    return (
      <div className="relative h-[600px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30 shadow-2xl">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-xl font-bold text-red-400">
            Aucune destination disponible
          </p>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const currentSlide = limitedSlides[current];

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl group">
      {/* Slides */}
      {limitedSlides.map((slide, index) => {
        // 🔥 FIX: Extraction correcte du nom de l'hôtel
        const hotelName = slide.name || slide.title || slide.hotel?.name || "Destination de Rêve";
        const hotelCity = slide.city || slide.location || slide.hotel?.city || "Cameroun";
        const hotelDescription = slide.subtitle || slide.description || slide.hotel?.description || "Découvrez cette destination exceptionnelle";
        const hotelImage = slide.image || slide.image_url || slide.hotel?.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";

        return (
          <div
            key={slide.id}
            onClick={() => handleSlideClick(slide.id)}
            className={`absolute inset-0 cursor-pointer transition-all duration-1000 ease-out ${
              index === current
                ? "opacity-100 z-10 scale-100"
                : direction === "next"
                ? "opacity-0 z-0 scale-95 -translate-x-full"
                : "opacity-0 z-0 scale-95 translate-x-full"
            }`}
          >
            {/* Image avec effet Ken Burns */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={hotelImage}
                alt={hotelName}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ${
                  index === current ? "scale-110" : "scale-100"
                }`}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";
                }}
              />
              
              {/* Overlay gradient sophistiqué */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30"></div>
            </div>

            {/* Contenu - 🔥 FIX: Key pour forcer le re-render des animations */}
            <div 
              key={`content-${current}-${index}`}
              className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 z-10"
            >
              <div className="max-w-4xl">
                {/* Badge Premium */}
                <div 
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6 transition-all duration-700 ${
                    index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: index === current ? '100ms' : '0ms' }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold text-sm">
                    Destination Premium
                  </span>
                </div>

                {/* Titre - 🔥 FIX: Affichage garanti du nom */}
                <h2 
                  className={`text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-2xl leading-tight transition-all duration-700 ${
                    index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: index === current ? '200ms' : '0ms' }}
                >
                  {hotelName}
                </h2>

                {/* Sous-titre */}
                <p 
                  className={`text-xl md:text-3xl text-white/90 font-light mb-6 drop-shadow-lg line-clamp-2 transition-all duration-700 ${
                    index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: index === current ? '400ms' : '0ms' }}
                >
                  {hotelDescription}
                </p>

                {/* Localisation */}
                <div 
                  className={`flex items-center gap-2 text-white/80 mb-8 transition-all duration-700 ${
                    index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: index === current ? '600ms' : '0ms' }}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg font-medium">
                    {hotelCity}
                  </span>
                </div>

                {/* Bouton CTA */}
                <button 
                  className={`group/btn relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-700 hover:scale-105 overflow-hidden ${
                    index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: index === current ? '800ms' : '0ms' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideClick(slide.id);
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Découvrir maintenant
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Boutons de navigation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        disabled={isAnimating}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all transform hover:scale-110 z-20 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-7 h-7 text-white drop-shadow-lg" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        disabled={isAnimating}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all transform hover:scale-110 z-20 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-7 h-7 text-white drop-shadow-lg" />
      </button>

      {/* Contrôles en bas à droite */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
        {/* Bouton Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white" />
          )}
        </button>

        {/* Compteur */}
        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-white font-bold text-sm">
            {current + 1} / {limitedSlides.length}
          </span>
        </div>
      </div>

      {/* Indicateurs de progression */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {limitedSlides.map((slide, i) => {
          const slideName = slide.name || slide.title || slide.hotel?.name || `Slide ${i + 1}`;
          
          return (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(i);
              }}
              disabled={isAnimating}
              className="group/dot relative disabled:opacity-50"
              aria-label={`Aller au slide ${i + 1}`}
            >
              {/* Barre de progression pour le slide actif */}
              {i === current ? (
                <div className="relative w-16 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    key={`progress-${current}`}
                    className="absolute inset-0 bg-white rounded-full"
                    style={{
                      animation: isPlaying && !isAnimating ? 'progress 5s linear' : 'none',
                      animationFillMode: 'forwards'
                    }}
                  ></div>
                </div>
              ) : (
                <div className="w-8 h-1.5 bg-white/30 rounded-full hover:bg-white/50 transition-all group-hover/dot:w-12"></div>
              )}
              
              {/* Tooltip au hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {slideName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Effet de brillance décoratif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-45 animate-shimmer"></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 8s infinite;
        }
      `}</style>
    </div>
  );
}