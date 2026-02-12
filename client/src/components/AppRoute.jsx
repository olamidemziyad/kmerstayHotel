import { Route, Routes } from "react-router-dom";
import AuthorizeRoute from "./AuthorizeRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Unauthorized from "../pages/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Page non autorisée */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Route protégée pour les admins uniquement */}
      <Route element={<AuthorizeRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
