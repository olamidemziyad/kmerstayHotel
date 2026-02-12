// src/components/navbars/HotelPreviewNavBar.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile } from "../../services/userService"; // Ajustez le chemin
import { User, Menu, X, BedDouble } from "lucide-react";

// Helper pour les initiales
const getInitials = (name = "") => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

// Sections de la page de l'hôtel
const navSections = [
    { id: 'photos', label: 'Photos' },
    { id: 'details', label: 'Détails' },
    { id: 'reviews', label: 'Avis' }, // Adaptez si vous avez ces sections
    { id: 'location', label: 'Lieu' }, // Adaptez si vous avez ces sections
];

export default function HotelPreviewNavBar() {
    const navigate = useNavigate();
    const { id: hotelId } = useParams();

    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('photos');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Effet pour le style au scroll et la détection de section
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);

            // Détection de la section active
            let currentSection = '';
            navSections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Si le haut de la section est visible dans la moitié supérieure de l'écran
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        currentSection = section.id;
                    }
                }
            });
            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: getProfile,
        retry: false,
    });

    const UserMenu = () => (
        <>
            {isLoading ? <div className="h-10 w-24 animate-pulse rounded-full bg-gray-700"></div>
                : user ? (
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold text-sm">
                            {getInitials(user.fullName)}
                        </div>
                        <span className="font-semibold text-white hidden sm:inline truncate max-w-[100px]">{user.fullName}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate("/login")} className="px-4 py-2 text-white font-semibold rounded-full hover:bg-gray-700 transition-colors">
                            Connexion
                        </button>
                        <button onClick={() => navigate("/signup")} className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
                            Inscription
                        </button>
                    </div>
                )}
        </>
    );

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/90 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <span onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        KmerStay
                    </span>

                    {/* Navigation de section (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full p-1">
                        {navSections.map(section => (
                            <a key={section.id} href={`#${section.id}`}
                               onClick={() => setIsMobileMenuOpen(false)}
                               className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeSection === section.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                                {section.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA & User Menu (Desktop) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a href={`/hotel-preview/${hotelId}/rooms`} className="font-semibold bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
                           <BedDouble size={16}/> Voir les prix
                        </a>
                        {/* <UserMenu /> */}
                    </div>

                    {/* Menu Mobile (Bouton) */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

             {/* Menu déroulant Mobile */}
             {isMobileMenuOpen && (
                <div className="lg:hidden bg-gray-900/95 backdrop-blur-md pb-4 px-4 space-y-2 animate-fade-in-down">
                    <nav className="flex flex-col space-y-1 pt-2">
                         {navSections.map(section => (
                            <a key={section.id} href={`#${section.id}`}
                               onClick={() => setIsMobileMenuOpen(false)}
                               className={`block px-4 py-3 text-base font-medium rounded-lg ${activeSection === section.id ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                                {section.label}
                            </a>
                        ))}
                    </nav>
                    <div className="border-t border-gray-700 pt-4">
                         <a href={`/hotel-preview/${hotelId}/rooms`} className="font-semibold bg-purple-600 text-white w-full py-3 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                           <BedDouble size={16}/> Voir les prix
                        </a>
                    </div>
                </div>
             )}
              <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out;
                }
            `}</style>
        </header>
    );
}