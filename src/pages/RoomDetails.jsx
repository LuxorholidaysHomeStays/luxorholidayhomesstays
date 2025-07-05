import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import StarRating from '../components/StarRating';
import { facilityIcons } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import { empireAnandVillaImages } from '../assets/empireanandvilla';

const GalleryModal = ({ images, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
    <div className="relative bg-white p-4 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-black bg-white rounded-full p-2 text-3xl z-10 leading-none hover:bg-gray-200"
      >
        &times;
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Gallery view ${index + 1}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
        ))}
      </div>
    </div>
  </div>
);

const RoomDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [guests, setGuests] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Pay At Hotel');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const { userData, authToken } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const initialGuests = searchParams.get('guests');

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights();
  
  useEffect(() => {
    if (initialGuests) {
      setGuests(Number(initialGuests));
    }
    
    if (id) {
      fetchRoomDetails(id);
    } else {
      setError("No room ID provided");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (room) {
      const isEmpireVilla = room.hotel.name === "Empire Anand Villa Samudra";
      const images = isEmpireVilla ? empireAnandVillaImages : room.images;
      if (images && images.length > 0) {
        setMainImage(images[0]);
      } else {
        setMainImage(null); // Or a fallback image
      }
    }
  }, [room]);
  
  const fetchRoomDetails = async (roomId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch room details: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.hotel || !data.hotel._id) {
        throw new Error("Room data is missing hotel information");
      }
      setRoom(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookNow = async () => {
    if (!userData || !authToken) {
      alert("Please log in to book a room");
      return navigate('/login');
    }
    if (!checkIn || !checkOut || nights === 0) {
      alert("Please select check-in and check-out dates");
      return;
    }
    setIsBookingLoading(true);
    setBookingError(null);
    try {
      const basePrice = parseInt(room.pricePerNight.replace(/,/g, ''));
      const totalPrice = basePrice * nights * 1.18;
      let userEmail = userData?.email || localStorage.getItem('userEmail') || prompt("Please enter your email address:");
      if (!userEmail) throw new Error("Email is required for booking");
      const bookingData = {
        userId: userData?._id,
        roomId: room?._id,
        hotelId: room?.hotel?._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: Math.round(totalPrice),
        guests,
        paymentMethod,
        isPaid: paymentMethod !== 'Pay At Hotel',
        userEmail,
        userName: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'Guest'
      };
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to book room");
      setBookingSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 3000);
    } catch (error) {
      setBookingError(error.message || "An error occurred");
    } finally {
      setIsBookingLoading(false);
    }
  };
  
  const formatPrice = (price) => {
    if (!price) return "0";
    return Number(price).toLocaleString('en-IN');
  };

  if (loading) return <div className="min-h-screen pt-28 flex justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div></div>;
  if (error) return <div className="min-h-screen pt-28 px-4"><div className="bg-red-50 p-6 rounded-xl text-red-700"><h2 className="text-2xl font-bold mb-4">Error</h2><p>{error}</p><button onClick={() => navigate(-1)} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded">Go Back</button></div></div>;
  if (!room) return <div className="min-h-screen pt-28 px-4"><div className="bg-yellow-50 p-6 rounded-xl text-yellow-700"><h2 className="text-2xl font-bold mb-4">Not Found</h2><p>Room not found.</p><button onClick={() => navigate('/rooms')} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded">View All Rooms</button></div></div>;

  const isEmpireVilla = room.hotel.name === "Empire Anand Villa Samudra";
  const displayImages = isEmpireVilla ? empireAnandVillaImages : room.images;

  return (
    <div className="min-h-screen pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {isGalleryOpen && <GalleryModal images={displayImages} onClose={() => setIsGalleryOpen(false)} />}
      
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-orange-500">Home</span>
        <span className="mx-2">/</span>
        <span className="text-orange-500">{room.roomType}</span>
      </div>
      
      <div className="mb-6">
        <h1 className="font-playfair text-3xl md:text-4xl">{room.roomType}</h1>
        <div className="flex items-center gap-1 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-gray-500">{room.hotel.address}, {room.hotel.city}</span>
        </div>
      </div>
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">
        <div className="cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
            <img src={displayImages[0]} alt={room.roomType} className="w-full h-[410px] object-cover rounded-l-xl" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {displayImages.slice(1, 5).map((img, index) => (
            <div key={index} className="cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
              <img src={img} alt={`Room view ${index + 1}`} className={`w-full h-52 object-cover ${index === 1 ? 'rounded-tr-xl' : ''} ${index === 3 ? 'rounded-br-xl' : ''}`} />
            </div>
          ))}
        </div>
        {isEmpireVilla && (
          <button onClick={() => setIsGalleryOpen(true)} className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 font-semibold">
            View All Photos
          </button>
        )}
      </div>
      
      {bookingSuccess && <div className="mb-8 bg-green-50 p-6 rounded-xl text-green-700"><h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2><p>Redirecting to your bookings...</p></div>}
      {bookingError && <div className="mb-8 bg-red-50 p-6 rounded-xl text-red-700"><h2 className="text-2xl font-bold mb-4">Booking Failed</h2><p>{bookingError}</p></div>}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border">
            <h2 className="font-playfair text-2xl mb-4">About this Villa</h2>
            <p className="text-gray-600 mb-6">{room.description}</p>
            <h3 className="font-medium text-lg mb-3">Villa Amenities</h3>
            <div className="flex flex-wrap gap-4">
              {room.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                  <img src={facilityIcons[amenity]} alt={amenity} className="w-5 h-5" onError={(e) => e.target.style.display = 'none'} />
                  <p className="text-sm">{amenity}</p>
                </div>
              )) || <p>No amenities listed.</p>}
            </div>
             {isEmpireVilla && (
                <div className="mt-8">
                    <button
                        onClick={() => navigate(`/villas/${room.hotel._id}/rooms`)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        View All Rooms in this Villa
                    </button>
                </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border sticky top-32">
            <h2 className="font-medium text-xl mb-4 pb-4 border-b">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Check-in</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={checkIn || ''} onChange={(e) => navigate(`/rooms/${id}?checkIn=${e.target.value}&checkOut=${checkOut||''}&guests=${guests}`)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Check-out</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={checkOut || ''} onChange={(e) => navigate(`/rooms/${id}?checkIn=${checkIn||''}&checkOut=${e.target.value}&guests=${guests}`)} min={checkIn || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Guests</label>
              <select className="w-full border rounded px-3 py-2" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <div className="border-t py-4 my-4">
              <div className="flex justify-between mb-2"><span>Room Charge:</span><span>₹{formatPrice(room.pricePerNight)} × {nights} night{nights !== 1 && 's'}</span></div>
              <div className="flex justify-between mb-2"><span>Taxes & Fees (18%):</span><span>₹{formatPrice(parseInt(room.pricePerNight.replace(/,/g, '')) * nights * 0.18)}</span></div>
              <div className="flex justify-between font-bold text-lg mt-4"><span>Total Amount:</span><span>₹{formatPrice(parseInt(room.pricePerNight.replace(/,/g, '')) * nights * 1.18)}</span></div>
            </div>
            <button onClick={handleBookNow} disabled={!checkIn || !checkOut || nights === 0 || isBookingLoading} className={`w-full py-3 rounded-md text-white font-medium mt-2 ${!checkIn || !checkOut || nights === 0 || isBookingLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>
             {isBookingLoading ? 'Processing...' : 'Book Now'}
            </button>
            {(!checkIn || !checkOut) && <p className="text-xs text-center mt-2 text-red-600">Please select check-in and check-out dates</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;