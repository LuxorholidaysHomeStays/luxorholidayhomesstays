import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 4.5, showNumber = false }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-full-${i}`} className="text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="star-half" className="text-yellow-400" />);
    }
    
    // Add empty stars to reach 5 stars total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`star-empty-${i}`} className="text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {renderStars()}
      </div>
      {showNumber && <span className="ml-1 text-xs text-gray-600">({rating})</span>}
    </div>
  );
};

export default StarRating;