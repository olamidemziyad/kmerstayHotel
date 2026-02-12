import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">KmerStay <br /> Admin Panel</h2>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-blue-700">
            Dashboard
          </NavLink>
          <NavLink to="/admin/bookings" className="block px-3 py-2 rounded hover:bg-blue-700">
            Réservations
          </NavLink>
          <NavLink to="/admin/users" className="block px-3 py-2 rounded hover:bg-blue-700">
            Utilisateurs
          </NavLink>
          <NavLink to="/admin/hotels" className="block px-3 py-2 rounded hover:bg-blue-700">
            Hôtels
          </NavLink>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet /> {/* Affiche la page active */}
      </main>
    </div>
  );
};

export default AdminLayout;
