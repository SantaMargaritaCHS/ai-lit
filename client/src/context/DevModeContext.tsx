import React, { createContext, useContext } from 'react';

interface DevModeContextType {
  isDevModeActive: boolean;
  currentActivityIndex: number;
  activities: any[];
  // Navigation functions
  goToActivity: (index: number) => void;
  goToNextActivity: () => void;
  goToPreviousActivity: () => void;
  // Dev mode specific functions
  autoCompleteCurrentActivity: () => void;
  skipToEnd: () => void;
  resetProgress: () => void;
  // Module registration
  registerModuleActivities?: (activities: any[]) => void;
  setCurrentModuleActivity?: (index: number) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider = DevModeContext.Provider;

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    // Return a mock context when not provided (dev mode disabled)
    return {
      isDevModeActive: false,
      currentActivityIndex: 0,
      activities: [],
      goToActivity: () => {},
      goToNextActivity: () => {},
      goToPreviousActivity: () => {},
      autoCompleteCurrentActivity: () => {},
      skipToEnd: () => {},
      resetProgress: () => {},
    };
  }
  return context;
}