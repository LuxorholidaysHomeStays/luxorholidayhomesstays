import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle, CreditCard, Home } from 'lucide-react';

// Helper function to format time from 24-hour to 12-hour format
const formatTimeFor12Hour = (time24) => {
  if (!time24) return null; // Return null if no time
  
  try {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const minute = minutes || '00';
    
    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};

// Import villa images - same imports as in AllRooms.jsx
// Amrith Palace Images
import AP1 from "/AmrithPalace/AP8.jpg"
// East Coast Villa Images
import EC1 from "/eastcoastvilla/EC1.jpg"
// Empire Anand Villa Samudra Images
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
// Ram Water Villa Images
import RW1 from "/ramwatervilla/RW1.jpg"
import LAV1 from "/LavishVilla 1/lvone18.jpg"
import LAV2 from "/LavishVilla 2/lvtwo22.jpg"
import LAV3  from "/LavishVilla 3/lvthree5.jpg"

// Villa image mapping for each villa type
const villaImageMap = {
  "Amrith Palace": AP1,
  "East Coast Villa": EC1,
  "Empire Anand Villa Samudra": anandvilla1,
  "Ram Water Villa": RW1,
  "Lavish Villa I": LAV1,
  "Lavish Villa II": LAV2,
  "Lavish Villa III": LAV3,
  "default": AP1  // Default image if no match found
};

// Helper function to find the appropriate villa image
const getVillaImage = (villaName) => {
  if (!villaName) return villaImageMap.default;
  
  // Direct match
  if (villaImageMap[villaName]) {
    return villaImageMap[villaName];
  }
  
  // Case insensitive partial match
  const lowerName = villaName.toLowerCase();
  if (lowerName.includes('amrith') || lowerName.includes('palace')) {
    return villaImageMap["Amrith Palace"];
  } else if (lowerName.includes('east') || lowerName.includes('coast')) {
    return villaImageMap["East Coast Villa"];
  } else if (lowerName.includes('empire') || lowerName.includes('anand') || lowerName.includes('samudra')) {
    return villaImageMap["Empire Anand Villa Samudra"];
  } else if (lowerName.includes('ram') || lowerName.includes('water')) {
    return villaImageMap["Ram Water Villa"];
  } else if (lowerName.includes('lavish') && lowerName.includes('i')) {
    return villaImageMap["Lavish Villa I"];
  } else if (lowerName.includes('lavish') && lowerName.includes('ii')) {
    return villaImageMap["Lavish Villa II"];
  } else if (lowerName.includes('lavish') && lowerName.includes('iii')) {
    return villaImageMap["Lavish Villa III"];
  }
  
  return villaImageMap.default;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // New state for active filter
  const navigate = useNavigate();
  const { userData, authToken } = useAuth();

  useEffect(() => {
    // Check for authentication
    if (!authToken) {
      console.log("No auth token found, redirecting to sign-in");
      navigate('/sign-in');
      return;
    }
    fetchBookings();
  }, [authToken, navigate]);
  
  // Apply filter whenever bookings or activeFilter changes
  useEffect(() => {
    if (bookings.length > 0) {
      filterBookings(activeFilter);
    }
  }, [bookings, activeFilter]);

  // Update your fetchBookings function:
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get fresh token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log("Using auth token:", token.substring(0, 15) + "..."); // Debug token
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        
        // Handle token expiration
        if (response.status === 401) {
          // Clear invalid auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          
          // Force re-login
          throw new Error('Session expired. Please log in again.');
        } else {
          throw new Error(errorData.error || 'Failed to fetch bookings');
        }
      }
      
      const data = await response.json();
      console.log("Fetched bookings data:", data); // Debug log to see the actual structure
      const allBookings = data.bookings || [];
      setBookings(allBookings);
      setFilteredBookings(allBookings); // Initially show all bookings
    } catch (err) {
      console.log("Error fetching bookings:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // New function to filter bookings
  const filterBookings = (filterType) => {
    setActiveFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredBookings(bookings);
      return;
    }
    
    const filtered = bookings.filter(booking => booking.status === filterType);
    setFilteredBookings(filtered);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color based on booking status
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Get status icon based on booking status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Enhanced loading state with more feedback
  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mb-4"></div>
        <p className="text-yellow-600">Loading your booking details...</p>
      </div>
    );
  }

  // Enhanced error state with retry button
  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
        <div className="bg-white border border-red-200 p-6 rounded-xl text-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Bookings</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={fetchBookings} 
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors duration-300"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="bg-transparent border border-yellow-500 text-yellow-600 px-6 py-2 rounded hover:bg-yellow-50 transition-colors duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 md:px-16 lg:px-24 xl:px-32 pb-16 bg-gray-50 relative">
      {/* Light pattern overlay */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgNTIuNWwtNS01LTUtNSAxMC0xMCAxMCAxMC01IDV6IiBmaWxsPSIjMEYxNzJBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-start text-left mb-5">
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight">My Bookings</h1>
          <p className="text-gray-600 mt-2 md:text-lg">View and manage your luxury villa experiences</p>
        </div>

        {/* Filter buttons - NEW SECTION */}
        <div className="mb-6 bg-white p-3 rounded-lg shadow-sm flex flex-wrap gap-2 border border-gray-200">
          <button
            onClick={() => filterBookings('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeFilter === 'all' 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            All Bookings
          </button>
          
          <button
            onClick={() => filterBookings('confirmed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
              activeFilter === 'confirmed' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Confirmed
          </button>
          
          <button
            onClick={() => filterBookings('cancelled')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
              activeFilter === 'cancelled' 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" /> Cancelled
          </button>
          
          <button
            onClick={() => filterBookings('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
              activeFilter === 'completed' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Completed
          </button>
        </div>

        {/* Message when no bookings match the filter */}
        {bookings.length > 0 && filteredBookings.length === 0 && (
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-medium mb-4 text-gray-800">No {activeFilter} bookings found</h2>
            <p className="text-gray-600 mb-6">You don't have any bookings with {activeFilter} status.</p>
            <button 
              onClick={() => setActiveFilter('all')} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Show All Bookings
            </button>
          </div>
        )}

        {bookings.length === 0 && !loading ? (
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-medium mb-4 text-gray-800">No bookings found</h2>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button 
              onClick={() => navigate('/rooms')} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Browse Villas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
                <div className="md:flex">
                  {/* Villa Image */}
                  <div className="md:w-1/3 h-72 md:h-auto relative overflow-hidden">
                    <img 
                      src={getVillaImage(booking.villaName)} 
                      alt={booking.villaName || 'Villa'} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 m-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                    {/* Light gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="md:flex justify-between items-start">
                      <div>
                        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2 text-gray-800">{booking.villaName || 'Villa'}</h2>
                        <p className="text-gray-600 flex items-center mb-3">
                          <MapPin className="h-4 w-4 mr-1 text-yellow-600" />
                          {booking.location || 'Location not specified'}
                        </p>
                      </div>
                      
                      {/* Price Display */}
                      {booking.totalAmount > 0 && (
                        <div className="mt-2 md:mt-0 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg">
                          <div className="text-sm text-emerald-700 mb-1">Total</div>
                          <div className="text-lg font-bold text-gray-800">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Booking Information Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium text-gray-800">{formatDate(booking.checkIn)}</p>
                          {booking.checkInTime && (
                            <p className="text-xs text-gray-500">
                              {booking.checkInTime} ({formatTimeFor12Hour(booking.checkInTime)})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="font-medium text-gray-800">{formatDate(booking.checkOut)}</p>
                          {booking.checkOutTime && (
                            <p className="text-xs text-gray-500">
                              {booking.checkOutTime} ({formatTimeFor12Hour(booking.checkOutTime)})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100 sm:col-span-2 lg:col-span-1">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p className="font-medium text-gray-800">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                          {booking.infants > 0 && (
                            <p className="text-xs text-gray-500">+ {booking.infants} infant{booking.infants > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Booking Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500">Guest Name</p>
                        <p className="font-medium text-gray-800">{booking.guestName || 'Not specified'}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium text-gray-800">{booking.totalDays} {booking.totalDays === 1 ? 'Day' : 'Days'}</p>
                      </div>
                    </div>
                    
                    {/* Payment Info & Actions */}
                    <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-yellow-600" />
                        <span className="text-gray-600">{booking.paymentMethod || 'Payment method not specified'}</span>
                        {booking.isPaid && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => navigate(`/booking/${booking._id}`, { 
                            state: { 
                              bookingId: booking._id,
                              villaName: booking.villaName,
                              villaImage: getVillaImage(booking.villaName) 
                            }
                          })} 
                          className="flex-1 sm:flex-none bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;