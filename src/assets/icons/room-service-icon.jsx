import React from "react";

export const RoomServiceIcon = ({ className }) => {
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
      <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M17 10h4M19 7v6" />
      <path d="M21 15H3M3 15v2M21 15v2" />
      <path d="M9 5l1 1M15 5l-1 1" />
    </svg>
  );
};
