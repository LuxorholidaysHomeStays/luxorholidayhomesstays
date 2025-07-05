import React from "react";

export const ToiletriesIcon = ({ className }) => {
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
      <path d="M7 21h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
      <path d="M7 4v2M17 4v2" />
      <path d="M7 10h10M12 10v11" />
      <path d="M7 14h5M12 14h5" />
    </svg>
  );
};
