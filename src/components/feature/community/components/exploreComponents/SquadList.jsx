import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getSquads } from '../../../../../api/squad';

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
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filter === 'my-squads') params.isMember = true;
      else if (filter !== 'all') params.isPublic = filter === 'public';
      params.sort = selectedSort;

      const response = await getSquads(params);
      setSquads(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching squads:', err);
      setError(err.response?.data?.error || 'Failed to fetch squads');
      toast.error('Failed to load squads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-white/90 transition-colors"
          >
            <option value="all">All Squads</option>
            <option value="my-squads">My Squads</option>
            <option value="public">Public Squads</option>
            <option value="private">Private Squads</option>
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-white/90 transition-colors"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search squads..."
          className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-white/90 placeholder:text-white/40 transition-colors w-64"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchSquads}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && squads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No squads found</p>
        </div>
      )}

      {/* Squads List */}
      {!loading && !error && squads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {squads.map((squad) => (
            <div
              key={squad.id}
              onClick={() => navigate(`/community/squad/${squad.id}`)}
              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all"
            >
              <div className="relative h-40">
                <img
                  src={squad.banner || '/default-banner.jpg'}
                  alt={squad.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{squad.name}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{squad.description}</p>

                <div className="flex items-center justify-between text-sm text-white/40">
                  <div>{squad.memberCount} members</div>
                  <div>{squad.materialsCount} materials</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SquadList; 