import React, { useState, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Settings, Eye, Save, Play, FileDown, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ValidationPanel from './ValidationPanel';

/**
 * ModuleAssembly - Drag-and-drop interface for assembling modules
 *
 * Phase 1.4 + 1.6 of Module Builder
 *
 * Features:
 * - Sequential activity arrangement
 * - Reorder activities (up/down)
 * - Configure activity properties
 * - Visual module flow
 * - JSON export of complete module definition
 * - JSON import (Phase 1.6) - Resume previous work
 *
 * Future enhancement: Full drag-and-drop using @dnd-kit/core
 */

interface ActivityConfig {
  id: string;
  type: string;
  name: string;
  position: number;
  props: Record<string, any>;
  notes?: string;
}

interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  estimatedTime: string;
  activities: ActivityConfig[];
  videos: any[]; // From VideoSegmentEditor
  metadata: {
    author: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ModuleAssembly() {
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('High School (Ages 14-18)');
  const [estimatedTime, setEstimatedTime] = useState('20 min');
  const [activities, setActivities] = useState<ActivityConfig[]>([]);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);

  // Phase 1.6: JSON Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Temporary activity types until integration with ActivityCatalog
  const activityTypes = [
    { id: 'video', name: 'Video Segment', icon: '🎥' },
    { id: 'quiz', name: 'Multiple Choice Quiz', icon: '📝' },
    { id: 'reflection', name: 'AI-Validated Reflection', icon: '💭' },
    { id: 'interactive', name: 'Interactive Activity', icon: '⚡' },
    { id: 'scenario', name: 'Ethical Scenario', icon: '⚖️' },
    { id: 'exit-ticket', name: 'Exit Ticket', icon: '🎫' },
    { id: 'certificate', name: 'Certificate', icon: '🏆' },
  ];

  const addActivity = (type: string, name: string) => {
    const newActivity: ActivityConfig = {
      id: `activity-${Date.now()}`,
      type,
      name,
      position: activities.length,
      props: {},
      notes: '',
    };
    setActivities([...activities, newActivity]);
    setShowAddActivity(false);
  };

  const removeActivity = (id: string) => {
    const filtered = activities.filter((a) => a.id !== id);
    // Reindex positions
    const reindexed = filtered.map((a, idx) => ({ ...a, position: idx }));
    setActivities(reindexed);
  };

  const moveActivityUp = (index: number) => {
    if (index === 0) return;
    const newActivities = [...activities];
    [newActivities[index - 1], newActivities[index]] = [newActivities[index], newActivities[index - 1]];
    // Update positions
    newActivities[index - 1].position = index - 1;
    newActivities[index].position = index;
    setActivities(newActivities);
  };

  const moveActivityDown = (index: number) => {
    if (index === activities.length - 1) return;
    const newActivities = [...activities];
    [newActivities[index], newActivities[index + 1]] = [newActivities[index + 1], newActivities[index]];
    // Update positions
    newActivities[index].position = index;
    newActivities[index + 1].position = index + 1;
    setActivities(newActivities);
  };

  const updateActivityNotes = (id: string, notes: string) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, notes } : a))
    );
  };

  const exportModuleJSON = () => {
    const moduleDefinition: ModuleDefinition = {
      id: moduleTitle.toLowerCase().replace(/\s+/g, '-'),
      title: moduleTitle,
      description: moduleDescription,
      targetAudience,
      estimatedTime,
      activities,
      videos: [], // TODO: Link to VideoSegmentEditor data
      metadata: {
        author: 'Module Builder',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(moduleDefinition, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleDefinition.id}-module-definition.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Phase 1.6: Import Module JSON
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const importModuleJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate structure
      if (!data.id || !data.title || !data.activities || !Array.isArray(data.activities)) {
        throw new Error('Invalid module definition format. Missing required fields.');
      }

      // Validate activities
      for (const activity of data.activities) {
        if (!activity.id || !activity.type || !activity.name || typeof activity.position !== 'number') {
          throw new Error('Invalid activity format in module definition.');
        }
      }

      // Import successful - populate state
      setModuleTitle(data.title || '');
      setModuleDescription(data.description || '');
      setTargetAudience(data.targetAudience || 'High School (Ages 14-18)');
      setEstimatedTime(data.estimatedTime || '20 min');
      setActivities(data.activities || []);

      setImportStatus({
        type: 'success',
        message: `Successfully imported "${data.title}" with ${data.activities.length} activities!`,
      });

      // Clear status after 5 seconds
      setTimeout(() => setImportStatus(null), 5000);
    } catch (err: any) {
      console.error('Import error:', err);
      setImportStatus({
        type: 'error',
        message: err.message || 'Failed to import module. Please check the file format.',
      });

      // Clear error after 10 seconds
      setTimeout(() => setImportStatus(null), 10000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getActivityTypeIcon = (type: string): string => {
    const activityType = activityTypes.find((t) => t.id === type);
    return activityType?.icon || '📄';
  };

  // Helper to create module definition for validation
  const getCurrentModuleDefinition = (): ModuleDefinition | undefined => {
    if (!moduleTitle.trim() || activities.length === 0) {
      return undefined;
    }

    return {
      id: moduleTitle.toLowerCase().replace(/\s+/g, '-'),
      title: moduleTitle,
      description: moduleDescription,
      targetAudience,
      estimatedTime,
      activities,
      videos: [],
      metadata: {
        author: 'Module Builder',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Assembly</h2>
          <p className="text-sm text-gray-600 mt-1">
            Arrange activities in sequence to build your module
          </p>
        </div>
        <div className="flex gap-2">
          {/* Phase 1.6: Import Button */}
          <Button
            onClick={handleImportClick}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importModuleJSON}
            className="hidden"
          />

          {/* Export Button */}
          {activities.length > 0 && (
            <Button
              onClick={exportModuleJSON}
              disabled={!moduleTitle.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          )}
        </div>
      </div>

      {/* Import Status Message */}
      {importStatus && (
        <Card className={importStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {importStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-1 ${importStatus.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {importStatus.type === 'success' ? '✅ Import Successful' : '❌ Import Failed'}
                </h3>
                <p className={`text-sm ${importStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {importStatus.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Module Information</CardTitle>
          <CardDescription>Basic details about your module</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="module-title" className="text-sm font-medium text-gray-700">
                Module Title *
              </Label>
              <Input
                id="module-title"
                type="text"
                placeholder="Introduction to AI Ethics"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="estimated-time" className="text-sm font-medium text-gray-700">
                Estimated Time
              </Label>
              <Input
                id="estimated-time"
                type="text"
                placeholder="20 min"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="module-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="module-description"
              placeholder="What will students learn in this module?"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="target-audience" className="text-sm font-medium text-gray-700">
              Target Audience
            </Label>
            <Input
              id="target-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Phase 4.1: Validation Panel */}
      {moduleTitle.trim() && activities.length > 0 && (
        <ValidationPanel moduleDefinition={getCurrentModuleDefinition()} mode="quick" />
      )}

      {/* Activity Assembly Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Activity Types</CardTitle>
            <CardDescription className="text-xs">
              Click to add to your module
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => addActivity(type.id, type.name)}
                className="w-full flex items-center gap-3 p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-colors text-left"
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-sm font-medium text-gray-900">{type.name}</span>
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                💡 Tip: Activities from Phase 1.3 catalog will be draggable here in future enhancement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Module Flow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Module Flow</CardTitle>
            <CardDescription className="text-xs">
              {activities.length} activities • Students will progress through these in order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <Plus className="w-12 h-12 text-gray-400 mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No Activities Added</h3>
                <p className="text-xs text-gray-600 max-w-xs">
                  Click activity types on the left to build your module
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {/* Position Indicator */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveActivityUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded transition-colors ${
                            index === 0
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-purple-600 hover:bg-purple-100'
                          }`}
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveActivityDown(index)}
                          disabled={index === activities.length - 1}
                          className={`p-1 rounded transition-colors ${
                            index === activities.length - 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-purple-600 hover:bg-purple-100'
                          }`}
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getActivityTypeIcon(activity.type)}</span>
                        <h4 className="text-sm font-semibold text-gray-900">{activity.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {activity.type}
                        </span>
                      </div>

                      {/* Activity Notes */}
                      {editingActivity === activity.id ? (
                        <div className="mt-2">
                          <Textarea
                            placeholder="Add notes about this activity..."
                            value={activity.notes || ''}
                            onChange={(e) => updateActivityNotes(activity.id, e.target.value)}
                            className="text-xs"
                            rows={2}
                          />
                          <Button
                            onClick={() => setEditingActivity(null)}
                            size="sm"
                            className="mt-2 text-xs h-7"
                          >
                            Save Notes
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {activity.notes ? (
                            <p className="text-xs text-gray-600 mt-1">{activity.notes}</p>
                          ) : (
                            <p className="text-xs text-gray-400 italic mt-1">No notes added</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setEditingActivity(editingActivity === activity.id ? null : activity.id)
                        }
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Add notes"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeActivity(activity.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview & Export Section */}
      {activities.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Ready to Preview or Export</h3>
                <p className="text-sm text-purple-700">
                  Your module has {activities.length} activities. You can preview how it will look to students or export the definition for code generation.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                  disabled
                  title="Coming in Phase 1.5"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={exportModuleJSON}
                  disabled={!moduleTitle.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Play className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Future Enhancements (Phase 1.4+)
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Drag activities directly from Activity Catalog (Phase 1.3)</li>
                <li>• Full drag-and-drop reordering using @dnd-kit/core</li>
                <li>• Configure activity props (video URLs, quiz questions, etc.)</li>
                <li>• Link to videos from Video Segment Editor (Phase 1.2)</li>
                <li>• Live preview of assembled module (Phase 1.5)</li>
                <li>• AI-generated activity content from video transcripts (Phase 2)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
