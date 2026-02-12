const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');  

// Stripe webhook doit recevoir le corps brut
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentController.handleWebhook);
// Nouvelle route pour Payment Intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment);

module.exports = router;