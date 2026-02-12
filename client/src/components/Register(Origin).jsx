import { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { AuthFormLayout } from "../components/AuthFormLayout";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await registerUser({ fullName, email, phone, password });

      if (res.message) {
        setSuccess(res.message + " Redirection...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.message || "Échec de l'inscription");
    }
  };

  return (
    <AuthFormLayout
      title="Créer un compte"
      subtitle="Rejoignez-nous pour découvrir les meilleures offres d’hébergement"
      error={error}
      success={success}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <input
          type="text"
          placeholder="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          S'inscrire
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default Register;
