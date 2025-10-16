import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Target, Lightbulb } from 'lucide-react';
import { ActivityType } from '@/context/ActivityRegistryContext';
import { getModuleDefinition, calculateModuleDuration, ModuleActivity } from '@/data/moduleActivityDefinitions';

interface ModuleOutlineProps {
  moduleId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Get icon emoji for activity type
 */
function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    'video': '🎬',
    'video-segment': '🎬',
    'reflection': '💭',
    'quiz': '❓',
    'application': '🚀',
    'interactive': '🎮',
    'pause-activity': '⏸️',
    'certificate': '🎓',
    'intro': '👋',
    'outro': '🎉',
    'transition': '➡️',
    'exit-ticket': '📝'
  };
  return icons[type] || '📋';
}

/**
 * Get color for activity type badge
 */
function getActivityTypeColor(type: ActivityType): string {
  const colors: Record<ActivityType, string> = {
    'video': 'bg-blue-100 text-blue-800 border-blue-200',
    'video-segment': 'bg-blue-100 text-blue-800 border-blue-200',
    'reflection': 'bg-purple-100 text-purple-800 border-purple-200',
    'quiz': 'bg-green-100 text-green-800 border-green-200',
    'application': 'bg-orange-100 text-orange-800 border-orange-200',
    'interactive': 'bg-pink-100 text-pink-800 border-pink-200',
    'pause-activity': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'certificate': 'bg-amber-100 text-amber-800 border-amber-200',
    'intro': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'outro': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'transition': 'bg-gray-100 text-gray-800 border-gray-200',
    'exit-ticket': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Get display name for activity type
 */
function getActivityTypeName(type: ActivityType): string {
  const names: Record<ActivityType, string> = {
    'video': 'Video',
    'video-segment': 'Video',
    'reflection': 'Reflection',
    'quiz': 'Quiz',
    'application': 'Application',
    'interactive': 'Interactive',
    'pause-activity': 'Pause Activity',
    'certificate': 'Certificate',
    'intro': 'Introduction',
    'outro': 'Conclusion',
    'transition': 'Transition',
    'exit-ticket': 'Exit Ticket'
  };
  return names[type] || 'Activity';
}

export function ModuleOutline({ moduleId, isOpen, onClose }: ModuleOutlineProps) {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const moduleDefinition = getModuleDefinition(moduleId);
  const totalDuration = calculateModuleDuration(moduleId);

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const expandAll = () => {
    if (moduleDefinition) {
      setExpandedActivities(new Set(moduleDefinition.activities.map(a => a.id)));
    }
  };

  const collapseAll = () => {
    setExpandedActivities(new Set());
  };

  if (!moduleDefinition) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Module Not Found</DialogTitle>
            <DialogDescription className="text-gray-600">
              Activity outline is not available for this module yet.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { moduleName, activities } = moduleDefinition;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-white p-0">
        {/* Fixed Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                {moduleName}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Complete activity outline with learning objectives and key takeaways
              </DialogDescription>
            </div>
          </div>

          {/* Module Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-blue-900">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total Duration: {totalDuration}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{activities.length} Activities</span>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Expand All
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Collapse All
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Activity List */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-3 mt-4">
            {activities.map((activity: ModuleActivity, index: number) => {
              const isExpanded = expandedActivities.has(activity.id);

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all overflow-hidden"
                >
                  {/* Activity Header - Always Visible, Clickable */}
                  <button
                    onClick={() => toggleActivity(activity.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-blue-50 transition-colors"
                  >
                    {/* Activity Number & Icon */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold border-2 border-blue-200">
                        {index + 1}
                      </div>
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {activity.duration && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {activity.duration}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                        {activity.description}
                      </p>

                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 ${getActivityTypeColor(activity.type)}`}
                      >
                        {getActivityTypeName(activity.type)}
                      </Badge>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50 space-y-4">
                      {/* Detailed Description */}
                      {activity.detailedDescription && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            About This Activity
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {activity.detailedDescription}
                          </p>
                        </div>
                      )}

                      {/* What You'll Do */}
                      {activity.whatYoullDo && activity.whatYoullDo.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            What You'll Do
                          </h4>
                          <ul className="space-y-1.5">
                            {activity.whatYoullDo.map((item, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Learning Objectives */}
                        {activity.learningObjectives && activity.learningObjectives.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-green-100">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4 text-green-600" />
                              Learning Objectives
                            </h4>
                            <ul className="space-y-1.5">
                              {activity.learningObjectives.map((obj, i) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Key Takeaways */}
                        {activity.keyTakeaways && activity.keyTakeaways.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-amber-100">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600" />
                              Key Takeaways
                            </h4>
                            <ul className="space-y-1.5">
                              {activity.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Click on any activity to see detailed information. Activities are completed sequentially—you'll earn a certificate when finished!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
