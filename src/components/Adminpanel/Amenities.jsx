import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Changed from showModal
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    amenities: ['']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [uniqueLocations, setUniqueLocations] = useState([]);

  const { authToken } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/amenities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAmenities(data.amenities);
        
        // Extract unique locations for filtering
        const locations = [...new Set(data.amenities.map(item => item.location))];
        setUniqueLocations(locations);
      } else {
        throw new Error(data.error || 'Failed to fetch amenities');
      }
    } catch (err) {
      console.error('Error fetching amenities:', err);
      setError(err.message || 'Failed to fetch amenities');
      addToast({
        type: 'error',
        message: 'Failed to load amenities. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = value;
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const addAmenityField = () => {
    setFormData({
      ...formData,
      amenities: [...formData.amenities, '']
    });
  };

  const removeAmenityField = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const openForm = (amenity = null) => { // Renamed from openModal
    if (amenity) {
      setEditingAmenity(amenity);
      setFormData({
        name: amenity.name,
        location: amenity.location,
        amenities: [...amenity.amenities]
      });
    } else {
      setEditingAmenity(null);
      setFormData({
        name: '',
        location: '',
        amenities: ['']
      });
    }
    setShowForm(true); // Changed from setShowModal
  };

  const closeForm = () => { // Renamed from closeModal
    setShowForm(false); // Changed from setShowModal
    setEditingAmenity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty amenities
    const filteredAmenities = formData.amenities.filter(item => item.trim() !== '');
    
    if (filteredAmenities.length === 0) {
      addToast({
        type: 'error',
        message: 'Please add at least one amenity'
      });
      return;
    }

    const submitData = {
      ...formData,
      amenities: filteredAmenities
    };

    try {
      const url = editingAmenity 
        ? `${API_BASE_URL}/api/admin/amenities/${editingAmenity._id}`
        : `${API_BASE_URL}/api/admin/amenities`;
      
      const method = editingAmenity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: editingAmenity 
            ? 'Amenity updated successfully!' 
            : 'New amenity created successfully!'
        });
        fetchAmenities();
        closeForm(); // Changed from closeModal
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Error submitting amenity:', err);
      addToast({
        type: 'error',
        message: err.message || 'Failed to save amenity. Please try again.'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this amenity? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/amenities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: 'Amenity deleted successfully!'
        });
        fetchAmenities();
      } else {
        throw new Error(data.error || 'Failed to delete amenity');
      }
    } catch (err) {
      console.error('Error deleting amenity:', err);
      addToast({
        type: 'error',
        message: err.message || 'Failed to delete amenity. Please try again.'
      });
    }
  };

  // Filter amenities based on search term and location
  const filteredAmenities = amenities.filter(amenity => {
    const matchesSearchTerm = searchTerm === '' || 
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.amenities.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === '' || 
      amenity.location.toLowerCase() === locationFilter.toLowerCase();
    
    return matchesSearchTerm && matchesLocation;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Villa Amenities Management</h1>
        <button
          onClick={() => {
            if (showForm && !editingAmenity) {
              setShowForm(false);
            } else {
              openForm();
            }
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md flex items-center"
        >
          {showForm && !editingAmenity ? (
            <>
              <XMarkIcon className="h-5 w-5 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-1" />
              Add New Amenity
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Amenity Form - Inline */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
            </h2>
            <button 
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Villa Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Amenities
                  </label>
                  <button
                    type="button"
                    onClick={addAmenityField}
                    className="text-yellow-600 hover:text-yellow-700 text-xs flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add More
                  </button>
                </div>

                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter amenity"
                    />
                    {formData.amenities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAmenityField(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  {editingAmenity ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search amenities..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content: Loading / Error / Empty State / Data Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading amenities...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAmenities}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : filteredAmenities.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm || locationFilter ? 'No matching amenities found' : 'No amenities found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || locationFilter ? 
              'Try adjusting your filters' : 
              'Get started by adding your first villa amenity'}
          </p>
          {!searchTerm && !locationFilter && !showForm && (
            <button
              onClick={() => openForm()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Amenity
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Villa Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmenities.map((amenity) => (
                <tr key={amenity._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-yellow-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{amenity.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-500">{amenity.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {amenity.amenities.map((item, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openForm(amenity)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(amenity._id)}
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
    </div>
  );
};

export default Amenities;