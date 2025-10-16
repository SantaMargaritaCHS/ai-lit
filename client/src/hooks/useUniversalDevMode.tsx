import { useState, useEffect, useCallback, useRef } from 'react';
import { useActivityRegistry } from '../context/ActivityRegistryContext';

// Get secret key from environment variable or use fallback
// Support multiple valid passwords for dev mode access
const VALID_PASSWORDS = [
  import.meta.env.VITE_DEV_MODE_SECRET_KEY || '752465Ledezma',
  'X9mK#7pL2wQ8nR5t' // Additional generated password
];

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
  console.log('🔧🔧🔧 useUniversalDevMode hook called!', { options });

  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [showSecretKeyPrompt, setShowSecretKeyPrompt] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

  // Log initialization
  useEffect(() => {
    console.log('🔧🔧🔧 Universal Dev Mode Hook Initialized!');
    console.log('🔧 Valid Passwords:', VALID_PASSWORDS.length, 'configured');
    console.log('🔧 Press Ctrl+Alt+D (or Cmd+Alt+D on Mac) to activate');

    // Test if event listeners work at all
    const testHandler = (e: KeyboardEvent) => {
      console.log('🔧🔧🔧 TEST: Any key pressed:', e.key);
    };
    window.addEventListener('keydown', testHandler);

    return () => {
      window.removeEventListener('keydown', testHandler);
    };
  }, []);

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

    console.log(`🔧 Dev Mode: Auto-completing ${currentActivity.type} - ${currentActivity.name}`);
    
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
    console.log('🔧 Dev Mode: Skipping to end');
    
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
    console.log('🔧 Dev Mode: Resetting progress');
    clearRegistry();
    window.dispatchEvent(new CustomEvent('dev-reset-module'));
  }, [clearRegistry]);

  // Handle secret key submission
  const handleSecretKeySubmit = useCallback((key: string) => {
    console.log('🔧 Universal Dev Mode: Checking key...');
    console.log('🔧 Universal Dev Mode: Match:', VALID_PASSWORDS.includes(key));

    if (VALID_PASSWORDS.includes(key)) {
      console.log('🔧 Universal Dev Mode: ✅ Key correct! Activating dev mode...');
      setIsDevModeActive(true);
      setShowDevPanel(true);
      setShowSecretKeyPrompt(false);
      setIsPanelCollapsed(true); // Start collapsed
      return true;
    } else {
      console.error('🔧 Universal Dev Mode: ❌ Invalid key provided');
      return false;
    }
  }, []);

  // Deactivate dev mode
  const deactivateDevMode = useCallback(() => {
    console.log('🔧 Dev Mode: Deactivated');
    setIsDevModeActive(false);
    setShowDevPanel(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    console.log('🔧🔧🔧 Universal Dev Mode: Setting up keyboard listener!', {
      isDevModeActive,
      showDevPanel,
      showSecretKeyPrompt
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Log ALL key presses to debug
      console.log('🔧🔧🔧 Key pressed:', {
        key: e.key,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        shift: e.shiftKey,
        target: e.target,
        currentTarget: e.currentTarget
      });

      // Only log when Ctrl or Cmd is pressed with other keys
      if ((e.ctrlKey || e.metaKey) && e.altKey) {
        console.log('🔧 Universal Dev Mode: Key combo detected:', {
          key: e.key,
          ctrl: e.ctrlKey,
          alt: e.altKey,
          meta: e.metaKey,
          isActive: isDevModeActive
        });
      }

      // Activate dev mode: Ctrl+Alt+D or Cmd+Alt+D
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'd') {
        console.log('🔧 Universal Dev Mode: Activation shortcut triggered!');
        e.preventDefault();
        e.stopPropagation(); // Stop event from bubbling

        if (!isDevModeActive) {
          console.log('🔧 Universal Dev Mode: Opening secret key prompt...');
          setShowSecretKeyPrompt(true);
        } else {
          console.log('🔧 Universal Dev Mode: Toggling panel visibility');
          setShowDevPanel(prev => !prev);
        }
        return false; // Prevent any other handlers
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
    console.log('🔧🔧🔧 Keyboard listener attached!');
    return () => {
      console.log('🔧🔧🔧 Keyboard listener removed!');
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