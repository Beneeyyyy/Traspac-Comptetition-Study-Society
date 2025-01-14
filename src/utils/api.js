import axios from 'axios';

let api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

// Store the auth token setter function
let setAuthToken = null;

// Function to initialize the API with auth context
export const initializeApi = (getToken) => {
  setAuthToken = getToken;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token using the setter function if available
      const token = setAuthToken ? await setAuthToken() : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Request interceptor error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle 401 error - e.g., redirect to login
      console.log('Unauthorized - token might be invalid');
    }
    return Promise.reject(error);
  }
);

export default api; 