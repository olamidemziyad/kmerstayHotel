import React, { useState } from "react";
import { useHotels } from "../hooks/useHotels";
import { Slideshow } from "../components/Slideshow";
import  SearchResults  from "../components/SearchResults";
import { HotelCard } from "../components/HotelCard";
import Login from "../components/Login"
import  Register  from "../components/Register";
import { Loader2, HotelIcon } from "lucide-react";

function HomeTest() {
  const [page, setPage] = useState("home");
  const { data, isLoading, error } = useHotels();
  const hotels = data?.data || [];

  if (page === "login") return <Login />;
  if (page === "signup") return <Register />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HotelIcon className="text-blue-600 w-8 h-8" />
            <h1 className="text-2xl font-bold text-blue-600">LuxStay</h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setPage("login")}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Connexion
            </button>
            <button
              onClick={() => setPage("signup")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Inscription
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1">
        {/* Hero Section */}
        <Slideshow />
        
        {/* Barre de recherche */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 z-20 relative">
          <SearchResults />
        </div>

        {/* Section des hôtels */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HotelIcon className="text-blue-500" />
            Nos Hôtels Disponibles
          </h2>

          {/* Gestion des états */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Chargement des hôtels...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
              <p className="text-red-600 font-medium">
                Erreur lors du chargement : {error.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {hotels.length === 0 && !isLoading && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">
                Aucun hôtel disponible pour le moment.
              </p>
            </div>
          )}

          {/* Grille des hôtels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </section>
      </main>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} LuxStay. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomeTest;