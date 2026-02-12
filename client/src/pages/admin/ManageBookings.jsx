import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/bookingService';
import apiClient from '../../services/axiosApi';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
    dateFrom: '',
    dateTo: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.warn('Aucun token trouvé');
      window.location.href = '/login';
      return;
    }
    
    fetchBookings();
  }, []);

  useEffect(() => {
    // Appliquer les filtres quand ils changent
    applyFilters();
  }, [filters, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getAllBookings();
      console.log('Réservations récupérées:', bookingsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filtre de recherche (nom du client ou email)
    if (filters.search) {
      filtered = filtered.filter(booking => 
        booking.guest_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.guest_email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par statut de réservation
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Filtre par statut de paiement
    if (filters.payment_status) {
      filtered = filtered.filter(booking => booking.payment_status === filters.payment_status);
    }

    // Filtre par date (check-in)
    if (filters.dateFrom) {
      filtered = filtered.filter(booking => 
        new Date(booking.check_in_date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(booking => 
        new Date(booking.check_in_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset à la première page quand on filtre
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      payment_status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdatePaymentStatus = async (bookingId, newStatus) => {
    try {
      // Utiliser l'endpoint approprié selon le nouveau statut
      let endpoint = '';
      if (newStatus === 'paid') {
        endpoint = `/bookings/${bookingId}/pay`;
      } else {
        // Pour pending ou failed, vous pourriez avoir un endpoint générique
        endpoint = `/bookings/${bookingId}`;
      }

      const response = await apiClient.patch(endpoint, 
        newStatus === 'paid' ? {} : { payment_status: newStatus }
      );

      if (response.status === 200) {
        // Mettre à jour l'état local
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, payment_status: newStatus }
            : booking
        ));
        
        alert(`Statut de paiement mis à jour vers: ${newStatus}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement:', error);
      alert('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
      
      if (response.status === 200) {
        // Mettre à jour l'état local
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        
        alert('Réservation annulée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Erreur lors de l\'annulation de la réservation');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
              <p className="text-gray-600">Gérez toutes les réservations de votre plateforme</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Retour au Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Nom ou email du client..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Statut de réservation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut Réservation</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Statut de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut Paiement</label>
              <select
                value={filters.payment_status}
                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="failed">Échoué</option>
              </select>
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Effacer les filtres
            </button>
            <span className="text-sm text-gray-600">
              {filteredBookings.length} réservation(s) trouvée(s)
            </span>
          </div>
        </div>

        {/* Table des réservations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Réservations ({filteredBookings.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut Réservation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.length > 0 ? currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.guest_name}</div>
                      <div className="text-sm text-gray-500">{booking.guest_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Arrivée: {formatDate(booking.check_in_date)}</div>
                      <div>Départ: {formatDate(booking.check_out)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{formatCurrency(booking.total_price)}</div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(booking.price_per_night)}/nuit
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmé' : 
                         booking.status === 'cancelled' ? 'Annulé' : booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.payment_status}
                        onChange={(e) => handleUpdatePaymentStatus(booking.id, e.target.value)}
                        className={`text-xs font-semibold rounded px-2 py-1 border-0 ${
                          booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="paid">Payé</option>
                        <option value="failed">Échoué</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Détails
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Annuler
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucune réservation trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredBookings.length)} sur {filteredBookings.length} résultats
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1 bg-blue-500 text-white rounded-md">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Détails de la Réservation</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations Client</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom:</strong> {selectedBooking.guest_name}</div>
                    <div><strong>Email:</strong> {selectedBooking.guest_email}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations Réservation</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {selectedBooking.id}</div>
                    <div><strong>Chambre ID:</strong> {selectedBooking.roomId}</div>
                    <div><strong>Check-in:</strong> {formatDate(selectedBooking.check_in_date)}</div>
                    <div><strong>Check-out:</strong> {formatDate(selectedBooking.check_out)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Prix</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Prix par nuit:</strong> {formatCurrency(selectedBooking.price_per_night)}</div>
                    <div><strong>Prix total:</strong> {formatCurrency(selectedBooking.total_price)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Statuts</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Réservation:</strong>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBooking.status === 'confirmed' ? 'Confirmé' : 
                         selectedBooking.status === 'cancelled' ? 'Annulé' : selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <strong>Paiement:</strong>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedBooking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        selectedBooking.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.payment_status === 'paid' ? 'Payé' :
                         selectedBooking.payment_status === 'pending' ? 'En attente' :
                         selectedBooking.payment_status === 'failed' ? 'Échoué' : selectedBooking.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;