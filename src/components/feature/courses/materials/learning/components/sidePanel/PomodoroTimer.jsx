import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRefreshCw, FiCoffee, FiBook } from 'react-icons/fi';

const PomodoroTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (isBreak) {
          setBreakTimeLeft((prev) => {
            if (prev <= 1) {
              setIsBreak(false);
              setIsRunning(false);
              return 5 * 60;
            }
            return prev - 1;
          });
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsBreak(true);
              return 25 * 60;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setBreakTimeLeft(5 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTimeLeft = isBreak ? breakTimeLeft : timeLeft;
  const currentMode = isBreak ? 'break' : 'focus';
  const modeConfig = {
    focus: {
      icon: FiBook,
      label: 'Fokus',
      colorClass: 'blue'
    },
    break: {
      icon: FiCoffee,
      label: 'Istirahat',
      colorClass: 'purple'
    }
  };

  const CurrentModeIcon = modeConfig[currentMode].icon;
  const { label, colorClass } = modeConfig[currentMode];

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
        <div className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${colorClass}-500/10 border border-${colorClass}-500/20`}>
                <CurrentModeIcon className={`w-4 h-4 text-${colorClass}-400`} />
              </div>
              <span className="font-medium">{label}</span>
            </div>
          </div>

          <div className="text-5xl font-bold text-center mb-6 font-mono tracking-wider">
            {formatTime(currentTimeLeft)}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
            >
              {isRunning ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/60 hover:text-white transition-colors"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
        <h4 className="font-medium mb-2">Tips Pomodoro</h4>
        <ul className="text-sm text-white/60 space-y-1">
          <li>• Fokus penuh selama 25 menit</li>
          <li>• Istirahat 5 menit setiap siklus</li>
          <li>• Istirahat panjang setiap 4 siklus</li>
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer; 