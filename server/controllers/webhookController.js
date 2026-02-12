// controllers/webhookController.js
const Stripe = require("stripe");
const { Booking } = require("../models");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // ⚠️ Utiliser req.rawBody (middleware spécial) et pas req.body
    event = stripe.webhooks.constructEvent(
      req.rawBody, // on a besoin du body brut pour valider la signature
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Erreur de validation du webhook Stripe :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      await Booking.update(
        { status: "paid" },
        { where: { id: bookingId } }
      );

      console.log(`✅ Paiement confirmé pour la réservation ${bookingId}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("⚠️ Erreur lors du traitement du webhook :", err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { stripeWebhook };
