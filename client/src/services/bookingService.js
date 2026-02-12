// client/src/services/bookingService.js
import apiClient from "./axiosApi";

// ========================================
// 📅 CRÉER UNE RÉSERVATION (TEMPORAIRE - expire en 15 min)
// ========================================
export const createBooking = async (data) => {
  const res = await apiClient.post("/bookings", data);
  return res.data;
};

// ========================================
// 💳 CONFIRMER LE PAIEMENT (après succès Stripe)
// ========================================
export const confirmPayment = async (bookingId) => {
  try {
    const res = await apiClient.patch(`/bookings/${bookingId}/confirm-payment`);
    return res.data;
  } catch (error) {
    console.error('❌ Erreur confirmation paiement:', error.response?.data || error);
    throw new Error(error.response?.data?.error || 'Erreur lors de la confirmation du paiement');
  }
};

// ========================================
// 🔍 VÉRIFIER LA DISPONIBILITÉ D'UNE CHAMBRE
// ========================================
export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const res = await apiClient.get('/bookings/check-availability', {
      params: {
        roomId,
        check_in_date: checkIn,
        check_out: checkOut
      }
    });
    return res.data.available; // true ou false
  } catch (error) {
    console.error('❌ Erreur vérification disponibilité:', error);
    throw new Error('Erreur lors de la vérification de disponibilité');
  }
};

// ========================================
// 📋 RÉCUPÉRER LES RÉSERVATIONS DE L'UTILISATEUR CONNECTÉ
// ========================================
export const getMyBookings = async () => {
  const res = await apiClient.get("/bookings/me");
  return res.data.bookings || res.data.data; // Adapter selon la structure
};

// ========================================
// 📊 RÉCUPÉRER TOUTES LES RÉSERVATIONS (ADMIN)
// ========================================
export const getAllBookings = async () => {
  const res = await apiClient.get("/bookings");
  return res.data.bookings || res.data.data;
};

// ========================================
// 🔍 RÉCUPÉRER UNE RÉSERVATION PAR ID
// ========================================
export const getBookingDetails = async (bookingId) => {
  if (!bookingId || bookingId === "undefined") {
    throw new Error("ID de réservation manquant");
  }
  const res = await apiClient.get(`/bookings/${bookingId}`);
  return res.data;
};

// ========================================
// ✏️ METTRE À JOUR UNE RÉSERVATION
// ========================================
export const updateBooking = async (bookingId, data) => {
  const res = await apiClient.put(`/bookings/${bookingId}`, data);
  return res.data;
};

// ========================================
// 💳 PAYER UNE RÉSERVATION (alternative à confirmPayment)
// ========================================
export const payBooking = async (bookingId) => {
  const res = await apiClient.patch(`/bookings/${bookingId}/pay`);
  return res.data;
};

// ========================================
// ❌ ANNULER UNE RÉSERVATION
// ========================================
export const cancelBooking = async (bookingId) => {
  const res = await apiClient.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

// ========================================
// 🗑️ SUPPRIMER UNE RÉSERVATION
// ========================================
export const deleteBooking = async (bookingId) => {
  const res = await apiClient.delete(`/bookings/${bookingId}`);
  return res.data;
};

// ========================================
// 📊 RÉCUPÉRER LES STATISTIQUES DE RÉSERVATION (ADMIN)
// ========================================
export const getBookingStats = async () => {
  try {
    const res = await apiClient.get("/bookings/statistics");
    return res.data;
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    // Fallback : calculer depuis toutes les réservations
    try {
      const allBookings = await getAllBookings();
      if (allBookings && Array.isArray(allBookings)) {
        const total = allBookings.length;
        const paid = allBookings.filter(booking => booking.payment_status === 'paid').length;
        const pending = allBookings.filter(booking => booking.status === 'pending').length;
        const confirmed = allBookings.filter(booking => booking.status === 'confirmed').length;
        const revenue = allBookings
          .filter(booking => booking.payment_status === 'paid')
          .reduce((sum, booking) => sum + (booking.total_price || 0), 0);
        
        return { 
          totalBookings: total, 
          confirmedBookings: confirmed,
          pendingBookings: pending,
          revenue
        };
      }
      return { totalBookings: 0, confirmedBookings: 0, pendingBookings: 0, revenue: 0 };
    } catch (fallbackError) {
      console.error('Erreur fallback stats:', fallbackError);
      return { totalBookings: 0, confirmedBookings: 0, pendingBookings: 0, revenue: 0 };
    }
  }
};

// ========================================
// 📋 LISTER LES RÉSERVATIONS (UTILISATEUR OU ADMIN)
// ========================================
export const listReservations = async () => {
  const res = await apiClient.get("/bookings/reservations");
  return res.data.bookings || res.data.data;
};

// ========================================
// ❌ ANNULER VIA LA ROUTE SPÉCIFIQUE `/reservations/:id/cancel`
// ========================================
export const cancelReservation = async (id) => {
  const res = await apiClient.patch(`/bookings/reservations/${id}/cancel`);
  return res.data;
};

// Export par défaut
export default {
  createBooking,
  confirmPayment,
  checkRoomAvailability,
  getMyBookings,
  getAllBookings,
  getBookingDetails,
  updateBooking,
  payBooking,
  cancelBooking,
  deleteBooking,
  getBookingStats,
  listReservations,
  cancelReservation
};