import { useState, useEffect, useCallback, useRef } from 'react';
import { useActivityRegistry } from '../context/ActivityRegistryContext';

// SHA-256 hashes of valid passwords (passwords are NOT stored in code)
// This prevents password discovery via browser DevTools source inspection
const VALID_PASSWORD_HASHES = [
  'f94ff05152e60c951e27da08b9fd90ceca7aa73346e3b9d131dc6acc7fab71ee',
  '3fe554455849632567fe7d6ff6dddaa532c024956d4abaad0e5298a916587a17'
];

// Hash a string using SHA-256 (Web Crypto API)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Types for module activities
export interface ModuleActivity {
  id: string;
  type: 'video' | 'reflection' | 'quiz' | 'interactive' | 'certificate';
  title: string;
  completed?: boolean;
}

interface UseUniversalDevModeOptions {
  activities?: ModuleActivity[];
  currentActivityIndex?: number;
  onActivityChange?: (index: number) => void;
  onCompleteAll?: () => void;
  onReset?: () => void;
}

export function useUniversalDevMode(options: UseUniversalDevModeOptions = {}) {
  const [isDevModeActive, setIsDevModeActive] = useState(() => {
    return sessionStorage.getItem('universal-dev-mode-active') === 'true';
  });
  const [showSecretKeyPrompt, setShowSecretKeyPrompt] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

  // Use activity registry for centralized state, but allow module overrides
  const registry = useActivityRegistry();
  const {
    activities: registryActivities,
    currentActivityIndex: registryCurrentIndex,
    goToNextActivity,
    goToPreviousActivity,
    goToActivity: registryGoToActivity,
    markActivityCompleted,
    getProgress,
    isFirstActivity,
    isLastActivity,
    clearRegistry
  } = registry;

  // Use module-provided activities if available, otherwise use registry
  const activities = options.activities || registryActivities;
  const currentActivityIndex = options.currentActivityIndex ?? registryCurrentIndex;
  const goToActivity = options.onActivityChange || registryGoToActivity;

  // Dev mode should NOT persist - require manual activation each session for security

  // Enhanced auto-complete with contextual responses
  const getContextualReflectionResponse = useCallback((activity: any): string => {
    const responses: Record<string, string> = {
      'default': 'This activity enhanced my understanding of the core concepts.',
      'ai-intro': 'Learning about AI fundamentals has given me a clearer picture.',
      'ethics': 'The ethical considerations around AI are crucial.',
      'prompting': 'Understanding how to communicate effectively with AI is valuable.',
      'limitations': 'Recognizing AI limitations helps set realistic expectations.'
    };

    const title = activity.name?.toLowerCase() || '';
    const id = activity.id?.toLowerCase() || '';

    if (title.includes('ethic') || id.includes('ethic')) return responses['ethics'];
    if (title.includes('prompt') || id.includes('prompt')) return responses['prompting'];
    if (title.includes('limitation') || id.includes('limitation')) return responses['limitations'];
    if (title.includes('ai') || id.includes('ai')) return responses['ai-intro'];

    return responses['default'];
  }, []);

  // Auto-complete current activity
  const autoCompleteCurrentActivity = useCallback(() => {
    const currentActivity = activities[currentActivityIndex];
    if (!currentActivity) return;
    
    // Mark current activity as completed
    markActivityCompleted(currentActivity.id);
    
    // Dispatch events for different activity types
    switch (currentActivity.type) {
      case 'video':
      case 'video-segment':
        window.dispatchEvent(new CustomEvent('dev-skip-video', { 
          detail: { activityId: currentActivity.id } 
        }));
        break;
      
      case 'reflection':
        window.dispatchEvent(new CustomEvent('dev-auto-reflection', { 
          detail: { 
            activityId: currentActivity.id,
            response: 'This activity provided valuable insights into AI concepts and their real-world applications.'
          } 
        }));
        break;
      
      case 'quiz':
        window.dispatchEvent(new CustomEvent('dev-auto-quiz', { 
          detail: { 
            activityId: currentActivity.id,
            answers: {} // Module will provide correct answers
          } 
        }));
        break;
      
      case 'application':
      case 'interactive':
        window.dispatchEvent(new CustomEvent('dev-auto-interactive', { 
          detail: { activityId: currentActivity.id } 
        }));
        break;
      
      case 'pause-activity':
        window.dispatchEvent(new CustomEvent('dev-skip-pause', { 
          detail: { activityId: currentActivity.id } 
        }));
        break;
      
      default:
        window.dispatchEvent(new CustomEvent('dev-auto-complete', { 
          detail: { activityId: currentActivity.id } 
        }));
    }

    // Move to next activity after a short delay
    setTimeout(() => {
      if (!isLastActivity()) {
        goToNextActivity();
      }
    }, 500);
  }, [activities, currentActivityIndex, markActivityCompleted, goToNextActivity, isLastActivity]);

  // Skip to end (complete all and jump to certificate)
  const skipToEnd = useCallback(() => {
    // Mark all activities as completed
    activities.forEach(activity => {
      markActivityCompleted(activity.id);
    });
    
    // Jump to last activity (usually certificate)
    if (activities.length > 0) {
      goToActivity(activities.length - 1);
    }
    
    // Dispatch event for module to handle
    window.dispatchEvent(new CustomEvent('dev-skip-to-end'));
  }, [activities, markActivityCompleted, goToActivity]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    clearRegistry();
    window.dispatchEvent(new CustomEvent('dev-reset-module'));
  }, [clearRegistry]);

  // Handle secret key submission (async for secure hash comparison)
  const handleSecretKeySubmit = useCallback(async (key: string): Promise<boolean> => {
    try {
      const inputHash = await sha256(key);
      const isValid = VALID_PASSWORD_HASHES.includes(inputHash);

      if (isValid) {
        setIsDevModeActive(true);
        sessionStorage.setItem('universal-dev-mode-active', 'true');
        setShowDevPanel(true);
        setShowSecretKeyPrompt(false);
        setIsPanelCollapsed(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Dev mode validation error');
      return false;
    }
  }, []);

  // Deactivate dev mode
  const deactivateDevMode = useCallback(() => {
    setIsDevModeActive(false);
    sessionStorage.removeItem('universal-dev-mode-active');
    setShowDevPanel(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Activate dev mode: Ctrl+Alt+D or Cmd+Alt+D
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        e.stopPropagation();

        if (!isDevModeActive) {
          setShowSecretKeyPrompt(true);
        } else {
          setShowDevPanel(prev => !prev);
        }
        return false;
      }

      // Only process other shortcuts if dev mode is active
      if (!isDevModeActive) return;

      // Navigation with arrow keys (without modifiers for granular control)
      if (e.key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        goToPreviousActivity();
      } else if (e.key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        goToNextActivity();
      }

      // Auto-complete current: Shift+Enter
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        autoCompleteCurrentActivity();
      }

      // Skip to end: Ctrl+Shift+E or Cmd+Shift+E
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        skipToEnd();
      }

      // Reset: Ctrl+Shift+R or Cmd+Shift+R
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetProgress();
      }

      // Toggle panel collapse: Escape
      if (e.key === 'Escape' && showDevPanel) {
        e.preventDefault();
        setIsPanelCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isDevModeActive,
    goToNextActivity,
    goToPreviousActivity,
    autoCompleteCurrentActivity,
    skipToEnd,
    resetProgress,
    showDevPanel,
    setShowSecretKeyPrompt,
    setShowDevPanel,
    setIsPanelCollapsed
  ]);

  return {
    // State
    isDevModeActive,
    showSecretKeyPrompt,
    showDevPanel,
    isPanelCollapsed,
    
    // Actions
    setShowSecretKeyPrompt,
    setShowDevPanel,
    setIsPanelCollapsed,
    handleSecretKeySubmit,
    deactivateDevMode,
    autoCompleteCurrentActivity,
    skipToEnd,
    resetProgress,
    goToActivity,
    
    // Activity data
    activities,
    currentActivityIndex,
    progress: getProgress(),
    isFirstActivity: isFirstActivity(),
    isLastActivity: isLastActivity(),
    currentActivity: activities[currentActivityIndex] || null
  };
}