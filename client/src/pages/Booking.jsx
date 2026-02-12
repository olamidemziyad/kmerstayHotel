import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoomById } from "../services/roomService";
import RoomBookingForm from "../components/RoomBookingForm";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setError(new Error("Aucun ID de chambre fourni dans l'URL."));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleBookingSuccess = () => {
    navigate("/reservations", { state: { bookingSuccess: true } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
          <p className="mt-2 text-red-700">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 className="text-lg font-medium text-yellow-800">
            Chambre introuvable ou données manquantes
          </h3>
          <p className="mt-2 text-yellow-700">
            Impossible d'afficher les détails de la chambre. Vérifie l'ID ou réessaye plus tard.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour à la page précédente
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Réserver la chambre</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Détails de la chambre</h2>

        <div className="mb-6">
          <p className="font-medium">
            Chambre {room.room_number || "?"}
          </p>
          <p className="text-gray-600">
            {room.type || "Type inconnu"} • {room.size || "?"}m² • Max {room.capacity || "?"} personnes
          </p>
          <p className="text-gray-600">
            Prix :{" "}
            {room.price !== undefined
              ? `${room.price.toLocaleString()} FCFA`
              : "Non défini"}
          </p>
        </div>

        <RoomBookingForm
          roomId={roomId}
          roomDetails={room}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
}
