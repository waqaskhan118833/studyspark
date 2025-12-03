/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, ResetIcon, ZapIcon } from './icons';
import { getMotivation } from '../services/geminiService';

interface FocusBuddyProps {
  onSessionComplete: () => void;
}

const FocusBuddy: React.FC<FocusBuddyProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [quote, setQuote] = useState("Let's do this!");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete();
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
      setTimeLeft(25 * 60); // Reset for now
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onSessionComplete]);

  // Get a quote when starting
  useEffect(() => {
    if (isActive && timeLeft === 25 * 60) {
      getMotivation().then(setQuote);
    }
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto p-6">
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-orange-400 to-purple-500 mb-4 shadow-xl shadow-purple-900/30">
          <ZapIcon className="w-10 h-10 text-white fill-white" />
        </div>
        <div className="bg-gray-800/80 backdrop-blur px-6 py-3 rounded-2xl border border-gray-700/50">
          <p className="text-purple-200 font-medium text-lg">"{quote}"</p>
        </div>
      </div>

      <div className="text-8xl font-black font-mono text-white mb-10 tracking-tight tabular-nums drop-shadow-2xl">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${
            isActive 
              ? 'bg-gray-800 text-white border-2 border-gray-700' 
              : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-900/40'
          }`}
        >
          {isActive ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 ml-1 fill-white" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <ResetIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-12 text-gray-500 text-sm font-medium uppercase tracking-widest">
        Focus Mode
      </div>
    </div>
  );
};

export default FocusBuddy;