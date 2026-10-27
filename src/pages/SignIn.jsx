import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

const SignIn = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
    });
  }, []);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isRedirectFromBooking = searchParams.get('redirect') === 'booking';

  const otpInputRefs = useRef([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from || (isRedirectFromBooking ? '/booking-review' : '/');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isRedirectFromBooking]);

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    const res = await sendOTP(email);
    setLoading(false);

    if (res.success) {
      setStep(2);
      setResendCooldown(60);
      toast.success(`Verification code sent to ${email}`);
    } else {
      setError(res.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
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
      toast.success('Signed in successfully!');

      if (res.isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        const redirectPath = location.state?.from || (isRedirectFromBooking ? '/booking-review' : '/');
        navigate(redirectPath, { replace: true });
      }
    } else {
      setError(res.message || 'Invalid or expired OTP code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 px-4 py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Indicator if redirected from booking */}
      {isRedirectFromBooking && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-900 border border-yellow-300 px-4 py-2 rounded-full text-sm font-semibold shadow-md z-20">
          🔑 Sign in with your email to continue your booking
        </div>
      )}

      {/* Main Split Auth Container */}
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-100">
        
        {/* Left Side: Auth Form */}
        <div className="bg-white w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-between" data-aos="fade-right">
          <div>
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-yellow-600 transition-colors">
                <svg className="w-5 h-5 mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {step === 1 ? 'Sign in with your email to access your account' : `Enter the 6-digit code sent to ${email}`}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm" data-aos="fade-up">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div data-aos="fade-up">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="name@example.com"
                      className="pl-11 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mr-2"
                    />
                    Remember me
                  </label>
                  <span className="text-xs text-yellow-600 hover:text-yellow-700 cursor-pointer">
                    Need help?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3 text-center">
                    6-Digit Verification Code
                  </label>
                  <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-bold bg-white border border-gray-300 rounded-lg text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-gray-500 hover:text-yellow-600 cursor-pointer"
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleSendOTP}
                    className="text-yellow-600 hover:text-yellow-700 font-medium disabled:text-gray-400 flex items-center gap-1 cursor-pointer"
                  >
                    {resendCooldown > 0 ? (
                      `Resend in ${resendCooldown}s`
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3" />
                        <span>Resend OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                By continuing, you agree to Luxor's{' '}
                <Link to="/si" className="text-yellow-600 hover:underline">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Luxury Banner Image & Social Proof */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')`,
          }}
          data-aos="fade-left"
        >
          <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 lg:p-12">
            <div className="text-white" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-bold mb-2">Luxurious Villa Experiences</h3>
              <p className="text-gray-200 text-xs mb-6 leading-relaxed">
                Experience the finest luxury villas and exceptional service with Luxor Holiday Home Stays.
              </p>
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <img
                        src="/logo.png"
                        alt={`User ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-gray-100">Joined by 10,000+ customers</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;