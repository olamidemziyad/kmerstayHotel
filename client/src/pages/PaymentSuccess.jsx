import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const session_id = query.get("session_id");

    if (!session_id) {
      toast.error("Session invalide !");
      setPaymentStatus("error");
      setLoading(false);
      return;
    }

    // Vérification du paiement côté backend
  const verifyPayment = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/payments/verify`, // ← ton backend fixe
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
      }
    );

    const data = await res.json();

    if (res.ok && data.status === "paid") {
      setPaymentStatus("success");
    } else {
      setPaymentStatus("error");
    }
  } catch (err) {
    console.error(err);
    setPaymentStatus("error");
  } finally {
    setLoading(false);
  }
};


    verifyPayment();
  }, [location.search]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Vérification du paiement...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
      {paymentStatus === "success" ? (
        <>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
          <p className="text-gray-700 mb-4">
            Votre réservation a été confirmée. Merci pour votre confiance !
          </p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voir mes réservations
          </button>
        </>
      ) : (
        <>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paiement échoué</h2>
          <p className="text-gray-700 mb-4">
            Une erreur est survenue lors du paiement. Veuillez réessayer.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retour
          </button>
        </>
      )}
    </div>
  );
}
