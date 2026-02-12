import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  User,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Users,
  CreditCard,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  Percent
} from "lucide-react";
import { createBooking, checkRoomAvailability } from "../services/bookingService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import LoginModal from "./ui/LoginModal";

export default function RoomBookingForm({
  roomId,
  onSuccess,
  roomDetails,
  defaultCheckIn = "",
  defaultCheckOut = ""
}) {
  const [check_in_date, setCheckInDate] = useState(defaultCheckIn);
  const [check_out, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(true);
  
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Calcul du nombre de nuits
  const nights = useMemo(() => {
    if (!check_in_date || !check_out) return 0;
    const diff = new Date(check_out) - new Date(check_in_date);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [check_in_date, check_out]);

  // Loading state
  if (!roomDetails) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Chargement des détails de la chambre...
          </span>
        </div>
      </div>
    );
  }

  const { price, discount = 0, capacity = 1, type, size } = roomDetails;

  // Validation des données
  if (price === undefined || capacity === undefined) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-yellow-800 dark:text-yellow-400 text-lg mb-1">
              Champs manquants
            </p>
            <p className="text-yellow-700 dark:text-yellow-500">
              Les champs `price` ou `capacity` sont absents. Impossible de procéder à la réservation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const basePrice = price * nights;
  const discountAmount = Math.round((basePrice * discount) / 100);
  const totalPrice = basePrice - discountAmount;

  // Mutation de création de réservation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      const booking = await createBooking({
        roomId,
        check_in_date,
        check_out,
        guests,
      });
      return booking;
    },
    onSuccess: (data) => {
      const booking = data.booking || data;
      
      toast.success("🎉 Réservation créée avec succès !", {
        duration: 3000,
        icon: "✅",
      });
      
      navigate('/payment', {
        state: {
          booking,
          roomDetails: {
            id: roomId,
            type,
            size,
            price
          },
          reservationData: {
            check_in_date,
            check_out,
            guests,
            nights,
            totalPrice,
            basePrice,
            discountAmount,
            discount
          }
        }
      });
    },
    onError: (error) => {
      console.error("❌ Erreur réservation:", error);
      toast.error(error.message || "Impossible de créer la réservation.", {
        duration: 4000,
      });
      setError(error.message || "Erreur lors de la création de la réservation");
    },
  });

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Vérifier l'authentification
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // Validation des dates
    if (!check_in_date || !check_out) {
      setError("Veuillez sélectionner les dates d'arrivée et de départ.");
      toast.error("Dates manquantes");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(check_in_date) < today) {
      setError("La date d'arrivée ne peut pas être dans le passé.");
      toast.error("Date d'arrivée invalide");
      return;
    }

    if (new Date(check_in_date) >= new Date(check_out)) {
      setError("La date de départ doit être après la date d'arrivée.");
      toast.error("Dates invalides");
      return;
    }

    // Vérification de la capacité
    if (guests > capacity) {
      setError(`Cette chambre peut accueillir maximum ${capacity} personne(s).`);
      toast.error(`Maximum ${capacity} personne(s)`);
      return;
    }

    // Vérification de disponibilité
    setIsCheckingAvailability(true);
    try {
      const available = await checkRoomAvailability(roomId, check_in_date, check_out);
      
      if (!available) {
        setError("Cette chambre n'est pas disponible pour les dates sélectionnées.");
        toast.error("❌ Chambre non disponible");
        setIsCheckingAvailability(false);
        return;
      }

      toast.success("✅ Chambre disponible !");
      bookingMutation.mutate();

    } catch (err) {
      console.error("Erreur vérification disponibilité:", err);
      setError("Impossible de vérifier la disponibilité. Veuillez réessayer.");
      toast.error("Erreur de vérification");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <>
      {/* MODAL DE CONNEXION */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header du formulaire */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">
                Réserver maintenant
              </h3>
              <p className="text-white/90 text-sm">
                {type || "Type inconnu"} • {size || "?"}m² • Max {capacity || "?"} personne{capacity > 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* MESSAGE D'ERREUR */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 animate-shake">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-400 mb-1">Erreur</p>
                  <p className="text-sm text-red-700 dark:text-red-500">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* INFORMATION UTILISATEUR NON CONNECTÉ */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-400 mb-1">
                    Connexion requise
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-500">
                    Connectez-vous pour effectuer une réservation et profiter de nos services.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SÉLECTION DES DATES */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Dates du séjour
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Date d'arrivée
                  </label>
                  <input
                    type="date"
                    value={check_in_date}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={check_out}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                    min={check_in_date || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </div>

            {/* NOMBRE DE PERSONNES */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                Nombre de personnes
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={capacity}
                  value={guests}
                  onChange={(e) => setGuests(Math.min(parseInt(e.target.value) || 1, capacity))}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900 dark:text-white"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                  Max: {capacity}
                </div>
              </div>
            </div>

            {/* RÉCAPITULATIF DES PRIX */}
            {nights > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Récapitulatif
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    {showPriceBreakdown ? "Masquer" : "Voir"} détails
                  </button>
                </div>

                {showPriceBreakdown && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {price.toLocaleString()} FCFA × {nights} nuit{nights > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold">{basePrice.toLocaleString()} FCFA</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Réduction {discount}%
                        </span>
                        <span className="font-semibold">-{discountAmount.toLocaleString()} FCFA</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total à payer
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      FCFA
                    </div>
                  </div>
                </div>

                {/* Info supplémentaire */}
                <div className="mt-4 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Annulation gratuite jusqu'à 24h avant l'arrivée
                  </span>
                </div>
              </div>
            )}

            {/* BOUTON DE SOUMISSION */}
            <button
              type="submit"
              disabled={bookingMutation.isPending || isCheckingAvailability}
              className={`group w-full relative overflow-hidden rounded-xl py-4 px-6 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed ${
                isLoggedIn 
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white" 
                  : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isCheckingAvailability ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Vérification de la disponibilité...
                  </>
                ) : bookingMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Création de la réservation...
                  </>
                ) : isLoggedIn ? (
                  <>
                    <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Confirmer & Payer
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Se connecter pour réserver
                  </>
                )}
              </span>
              
              {/* Effet de brillance */}
              {isLoggedIn && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </form>

          {/* MESSAGE DE SUCCÈS */}
          {bookingMutation.isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 animate-slideIn">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-green-800 dark:text-green-400 text-lg mb-1">
                    Réservation créée avec succès ! 🎉
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Redirection vers le paiement...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Garanties */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Données protégées</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Confirmation rapide</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Service premium</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}