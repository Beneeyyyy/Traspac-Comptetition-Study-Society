import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/categories`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      console.log('Categories fetched:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/subcategories/category/${categoryId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      console.log('Subcategories fetched:', data);
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial categories fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = React.useMemo(() => ({
    categories,
    subcategories,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    fetchCategories,
    fetchSubcategories,
  }), [categories, subcategories, isLoading, error, activeFilter]);

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}

export default CourseContext; 