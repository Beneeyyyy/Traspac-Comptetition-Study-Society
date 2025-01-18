import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AllSquads from './AllSquads';

const SquadList = () => {
  const navigate = useNavigate();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'active', label: 'Most Active' }
  ];

  useEffect(() => {
    fetchSquads();
  }, [searchQuery, filter, selectedSort]);

  const fetchSquads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('isPublic', filter === 'public');
      params.append('sort', selectedSort);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/squads?${params.toString()}`,
        { withCredentials: true }
      );
      
      console.log('Fetched squads:', response.data);
      setSquads(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching squads:', err);
      setError(err.response?.data?.error || 'Failed to fetch squads');
      toast.error('Failed to load squads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSquad = async (formData) => {
    try {
      setLoading(true);
      
      console.log('Creating squad with data:', {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        hasImage: !!formData.image,
        hasBanner: !!formData.banner
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/squads`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Squad created:', response.data);
      
      // Add new squad to list
      setSquads(prev => [response.data, ...prev]);
      
      toast.success('Squad created successfully!');
    } catch (error) {
      console.error('Error creating squad:', error);
      toast.error(error.response?.data?.error || 'Failed to create squad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search squads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-black/20 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Squads</option>
          <option value="public">Public Squads</option>
          <option value="private">Private Squads</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading squads...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Squad List */}
      {!loading && !error && (
        <AllSquads
          studyGroups={squads}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sortOptions={sortOptions}
          onCreateSquad={handleCreateSquad}
        />
      )}
    </div>
  );
};

export default SquadList; 