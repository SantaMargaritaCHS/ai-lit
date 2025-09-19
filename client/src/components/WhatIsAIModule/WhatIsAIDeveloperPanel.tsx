import { motion } from 'framer-motion';
import { FastForward, SkipForward, Home, Eye, Play, Brain, Clock, CheckCircle } from 'lucide-react';

interface WhatIsAIDeveloperPanelProps {
  currentActivity: number;
  totalActivities: number;
  activities: Array<{ id: string; title: string; completed: boolean }>;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function WhatIsAIDeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  videoRef
}: WhatIsAIDeveloperPanelProps) {
  
  // Module-specific quick actions for "What is AI?" module
  const handleSkipToReflection = () => {
    // Skip to first reflection at 59 seconds in intro video
    window.dispatchEvent(new CustomEvent('dev-skip-to-reflection', { 
      detail: { timestamp: 58, reflection: 'first' } 
    }));
  };

  const handleSkipVideoSegment = () => {
    window.dispatchEvent(new CustomEvent('dev-skip-video'));
  };

  const handleJumpToHistory = () => {
    // Jump to history video activity
    const historyIndex = activities.findIndex(a => a.id === 'history-video');
    if (historyIndex !== -1) {
      onJumpToActivity(historyIndex);
    }
  };

  const handleJumpToExitTicket = () => {
    // Jump to exit ticket
    const exitIndex = activities.findIndex(a => a.id === 'exit-ticket');
    if (exitIndex !== -1) {
      onJumpToActivity(exitIndex);
    }
  };

  const handleAutoFillReflection = () => {
    // Auto-fill current reflection with sample response
    window.dispatchEvent(new CustomEvent('dev-auto-fill-reflection'));
  };

  const handleSkipToGuessAge = () => {
    // Jump to AI Age Guess activity
    const guessAgeIndex = activities.findIndex(a => a.id === 'guess-age');
    if (guessAgeIndex !== -1) {
      onJumpToActivity(guessAgeIndex);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed left-0 top-20 bg-red-900/95 backdrop-blur-sm text-white p-4 rounded-r-lg shadow-xl z-50 max-w-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          🔧 DEV MODE - What is AI?
        </h3>
        <span className="text-xs bg-red-800 px-2 py-1 rounded">
          Activity {currentActivity + 1}/{totalActivities}
        </span>
      </div>
      
      {/* Module-Specific Quick Actions */}
      <div className="space-y-2 mb-3">
        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Video Controls:</p>
          
          <button
            onClick={handleSkipVideoSegment}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors mb-1"
          >
            <FastForward className="w-4 h-4" />
            Skip Current Video Segment
          </button>
          
          <button
            onClick={handleSkipToReflection}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Skip to Reflection (0:59)
          </button>
        </div>

        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Quick Navigation:</p>
          
          <button
            onClick={handleSkipToGuessAge}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Brain className="w-3 h-3" />
            Jump to "Guess AI Age"
          </button>
          
          <button
            onClick={handleJumpToHistory}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Jump to History Video
          </button>
          
          <button
            onClick={handleJumpToExitTicket}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <CheckCircle className="w-3 h-3" />
            Jump to Exit Ticket
          </button>
        </div>

        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Auto-Fill:</p>
          
          <button
            onClick={handleAutoFillReflection}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Auto-Fill Current Response
          </button>
        </div>
        
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('dev-skip-forward'))}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Next Activity (Shift+→)
        </button>
        
        <button
          onClick={onCompleteAll}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Complete All Activities
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          Reset Module
        </button>
      </div>
      
      {/* Activity Jump List */}
      <div className="border-t border-red-800 pt-3">
        <p className="text-xs font-semibold mb-2">Jump to Activity:</p>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              onClick={() => onJumpToActivity(index)}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                index === currentActivity
                  ? 'bg-red-700 font-semibold'
                  : 'bg-red-800/50 hover:bg-red-800'
              }`}
            >
              {index + 1}. {activity.title}
              {activity.completed && ' ✓'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-red-800 text-xs text-red-300">
        <p>Shortcuts:</p>
        <p>• Ctrl+Shift+D: Toggle panel</p>
        <p>• Shift+→: Next activity</p>
        <p>• Shift+←: Previous activity</p>
      </div>
    </motion.div>
  );
}