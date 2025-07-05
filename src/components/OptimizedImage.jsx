import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  width = "100%", 
  height = "auto",
  placeholderColor = "#f3f4f6"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  
  // Load image only when component is in viewport
  useEffect(() => {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      const currentElement = document.getElementById(`image-${alt.replace(/\s+/g, '-')}`);
      if (currentElement) {
        observer.observe(currentElement);
      }
      
      return () => {
        if (currentElement) {
          observer.disconnect();
        }
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setImgSrc(src);
    }
  }, [src, alt]);
  
  return (
    <div 
      id={`image-${alt.replace(/\s+/g, '-')}`}
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        width, 
        height,
        backgroundColor: placeholderColor
      }}
    >
      {/* Low-quality placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
        style={{ 
          backgroundImage: `url(${src?.replace(/\.\w+$/, '-thumb.jpg') || ''})`,
          opacity: isLoaded ? 0 : 0.8,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* Main image */}
      {imgSrc && (
        <img 
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.error(`Failed to load image: ${src}`);
            // Try to load a fallback image
            if (src !== '/images/fallback.jpg') {
              setImgSrc('/images/fallback.jpg');
            }
          }}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;