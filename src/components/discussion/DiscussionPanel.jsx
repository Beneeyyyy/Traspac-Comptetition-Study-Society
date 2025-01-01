import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DiscussionItem from './DiscussionItem';

const DiscussionPanel = ({ materialId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadDiscussions();
  }, [materialId]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/discussions/material/${materialId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load discussions');
      }
      
      setDiscussions(data.data.discussions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      const response = await fetch(`/api/discussions/material/${materialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content.trim() })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create discussion');
      }

      setContent('');
      loadDiscussions();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="p-4">Loading discussions...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Diskusi</h2>
      
      {/* Form diskusi baru */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis pertanyaan atau diskusi Anda..."
          className="w-full p-2 border rounded-lg mb-2 min-h-[100px]"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Kirim Diskusi
        </button>
      </form>

      {/* Daftar diskusi */}
      <div className="space-y-4">
        {discussions.map(discussion => (
          <DiscussionItem
            key={discussion.id}
            discussion={discussion}
            currentUser={user}
            onUpdate={loadDiscussions}
          />
        ))}
        {discussions.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Belum ada diskusi. Mulai diskusi pertama!
          </p>
        )}
      </div>
    </div>
  );
};

export default DiscussionPanel; 