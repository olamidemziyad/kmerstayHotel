import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login: loginWithContext } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    mutate: login,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: loginWithContext,
    onSuccess: () => {
      setTimeout(() => navigate("/"), 1000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-violet-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-pink-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-violet-400/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Features */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-violet-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-semibold text-pink-300">Plateforme de Réservation #1</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Bienvenue dans
                </span>
                <br />
                <span className="text-white">l'excellence hôtelière</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Accédez à des milliers d'hôtels premium avec des avantages exclusifs et une expérience de réservation simplifiée.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-pink-500/30 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Réservation Instantanée</h3>
                    <p className="text-gray-400 text-sm">Confirmez votre séjour en quelques clics</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Paiement Sécurisé</h3>
                    <p className="text-gray-400 text-sm">Protection SSL et cryptage de bout en bout</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">+ de 10M d'utilisateurs</h3>
                    <p className="text-gray-400 text-sm">Rejoignez notre communauté mondiale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-1">500+</div>
                <div className="text-gray-500 text-xs">Hôtels Premium</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-1">10K+</div>
                <div className="text-gray-500 text-xs">Clients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-1">98%</div>
                <div className="text-gray-500 text-xs">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header Mobile */}
            <div className="text-center lg:text-left mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Bon retour !
              </h1>
              <p className="text-gray-400 text-lg">
                Retrouvez vos réservations
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Connexion
              </h2>
              <p className="text-gray-400">
                Accédez à votre espace personnel
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-500">
              
              {/* Success Message */}
              {isSuccess && (
                <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top shadow-lg shadow-green-500/20">
                  <div className="bg-green-500/20 p-2 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-300 font-semibold text-sm">Connexion réussie !</p>
                    <p className="text-green-200/80 text-xs mt-1">Redirection vers votre espace...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {isError && (
                <div className="mb-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top shadow-lg shadow-red-500/20">
                  <div className="bg-red-500/20 p-2 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-300 font-semibold text-sm">Erreur de connexion</p>
                    <p className="text-red-200/80 text-xs mt-1">{error.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-pink-400" />
                    Adresse email
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      type="email"
                      placeholder="exemple@domaine.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border ${
                        focusedField === 'email' 
                          ? 'border-pink-500 shadow-lg shadow-pink-500/20' 
                          : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
                      required
                      autoComplete="email"
                    />
                    {email && (
                      <button
                        type="button"
                        onClick={() => setEmail('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-400 transition-colors"
                        aria-label="Effacer l'email"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {focusedField === 'email' && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500"></div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-semibold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-violet-400" />
                      Mot de passe
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium hover:underline"
                    >
                      Oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3.5 pr-12 bg-white/5 backdrop-blur-sm border ${
                        focusedField === 'password' 
                          ? 'border-violet-500 shadow-lg shadow-violet-500/20' 
                          : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-400 transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {focusedField === 'password' && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending || isSuccess}
                  className={`relative w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl overflow-hidden group ${
                    isPending || isSuccess
                      ? 'bg-gray-600/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 hover:shadow-pink-500/50'
                  } text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  {isPending ? (
                    <>
                      <Loader2 className="relative animate-spin w-5 h-5" />
                      <span className="relative">Connexion en cours...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="relative w-5 h-5" />
                      <span className="relative">Connecté avec succès !</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Se connecter</span>
                      <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900/80 backdrop-blur-sm text-gray-400 rounded-full border border-white/10">
                      ou continuer avec
                    </span>
                  </div>
                </div>

                {/* Social Login Options home*/}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-white font-medium group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-white font-medium group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span className="text-sm">Facebook</span>
                  </button>
                </div>

                {/* Sign up link */}
                <div className="text-center pt-4">
                  <p className="text-gray-400 text-sm">
                    Pas encore de compte ?{' '}
                    <a 
                      href="/register" 
                      className="text-transparent bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text font-semibold hover:from-pink-300 hover:to-violet-300 transition-all inline-flex items-center gap-1"
                    >
                      Créer un compte
                      <ArrowRight className="w-4 h-4 text-violet-400" />
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:border-green-500/30 transition-all">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">SSL Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:border-blue-500/30 transition-all">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Cryptage 256-bit</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-500 text-xs">
                En vous connectant, vous acceptez nos conditions
              </p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <a href="/privacy" className="text-gray-500 hover:text-violet-400 transition-colors">
                  Confidentialité
                </a>
                <span className="text-gray-700">•</span>
                <a href="/terms" className="text-gray-500 hover:text-violet-400 transition-colors">
                  Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
