import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword } from "../services/userService";
import HotelPageNavbar from "../components/navbars/HotelPageNavbar";
import MyBookings from "../components/MyBooking";
import {
  Edit,
  Loader2,
  Mail,
  Phone,
  User,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  Camera,
  X,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
} from "lucide-react";


// Composant pour afficher les champs d'information
const ProfileInfoItem = ({ icon: Icon, label, children }) => (
  <div className="group">
    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <div className="text-base text-gray-800 dark:text-gray-200 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 min-h-[52px] flex items-center transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
      {children}
    </div>
  </div>
);

// Modal de modification du profil
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-500" />
            Modifier le profil
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="+237 6XX XXX XXX"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de changement de mot de passe
const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    onSave({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-purple-500" />
            Changer le mot de passe
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Changer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Notification de succès
const SuccessNotification = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-lg flex items-center gap-3 min-w-[300px]">
        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
        <span className="text-green-800 dark:text-green-200 font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded transition-colors"
        >
          <X className="w-4 h-4 text-green-600" />
        </button>
      </div>
    </div>
  );
};

function Profile() {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      setShowEditModal(false);
      setSuccessMessage("Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      alert(error.message || "Erreur lors de la mise à jour");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setShowPasswordModal(false);
      setSuccessMessage("Mot de passe changé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      alert(error.message || "Erreur lors du changement de mot de passe");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Chargement de votre profil...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-md text-center border border-red-200 dark:border-red-800 shadow-xl">
            <AlertTriangle className="h-14 w-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
              Erreur de chargement
            </h2>
            <p className="text-red-500 dark:text-red-400 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800">
      <HotelPageNavbar/>
      
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={(data) => updateProfileMutation.mutate(data)}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={(data) => changePasswordMutation.mutate(data)}
      />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-20"></div>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* CARTE D'INFORMATIONS PERSONNELLES */}
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/5 transform transition-all hover:shadow-3xl">
            {/* Bannière et Avatar */}
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="absolute top-20 left-8">
                <div className="group relative w-32 h-32">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.fullName}'s avatar`}
                      className="w-full h-full rounded-full ring-4 ring-white dark:ring-gray-800 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full ring-4 ring-white dark:ring-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                      {getInitials(user.fullName)}
                    </div>
                  )}
                  <button className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                    <Camera className="w-7 h-7 text-white" />
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="absolute top-5 right-5 flex gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2.5 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white backdrop-blur-md rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-sm flex items-center gap-2 border border-white/20"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-5 py-2.5 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white backdrop-blur-md rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-sm flex items-center gap-2 border border-white/20"
                >
                  <KeyRound className="w-4 h-4" />
                  Mot de passe
                </button>
              </div>
            </div>

            {/* Informations */}
            <div className="pt-24 pb-10 px-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.fullName}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfoItem icon={User} label="Nom complet">
                  {user.fullName}
                </ProfileInfoItem>

                <ProfileInfoItem icon={Mail} label="Adresse Email">
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate mr-3">{user.email}</span>
                    {user.emailVerified ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-semibold whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Vérifié
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full font-semibold whitespace-nowrap">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Non vérifié
                      </span>
                    )}
                  </div>
                </ProfileInfoItem>

                <ProfileInfoItem icon={Phone} label="Téléphone">
                  {user.phone ? (
                    <span>{user.phone}</span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 italic">
                      Non renseigné
                    </span>
                  )}
                </ProfileInfoItem>
              </div>
            </div>
          </div>

          {/* CARTE DES RÉSERVATIONS */}
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/5">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Mes Réservations
              </h2>
              <MyBookings />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Profile;