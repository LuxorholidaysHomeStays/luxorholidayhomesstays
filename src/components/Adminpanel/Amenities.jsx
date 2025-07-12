import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Changed from modal to inline form
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const { authToken } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    category: 'general',
    featured: false
  });

  // Show success/error messages
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  useEffect(() => {
    fetchAmenities();
  }, []);
  
  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/amenities`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }
      
      const data = await response.json();
      setAmenities(data.amenities || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      showNotification('Error loading amenities', 'error');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      category: 'general',
      featured: false
    });
    setEditingAmenity(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const url = editingAmenity
        ? `${API_BASE_URL}/api/admin/amenities/${editingAmenity._id}`
        : `${API_BASE_URL}/api/admin/amenities`;
      
      const method = editingAmenity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save amenity');
      }
      
      showNotification(
        `Amenity ${editingAmenity ? 'updated' : 'created'} successfully!`,
        'success'
      );
      
      setShowForm(false);
      resetForm();
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      showNotification(error.message || 'Failed to save amenity', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name || '',
      description: amenity.description || '',
      icon: amenity.icon || '',
      category: amenity.category || 'general',
      featured: amenity.featured || false
    });
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/amenities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete amenity');
      }
      
      showNotification('Amenity deleted successfully!', 'success');
      setConfirmDelete(null);
      fetchAmenities();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      showNotification(error.message || 'Failed to delete amenity', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleNewForm = () => {
    setShowForm(!showForm);
    resetForm();
  };
  
  // Filter amenities based on search term
  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amenities Management</h1>
          <p className="text-gray-600">Create and manage villa amenities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search amenities..."
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={toggleNewForm}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300 flex items-center justify-center"
          >
            {showForm && !editingAmenity ? (
              <>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Amenity
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div 
          className={`p-4 rounded-md ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-400' 
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      {/* Add/Edit Amenity Form - Inline */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-500"
              type="button"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenity Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Swimming Pool"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., pool, wifi (Font Awesome names)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Brief description of this amenity"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="general">General</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Amenity (highlighted in listings)
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingAmenity ? 'Update Amenity' : 'Create Amenity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && amenities.length === 0 ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
          </div>
        ) : filteredAmenities.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-yellow-100 flex items-center justify-center rounded-full mb-4">
              <PhotoIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No amenities found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? "Try adjusting your search" : "No amenities match your criteria."}
            </p>
          </div>
        ) : (
          filteredAmenities.map((amenity) => (
            <div key={amenity._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <span className="text-yellow-600 text-xl">
                      {amenity.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {amenity.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {amenity.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full px-3 py-1">
                    {amenity.category}
                  </span>
                  {amenity.featured && (
                    <span className="text-xs font-medium bg-green-100 text-green-800 rounded-full px-3 py-1">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(amenity)}
                  className="text-indigo-600 hover:text-indigo-900 flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(amenity._id)}
                  className="text-red-600 hover:text-red-900 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this amenity? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Delete Amenity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;