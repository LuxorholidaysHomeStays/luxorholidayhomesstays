import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  UserIcon,
  CurrencyRupeeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const CancelRequestsManagement = () => {
  const [cancelRequests, setCancelRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { authToken } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchCancelRequests();
  }, []);

  const fetchCancelRequests = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/cancel-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cancellation requests');
      }

      const data = await response.json();
      setCancelRequests(data.requests);
    } catch (error) {
      console.error('Error fetching cancellation requests:', error);
      addToast({
        type: 'error',
        message: 'Failed to load cancellation requests. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
    setAdminResponse('');
  };

  const handleProcessRequest = async (status) => {
    if (processingAction) return;
    
    try {
      setProcessingAction(true);
      
      const response = await fetch(`${API_BASE_URL}/api/cancel-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminResponse,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process cancellation request');
      }

      const data = await response.json();
      
      // Update the request in the list
      setCancelRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, status, adminResponse, adminActionDate: new Date() } 
            : req
        )
      );

      addToast({
        type: 'success',
        message: `Cancellation request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`,
      });
      
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error processing cancellation request:', error);
      addToast({
        type: 'error',
        message: `Failed to ${status} cancellation request. Please try again.`,
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "N/A";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysUntilCheckIn = (checkIn) => {
    if (!checkIn) return "N/A";
    const start = new Date();
    const end = new Date(checkIn);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter cancel requests based on status
  const filteredRequests = cancelRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  }).filter(request => {
    // Search filter
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.userEmail?.toLowerCase().includes(searchLower) ||
      request.villaName?.toLowerCase().includes(searchLower) ||
      request._id.toLowerCase().includes(searchLower) ||
      request.bookingId?._id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cancellation Requests Management</h1>
        <button
          onClick={fetchCancelRequests}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {/* Filter and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${filter === 'approved' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-md ${filter === 'rejected' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Rejected
          </button>
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Search by email, villa name, or ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Cancel Requests Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading cancellation requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No cancellation requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Villa & User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{request._id.substring(0, 8).toUpperCase()}</div>
                    <div className="text-sm text-gray-500">Booking #{request.bookingId?._id.substring(0, 6)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.villaName || 'Unknown Villa'}</div>
                    <div className="text-sm text-gray-500">{request.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm text-gray-500">
                      <span>{request.checkIn ? new Date(request.checkIn).toLocaleDateString() : 'N/A'}</span>
                      <span>to</span>
                      <span>{request.checkOut ? new Date(request.checkOut).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewRequestDetails(request)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Cancellation Request Details
              </h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              {getStatusBadge(selectedRequest.status)}
              {selectedRequest.status !== 'pending' && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Processed on:</span> {formatDate(selectedRequest.adminActionDate)}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Request Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Request Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Requested on</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Reason for cancellation</p>
                      <p className="text-sm text-gray-600">{selectedRequest.reason || 'No reason provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Guest Email</p>
                      <p className="text-sm text-gray-600">{selectedRequest.userEmail}</p>
                    </div>
                  </div>
                  {selectedRequest.adminResponse && selectedRequest.status !== 'pending' && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">Admin Response</p>
                        <p className="text-sm text-gray-600">{selectedRequest.adminResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Booking Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <HomeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Villa</p>
                      <p className="text-sm text-gray-600">{selectedRequest.villaName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Stay Duration</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedRequest.checkIn).split(',')[0]} to {formatDate(selectedRequest.checkOut).split(',')[0]}
                        <span className="block text-xs">
                          ({calculateDays(selectedRequest.checkIn, selectedRequest.checkOut)} nights)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Days until check-in</p>
                      <p className="text-sm text-gray-600">
                        {calculateDaysUntilCheckIn(selectedRequest.checkIn)} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CurrencyRupeeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Refund Amount</p>
                      <p className="text-sm text-gray-600">
                        ₹{selectedRequest.refundAmount.toLocaleString()} ({selectedRequest.refundPercentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Admin Response Section */}
            {selectedRequest.status === 'pending' && (
              <div className="mb-6">
                <label htmlFor="adminResponse" className="block text-sm font-medium text-gray-700 mb-1">
                  Response to Guest (optional)
                </label>
                <textarea
                  id="adminResponse"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter a response for the guest..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">This message will be sent to the guest via email.</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleProcessRequest('rejected')}
                    disabled={processingAction}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                  >
                    {processingAction ? 'Processing...' : 'Reject Cancellation'}
                  </button>
                  <button
                    onClick={() => handleProcessRequest('approved')}
                    disabled={processingAction}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md disabled:opacity-50"
                  >
                    {processingAction ? 'Processing...' : 'Approve Cancellation'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelRequestsManagement;