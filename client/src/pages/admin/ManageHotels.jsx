import React, { useState, useEffect } from 'react';
import { getAllHotels, deleteHotel, getHotelById } from '../../services/hotelService';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Modals
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    type: '',
    priceMin: '',
    priceMax: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.warn('Aucun token trouvé');
      window.location.href = '/login';
      return;
    }
    fetchHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, hotels]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotelsData = await getAllHotels();
      const hotelsWithRooms = await Promise.allSettled(
        hotelsData.map(async (hotel) => {
          try {
            const fullHotel = await getHotelById(hotel.id);
            return { ...hotel, rooms: fullHotel.rooms || [] };
          } catch (error) {
            console.warn(`Erreur chargement chambres hôtel ${hotel.id}:`, error);
            return { ...hotel, rooms: [] };
          }
        })
      );

      const validHotels = hotelsWithRooms
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      setHotels(validHotels);
    } catch (error) {
      console.error('Erreur chargement hôtels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    if (filters.search) {
      filtered = filtered.filter(hotel =>
        hotel.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(hotel =>
        hotel.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(hotel => hotel.type === filters.type);
    }

    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(hotel => getHotelMinPrice(hotel) >= minPrice);
      }
    }

    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(hotel => getHotelMinPrice(hotel) <= maxPrice);
      }
    }

    setFilteredHotels(filtered);
    setCurrentPage(1);
  };

  const getHotelMinPrice = (hotel) => {
    if (hotel.rooms && hotel.rooms.length > 0) {
      const validPrices = hotel.rooms
        .map(room => parseFloat(room.price))
        .filter(price => !isNaN(price) && price > 0);
      return validPrices.length > 0 ? Math.min(...validPrices) : 0;
    }
    return parseFloat(hotel.price_per_night) || 0;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', type: '', priceMin: '', priceMax: '' });
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const confirmDeleteHotel = (hotel) => {
    setHotelToDelete(hotel);
    setConfirmDeleteModal(true);
  };

  const handleDeleteHotel = async () => {
    if (!hotelToDelete) return;

    try {
      setDeleting(hotelToDelete.id);
      const response = await deleteHotel(hotelToDelete.id);

      if (response.status === 200 || response.status === 204) {
        setHotels(prev => prev.filter(h => h.id !== hotelToDelete.id));
        setNotification({ show: true, message: 'Hôtel supprimé avec succès', type: 'success' });
      }
    } catch (error) {
      console.error(error);
      let message = 'Erreur lors de la suppression';
      if (error.response?.status === 404) message = 'Hôtel déjà supprimé ou introuvable';
      if (error.response?.status === 403) message = 'Vous n\'avez pas la permission';
      setNotification({ show: true, message, type: 'error' });
    } finally {
      setDeleting(null);
      setConfirmDeleteModal(false);
      setHotelToDelete(null);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Prix non défini';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Hôtels</h1>
              <p className="text-gray-600">Gérez tous les hôtels de votre plateforme</p>
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

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Nom de l'hôtel..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <input
                type="text"
                placeholder="Ex: Douala"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="hotel">Hôtel</option>
                <option value="guesthouse">Maison d'hôtes</option>
                <option value="resort">Resort</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix Min (FCFA)</label>
              <input
                type="number"
                min="0"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix Max (FCFA)</label>
              <input
                type="number"
                min="0"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 font-medium">
              Effacer les filtres
            </button>
            <span className="text-sm text-gray-600">{filteredHotels.length} hôtel(s) trouvé(s)</span>
          </div>
        </div>

        {/* Table des hôtels */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Hôtels ({filteredHotels.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix Minimum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentHotels.length > 0 ? currentHotels.map(hotel => {
                  const minPrice = getHotelMinPrice(hotel);
                  const roomCount = hotel.rooms?.length || 0;
                  return (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                        <div className="text-sm text-gray-500">{hotel.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{minPrice > 0 ? formatCurrency(minPrice) : "Prix sur demande"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomCount} chambre(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleViewDetails(hotel)} className="text-blue-600 hover:text-blue-900 transition-colors">Détails</button>
                          <button
                            onClick={() => confirmDeleteHotel(hotel)}
                            disabled={deleting === hotel.id}
                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 transition-colors"
                          >
                            {deleting === hotel.id ? 'Suppression...' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">{loading ? 'Chargement...' : 'Aucun hôtel trouvé'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredHotels.length)} sur {filteredHotels.length} résultats</div>
              <div className="flex items-center space-x-2">
                <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors">Précédent</button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) pageNumber = i + 1;
                    else if (currentPage <= 3) pageNumber = i + 1;
                    else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                    else pageNumber = currentPage - 2 + i;

                    return (
                      <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={`px-3 py-1 rounded-md transition-colors ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{pageNumber}</button>
                    );
                  })}
                </div>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors">Suivant</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails hôtel */}
      {showModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Détails de l'Hôtel</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informations Générales</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom:</strong> {selectedHotel.name}</div>
                    <div><strong>Ville:</strong> {selectedHotel.city}</div>
                    <div><strong>Type:</strong> {selectedHotel.type}</div>
                    <div><strong>Prix de base:</strong> {formatCurrency(selectedHotel.price_per_night)}</div>
                    <div><strong>Description:</strong> {selectedHotel.description || 'Aucune description'}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Chambres ({selectedHotel.rooms?.length || 0})</h4>
                  {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {selectedHotel.rooms.map((room, index) => (
                        <div key={room.id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                          <div><strong>Nom:</strong> {room.name}</div>
                          <div><strong>Prix:</strong> {formatCurrency(room.price)}</div>
                          <div><strong>Nombre de lits:</strong> {room.beds || 1}</div>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-sm text-gray-500">Aucune chambre disponible</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {confirmDeleteModal && hotelToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer l'hôtel <strong>{hotelToDelete.name}</strong> ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteHotel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-md shadow-lg text-white z-50 
            ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="ml-4 font-bold hover:underline"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageHotels;
