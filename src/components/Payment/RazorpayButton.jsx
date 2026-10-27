import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, requireApiBaseUrl } from '../../config/api';

const RazorpayButton = ({ amount, bookingData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { user, authToken } = useAuth();
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
      toast.error('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    setLoading(true);
    const token = authToken || localStorage.getItem('authToken');

    try {
      requireApiBaseUrl();

      // 1. Create a booking first if not already created
      let bookingId = bookingData?.bookingId || bookingData?._id || bookingData?.id;
      let bookingObj = bookingData;

      if (!bookingId) {
        const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...bookingData,
            status: 'pending',
            paymentStatus: 'pending'
          })
        });

        if (!bookingResponse.ok) {
          const error = await bookingResponse.json().catch(() => ({}));
          console.error('Booking creation failed:', error);
          throw new Error(error.error || error.message || 'Failed to create booking');
        }

        const bookingResult = await bookingResponse.json();
        bookingObj = bookingResult.booking || bookingResult.data || bookingResult;
        bookingId = bookingObj?.bookingId || bookingObj?._id || bookingObj?.id;
      }

      // 2. Create Razorpay order. The backend is the pricing authority: it ignores
      // any client-supplied amount and calculates the total from the booking or
      // from villa + dates, ensuring the displayed price matches what is charged.
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: String(bookingId),
          notes: {
            villaName: bookingObj?.villaName || '',
            guestName: bookingObj?.guestName || user?.name || ''
          }
        })
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'Failed to initialize payment gateway');
      }

      const orderData = await orderResponse.json();
      const order = orderData.order || orderData;

      // 3. Configure Razorpay checkout
      const options = {
        key: orderData.keyId || orderData.key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'LuxorStay Holiday Homes',
        description: `Booking payment for ${bookingObj?.villaName || 'Villa'}`,
        order_id: order.id,
        handler: async function(response) {
          try {
            // 4. Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                bookingId: String(bookingId),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json().catch(() => ({}));
              throw new Error(error.error || error.message || 'Payment verification failed');
            }

            const result = await verifyResponse.json();

            if (result.success === true) {
              onSuccess?.(result);
              toast.success('Payment successful! Your booking is confirmed.');
              navigate('/my-bookings');
            } else {
              throw new Error(result.error || result.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError?.(error);
            toast.error(error.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: bookingObj?.guestName || user?.name || '',
          email: bookingObj?.email || user?.email || '',
          contact: bookingObj?.phone || user?.phoneNumber || ''
        },
        theme: {
          color: '#D4AF37'
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
        toast.error(response.error.description || 'Payment was not completed successfully');
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error);
      toast.error(error.message || 'Something went wrong with the payment');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </span>
      ) : (
        `Pay Now ₹${amount?.toLocaleString()}`
      )}
    </button>
  );
};

export default RazorpayButton;
