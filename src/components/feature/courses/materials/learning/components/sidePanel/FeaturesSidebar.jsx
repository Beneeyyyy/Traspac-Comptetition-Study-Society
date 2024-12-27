import React from 'react';
import { FiX, FiCoffee, FiActivity } from 'react-icons/fi';
import PomodoroTimer from './PomodoroTimer';
import LearningFeatures from './LearningFeatures';

const FeaturesSidebar = ({ show, onClose, material, progress }) => {
  if (!show) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ 
          pointerEvents: 'auto',
          opacity: show ? 1 : 0 
        }}
      />
      <div
        className="fixed right-0 top-0 h-full w-96 bg-[#0A0A0B] border-l border-white/[0.05] z-50 overflow-y-auto transition-transform duration-300"
        style={{ 
          pointerEvents: 'auto',
          transform: show ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progress & Achievements</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Pomodoro Timer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiCoffee className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-medium">Pomodoro Timer</h3>
            </div>
            <React.Suspense fallback={<div>Loading timer...</div>}>
              <PomodoroTimer />
            </React.Suspense>
          </div>

          {/* Learning Features */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium">Learning Progress</h3>
            </div>
            <React.Suspense fallback={<div>Loading features...</div>}>
              <LearningFeatures material={material} progress={progress} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesSidebar; 