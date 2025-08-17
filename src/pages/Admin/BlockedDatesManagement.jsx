import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Save, Trash2, AlertCircle, Check, Clock, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

const BlockedDatesManagement = () => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVilla, setSelectedVilla] = useState('all');
  
  // Form state for adding new blocked dates
  const [newBlockedDate, setNewBlockedDate] = useState({
    villaId: '',
    villaName: '',
    startDate: '',
    endDate: '',
    reason: 'Maintenance',
    description: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://luxorstay-backend.vercel.app';

  useEffect(() => {
    fetchVillas();
    fetchBlockedDates();
  }, []);

  const fetchVillas = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/villas`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVillas(data);
      } else {
        console.error('Failed to fetch villas');
      }
    } catch (error) {
      console.error('Error fetching villas:', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/blocked-dates`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data.blockedDates || []);
      } else {
        throw new Error('Failed to fetch blocked dates');
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch blocked dates. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlockedDate = async () => {
    // Validation
    if (!newBlockedDate.villaId || !newBlockedDate.startDate || !newBlockedDate.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (new Date(newBlockedDate.startDate) > new Date(newBlockedDate.endDate)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date Range',
        text: 'End date must be after start date.',
      });
      return;
    }

    if (new Date(newBlockedDate.startDate) < new Date()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Cannot block dates in the past.',
      });
      return;
    }

    try {
      setSaving(true);
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/blocked-dates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlockedDate),
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Blocked date(s) added successfully.',
        });
        
        // Reset form
        setNewBlockedDate({
          villaId: '',
          villaName: '',
          startDate: '',
          endDate: '',
          reason: 'Maintenance',
          description: ''
        });
        
        // Refresh the list
        fetchBlockedDates();
      } else {
        const errorData = await response.json();
        
        // Check if it's a conflict with existing bookings
        if (response.status === 409 && errorData.conflictingBookings) {
          const bookingsList = errorData.conflictingBookings
            .map(booking => `• ${booking.guestName} (${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()})`)
            .join('\n');
          
          Swal.fire({
            icon: 'error',
            title: 'Cannot Block Dates',
            html: `
              <div style="text-align: left;">
                <p>${errorData.message}</p>
                <br>
                <strong>Conflicting Bookings:</strong>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px;">${bookingsList}</pre>
              </div>
            `,
            customClass: {
              htmlContainer: 'text-left'
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorData.message || 'Failed to add blocked date. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Error adding blocked date:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add blocked date. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlockedDate = async (blockedDateId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the blocked date and allow bookings for this period.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, unblock it!'
    });

    if (result.isConfirmed) {
      try {
        const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/api/admin/blocked-dates/${blockedDateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Blocked date has been removed.',
          });
          fetchBlockedDates();
        } else {
          throw new Error('Failed to delete blocked date');
        }
      } catch (error) {
        console.error('Error deleting blocked date:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete blocked date. Please try again.',
        });
      }
    }
  };

  const handleVillaChange = (villaId) => {
    const villa = villas.find(v => v._id === villaId);
    setNewBlockedDate({
      ...newBlockedDate,
      villaId: villaId,
      villaName: villa ? villa.name : ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  // Filter blocked dates based on search and villa selection
  const filteredBlockedDates = blockedDates.filter(blockedDate => {
    const matchesSearch = blockedDate.villaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blockedDate.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blockedDate.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVilla = selectedVilla === 'all' || blockedDate.villaId === selectedVilla;
    
    return matchesSearch && matchesVilla;
  });

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < now) {
      return 'bg-gray-100 text-gray-600'; // Past
    } else if (start <= now && end >= now) {
      return 'bg-red-100 text-red-600'; // Active
    } else {
      return 'bg-yellow-100 text-yellow-600'; // Future
    }
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < now) {
      return 'Past';
    } else if (start <= now && end >= now) {
      return 'Active';
    } else {
      return 'Scheduled';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blocked dates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocked Dates Management</h1>
          <p className="text-gray-600">Block specific dates to prevent bookings for maintenance, events, or other reasons.</p>
        </div>

        {/* Add New Blocked Date Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-yellow-600" />
            Block New Dates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Villa *
              </label>
              <select
                value={newBlockedDate.villaId}
                onChange={(e) => handleVillaChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="">Select a villa</option>
                {villas.map((villa) => (
                  <option key={villa._id} value={villa._id}>
                    {villa.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={newBlockedDate.startDate}
                onChange={(e) => setNewBlockedDate({...newBlockedDate, startDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={newBlockedDate.endDate}
                onChange={(e) => setNewBlockedDate({...newBlockedDate, endDate: e.target.value})}
                min={newBlockedDate.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <select
                value={newBlockedDate.reason}
                onChange={(e) => setNewBlockedDate({...newBlockedDate, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Private Event">Private Event</option>
                <option value="Renovation">Renovation</option>
                <option value="Owner Use">Owner Use</option>
                <option value="Seasonal Closure">Seasonal Closure</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={newBlockedDate.description}
                onChange={(e) => setNewBlockedDate({...newBlockedDate, description: e.target.value})}
                placeholder="Additional details about the blocking reason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddBlockedDate}
            disabled={saving}
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Block Dates
              </>
            )}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by villa name, reason, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedVilla}
                  onChange={(e) => setSelectedVilla(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">All Villas</option>
                  {villas.map((villa) => (
                    <option key={villa._id} value={villa._id}>
                      {villa.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blocked Dates List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-yellow-600" />
              Blocked Dates ({filteredBlockedDates.length})
            </h2>
          </div>

          {filteredBlockedDates.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blocked dates found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedVilla !== 'all' 
                  ? 'No blocked dates match your search criteria.' 
                  : 'Start by blocking some dates to prevent bookings during maintenance or events.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Villa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlockedDates.map((blockedDate) => (
                    <tr key={blockedDate._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {blockedDate.villaName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(blockedDate.startDate)}
                          {blockedDate.startDate !== blockedDate.endDate && (
                            <> - {formatDate(blockedDate.endDate)}</>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getDaysCount(blockedDate.startDate, blockedDate.endDate)} day{getDaysCount(blockedDate.startDate, blockedDate.endDate) > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{blockedDate.reason}</div>
                        {blockedDate.description && (
                          <div className="text-sm text-gray-500">{blockedDate.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blockedDate.startDate, blockedDate.endDate)}`}>
                          {getStatusText(blockedDate.startDate, blockedDate.endDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteBlockedDate(blockedDate._id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedDatesManagement;
