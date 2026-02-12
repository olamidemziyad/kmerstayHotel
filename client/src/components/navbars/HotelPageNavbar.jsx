// src/components/navbars/HotelPageNavBar.jsx 
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile } from "../../services/userService"; // Ajustez le chemin
import { User, Menu, X, BedDouble } from "lucide-react";

// Helper pour les initiales
const getInitials = (name = "") => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export default function HotelPageNavbar() { // Renommé pour plus de clarté
    const navigate = useNavigate();
    const { id: hotelId } = useParams();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Effet pour le style au scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: getProfile,
        retry: false,
    });

    // Composant pour le menu utilisateur (connexion/inscription ou profil)
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
                <div className="lg:hidden bg-gray-900/95 backdrop-blur-md pb-4 px-4 space-y-4 animate-fade-in-down">
                     <div className="border-t border-gray-700 pt-4 flex flex-col items-center space-y-4">
                         <a href={`/hotel-preview/${hotelId}/rooms`} className="font-semibold bg-purple-600 text-white w-full py-3 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                           <BedDouble size={16}/> Voir les prix
                        </a>
                        <UserMenu />
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