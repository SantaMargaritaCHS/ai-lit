import React, { ReactNode, useEffect } from 'react';
import { useUniversalDevMode } from '../hooks/useUniversalDevMode';
import { UniversalDevPanel } from './UniversalDevPanel';
import { SecretKeyPrompt } from './SecretKeyPrompt';
import { DevModeProvider } from '../context/DevModeContext';

interface UniversalDevModeProviderProps {
  children: ReactNode;
}

export function UniversalDevModeProvider({ children }: UniversalDevModeProviderProps) {
  console.log('🔧🔧🔧 UniversalDevModeProvider: Rendering!');

  const {
    isDevModeActive,
    showSecretKeyPrompt,
    showDevPanel,
    isPanelCollapsed,
    setShowSecretKeyPrompt,
    setIsPanelCollapsed,
    handleSecretKeySubmit,
    deactivateDevMode,
    autoCompleteCurrentActivity,
    skipToEnd,
    resetProgress,
    goToActivity,
    activities,
    currentActivityIndex,
    progress,
    currentActivity
  } = useUniversalDevMode();

  // Log provider state for debugging
  useEffect(() => {
    console.log('🔧🔧🔧 UniversalDevModeProvider State:', {
      isDevModeActive,
      showSecretKeyPrompt,
      showDevPanel,
      activities: activities.length,
      currentActivityIndex
    });
  }, [isDevModeActive, showSecretKeyPrompt, showDevPanel, activities.length, currentActivityIndex]);

  // Create dev mode context value
  const devModeContext = {
    isDevModeActive,
    currentActivityIndex,
    activities,
    goToActivity,
    goToNextActivity: () => goToActivity(Math.min(activities.length - 1, currentActivityIndex + 1)),
    goToPreviousActivity: () => goToActivity(Math.max(0, currentActivityIndex - 1)),
    autoCompleteCurrentActivity,
    skipToEnd,
    resetProgress,
  };

  return (
    <DevModeProvider value={devModeContext}>
      {children}

      {/* Debug indicator - temporary for testing */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '5px 10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: '10px',
          zIndex: 99999,
          borderRadius: '3px',
          fontFamily: 'monospace'
        }}
      >
        Dev Mode Ready (Ctrl+Alt+D)
      </div>

      {/* Secret Key Prompt */}
      {showSecretKeyPrompt && (
        <SecretKeyPrompt
          isOpen={showSecretKeyPrompt}
          onCancel={() => setShowSecretKeyPrompt(false)}
          onSubmit={(key) => {
            const success = handleSecretKeySubmit(key);
            if (success) {
              setShowSecretKeyPrompt(false);
            }
          }}
        />
      )}
      
      {/* Developer Panel - Only show if activities are registered */}
      {isDevModeActive && activities.length > 0 && (
        <UniversalDevPanel
          isVisible={showDevPanel}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
          onClose={() => deactivateDevMode()}
          activities={activities}
          currentActivityIndex={currentActivityIndex}
          progress={progress}
          onGoToActivity={goToActivity}
          onAutoComplete={autoCompleteCurrentActivity}
          onSkipToEnd={skipToEnd}
          onReset={resetProgress}
          onDeactivate={deactivateDevMode}
        />
      )}
    </DevModeProvider>
  );
}