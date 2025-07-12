import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const ManualBooking = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedVillaDetails, setSelectedVillaDetails] = useState(null);
  const { authToken } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    villaId: '',
    villaName: '',
    email: '',
    guestName: '',
    checkIn: null,
    checkOut: null,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    guests: 1,
    infants: 0,
    totalAmount: 0,
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    paymentMethod: 'Pay at Hotel',
    isPaid: false,
    paymentId: '',
    notes: ''
  });

  // Fetch villas on component mount
  useEffect(() => {
    fetchVillas();
  }, []);

  // When villa is selected, fetch its blocked dates
  useEffect(() => {
    if (formData.villaId) {
      fetchVillaDetails(formData.villaId);
      fetchBlockedDates(formData.villaId);
    } else {
      setBlockedDates([]);
      setSelectedVillaDetails(null);
    }
  }, [formData.villaId]);

  // Calculate total days and amount when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && selectedVillaDetails) {
      calculateTotalAmount();
    }
  }, [formData.checkIn, formData.checkOut, selectedVillaDetails]);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/villas`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch villas');
      }

      const data = await response.json();
      setVillas(data.villas || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching villas:', error);
      addToast({
        type: 'error',
        message: 'Failed to load villas. Please try again.'
      });
      setLoading(false);
    }
  };

  const fetchVillaDetails = async (villaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/villas/${villaId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch villa details');
      }

      const data = await response.json();
      setSelectedVillaDetails(data.villa || data);
    } catch (error) {
      console.error('Error fetching villa details:', error);
      addToast({
        type: 'error',
        message: 'Failed to load villa details.'
      });
    }
  };

  // Update the fetchBlockedDates function
  const fetchBlockedDates = async (villaId) => {
    try {
      if (!villaId) {
        console.warn('Invalid villa ID: Empty or undefined');
        setBlockedDates([]);
        return;
      }

      console.log(`Fetching blocked dates for villa ${villaId}`);
      
      // Use the new endpoint specifically for manual bookings
      const response = await fetch(`${API_BASE_URL}/api/admin/manual-bookings/blocked-dates?villaId=${villaId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Try to parse error message
        let errorMessage = 'Failed to fetch blocked dates';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, just use status code
          errorMessage = `Server returned status ${response.status}`;
        }
        
        console.warn(errorMessage);
        setBlockedDates([]);
        addToast('Unable to load availability information', 'warning');
        return;
      }

      const data = await response.json();
      console.log('Blocked dates data received:', data);
      
      if (!data.success || !data.blockedDates) {
        console.warn('Invalid response format:', data);
        setBlockedDates([]);
        return;
      }
      
      // Convert blocked date ranges to actual date objects
      const blocked = [];
      if (data.blockedDates && data.blockedDates.length > 0) {
        data.blockedDates.forEach(range => {
          try {
            const start = new Date(range.checkIn);
            const end = new Date(range.checkOut);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              const dates = getDatesInRange(start, end);
              blocked.push(...dates);
            }
          } catch (error) {
            console.warn('Error processing date range:', error);
          }
        });
      }
      
      console.log(`Processed ${blocked.length} blocked dates for villa ${villaId}`);
      setBlockedDates(blocked);
      
      // If villa name is provided in the response, update it
      if (data.villaName) {
        setFormData(prev => ({
          ...prev,
          villaName: data.villaName
        }));
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      setBlockedDates([]);
      addToast('Failed to load availability information', 'error');
    }
  };

  // Helper to get all dates in a range
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Helper to determine if a date is a weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  // Calculate total amount based on weekday/weekend rates
  const calculateTotalAmount = () => {
    if (!formData.checkIn || !formData.checkOut || !selectedVillaDetails) return;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const dates = getDatesInRange(checkInDate, checkOutDate);
    
    // Remove the last day as you don't pay for checkout day
    dates.pop();
    
    let total = 0;
    let weekdayCount = 0;
    let weekendCount = 0;
    
    // Calculate based on weekday/weekend rates
    dates.forEach(date => {
      if (isWeekend(date)) {
        weekendCount++;
        total += selectedVillaDetails.weekendPrice || selectedVillaDetails.price * 1.2; // 20% more for weekends if not specified
      } else {
        weekdayCount++;
        total += selectedVillaDetails.weekdayPrice || selectedVillaDetails.price;
      }
    });
    
    // Add service charge and taxes
    const serviceCharge = Math.round(total * 0.05); // 5% service charge
    const tax = Math.round((total + serviceCharge) * 0.18); // 18% tax
    const finalTotal = Math.round(total + serviceCharge + tax);
    
    setFormData(prev => ({
      ...prev,
      totalAmount: finalTotal,
      // Store these for display purposes
      weekdayCount,
      weekendCount,
      basePrice: total,
      serviceCharge,
      tax
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    setAvailabilityChecked(false);
  };

  const handleVillaSelect = (e) => {
    const villaId = e.target.value;
    const selectedVilla = villas.find(villa => villa._id === villaId);
    
    setFormData(prev => ({
      ...prev,
      villaId,
      villaName: selectedVilla ? selectedVilla.name : ''
    }));
    
    setAvailabilityChecked(false);
  };

  // Check if a date should be disabled
  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => 
      date.getDate() === blockedDate.getDate() &&
      date.getMonth() === blockedDate.getMonth() &&
      date.getFullYear() === blockedDate.getFullYear()
    );
  };

  const checkAvailability = async () => {
    if (!formData.villaId || !formData.checkIn || !formData.checkOut) {
      addToast('Please select villa and dates to check availability', 'error');
      return;
    }

    try {
      setCheckingAvailability(true);
      
      const checkInDate = formData.checkIn.toISOString();
      const checkOutDate = formData.checkOut.toISOString();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/manual-bookings/check-availability?villaId=${formData.villaId}&checkIn=${checkInDate}&checkOut=${checkOutDate}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check availability');
      }

      setIsAvailable(data.isAvailable);
      setAvailabilityChecked(true);
      
      if (!data.isAvailable) {
        addToast('Villa is not available for the selected dates', 'error');
      } else {
        addToast('Villa is available for the selected dates', 'success');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      addToast(error.message || 'Failed to check availability. Please try again.', 'error');
      setAvailabilityChecked(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Update the handleSubmit function to handle the response better
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.villaId || !formData.email || !formData.guestName || !formData.checkIn || !formData.checkOut || !formData.guests) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (!availabilityChecked || !isAvailable) {
      addToast('Please check villa availability before booking', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Calculate total days for sending to the API
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const totalDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      // Format dates for API
      const bookingData = {
        ...formData,
        checkIn: formData.checkIn.toISOString(),
        checkOut: formData.checkOut.toISOString(),
        totalDays: totalDays,
        guests: parseInt(formData.guests),
        infants: parseInt(formData.infants || 0),
        totalAmount: parseInt(formData.totalAmount)
      };
      
      console.log('Sending booking data:', bookingData);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/manual-bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create booking');
      }

      console.log('Booking created:', data);
      
      // Show success message
      setSuccessMessage(`Booking created successfully! A confirmation email ${data.emailSent ? 'has been sent' : 'could not be sent'} to ${formData.email}.`);
      
      // Reset form
      setFormData({
        villaId: '',
        villaName: '',
        email: '',
        guestName: '',
        checkIn: null,
        checkOut: null,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        guests: 1,
        infants: 0,
        totalAmount: 0,
        address: {
          street: '',
          city: '',
          state: '',
          country: 'India',
          zipCode: ''
        },
        paymentMethod: 'Pay at Hotel',
        isPaid: false,
        paymentId: '',
        notes: ''
      });
      
      setAvailabilityChecked(false);
      setBlockedDates([]);
      
      addToast('Booking created successfully!', 'success');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error creating booking:', error);
      addToast(error.message || 'Failed to create booking. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create Manual Booking</h2>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
          <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Villa Selection Section */}
          <div className="lg:col-span-2 p-4 bg-gray-50 rounded-md border border-gray-200 mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HomeIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Villa Selection
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Villa *
                </label>
                <select
                  value={formData.villaId}
                  onChange={handleVillaSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">-- Select a Villa --</option>
                  {villas.map((villa) => (
                    <option key={villa._id} value={villa._id}>
                      {villa.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <div className="text-gray-700 w-full">
                  {selectedVillaDetails && (
                    <div className="text-sm bg-white p-3 border border-gray-200 rounded-md">
                      <p><span className="font-medium">Location:</span> {selectedVillaDetails.location}</p>
                      <div className="flex flex-col space-y-1 mt-2">
                        <p className="font-medium text-yellow-700">Pricing:</p>
                        <p>Weekday: ₹{(selectedVillaDetails.weekdayPrice || selectedVillaDetails.price).toLocaleString()}/night</p>
                        <p>Weekend: ₹{(selectedVillaDetails.weekendPrice || Math.round(selectedVillaDetails.price * 1.2)).toLocaleString()}/night</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Dates Section */}
          <div className="lg:col-span-2 p-4 bg-gray-50 rounded-md border border-gray-200 mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Booking Dates
            </h3>
            
            {blockedDates.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-amber-500" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Note: Blocked dates are shown in red in the calendar</p>
                  <p>These dates are already booked or blocked for maintenance.</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date *
                </label>
                <DatePicker
                  selected={formData.checkIn}
                  onChange={date => handleDateChange(date, 'checkIn')}
                  selectsStart
                  startDate={formData.checkIn}
                  endDate={formData.checkOut}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  filterDate={date => !isDateBlocked(date)}
                  highlightDates={[
                    {
                      dates: blockedDates,
                      className: 'blocked-date'
                    }
                  ]}
                  dayClassName={date => 
                    isDateBlocked(date) ? "text-red-500 bg-red-100 rounded" : undefined
                  }
                />
                <style jsx>{`
                  .blocked-date {
                    background-color: #fee2e2 !important;
                    color: #ef4444 !important;
                    text-decoration: line-through !important;
                  }
                `}</style>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date *
                </label>
                <DatePicker
                  selected={formData.checkOut}
                  onChange={date => handleDateChange(date, 'checkOut')}
                  selectsEnd
                  startDate={formData.checkIn}
                  endDate={formData.checkOut}
                  minDate={formData.checkIn || new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  filterDate={date => !isDateBlocked(date)}
                  highlightDates={[
                    {
                      dates: blockedDates,
                      className: 'blocked-date'
                    }
                  ]}
                  dayClassName={date => 
                    isDateBlocked(date) ? "text-red-500 bg-red-100 rounded" : undefined
                  }
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={checkAvailability}
                  disabled={!formData.villaId || !formData.checkIn || !formData.checkOut || checkingAvailability}
                  className={`w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    checkingAvailability 
                      ? 'bg-blue-400 cursor-wait'
                      : availabilityChecked
                        ? isAvailable
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } ${!formData.villaId || !formData.checkIn || !formData.checkOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {checkingAvailability ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking...
                    </span>
                  ) : availabilityChecked ? (
                    isAvailable ? (
                      <span className="flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <XCircleIcon className="h-5 w-5 mr-1" />
                        Not Available
                      </span>
                    )
                  ) : (
                    'Check Availability'
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Time
                </label>
                <select
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return `${hour}:00`;
                  }).map(time => (
                    <option key={time} value={time}>
                      {time} {parseInt(time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Time
                </label>
                <select
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return `${hour}:00`;
                  }).map(time => (
                    <option key={time} value={time}>
                      {time} {parseInt(time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Guest Information */}
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Guest Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Infants (under 2 years)
                  </label>
                  <input
                    type="number"
                    name="infants"
                    value={formData.infants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Guest Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CurrencyRupeeIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Payment Information
            </h3>
            
            {/* Show calculated price breakdown */}
            {formData.checkIn && formData.checkOut && selectedVillaDetails && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Price Breakdown</h4>
                <div className="space-y-1 text-sm">
                  {formData.weekdayCount > 0 && (
                    <div className="flex justify-between">
                      <span>Weekdays ({formData.weekdayCount} nights × ₹{(selectedVillaDetails.weekdayPrice || selectedVillaDetails.price).toLocaleString()})</span>
                      <span>₹{(formData.weekdayCount * (selectedVillaDetails.weekdayPrice || selectedVillaDetails.price)).toLocaleString()}</span>
                    </div>
                  )}
                  {formData.weekendCount > 0 && (
                    <div className="flex justify-between">
                      <span>Weekends ({formData.weekendCount} nights × ₹{(selectedVillaDetails.weekendPrice || Math.round(selectedVillaDetails.price * 1.2)).toLocaleString()})</span>
                      <span>₹{(formData.weekendCount * (selectedVillaDetails.weekendPrice || Math.round(selectedVillaDetails.price * 1.2))).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₹{formData.basePrice?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (5%)</span>
                    <span>₹{formData.serviceCharge?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (18%)</span>
                    <span>₹{formData.tax?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-blue-200 font-medium text-blue-800">
                    <span>Total Amount</span>
                    <span>₹{formData.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Pay at Hotel">Pay at Hotel</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                  Mark as Paid
                </label>
              </div>
              
              {formData.isPaid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment ID/Reference
                  </label>
                  <input
                    type="text"
                    name="paymentId"
                    value={formData.paymentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Transaction ID or reference number"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Notes */}
          <div className="lg:col-span-2 p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Any special requests or additional information..."
            ></textarea>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting || !availabilityChecked || !isAvailable}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              (!availabilityChecked || !isAvailable) 
                ? 'bg-gray-400 cursor-not-allowed' 
                : submitting 
                  ? 'bg-yellow-400 cursor-wait' 
                  : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Booking...
              </span>
            ) : 'Create Booking'}
          </button>
          
          {!availabilityChecked && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Please check villa availability before creating a booking
            </p>
          )}
          
          {availabilityChecked && !isAvailable && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Villa is not available for the selected dates. Please choose different dates.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ManualBooking;