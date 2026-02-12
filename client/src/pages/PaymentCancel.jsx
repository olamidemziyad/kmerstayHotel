import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Paiement annulé</h2>
      <p className="text-gray-700 mb-4">
        Vous avez annulé le paiement. Votre réservation n’a pas été confirmée.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Retour
      </button>
    </div>
  );
}
