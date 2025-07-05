import React from "react";

export const MealServiceIcon = ({ className }) => {
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
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 8v4M8 8.01l.01-.011M16 8.01l.01-.011" />
      <path d="M3 10h18M3 16h18" />
      <path d="M7 20h10" />
      <path d="M9 16v4M15 16v4" />
    </svg>
  );
};
