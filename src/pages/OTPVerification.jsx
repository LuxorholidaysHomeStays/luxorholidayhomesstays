import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShieldCheck, RefreshCw, Mail } from 'lucide-react';

const OTPVerification = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, verifyOTP } = useAuth();

  const email = location.state?.email || sessionStorage.getItem('verificationEmail') || '';

  useEffect(() => {
    if (!email) {
      toast.error('No email provided for verification');
      navigate('/sign-in');
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [error, setError] = useState('');
  const otpInputs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      otpInputs.current[5]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError('');

    const res = await sendOTP(email);
    setLoading(false);

    if (res.success) {
      setResendCooldown(60);
      toast.success(`A new verification code has been sent to ${email}`);
    } else {
      setError(res.message || 'Failed to resend OTP');
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);
    setError('');

    const res = await verifyOTP(email, fullOtp);
    setLoading(false);

    if (res.success) {
      toast.success('Your email has been verified successfully!');

      if (res.isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-stone-100 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center" data-aos="fade-down">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase">
            Luxor
          </h1>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-100">
          Verify Your Email
        </h2>
        <p className="mt-2 text-sm text-stone-400">
          Enter the 6-digit verification code sent to <br />
          <span className="text-amber-400 font-medium">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4" data-aos="fade-up">
        <div className="bg-stone-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-amber-500/20 sm:px-10">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-xl font-bold bg-stone-950 border border-stone-800 rounded-xl text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-amber-500/30 rounded-xl shadow-lg text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin text-stone-950" />
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Link to="/sign-in" className="text-stone-400 hover:text-amber-400">
                ← Back to Sign In
              </Link>
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendOTP}
                className="text-amber-400 hover:text-amber-300 font-medium disabled:text-stone-500 disabled:cursor-not-allowed transition-colors"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;