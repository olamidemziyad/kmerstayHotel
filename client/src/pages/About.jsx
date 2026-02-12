import React from "react";
import { motion } from "framer-motion";
import LogSigNavbar from "../components/navbars/Login-Signin";
import { 
  Target, Code2, Database, Server, Smartphone, Zap, 
  Heart, Globe, Users, Award, Sparkles, CheckCircle,
  Rocket, Shield, TrendingUp, Coffee
} from "lucide-react";

function About() {
  const techStack = [
    {
      icon: Smartphone,
      title: "Frontend",
      desc: "React.js pour une interface fluide et réactive avec une expérience utilisateur exceptionnelle.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Server,
      title: "Backend",
      desc: "Node.js & Express.js pour un serveur robuste, rapide et scalable.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Database,
      title: "Base de données",
      desc: "MySQL avec Sequelize pour une gestion efficace et sécurisée des données.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Zap,
      title: "Communication",
      desc: "Axios pour des échanges ultra-rapides entre le client et le serveur.",
      color: "from-purple-500 to-pink-500"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Sécurité maximale",
      desc: "Protection des données et paiements sécurisés"
    },
    {
      icon: Rocket,
      title: "Performance optimale",
      desc: "Chargement rapide et interface fluide"
    },
    {
      icon: Users,
      title: "Expérience utilisateur",
      desc: "Interface intuitive et moderne"
    },
    {
      icon: Globe,
      title: "Solution locale",
      desc: "Adapté aux besoins camerounais"
    }
  ];

  const stats = [
    { value: "100%", label: "Full-Stack", icon: Code2 },
    { value: "24/7", label: "Support", icon: Heart },
    { value: "100+", label: "Hôtels", icon: Award },
    { value: "∞", label: "Passion", icon: Coffee }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <LogSigNavbar />

      <main className="relative z-10 max-w-6xl mx-auto pt-32 pb-20 px-6">
        
        {/* Header principal */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Découvrez notre histoire</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            À propos de{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              KmerStay
            </span>
          </h1>
          
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Une nouvelle façon de réserver vos séjours au Cameroun 🇨🇲
          </p>
        </motion.header>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:border-white/40 transition-all hover:transform hover:scale-105"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 hover:border-white/40 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Notre Mission</h2>
            </div>
            
            <p className="text-blue-200 text-lg leading-relaxed mb-6">
              KmerStay a été conçu avec un double objectif : offrir une solution
              simple et locale pour la réservation de logements au Cameroun, tout
              en servant de projet d'apprentissage pour maîtriser les technologies
              du développement web full-stack moderne.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-start gap-3 hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-300 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 hover:border-white/40 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Technologies Utilisées</h2>
            </div>
            
            <p className="text-blue-200 text-lg mb-8">
              Ce site est le fruit de l'intégration harmonieuse de plusieurs
              technologies modernes et performantes :
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <tech.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{tech.title}</h3>
                        <div className={`h-1 w-12 bg-gradient-to-r ${tech.color} rounded-full`}></div>
                      </div>
                    </div>
                    <p className="text-blue-200">{tech.desc}</p>
                  </div>
                  
                  {/* Decorative gradient border on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Développeur */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-white fill-current" />
                </div>
                <h2 className="text-3xl font-bold text-white">Le Développeur</h2>
              </div>
              
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Derrière KmerStay se cache un développeur passionné, motivé par la
                création de solutions locales avec des outils modernes. Chaque
                fonctionnalité, chaque animation et chaque ligne de code reflètent
                une quête constante d'excellence et de maîtrise du web full-stack.
              </p>

              <div className="flex flex-wrap gap-3">
                {["React", "Node.js", "MySQL", "Express", "Sequelize", "Tailwind"].map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-blue-200 text-sm font-medium hover:bg-white/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à découvrir nos hôtels ?
            </h3>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              Explorez notre sélection d'hôtels exceptionnels et réservez votre prochain séjour en quelques clics
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto">
              <span>Voir les hôtels</span>
              <Rocket className="w-5 h-5" />
            </button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="text-center mt-20 pb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-6 px-8 inline-block">
            <p className="text-blue-200 flex items-center gap-2 justify-center flex-wrap">
              <span>© {new Date().getFullYear()} KmerStay</span>
              <span className="text-blue-500">•</span>
              <span className="flex items-center gap-1">
                Développé avec <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" /> au Cameroun
              </span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default About;