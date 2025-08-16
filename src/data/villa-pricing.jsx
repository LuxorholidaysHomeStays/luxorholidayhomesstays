// Import offers API
import { fetchVillaOfferForDate, calculatePricingWithOffers } from '../utils/offersApi'

// Dynamic pricing function that depends on the villa object from the backend
// This is a helper function for legacy code that hasn't been updated yet
export const getVillaPricing = (villaObj) => {
  if (!villaObj) {
    console.warn('No villa object provided to getVillaPricing');
    return {
      weekday: 15000,
      weekend: 25000,
      maxGuests: 10,
      securityDeposit: 20000,
    };
  }
  
  // If a string was passed (old behavior), try to find the villa by name
  if (typeof villaObj === 'string') {
    console.warn('Using villa name instead of object is deprecated. Update your code.');
    // Return default pricing since we can't get real data from a string
    return {
      weekday: 15000,
      weekend: 25000,
      maxGuests: 10,
      securityDeposit: 20000,
    };
  }

  // Return properly structured pricing data from villa object
  return {
    weekday: villaObj.price || villaObj.weekdayPrice || 15000,
    weekend: villaObj.weekendPrice || villaObj.weekendprice || villaObj.price || 25000,
    maxGuests: villaObj.maxGuests || 10,
    securityDeposit: villaObj.securityDeposit || 20000,
  };
}

// Add this fallback pricing map
const villaFallbackPricing = {
  "Amrith Palace": { weekday: 45000, weekend: 65000 },
  "Ram Water Villa": { weekday: 30000, weekend: 45000 },
  "East Coast Villa": { weekday: 15000, weekend: 25000 },
  "Lavish Villa I": { weekday: 18000, weekend: 25000 },
  "Lavish Villa II": { weekday: 18000, weekend: 25000 },
  "Lavish Villa III": { weekday: 16000, weekend: 23000 },
  "Empire Anand Villa Samudra": { weekday: 40000, weekend: 60000 }
};

export const getPriceForDate = async (date, villa) => {
  // Ensure the date is a proper Date object
  const checkDate = date instanceof Date ? date : new Date(date);
  
  // Get the day of week (0 = Sunday, 6 = Saturday)
  const day = checkDate.getDay();
  const isWeekend = day === 0 || day === 6; // Sunday or Saturday
  
  // Try to get villa data in different formats
  let villaData;
  if (typeof villa === 'string') {
    // If villa is just a string (name), look up in fallback pricing
    const villaName = villa;
    villaData = Object.entries(villaFallbackPricing).find(([name]) => 
      villaName.toLowerCase().includes(name.toLowerCase())
    );
    if (villaData) {
      villaData = villaData[1]; // Get the pricing object
    } else {
      // Default prices if no match found
      villaData = { weekday: 25000, weekend: 35000 };
    }
  } else {
    // Villa is an object
    villaData = villa;
  }
  
  // Get weekday price
  const weekdayPrice = Number(villaData.price || villaData.weekday || 25000);
  
  // Get weekend price from any possible source
  let weekendPrice = Number(villaData.weekendPrice || villaData.weekendprice);
  
  // If weekend price is still 0 or NaN, apply fallback pricing
  if (!weekendPrice) {
    // Try to find a match in our fallback pricing data
    if (villaData.name) {
      const fallbackPricing = Object.entries(villaFallbackPricing).find(([name]) => 
        villaData.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (fallbackPricing) {
        weekendPrice = fallbackPricing[1].weekend;
      } else {
        // Default to 1.5x weekday price if no match found
        weekendPrice = Math.round(weekdayPrice * 1.5);
      }
    } else {
      // Default to 1.5x weekday price if no villa name available
      weekendPrice = Math.round(weekdayPrice * 1.5);
    }
  }
  
  // Get the appropriate price based on day
  const originalPrice = isWeekend ? weekendPrice : weekdayPrice;
  
  // Check for offers and calculate discounted price
  try {
    if (villaData._id || villaData.id) {
      const villaId = villaData._id || villaData.id;
      const offerPricing = await calculatePricingWithOffers(villaId, checkDate);
      
      if (offerPricing.hasOffer) {
        return {
          originalPrice: originalPrice,
          offerPrice: offerPricing.finalPrice,
          hasOffer: true,
          offerDetails: offerPricing.offerDetails
        };
      }
    }
  } catch (error) {
    console.warn('Error fetching offer pricing:', error);
  }
  
  // Return original price if no offers
  return {
    originalPrice: originalPrice,
    offerPrice: originalPrice,
    hasOffer: false
  };
};

// Synchronous version for backward compatibility
export const getPriceForDateSync = (date, villa) => {
  // Ensure the date is a proper Date object
  const checkDate = date instanceof Date ? date : new Date(date);
  
  // Get the day of week (0 = Sunday, 6 = Saturday)
  const day = checkDate.getDay();
  const isWeekend = day === 0 || day === 6; // Sunday or Saturday
  
  // Try to get villa data in different formats
  let villaData;
  if (typeof villa === 'string') {
    // If villa is just a string (name), look up in fallback pricing
    const villaName = villa;
    villaData = Object.entries(villaFallbackPricing).find(([name]) => 
      villaName.toLowerCase().includes(name.toLowerCase())
    );
    if (villaData) {
      villaData = villaData[1]; // Get the pricing object
    } else {
      // Default prices if no match found
      villaData = { weekday: 25000, weekend: 35000 };
    }
  } else {
    // Villa is an object
    villaData = villa;
  }
  
  // Get weekday price
  const weekdayPrice = Number(villaData.price || villaData.weekday || 25000);
  
  // Get weekend price from any possible source
  let weekendPrice = Number(villaData.weekendPrice || villaData.weekendprice);
  
  // If weekend price is still 0 or NaN, apply fallback pricing
  if (!weekendPrice) {
    // Try to find a match in our fallback pricing data
    if (villaData.name) {
      const fallbackPricing = Object.entries(villaFallbackPricing).find(([name]) => 
        villaData.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (fallbackPricing) {
        weekendPrice = fallbackPricing[1].weekend;
      } else {
        // Default to 1.5x weekday price if no match found
        weekendPrice = Math.round(weekdayPrice * 1.5);
      }
    } else {
      // Default to 1.5x weekday price if no villa name available
      weekendPrice = Math.round(weekdayPrice * 1.5);
    }
  }
  
  // Return the appropriate price based on day
  return isWeekend ? weekendPrice : weekdayPrice;
};

export const formatPrice = (price) => {
  return `₹${(price / 1000).toFixed(0)}k`
}
