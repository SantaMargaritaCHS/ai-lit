import { motion } from 'framer-motion';
import { FastForward, SkipForward, Home, Eye, Play } from 'lucide-react';

interface UnderstandingLLMsDeveloperPanelProps {
  currentActivity: number;
  totalActivities: number;
  activities: Array<{ id: string; title: string; completed: boolean }>;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function UnderstandingLLMsDeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  videoRef
}: UnderstandingLLMsDeveloperPanelProps) {
  
  const handleJumpToVideoSegment = (segmentType: 'intro' | 'training' | 'tokenization-intro' | 'tokenization-process' | 'tokenization-examples') => {
    console.log(`🔧 Developer mode: Jumping to ${segmentType} segment`);
    
    if (segmentType === 'intro') {
      // Jump to video-intro activity
      const videoIntroIndex = activities.findIndex(a => a.id === 'video-intro');
      if (videoIntroIndex !== -1) onJumpToActivity(videoIntroIndex);
    } else if (segmentType === 'training') {
      // Jump to video-training activity
      const videoTrainingIndex = activities.findIndex(a => a.id === 'video-training');
      if (videoTrainingIndex !== -1) onJumpToActivity(videoTrainingIndex);
    } else if (segmentType.startsWith('tokenization')) {
      // Jump to video-tokenization activity with specific segment
      const videoTokenizationIndex = activities.findIndex(a => a.id === 'video-tokenization');
      if (videoTokenizationIndex !== -1) {
        onJumpToActivity(videoTokenizationIndex);
        
        // Dispatch custom event for segment-specific navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dev-jump-to-tokenization-segment', {
            detail: { segment: segmentType }
          }));
        }, 100);
      }
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
          🔧 LLM MODULE DEV
        </h3>
        <span className="text-xs bg-red-800 px-2 py-1 rounded">
          Activity {currentActivity + 1}/{totalActivities}
        </span>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-2 mb-3">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('dev-skip-video'));
          }}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <FastForward className="w-4 h-4" />
          Skip to Segment End
        </button>
        
        {/* Video Segment Navigation */}
        <div className="border-t border-red-700 pt-2 mt-2">
          <p className="text-xs text-red-300 mb-2">Video Segments:</p>
          
          <button
            onClick={() => handleJumpToVideoSegment('intro')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Introduction to LLMs
          </button>
          
          <button
            onClick={() => handleJumpToVideoSegment('training')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Training Process
          </button>
          
          <div className="ml-2 space-y-1 mt-2">
            <p className="text-xs text-red-200 mb-1">Tokenization Segments:</p>
            
            <button
              onClick={() => handleJumpToVideoSegment('tokenization-intro')}
              className="w-full bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-xs flex items-center gap-2 transition-colors"
            >
              <Play className="w-3 h-3" />
              1. What is Tokenization? (0-90s)
            </button>
            
            <button
              onClick={() => handleJumpToVideoSegment('tokenization-process')}
              className="w-full bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-xs flex items-center gap-2 transition-colors"
            >
              <Play className="w-3 h-3" />
              2. How It Works (90-180s)
            </button>
            
            <button
              onClick={() => handleJumpToVideoSegment('tokenization-examples')}
              className="w-full bg-red-700 hover:bg-red-600 px-2 py-1 rounded text-xs flex items-center gap-2 transition-colors"
            >
              <Play className="w-3 h-3" />
              3. Examples (180s-end)
            </button>
          </div>
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
          <Eye className="w-4 h-4" />
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