import React, { useState, useEffect } from 'react';
import apiClient from '../../services/axiosApi';
import { getAllUsers, deleteUserById, toggleUserStatus } from '../../services/userService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur récupération utilisateurs:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filters.search) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.role) filtered = filtered.filter(u => u.role === filters.role);
    if (filters.status) filtered = filtered.filter(u => u.is_active === (filters.status === 'active'));

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', role: '', status: '' });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await deleteUserById(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.is_active;
      await toggleUserStatus(user.id, newStatus);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
      alert(`Utilisateur ${newStatus ? 'activé' : 'désactivé'}`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtres */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom ou email..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <select
              value={filters.role}
              onChange={e => handleFilterChange('role', e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="user">Utilisateur</option>
            </select>
            <select
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={clearFilters} className="text-blue-600 hover:underline">Effacer filtres</button>
            <span>{filteredUsers.length} utilisateur(s) trouvé(s)</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleViewDetails(user)} className="text-blue-600 hover:text-blue-900">Détails</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                    <button onClick={() => handleToggleStatus(user)} className="text-yellow-600 hover:text-yellow-900">
                      {user.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucun utilisateur trouvé</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400"
              >
                Précédent
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails utilisateur */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Détails Utilisateur</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  &times;
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div><strong>Nom:</strong> {selectedUser.name}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Rôle:</strong> {selectedUser.role}</div>
                <div><strong>Status:</strong> {selectedUser.is_active ? 'Actif' : 'Inactif'}</div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
