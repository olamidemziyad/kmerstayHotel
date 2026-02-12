import { X, User, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;


  const handleLoginRedirect = () => {
    onClose();
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    onClose();
    navigate('/signup');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 text-sm">
              Vous devez être connecté pour effectuer une réservation
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* Bouton Connexion */}
            <button
              onClick={handleLoginRedirect}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
            >
              <Lock className="w-4 h-4 mr-2" />
              Se connecter
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Bouton Inscription */}
            <button
              onClick={handleSignupRedirect}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors group"
            >
              <User className="w-4 h-4 mr-2" />
              Créer un compte
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Footer message */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              Après connexion, vous pourrez reprendre votre réservation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}