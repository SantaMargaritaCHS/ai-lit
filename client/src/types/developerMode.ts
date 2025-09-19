/**
 * Universal Developer Mode Type Definitions
 * 
 * This module defines the core types used throughout the Universal Developer Mode system.
 * These types ensure consistency and type safety across all components and modules.
 */

export interface UniversalActivity {
  id: string;
  title: string;
  type: 'video' | 'reflection' | 'quiz' | 'interactive' | 'reading' | 'certificate';
  completed: boolean;
  
  // Video-specific properties
  videoStartTime?: number;
  videoEndTime?: number;
  
  // Activity-specific properties
  hasResponse?: boolean;
  requiresCompletion?: boolean;
  
  // Optional metadata
  description?: string;
  estimatedDuration?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  title?: string;
  description?: string;
}

export interface DevModeActions {
  onReflectionComplete?: (response: string) => void;
  onQuizComplete?: (answers: Record<string, any>) => void;
  onInteractiveComplete?: () => void;
  onVideoSegmentComplete?: () => void;
  onCertificateGenerate?: () => void;
  onReadingComplete?: () => void;
}

export interface DevModeConfig {
  enableAutoCompletion: boolean;
  enableKeyboardShortcuts: boolean;
  enableVideoSkipping: boolean;
  enableActivityJumping: boolean;
  autoAdvanceDelay: number; // milliseconds
}

export interface DevModeState {
  isDevMode: boolean;
  showDevPanel: boolean;
  showKeyPrompt: boolean;
  currentTask: string;
  completedTasks: string[];
}

export interface DevModeEventDetail {
  activityId: string;
  activityType: UniversalActivity['type'];
  timestamp: number;
  data?: any;
}

// Custom Events for Universal Developer Mode
export interface DevModeEvents {
  'dev-auto-fill-reflection': CustomEvent<{ response: string; activityId: string }>;
  'dev-auto-answer-quiz': CustomEvent<{ answers: Record<string, any>; activityId: string }>;
  'dev-auto-complete-interactive': CustomEvent<{ activityId: string }>;
  'dev-auto-generate-certificate': CustomEvent<{ activityId: string }>;
  'dev-auto-complete-reading': CustomEvent<{ activityId: string }>;
  'dev-video-skip': CustomEvent<{ targetTime: number; activityId: string }>;
  'dev-activity-jump': CustomEvent<{ targetActivityIndex: number }>;
  'dev-next-task': CustomEvent<{ currentActivityIndex: number }>;
}

// Utility type for event handling
export type DevModeEventHandler<T extends keyof DevModeEvents> = (
  event: DevModeEvents[T]
) => void;

export interface ContextualResponses {
  reflections: Record<string, string>;
  quizAnswers: Record<string, Record<string, any>>;
  interactiveCompletions: Record<string, any>;
}