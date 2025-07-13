import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle language selection
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center bg-white text-gray-800 p-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 text-2xl"
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(220, 220, 220, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
          width: '56px',
          height: '56px'
        }}
        aria-label="Change language"
        title="Change language"
      >
        <span>{languages[currentLanguage].flag}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute bg-white rounded-lg shadow-xl py-2 w-44 z-[10000]" 
          style={{
            bottom: '60px',
            right: '0',
            maxHeight: '300px', 
            overflow: 'auto',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          }}
        >
          {Object.values(languages).map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center w-full px-4  text-left hover:bg-gray-100 ${
                currentLanguage === language.code ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              <span className="mr-2 text-xl">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
