import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MapPin, X } from 'lucide-react';

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
  
  // New state variables for OTP verification
  const [phoneOtpMode, setPhoneOtpMode] = useState(false);
  const [emailOtpMode, setEmailOtpMode] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneVerificationSuccess, setPhoneVerificationSuccess] = useState(false);
  const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false);
  
  // State for address map modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
      
      // Try to fetch phone user data if email exists
      let phoneFromPhoneUser = '';
      if (data.user.email) {
        try {
          const phoneUserResponse = await fetch(`${API_BASE_URL}/api/phone-users/by-email/${data.user.email}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (phoneUserResponse.ok) {
            const phoneUserData = await phoneUserResponse.json();
            if (phoneUserData && phoneUserData.phoneUser && phoneUserData.phoneUser.phone) {
              phoneFromPhoneUser = phoneUserData.phoneUser.phone;
              console.log('Found phone number from PhoneUser:', phoneFromPhoneUser);
            }
          }
        } catch (phoneError) {
          console.error('Error fetching phone user data:', phoneError);
        }
      }
      
      // Update state with profile data, prioritize phone from PhoneUser if available
      setProfileData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: phoneFromPhoneUser || data.user.phone || '',
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
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/bookings/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Ensure proper structure for address data
        const processedBookings = (data.bookings || []).map(booking => {
          // Make sure address is properly structured
          if (booking && !booking.address) {
            booking.address = {
              street: '',
              city: '',
              state: '',
              country: '',
              zipCode: ''
            };
          }
          return booking;
        });
        
        setBookings(processedBookings);
        console.log('Bookings loaded from API:', processedBookings);
      } else {
        console.log('No bookings found or API not available, loading sample data');
        loadSampleBookings();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Bookings',
        text: 'Could not load your bookings. Using sample data instead.',
        confirmButtonColor: '#ca8a04'
      });
      loadSampleBookings();
    } finally {
      setLoading(false);
    }
  };


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
        location: 'Chennai',
        address: {
          street: '123 Heritage Lane',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          zipCode: '600001'
        }
      },
      {
        _id: 'booking_002',
        propertyName: 'Amrith Palace',
        status: 'completed',
        checkIn: '2024-06-10',
        checkOut: '2024-06-13',
        totalAmount: 18000,
        guests: 2,
        location: 'Pondicherry',
        address: {
          street: '456 Beach Road',
          city: 'Pondicherry',
          state: 'Puducherry',
          country: 'India',
          zipCode: '605001'
        }
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
      location: 'Chennai',
      address: {
        street: '789 East Coast Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        zipCode: '600041'
      }
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
      // Log for debugging
      console.log("Auth token:", authToken);
      console.log("Profile data to update:", profileData);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData)
      });
      
      // Log the response status
      console.log("Update response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log("Update successful:", data);
      
      // Show success toast or message
      // ...
      setEditMode(false); // <-- This ensures the UI returns to view mode
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error toast or message
      // ...
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

  // Functions for phone number verification
  const startPhoneVerification = async () => {
    if (!newPhone) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a valid phone number',
        confirmButtonColor: '#ca8a04'
      });
      return;
    }
    
    setSendingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ phone: newPhone })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'A verification code has been sent to your phone number',
        confirmButtonColor: '#ca8a04'
      });
      
      setPhoneOtpMode(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to send OTP. Please try again.',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!otpCode) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter the verification code',
        confirmButtonColor: '#ca8a04'
      });
      return;
    }
    
    setVerifyingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          phone: newPhone,
          otp: otpCode 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify OTP');
      }
      
      // Update the profile data with the new verified phone number
      setProfileData(prev => ({
        ...prev,
        phone: newPhone
      }));
      
      // Save to profile
      await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone: newPhone
        })
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Verified!',
        text: profileData.phone ? 'Your phone number has been updated successfully' : 'Your phone number has been added and verified',
        confirmButtonColor: '#ca8a04'
      });
      
      setPhoneOtpMode(false);
      setPhoneVerificationSuccess(true);
      setOtpCode('');
      setNewPhone('');
      
      // Reset after a moment
      setTimeout(() => {
        setPhoneVerificationSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.message || 'Invalid verification code. Please try again.',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Functions for email verification
  const startEmailVerification = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#ca8a04'
      });
      return;
    }
    
    setSendingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ email: newEmail })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'A verification code has been sent to your email address',
        confirmButtonColor: '#ca8a04'
      });
      
      setEmailOtpMode(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to send OTP. Please try again.',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!otpCode) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter the verification code',
        confirmButtonColor: '#ca8a04'
      });
      return;
    }
    
    setVerifyingOtp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          email: newEmail,
          otp: otpCode 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify OTP');
      }
      
      // Update the profile data with the new verified email
      setProfileData(prev => ({
        ...prev,
        email: newEmail
      }));
      
      // Also update in AuthContext if applicable
      if (setUserData) {
        setUserData(prev => ({
          ...prev,
          email: newEmail
        }));
      }
      
      // Save to profile
      await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: newEmail
        })
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Verified!',
        text: 'Your email has been verified and updated',
        confirmButtonColor: '#ca8a04'
      });
      
      setEmailOtpMode(false);
      setEmailVerificationSuccess(true);
      setOtpCode('');
      setNewEmail('');
      
      // Reset after a moment
      setTimeout(() => {
        setEmailVerificationSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.message || 'Invalid verification code. Please try again.',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setVerifyingOtp(false);
    }
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

  // Open the address modal with the selected booking
  const openAddressModal = (booking) => {
    setSelectedBooking(booking);
    setShowAddressModal(true);
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

  // Try multiple sources for email
  const displayEmail = profileData.email || userData?.email || '';

  return (
    <>
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
                    <p className="text-yellow-100 text-sm">{displayEmail}</p>
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
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="flex flex-col">
                            <input
                              type="email"
                              id="email"
                              className="w-full px-4 py-3 border rounded-lg transition-colors border-gray-200 bg-gray-50"
                              value={displayEmail}
                              disabled
                            />
                            {!emailOtpMode && (
                              <button 
                                type="button"
                                onClick={() => setEmailOtpMode(true)}
                                className="mt-2 w-full md:w-auto text-sm bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors"
                              >
                                Change Email
                              </button>
                            )}
                          </div>
                          
                          {emailOtpMode && (
                            <div className="mt-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                              <h4 className="font-medium text-yellow-800 mb-3">Change Email Address</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">New Email Address</label>
                                  <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter new email address"
                                  />
                                </div>
                                
                                {!emailVerificationSuccess && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={startEmailVerification}
                                      disabled={sendingOtp || !newEmail}
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 text-sm"
                                    >
                                      {sendingOtp ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEmailOtpMode(false)}
                                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                                
                                {emailVerificationSuccess && (
                                  <div className="text-green-600 flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Email verified successfully!
                                  </div>
                                )}
                                
                                {/* OTP input field */}
                                {emailOtpMode && (
                                  <div className="mt-3">
                                    <label className="block text-sm text-gray-600 mb-1">Verification Code</label>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter code"
                                      />
                                      <button
                                        type="button"
                                        onClick={verifyEmailOtp}
                                        disabled={verifyingOtp || !otpCode}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
                                      >
                                        {verifyingOtp ? 'Verifying...' : 'Verify'}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="flex flex-col">
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              disabled
                              className="w-full px-4 py-3 border rounded-lg transition-colors border-gray-200 bg-gray-50"
                              placeholder="No phone number added"
                            />
                            {!profileData.phone && (
                              <p className="text-xs text-yellow-600 mt-1">
                                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Please add your phone number for account security
                              </p>
                            )}
                            {!phoneOtpMode && (
                              <button 
                                type="button"
                                onClick={() => setPhoneOtpMode(true)}
                                className="mt-2 w-full md:w-auto text-sm bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors"
                              >
                                {profileData.phone ? 'Change Phone Number' : 'Add Phone Number & Verify'}
                              </button>
                            )}
                          </div>
                          
                          {phoneOtpMode && (
                            <div className="mt-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                              <h4 className="font-medium text-yellow-800 mb-3">
                                {profileData.phone ? 'Change Phone Number' : 'Add & Verify Phone Number'}
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">New Phone Number</label>
                                  <input
                                    type="tel"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter new phone number"
                                  />
                                </div>
                                
                                {!phoneVerificationSuccess && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={startPhoneVerification}
                                      disabled={sendingOtp || !newPhone}
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 text-sm"
                                    >
                                      {sendingOtp ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setPhoneOtpMode(false)}
                                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                                
                                {phoneVerificationSuccess && (
                                  <div className="text-green-600 flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {profileData.phone ? 'Phone number changed successfully!' : 'Phone number added and verified!'}
                                  </div>
                                )}
                                
                                {/* OTP input field */}
                                {phoneOtpMode && (
                                  <div className="mt-3">
                                    <label className="block text-sm text-gray-600 mb-1">Verification Code</label>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter code"
                                      />
                                      <button
                                        type="button"
                                        onClick={verifyPhoneOtp}
                                        disabled={verifyingOtp || !otpCode}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
                                      >
                                        {verifyingOtp ? 'Verifying...' : 'Verify'}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
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
                            
                            <div className="mt-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                              {booking.guests && (
                                <div>
                                  <p className="text-gray-500">Guests: <span className="font-medium">{booking.guests}</span></p>
                                </div>
                              )}
                              
                              {booking.location && (
                                <div>
                                  <p className="text-gray-500">Location: <span className="font-medium">{booking.location}</span></p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center justify-between">
                                <p className="text-gray-700 font-medium mb-1">Address Details</p>
                                {booking.address && (booking.address.street || booking.address.city) && (
                                  <button 
                                    onClick={() => openAddressModal(booking)} 
                                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center hover:bg-yellow-200 transition-colors"
                                  >
                                    <MapPin className="w-3 h-3 mr-1" />
                                    View Details
                                  </button>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {booking.address && booking.address.street && (
                                  <p className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{booking.address.street}</span>
                                  </p>
                                )}
                                
                                {booking.address && ((booking.address.city && booking.address.state) || booking.address.zipCode) && (
                                  <p className="flex items-start mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>
                                      {[
                                        booking.address.city,
                                        booking.address.state,
                                        booking.address.zipCode
                                      ].filter(Boolean).join(', ')}
                                    </span>
                                  </p>
                                )}
                                
                                {booking.address && booking.address.country && (
                                  <p className="flex items-start mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{booking.address.country}</span>
                                  </p>
                                )}
                                
                                {(!booking.address || (!booking.address.street && !booking.address.city && !booking.address.state && !booking.address.country)) && (
                                  <p className="italic text-gray-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    No address information provided
                                  </p>
                                )}
                              </div>
                            </div>
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
      
      {/* Address Modal */}
      {showAddressModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" 
            data-aos="zoom-in"
            data-aos-duration="300"
          >
            <div className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white flex justify-between items-center">
              <h3 className="font-semibold">Address Details</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">{selectedBooking.propertyName}</h4>
              <p className="text-sm text-gray-500 mb-4">Booking ID: {selectedBooking._id || selectedBooking.id}</p>
              
              <div className="space-y-3 mb-6">
                {/* Address Fields */}
                {selectedBooking.address?.street && (
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <MapPin className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Street Address</p>
                      <p className="text-sm font-medium">{selectedBooking.address.street}</p>
                    </div>
                  </div>
                )}
                
                {(selectedBooking.address?.city || selectedBooking.address?.state) && (
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">City/State</p>
                      <p className="text-sm font-medium">
                        {[
                          selectedBooking.address?.city,
                          selectedBooking.address?.state
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedBooking.address?.zipCode && (
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ZIP/Postal Code</p>
                      <p className="text-sm font-medium">{selectedBooking.address.zipCode}</p>
                    </div>
                  </div>
                )}
                
                {selectedBooking.address?.country && (
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Country</p>
                      <p className="text-sm font-medium">{selectedBooking.address.country}</p>
                    </div>
                  </div>
                )}
                
                {/* If no address details are available */}
                {(!selectedBooking.address || 
                  (!selectedBooking.address.street && 
                   !selectedBooking.address.city && 
                   !selectedBooking.address.state && 
                   !selectedBooking.address.country)) && (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-500">No address information provided for this booking</p>
                  </div>
                )}
              </div>
              
              {/* Simulate a map view */}
              {selectedBooking.address && (selectedBooking.address.street || selectedBooking.address.city) && (
                <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Address Map View</p>
                  <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
                    <p className="text-sm text-gray-500">
                      <MapPin className="w-5 h-5 inline mr-1" />
                      {[
                        selectedBooking.address.street,
                        selectedBooking.address.city,
                        selectedBooking.address.state,
                        selectedBooking.address.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Map view is simulated in this demo</p>
                </div>
              )}
              
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
