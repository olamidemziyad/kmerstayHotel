import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, token, loading, initialized } = useAuth();

  // ⏳ Pendant la vérification du token → on attend
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // ❌ Si après initialisation, il n’y a ni user ni token → redirection
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Sinon on autorise l’accès
  return children;
}
