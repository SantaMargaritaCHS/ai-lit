/**
 * Universal Developer Mode Utilities
 * 
 * This module provides utility functions for implementing universal developer mode
 * across all educational modules in the platform.
 */

// Import types from centralized location
export type { UniversalActivity, VideoSegment, DevModeActions, DevModeConfig } from '@/types/developerMode';

import { UniversalActivity, VideoSegment } from '@/types/developerMode';

/**
 * Auto-completion handlers for different activity types
 */
export class UniversalDevModeHandlers {
  /**
   * Handles video segment skipping - jumps to 5 seconds before segment end
   */
  static handleVideoSkip(
    videoRef: React.RefObject<HTMLVideoElement>,
    currentSegment?: VideoSegment
  ): boolean {
    if (!videoRef.current) return false;

    try {
      if (currentSegment) {
        // Skip to 5 seconds before end of current segment
        const targetTime = Math.max(currentSegment.endTime - 5, currentSegment.startTime);
        videoRef.current.currentTime = targetTime;
        console.log(`🔧 Developer mode: Skipped to segment end -5s: ${targetTime}s`);
        return true;
      } else {
        // Fallback: skip to 5s before video end
        const duration = videoRef.current.duration;
        if (duration && duration > 5) {
          videoRef.current.currentTime = duration - 5;
          console.log(`🔧 Developer mode: Skipped to video end -5s: ${duration - 5}s`);
          return true;
        }
      }
    } catch (error) {
      console.error('🚫 Developer mode video skip failed:', error);
    }
    return false;
  }

  /**
   * Auto-fills reflection activities with educational sample response
   */
  static handleReflectionAutoFill(customResponse?: string): void {
    const defaultResponse = customResponse || 
      "This is an auto-generated developer mode response for testing purposes. " +
      "In a real learning scenario, students would provide their own thoughtful " +
      "reflection based on the educational content they just experienced.";

    // Dispatch event that reflection components should listen for
    window.dispatchEvent(new CustomEvent('dev-auto-fill-reflection', {
      detail: { response: defaultResponse }
    }));
    console.log('🔧 Developer mode: Auto-filled reflection response');
  }

  /**
   * Auto-answers quiz questions with correct answers
   */
  static handleQuizAutoAnswer(): void {
    // Dispatch event that quiz components should listen for
    window.dispatchEvent(new CustomEvent('dev-auto-answer-quiz'));
    console.log('🔧 Developer mode: Auto-answered quiz question');
  }

  /**
   * Auto-completes interactive activities
   */
  static handleInteractiveAutoComplete(): void {
    // Dispatch event that interactive components should listen for
    window.dispatchEvent(new CustomEvent('dev-auto-complete-interactive'));
    console.log('🔧 Developer mode: Auto-completed interactive activity');
  }

  /**
   * Auto-generates certificates
   */
  static handleCertificateAutoGenerate(): void {
    // Dispatch event that certificate components should listen for
    window.dispatchEvent(new CustomEvent('dev-auto-generate-certificate'));
    console.log('🔧 Developer mode: Auto-generated certificate');
  }

  /**
   * Auto-completes reading activities
   */
  static handleReadingAutoComplete(): void {
    // Dispatch event that reading components should listen for
    window.dispatchEvent(new CustomEvent('dev-auto-complete-reading'));
    console.log('🔧 Developer mode: Auto-completed reading activity');
  }
}

/**
 * Activity type detection and management utilities
 */
export class ActivityTypeDetector {
  /**
   * Detects activity type based on component props or content
   */
  static detectActivityType(
    activityId: string,
    componentName?: string,
    hasVideo?: boolean,
    hasForm?: boolean,
    hasQuestions?: boolean
  ): UniversalActivity['type'] {
    // Video activities
    if (hasVideo || activityId.includes('video') || componentName?.toLowerCase().includes('video')) {
      return 'video';
    }

    // Quiz activities
    if (hasQuestions || activityId.includes('quiz') || componentName?.toLowerCase().includes('quiz')) {
      return 'quiz';
    }

    // Reflection activities
    if (hasForm || activityId.includes('reflection') || componentName?.toLowerCase().includes('reflection')) {
      return 'reflection';
    }

    // Certificate activities
    if (activityId.includes('certificate') || componentName?.toLowerCase().includes('certificate')) {
      return 'certificate';
    }

    // Interactive activities (default for complex activities)
    if (activityId.includes('interactive') || componentName?.toLowerCase().includes('interactive')) {
      return 'interactive';
    }

    // Reading activities
    if (activityId.includes('reading') || componentName?.toLowerCase().includes('reading')) {
      return 'reading';
    }

    // Default to interactive for unknown types
    return 'interactive';
  }

  /**
   * Creates a standard activity object from basic information
   */
  static createActivity(
    id: string,
    title: string,
    type?: UniversalActivity['type'],
    completed: boolean = false,
    additionalProps?: Partial<UniversalActivity>
  ): UniversalActivity {
    return {
      id,
      title,
      type: type || this.detectActivityType(id),
      completed,
      ...additionalProps
    };
  }
}

/**
 * Event listeners for universal developer mode integration
 */
export class DevModeEventListeners {
  /**
   * Sets up universal event listeners for a module
   */
  static setupUniversalListeners(
    onAutoFillReflection?: (response: string) => void,
    onAutoAnswerQuiz?: () => void,
    onAutoCompleteInteractive?: () => void,
    onAutoGenerateCertificate?: () => void,
    onAutoCompleteReading?: () => void
  ): () => void {
    const listeners: Array<{ event: string; handler: EventListener }> = [];

    // Reflection auto-fill listener
    if (onAutoFillReflection) {
      const reflectionHandler = (e: Event) => {
        const customEvent = e as CustomEvent;
        const response = customEvent.detail?.response || '';
        onAutoFillReflection(response);
      };
      window.addEventListener('dev-auto-fill-reflection', reflectionHandler);
      listeners.push({ event: 'dev-auto-fill-reflection', handler: reflectionHandler });
    }

    // Quiz auto-answer listener
    if (onAutoAnswerQuiz) {
      const quizHandler = () => onAutoAnswerQuiz();
      window.addEventListener('dev-auto-answer-quiz', quizHandler);
      listeners.push({ event: 'dev-auto-answer-quiz', handler: quizHandler });
    }

    // Interactive auto-complete listener
    if (onAutoCompleteInteractive) {
      const interactiveHandler = () => onAutoCompleteInteractive();
      window.addEventListener('dev-auto-complete-interactive', interactiveHandler);
      listeners.push({ event: 'dev-auto-complete-interactive', handler: interactiveHandler });
    }

    // Certificate auto-generate listener
    if (onAutoGenerateCertificate) {
      const certificateHandler = () => onAutoGenerateCertificate();
      window.addEventListener('dev-auto-generate-certificate', certificateHandler);
      listeners.push({ event: 'dev-auto-generate-certificate', handler: certificateHandler });
    }

    // Reading auto-complete listener
    if (onAutoCompleteReading) {
      const readingHandler = () => onAutoCompleteReading();
      window.addEventListener('dev-auto-complete-reading', readingHandler);
      listeners.push({ event: 'dev-auto-complete-reading', handler: readingHandler });
    }

    // Return cleanup function
    return () => {
      listeners.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
    };
  }
}

/**
 * Migration helper for converting legacy developer mode to universal system
 */
export class LegacyMigrationHelper {
  /**
   * Converts legacy activity format to universal format
   */
  static convertLegacyActivities(
    legacyActivities: Array<{ id: string; title: string; completed: boolean }>
  ): UniversalActivity[] {
    return legacyActivities.map(activity => 
      ActivityTypeDetector.createActivity(
        activity.id,
        activity.title,
        ActivityTypeDetector.detectActivityType(activity.id),
        activity.completed
      )
    );
  }

  /**
   * Maps legacy developer panel props to universal format
   */
  static mapLegacyProps(legacyProps: {
    currentActivity: number;
    totalActivities: number;
    activities: Array<{ id: string; title: string; completed: boolean }>;
    onJumpToActivity: (index: number) => void;
    onCompleteAll: () => void;
    onReset: () => void;
    videoRef?: React.RefObject<HTMLVideoElement>;
  }) {
    return {
      currentActivity: legacyProps.currentActivity,
      activities: this.convertLegacyActivities(legacyProps.activities),
      onJumpToActivity: legacyProps.onJumpToActivity,
      onCompleteAll: legacyProps.onCompleteAll,
      onReset: legacyProps.onReset,
      videoRef: legacyProps.videoRef,
      onNextTask: () => {
        // Default implementation - modules should override this
        console.log('🔧 Legacy migration: Default next task handler');
      }
    };
  }
}