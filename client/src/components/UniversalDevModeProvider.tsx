import React, { ReactNode } from 'react';
import { useUniversalDevMode } from '../hooks/useUniversalDevMode';
import { UniversalDevPanel } from './UniversalDevPanel';
import { SecretKeyPrompt } from './SecretKeyPrompt';

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

  return (
    <>
      {children}
      
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
      
      {/* Developer Panel */}
      {isDevModeActive && (
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
    </>
  );
}