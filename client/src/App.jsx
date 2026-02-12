// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Import AuthProvider et routes protégées
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthorizeRoute from "./components/AuthorizeRoute";

//  composants/pages
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import AddHotelAdmin from "./components/AddHotelByAdmin";
import Home from "./pages/Home";
import SearchResults from "./components/SearchResults";
import Hotel from "./components/Hotel";
import HotelPreview from "./pages/HotelPreview";
import RoomsList from "./components/RoomsList";
import RoomDetails from "./pages/RoomDetails";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyFavorites from "./pages/MyFavorites";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBookings from "./pages/admin/ManageBookings";
import AdminLayout from "./pages/admin/AdminLayout";
import ManageHotels from "./pages/admin/ManageHotels";
import PaymentPage from "./pages/PayementPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import About from "./pages/About";
import Unauthorized from "./pages/Unauthorized";
import PaymentError from "./pages/PaymentError";

// Créer un client React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ Fournit le contexte d'authentification à toute l'application */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* ✅ Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotels" element={<Hotel />} />
            <Route path="/hotel-preview/:id" element={<HotelPreview />} />
            <Route path="/hotel-preview/:id/rooms" element={<RoomsList />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/payment-error" element={<PaymentError />} />

            {/* ✅ Routes protégées (utilisateur connecté obligatoire) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <MyFavorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:bookingId/details"
              element={
                <ProtectedRoute>
                  <ConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation/:id"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />

            {/* ✅ Routes Admin protégées par rôle */}
            <Route
              path="/admin"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </AuthorizeRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </AuthorizeRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </AuthorizeRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <ManageBookings />
                </AuthorizeRoute>
              }
            />
            <Route
              path="/admin/hotels"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <ManageHotels />
                </AuthorizeRoute>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <AuthorizeRoute allowedRoles={["admin"]}>
                  <AddHotelAdmin />
                </AuthorizeRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
