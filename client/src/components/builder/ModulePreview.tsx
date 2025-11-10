import React, { useState } from 'react';
import { Play, X, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ModulePreview - Runtime preview of assembled module
 *
 * Phase 1.5 of Module Builder
 *
 * Features:
 * - Simulates student experience
 * - Activity-by-activity navigation
 * - Completion tracking
 * - Dev Mode support (if integrated)
 * - Mobile-responsive preview
 *
 * This component provides a "what students will see" preview before
 * exporting to code or deploying the module.
 */

interface Activity {
  id: string;
  type: string;
  name: string;
  position: number;
  props: Record<string, any>;
  notes?: string;
}

interface ModulePreviewProps {
  moduleTitle?: string;
  moduleDescription?: string;
  activities?: Activity[];
}

export default function ModulePreview({
  moduleTitle = 'Untitled Module',
  moduleDescription = '',
  activities = [],
}: ModulePreviewProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const currentActivity = activities[currentActivityIndex];
  const progress = activities.length > 0 ? ((completedActivities.size / activities.length) * 100) : 0;

  const markComplete = (activityId: string) => {
    setCompletedActivities(new Set([...completedActivities, activityId]));
  };

  const goToNextActivity = () => {
    if (currentActivity) {
      markComplete(currentActivity.id);
    }
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    }
  };

  const goToPreviousActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  const getActivityTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      video: '🎥',
      quiz: '📝',
      reflection: '💭',
      interactive: '⚡',
      scenario: '⚖️',
      'exit-ticket': '🎫',
      certificate: '🏆',
    };
    return icons[type] || '📄';
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      case 'desktop':
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Module Preview</h2>
        <p className="text-sm text-gray-600 mt-1">
          See what students will experience • Activity {currentActivityIndex + 1} of {activities.length}
        </p>
      </div>

      {/* Preview Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Preview Mode:</span>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  💻 Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    previewMode === 'tablet'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Tablet
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Mobile
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <span className="text-xs font-medium text-gray-700">Progress:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-purple-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Window */}
      {activities.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities to Preview</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Add activities in the Module Assembly tab to see a preview of your module
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center">
          <div className={`${getPreviewWidth()} w-full`}>
            <Card className="border-2 border-purple-300 shadow-xl">
              {/* Module Header (Student View) */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-2">{moduleTitle}</h1>
                {moduleDescription && (
                  <p className="text-purple-100 text-sm">{moduleDescription}</p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-purple-100">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {completedActivities.size} of {activities.length} activities completed
                  </span>
                </div>
              </div>

              {/* Activity Content Area */}
              <CardContent className="p-6 min-h-[400px]">
                {currentActivity ? (
                  <div>
                    {/* Activity Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <span className="text-4xl">{getActivityTypeIcon(currentActivity.type)}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {currentActivity.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Activity {currentActivityIndex + 1} of {activities.length} •{' '}
                          <span className="capitalize">{currentActivity.type}</span>
                        </p>
                      </div>
                      {completedActivities.has(currentActivity.id) && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>

                    {/* Activity Preview Content */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <strong>Preview Mode:</strong> This is a simulated preview. In the actual module,
                          students would see the full {currentActivity.type} activity here.
                        </p>
                      </div>

                      {/* Activity Type-Specific Preview */}
                      {currentActivity.type === 'video' && (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <Play className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">
                            Video player would appear here with segmented chapters
                          </p>
                        </div>
                      )}

                      {currentActivity.type === 'quiz' && (
                        <div className="space-y-3">
                          <p className="font-medium text-gray-900">Sample Quiz Question</p>
                          {['Option A', 'Option B', 'Option C', 'Option D'].map((option, idx) => (
                            <div
                              key={idx}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {currentActivity.type === 'reflection' && (
                        <div>
                          <p className="font-medium text-gray-900 mb-3">Reflection Question</p>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            rows={6}
                            placeholder="Students would type their reflection here..."
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            ✨ AI validation would provide feedback on student responses
                          </p>
                        </div>
                      )}

                      {currentActivity.type === 'interactive' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                          <span className="text-6xl mb-3 block">⚡</span>
                          <p className="text-sm text-purple-900">
                            Interactive activity (calculator, matrix, etc.) would render here
                          </p>
                        </div>
                      )}

                      {currentActivity.type === 'scenario' && (
                        <div>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 italic">
                              "A scenario description would appear here, presenting an ethical dilemma or
                              case study for students to analyze..."
                            </p>
                          </div>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            rows={4}
                            placeholder="Students would respond to the scenario here..."
                            disabled
                          />
                        </div>
                      )}

                      {currentActivity.type === 'exit-ticket' && (
                        <div>
                          <p className="font-medium text-gray-900 mb-3">Choose a reflection prompt:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="p-4 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50">
                              <div className="text-2xl mb-2">🎯</div>
                              <p className="font-medium text-sm">Personal Application</p>
                            </div>
                            <div className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                              <div className="text-2xl mb-2">🔍</div>
                              <p className="font-medium text-sm">Critical Analysis</p>
                            </div>
                          </div>
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            rows={5}
                            placeholder="Students would write their exit ticket reflection..."
                            disabled
                          />
                        </div>
                      )}

                      {currentActivity.type === 'certificate' && (
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-8 text-center">
                          <div className="text-6xl mb-4">🏆</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Certificate of Completion
                          </h3>
                          <p className="text-gray-700 mb-4">This certifies that</p>
                          <p className="text-2xl font-bold text-purple-600 mb-4">[Student Name]</p>
                          <p className="text-gray-700">has successfully completed</p>
                          <p className="text-lg font-semibold text-gray-900 mt-2">{moduleTitle}</p>
                        </div>
                      )}

                      {/* Activity Notes (Developer View) */}
                      {currentActivity.notes && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            📝 Developer Notes:
                          </p>
                          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                            {currentActivity.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No activity selected</p>
                )}
              </CardContent>

              {/* Navigation Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <Button
                  onClick={goToPreviousActivity}
                  disabled={currentActivityIndex === 0}
                  variant="outline"
                  className="text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  {currentActivityIndex + 1} / {activities.length}
                </span>

                <Button
                  onClick={goToNextActivity}
                  disabled={currentActivityIndex === activities.length - 1}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentActivityIndex === activities.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
            <CardDescription className="text-xs">
              Click any activity to jump to it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity, idx) => (
                <button
                  key={activity.id}
                  onClick={() => setCurrentActivityIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    idx === currentActivityIndex
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : completedActivities.has(activity.id)
                      ? 'border-green-300 bg-green-50 text-green-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm">{getActivityTypeIcon(activity.type)}</span>
                  <span className="text-xs font-medium">
                    {idx + 1}. {activity.name}
                  </span>
                  {completedActivities.has(activity.id) && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
