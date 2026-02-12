import { useState, useEffect } from 'react';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Récupérer le token depuis l'URL au chargement de la page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
      validateToken(resetToken);
    } else {
      setTokenValid(false);
      setMessage('Token de réinitialisation manquant dans l\'URL.');
    }
  }, []);

  // Valider le token (optionnel - vous pouvez valider côté serveur seulement)
  const validateToken = async (resetToken) => {
    try {
      const response = await fetch('/api/users/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetToken }),
      });

      if (response.ok) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        const errorData = await response.json();
        setMessage(errorData.message || 'Token invalide ou expiré.');
      }
    } catch (error) {
      // Si la validation échoue, on laisse quand même l'utilisateur essayer
      // La validation définitive se fera lors de la soumission
      setTokenValid(true);
      console.log('Validation du token échouée, mais on continue:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setMessage('Le nouveau mot de passe est requis.');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Votre mot de passe a été réinitialisé avec succès !');
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(errorData.message || 'Erreur lors de la réinitialisation.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleBackToLogin = () => {
    // Navigation vers la page de connexion
    console.log('Navigate to login page');
    // window.location.href = '/login';
  };

  // Si le token n'est pas valide
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lien invalide
          </h1>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-gray-600">
            Saisissez votre nouveau mot de passe
          </p>
        </div>

        {status === 'success' ? (
          /* Success State */
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Mot de passe réinitialisé !
              </h2>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Aller à la connexion
            </button>
          </div>
        ) : (
          /* Form State */
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={formData.newPassword.length >= 6 ? 'text-green-600' : ''}>
                  Au moins 6 caractères
                </li>
                <li className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}>
                  Les deux mots de passe doivent être identiques
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading' || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Réinitialisation...
                </div>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Besoin d'aide ? Contactez notre{' '}
            <a href="#" className="text-blue-600 hover:underline">
              support client
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;