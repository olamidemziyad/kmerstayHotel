// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { 
  authenticateToken, 
  authorizeSelfOrAdmin, 
  requireAdmin, 
  authorizeBookingAccess 
} = require('../middlewares/authenticate');

// --------------------
// Routes spécifiques (DOIVENT ÊTRE EN PREMIER)
// --------------------
// --------------------
// Routes spécifiques
// --------------------
router.get('/statistics', authenticateToken, requireAdmin, bookingController.getBookingStats);
router.get('/check-availability', bookingController.checkAvailability);
router.get('/me', authenticateToken, bookingController.getUserBookings);

// --------------------
// Routes admin
// --------------------
router.get('/', authenticateToken, requireAdmin, bookingController.getAllBookings);
router.patch('/reservations/:id/cancel', authenticateToken, requireAdmin, bookingController.cancelReservation);

// --------------------
// Routes utilisateur
// --------------------
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/:id', authenticateToken, authorizeBookingAccess, bookingController.getBookingDetails);
router.put('/:id', authenticateToken, authorizeSelfOrAdmin, bookingController.updateBooking);
router.patch('/:id/payment-status', authenticateToken, requireAdmin, bookingController.updatePaymentStatus);
router.patch('/:id/pay', authenticateToken, authorizeSelfOrAdmin, bookingController.payBooking);
router.patch('/:id/confirm-payment', authenticateToken,  bookingController.confirmPayment);
router.patch('/:id/cancel', authenticateToken, authorizeSelfOrAdmin, bookingController.cancelBooking);
router.delete('/:id', authenticateToken, authorizeSelfOrAdmin, bookingController.deleteBooking);  


module.exports = router;