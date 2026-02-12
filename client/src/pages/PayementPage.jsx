import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, CreditCard, Calendar, Users, Loader2, CheckCircle, AlertCircle, Shield, Lock, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmPayment } from '../services/bookingService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Formulaire de paiement intégré
function PaymentFormInternal({ bookingId, totalAmount, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error('Stripe non initialisé');
      return;
    }

    setProcessing(true);

    try {
      const card = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        }
      });

      if (error) {
        console.error('❌ Erreur paiement Stripe:', error);
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        try {
          console.log('✅ Paiement Stripe réussi, confirmation de la réservation...');
          
          const result = await confirmPayment(bookingId);
          
          console.log('✅ Réservation confirmée:', result);
          toast.success('🎉 Paiement réussi et réservation confirmée !');

          navigate(`/booking-confirmation/${bookingId}`, { 
            state: { 
              booking: result.booking,
              amount: totalAmount,
              paymentIntentId: paymentIntent.id
            } 
          });

        } catch (confirmError) {
          console.error('❌ Erreur confirmation réservation:', confirmError);
          toast.error(
            '⚠️ Le paiement a réussi mais la confirmation a échoué. Contactez le support avec la référence : ' + 
            paymentIntent.id
          );
          
          navigate('/payment-error', {
            state: {
              paymentIntentId: paymentIntent.id,
              bookingId: bookingId,
              error: confirmError.message
            }
          });
        }
      }

    } catch (err) {
      console.error('❌ Erreur générale paiement:', err);
      toast.error('Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1e293b',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#94a3b8',
        },
        iconColor: '#3b82f6',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          Informations de carte bancaire
        </label>
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-white/30 transition-all duration-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20">
          <CardElement options={cardElementOptions} />
        </div>
        <div className="mt-3 p-3 bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-lg">
          <p className="text-xs text-blue-200 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>Carte de test : <span className="font-mono font-semibold">4242 4242 4242 4242</span> (toute date future, tout CVC)</span>
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-200">Montant total</span>
          <span className="text-3xl font-bold text-white">
            {totalAmount.toLocaleString()} <span className="text-lg text-blue-200">FCFA</span>
          </span>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            <span>Traitement en cours...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            <span>Payer {totalAmount.toLocaleString()} FCFA</span>
          </>
        )}
      </button>
    </form>
  );
}

// Composant principal
export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes

  const stateData = location.state || {};
  const { booking, roomDetails, reservationData } = stateData;

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log('=== DEBUG PAYMENT PAGE ===');
    console.log('État de navigation:', stateData);
    console.log('booking:', booking);
    console.log('roomDetails:', roomDetails);
    console.log('reservationData:', reservationData);
  }, [stateData, booking, roomDetails, reservationData]);

  useEffect(() => {
    if (!booking || !roomDetails || !reservationData) {
      setError('Données de réservation manquantes');
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const bookingId = booking?.id || booking?.data?.id || booking;
        const roomId = roomDetails?.id || roomDetails;
        const totalPrice = reservationData?.totalPrice || 0;

        if (!bookingId || !roomId || !totalPrice) {
          throw new Error('Données critiques manquantes pour le paiement');
        }

        const payload = {
          total_price: totalPrice,
          bookingId: bookingId,
          roomId: roomId,
          reservationData: reservationData
        };

        console.log('📤 Payload envoyé au backend:', payload);

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/payments/create-payment-intent', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 Réponse Payment Intent:', data);

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('Client secret non reçu');
        }
      } catch (err) {
        console.error('❌ Erreur Payment Intent:', err);
        setError(err.message);
        toast.error("Erreur d'initialisation du paiement");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [booking, roomDetails, reservationData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <p className="text-white text-lg font-medium">Initialisation du paiement sécurisé...</p>
          <p className="text-blue-300 text-sm mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Erreur de paiement</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !roomDetails || !reservationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Réservation introuvable</h2>
          <p className="text-blue-200 mb-6">Les données de réservation sont manquantes</p>
          <button
            onClick={() => navigate('/rooms')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Retour aux chambres
          </button>
        </div>
      </div>
    );
  }

  const bookingId = booking?.id || booking?.data?.id || booking;
  const totalPrice = reservationData?.totalPrice || 0;
  const basePrice = reservationData?.basePrice || 0;
  const discountAmount = reservationData?.discountAmount || 0;
  const discount = reservationData?.discount || 0;
  const nights = reservationData?.nights || 1;
  const guests = reservationData?.guests || 1;
  const checkInDate = reservationData?.check_in_date || '';
  const checkOutDate = reservationData?.check_out_date || reservationData?.check_out || '';
  const roomPrice = roomDetails?.price || 0;
  const roomType = roomDetails?.type || 'Chambre';
  const roomSize = roomDetails?.size || 0;
  const roomId = roomDetails?.id || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background reservation  */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Paiement Sécurisé</h1>
            <div className="w-24"></div>
          </div>

          {/* Timer Alert */}
          <div className="mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-300" />
                </div>
                <div>
                  <p className="text-white font-semibold">Réservation temporaire</p>
                  <p className="text-orange-200 text-sm">Complétez le paiement rapidement</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <p className="text-2xl font-bold text-white font-mono">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Résumé de la réservation */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                Résumé de réservation
              </h2>
              
              <div className="space-y-6">
                
                {/* Chambre */}
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{roomType}</h3>
                      <p className="text-blue-200 text-sm">
                        {roomSize > 0 && `${roomSize}m² • `}Chambre #{roomId}
                      </p>
                    </div>
                    <div className="bg-purple-500/20 px-3 py-1 rounded-full">
                      <span className="text-purple-200 text-xs font-semibold">Premium</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-300" />
                    </div>
                    <h4 className="text-white font-semibold">Dates de séjour</h4>
                  </div>
                  
                  <div className="space-y-3 ml-13">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Arrivée</span>
                      <span className="text-white font-semibold">
                        {checkInDate ? new Date(checkInDate).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Départ</span>
                      <span className="text-white font-semibold">
                        {checkOutDate ? new Date(checkOutDate).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <span className="text-blue-300 font-medium">{nights} nuit{nights > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Invités */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-300" />
                      </div>
                      <span className="text-white font-semibold">Invités</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{guests}</span>
                  </div>
                </div>

                {/* Prix */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold text-white mb-4">Détail des tarifs</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">
                        {roomPrice.toLocaleString()} FCFA × {nights} nuit{nights > 1 ? 's' : ''}
                      </span>
                      <span className="text-white font-medium">
                        {basePrice.toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-300">
                          Réduction ({discount}%)
                        </span>
                        <span className="text-green-300 font-medium">
                          -{discountAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                    
                    <div className="h-px bg-white/20 my-3"></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-white">
                        {totalPrice.toLocaleString()} <span className="text-base text-blue-200">FCFA</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de paiement */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                Paiement
              </h2>
              
              {!clientSecret ? (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <p className="text-white font-medium">Chargement du formulaire sécurisé...</p>
                </div>
              ) : (
                <Elements 
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#3b82f6',
                        colorBackground: '#1e293b',
                        colorText: '#f1f5f9',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '12px',
                      }
                    }
                  }} 
                  stripe={stripePromise}
                >
                  <PaymentFormInternal
                    bookingId={bookingId}
                    totalAmount={totalPrice}
                    clientSecret={clientSecret}
                  />
                </Elements>
              )}

              {/* Sécurité */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 bg-green-500/10 backdrop-blur-sm border border-green-400/20 p-4 rounded-xl">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Paiement 100% sécurisé</p>
                    <p className="text-xs text-green-200 mt-1">
                      Cryptage SSL et traitement par Stripe
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 p-4 rounded-xl">
                  <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">Données protégées</p>
                    <p className="text-xs text-blue-200 mt-1">
                      Vos informations bancaires ne sont jamais stockées
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}