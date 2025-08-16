import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaCalendarAlt, FaPercent, FaRupeeSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    villaName: '',
    offerAmount: '',
    offerDateFrom: '',
    offerDateTo: '',
    title: 'Special Offer',
    description: '',
    isActive: true
  });

  const { authToken } = useAuth();

  // Fetch offers
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/offers`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      } else {
        throw new Error('Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      Swal.fire('Error', 'Failed to fetch offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch villas
  const fetchVillas = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/villas`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVillas(data.villas || []);
      } else {
        throw new Error('Failed to fetch villas');
      }
    } catch (error) {
      console.error('Error fetching villas:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchVillas();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingOffer 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/offers/${editingOffer._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/admin/offers`;
      
      const method = editingOffer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire('Success', `Offer ${editingOffer ? 'updated' : 'created'} successfully`, 'success');
        setShowModal(false);
        setEditingOffer(null);
        resetForm();
        fetchOffers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save offer');
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (offerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the offer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/offers/${offerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Offer has been deleted.', 'success');
          fetchOffers();
        } else {
          throw new Error('Failed to delete offer');
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
        Swal.fire('Error', 'Failed to delete offer', 'error');
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (offerId, currentStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        Swal.fire('Success', `Offer ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
        fetchOffers();
      } else {
        throw new Error('Failed to update offer status');
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
      Swal.fire('Error', 'Failed to update offer status', 'error');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      villaName: '',
      offerAmount: '',
      offerDateFrom: '',
      offerDateTo: '',
      title: 'Special Offer',
      description: '',
      isActive: true
    });
  };

  // Handle edit
  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      villaName: offer.villaName || '',
      offerAmount: offer.offerAmount || '',
      offerDateFrom: offer.offerDateFrom ? new Date(offer.offerDateFrom).toISOString().split('T')[0] : '',
      offerDateTo: offer.offerDateTo ? new Date(offer.offerDateTo).toISOString().split('T')[0] : '',
      title: offer.title || 'Special Offer',
      description: offer.description || '',
      isActive: offer.isActive !== undefined ? offer.isActive : true
    });
    setShowModal(true);
  };

  // Get villa name by ID
  const getVillaName = (villaName) => {
    return villaName || 'Unknown Villa';
  };

  // Get villa pricing for strikethrough display
  const getVillaPricing = (villaName) => {
    const villa = villas.find(v => v.name && v.name.toLowerCase().includes(villaName.toLowerCase()));
    if (villa) {
      return {
        weekdayPrice: villa.price || villa.weekdayPrice || 0,
        weekendPrice: villa.weekendPrice || villa.weekendprice || 0
      };
    }
    return { weekdayPrice: 0, weekendPrice: 0 };
  };

  // Calculate offer pricing
  const calculateOfferPrice = (originalPrice, offer) => {
    const discount = offer.offerAmount || 0;
    return Math.max(0, originalPrice - discount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offers Management</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingOffer(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add New Offer
        </button>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No offers found. Create your first offer!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Villa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => {
                  const villaName = getVillaName(offer.villaName);
                  const pricing = getVillaPricing(offer.villaName);
                  const weekdayOfferPrice = calculateOfferPrice(pricing.weekdayPrice, offer);
                  const weekendOfferPrice = calculateOfferPrice(pricing.weekendPrice, offer);

                  return (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{villaName}</div>
                        <div className="text-sm text-gray-500">{offer.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="text-gray-500">Weekday: </span>
                            <span className="line-through text-red-500">₹{pricing.weekdayPrice.toLocaleString()}</span>
                            <span className="ml-2 text-green-600 font-semibold">₹{weekdayOfferPrice.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Weekend: </span>
                            <span className="line-through text-red-500">₹{pricing.weekendPrice.toLocaleString()}</span>
                            <span className="ml-2 text-green-600 font-semibold">₹{weekendOfferPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center text-green-600">
                            <FaRupeeSign className="mr-1" />
                            {offer.offerAmount?.toLocaleString()} off
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{formatDate(offer.offerDateFrom)}</div>
                        <div className="text-gray-500">to {formatDate(offer.offerDateTo)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {offer.title || 'Special Offer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(offer._id, offer.isActive)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            offer.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {offer.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit Offer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(offer._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Offer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Offer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Villa Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Villa Name</label>
                  <select
                    value={formData.villaName}
                    onChange={(e) => setFormData({...formData, villaName: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Villa</option>
                    {villas.map((villa) => (
                      <option key={villa._id} value={villa.name}>
                        {villa.name} - ₹{villa.price || villa.weekdayPrice || 0}/night
                      </option>
                    ))}
                  </select>
                </div>

                {/* Offer Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.offerAmount}
                    onChange={(e) => setFormData({...formData, offerAmount: e.target.value})}
                    placeholder="Enter amount to discount"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Valid From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={formData.offerDateFrom}
                    onChange={(e) => setFormData({...formData, offerDateFrom: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Valid To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                  <input
                    type="date"
                    value={formData.offerDateTo}
                    onChange={(e) => setFormData({...formData, offerDateTo: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter offer title"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter offer description"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingOffer(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;
