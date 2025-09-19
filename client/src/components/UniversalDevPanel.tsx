import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Play,
  SkipForward,
  RotateCcw,
  List,
  X,
  Code2,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ActivityType } from '../context/ActivityRegistryContext';
import { motion, AnimatePresence } from 'framer-motion';

// Universal developer panel for navigating activities
interface UniversalDevPanelProps {
  isVisible: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  
  // Activity data
  activities: Array<{
    id: string;
    type: ActivityType;
    name: string;
    completed: boolean;
    index: number;
  }>;
  currentActivityIndex: number;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  
  // Actions
  onGoToActivity: (index: number) => void;
  onAutoComplete: () => void;
  onSkipToEnd: () => void;
  onReset: () => void;
  onDeactivate: () => void;
}

export function UniversalDevPanel({
  isVisible,
  isCollapsed,
  onToggleCollapse,
  onClose,
  activities,
  currentActivityIndex,
  progress,
  onGoToActivity,
  onAutoComplete,
  onSkipToEnd,
  onReset,
  onDeactivate
}: UniversalDevPanelProps) {
  const [showActivityList, setShowActivityList] = useState(false);
  const currentActivity = activities[currentActivityIndex];

  const getActivityTypeColor = (type: ActivityType): string => {
    const colors: Record<ActivityType, string> = {
      'video': 'bg-blue-500',
      'video-segment': 'bg-blue-400',
      'reflection': 'bg-purple-500',
      'quiz': 'bg-green-500',
      'application': 'bg-orange-500',
      'transition': 'bg-gray-500',
      'pause-activity': 'bg-yellow-500',
      'interactive': 'bg-pink-500',
      'exit-ticket': 'bg-red-500',
      'certificate': 'bg-gold-500',
      'intro': 'bg-indigo-500',
      'outro': 'bg-indigo-400'
    };
    return colors[type] || 'bg-gray-400';
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'video':
      case 'video-segment':
        return '🎬';
      case 'reflection':
        return '💭';
      case 'quiz':
        return '❓';
      case 'application':
        return '🚀';
      case 'interactive':
        return '🎮';
      case 'pause-activity':
        return '⏸️';
      case 'certificate':
        return '🎓';
      default:
        return '📝';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed bottom-4 right-4 z-[9999] max-w-md"
      >
        <Card className={`bg-gray-900 text-white shadow-2xl border-gray-700 transition-all duration-300 ${
          isCollapsed ? 'w-64' : 'w-96'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Universal Dev Mode</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleCollapse}
                className="h-6 w-6 p-0 hover:bg-gray-800"
              >
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDeactivate}
                className="h-6 w-6 p-0 hover:bg-gray-800 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Collapsed View - Just current activity */}
          {isCollapsed && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400">
                  Activity {currentActivityIndex + 1}/{activities.length}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onGoToActivity(Math.max(0, currentActivityIndex - 1))}
                    disabled={currentActivityIndex === 0}
                    className="h-6 w-6 p-0 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onGoToActivity(Math.min(activities.length - 1, currentActivityIndex + 1))}
                    disabled={currentActivityIndex === activities.length - 1}
                    className="h-6 w-6 p-0 hover:bg-gray-800"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {currentActivity && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getActivityIcon(currentActivity.type)}</span>
                  <span className="text-xs truncate flex-1">{currentActivity.name}</span>
                  {currentActivity.completed && (
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Expanded View */}
          {!isCollapsed && (
            <div className="p-4 space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-300">
                    {progress.completed}/{progress.total} ({progress.percentage}%)
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-2 bg-gray-700" />
              </div>

              {/* Current Activity */}
              {currentActivity && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Current Activity</div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getActivityIcon(currentActivity.type)}</span>
                      <div className="flex-1 space-y-1">
                        <div className="font-medium text-sm">{currentActivity.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`text-xs px-2 py-0 ${getActivityTypeColor(currentActivity.type)} text-white border-0`}
                          >
                            {currentActivity.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            #{currentActivityIndex + 1}
                          </span>
                          {currentActivity.completed && (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Navigation</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGoToActivity(Math.max(0, currentActivityIndex - 1))}
                    disabled={currentActivityIndex === 0}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGoToActivity(Math.min(activities.length - 1, currentActivityIndex + 1))}
                    disabled={currentActivityIndex === activities.length - 1}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs"
                  >
                    Next
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAutoComplete}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Auto-Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowActivityList(!showActivityList)}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs"
                  >
                    <List className="w-3 h-3 mr-1" />
                    Activity List
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onSkipToEnd}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs"
                  >
                    <SkipForward className="w-3 h-3 mr-1" />
                    Skip to End
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onReset}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-xs text-red-400 hover:text-red-300"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Activity List */}
              {showActivityList && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">All Activities</div>
                  <div className="h-48 bg-gray-800 rounded-lg p-2 overflow-y-auto">
                    <div className="space-y-1">
                      {activities.map((activity, index) => (
                        <button
                          key={activity.id}
                          onClick={() => onGoToActivity(index)}
                          className={`w-full text-left p-2 rounded-md transition-colors text-xs flex items-center gap-2 ${
                            index === currentActivityIndex
                              ? 'bg-gray-700 text-white'
                              : 'hover:bg-gray-700/50 text-gray-300'
                          }`}
                        >
                          <span className="text-sm">{getActivityIcon(activity.type)}</span>
                          <span className="flex-1 truncate">{activity.name}</span>
                          <span className="text-gray-500">#{index + 1}</span>
                          {activity.completed && (
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts */}
              <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-700">
                <div className="font-semibold text-gray-400 mb-1">Keyboard Shortcuts:</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>← → Navigate</div>
                  <div>Shift+Enter Auto-complete</div>
                  <div>Ctrl+Shift+E Skip to end</div>
                  <div>Ctrl+Shift+R Reset</div>
                  <div>Ctrl+Alt+D Toggle panel</div>
                  <div>Esc Collapse panel</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}