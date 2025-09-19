import React from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  completed: boolean;
}

interface Props {
  currentActivity: number;
  totalActivities: number;
  activities: Activity[];
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
}

export default function LLMLimitationsDeveloperPanel({
  currentActivity,
  totalActivities,
  activities,
  onJumpToActivity,
  onCompleteAll,
  onReset
}: Props) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed left-4 top-20 bg-gray-900 text-white p-6 rounded-lg shadow-2xl z-[99999] w-80 max-h-[80vh] overflow-y-auto border-4 border-yellow-400"
      style={{ zIndex: 99999 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-400">Developer Panel</h3>
        <span className="text-sm text-gray-400">
          {currentActivity + 1} / {totalActivities}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={onCompleteAll}
          className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Complete All Activities
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Module
        </button>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-300">Jump to Activity:</h4>
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              onClick={() => onJumpToActivity(index)}
              className={`w-full text-left py-2 px-3 rounded text-sm transition-colors ${
                index === currentActivity
                  ? 'bg-red-600 text-white'
                  : activity.completed
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {activity.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : index === currentActivity ? (
                  <PlayCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-500" />
                )}
                <span className="truncate">{activity.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400">
        <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
        <div className="space-y-1">
          <p>Ctrl+Alt+D: Toggle this panel</p>
          <p>← → Arrow keys: Navigate activities</p>
          <p>Ctrl+F: Auto-fill current activity</p>
          <p>Ctrl+C: Complete all activities</p>
          <p>Ctrl+R: Reset module</p>
        </div>
      </div>
    </motion.div>
  );
}