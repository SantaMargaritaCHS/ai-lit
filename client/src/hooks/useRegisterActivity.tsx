import { useEffect } from 'react';
import { useActivityRegistry, ActivityType } from '../context/ActivityRegistryContext';

interface UseRegisterActivityOptions {
  id: string;
  type: ActivityType;
  name: string;
  description?: string;
  moduleId?: string;
  metadata?: any;
  isActive?: boolean;
}

export function useRegisterActivity({
  id,
  type,
  name,
  description,
  moduleId,
  metadata,
  isActive = true
}: UseRegisterActivityOptions) {
  const { registerActivity, unregisterActivity, markActivityCompleted } = useActivityRegistry();

  useEffect(() => {
    if (!isActive) return;

    // Register the activity
    registerActivity({
      id,
      type,
      name,
      description,
      moduleId,
      metadata,
      completed: false
    });

    // Cleanup: unregister on unmount
    return () => {
      unregisterActivity(id);
    };
  }, [id, type, name, description, moduleId, metadata, isActive, registerActivity, unregisterActivity]);

  // Return a function to mark this activity as completed
  const markCompleted = () => {
    markActivityCompleted(id);
  };

  return { markCompleted };
}

// Helper hook for video segments with pause activities
export function useRegisterVideoWithPauses(
  videoId: string,
  videoName: string,
  pauseActivities: Array<{
    id: string;
    name: string;
    timestamp: number;
    type: 'reflection' | 'quiz' | 'interactive';
  }>,
  moduleId?: string
) {
  const { registerActivity, unregisterActivity } = useActivityRegistry();

  useEffect(() => {
    // Register main video
    registerActivity({
      id: videoId,
      type: 'video-segment',
      name: videoName,
      moduleId,
      completed: false
    });

    // Register each pause activity
    pauseActivities.forEach((pauseActivity) => {
      registerActivity({
        id: pauseActivity.id,
        type: pauseActivity.type,
        name: pauseActivity.name,
        moduleId,
        metadata: { timestamp: pauseActivity.timestamp, parentVideo: videoId },
        completed: false
      });
    });

    // Cleanup
    return () => {
      unregisterActivity(videoId);
      pauseActivities.forEach(pa => unregisterActivity(pa.id));
    };
  }, [videoId, videoName, pauseActivities, moduleId, registerActivity, unregisterActivity]);
}