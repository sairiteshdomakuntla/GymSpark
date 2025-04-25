
// Configuration for connecting to the MongoDB/Express backend

export const API_CONFIG = {
  // Base URL for API requests
  API_URL: 'http://localhost:5000/api',
  
  // Environment-specific configurations
  development: {
    API_URL: 'http://localhost:5000/api',
  },
  production: {
    API_URL: 'https://your-production-api-url.com/api',
  },
  
  // Timeout in milliseconds for API requests
  REQUEST_TIMEOUT: 30000,
};

// Get the current environment (defaulting to development)
const environment = import.meta.env.MODE || 'development';

// Export the base URL based on the current environment
export const BASE_API_URL = API_CONFIG[environment as keyof typeof API_CONFIG]?.API_URL || API_CONFIG.API_URL;
