import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const VillaInfoManagement = () => {
  const [villaInfos, setVillaInfos] = useState([]);
  const [villas, setVillas] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVillaInfo, setEditingVillaInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    villaId: '',
    villaName: '',
    fullDescription: '',
    shortDescription: '',
    amenities: [],
    location: {
      address: '',
      coordinates: '',
      description: '',
      mapUrl: '',
      nearbyAttractions: []
    },
    weekdayPrice: 0,
    weekendPrice: 0,
    maxGuests: 0,
    securityDeposit: 0,
    bedrooms: 0,
    bathrooms: 0,
    images: []
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [nearbyAttraction, setNearbyAttraction] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { authToken } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch villa infos, villas, and amenities in parallel
      const [villaInfosResponse, villasResponse, amenitiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/villa-info`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/api/villas`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/api/amenities`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (!villaInfosResponse.ok || !villasResponse.ok || !amenitiesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [villaInfosData, villasData, amenitiesData] = await Promise.all([
        villaInfosResponse.json(),
        villasResponse.json(),
        amenitiesResponse.json()
      ]);

      setVillaInfos(villaInfosData);
      setVillas(villasData);
      setAmenities(amenitiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast({
        type: 'error',
        message: 'Failed to load data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAmenityChange = (amenityName) => {
    if (formData.amenities.includes(amenityName)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenityName)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityName]
      });
    }
  };

  const handleVillaSelect = (e) => {
    const villaId = e.target.value;
    const selectedVilla = villas.find(v => v._id === villaId);
    
    if (selectedVilla) {
      setFormData({
        ...formData,
        villaId: selectedVilla._id,
        villaName: selectedVilla.name,
        weekdayPrice: selectedVilla.price || 0,
        weekendPrice: selectedVilla.weekendPrice || 0,
        maxGuests: selectedVilla.maxGuests || 0,
        bedrooms: selectedVilla.bedrooms || 0,
        bathrooms: selectedVilla.bathrooms || 0,
      });
    }
  };

  const addNearbyAttraction = () => {
    if (nearbyAttraction.trim()) {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          nearbyAttractions: [...formData.location.nearbyAttractions, nearbyAttraction.trim()]
        }
      });
      setNearbyAttraction('');
    }
  };

  const removeNearbyAttraction = (index) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        nearbyAttractions: formData.location.nearbyAttractions.filter((_, i) => i !== index)
      }
    });
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVillaInfo
        ? `${API_BASE_URL}/api/villa-info/${editingVillaInfo._id}`
        : `${API_BASE_URL}/api/villa-info`;
      
      const method = editingVillaInfo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingVillaInfo ? 'update' : 'create'} villa info`);
      }

      addToast({
        type: 'success',
        message: `Villa information ${editingVillaInfo ? 'updated' : 'created'} successfully!`,
      });
      
      closeModal();
      fetchData();
    } catch (error) {
      console.error(`Error ${editingVillaInfo ? 'updating' : 'creating'} villa info:`, error);
      addToast({
        type: 'error',
        message: error.message || `Failed to ${editingVillaInfo ? 'update' : 'create'} villa info. Please try again.`,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/villa-info/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete villa info');
      }

      addToast({
        type: 'success',
        message: 'Villa information deleted successfully!',
      });
      
      setDeleteConfirmation(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting villa info:', error);
      addToast({
        type: 'error',
        message: 'Failed to delete villa information. Please try again.',
      });
    }
  };

  const openEditModal = (villaInfo) => {
    setEditingVillaInfo(villaInfo);
    setFormData({
      villaId: villaInfo.villaId,
      villaName: villaInfo.villaName,
      fullDescription: villaInfo.fullDescription || '',
      shortDescription: villaInfo.shortDescription || '',
      amenities: villaInfo.amenities || [],
      location: {
        address: villaInfo.location?.address || '',
        coordinates: villaInfo.location?.coordinates || '',
        description: villaInfo.location?.description || '',
        mapUrl: villaInfo.location?.mapUrl || '',
        nearbyAttractions: villaInfo.location?.nearbyAttractions || []
      },
      weekdayPrice: villaInfo.weekdayPrice || 0,
      weekendPrice: villaInfo.weekendPrice || 0,
      maxGuests: villaInfo.maxGuests || 0,
      securityDeposit: villaInfo.securityDeposit || 0,
      bedrooms: villaInfo.bedrooms || 0,
      bathrooms: villaInfo.bathrooms || 0,
      images: villaInfo.images || []
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingVillaInfo(null);
    setFormData({
      villaId: '',
      villaName: '',
      fullDescription: '',
      shortDescription: '',
      amenities: [],
      location: {
        address: '',
        coordinates: '',
        description: '',
        mapUrl: '',
        nearbyAttractions: []
      },
      weekdayPrice: 0,
      weekendPrice: 0,
      maxGuests: 0,
      securityDeposit: 0,
      bedrooms: 0,
      bathrooms: 0,
      images: []
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVillaInfo(null);
    setActiveTab('basic');
  };

  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  const filteredVillaInfos = villaInfos.filter(
    (villaInfo) => villaInfo.villaName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Villa Information Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Villa Information
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by villa name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Villa Info List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading villa information...</p>
        </div>
      ) : filteredVillaInfos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No villa information found. {searchTerm && 'Try a different search term.'}</p>
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
                  Pricing
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVillaInfos.map((villaInfo) => (
                <tr key={villaInfo._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{villaInfo.villaName}</div>
                    <div className="text-sm text-gray-500">
                      {villaInfo.bedrooms} bed • {villaInfo.bathrooms} bath • {villaInfo.maxGuests} guests
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {villaInfo.location?.address || 'No address specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Weekday: ₹{villaInfo.weekdayPrice?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-gray-900">
                      Weekend: ₹{villaInfo.weekendPrice?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {villaInfo.amenities?.length || 0} amenities
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(villaInfo)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(villaInfo)}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl mx-4 my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVillaInfo ? `Edit ${editingVillaInfo.villaName} Information` : 'Create New Villa Information'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`py-3 px-4 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'basic'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <HomeIcon className="h-5 w-5 inline mr-2" />
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-3 px-4 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'description'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`py-3 px-4 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'location'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MapPinIcon className="h-5 w-5 inline mr-2" />
                  Location
                </button>
                <button
                  onClick={() => setActiveTab('amenities')}
                  className={`py-3 px-4 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'amenities'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <HomeIcon className="h-5 w-5 inline mr-2" />
                  Amenities
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`py-3 px-4 text-center border-b-2 text-sm font-medium ${
                    activeTab === 'images'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <PhotoIcon className="h-5 w-5 inline mr-2" />
                  Images
                </button>
              </nav>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Villa Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {!editingVillaInfo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Villa *
                        </label>
                        <select
                          value={formData.villaId}
                          onChange={handleVillaSelect}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="">-- Select a Villa --</option>
                          {villas.map((villa) => (
                            <option key={villa._id} value={villa._id}>
                              {villa.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Villa Name *
                      </label>
                      <input
                        type="text"
                        name="villaName"
                        value={formData.villaName}
                        onChange={handleInputChange}
                        required
                        disabled={!!formData.villaId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weekday Price (₹)
                      </label>
                      <input
                        type="number"
                        name="weekdayPrice"
                        value={formData.weekdayPrice}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weekend Price (₹)
                      </label>
                      <input
                        type="number"
                        name="weekendPrice"
                        value={formData.weekendPrice}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security Deposit (₹)
                      </label>
                      <input
                        type="number"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Guests
                      </label>
                      <input
                        type="number"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Villa Description</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Brief description of the villa (for listings)"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description
                    </label>
                    <textarea
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Detailed description of the villa (for villa details page)"
                    ></textarea>
                  </div>
                </div>
              )}
              
              {/* Location Tab */}
              {activeTab === 'location' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Villa Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coordinates (lat, long)
                      </label>
                      <input
                        type="text"
                        name="location.coordinates"
                        value={formData.location.coordinates}
                        onChange={handleInputChange}
                        placeholder="e.g., 12.9716,77.5946"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Maps URL
                      </label>
                      <input
                        type="text"
                        name="location.mapUrl"
                        value={formData.location.mapUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Description
                      </label>
                      <textarea
                        name="location.description"
                        value={formData.location.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Description of the location, proximity to landmarks, etc."
                      ></textarea>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nearby Attractions
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={nearbyAttraction}
                          onChange={(e) => setNearbyAttraction(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Add a nearby attraction"
                        />
                        <button
                          type="button"
                          onClick={addNearbyAttraction}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.location.nearbyAttractions.map((attraction, index) => (
                          <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                            <span className="text-sm">{attraction}</span>
                            <button
                              type="button"
                              onClick={() => removeNearbyAttraction(index)}
                              className="ml-2 text-gray-500 hover:text-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Villa Amenities</h3>
                  {Object.keys(groupedAmenities).length === 0 ? (
                    <p className="text-gray-600 mb-2">No amenities available. Please add amenities first.</p>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
                        <div key={category}>
                          <h4 className="text-md font-medium mb-2 text-gray-700">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {categoryAmenities.map((amenity) => (
                              <label key={amenity._id} className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={formData.amenities.includes(amenity.name)}
                                  onChange={() => handleAmenityChange(amenity.name)}
                                  className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-900">{amenity.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Images Tab */}
              {activeTab === 'images' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Villa Images</h3>
                  <div className="mb-4">
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Image URL"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                      >
                        Add Image
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Add image URLs for the villa. These will be displayed in the villa details page.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Villa image ${index + 1}`}
                            className="w-full h-40 object-cover rounded-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
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
                  {editingVillaInfo ? 'Update' : 'Create'}
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
              Are you sure you want to delete information for villa "{deleteConfirmation.villaName}"? This action cannot be undone.
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

export default VillaInfoManagement;
