import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const RazorpayButton = ({ amount, bookingData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          return resolve(true);
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      Swal.fire('Error', 'Payment gateway is still loading. Please try again in a moment.', 'error');
      return;
    }

    setLoading(true);

    try {
      // 1. Create a booking first
      const bookingResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...bookingData,
          status: 'pending_payment',
          paymentStatus: 'pending'
        })
      });

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json().catch(() => ({}));
        console.error('Booking creation failed:', error);
        throw new Error(error.message || 'Failed to create booking');
      }

      const booking = await bookingResponse.json().catch(error => {
        console.error('Failed to parse booking response:', error);
        throw new Error('Invalid booking response from server');
      });

      if (!booking || !booking._id) {
        console.error('Invalid booking data:', booking);
        throw new Error('Invalid booking data received from server');
      }

      console.log('Created booking:', booking._id);

      // 2. Create Razorpay order
      const orderData = {
        amount: Math.round(1 * 100), // Fixed 1 rupee for testing
        currency: 'INR',
        receipt: `test_${Date.now()}`,
        notes: {
          bookingId: booking._id,
          villaId: booking.villa?._id || booking.villaId,
          isTestPayment: true
        }
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json().catch(() => ({}));
        console.error('Order creation failed:', error);
        throw new Error(error.error || 'Failed to create payment order');
      }

      const order = await orderResponse.json();

      // 3. Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Luxor Villas',
        description: `Booking for ${booking.villa?.name || 'your villa'}`,
        order_id: order.id,
        handler: async function(response) {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id
              })
            });

            const result = await verifyResponse.json();

            if (result.success) {
              onSuccess?.(result);
              Swal.fire({
                title: 'Success!',
                text: 'Payment successful! Your booking is confirmed.',
                icon: 'success',
                confirmButtonText: 'View My Bookings'
              }).then(() => {
                navigate('/my-bookings');
              });
            } else {
              throw new Error(result.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError?.(error);
            Swal.fire({
              title: 'Error',
              text: error.message || 'Payment verification failed. Please contact support.',
              icon: 'error'
            });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: booking.guestName || user?.name || '',
          email: booking.email || user?.email || '',
          contact: booking.phone || user?.phone || ''
        },
        theme: {
          color: '#D4AF37' // Gold color to match Luxor theme
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function(response) {
        onError?.(response.error);
        Swal.fire({
          title: 'Payment Failed',
          text: response.error.description || 'Payment was not completed successfully',
          icon: 'error'
        });
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Something went wrong with the payment',
        icon: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className={`w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        `Pay Now ₹${(1).toLocaleString()}`
      )}
    </button>
  );
};

export default RazorpayButton;
