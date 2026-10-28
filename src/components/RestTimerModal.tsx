import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, Plus, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RestTimerModalProps {
  initialSeconds: number;
  onClose: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            soundManager.playTimerAlert();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 bg-[#121620] border-2 border-lime-400/80 rounded-2xl p-4 shadow-2xl shadow-lime-950/40 w-72 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#1c222e]">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-lime-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Rest Interval
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1"
          title="Dismiss timer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 text-center">
        <div className="text-4xl font-black font-data tracking-tight text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">
          {timeLeft === 0 ? 'Rest complete! Time for next set' : 'Catch your breath'}
        </span>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#1a212e] rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              timeLeft === 0 ? 'bg-red-400' : 'bg-lime-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1c222e]">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsRunning(!isRunning);
          }}
          className="flex-1 py-1.5 rounded-lg bg-[#181f2b] hover:bg-[#20293a] text-xs font-bold text-white flex items-center justify-center gap-1.5 border border-[#232b3a]"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Resume'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setTimeLeft((prev) => prev + 30);
            setTotalSeconds((prev) => prev + 30);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-[#181f2b] hover:bg-[#20293a] text-xs font-bold text-lime-400 border border-[#232b3a] flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>30s</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setTimeLeft(initialSeconds);
            setTotalSeconds(initialSeconds);
            setIsRunning(true);
          }}
          className="p-1.5 rounded-lg bg-[#181f2b] hover:bg-[#20293a] text-slate-400 hover:text-white border border-[#232b3a]"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
