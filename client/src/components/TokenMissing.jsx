// src/components/TokenMissing.jsx

// This component displays a message when the user's authentication token is missing or expired.2
export default function TokenMissing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <img
        src="/images/token-missing.png"
        alt="Token non trouvé"
        className="w-64 h-auto mb-6"
      />
      <p className="text-center text-gray-600 text-lg">
        Votre session a expiré. Veuillez vous reconnecter.
      </p>
    </div>
  );
}
