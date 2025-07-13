import React, { createContext, useState, useContext, useEffect } from 'react';

// Define available languages
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    // Add your translations here
    translations: {
      home: 'Home',
      rooms: 'Rooms',
      villas: 'Villas',
      about: 'About',
      contact: 'Contact',
      book_now: 'Book Now',
      search: 'Search',
      check_in: 'Check In',
      check_out: 'Check Out',
      guests: 'Guests',
      view_details: 'View Details',
      our_villas: 'Our Villas',
      amenities: 'Amenities',
      reviews: 'Reviews',
      location: 'Location',
      sign_in: 'Sign In',
      profile: 'Profile',
      my_profile: 'My Profile',
      my_bookings: 'My Bookings',
      dashboard: 'Dashboard',
      logout: 'Logout',
      // Add more translations as needed
    }
  },
  hi: {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    translations: {
      home: 'होम',
      rooms: 'कमरे',
      villas: 'विला',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      book_now: 'अभी बुक करें',
      search: 'खोज',
      check_in: 'चेक इन',
      check_out: 'चेक आउट',
      guests: 'मेहमान',
      view_details: 'विवरण देखें',
      our_villas: 'हमारे विला',
      amenities: 'सुविधाएं',
      reviews: 'समीक्षा',
      location: 'स्थान',
      sign_in: 'साइन इन',
      profile: 'प्रोफाइल',
      my_profile: 'मेरा प्रोफाइल',
      my_bookings: 'मेरी बुकिंग',
      dashboard: 'डैशबोर्ड',
      logout: 'लॉग आउट',
      // Add more translations as needed
    }
  },
  ta: {
    code: 'ta',
    name: 'தமிழ்',
    flag: '🇮🇳',
    translations: {
      home: 'முகப்பு',
      rooms: 'அறைகள்',
      villas: 'வில்லாக்கள்',
      about: 'எங்களை பற்றி',
      contact: 'தொடர்பு',
      book_now: 'இப்போது முன்பதிவு செய்க',
      search: 'தேடு',
      check_in: 'செக் இன்',
      check_out: 'செக் அவுட்',
      guests: 'விருந்தினர்கள்',
      view_details: 'விவரங்களைப் பார்க்க',
      our_villas: 'எங்கள் வில்லாக்கள்',
      amenities: 'வசதிகள்',
      reviews: 'மதிப்புரைகள்',
      location: 'இடம்',
      sign_in: 'உள்நுழைக',
      profile: 'சுயவிவரம்',
      my_profile: 'எனது சுயவிவரம்',
      my_bookings: 'எனது முன்பதிவுகள்',
      dashboard: 'டாஷ்போர்டு',
      logout: 'வெளியேறு',
      // Add more translations as needed
    }
  }
};

// Create the context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  // Get text for the current language
  const t = (key) => {
    const lang = languages[currentLanguage];
    return lang?.translations[key] || languages.en.translations[key] || key;
  };

  // Change the language
  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      languages,
      t, 
      changeLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
