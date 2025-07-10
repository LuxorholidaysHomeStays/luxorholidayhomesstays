import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const AMENITY_CATEGORIES = [
  'Essential Comforts', 
  'Parking & Transport', 
  'Outdoor', 
  'Kitchen', 
  'Bathroom & Bedroom', 
  'Family', 
  'Entertainment',
  'Safety & Security',
  'Other'
];

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    description: '',
    icon: '',
    isActive: true
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const { authToken } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/amenities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }

      const data = await response.json();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      addToast({
        type: 'error',
        message: 'Failed to load amenities. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Show icon preview when icon URL is entered
    if (name === 'icon' && value) {
      setIconPreview(value);
    } else if (name === 'icon' && !value) {
      setIconPreview('');
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAmenity
        ? `${API_BASE_URL}/api/amenities/${editingAmenity._id}`
        : `${API_BASE_URL}/api/amenities`;
      
      const method = editingAmenity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingAmenity ? 'update' : 'create'} amenity`);
      }

      addToast({
        type: 'success',
        message: `Amenity ${editingAmenity ? 'updated' : 'created'} successfully!`,
      });
      
      closeModal();
      fetchAmenities();
    } catch (error) {
      console.error(`Error ${editingAmenity ? 'updating' : 'creating'} amenity:`, error);
      addToast({
        type: 'error',
        message: `Failed to ${editingAmenity ? 'update' : 'create'} amenity. Please try again.`,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/amenities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete amenity');
      }

      addToast({
        type: 'success',
        message: 'Amenity deleted successfully!',
      });
      
      setDeleteConfirmation(null);
      fetchAmenities();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      addToast({
        type: 'error',
        message: 'Failed to delete amenity. Please try again.',
      });
    }
  };

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      category: amenity.category,
      description: amenity.description || '',
      icon: amenity.icon || '',
      isActive: amenity.isActive
    });
    setIconPreview(amenity.icon || '');
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingAmenity(null);
    setFormData({
      name: '',
      category: 'Other',
      description: '',
      icon: '',
      isActive: true
    });
    setIconPreview('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAmenity(null);
    setIconPreview('');
  };

  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Amenities Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Amenity
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search amenities by name or category..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Amenities List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading amenities...</p>
        </div>
      ) : filteredAmenities.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No amenities found. {searchTerm && 'Try a different search term.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmenities.map((amenity) => (
                <tr key={amenity._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {amenity.icon && (
                        <img
                          src={amenity.icon}
                          alt={amenity.name}
                          className="h-8 w-8 mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">{amenity.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{amenity.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {amenity.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      amenity.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {amenity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(amenity)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(amenity)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAmenity ? 'Edit Amenity' : 'Create New Amenity'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {AMENITY_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter URL to icon image (e.g., /amenities-icons/wifi.svg)"
                  />
                  {iconPreview && (
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-300">
                      <img 
                        src={iconPreview} 
                        alt="Icon Preview" 
                        className="max-w-full max-h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=Error';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Use paths like '/amenities-icons/wifi.svg' from the public directory
                </p>
              </div>
              
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                >
                  {editingAmenity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the amenity "{deleteConfirmation.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;
