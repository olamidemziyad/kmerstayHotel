import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import { Loader2, CalendarDays, XCircle, CheckCircle, Clock, Users, MapPin, AlertCircle, Sparkles, Calendar } from "lucide-react";
import { useState } from "react";

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
  });
  console.log("🧠 Toutes les réservations :", data);

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings"]);
      setCancellingId(null);
    },
    onError: () => {
      setCancellingId(null);
    }
  });

  const handleCancel = (bookingId) => {
    setCancellingId(bookingId);
    cancelMutation.mutate(bookingId);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <p className="text-white text-lg font-medium">Chargement de vos réservations...</p>
          <p className="text-blue-300 text-sm mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="max-w-md w-full bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Erreur de chargement</h3>
          <p className="text-red-300 text-sm">
            Une erreur est survenue lors du chargement de vos réservations.
          </p>
          <button
            onClick={() => queryClient.invalidateQueries(["myBookings"])}
            className="mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Aucune réservation</h3>
          <p className="text-blue-200 mb-6">
            Vous n'avez encore effectué aucune réservation.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-300 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Explorez nos chambres disponibles</span>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data.length}</p>
              <p className="text-blue-200 text-sm">Réservation{data.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {data.filter(b => b.status === 'confirmed').length}
              </p>
              <p className="text-green-200 text-sm">Confirmée{data.filter(b => b.status === 'confirmed').length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {data.filter(b => new Date(b.check_out) >= new Date()).length}
              </p>
              <p className="text-purple-200 text-sm">À venir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {data.map((booking) => {
          const room = booking.room;
          const now = new Date();
          const checkOut = new Date(booking.check_out);
          const checkIn = new Date(booking.check_in_date);
          const expired = checkOut < now;
          const isUpcoming = checkIn > now;
          const isCurrent = checkIn <= now && checkOut >= now;
          const canCancel = booking.status === "confirmed" && !expired;
          const isCancelling = cancellingId === booking.id;

          console.log("📦 Booking :", booking);
          console.log("🏠 Room associée :", booking.room);
          return (
            <div
              key={booking.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  {/* Room Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Chambre {room?. room_number}
                        </h3>
                        <p className="text-blue-200 text-sm">
                          {room?.type }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm ${
                        booking.status === "confirmed"
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : booking.status === "cancelled"
                          ? "bg-red-500/20 text-red-300 border border-red-400/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                      }`}
                    >
                      {booking.status === "confirmed" && <CheckCircle className="w-3.5 h-3.5" />}
                      {booking.status === "cancelled" && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status === "confirmed" ? "Confirmée" : booking.status === "cancelled" ? "Annulée" : booking.status}
                    </span>

                    {/* Time Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm ${
                        expired
                          ? "bg-gray-500/20 text-gray-300 border border-gray-400/30"
                          : isCurrent
                          ? "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {expired ? "Terminée" : isCurrent ? "En cours" : "À venir"}
                    </span>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Dates */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-5 h-5 text-blue-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-200 text-xs font-medium mb-2">Dates de séjour</p>
                        <p className="text-white text-sm font-semibold">
                          {checkIn.toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-blue-300 text-xs my-1">→</p>
                        <p className="text-white text-sm font-semibold">
                          {checkOut.toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-purple-200 text-xs font-medium mb-2">Invités</p>
                        <p className="text-white text-2xl font-bold">{booking.guests}</p>
                        <p className="text-purple-300 text-xs">personne{booking.guests > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 mb-4">
                  <p className="text-blue-200 text-xs">
                    Référence : <span className="text-white font-mono font-semibold">#{booking.id}</span>
                  </p>
                </div>

                {/* Cancel Button type */}
                {canCancel && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={isCancelling}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-red-300 bg-red-500/10 border border-red-400/30 rounded-xl hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Annulation en cours...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Annuler la réservation</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Decorative Bottom Border */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}