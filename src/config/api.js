// Use VITE_API_BASE_URL from .env file, fallback to localhost:5000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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