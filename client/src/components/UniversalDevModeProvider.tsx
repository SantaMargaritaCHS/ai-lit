import React, { ReactNode } from 'react';
import { useUniversalDevMode } from '../hooks/useUniversalDevMode';
import { UniversalDevPanel } from './UniversalDevPanel';
import { SecretKeyPrompt } from './SecretKeyPrompt';
import { DevModeProvider } from '../context/DevModeContext';

interface UniversalDevModeProviderProps {
  children: ReactNode;
}

export function UniversalDevModeProvider({ children }: UniversalDevModeProviderProps) {
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

      {/* Secret Key Prompt */}
      {showSecretKeyPrompt && (
        <SecretKeyPrompt
          isOpen={showSecretKeyPrompt}
          onCancel={() => setShowSecretKeyPrompt(false)}
          onSubmit={async (key) => {
            await handleSecretKeySubmit(key);
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