import { motion } from 'framer-motion';
import { FastForward, SkipForward, Home, Eye, Play, Brain, MessageSquare, Shuffle, CheckCircle, Award } from 'lucide-react';

interface IntroToGenAIDeveloperPanelProps {
  currentActivity: number;
  totalActivities: number;
  activities: Array<{ id: string; title: string; completed: boolean }>;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function IntroToGenAIDeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  videoRef
}: IntroToGenAIDeveloperPanelProps) {
  
  // Module-specific quick actions for "Introduction to Generative AI" module
  const handleSkipToReflection = () => {
    // Skip to first reflection after video segment 1 (at 123s)
    window.dispatchEvent(new CustomEvent('dev-skip-to-reflection', { 
      detail: { timestamp: 120, reflection: 'first' } 
    }));
  };

  const handleSkipVideoSegment = () => {
    window.dispatchEvent(new CustomEvent('dev-skip-video'));
  };

  const handleJumpToSortingGame = () => {
    // Jump to interactive sorting activity
    const sortingIndex = activities.findIndex(a => a.id === 'interactive-activity');
    if (sortingIndex !== -1) {
      onJumpToActivity(sortingIndex);
    }
  };

  const handleJumpToExploreTools = () => {
    // Jump to explore tools activity
    const exploreIndex = activities.findIndex(a => a.id === 'explore-tools');
    if (exploreIndex !== -1) {
      onJumpToActivity(exploreIndex);
    }
  };

  const handleJumpToVideoSegment = (segmentNumber: number) => {
    // Jump to specific video segment
    const videoIndex = activities.findIndex(a => a.id === `video-segment-${segmentNumber}`);
    if (videoIndex !== -1) {
      onJumpToActivity(videoIndex);
    }
  };

  const handleAutoFillReflection = () => {
    // Auto-fill current reflection with sample response
    window.dispatchEvent(new CustomEvent('dev-auto-fill-reflection'));
  };

  const handleAutoCompleteSorting = () => {
    // Auto-complete the sorting game
    window.dispatchEvent(new CustomEvent('dev-auto-complete-sorting'));
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
          🔧 DEV MODE - Intro to GenAI
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
            <MessageSquare className="w-4 h-4" />
            Skip to First Reflection (2:03)
          </button>
        </div>

        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Video Segments:</p>
          
          <button
            onClick={() => handleJumpToVideoSegment(1)}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Segment 1: What is GenAI?
          </button>
          
          <button
            onClick={() => handleJumpToVideoSegment(2)}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Segment 2: Popular Tools
          </button>
          
          <button
            onClick={() => handleJumpToVideoSegment(3)}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <Play className="w-3 h-3" />
            Segment 3: Benefits & Limits
          </button>
        </div>

        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Quick Navigation:</p>
          
          <button
            onClick={handleJumpToSortingGame}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Shuffle className="w-3 h-3" />
            Jump to Sorting Game
          </button>
          
          <button
            onClick={handleJumpToExploreTools}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <Brain className="w-3 h-3" />
            Jump to Explore Tools
          </button>
        </div>

        <div className="border-b border-red-700 pb-2 mb-2">
          <p className="text-xs text-red-300 mb-2">Auto-Complete:</p>
          
          <button
            onClick={handleAutoFillReflection}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Eye className="w-3 h-3" />
            Auto-Fill Reflection
          </button>
          
          <button
            onClick={handleAutoCompleteSorting}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <CheckCircle className="w-3 h-3" />
            Auto-Complete Sorting
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
          <Award className="w-4 h-4" />
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