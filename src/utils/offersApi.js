// Utility functions for offers API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://luxorstay-backend.vercel.app";

/**
 * Fetch offer for a specific villa and date
 * @param {string} villaName - The name of the villa
 * @param {string} date - The date to check for offers (YYYY-MM-DD)
 * @returns {Promise<Object>} - Promise resolving to offer data
 */
export const fetchVillaOfferForDate = async (villaName, date) => {
  try {
    console.log(`[OFFERS API] Fetching offer for villa: ${villaName}, date: ${date}`);
    
    const encodedVillaName = encodeURIComponent(villaName);
    const response = await fetch(`${API_BASE_URL}/api/offers/villa/${encodedVillaName}/date/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[OFFERS API] No offer found for villa: ${villaName} on ${date}`);
        return { success: true, hasOffer: false };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[OFFERS API] Offer response for ${villaName}:`, data);
    
    return data;
  } catch (error) {
    console.error(`[OFFERS API] Error fetching offer for ${villaName}:`, error);
    return { 
      success: false, 
      hasOffer: false,
      error: error.message 
    };
  }
};

/**
 * Fetch offers for a villa within a date range
 * @param {string} villaName - The name of the villa
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} - Promise resolving to offers data
 */
export const fetchVillaOffersForDateRange = async (villaName, startDate, endDate) => {
  try {
    console.log(`[OFFERS API] Fetching offers for villa: ${villaName}, range: ${startDate} to ${endDate}`);
    
    const encodedVillaName = encodeURIComponent(villaName);
    const response = await fetch(`${API_BASE_URL}/api/offers/villa/${encodedVillaName}/range?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[OFFERS API] Found ${data.count || 0} offers for ${villaName} in date range`);
    
    return data;
  } catch (error) {
    console.error(`[OFFERS API] Error fetching offers for ${villaName} date range:`, error);
    return { 
      success: false, 
      count: 0,
      offers: [],
      error: error.message 
    };
  }
};

/**
 * Fetch all active offers
 * @returns {Promise<Object>} - Promise resolving to all active offers
 */
export const fetchAllActiveOffers = async () => {
  try {
    console.log('[OFFERS API] Fetching all active offers');
    
    const response = await fetch(`${API_BASE_URL}/api/offers/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[OFFERS API] Successfully fetched active offers:', data.count || 0, 'offers');
    
    return data;
  } catch (error) {
    console.error('[OFFERS API] Error fetching all active offers:', error);
    return { 
      success: false, 
      count: 0,
      offers: [],
      error: error.message 
    };
  }
};

/**
 * Calculate pricing with offers for booking
 * @param {string} villaName - Villa name
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date  
 * @param {number} originalPrice - Original price per night
 * @returns {Promise<Object>} - Pricing information with offers
 */
export const calculatePricingWithOffers = async (villaName, checkInDate, checkOutDate, originalPrice) => {
  try {
    console.log(`[OFFERS API] Calculating pricing with offers for ${villaName}`);
    
    const offers = await fetchVillaOffersForDateRange(villaName, checkInDate, checkOutDate);
    
    if (!offers.success || offers.count === 0) {
      return {
        hasOffer: false,
        originalPrice: originalPrice,
        finalPrice: originalPrice,
        savings: 0,
        offerDetails: null
      };
    }

    // Find the best offer (lowest price) for the date range
    const bestOffer = offers.offers.reduce((best, current) => 
      current.offerAmount < best.offerAmount ? current : best
    );

    const savings = Math.max(0, originalPrice - bestOffer.offerAmount);
    
    return {
      hasOffer: true,
      originalPrice: originalPrice,
      finalPrice: bestOffer.offerAmount,
      savings: savings,
      offerDetails: bestOffer
    };
  } catch (error) {
    console.error('[OFFERS API] Error calculating pricing with offers:', error);
    return {
      hasOffer: false,
      originalPrice: originalPrice,
      finalPrice: originalPrice,
      savings: 0,
      offerDetails: null,
      error: error.message
    };
  }
};

/**
 * Check if a specific date has an offer for a villa
 * @param {string} villaName - Villa name
 * @param {Date} date - Date to check
 * @returns {Promise<boolean>} - True if offer exists for the date
 */
export const hasOfferForDate = async (villaName, date) => {
  try {
    const dateString = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    const result = await fetchVillaOfferForDate(villaName, dateString);
    return result.success && result.hasOffer;
  } catch (error) {
    console.error(`[OFFERS API] Error checking offer for date:`, error);
    return false;
  }
};
