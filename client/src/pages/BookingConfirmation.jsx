// components/BookingConfirmation.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Home, Calendar, Users, CreditCard, Download, Mail, Clock, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const { booking, amount } = location.state || {};
  
  const guests = booking?.guests || 1;
  const nights = booking?.nights || 1;
  const checkIn = booking?.check_in_date
    ? new Date(booking.check_in_date).toLocaleDateString("fr-FR")
    : "N/A";
  const checkOut = booking?.check_out
    ? new Date(booking.check_out).toLocaleDateString("fr-FR")
    : "N/A";
  const roomType = booking?.room?.type || "Chambre";
  const roomId = booking?.room?.id || booking?.roomId || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements  */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className={`max-w-4xl w-full transition-all duration-1000 transform ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Success Animation Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Réservation Confirmée !
            </h1>
            <p className="text-lg text-blue-200">
              Votre séjour est confirmé. Préparez-vous pour une expérience inoubliable 🎉
            </p>
          </div>

          {/* Main Card with Glassmorphism */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Booking ID Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Numéro de réservation</p>
                  <p className="text-3xl font-bold text-white tracking-wider">#{id}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Envoyer</span>
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Room Info Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{roomType}</h3>
                    <p className="text-blue-200 text-sm">Chambre #{roomId}</p>
                  </div>
                  <div className="bg-blue-500/20 px-4 py-2 rounded-full">
                    <span className="text-blue-200 text-sm font-semibold">Premium</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                
                {/* Check-in/out Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-300" />
                    </div>
                    <h4 className="text-white font-semibold text-lg">Dates de séjour</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Arrivée</span>
                      <span className="text-white font-semibold">{checkIn}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Départ</span>
                      <span className="text-white font-semibold">{checkOut}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <span className="text-blue-300 font-medium">{nights} nuit{nights > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Guests Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-purple-300" />
                    </div>
                    <h4 className="text-white font-semibold text-lg">Invités</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Nombre de personnes</span>
                    <span className="text-3xl font-bold text-white">{guests}</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500/20 p-4 rounded-xl">
                      <CreditCard className="w-7 h-7 text-green-300" />
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Montant total payé</p>
                      <p className="text-4xl font-bold text-white">
                        {amount?.toLocaleString()} <span className="text-2xl text-blue-200">FCFA</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                    <span className="text-green-200 font-semibold text-sm">✓ Paiement réussi</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-blue-200 text-xs">Check-in</p>
                    <p className="text-white text-sm font-semibold">14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-blue-200 text-xs">Check-out</p>
                    <p className="text-white text-sm font-semibold">12:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                  <Phone className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-blue-200 text-xs">Support</p>
                    <p className="text-white text-sm font-semibold">24/7</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  Retour à l'accueil
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 transition-all duration-300 hover:border-white/40"
                >
                  <Download className="w-5 h-5" />
                  Télécharger le reçu
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-blue-200 text-sm">
              Un email de confirmation a été envoyé à votre adresse
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Pour toute question, contactez notre service client 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}