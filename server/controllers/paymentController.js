// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Booking } = require('../models'); // Ton modèle Sequelize Booking
const {Room} = require('../models');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Pour le webhook

const paymentController = {

  // 1️⃣ Créer PaymentIntent
  createPaymentIntent: async (req, res) => {
    try {
      const { total_price, bookingId, roomId, reservationData } = req.body;

      if (!total_price || !bookingId || !roomId) {
        return res.status(400).json({ error: 'Champs manquants : total_price, bookingId ou roomId' });
      }

      console.log('Création PaymentIntent:', { total_price, bookingId, roomId, reservationData });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total_price * 100), // FCFA → centimes
        currency: 'xaf',
        payment_method_types: ['card'],
        metadata: {
          bookingId: String(bookingId),
          roomId: String(roomId),
          checkIn: reservationData?.check_in_date || '',
          checkOut: reservationData?.check_out || '',
          guests: String(reservationData?.guests || 1),
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Erreur création PaymentIntent:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // 2️⃣ Confirmer paiement côté serveur
confirmPayment: async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({ error: 'paymentIntentId et bookingId sont requis' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // 🔥 Mise à jour réservation
      const [updated] = await Booking.update(
        { 
          status: 'paid',
          payment_status: 'paid'
        },
        { where: { id: bookingId } }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Réservation introuvable' });
      }

      // 🔹 Charger la réservation avec la chambre liée
      const booking = await Booking.findByPk(bookingId, {
        include: [{ model: Room, as: 'room' }]
      });

      res.json({
        success: true,
        message: 'Paiement confirmé',
        booking: {
          id: booking.id,
          status: booking.status,
          payment_status: booking.payment_status,
          total_amount: booking.total_price,
          check_in_date: booking.check_in_date,
          check_out: booking.check_out,
          guest_name: booking.guest_name,
          guest_email: booking.guest_email,
          room: booking.room ? {
            id: booking.room.id,
            type: booking.room.type,
            price: booking.room.price
          } : null
        }
      });
    } else {
      await Booking.update(
        { status: 'failed', payment_status: 'failed' },
        { where: { id: bookingId } }
      );

      res.status(400).json({
        success: false,
        message: 'Paiement non confirmé',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Erreur confirmation PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
},

  // 3️⃣ Webhook Stripe pour paiements asynchrones
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        await Booking.update(
          { status: 'paid', payment_status: 'paid' },
          { where: { id: bookingId } }
        );
        console.log(`Réservation ${bookingId} marquée comme payée via webhook`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        const bookingId = failedIntent.metadata.bookingId;

        await Booking.update(
          { status: 'failed', payment_status: 'failed' },
          { where: { id: bookingId } }
        );
        console.log(`Paiement échoué ❌ pour réservation ${bookingId}`);
        break;
      }

      default:
        console.log(`Événement Stripe ignoré: ${event.type}`);
    }

    res.json({ received: true });
  }

};

module.exports = paymentController;
