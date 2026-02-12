import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, User, CreditCard, Printer, Download, ArrowLeft, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { getBookingDetails } from '../services/bookingService';

// Composant de skeleton pour le chargement
const BookingDetailsSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
    <div className="mt-8 flex gap-3">
      <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
    </div>
  </div>
);

export default function ConfirmationPage() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) {
      setError('Identifiant de réservation manquant');
      setLoading(false);
      return;
    }
    
    fetchBooking(bookingId);
  }, [bookingId]);

  const fetchBooking = async (id, isRetry = false) => {
    try {
      setLoading(true);
      if (!isRetry) {
        setError(null);
      }
      
      console.log('Fetching booking details for ID:', id);
      const details = await getBookingDetails(id);
      
      if (!details) {
        throw new Error('Aucune réservation trouvée avec cet identifiant');
      }
      
      console.log('Booking details received:', details);
      setBookingDetails(details);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      
      // Messages d'erreur plus spécifiques selon le type d'erreur
      let errorMessage = 'Une erreur inattendue s\'est produite';
      
      if (error.message.includes('404') || error.message.includes('not found')) {
        errorMessage = 'Réservation introuvable. Vérifiez votre numéro de confirmation.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Délai de connexion dépassé. Le serveur met du temps à répondre.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBooking(bookingId, true);
  };

  const copyConfirmationNumber = async () => {
    if (!bookingDetails?.id) return;
    
    try {
      await navigator.clipboard.writeText(bookingDetails.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = bookingDetails.id;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadReceipt = () => {
    if (!bookingDetails) return;
    
    try {
      const receiptContent = generateReceiptContent(bookingDetails);
      const element = document.createElement('a');
      const file = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `recu-reservation-${bookingDetails.id}.txt`;
      element.click();
      URL.revokeObjectURL(element.href);
    } catch (err) {
      console.error('Error downloading receipt:', err);
    }
  };

  const generateReceiptContent = (booking) => {
    const checkIn = new Date(booking.check_in_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const checkOut = new Date(booking.check_out_date || booking.check_out).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
REÇU DE RÉSERVATION
==================

Numéro de confirmation: ${booking.id}
Date de réservation: ${new Date().toLocaleDateString('fr-FR')}

INFORMATIONS CLIENT
------------------
Nom: ${booking.guest_name || 'Non spécifié'}
Email: ${booking.guest_email || 'Non spécifié'}
Téléphone: ${booking.guest_phone || 'Non spécifié'}

DÉTAILS DU SÉJOUR
----------------
Chambre: ${booking.Room?.room_number || 'Non spécifié'}
Type: ${booking.Room?.type || 'Non spécifié'}
Check-in: ${checkIn}
Check-out: ${checkOut}
Nombre de nuits: ${booking.nights || 'Non calculé'}

MONTANT
-------
Total payé: ${booking.total_price ? booking.total_price.toLocaleString('fr-FR') : 'Non spécifié'} FCFA

STATUS: ${booking.status === 'confirmed' ? 'CONFIRMÉ' : booking.status?.toUpperCase() || 'NON SPÉCIFIÉ'}

==================
Merci de votre confiance !
    `;
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const goHome = () => {
    navigate('/');
  };

  // État de chargement amélioré
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Animation de chargement avec icône */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <CheckCircle className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Vérification de votre réservation...</h1>
            <p className="text-gray-600">Nous récupérons les détails de votre séjour</p>
          </div>
          
          <BookingDetailsSkeleton />
        </div>
      </div>
    );
  }

  // État d'erreur amélioré
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Oups ! Un problème est survenu</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleRetry}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                {loading ? 'Tentative en cours...' : `Réessayer ${retryCount > 0 ? `(${retryCount + 1})` : ''}`}
              </button>
              
              <button 
                onClick={goHome}
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à l'accueil
              </button>
            </div>
            
            {retryCount > 2 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Problème persistant ?</strong><br />
                  Contactez notre support au +237 XXX XXX XXX avec votre numéro de réservation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec animation d'entrée */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Réservation Confirmée !
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Votre séjour est maintenant garanti
          </p>
          <p className="text-gray-500">
            Un email de confirmation a été envoyé à{' '}
            <span className="font-medium text-blue-600">{bookingDetails.guest_email}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Détails principaux */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte de confirmation */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Détails du séjour
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bookingDetails.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : bookingDetails.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {bookingDetails.status === 'confirmed' ? 'Confirmé' : 
                   bookingDetails.status === 'pending' ? 'En attente' :
                   bookingDetails.status || 'Statut inconnu'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-semibold text-gray-800">{bookingDetails.guest_name || 'Nom non spécifié'}</p>
                      {bookingDetails.guest_phone && (
                        <p className="text-sm text-gray-600">{bookingDetails.guest_phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Dates du séjour</p>
                      <p className="font-semibold text-gray-800">
                        {bookingDetails.check_in_date ? new Date(bookingDetails.check_in_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date d\'arrivée non spécifiée'}
                      </p>
                      <p className="text-sm text-gray-600">
                        au {(bookingDetails.check_out_date || bookingDetails.check_out) ? 
                          new Date(bookingDetails.check_out_date || bookingDetails.check_out).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Date de départ non spécifiée'}
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {bookingDetails.nights || calculateNights(bookingDetails.check_in_date, bookingDetails.check_out_date || bookingDetails.check_out)} nuit{((bookingDetails.nights || calculateNights(bookingDetails.check_in_date, bookingDetails.check_out_date || bookingDetails.check_out)) > 1) ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Chambre {bookingDetails.Room?.room_number || bookingDetails.room_number || "Non spécifiée"}
                    </h3>
                    <p className="text-blue-800 font-medium mb-3">
                      {bookingDetails.Room?.type || bookingDetails.room_type || "Type non spécifié"}
                    </p>
                    {(bookingDetails.Room?.amenities || bookingDetails.amenities) && (
                      <div className="space-y-1">
                        {(bookingDetails.Room?.amenities || bookingDetails.amenities)?.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Total payé</p>
                      <p className="text-2xl font-bold text-green-600">
                        {bookingDetails.total_price ? 
                          `${bookingDetails.total_price.toLocaleString('fr-FR')} FCFA` : 
                          'Montant non disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Numéro de confirmation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Numéro de confirmation</h3>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <code className="text-2xl font-mono font-bold text-blue-600 flex-1">
                  {bookingDetails.id}
                </code>
                <button
                  onClick={copyConfirmationNumber}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  title="Copier le numéro"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2 animate-fade-in">
                  ✓ Numéro copié dans le presse-papiers
                </p>
              )}
            </div>
          </div>

          {/* Sidebar avec actions */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Printer className="w-5 h-5" />
                  Imprimer le reçu
                </button>
                
                <button
                  onClick={downloadReceipt}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Télécharger PDF
                </button>

                <button
                  onClick={goHome}
                  className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour à l'accueil
                </button>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold mb-3 text-amber-800">À retenir</h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                  Check-in à partir de 14h00
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                  Check-out avant 12h00
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                  Présentez ce reçu à la réception
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                  Pièce d'identité obligatoire
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-600 mb-2">
            Des questions ? Contactez-nous au <span className="font-semibold">+237 XXX XXX XXX</span>
          </p>
          <p className="text-sm text-gray-500">
            Merci de nous avoir fait confiance pour votre séjour ! 🏨
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}