import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type ActivityType = 
  | 'video'
  | 'video-segment'
  | 'reflection'
  | 'quiz'
  | 'application'
  | 'transition'
  | 'pause-activity'
  | 'interactive'
  | 'exit-ticket'
  | 'certificate'
  | 'intro'
  | 'outro';

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  description?: string;
  moduleId?: string;
  index: number;
  completed: boolean;
  metadata?: any;
}

interface ActivityRegistryContextType {
  activities: Activity[];
  currentActivityIndex: number;
  registerActivity: (activity: Omit<Activity, 'index'>) => void;
  unregisterActivity: (id: string) => void;
  setCurrentActivity: (index: number) => void;
  goToNextActivity: () => void;
  goToPreviousActivity: () => void;
  goToActivity: (index: number) => void;
  markActivityCompleted: (id: string) => void;
  clearRegistry: () => void;
  getProgress: () => { completed: number; total: number; percentage: number };
  isFirstActivity: () => boolean;
  isLastActivity: () => boolean;
}

const ActivityRegistryContext = createContext<ActivityRegistryContextType | undefined>(undefined);

export function ActivityRegistryProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const registerActivity = useCallback((activity: Omit<Activity, 'index'>) => {
    setActivities(prev => {
      const existing = prev.find(a => a.id === activity.id);
      if (existing) return prev;
      
      const newActivity: Activity = {
        ...activity,
        index: prev.length,
        completed: false
      };
      return [...prev, newActivity].sort((a, b) => a.index - b.index);
    });
  }, []);

  const unregisterActivity = useCallback((id: string) => {
    setActivities(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // Reindex activities
      return filtered.map((activity, index) => ({ ...activity, index }));
    });
  }, []);

  const setCurrentActivity = useCallback((index: number) => {
    if (index >= 0 && index < activities.length) {
      setCurrentActivityIndex(index);
    }
  }, [activities.length]);

  const goToNextActivity = useCallback(() => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    }
  }, [currentActivityIndex, activities.length]);

  const goToPreviousActivity = useCallback(() => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    }
  }, [currentActivityIndex]);

  const goToActivity = useCallback((index: number) => {
    if (index >= 0 && index < activities.length) {
      setCurrentActivityIndex(index);

      // Dispatch event for modules to listen to
      console.log(`🎯 ActivityRegistry: Dispatching goToActivity event for index ${index}`);
      window.dispatchEvent(new CustomEvent('goToActivity', { detail: index }));
    }
  }, [activities.length]);

  const markActivityCompleted = useCallback((id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: true }
          : activity
      )
    );
  }, []);

  const clearRegistry = useCallback(() => {
    setActivities([]);
    setCurrentActivityIndex(0);
  }, []);

  const getProgress = useCallback(() => {
    const completed = activities.filter(a => a.completed).length;
    const total = activities.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [activities]);

  const isFirstActivity = useCallback(() => currentActivityIndex === 0, [currentActivityIndex]);
  const isLastActivity = useCallback(() => currentActivityIndex === activities.length - 1, [currentActivityIndex, activities.length]);

  // Global keyboard navigation (only when dev mode is active)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if dev mode is active (we'll check this from sessionStorage)
      const devModeActive = sessionStorage.getItem('universal-dev-mode-active') === 'true';
      if (!devModeActive) return;

      if (e.key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        goToPreviousActivity();
      } else if (e.key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        goToNextActivity();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNextActivity, goToPreviousActivity]);

  const value: ActivityRegistryContextType = {
    activities,
    currentActivityIndex,
    registerActivity,
    unregisterActivity,
    setCurrentActivity,
    goToNextActivity,
    goToPreviousActivity,
    goToActivity,
    markActivityCompleted,
    clearRegistry,
    getProgress,
    isFirstActivity,
    isLastActivity
  };

  return (
    <ActivityRegistryContext.Provider value={value}>
      {children}
    </ActivityRegistryContext.Provider>
  );
}

export function useActivityRegistry() {
  const context = useContext(ActivityRegistryContext);
  if (!context) {
    throw new Error('useActivityRegistry must be used within an ActivityRegistryProvider');
  }
  return context;
}