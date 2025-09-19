import { motion } from 'framer-motion';
import { FastForward, SkipForward, Home, Eye, Play, AlertTriangle, Brain, MessageSquare } from 'lucide-react';

interface LLMLimitationsDeveloperPanelProps {
  currentActivity: number;
  totalActivities: number;
  activities: Array<{ id: string; title: string; completed: boolean }>;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function LLMLimitationsDeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  videoRef
}: LLMLimitationsDeveloperPanelProps) {
  
  const handleJumpToVideoSegment = (segmentType: 'oracle' | 'pattern' | 'limitations' | 'hallucinations' | 'bias' | 'outdated' | 'conclusion') => {
    console.log(`🔧 Developer mode: Jumping to ${segmentType} segment`);
    
    const segmentMap = {
      'oracle': 'video1',
      'pattern': 'video2', 
      'limitations': 'video3',
      'hallucinations': 'video4',
      'bias': 'video5',
      'outdated': 'video6',
      'conclusion': 'video7'
    };
    
    const targetVideoId = segmentMap[segmentType];
    const videoIndex = activities.findIndex(a => a.id === targetVideoId);
    if (videoIndex !== -1) {
      onJumpToActivity(videoIndex);
      
      // Dispatch custom event for segment-specific navigation
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dev-jump-to-video-segment', {
          detail: { segment: segmentType, videoId: targetVideoId }
        }));
      }, 100);
    }
  };

  const handleJumpToActivity = (activityType: 'hallucination' | 'bias' | 'outdated' | 'reflection') => {
    console.log(`🔧 Developer mode: Jumping to ${activityType} activity`);
    
    const activityMap = {
      'hallucination': 'hallucination-activity',
      'bias': 'bias-activity',
      'outdated': 'outdated-activity',
      'reflection': 'reflection'
    };
    
    const targetActivityId = activityMap[activityType];
    const activityIndex = activities.findIndex(a => a.id === targetActivityId);
    if (activityIndex !== -1) {
      onJumpToActivity(activityIndex);
    }
  };
  
  return (
    <div
      className="fixed left-0 top-16 bg-red-600 text-white p-4 rounded-r-lg shadow-2xl border-4 border-yellow-400"
      style={{ 
        zIndex: 99999,
        maxWidth: '320px',
        minWidth: '280px',
        position: 'fixed',
        left: '0px',
        top: '64px'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          🔧 LLM LIMITS DEV
          <AlertTriangle className="w-4 h-4" />
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
          Skip Video Segment
        </button>
        
        {/* Video Segment Navigation */}
        <div className="border-t border-red-700 pt-2 mt-2">
          <p className="text-xs text-red-300 mb-2">Video Segments:</p>
          
          <button
            onClick={() => handleJumpToVideoSegment('oracle')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Oracle Analogy (0-44s)
          </button>
          
          <button
            onClick={() => handleJumpToVideoSegment('pattern')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Pattern Recognition (44-119s)
          </button>

          <button
            onClick={() => handleJumpToVideoSegment('limitations')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Play className="w-3 h-3" />
            Four Limitations (119-206s)
          </button>

          <button
            onClick={() => handleJumpToVideoSegment('hallucinations')}
            className="w-full bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <AlertTriangle className="w-3 h-3" />
            Hallucinations (206-218s)
          </button>

          <button
            onClick={() => handleJumpToVideoSegment('bias')}
            className="w-full bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Brain className="w-3 h-3" />
            Training Bias (220-246s)
          </button>

          <button
            onClick={() => handleJumpToVideoSegment('outdated')}
            className="w-full bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Eye className="w-3 h-3" />
            Outdated Info (246-273s)
          </button>

          <button
            onClick={() => handleJumpToVideoSegment('conclusion')}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <MessageSquare className="w-3 h-3" />
            Conclusion (273-377s)
          </button>
        </div>

        {/* Activity Navigation */}
        <div className="border-t border-red-700 pt-2 mt-2">
          <p className="text-xs text-red-300 mb-2">Key Activities:</p>
          
          <button
            onClick={() => handleJumpToActivity('hallucination')}
            className="w-full bg-yellow-800 hover:bg-yellow-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <AlertTriangle className="w-3 h-3" />
            Hallucination Detective
          </button>
          
          <button
            onClick={() => handleJumpToActivity('bias')}
            className="w-full bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Brain className="w-3 h-3" />
            Bias Exploration
          </button>
          
          <button
            onClick={() => handleJumpToActivity('outdated')}
            className="w-full bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Eye className="w-3 h-3" />
            Knowledge Cutoff
          </button>
          
          <button
            onClick={() => handleJumpToActivity('reflection')}
            className="w-full bg-green-800 hover:bg-green-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <MessageSquare className="w-3 h-3" />
            Exit Ticket
          </button>
        </div>
      </div>
      
      {/* Management Actions */}
      <div className="border-t border-red-700 pt-2 space-y-2">
        <button
          onClick={onCompleteAll}
          className="w-full bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Complete All Activities
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          Reset Module
        </button>
      </div>
      
      {/* Keyboard Shortcuts */}
      <div className="border-t border-red-700 pt-2 mt-2">
        <p className="text-xs text-red-300 mb-1">Keyboard Shortcuts:</p>
        <div className="text-xs text-red-200 space-y-1">
          <div>→ Next Activity</div>
          <div>← Previous Activity</div>
          <div>Ctrl+Alt+D Developer Panel</div>
          <div>Space Skip Video</div>
        </div>
      </div>
    </div>
  );
}