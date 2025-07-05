import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle, CreditCard, Home } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Attempting to fetch bookings for user:", userData?.email);
      
      if (!userData?.email) {
        console.warn("User email not found in auth context");
      }
      
      // Add detailed logging for debugging
      console.log("Using auth token:", authToken ? `${authToken.substring(0, 15)}...` : "No token");
      
      // Try the endpoint specifically for user bookings
      const response = await fetch(`${API_BASE_URL}/api/bookings/user-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        // Log detailed error information
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        if (response.status === 401) {
          // Handle unauthorized error specifically
          throw new Error("Session expired. Please log in again.");
        } else {
          throw new Error(`Failed to fetch bookings (${response.status}): ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log("Bookings data received:", data);
      
      // Check if data is an array or has a bookings property
      const bookingsArray = Array.isArray(data) ? data : (data.bookings || []);
      
      if (bookingsArray.length === 0) {
        console.log("No bookings found for user");
      }
      
      // Transform the booking data to match the expected structure for rendering
      const transformedBookings = bookingsArray.map(booking => ({
        _id: booking._id || booking.id || 'unknown-id',
        status: booking.status || 'confirmed',
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        guests: booking.guests || 0,
        totalPrice: booking.totalAmount || 0,
        isPaid: booking.isPaid || false,
        paymentMethod: booking.paymentMethod || 'Online Payment',
        room: {
          _id: booking.villaId || 'unknown-villa',
          roomType: booking.villaName || 'Luxury Villa'
        },
        hotel: {
          name: booking.villaName || 'Luxor Villa',
          city: booking.location || 'Premium Location',
          image: getVillaImage(booking.villaName) // Add image to each booking
        }
      }));
      
      console.log("Transformed bookings:", transformedBookings);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || "Failed to load your bookings");
      
      if (error.message?.includes("Session expired")) {
        // Handle auth errors with a friendlier message
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
        <p className="text-emerald-600">Loading your booking details...</p>
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
              className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition-colors duration-300"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="bg-transparent border border-emerald-500 text-emerald-600 px-6 py-2 rounded hover:bg-emerald-50 transition-colors duration-300"
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
        <div className="flex flex-col items-start text-left mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight">My Bookings</h1>
          <p className="text-gray-600 mt-2 md:text-lg">View and manage your luxury villa experiences</p>
        </div>

      {bookings.length === 0 && !loading ? (
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-medium mb-4 text-gray-800">No bookings found</h2>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
          <button 
            onClick={() => navigate('/rooms')} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Browse Villas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
              <div className="md:flex">
                {/* Villa Image */}
                <div className="md:w-1/3 h-72 md:h-auto relative overflow-hidden">
                  <img 
                    src={booking.hotel.image || getVillaImage(booking.hotel.name)} 
                    alt={booking.hotel.name} 
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
                      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2 text-gray-800">{booking.room.roomType}</h2>
                      <p className="text-gray-600 flex items-center mb-3">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                        {booking.hotel.city}
                      </p>
                    </div>
                    
                    {/* Price Display */}
                    {booking.totalPrice > 0 && (
                      <div className="mt-2 md:mt-0 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg">
                        <div className="text-sm text-emerald-700 mb-1">Total</div>
                        <div className="text-lg font-bold text-gray-800">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Booking Information Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium text-gray-800">{formatDate(booking.checkInDate)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium text-gray-800">{formatDate(booking.checkOutDate)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100 sm:col-span-2 lg:col-span-1">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium text-gray-800">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Info & Actions */}
                  <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                      <span className="text-gray-600">{booking.paymentMethod}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => navigate(`/booking/${booking._id}`, { 
                          state: { 
                            bookingId: booking._id,
                            villaName: booking.hotel.name,
                            villaImage: booking.hotel.image || getVillaImage(booking.hotel.name) 
                          }
                        })} 
                        className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
                      >
                        View Details
                      </button>
                      
                      {booking.status === 'pending' && (
                        <button className="flex-1 sm:flex-none bg-transparent text-red-600 border border-red-200 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-300">
                          Cancel Booking
                        </button>
                      )}
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