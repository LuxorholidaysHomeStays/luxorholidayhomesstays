import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Bed, Bath, Star, ArrowRight } from 'lucide-react';

const VillaCard = ({ villa }) => {
  // Extract villa properties
  const {
    _id,
    name,
    location,
    price,
    weekdayPrice,
    weekendPrice,
    description,
    images,
    bedrooms,
    bathrooms,
    guests,
    rating
  } = villa;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full">
      {/* Villa Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={images?.[0] || '/placeholder.jpg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          ₹{price?.toLocaleString() || 'N/A'} <span className="text-xs font-normal text-gray-600">/ night</span>
        </div>
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm shadow-lg">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          <span className="font-semibold">{rating || '4.5'}</span>
        </div>
      </div>
      
      {/* Villa Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{name}</h3>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
        
        {/* Short Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* Weekend/Weekday Price Display */}
        {(weekdayPrice || weekendPrice) && (
          <div className="mb-3 bg-gray-50 rounded-lg p-2.5 text-xs">
            <div className="flex justify-between items-center">
              {weekdayPrice && (
                <div>
                  <span className="text-gray-500">Weekdays:</span>
                  <span className="font-medium ml-1 text-gray-800">₹{weekdayPrice.toLocaleString()}</span>
                </div>
              )}
              {weekendPrice && (
                <div>
                  <span className="text-gray-500">Weekends:</span>
                  <span className="font-medium ml-1 text-gray-800">₹{weekendPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">{guests} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">{bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">{bathrooms || bedrooms} baths</span>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-100">
        <Link 
          to={`/villa/${_id}`} 
          className="block text-center py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default VillaCard;
