// Frontend component (React)
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import Title from './Title';
import { API_BASE_URL } from "../config/api";

const NewsLetter = () => {
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [status, setStatus] = useState(''); // 'success', 'error', or ''
const [loading, setLoading] = useState(false);

const handleSubscribe = async (e) => {
e.preventDefault();
// Simple validation
if (!email || !email.includes('@')) {
setMessage('Please enter a valid email address');
setStatus('error');
return;
}
setLoading(true);
try {
const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ email }),
});
const data = await response.json();
if (response.ok) {
setMessage(data.message);
setStatus('success');
setEmail('');
} else {
setMessage(data.error || 'Subscription failed. Please try again.');
setStatus('error');
}
} catch (error) {
setMessage('Network error. Please try again later.');
setStatus('error');
} finally {
setLoading(false);
}
};

return (
<div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl md:rounded-3xl px-3 py-6 md:px-6 md:py-16 mx-2 lg:mx-auto my-30 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg shadow-xl border border-[#D4AF37]/20 animate-gradient-slow relative overflow-hidden transform hover:translate-y-[-2px] transition-all duration-700">
  {/* Animated gold glass elements */}
  <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[70%] rounded-full bg-[#D4AF37]/5 blur-3xl animate-pulse-slow"></div>
  <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#BFA181]/5 blur-3xl animate-float-slow"></div>
  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent backdrop-blur-[2px] z-0"></div>

  {/* Content */}
  <div className="relative z-10 w-full">
    {/* Mobile-optimized header */}
    <div className="text-center mb-3 md:mb-6 scale-in-center">
      <h2 className="text-xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#BFA181] mb-1.5 md:mb-3 tracking-tight">Stay Inspired</h2>
      <p className="text-gray-300 max-w-lg mx-auto px-1 md:px-4 text-xs md:text-base animate-fade-in leading-relaxed">
        Join our exclusive villa newsletter
      </p>
    </div>

    <form onSubmit={handleSubscribe} className="w-full flex flex-col items-center animate-slide-up">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-3 md:mt-6 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black/40 px-2.5 py-2 md:py-3 border border-[#D4AF37]/30 rounded-lg outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all w-full text-white placeholder-gray-400 backdrop-blur-sm transform hover:translate-y-[-1px] hover:shadow-[#D4AF37]/10 hover:shadow-lg text-xs md:text-base"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-1 md:gap-2 group bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] px-3 md:px-6 py-2 md:py-3 rounded-lg active:scale-95 transition-all duration-300 disabled:opacity-50 font-medium text-black shadow-lg hover:shadow-[#D4AF37]/30 hover:shadow-xl text-xs md:text-base w-full md:w-auto"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
          {!loading && (
            <span className="transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out">→</span>
          )}
        </button>
      </div>
      {message && (
        <div className={`mt-2 md:mt-4 px-2.5 py-1.5 md:px-4 md:py-3 rounded-lg ${
          status === 'success' 
            ? 'bg-black/50 text-[#D4AF37] border border-[#D4AF37]/30 animate-fade-in backdrop-blur-sm' 
            : 'bg-red-900/30 text-red-200 border border-red-900/30 animate-fade-in backdrop-blur-sm'
        }`}>
          <div className="text-xs md:text-base">{message}</div>
        </div>
      )}
    </form>
    <div className="mt-4 md:mt-8 pt-3 md:pt-6 border-t border-[#D4AF37]/10 w-full max-w-md mx-auto animate-fade-in-delayed">
      <p className="text-gray-500 text-[9px] md:text-xs text-center">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
    </div>
  </div>

  {/* Add the CSS animations */}
  <style jsx>{`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    @keyframes pulse-slow {
      0% { opacity: 0.2; }
      50% { opacity: 0.5; }
      100% { opacity: 0.2; }
    }
    @keyframes scale-in {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slide-up {
      0% { transform: translateY(5px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-gradient-slow {
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
    }
    .animate-float-slow {
      animation: float 10s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
    .scale-in-center {
      animation: scale-in 0.7s ease-out forwards;
    }
    .animate-slide-up {
      animation: slide-up 0.7s ease-out 0.2s forwards;
      opacity: 0;
    }
    .animate-fade-in {
      animation: fade-in 1s ease-out 0.4s forwards;
      opacity: 0;
    }
    .animate-fade-in-delayed {
      animation: fade-in 1s ease-out 0.8s forwards;
      opacity: 0;
    }
  `}</style>
</div>
);
};

export default NewsLetter;
