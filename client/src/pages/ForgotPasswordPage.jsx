import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(false);
  const Navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('🔄 handleSubmit appelé avec email:', email);
    
    if (!email) {
      console.log('❌ Email vide');
      setStatus('error');
      setMessage('Veuillez entrer votre adresse email.');
      return;
    }

    if (!isValidEmail(email)) {
      console.log('❌ Email invalide');
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    console.log('📤 Envoi de l\'email...');
    setStatus('loading');
    
    try {
      console.log('📡 Appel API en cours...');
      const response = await forgotPasswordAPI(email);
      console.log('✅ Réponse API reçue:', response);
      setStatus('success');
      setMessage('Un email de réinitialisation a été envoyé à votre adresse.');
      
      if (response.devInfo) {
        console.log('🔗 Preview URL:', response.devInfo.previewUrl);
        console.log('🔑 Reset URL:', response.devInfo.resetURL);
      }
    } catch (error) {
      console.log('❌ Erreur API:', error);
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const forgotPasswordAPI = async (email) => {
    const response = await fetch('http://localhost:3000/api/users/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi de l\'email');
    }

    return await response.json();
  };

  const handleBackToLogin = () => {
    Navigate('/login');
    console.log('Navigate to login page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-purple-400/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl shadow-blue-500/50">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-blue-200 text-lg">
              Pas de souci, on s'en occupe
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 hover:border-blue-500/30 transition-all duration-500">
            
            {status === 'success' ? (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-3xl opacity-20"></div>
                  <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Email envoyé avec succès !
                  </h2>
                  <p className="text-blue-200 mb-4">
                    {message}
                  </p>
                  <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Le lien expire dans 1 heure
                    </p>
                  </div>
                  <p className="text-sm text-blue-300/70">
                    Vérifiez votre boîte de réception (et vos spams) et suivez les instructions.
                  </p>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <ArrowLeft className="relative w-5 h-5" />
                  <span className="relative">Retour à la connexion</span>
                </button>
              </div>
            ) : (
              /* Form State */
              <div className="space-y-6">
                {/* Info Box */}
                <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-300 mb-1">
                        Processus sécurisé
                      </p>
                      <p className="text-xs text-blue-200/80">
                        Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-semibold text-white flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField(true)}
                      onBlur={() => setFocusedField(false)}
                      placeholder="votre@email.com"
                      className={`w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border ${
                        focusedField 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-white/10'
                      } rounded-xl text-white placeholder-blue-300/50 focus:outline-none transition-all duration-300`}
                      disabled={status === 'loading'}
                    />
                    {email && isValidEmail(email) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="bg-green-500/20 p-1 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                    )}
                    {focusedField && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
                    <div className="bg-red-500/20 p-2 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-red-300 font-semibold text-sm">Erreur</p>
                      <p className="text-red-200/80 text-xs mt-1">{message}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                  className="relative w-full overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  {status === 'loading' ? (
                    <>
                      <div className="relative w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="relative">Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="relative w-5 h-5" />
                      <span className="relative">Envoyer le lien</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900/80 backdrop-blur-sm text-blue-300 rounded-full border border-white/10">
                      ou
                    </span>
                  </div>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour à la connexion
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:border-blue-500/30 transition-all">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-200">Besoin d'aide ? </span>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Contactez le support
              </a>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-blue-300">Cryptage SSL</span>
              </div>
              <span className="text-blue-500">•</span>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Lien valide 1h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;