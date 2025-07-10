// Use VITE_API_BASE_URL from .env file, fallback to localhost:5001
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper function for authenticated requests
export const authFetch = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });
    
    // First check if the response is OK
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      
      try {
        // Try to parse error as JSON
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If not JSON, get text
        errorMessage = await response.text() || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    // For successful requests, check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // Return text for non-JSON responses
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Fetch villa information from the backend with fallback support
 * @param {string} villaId - ID of the villa to fetch
 * @returns {Promise<Object>} - Villa information
 */
export const fetchVillaInfo = async (villaId) => {
  if (!villaId) {
    throw new Error('Villa ID is required');
  }
  
  // Try different endpoint formats that might exist in the backend
  const endpoints = [
    `/api/villa-info/villa/${villaId}`,
    `/api/villainfo/${villaId}`,
    `/api/villa-info/id/${villaId}`,
    `/api/villas/${villaId}`
  ];
  
  let lastError = null;
  
  // Try each endpoint until one works
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
      console.warn(`Failed to fetch from ${endpoint}:`, error.message);
    }
  }
  
  // If we got here, none of the endpoints worked
  throw lastError || new Error('Failed to fetch villa information');
};



export const villaImageCollections = {
  "Amrith Palace": [
    "/AmrithPalace/AP1.jpg",
    "/AmrithPalace/AP2.jpg",
    "/AmrithPalace/AP3.jpg",
    "/AmrithPalace/AP4.jpg",
    "/AmrithPalace/AP5.jpg",
    "/AmrithPalace/AP6.jpg",
    "/AmrithPalace/AP7.jpg",
    "/AmrithPalace/AP8.jpg",
    "/AmrithPalace/AP9.jpg",
    "/AmrithPalace/AP10.jpg",
    "/AmrithPalace/AP11.jpg",
    "/AmrithPalace/AP12.jpg",
    "/AmrithPalace/AP13.jpg",
    "/AmrithPalace/AP14.jpg",
    "/AmrithPalace/AP15.jpg",
    "/AmrithPalace/AP16.jpg",
    "/AmrithPalace/AP17.jpg",
    "/AmrithPalace/AP18.jpg",
    "/AmrithPalace/AP19.jpg",
    "/AmrithPalace/AP20.jpg",
    "/AmrithPalace/AP21.jpg",
    "/AmrithPalace/AP22.jpg",
    "/AmrithPalace/AP23.jpg",
    "/AmrithPalace/AP24.jpg",
    "/AmrithPalace/AP25.jpg",
    "/AmrithPalace/AP26.jpg",
    "/AmrithPalace/AP27.jpg",
    "/AmrithPalace/AP28.jpg",
    "/AmrithPalace/AP29.jpg",
    "/AmrithPalace/AP30.jpg",
  ],
  "East Coast Villa": [
    "/eastcoastvilla/EC1.jpg",
    "/eastcoastvilla/EC2.jpg",
    "/eastcoastvilla/EC3.jpg",
    "/eastcoastvilla/EC4.jpg",
    "/eastcoastvilla/EC5.jpg",
    "/eastcoastvilla/EC6.jpg",
    "/eastcoastvilla/EC7.jpg",
    "/eastcoastvilla/EC8.jpg",
    "/eastcoastvilla/EC9.jpg",
    "/eastcoastvilla/EC10.jpg",
    "/eastcoastvilla/EC11.jpg",
    "/eastcoastvilla/EC12.jpg",
    "/eastcoastvilla/EC13.jpg",
    "/eastcoastvilla/EC14.jpg",
    "/eastcoastvilla/EC15.jpg",
  ],
  "Ram Water Villa": [
    "/ramwatervilla/RW1.jpg",
    "/ramwatervilla/RW2.jpg",
    "/ramwatervilla/RW3.jpg",
    "/ramwatervilla/RW4.jpg",
    "/ramwatervilla/RW5.jpg",
    "/ramwatervilla/RW6.jpg",
    "/ramwatervilla/RW7.jpg",
    "/ramwatervilla/RW8.jpg",
    "/ramwatervilla/RW9.jpg",
    "/ramwatervilla/RW10.jpg",
    "/ramwatervilla/RW11.jpg",
    "/ramwatervilla/RW13.jpg",
    "/ramwatervilla/RW14.jpg",
    "/ramwatervilla/RW15.jpg",
    "/ramwatervilla/RW16.jpg",
    "/ramwatervilla/RW17.jpg",
    "/ramwatervilla/RW18.jpg",
    "/ramwatervilla/RW19.jpg",
  ],
  "Empire Anand Villa Samudra": [
    "/empireanandvillasamudra/anandvilla1.jpg",
    "/empireanandvillasamudra/anandvilla2.jpg",
    "/empireanandvillasamudra/anandvilla3.jpg",
    "/empireanandvillasamudra/anandvilla4.jpg",
    "/empireanandvillasamudra/anandvilla5.jpg",
    "/empireanandvillasamudra/anandvilla6.jpg",
    "/empireanandvillasamudra/anandvilla7.jpg",
    "/empireanandvillasamudra/anandvilla8.jpg",
    "/empireanandvillasamudra/anandvilla9.jpg",
    "/empireanandvillasamudra/anandvilla10.jpg",
    "/empireanandvillasamudra/anandvilla11.jpg",
    "/empireanandvillasamudra/anandvilla12.jpg",
    "/empireanandvillasamudra/anandvilla13.jpg",
    "/empireanandvillasamudra/anandvilla14.jpg",
    "/empireanandvillasamudra/anandvilla15.jpg",
    "/empireanandvillasamudra/anandvilla16.jpg",
  ],
  "Lavish Villa I": [
    "/LavishVilla 1/lvone1.jpg",
    "/LavishVilla 1/lvone2.jpg",
    "/LavishVilla 1/lvone3.jpg",
    "/LavishVilla 1/lvone4.jpg",
    "/LavishVilla 1/lvone5.jpg",
    "/LavishVilla 1/lvone6.jpg",
    "/LavishVilla 1/lvone7.jpg",
    "/LavishVilla 1/lvone8.jpg",
    "/LavishVilla 1/lvone9.jpg",
    "/LavishVilla 1/lvone10.jpg",
    "/LavishVilla 1/lvone11.jpg",
    "/LavishVilla 1/lvone12.jpg",
    "/LavishVilla 1/lvone13.jpg",
    "/LavishVilla 1/lvone14.jpg",
    "/LavishVilla 1/lvone15.jpg",
    "/LavishVilla 1/lvone16.jpg",
    "/LavishVilla 1/lvone17.jpg",
    "/LavishVilla 1/lvone18.jpg",
    "/LavishVilla 1/lvone19.jpg",
    "/LavishVilla 1/lvone20.jpg",
    "/LavishVilla 1/lvone21.jpg",
    "/LavishVilla 1/lvone22.jpg",
  ],
  "Lavish Villa II": [
    "/LavishVilla 2/lvtwo1.jpg",
    "/LavishVilla 2/lvtwo2.jpg",
    "/LavishVilla 2/lvtwo3.jpg",
    "/LavishVilla 2/lvtwo4.jpg",
    "/LavishVilla 2/lvtwo5.jpg",
    "/LavishVilla 2/lvtwo6.jpg",
    "/LavishVilla 2/lvtwo7.jpg",
    "/LavishVilla 2/lvtwo8.jpg",
    "/LavishVilla 2/lvtwo9.jpg",
    "/LavishVilla 2/lvtwo10.jpg",
    "/LavishVilla 2/lvtwo11.jpg",
    "/LavishVilla 2/lvtwo12.jpg",
    "/LavishVilla 2/lvtwo13.jpg",
    "/LavishVilla 2/lvtwo14.jpg",
    "/LavishVilla 2/lvtwo15.jpg",
    "/LavishVilla 2/lvtwo16.jpg",
    "/LavishVilla 2/lvtwo17.jpg",
    "/LavishVilla 2/lvtwo18.jpg",
    "/LavishVilla 2/lvtwo19.jpg",
    "/LavishVilla 2/lvtwo20.jpg",
    "/LavishVilla 2/lvtwo21.jpg",
    "/LavishVilla 2/lvtwo22.jpg",
  ],
  "Lavish Villa III": [
    "/LavishVilla 3/lvthree1.jpg",
    "/LavishVilla 3/lvthree2.jpg",
    "/LavishVilla 3/lvthree3.jpg",
    "/LavishVilla 3/lvthree4.jpg",
    "/LavishVilla 3/lvthree5.jpg",
    "/LavishVilla 3/lvthree6.jpg",
    "/LavishVilla 3/lvthree7.jpg",
    "/LavishVilla 3/lvthree8.jpg",
    "/LavishVilla 3/lvthree9.jpg",
    "/LavishVilla 3/lvthree10.jpg",
    "/LavishVilla 3/lvthree12.jpg",
    "/LavishVilla 3/lvthree13.jpg",
    "/LavishVilla 3/lvthree14.jpg",
    "/LavishVilla 3/lvthree15.jpg",
    "/LavishVilla 3/lvthree16.jpg",
    "/LavishVilla 3/lvthree17.jpg",
    "/LavishVilla 3/lvthree18.jpg",
  ],
};
