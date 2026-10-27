// Utility functions for amenities API calls

import { API_BASE_URL } from '../config/api'

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
    const amenities = data.data?.amenities || data.amenities || [];
    console.log(`[AMENITIES API] Successfully fetched amenities for ${villaName}:`, amenities.length, 'amenities');
    
    return {
      success: true,
      data: {
        villaName: data.data?.villaName || villaName,
        location: data.data?.location || '',
        amenities: amenities
      }
    };
  } catch (error) {
    console.error(`[AMENITIES API] Error fetching amenities for ${villaName}:`, error);
    return { 
      success: false, 
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
    const list = data.data || [];
    console.log('[AMENITIES API] Successfully fetched amenities for all villas:', list.length, 'villas');
    
    return {
      success: true,
      count: list.length,
      data: list
    };
  } catch (error) {
    console.error('[AMENITIES API] Error fetching all villas amenities:', error);
    return { 
      success: false, 
      data: [],
      error: error.message 
    };
  }
};
