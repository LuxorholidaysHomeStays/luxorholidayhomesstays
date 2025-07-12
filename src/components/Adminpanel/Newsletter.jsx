import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Changed from modal to inline form
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const { authToken } = useAuth();
  
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduledAt: '',
    status: 'draft',
  });

  // Show success/error messages
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  useEffect(() => {
    fetchNewsletters();
  }, []);
  
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletters`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      
      const data = await response.json();
      setNewsletters(data.newsletters || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      showNotification('Error loading newsletters', 'error');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const resetForm = () => {
    setFormData({
      subject: '',
      content: '',
      scheduledAt: '',
      status: 'draft',
    });
    setEditingNewsletter(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const url = editingNewsletter
        ? `${API_BASE_URL}/api/admin/newsletters/${editingNewsletter._id}`
        : `${API_BASE_URL}/api/admin/newsletters`;
      
      const method = editingNewsletter ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.message || 'Failed to save newsletter');
      }
      
      showNotification(
        `Newsletter ${editingNewsletter ? 'updated' : 'created'} successfully!`,
        'success'
      );
      
      setShowForm(false);
      resetForm();
      fetchNewsletters();
    } catch (error) {
      console.error('Error saving newsletter:', error);
      showNotification(error.message || 'Failed to save newsletter', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      subject: newsletter.subject || '',
      content: newsletter.content || '',
      scheduledAt: newsletter.scheduledAt 
        ? new Date(newsletter.scheduledAt).toISOString().split('T')[0] 
        : '',
      status: newsletter.status || 'draft',
    });
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete newsletter');
      }
      
      showNotification('Newsletter deleted successfully!', 'success');
      setConfirmDelete(null);
      fetchNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      showNotification(error.message || 'Failed to delete newsletter', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleNewForm = () => {
    setShowForm(!showForm);
    resetForm();
  };
  
  // Filter newsletters based on search term
  const filteredNewsletters = newsletters.filter((newsletter) =>
    newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.status.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600">Create and manage newsletters for your subscribers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search newsletters..."
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={toggleNewForm}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors duration-300 flex items-center justify-center"
          >
            {showForm && !editingNewsletter ? (
              <>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Newsletter
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
      
      {/* Add/Edit Newsletter Form - Inline */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingNewsletter ? "Edit Newsletter" : "Create New Newsletter"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Newsletter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Newsletter content (HTML supported)"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Send Date (optional)
                  </label>
                  <input
                    type="date"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
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
                  {loading ? 'Saving...' : editingNewsletter ? 'Update Newsletter' : 'Create Newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newsletters List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && newsletters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                      <span>Loading newsletters...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredNewsletters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? (
                      <div>No newsletters matching your search</div>
                    ) : (
                      <div>
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 mb-4">No newsletters yet</p>
                        <button
                          onClick={toggleNewForm}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Create your first newsletter
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {newsletter.subject}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          newsletter.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : newsletter.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {newsletter.status === 'draft' && (
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-1.5"></span>
                        )}
                        {newsletter.status === 'scheduled' && (
                          <ClockIcon className="w-3.5 h-3.5 mr-1" />
                        )}
                        {newsletter.status === 'sent' && (
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                        )}
                        {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(newsletter.scheduledAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(newsletter.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(newsletter)}
                          className="p-1.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="Edit Newsletter"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(newsletter)}
                          className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Newsletter"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Newsletter</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the newsletter <span className="font-bold">{confirmDelete.subject}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;