import { useState, useEffect } from 'react';

export function useDeveloperMode() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  
  useEffect(() => {
    // Developer mode should NEVER auto-activate from session storage
    // Users must explicitly press Ctrl+Shift+D and enter secret key every time
    
    // Secret keyboard shortcut: Ctrl+Alt+D (or Cmd+Alt+D on Mac)
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        if (!isDevMode) {
          // Show secret key prompt if not already in dev mode
          setShowKeyPrompt(true);
        } else {
          // Toggle dev panel if already in dev mode
          setShowDevPanel(prev => !prev);
        }
      }
      
      // Quick skip shortcut when in dev mode: Right arrow key
      if (isDevMode && e.key === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('dev-skip-forward'));
      }
      
      // Quick back shortcut: Left arrow key
      if (isDevMode && e.key === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('dev-skip-backward'));
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDevMode]);

  const validateSecretKey = (inputKey: string): boolean => {
    // Get the secret key from environment variables
    const correctKey = import.meta.env.VITE_DEV_MODE_SECRET_KEY || '752465Ledezma';
    return inputKey === correctKey;
  };

  const handleSecretKeySubmit = (key: string) => {
    console.log('🔧 Secret key submitted:', key.length, 'characters');
    if (validateSecretKey(key)) {
      setIsDevMode(true);
      setShowDevPanel(true);
      setShowKeyPrompt(false);
      // DO NOT store in session storage - user must re-authenticate each session for security
      console.log('🔧 Developer mode unlocked with secret key');
      console.log('🔧 Dev panel should now be visible:', true);
    } else {
      console.warn('🚫 Invalid developer mode secret key');
      console.log('🔧 Expected key length:', (import.meta.env.VITE_DEV_MODE_SECRET_KEY || 'dev2025!').length);
      // Don't close modal for invalid key - let SecretKeyPrompt handle the error state
    }
  };

  const disableDevMode = () => {
    setIsDevMode(false);
    setShowDevPanel(false);
    console.log('🔧 Developer mode disabled');
  };
  
  return {
    isDevMode,
    showDevPanel,
    setShowDevPanel,
    showKeyPrompt,
    setShowKeyPrompt,
    handleSecretKeySubmit,
    disableDevMode
  };
}