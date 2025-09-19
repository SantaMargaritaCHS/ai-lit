import React, { ReactNode, useEffect } from 'react';
import { useRegisterActivity } from '../hooks/useRegisterActivity';
import { ActivityType } from '../context/ActivityRegistryContext';
import { useActivityRegistry } from '../context/ActivityRegistryContext';

interface ModuleActivityWrapperProps {
  activityId: string;
  activityType: ActivityType;
  activityName: string;
  moduleId?: string;
  children: ReactNode;
  onComplete?: () => void;
  autoMarkComplete?: boolean;
}

/**
 * Wrapper component that automatically registers an activity with the universal dev mode
 * Use this to wrap any activity component to make it navigable via dev mode
 */
export function ModuleActivityWrapper({
  activityId,
  activityType,
  activityName,
  moduleId,
  children,
  onComplete,
  autoMarkComplete = false
}: ModuleActivityWrapperProps) {
  const { markCompleted } = useRegisterActivity({
    id: activityId,
    type: activityType,
    name: activityName,
    moduleId
  });

  const { currentActivityIndex, activities } = useActivityRegistry();
  
  // Check if this is the current activity
  const isCurrentActivity = activities[currentActivityIndex]?.id === activityId;

  // Listen for dev mode events
  useEffect(() => {
    if (!isCurrentActivity) return;

    const handleDevAutoComplete = (e: CustomEvent) => {
      if (e.detail.activityId === activityId) {
        console.log(`🔧 Auto-completing activity: ${activityName}`);
        markCompleted();
        onComplete?.();
      }
    };

    const handleDevSkipVideo = (e: CustomEvent) => {
      if (e.detail.activityId === activityId && activityType === 'video') {
        console.log(`🔧 Skipping video: ${activityName}`);
        markCompleted();
        onComplete?.();
      }
    };

    const handleDevAutoReflection = (e: CustomEvent) => {
      if (e.detail.activityId === activityId && activityType === 'reflection') {
        console.log(`🔧 Auto-filling reflection: ${activityName}`);
        // Dispatch response to the reflection component
        const input = document.querySelector(`[data-activity-id="${activityId}"] textarea`) as HTMLTextAreaElement;
        if (input) {
          input.value = e.detail.response || 'This activity provided valuable insights.';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        markCompleted();
        onComplete?.();
      }
    };

    window.addEventListener('dev-auto-complete', handleDevAutoComplete as EventListener);
    window.addEventListener('dev-skip-video', handleDevSkipVideo as EventListener);
    window.addEventListener('dev-auto-reflection', handleDevAutoReflection as EventListener);

    return () => {
      window.removeEventListener('dev-auto-complete', handleDevAutoComplete as EventListener);
      window.removeEventListener('dev-skip-video', handleDevSkipVideo as EventListener);
      window.removeEventListener('dev-auto-reflection', handleDevAutoReflection as EventListener);
    };
  }, [activityId, activityType, activityName, isCurrentActivity, markCompleted, onComplete]);

  // Auto-mark complete on mount if requested
  useEffect(() => {
    if (autoMarkComplete) {
      markCompleted();
    }
  }, [autoMarkComplete, markCompleted]);

  return (
    <div data-activity-id={activityId} data-activity-type={activityType}>
      {children}
    </div>
  );
}

// Convenience components for common activity types
export function VideoActivity({ id, name, moduleId, children, onComplete }: Omit<ModuleActivityWrapperProps, 'activityType'>) {
  return (
    <ModuleActivityWrapper
      activityId={id}
      activityType="video"
      activityName={name}
      moduleId={moduleId}
      onComplete={onComplete}
    >
      {children}
    </ModuleActivityWrapper>
  );
}

export function ReflectionActivity({ id, name, moduleId, children, onComplete }: Omit<ModuleActivityWrapperProps, 'activityType'>) {
  return (
    <ModuleActivityWrapper
      activityId={id}
      activityType="reflection"
      activityName={name}
      moduleId={moduleId}
      onComplete={onComplete}
    >
      {children}
    </ModuleActivityWrapper>
  );
}

export function QuizActivity({ id, name, moduleId, children, onComplete }: Omit<ModuleActivityWrapperProps, 'activityType'>) {
  return (
    <ModuleActivityWrapper
      activityId={id}
      activityType="quiz"
      activityName={name}
      moduleId={moduleId}
      onComplete={onComplete}
    >
      {children}
    </ModuleActivityWrapper>
  );
}

export function InteractiveActivity({ id, name, moduleId, children, onComplete }: Omit<ModuleActivityWrapperProps, 'activityType'>) {
  return (
    <ModuleActivityWrapper
      activityId={id}
      activityType="interactive"
      activityName={name}
      moduleId={moduleId}
      onComplete={onComplete}
    >
      {children}
    </ModuleActivityWrapper>
  );
}