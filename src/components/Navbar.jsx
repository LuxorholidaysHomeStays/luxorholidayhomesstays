import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

// Update the phone icon component with slightly smaller dimensions
const PhoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.9999 16.9201V19.9201C22.0011 20.1986 21.944 20.4743 21.8324 20.7294C21.7209 20.9846 21.5572 21.2137 21.352 21.402C21.1468 21.5902 20.9045 21.7336 20.6407 21.8228C20.3769 21.912 20.0973 21.9452 19.8199 21.9201C16.7428 21.5857 13.7869 20.5342 11.1899 18.8501C8.77376 17.3148 6.72527 15.2663 5.18993 12.8501C3.49991 10.2413 2.44818 7.27109 2.11993 4.1801C2.09494 3.90356 2.12781 3.62486 2.21643 3.36172C2.30506 3.09859 2.4475 2.85679 2.63476 2.65172C2.82202 2.44665 3.05012 2.28281 3.30421 2.17062C3.55829 2.05843 3.83299 2.00036 4.10993 2.0001H7.10993C7.59524 1.99532 8.06572 2.16718 8.43369 2.48363C8.80166 2.80008 9.04201 3.23954 9.10993 3.7201C9.23656 4.68016 9.47138 5.62282 9.80993 6.5301C9.94448 6.88802 9.9736 7.27701 9.89384 7.65098C9.81408 8.02494 9.6288 8.36821 9.35993 8.6401L8.08993 9.9101C9.51349 12.4136 11.5864 14.4865 14.0899 15.9101L15.3599 14.6401C15.6318 14.3712 15.9751 14.1859 16.349 14.1062C16.723 14.0264 17.112 14.0556 17.4699 14.1901C18.3772 14.5286 19.3199 14.7635 20.2799 14.8901C20.7657 14.9586 21.2093 15.2033 21.5265 15.5776C21.8436 15.9519 22.0121 16.4297 21.9999 16.9201Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
  </svg>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Villas', path: '/rooms' },
        { name: 'Contact', path: '/contact' },
        { name: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPhoneHovered, setIsPhoneHovered] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { authToken, userData, logout } = useAuth();
    const isSignedIn = !!authToken;
    
    // Check if the current user is admin
    const isAdmin = isSignedIn && userData && (userData.role === 'admin' || userData.email === 'adminluxor331');

    // Function to handle navigation with proper scroll behavior
    const handleNavigation = (path) => {
        // Only perform actions if path is different from current location
        if (path !== location.pathname) {
            // First scroll to top immediately
            window.scrollTo(0, 0);
            
            // Then navigate to the new route
            navigate(path);
            
            // Close mobile menu if open
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
            
            // Close user menu dropdown if open
            if (userMenuOpen) {
                setUserMenuOpen(false);
            }
        }
    }

    useEffect(() => {
        if (location.pathname !== '/') {
            setIsScrolled(true);
            return;
        } else {
            setIsScrolled(false);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    // Custom login handler
    const handleLogin = () => {
        navigate('/sign-in');
    };

    // User menu controls
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null); // Ref for the user menu dropdown
    const mobileMenuRef = useRef(null); // Separate ref for mobile menu dropdown

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Phone pulse animation classes - updated to golden colors
    const pulseClasses = isPhoneHovered ? 
        "animate-pulse ring-4 ring-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600" : 
        "bg-white/80 text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200";

    // Close user menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDesktopMenuClicked = userMenuRef.current && userMenuRef.current.contains(event.target);
            const isMobileMenuClicked = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
            const isAvatarClicked = event.target.closest('[data-menu-trigger="true"]');
            
            if (userMenuOpen && !isDesktopMenuClicked && !isMobileMenuClicked && !isAvatarClicked) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);
    
    // Close user menu when location changes
    useEffect(() => {
        if (userMenuOpen) {
            setUserMenuOpen(false);
        }
    }, [location.pathname]);

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
            isScrolled 
            ? "bg-gray-900/85 shadow-lg backdrop-blur-md py-2 md:py-3" 
            : "bg-gray-900/70 backdrop-blur-sm py-3 md:py-4"
        }`}>
            {/* Logo with text */}
            <div className="flex items-center gap-3">
                {/* Use handleNavigation instead of Link */}
                <div 
                    onClick={() => handleNavigation('/')} 
                    className="flex items-center gap-3 cursor-pointer relative z-10"
                >
                    <img src={assets.logo} alt="logo" className="h-14 md:h-16" />
                    <h1 className="text-xl md:text-2xl ml-2 font-bold font-playfair bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] drop-shadow-sm">
                        Luxor Holiday Home Stays
                    </h1>
                </div>
            </div>

            {/* Desktop Nav - Updated to show Dashboard only for admin */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8 relative z-10">
                {navLinks.map((link, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleNavigation(link.path)} 
                        className="group flex flex-col gap-0.5 text-white hover:text-[#BF953F] cursor-pointer relative z-10 font-medium transition-colors duration-300"
                    >
                        {link.name}
                        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#BF953F]" />
                    </div>
                ))}
                {isSignedIn && userData && !isAdmin && (
                    <div 
                        onClick={() => handleNavigation('/my-bookings')}
                        className="group flex flex-col gap-0.5 text-white hover:text-[#BF953F] cursor-pointer relative z-10 font-medium transition-colors duration-300"
                    >
                        My Bookings
                        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#BF953F]" />
                    </div>
                )}

                {/* Show Dashboard button for admin instead of My Bookings */}
                {isSignedIn && userData && isAdmin && (
                    <div 
                        onClick={() => handleNavigation('/dashboard')}
                        className="group flex flex-col gap-0.5 text-white hover:text-[#BF953F] cursor-pointer relative z-10 font-medium transition-colors duration-300"
                    >
                        Dashboard
                        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#BF953F]" />
                    </div>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-4 relative z-10">
                {/* Premium Phone Call Button - Golden Style with smaller size */}
                <a 
                    href="tel:+918015924647"
                    onMouseEnter={() => setIsPhoneHovered(true)}
                    onMouseLeave={() => setIsPhoneHovered(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-md border transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${pulseClasses}`}
                >
                    <div className={`rounded-full p-1 ${isPhoneHovered ? 'bg-gradient-to-r from-amber-300 to-amber-400' : 'bg-gradient-to-r from-amber-100 to-amber-200'} transition-all duration-300 shadow-inner`}>
                        <div className="text-amber-700">
                            <PhoneIcon />
                        </div>
                    </div>
                    <span className={`font-medium text-sm ${isPhoneHovered ? 'text-amber-800' : 'text-amber-700'} hidden sm:block transition-all duration-300`}>+91 8015924647</span>
                    <div className={`absolute inset-0 rounded-full ${isPhoneHovered ? 'bg-gradient-to-r from-amber-200/50 to-amber-100/50' : 'bg-gradient-to-r from-transparent to-transparent'} -z-10 transition-all duration-300`}></div>
                </a>

                {/* Remove search icon as requested */}
                
                {isSignedIn && userData ? (
                    <div className="relative">
                        <div 
                            data-menu-trigger="true"
                            className="flex items-center gap-2 cursor-pointer group relative"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            title="Profile"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] p-0.5 overflow-hidden flex items-center justify-center shadow-md">
                                {userData.profileImageUrl ? (
                                    <img src={userData.profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="bg-gray-900 rounded-full w-full h-full flex items-center justify-center">
                                        <span className="text-[#BF953F] font-bold text-lg">
                                            {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 
                                             userData.name ? userData.name.charAt(0).toUpperCase() : 
                                             userData.email ? userData.email.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-white">{userData.firstName || userData.name || userData.email}</span>
                            <span className="absolute -bottom-6 left-5 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Profile</span>
                        </div>
                        
                        {userMenuOpen && (
                            <div ref={userMenuRef} className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-20 ring-1 ring-[#BF953F]/20">
                                <button
                                    onClick={() => setUserMenuOpen(false)}
                                    className="absolute top-2 right-2 p-1 rounded-full text-white hover:text-[#BF953F] transition-colors"
                                >
                                    <CloseIcon />
                                </button>
                                {!isAdmin && (
                                    <div 
                                        className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            handleNavigation('/my-bookings');
                                        }}
                                    >
                                        <BookIcon />
                                        <span>My Bookings</span>
                                    </div>
                                )}
                                
                                {isAdmin && (
                                    <div 
                                        className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            handleNavigation('/dashboard');
                                        }}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 4H20V10H14V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 14H20V20H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>Dashboard</span>
                                    </div>
                                )}
                                <div 
                                    className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        handleNavigation('/profile');
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>My Profile</span>
                                </div>
                                <hr className="my-1 border-[#BF953F]/20" />
                                <div 
                                    className="px-4 py-2 text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={handleLogin} 
                        className="bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] hover:from-[#FCF6BA] hover:to-[#BF953F] text-gray-900 px-6 py-2 rounded-full ml-4 transition-all duration-300 shadow-md font-medium border border-[#AA771C]"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden relative z-10">
                {isSignedIn && userData && (
                    <div 
                        data-menu-trigger="true" 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] p-0.5 overflow-hidden flex items-center justify-center relative group cursor-pointer"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        title="Profile"
                    >
                        {userData.profileImageUrl ? (
                            <img src={userData.profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="bg-gray-900 rounded-full w-full h-full flex items-center justify-center">
                                <span className="text-[#BF953F] font-bold text-sm">
                                    {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 
                                     userData.name ? userData.name.charAt(0).toUpperCase() : 
                                     userData.email ? userData.email.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        )}
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Profile</span>
                    </div>
                )}

                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1.5 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors duration-300"
                >
                    <img 
                        src={assets.menuIcon} 
                        alt="Menu" 
                        className="h-4 invert" 
                    />
                </button>
            </div>

            {/* Mobile Menu - Updated to show Dashboard only for admin */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-gray-900/95 backdrop-blur-md text-base flex flex-col lg:hidden items-center justify-center gap-6 font-medium text-white transition-all duration-500 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button 
                    className="absolute top-4 right-4 text-white hover:text-[#BF953F] transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                >
                    <CloseIcon />
                </button>

                {/* Phone Call Button in Mobile Menu with smaller size */}
                <a 
                    href="tel:+918015924647"
                    className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-gray-900 shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-[#FCF6BA] hover:to-[#BF953F] mb-4"
                >
                    <div className="bg-white/30 p-1.5 rounded-full">
                        <PhoneIcon />
                    </div>
                    <span className="font-medium text-sm">+91 8015924647</span>
                </a>

                {navLinks.map((link, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleNavigation(link.path)}
                        className="group cursor-pointer text-lg text-white transition-all duration-300 relative px-4 py-2 hover:scale-105"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-[#BF953F]">{link.name}</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] group-hover:w-full transition-all duration-300 ease-out"></div>
                    </div>
                ))}

                {/* My Bookings option removed from hamburger menu since it's already in the avatar dropdown */}

                {/* Show Dashboard button for admin in mobile menu instead of My Bookings */}
                {isSignedIn && userData && isAdmin && (
                    <div
                        onClick={() => handleNavigation('/dashboard')}
                        className="group cursor-pointer text-lg text-white transition-all duration-300 relative px-4 py-2 hover:scale-105"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-[#BF953F]">Dashboard</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] group-hover:w-full transition-all duration-300 ease-out"></div>
                    </div>
                )}

                {isSignedIn && userData ? (
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 text-white hover:bg-red-700 px-8 py-2.5 rounded-full transition-all duration-300 mt-4 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                ) : (
                    <button 
                        onClick={() => {
                            handleLogin();
                            setIsMenuOpen(false);
                        }} 
                        className="bg-black text-white hover:bg-gray-800 px-8 py-2.5 rounded-full transition-all duration-300 mt-4"
                    >
                        Login
                    </button>
                )}
            </div>
            
            {/* Mobile and Tablet User Menu */}
            {userMenuOpen && isSignedIn && userData && (
                <div ref={mobileMenuRef} className="lg:hidden fixed top-16 right-4 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-50 ring-1 ring-[#BF953F]/20">
                    <button
                        onClick={() => setUserMenuOpen(false)}
                        className="absolute top-2 right-2 p-1 rounded-full text-white hover:text-[#BF953F] transition-colors"
                    >
                        <CloseIcon />
                    </button>
                    {!isAdmin && (
                        <div 
                            className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => {
                                setUserMenuOpen(false);
                                handleNavigation('/my-bookings');
                            }}
                        >
                            <BookIcon />
                            <span>My Bookings</span>
                        </div>
                    )}
                    
                    {isAdmin && (
                        <div 
                            className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => {
                                setUserMenuOpen(false);
                                handleNavigation('/dashboard');
                            }}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 4H20V10H14V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 14H20V20H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Dashboard</span>
                        </div>
                    )}
                    <div 
                        className="px-4 py-2 text-white hover:text-[#BF953F] cursor-pointer flex items-center gap-2 transition-colors"
                        onClick={() => {
                            setUserMenuOpen(false);
                            handleNavigation('/profile');
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                    </div>
                    <hr className="my-1 border-[#BF953F]/20" />
                    <div 
                        className="px-4 py-2 text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-2 transition-colors"
                        onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;