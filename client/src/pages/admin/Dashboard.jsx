// src/pages/admin/Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, getBookingStats } from "../../services/bookingService";
import apiClient from "../../services/axiosApi";


// Couleurs pour le pie chart
const COLORS = {
  payé: "#3B82F6",
  "en attente": "#F59E0B",
  échoué: "#EF4444",
};

// ====== Fetchers ======
const fetchUserCount = async () => {
  const res = await apiClient.get("/users/count");
  return res.data;
};

const fetchRecentUsers = async () => {
  const res = await apiClient.get("/users");
  return res.data?.data || [];
};

// ====== Helpers ======
const formatCurrency = (amount) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("fr-FR");

const generateMonthlyBookingData = (bookings) => {
  if (!bookings || !Array.isArray(bookings)) return [];
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const last6Months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentDate.getMonth() - i, 1);
    const monthName = monthNames[date.getMonth()];

    const bookingsCount = bookings.filter((b) => {
      const d = new Date(b.createdAt);
      return (
        d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
      );
    }).length;

    last6Months.push({ month: monthName, bookings: bookingsCount });
  }
  return last6Months;
};

const generatePaymentDataFromStats = (stats) => {
  if (!stats || !stats.total) return [];
  const paidCount = stats.paid || 0;
  const totalCount = stats.total || 0;
  const pendingCount = totalCount - paidCount;
  return [
    { name: "Payé", value: (paidCount / totalCount) * 100, count: paidCount },
    {
      name: "En attente",
      value: (pendingCount / totalCount) * 100,
      count: pendingCount,
    },
    {
      name: "Échoué",
      value: Math.max(0, 100 - (paidCount / totalCount) * 100 - (pendingCount / totalCount) * 100),
      count: Math.max(0, totalCount - paidCount - pendingCount),
    },
  ];
};

// ====== Component ======
const Dashboard = () => {
  

  // Queries - Updated for TanStack Query v5
  const {
    data: bookings = [],
    isLoading: loadingBookings,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });

  const {
    data: bookingStats = { total: 0, paid: 0 },
    isLoading: loadingStats,
  } = useQuery({
    queryKey: ["bookingStats"],
    queryFn: getBookingStats,
  });

  const {
    data: userCount = { totalUsers: 0 },
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ["userCount"],
    queryFn: fetchUserCount,
  });

  const {
    data: recentUsers = [],
    isLoading: loadingRecentUsers,
  } = useQuery({
    queryKey: ["recentUsers"],
    queryFn: fetchRecentUsers,
  });

  // Calculs dérivés
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = bookings
    .filter((b) => {
      const d = new Date(b.createdAt);
      return (
        (b.status === "confirmed" || b.payment_status === "paid") &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    })
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const pendingPayments = bookingStats.total - bookingStats.paid || 0;
  const bookingsByMonth = generateMonthlyBookingData(bookings);
  const paymentStatusDistribution = generatePaymentDataFromStats(bookingStats);

  // Loading global
  if (loadingBookings || loadingStats || loadingUsers || loadingRecentUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrateur
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble de votre plateforme de réservation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin connecté</span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Utilisateurs" value={userCount.totalUsers} />
          <StatCard title="Total Réservations" value={bookingStats.total} />
          <StatCard title="Revenus du Mois" value={formatCurrency(monthlyRevenue)} />
          <StatCard title="Paiements en attente" value={pendingPayments} />
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Évolution des Réservations
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statuts des Paiements
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                >
                  {paymentStatusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name.toLowerCase()] || COLORS.payé}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${Math.round(value)}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Last bookings */}
          <RecentBookings bookings={bookings.slice(0, 5)} />
          {/* Last users */}
          <RecentUsers users={recentUsers.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

// ====== Sub Components ======
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <p className="text-sm font-medium text-gray-600">{title}</p>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const RecentBookings = ({ bookings }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Dernières Réservations</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {b.guest_name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {b.guest_email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(b.total_price || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      b.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : b.payment_status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {b.payment_status || "pending"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                Aucune réservation récente
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const RecentUsers = ({ users }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Nouveaux Utilisateurs</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Inscription
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{u.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                Aucun utilisateur récent
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;