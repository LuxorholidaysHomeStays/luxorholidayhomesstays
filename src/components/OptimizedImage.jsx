import React from 'react';

// Simple image component with lazy loading
const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  width = "100%", 
  height = "auto",
  placeholderColor,
  onError,
  priority = false,
  loading = "lazy"
}) => {
  
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      loading={priority ? "eager" : loading}
      onError={onError}
      style={{ width, height }}
    />
  );
};

export default OptimizedImage;