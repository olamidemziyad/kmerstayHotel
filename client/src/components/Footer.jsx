import React, { useState } from "react";
import { 
  Home, Hotel, Phone, Info, Mail, MapPin, Facebook, Instagram, 
  Twitter, Linkedin, Send, ArrowRight, Check, Sparkles, 
  CreditCard, Shield, Clock, Award, ExternalLink 
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setSubscribed(true);
      setIsSubmitting(false);
      setEmail("");
      
      // Reset après 3 secondes
      setTimeout(() => setSubscribed(false), 3000);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Hôtels", href: "/hotels", icon: Hotel },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "À propos", href: "/about", icon: Info },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook, color: "hover:text-blue-500" },
    { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-500" },
    { name: "Twitter", href: "#", icon: Twitter, color: "hover:text-sky-400" },
    { name: "LinkedIn", href: "#", icon: Linkedin, color: "hover:text-blue-600" },
  ];

  const features = [
    { icon: Shield, text: "Paiement sécurisé" },
    { icon: Clock, text: "Support 24/7" },
    { icon: Award, text: "Meilleur prix garanti" },
    { icon: CreditCard, text: "Paiement flexible" },
  ];

  const legalLinks = [
    { name: "Conditions d'utilisation", href: "/terms" },
    { name: "Politique de confidentialité", href: "/privacy" },
    { name: "Cookies", href: "/cookies" },
    { name: "Mentions légales", href: "/legal" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white mt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Top Wave Decoration */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-xl">
                  <Hotel className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KmerStay
                </h1>
              </div>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Votre destination de confiance pour trouver et réserver les meilleurs hôtels avec une expérience exceptionnelle.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a href="mailto:contact@kmerstay.com" className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">contact@kmerstay.com</span>
                </a>
                <a href="tel:+237123456789" className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors group">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+237 123 456 789</span>
                </a>
                <div className="flex items-start gap-2 text-blue-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Douala, Cameroun</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Navigation
              </h2>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="flex items-center gap-3 text-blue-200 hover:text-white transition-all group"
                    >
                      <link.icon className="w-4 h-4 group-hover:scale-110 group-hover:text-blue-400 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Nos Garanties
              </h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-blue-200 text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Newsletter
              </h2>
              <p className="text-blue-200 text-sm mb-4">
                Recevez nos offres exclusives et nouveautés
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none pr-12"
                    disabled={isSubmitting || subscribed}
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || subscribed || !email}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    subscribed
                      ? 'bg-green-500/20 border border-green-400/30 text-green-300'
                      : isSubmitting
                      ? 'bg-blue-400/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  } ${!email && 'opacity-50 cursor-not-allowed'}`}
                >
                  {subscribed ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Inscrit !</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <>
                      <span>S'abonner</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-blue-300/70 mt-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Offres exclusives chaque semaine</span>
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 md:mb-0">Suivez-nous</h3>
              </div>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg group`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-blue-300/70 text-sm text-center md:text-left">
                © {currentYear} KmerStay. Tous droits réservés.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {index < legalLinks.length - 1 && (
                      <span className="text-blue-500 hidden md:inline">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-blue-200">Plateforme sécurisée et certifiée</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}