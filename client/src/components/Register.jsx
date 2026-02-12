import { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { AuthFormLayout } from "../components/AuthFormLayout";
import { useMutation } from "@tanstack/react-query";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Loader2, 
  CheckCircle, AlertCircle, ArrowRight, Sparkles, 
  Shield, Check, X
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // Validation de la force du mot de passe
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const {
    mutate: register,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 2000);
    },
  });

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }

    register({ fullName, email, phone, password });
  };

  const passwordMatchesConfirm = confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-md w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Créer un compte
            </h1>
            <p className="text-blue-200 text-lg">
              Commencez votre voyage avec nous
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            
            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 font-semibold text-sm">Inscription réussie !</p>
                  <p className="text-green-200 text-xs mt-1">Redirection vers la connexion...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {(localError || (isError && error?.message)) && (
              <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold text-sm">Erreur d'inscription</p>
                  <p className="text-red-200 text-xs mt-1">{localError || error?.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Nom complet <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    required
                    autoComplete="name"
                  />
                  {fullName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    required
                    autoComplete="email"
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                      aria-label="Effacer l'email"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  Téléphone
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+237 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    autoComplete="tel"
                  />
                </div>
                <p className="text-xs text-blue-300/70 flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Optionnel - Pour vous contacter si nécessaire
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300/70 hover:text-blue-200 transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicators */}
                {password && (
                  <div className="space-y-2 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <p className="text-xs font-semibold text-blue-200 mb-2">Force du mot de passe :</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.length ? 'text-green-300' : 'text-blue-300/50'}`}>
                        {passwordStrength.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>8+ caractères</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.uppercase ? 'text-green-300' : 'text-blue-300/50'}`}>
                        {passwordStrength.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Majuscule</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.lowercase ? 'text-green-300' : 'text-blue-300/50'}`}>
                        {passwordStrength.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Minuscule</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.number ? 'text-green-300' : 'text-blue-300/50'}`}>
                        {passwordStrength.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Chiffre</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Confirmer le mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-blue-300/50 focus:ring-2 transition-all outline-none ${
                      passwordMismatch 
                        ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' 
                        : passwordMatchesConfirm
                        ? 'border-green-400/50 focus:border-green-400 focus:ring-green-400/20'
                        : 'border-white/20 focus:border-blue-400 focus:ring-blue-400/20'
                    }`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300/70 hover:text-blue-200 transition-colors"
                    aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {confirmPassword && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {passwordMatchesConfirm ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl mt-6 ${
                  isLoading || isSuccess
                    ? 'bg-blue-400/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
                } text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Création du compte...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Compte créé !</span>
                  </>
                ) : (
                  <>
                    <span>S'inscrire maintenant</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/50 backdrop-blur-sm text-blue-300 rounded-full">
                    ou
                  </span>
                </div>
              </div>

              {/* Login link */}
              <div className="text-center">
                <p className="text-blue-200 text-sm">
                  Déjà membre ?{' '}
                  <a 
                    href="/login" 
                    className="text-blue-400 font-semibold hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                  >
                    Se connecter
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-blue-200">Inscription sécurisée et cryptée</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-blue-300/70 text-xs">
              En vous inscrivant, vous acceptez nos conditions d'utilisation
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                Politique de confidentialité
              </a>
              <span className="text-blue-500">•</span>
              <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;