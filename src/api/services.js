const BASE_URL = 'http://localhost:3000';

// Get all services with optional filters
export const getServices = async (filters = {}) => {
  const { category, search } = filters;
  const params = new URLSearchParams();
  
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  
  const response = await fetch(`${BASE_URL}/api/services?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

// Get service by ID
export const getServiceById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/services/${id}`);
  if (!response.ok) throw new Error('Failed to fetch service');
  return response.json();
};

// Create new service
export const createService = async (data) => {
  const response = await fetch(`${BASE_URL}/api/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
};

// Book a service
export const bookService = async (id, data) => {
  const response = await fetch(`${BASE_URL}/api/services/${id}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to book service');
  return response.json();
};

// Add review
export const addReview = async (id, data) => {
  const response = await fetch(`${BASE_URL}/api/services/${id}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to add review');
  return response.json();
}; 