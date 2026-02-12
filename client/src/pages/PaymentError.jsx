import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, Mail, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PaymentError() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Récupérer les données de l'erreur
  const { paymentIntentId, bookingId, error } = location.state || {};

  // Fonction pour copier la référence
  const copyReference = () => {
    if (paymentIntentId) {
      navigator.clipboard.writeText(paymentIntentId);
      setCopied(true);
      toast.success('Référence copiée !');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header avec icône */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Paiement effectué
            </h1>
            <p className="text-orange-100 text-lg">
              Mais la confirmation a échoué
            </p>
          </div>

          {/* Contenu */}
          <div className="px-8 py-8 space-y-6">
            {/* Message d'explication */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Bonne nouvelle : Votre paiement a été traité avec succès
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Cependant, une erreur technique a empêché la confirmation automatique de votre réservation.
                  </p>
                </div>
              </div>
            </div>

            {/* Détails de l'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs font-medium text-red-800 mb-1">Détails de l'erreur :</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {/* Informations importantes */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  📌 Ce qu'il faut savoir :
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span>Votre paiement a bien été débité</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span>Votre argent est sécurisé avec Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-0.5">!</span>
                    <span>Votre réservation nécessite une confirmation manuelle</span>
                  </li>
                </ul>
              </div>

              {/* Référence de paiement */}
              {paymentIntentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Référence de paiement Stripe :
                  </p>
                  <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                    <code className="text-xs text-gray-800 font-mono truncate flex-1">
                      {paymentIntentId}
                    </code>
                    <button
                      onClick={copyReference}
                      className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copier la référence"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ID de réservation */}
              {bookingId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Numéro de réservation :
                  </p>
                  <div className="bg-white border border-gray-300 rounded px-3 py-2">
                    <code className="text-xs text-gray-800 font-mono">
                      {bookingId}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Que faire maintenant ?
              </h3>
              <ol className="space-y-2 text-sm text-yellow-800 list-decimal list-inside">
                <li>Conservez cette page ou prenez une capture d'écran</li>
                <li>Notez la référence de paiement ci-dessus</li>
                <li>Contactez notre support avec ces informations</li>
                <li>Nous confirmerons votre réservation manuellement sous 24h</li>
              </ol>
            </div>

            {/* Contact support */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">
                Support client
              </p>
              <a 
                href="mailto:support@kmerstay.com?subject=Erreur confirmation réservation&body=Référence: ${paymentIntentId}"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-1" />
                support@kmerstay.com
              </a>
              <p className="text-xs text-gray-500 mt-1">
                ou appelez le +237 6XX XX XX XX
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </button>
              
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Mes réservations
              </button>
            </div>
          </div>
        </div>

        {/* Note en bas */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Cette situation est exceptionnelle. Nous nous excusons pour le désagrément.
          </p>
        </div>
      </div>
    </div>
  );
}