import React from "react";

export const EaseIcon = ({ className }) => {
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
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      <path d="M12 16v-4M12 8h.01" />
      <path d="M9 9a3 3 0 0 1 6 0c0 1.5-2.5 2-3 5.5" />
    </svg>
  );
};
