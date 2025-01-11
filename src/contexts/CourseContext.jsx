import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create the context
const CourseContext = createContext(null);

// Custom hook to use the course context
export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}

// Provider component
export function CourseProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/categories`);
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      // Parse categoryId as number
      const parsedCategoryId = parseInt(categoryId, 10);
      console.log('Fetching subcategories for category:', parsedCategoryId);
      
      const response = await axios.get(`${API_URL}/api/subcategories/category/${parsedCategoryId}`);
      console.log('Fetched subcategories:', response.data);
      setSubcategories(response.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError('Failed to fetch subcategories');
    } finally {
      setIsLoading(false);
    }
  };

  const getMaterials = async (categoryId, subcategoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Parse subcategoryId as number and validate
      const parsedSubcategoryId = parseInt(subcategoryId, 10);
      if (isNaN(parsedSubcategoryId)) {
        throw new Error('Invalid subcategory ID');
      }

      // Use the correct endpoint that exists in the backend
      const response = await axios.get(`${API_URL}/api/materials/subcategory/${parsedSubcategoryId}`);
      console.log('Fetched materials:', response.data);
      setMaterials(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err.message || 'Failed to fetch materials');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial categories fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    categories,
    subcategories,
    materials,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    getMaterials
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export default CourseContext; 