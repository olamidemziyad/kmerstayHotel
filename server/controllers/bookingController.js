// server/controllers/bookingController.js
const { Op } = require('sequelize');
const Booking = require('../models/booking');
const Room = require('../models/room');
const User = require('../models/user');

// ========================================
// 🧹 FONCTION DE NETTOYAGE AUTOMATIQUE
// ========================================
const cleanupExpiredBookings = async () => {
  try {
    const deleted = await Booking.destroy({
      where: {
        status: 'pending',
        expires_at: {
          [Op.lt]: new Date() // Expiré
        }
      }
    });
    
    if (deleted > 0) {
      console.log(`🧹 ${deleted} réservation(s) expirée(s) supprimée(s)`);
    }
  } catch (error) {
    console.error('❌ Erreur nettoyage réservations expirées:', error);
  }
};

// Lancer le nettoyage toutes les 5 minutes
setInterval(cleanupExpiredBookings, 5 * 60 * 1000);

// ========================================
// 📅 CRÉER UNE RÉSERVATION
// ========================================
exports.createBooking = async (req, res) => {
  try {
    // 🧹 Nettoyer les réservations expirées AVANT de créer
    await cleanupExpiredBookings();

    const { roomId, check_in_date, check_out, fullname} = req.body;
    const userId = req.user.id;

    // Validation des champs
    if (!roomId || !check_in_date || !check_out) {
      return res.status(400).json({ 
        error: 'Champs manquants : roomId, check_in_date, check_out' 
      });
    }

    // Vérifier que la chambre existe
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Chambre introuvable' });
    }

    // Vérifier la capacité
    if (fullname> room.capacity) {
      return res.status(400).json({ 
        error: `Maximum ${room.capacity} personne(s) pour cette chambre` 
      });
    }

    // Valider les dates
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ 
        error: 'La date d\'arrivée ne peut pas être dans le passé' 
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        error: 'La date de départ doit être après la date d\'arrivée' 
      });
    }

    // 🔍 VÉRIFICATION CRITIQUE : Disponibilité réelle
    const conflictingBookings = await Booking.count({
      where: {
        roomId,
        status: {
          [Op.in]: ['pending', 'confirmed', 'paid'] // ⚠️ Inclure 'pending' !
        },
        [Op.or]: [
          // Cas 1 : Nouvelle résa commence pendant une résa existante
          {
            check_in_date: { [Op.lte]: check_in_date },
            check_out: { [Op.gt]: check_in_date }
          },
          // Cas 2 : Nouvelle résa se termine pendant une résa existante
          {
            check_in_date: { [Op.lt]: check_out },
            check_out: { [Op.gte]: check_out }
          },
          // Cas 3 : Nouvelle résa englobe une résa existante
          {
            check_in_date: { [Op.gte]: check_in_date },
            check_out: { [Op.lte]: check_out }
          }
        ]
      }
    });

    if (conflictingBookings > 0) {
      return res.status(409).json({ 
        error: 'Cette chambre n\'est pas disponible pour ces dates' 
      });
    }

    // Récupérer les infos utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Calculer le prix
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const basePrice = room.price * nights;
    const discountAmount = Math.round((basePrice * (room.discount || 0)) / 100);
    const totalPrice = basePrice - discountAmount;

    // ⏰ CRÉER UNE RÉSERVATION TEMPORAIRE (expire dans 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const booking = await Booking.create({
      roomId,
      userId,
      guest_name: user.fullname,
      guest_email: user.email,
      check_in_date,
      check_out,
     guest_name: user.fullName || user.fullname || 'Inconnu',
      price_per_night: room.price,
      total_price: totalPrice,
      status: 'pending', // ⚠️ STATUT TEMPORAIRE
      payment_status: 'pending',
      expires_at: expiresAt // ⏰ Expire dans 15 min
    });

    res.status(201).json({
      message: 'Réservation créée (en attente de paiement)',
      booking: {
        id: booking.id,
        roomId: booking.roomId,
        check_in_date: booking.check_in_date,
        check_out: booking.check_out,
        guests: booking.guests,
        total_price: booking.total_price,
        status: booking.status,
        expires_at: booking.expires_at
      },
      room: {
        type: room.type,
        size: room.size,
        price: room.price
      }
    });

  } catch (error) {
    console.error('❌ Erreur création réservation:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la création de la réservation' 
    });
  }
};

// ========================================
// 💳 CONFIRMER LE PAIEMENT
// ========================================
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    // Vérifier que c'est le propriétaire
    if (booking.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Vérifier que la réservation n'a pas expiré
    if (booking.expires_at && new Date() > new Date(booking.expires_at)) {
      await booking.destroy();
      return res.status(410).json({ 
        error: 'Cette réservation a expiré et a été supprimée' 
      });
    }

    // ✅ CONFIRMER LA RÉSERVATION
    booking.status = 'confirmed';
    booking.payment_status = 'paid';
    booking.expires_at = null; // Plus besoin de l'expiration
    await booking.save();

    res.json({
      message: 'Paiement confirmé avec succès',
      booking
    });

  } catch (error) {
    console.error('❌ Erreur confirmation paiement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// 📋 RÉCUPÉRER LES RÉSERVATIONS DE L'UTILISATEUR
// ========================================
exports.getUserBookings = async (req, res) => {
  try {
    // 🧹 Nettoyer avant d'afficher
    await cleanupExpiredBookings();

    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { 
        userId,
        status: {
          [Op.ne]: 'cancelled' // Exclure les annulées
        }
      },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['type', 'size', 'price', 'image_url', 'room_number']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ bookings });

  } catch (error) {
    console.error('❌ Erreur récupération réservations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// 🔍 VÉRIFIER LA DISPONIBILITÉ (API)
// ========================================
exports.checkAvailability = async (req, res) => {
  try {
    // 🧹 Nettoyer les réservations expirées
    await cleanupExpiredBookings();

    const { roomId, check_in_date, check_out } = req.query;

    if (!roomId || !check_in_date || !check_out) {
      return res.status(400).json({ 
        error: 'Paramètres manquants : roomId, check_in_date, check_out' 
      });
    }

    const conflictingBookings = await Booking.count({
      where: {
        roomId,
        status: {
          [Op.in]: ['pending', 'confirmed', 'paid']
        },
        [Op.or]: [
          {
            check_in_date: { [Op.lte]: check_in_date },
            check_out: { [Op.gt]: check_in_date }
          },
          {
            check_in_date: { [Op.lt]: check_out },
            check_out: { [Op.gte]: check_out }
          },
          {
            check_in_date: { [Op.gte]: check_in_date },
            check_out: { [Op.lte]: check_out }
          }
        ]
      }
    });

    res.json({ 
      available: conflictingBookings === 0,
      message: conflictingBookings > 0 
        ? 'Chambre non disponible pour ces dates' 
        : 'Chambre disponible'
    });

  } catch (error) {
    console.error('❌ Erreur vérification disponibilité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// ❌ ANNULER UNE RÉSERVATION
// ========================================
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    // Vérifier l'autorisation
    if (booking.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Si la réservation est déjà payée, ne pas supprimer mais annuler
    if (booking.payment_status === 'paid') {
      booking.status = 'cancelled';
      await booking.save();
      return res.json({ 
        message: 'Réservation annulée',
        booking 
      });
    }

    // Si en attente, supprimer directement
    await booking.destroy();
    res.json({ message: 'Réservation supprimée avec succès' });

  } catch (error) {
    console.error('❌ Erreur annulation réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// 📊 AUTRES MÉTHODES (À ADAPTER SELON TES BESOINS)
// ========================================

exports.getAllBookings = async (req, res) => {
  // Admin seulement
  try {
    await cleanupExpiredBookings();
    const bookings = await Booking.findAll({
      include: [
        { model: Room, as: 'room', attributes: ['type', 'size'] },
        { model: User, as: 'user', attributes: ['fullname', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Room, as : 'room',  attributes: ['id', 'room_number', 'type', 'price', 'size']},
        { model: User, as: 'user' ,attributes: ['fullname', 'email'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    await booking.update(req.body);
    res.json({ message: 'Réservation mise à jour', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    await booking.destroy();
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    booking.payment_status = payment_status;
    if (payment_status === 'paid') {
      booking.status = 'confirmed';
      booking.expires_at = null;
    }
    await booking.save();

    res.json({ message: 'Statut de paiement mis à jour', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.payBooking = async (req, res) => {
  // Alias de confirmPayment
  return exports.confirmPayment(req, res);
};

exports.listReservations = async (req, res) => {
  // Selon le rôle
  if (req.user.role === 'admin') {
    return exports.getAllBookings(req, res);
  } else {
    return exports.getUserBookings(req, res);
  }
};

exports.cancelReservation = async (req, res) => {
  return exports.cancelBooking(req, res);
};

exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const revenue = await Booking.sum('total_price', { where: { payment_status: 'paid' } });

    res.json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      revenue: revenue || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};