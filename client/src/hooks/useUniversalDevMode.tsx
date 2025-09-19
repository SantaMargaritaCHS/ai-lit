import { useState, useEffect, useCallback } from 'react';
import { useActivityRegistry } from '../context/ActivityRegistryContext';

const SECRET_KEY = 'dev2025!';
const DEV_MODE_STORAGE_KEY = 'universal-dev-mode-active';

export function useUniversalDevMode() {
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [showSecretKeyPrompt, setShowSecretKeyPrompt] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  
  const {
    activities,
    currentActivityIndex,
    goToNextActivity,
    goToPreviousActivity,
    goToActivity,
    markActivityCompleted,
    getProgress,
    isFirstActivity,
    isLastActivity,
    clearRegistry
  } = useActivityRegistry();

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DEV_MODE_STORAGE_KEY);
    if (stored === 'true') {
      setIsDevModeActive(true);
      setShowDevPanel(true);
    }
  }, []);

  // Update localStorage when dev mode changes
  useEffect(() => {
    localStorage.setItem(DEV_MODE_STORAGE_KEY, isDevModeActive.toString());
  }, [isDevModeActive]);

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
    console.log('🔧 Universal Dev Mode: Secret key submitted:', key);
    console.log('🔧 Universal Dev Mode: Expected key:', SECRET_KEY);
    if (key === SECRET_KEY) {
      console.log('🔧 Universal Dev Mode: Key correct! Activating...');
      setIsDevModeActive(true);
      setShowDevPanel(true);
      setShowSecretKeyPrompt(false);
      setIsPanelCollapsed(true); // Start collapsed
      return true;
    } else {
      console.warn('🔧 Dev Mode: Invalid key');
      return false;
    }
  }, []);

  // Deactivate dev mode
  const deactivateDevMode = useCallback(() => {
    console.log('🔧 Dev Mode: Deactivated');
    setIsDevModeActive(false);
    setShowDevPanel(false);
    localStorage.removeItem(DEV_MODE_STORAGE_KEY);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('🔧 Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Alt:', e.altKey, 'Meta:', e.metaKey);
      
      // Activate dev mode: Ctrl+Alt+D or Cmd+Alt+D
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'd') {
        console.log('🔧 Universal Dev Mode: Shortcut detected!');
        e.preventDefault();
        if (!isDevModeActive) {
          console.log('🔧 Universal Dev Mode: Showing secret key prompt');
          setShowSecretKeyPrompt(true);
        } else {
          // Toggle panel visibility
          setShowDevPanel(prev => !prev);
        }
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isDevModeActive,
    goToNextActivity,
    goToPreviousActivity,
    autoCompleteCurrentActivity,
    skipToEnd,
    resetProgress,
    showDevPanel
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