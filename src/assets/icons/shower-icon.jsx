import React from "react";

export const ShowerIcon = ({ className }) => {
  return (
    <svg 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 22h16" />
      <path d="M19 4v3a7 7 0 0 1-14 0V4" />
      <path d="M12 2v10M8 10v4M16 10v4" />
      <path d="M5 8v4M19 8v4" />
      <path d="M8 18l-2 4M16 18l2 4" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};
