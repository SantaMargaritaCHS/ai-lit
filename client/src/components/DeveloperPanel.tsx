import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, SkipForward, Home, Eye, X, Minimize2, Maximize2 } from 'lucide-react';

interface DeveloperPanelProps {
  currentActivity: number;
  totalActivities: number;
  activities: Array<{ id: string; title: string; completed: boolean }>;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  onSkipVideo?: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onClose?: () => void;
  isDevMode?: boolean;
}

export function DeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  onSkipVideo,
  videoRef,
  onClose,
  isDevMode
}: DeveloperPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const skipVideo = () => {
    if (videoRef?.current) {
      // Jump to 5 seconds before end
      const duration = videoRef.current.duration;
      if (duration) {
        videoRef.current.currentTime = duration - 5;
      }
    }
  };
  
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isMinimized ? 'auto' : '320px'
      }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-20 bg-red-900/95 backdrop-blur-sm text-white rounded-r-lg shadow-xl z-50 overflow-hidden"
      style={{ padding: isMinimized ? '8px 12px' : '16px' }}
    >
      {isMinimized ? (
        // Minimized view
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm">🔧</h3>
          <span className="text-xs">
            {currentActivity + 1}/{totalActivities}
          </span>
          <button
            onClick={() => setIsMinimized(false)}
            className="hover:bg-red-800 p-1 rounded transition-colors"
            title="Expand panel"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Expanded view
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              🔧 DEV MODE
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-red-800 px-2 py-1 rounded">
                Activity {currentActivity + 1}/{totalActivities}
              </span>
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-red-800 p-1 rounded transition-colors"
                title="Minimize panel"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
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
          Skip to 5s Before Segment End
        </button>
        
        <button
          onClick={() => {
            // Jump to video-intro activity which has reflections
            const videoActivityIndex = activities.findIndex(a => a.id === 'video-intro');
            if (videoActivityIndex !== -1) {
              onJumpToActivity(videoActivityIndex);
            }
          }}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Jump to Video Reflections
        </button>
        
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('dev-skip-to-first-reflection'));
          }}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <FastForward className="w-4 h-4" />
          Skip to First Reflection (0:58)
        </button>
        
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('dev-skip-to-second-reflection'));
          }}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <FastForward className="w-4 h-4" />
          Skip to Second Reflection (1:21)
        </button>
        
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('dev-replay-video'));
          }}
          className="w-full bg-red-800 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          Replay from Segment Start
        </button>
        
        {/* History Video Question Navigation */}
        <div className="border-t border-red-700 pt-2 mt-2">
          <p className="text-xs text-red-300 mb-2">History Video Questions:</p>
          
          <button
            onClick={() => {
              console.log('🔧 Q1 Button clicked - dispatching dev-jump-to-history-question event');
              window.dispatchEvent(new CustomEvent('dev-jump-to-history-question', { 
                detail: { questionIndex: 0 } 
              }));
            }}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Eye className="w-3 h-3" />
            Q1: Turing Test (1:35)
          </button>
          
          <button
            onClick={() => {
              console.log('🔧 Q2 Button clicked - dispatching dev-jump-to-history-question event');
              window.dispatchEvent(new CustomEvent('dev-jump-to-history-question', { 
                detail: { questionIndex: 1 } 
              }));
            }}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors mb-1"
          >
            <Eye className="w-3 h-3" />
            Q2: AI Winter (2:30)
          </button>
          
          <button
            onClick={() => {
              console.log('🔧 Q3 Button clicked - dispatching dev-jump-to-history-question event');
              window.dispatchEvent(new CustomEvent('dev-jump-to-history-question', { 
                detail: { questionIndex: 2 } 
              }));
            }}
            className="w-full bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Q3: Modern AI (3:40)
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
            <p>• Ctrl+Alt+D: Toggle panel</p>
            <p>• Shift+→: Next activity</p>
            <p>• Shift+←: Previous activity</p>
          </div>
        </>
      )}
    </motion.div>
  );
}