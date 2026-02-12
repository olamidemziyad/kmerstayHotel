import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getAllHotels } from "../services/hotelService";
import { HotelCard } from "../components/HotelCard";
import { Slideshow } from "../components/Slideshow";
import Footer from "../components/Footer";
import { 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ChevronRight,
  Building2,
  Loader2,
  Star,
  Filter
} from "lucide-react";

// Composant de section moderne
const SectionHeader = ({ icon: Icon, title, subtitle, gradient }) => (
  <div className="text-center mb-12 animate-fadeIn">
    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${gradient} mb-4`}>
      <Icon className="w-6 h-6 text-white" />
      <span className="text-white font-semibold">{subtitle}</span>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
  </div>
);

// Skeleton pour les cartes
const HotelCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
      </div>
    </div>
  </div>
);

// Composant Hero moderne
const HeroSection = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { value: "500+", label: "Hôtels Disponibles", icon: Building2 },
    { value: "10K+", label: "Réservations", icon: Star },
    { value: "98%", label: "Satisfaction Client", icon: Sparkles }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

   


  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-20 md:py-32">
      {/* Formes décoratives animées */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" >
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Votre séjour parfait vous attend
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Découvrez le
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cameroun Autrement
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Des hôtels exceptionnels dans les plus belles villes du pays. 
            Réservez en quelques clics et vivez une expérience inoubliable.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button
              onClick={() => navigate("/hotels")}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Explorer les hôtels
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
            >
              En savoir plus
            </button>
          </div>

          {/* Statistiques animées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform transition-all duration-500 ${
                    currentStat === index ? "scale-110 ring-4 ring-blue-500/50" : "scale-100"
                  }`}
                >
                  <Icon className="w-10 h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filtre moderne
const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "Tous", icon: Building2 },
    { id: "popular", label: "Populaires", icon: TrendingUp },
    { id: "cheap", label: "Abordables", icon: Sparkles }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105"
            }`}
          >
            <Icon className="w-5 h-5" />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function fetchHotels() {
      try {
        const data = await getAllHotels();
        setHotels(data);
      } catch (error) {
        console.error("Erreur lors du chargement des hôtels:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHotels();
  }, []);

  // Filtres
  const doualaHotels = hotels.filter(h => h.city?.toLowerCase() === "douala");
  const yaoundeHotels = hotels.filter(h => h.city?.toLowerCase() === "yaounde" || h.city?.toLowerCase() === "yaoundé");
  const cheapHotels = hotels.filter(h => {
    const minPrice = h.rooms?.length > 0 ? Math.min(...h.rooms.map(r => r.price)) : Infinity;
    return minPrice < 50000;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection />
      </div>

      {/* Slideshow */}
      <section className="py-8">
        <Slideshow />
      </section>

      {/* Section Hotels Disponibles */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <SectionHeader
          icon={Building2}
          title="Nos Hôtels Disponibles"
          subtitle="Découvrez notre sélection"
          gradient="from-blue-500 to-purple-600"
        />

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.slice(0, 6).map((hotel) => (
              <div key={hotel.id} className="transform transition-all duration-300 hover:scale-105 animate-fadeInUp">
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Aucun hôtel disponible pour le moment
            </p>
          </div>
        )}
      </section>

      {/* Section Douala */}
      {doualaHotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-3xl"></div>
          <div className="relative">
            <SectionHeader
              icon={MapPin}
              title="Meilleurs Hôtels à Douala"
              subtitle="Capitale économique"
              gradient="from-blue-500 to-cyan-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doualaHotels.slice(0, 6).map((hotel) => (
                <div key={hotel.id} className="transform transition-all duration-300 hover:scale-105 animate-fadeInUp">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Yaoundé */}
      {yaoundeHotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-purple-100/50 to-transparent dark:from-purple-900/20 rounded-3xl"></div>
          <div className="relative">
            <SectionHeader
              icon={MapPin}
              title="Meilleurs Hôtels à Yaoundé"
              subtitle="Capitale politique"
              gradient="from-purple-500 to-pink-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {yaoundeHotels.slice(0, 6).map((hotel) => (
                <div key={hotel.id} className="transform transition-all duration-300 hover:scale-105 animate-fadeInUp">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Abordables */}
      {cheapHotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-transparent dark:from-green-900/20 rounded-3xl"></div>
          <div className="relative">
            <SectionHeader
              icon={Sparkles}
              title="Hôtels Abordables"
              subtitle="Qualité & Prix"
              gradient="from-green-500 to-teal-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cheapHotels.slice(0, 6).map((hotel) => (
                <div key={hotel.id} className="transform transition-all duration-300 hover:scale-105 animate-fadeInUp">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}