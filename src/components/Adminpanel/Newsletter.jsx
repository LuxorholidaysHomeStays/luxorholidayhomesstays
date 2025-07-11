import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { authToken } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/newsletter`, {
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
        setSubscribers(data.subscribers);
      } else {
        throw new Error(data.error || 'Failed to fetch subscribers');
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to fetch subscribers');
      addToast({
        type: 'error',
        message: 'Failed to load subscribers. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addToast({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: 'Subscriber added successfully!'
        });
        setEmail('');
        setShowModal(false);
        fetchSubscribers();
      } else {
        throw new Error(data.error || 'Failed to add subscriber');
      }
    } catch (err) {
      console.error('Error adding subscriber:', err);
      addToast({
        type: 'error',
        message: err.message || 'Failed to add subscriber. Please try again.'
      });
    }
  };

  const handleUpdateSubscriber = async (id, subscribed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletter/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscribed })
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          message: `Subscriber ${subscribed ? 'activated' : 'deactivated'} successfully!`
        });
        fetchSubscribers();
      } else {
        throw new Error(data.error || 'Failed to update subscriber');
      }
    } catch (err) {
      console.error('Error updating subscriber:', err);
      addToast({
        type: 'error',
        message: err.message || 'Failed to update subscriber. Please try again.'
      });
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscriber? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletter/${id}`, {
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
          message: 'Subscriber deleted successfully!'
        });
        fetchSubscribers();
      } else {
        throw new Error(data.error || 'Failed to delete subscriber');
      }
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      addToast({
        type: 'error',
        message: err.message || 'Failed to delete subscriber. Please try again.'
      });
    }
  };

  const exportSubscribers = () => {
    window.open(`${API_BASE_URL}/api/admin/newsletter/export/csv`);
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Subscriber
          </button>
          <button
            onClick={exportSubscribers}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search subscribers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading subscribers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchSubscribers}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">
            {searchTerm ? 'No subscribers matching your search.' : 'No subscribers found. Add your first subscriber!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-yellow-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{subscriber.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscriber.subscribed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.subscribed ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleUpdateSubscriber(subscriber._id, !subscriber.subscribed)}
                      className={`mr-3 ${
                        subscriber.subscribed
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {subscriber.subscribed ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber._id)}
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

      {/* Modal for Add Subscriber */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Subscriber</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;