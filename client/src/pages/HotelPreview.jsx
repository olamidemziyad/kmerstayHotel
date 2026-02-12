// src/pages/HotelPreview.jsx
import React from "react";
import HotelPreviewNavBar from "../components/hotel_preview/HotelPreviewNavBar";
import HotelHeader from "../components/hotel_preview/HotelHeader";
import HotelGallery from "../components/hotel_preview/HotelGallery";
import HotelInfo from "../components/hotel_preview/HotelInfo";
import RoomsList from "../components/RoomsList";
// import HotelMap from "../components/hotel_preview/HotelMap"; // idée future

export default function HotelPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 relative overflow-hidden">
      {/* Navbar principale */}
      <HotelPreviewNavBar />
     

      {/* Décorations floues façon HeroSection */}
     
      <div className="absolute bottom-0 right-0 w-96  mt-500 h-96 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      {/* Contenu principal */}
      <main className="relative z-10 pt-24 space-y-16 animate-fadeInUp">
        {/* En-tête hôtel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HotelHeader />
        </section>

        {/* Galerie */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HotelGallery id="#photos"/>
        </section>

        {/* Informations principales */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HotelInfo />
        </section>

        {/* Liste des chambres */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nos Chambres Disponibles
            </span>
          </h2>
          <RoomsList />
        </section>

        {/* Future section carte */}
        {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <HotelMap />
        </section> */}
      </main>

      {/* Animations réutilisées depuis Home */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
