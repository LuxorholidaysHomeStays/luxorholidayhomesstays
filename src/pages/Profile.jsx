import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const navigate = useNavigate();
  const { authToken, userData, setUserData } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to view your profile.',
        confirmButtonColor: '#ca8a04'
      }).then(() => {
        navigate('/sign-in');
      });
      return;
    }
    
    fetchUserProfile();
    fetchUserBookings();
  }, [authToken, navigate]);

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      
      // Update state with profile data
      setProfileData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        city: data.user.city || '',
        state: data.user.state || '',
        zipCode: data.user.zipCode || '',
        profileImage: data.user.profileImage || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings from API
  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        console.log('Bookings loaded from API:', data.bookings);
      } else {
        console.log('No bookings found or API not available, loading sample data');
        loadSampleBookings();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      loadSampleBookings();
    }
  };

  // Load sample bookings for demo purposes
  const loadSampleBookings = () => {
    const sampleBookings = [
      {
        _id: 'booking_001',
        propertyName: 'Luxor Heritage Villa',
        status: 'confirmed',
        checkIn: '2024-07-15',
        checkOut: '2024-07-18',
        totalAmount: 25000,
        guests: 4,
        location: 'Chennai'
      },
      {
        _id: 'booking_002',
        propertyName: 'Amrith Palace',
        status: 'completed',
        checkIn: '2024-06-10',
        checkOut: '2024-06-13',
        totalAmount: 18000,
        guests: 2,
        location: 'Pondicherry'
      }
    ];
    
    setBookings(sampleBookings);
    console.log('Sample bookings loaded for demo');
  };

  // Add new booking (for demo purposes)
  const addSampleBooking = () => {
    const newBooking = {
      _id: `booking_${Date.now()}`,
      propertyName: 'East Coast Villa',
      status: 'pending',
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
      totalAmount: 32000,
      guests: 6,
      location: 'Chennai'
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    
    Swal.fire({
      icon: 'success',
      title: 'Sample Booking Added',
      text: 'Sample booking added for demonstration!',
      confirmButtonColor: '#ca8a04',
      timer: 2000
    });
  };

  // Handle profile update (API call to save in database)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Show success toast
      setEditMode(false);
      
      // Update user data in context if name changed
      if (userData && profileData.name !== userData.name) {
        setUserData({
          ...userData,
          name: profileData.name
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error toast
    } finally {
      setUpdating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload (API call to save in database)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Show error toast about file size
      return;
    }
    
    setUploadingImage(true);
    
    try {
      // Convert image to base64
      const base64 = await convertToBase64(file);
      
      // Update profile data with new image
      setProfileData({
        ...profileData,
        profileImage: base64
      });
      
      // Automatically save the image
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          profileImage: base64
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      // Show success toast
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Show error toast
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Reset form to original data (reload from API)
  const resetForm = () => {
    fetchUserProfile(); // Reload original data from API
    setEditMode(false);
  };

  // Generate profile initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get booking status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-yellow-700 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      {/* Profile Header with Golden Theme */}
      <div className="bg-white shadow-sm border-b-4 border-gradient-to-r from-yellow-400 to-yellow-600 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors group">
              <svg className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            
            {/* My Profile Title with Golden Accent */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
        
        {/* Golden Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg"></div>
      </div>

      {/* Main Content with Top Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-right">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
                <div className="text-center">
                  <div className="relative inline-block">
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white/20 object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/20">
                        {getInitials(profileData.name)}
                      </div>
                    )}
                    
                    {editMode && (
                      <div className="absolute -bottom-1 -right-1">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                          <div className="w-8 h-8 bg-white text-yellow-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                            {uploadingImage ? (
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">{profileData.name || 'User'}</h3>
                  <p className="text-yellow-100 text-sm">{profileData.email}</p>
                  {editMode && (
                    <p className="text-yellow-200 text-xs mt-1">Click camera icon to change photo</p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Details
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'bookings' 
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                    </svg>
                    My Bookings
                    {bookings.length > 0 && (
                      <span className="ml-auto bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                        {bookings.length}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-left">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={true} // Email should not be editable
                          className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg"
                          placeholder="Email address"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your address"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your city"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your state"
                        />
                      </div>

                      {/* ZIP Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            editMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                    </div>

                    {/* Current Profile Information Display */}
                    {!editMode && (
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-yellow-700">Phone:</span>
                            <span className="ml-2 text-gray-800">{profileData.phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-yellow-700">Address:</span>
                            <span className="ml-2 text-gray-800">{profileData.address || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-yellow-700">City:</span>
                            <span className="ml-2 text-gray-800">{profileData.city || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-yellow-700">State:</span>
                            <span className="ml-2 text-gray-800">{profileData.state || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {editMode && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updating}
                          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 transition-colors"
                        >
                          {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-left">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                      <p className="text-gray-600 mt-1">Manage and view your booking history</p>
                    </div>
                    <button
                      onClick={addSampleBooking}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Sample Booking
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-6">Start exploring our luxury properties and make your first booking!</p>
                      <Link 
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-colors"
                      >
                        Browse Properties
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {bookings.map((booking, index) => (
                        <div key={booking._id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName || 'Property Booking'}</h3>
                              <p className="text-gray-600">Booking ID: {booking._id || booking.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Pending'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Check-in</p>
                              <p className="font-medium">{formatDate(booking.checkIn)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Check-out</p>
                              <p className="font-medium">{formatDate(booking.checkOut)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Amount</p>
                              <p className="font-medium text-yellow-600">₹{booking.totalAmount || 0}</p>
                            </div>
                          </div>
                          
                          {booking.guests && (
                            <div className="mt-4 text-sm">
                              <p className="text-gray-500">Guests: <span className="font-medium">{booking.guests}</span></p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
