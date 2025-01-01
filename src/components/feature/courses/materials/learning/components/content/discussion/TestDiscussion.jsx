import React from 'react';
import DiscussionPanel from '../DiscussionPanel';

const TestDiscussion = () => {
  // Test material ID
  const materialId = 1; // Ganti dengan ID material yang ingin ditest

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Test Discussion Panel</h1>
          <p className="text-white/60">
            Material ID: {materialId}
          </p>
        </div>

        {/* Discussion Panel Component */}
        <DiscussionPanel materialId={materialId} />
      </div>
    </div>
  );
};

export default TestDiscussion; 