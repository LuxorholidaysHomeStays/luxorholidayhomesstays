// Utility functions for amenities API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://luxorstay-backend.vercel.app";

/**
 * Fetch amenities for a specific villa by villa name
 * @param {string} villaName - The name of the villa
 * @returns {Promise<Object>} - Promise resolving to amenities data
 */
export const fetchVillaAmenities = async (villaName) => {
  try {
    console.log(`[AMENITIES API] Fetching amenities for villa: ${villaName}`);
    
    // Encode villa name to handle special characters and spaces
    const encodedVillaName = encodeURIComponent(villaName);
    
    const response = await fetch(`${API_BASE_URL}/api/amenities/villa/${encodedVillaName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[AMENITIES API] No amenities found for villa: ${villaName}`);
        return { success: true, data: { amenities: [] } }; // Return empty amenities as fallback
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[AMENITIES API] Successfully fetched amenities for ${villaName}:`, data.data?.amenities?.length || 0, 'amenities');
    
    return data;
  } catch (error) {
    console.error(`[AMENITIES API] Error fetching amenities for ${villaName}:`, error);
    // Return empty amenities as fallback instead of throwing
    return { 
      success: true, 
      data: { 
        amenities: [],
        villaName: villaName,
        location: ''
      },
      error: error.message 
    };
  }
};

/**
 * Fetch amenities for all villas
 * @returns {Promise<Object>} - Promise resolving to all villas amenities data
 */
export const fetchAllVillasAmenities = async () => {
  try {
    console.log('[AMENITIES API] Fetching amenities for all villas');
    
    const response = await fetch(`${API_BASE_URL}/api/amenities/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[AMENITIES API] Successfully fetched amenities for all villas:', data.count || 0, 'villas');
    
    return data;
  } catch (error) {
    console.error('[AMENITIES API] Error fetching all villas amenities:', error);
    return { 
      success: false, 
      data: [],
      error: error.message 
    };
  }
};
