import { useState, useEffect, useCallback } from 'react';
import { UniversalActivity, DevModeActions, DevModeConfig } from '@/types/developerMode';

interface UniversalDeveloperModeOptions extends DevModeActions {
  activities: UniversalActivity[];
  currentActivity: number;
  onJumpToActivity: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  videoRef?: React.RefObject<HTMLVideoElement | { skipToSegmentEnd: (offset?: number) => void; getCurrentSegment: () => { startTime: number; endTime: number } | null }>;
  getCurrentVideoSegment?: () => { startTime: number; endTime: number } | null | undefined;
  config?: Partial<DevModeConfig>;
}

export function useUniversalDeveloperMode({
  activities,
  currentActivity,
  onJumpToActivity,
  onCompleteAll,
  onReset,
  videoRef,
  getCurrentVideoSegment,
  onReflectionComplete,
  onQuizComplete,
  onInteractiveComplete,
  onVideoSegmentComplete,
  onCertificateGenerate,
  onReadingComplete,
  config
}: UniversalDeveloperModeOptions) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  
  // Default configuration
  const devConfig: DevModeConfig = {
    enableAutoCompletion: true,
    enableKeyboardShortcuts: true,
    enableVideoSkipping: true,
    enableActivityJumping: true,
    autoAdvanceDelay: 500,
    ...config
  };

  // Enhanced contextual response generator
  const getContextualReflectionResponse = useCallback((activity: UniversalActivity): string => {
    const responses: Record<string, string> = {
      'default': 'This activity enhanced my understanding of the core concepts. The interactive elements were engaging and the examples were relevant to real-world applications.',
      'ai-intro': 'Learning about AI fundamentals has given me a clearer picture of how this technology impacts our daily lives. I appreciate understanding both the capabilities and limitations.',
      'ethics': 'The ethical considerations around AI are crucial for responsible development. Issues like bias, privacy, and transparency must be addressed to ensure AI benefits everyone equitably.',
      'prompting': 'Understanding how to communicate effectively with AI systems is a valuable skill. The techniques for crafting clear, specific prompts will be useful in various contexts.',
      'limitations': 'Recognizing AI limitations helps set realistic expectations. Understanding when and how AI might fail is as important as knowing what it can do well.',
    };

    // Match response based on activity content
    const title = activity.title.toLowerCase();
    const id = activity.id.toLowerCase();
    
    if (title.includes('ethic') || id.includes('ethic')) {
      return responses['ethics'];
    } else if (title.includes('prompt') || id.includes('prompt')) {
      return responses['prompting'];
    } else if (title.includes('limitation') || id.includes('limitation')) {
      return responses['limitations'];
    } else if (title.includes('ai') || id.includes('ai')) {
      return responses['ai-intro'];
    }
    
    return responses['default'];
  }, []);

  const getQuizAnswers = useCallback((activity: UniversalActivity): Record<string, any> => {
    // Return intelligent quiz answers based on activity context
    // This should be customized per module or made configurable
    return {
      question1: 'correct-answer-a',
      question2: 'correct-answer-b', 
      question3: 'correct-answer-c'
    };
  }, []);

  // Enhanced universal next task handler
  const handleNextTask = useCallback(() => {
    const activity = activities[currentActivity];
    if (!activity) return;

    console.log('🔧 Universal Developer Mode: Next Task -', activity.type, activity.title);

    if (!devConfig.enableAutoCompletion) {
      console.log('🔧 Auto-completion disabled, skipping to next activity');
      if (currentActivity < activities.length - 1) {
        onJumpToActivity(currentActivity + 1);
      }
      return;
    }

    switch (activity.type) {
      case 'video':
        if (devConfig.enableVideoSkipping && videoRef?.current) {
          // Check if it's a SegmentedVideoPlayer with smart skipping
          if ('skipToSegmentEnd' in videoRef.current) {
            videoRef.current.skipToSegmentEnd(5);
          } else if ('currentTime' in videoRef.current) {
            // Fallback for regular HTML video element
            const currentSegment = getCurrentVideoSegment?.();
            if (currentSegment) {
              const targetTime = Math.max(currentSegment.endTime - 5, currentSegment.startTime);
              videoRef.current.currentTime = targetTime;
              console.log(`🎬 Skipped to segment end -5s: ${targetTime}s (segment: ${currentSegment.startTime}-${currentSegment.endTime}s)`);
            } else if (activity.videoEndTime !== undefined) {
              const targetTime = Math.max(activity.videoEndTime - 5, activity.videoStartTime || 0);
              videoRef.current.currentTime = targetTime;
              console.log(`🎬 Skipped to activity end -5s: ${targetTime}s`);
            } else {
              // Fallback: skip to 5s before video end
              const duration = videoRef.current.duration;
              if (duration && duration > 5) {
                videoRef.current.currentTime = duration - 5;
                console.log(`🎬 Skipped to video end -5s: ${duration - 5}s`);
              }
            }
          }
        }
        
        // Trigger video completion handler
        setTimeout(() => {
          onVideoSegmentComplete?.();
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      case 'reflection':
        const reflectionResponse = getContextualReflectionResponse(activity);
        console.log('🔧 Auto-filling reflection:', reflectionResponse.substring(0, 50) + '...');
        
        // Call handler if provided, otherwise dispatch event
        if (onReflectionComplete) {
          onReflectionComplete(reflectionResponse);
        } else {
          window.dispatchEvent(new CustomEvent('dev-auto-fill-reflection', {
            detail: { response: reflectionResponse, activityId: activity.id }
          }));
        }
        
        setTimeout(() => {
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      case 'quiz':
        const quizAnswers = getQuizAnswers(activity);
        console.log('🔧 Auto-answering quiz:', Object.keys(quizAnswers));
        
        // Call handler if provided, otherwise dispatch event
        if (onQuizComplete) {
          onQuizComplete(quizAnswers);
        } else {
          window.dispatchEvent(new CustomEvent('dev-auto-answer-quiz', {
            detail: { answers: quizAnswers, activityId: activity.id }
          }));
        }
        
        setTimeout(() => {
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      case 'interactive':
        console.log('🔧 Auto-completing interactive activity');
        
        // Call handler if provided, otherwise dispatch event
        if (onInteractiveComplete) {
          onInteractiveComplete();
        } else {
          window.dispatchEvent(new CustomEvent('dev-auto-complete-interactive', {
            detail: { activityId: activity.id }
          }));
        }
        
        setTimeout(() => {
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      case 'certificate':
        console.log('🔧 Auto-generating certificate');
        
        // Call handler if provided, otherwise dispatch event
        if (onCertificateGenerate) {
          onCertificateGenerate();
        } else {
          window.dispatchEvent(new CustomEvent('dev-auto-generate-certificate', {
            detail: { activityId: activity.id }
          }));
        }
        
        setTimeout(() => {
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      case 'reading':
        console.log('🔧 Auto-completing reading activity');
        
        // Call handler if provided, otherwise dispatch event
        if (onReadingComplete) {
          onReadingComplete();
        } else {
          window.dispatchEvent(new CustomEvent('dev-auto-complete-reading', {
            detail: { activityId: activity.id }
          }));
        }
        
        setTimeout(() => {
          if (currentActivity < activities.length - 1) {
            onJumpToActivity(currentActivity + 1);
          }
        }, devConfig.autoAdvanceDelay);
        break;

      default:
        // For unknown activity types, just advance
        console.log('🔧 Unknown activity type, advancing to next');
        if (currentActivity < activities.length - 1) {
          onJumpToActivity(currentActivity + 1);
        }
    }

  }, [
    activities, 
    currentActivity, 
    onJumpToActivity, 
    videoRef, 
    getCurrentVideoSegment,
    onReflectionComplete,
    onQuizComplete, 
    onInteractiveComplete,
    onVideoSegmentComplete,
    onCertificateGenerate,
    onReadingComplete,
    devConfig,
    getContextualReflectionResponse,
    getQuizAnswers
  ]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle developer mode with Ctrl+Alt+D
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        if (!isDevMode) {
          setShowKeyPrompt(true);
        } else {
          setShowDevPanel(prev => !prev);
        }
      }

      // Universal shortcuts (only when dev mode is active)
      if (!isDevMode) return;

      // Next task with Shift+Right Arrow
      if (e.shiftKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTask();
      }

      // Previous activity with Shift+Left Arrow
      if (e.shiftKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentActivity > 0) {
          onJumpToActivity(currentActivity - 1);
          console.log(`🔧 Developer mode: Moved back to activity ${currentActivity}`);
        }
      }

      // Complete all with Ctrl+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onCompleteAll();
        console.log('🔧 Developer mode: Completed all activities');
      }

      // Reset module with Ctrl+Shift+R
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        onReset();
        console.log('🔧 Developer mode: Reset module');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDevMode, currentActivity, handleNextTask, onJumpToActivity, onCompleteAll, onReset]);

  // Listen for external next task events
  useEffect(() => {
    const handleExternalNextTask = () => {
      if (isDevMode) {
        handleNextTask();
      }
    };

    window.addEventListener('dev-skip-forward', handleExternalNextTask);
    return () => window.removeEventListener('dev-skip-forward', handleExternalNextTask);
  }, [isDevMode, handleNextTask]);

  const validateSecretKey = (inputKey: string): boolean => {
    const correctKey = import.meta.env.VITE_DEV_MODE_SECRET_KEY || 'dev2025!';
    return inputKey === correctKey;
  };

  const handleSecretKeySubmit = (key: string) => {
    console.log('🔧 Universal Developer Mode: Secret key submitted');
    if (validateSecretKey(key)) {
      setIsDevMode(true);
      setShowDevPanel(true);
      setShowKeyPrompt(false);
      console.log('🔧 Universal Developer Mode: Activated successfully');
    } else {
      console.warn('🚫 Universal Developer Mode: Invalid secret key');
    }
  };

  const disableDevMode = () => {
    setIsDevMode(false);
    setShowDevPanel(false);
    console.log('🔧 Universal Developer Mode: Disabled');
  };

  return {
    isDevMode,
    showDevPanel,
    setShowDevPanel,
    showKeyPrompt,
    setShowKeyPrompt,
    handleSecretKeySubmit,
    handleNextTask,
    disableDevMode,
    
    // Enhanced developer utilities from the alternative implementation
    devJumpToActivity: (index: number) => {
      onJumpToActivity(index);
      // Mark previous activities as complete for realistic progression
      activities.forEach((act, i) => {
        if (i < index) act.completed = true;
      });
      console.log(`🔧 Developer mode: Jumped to activity ${index + 1} with ${index} activities marked complete`);
    },
    
    devCompleteAll: () => {
      activities.forEach(act => act.completed = true);
      onJumpToActivity(activities.length - 1);
      console.log('🔧 Developer mode: All activities marked complete');
    },
    
    devReset: () => {
      activities.forEach(act => {
        act.completed = false;
        act.hasResponse = false;
      });
      onJumpToActivity(0);
      console.log('🔧 Developer mode: Module reset to initial state');
    },
    
    // Configuration access
    devConfig
  };
}