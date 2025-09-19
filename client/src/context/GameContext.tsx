import { createContext, useContext, useReducer, useCallback } from 'react';

interface GameState {
  userProgress: any;
  moduleProgress: any[];
  achievements: any[];
  isLoading: boolean;
}

interface GameContextType extends GameState {
  refreshProgress: () => Promise<void>;
  updateProgress: (updates: Partial<any>) => Promise<void>;
  completeModule: (moduleId: string, xpGained: number) => Promise<void>;
  addXP: (xp: number) => Promise<void>;
  updateModuleProgress: (moduleId: string, progress: any) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

type GameAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: any }
  | { type: 'SET_MODULE_PROGRESS'; payload: any[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: any[] }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<any> };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROGRESS':
      return { ...state, userProgress: action.payload };
    case 'SET_MODULE_PROGRESS':
      return { ...state, moduleProgress: action.payload };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'UPDATE_PROGRESS':
      return { 
        ...state, 
        userProgress: state.userProgress ? { ...state.userProgress, ...action.payload } : action.payload 
      };
    default:
      return state;
  }
}

const initialState: GameState = {
  userProgress: null,
  moduleProgress: [],
  achievements: [],
  isLoading: false,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const refreshProgress = useCallback(async () => {
    // Simplified for analytics-focused platform - no authentication required
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const updateProgress = useCallback(async (updates: Partial<any>) => {
    // Simplified for analytics-focused platform - just update local state
    dispatch({ type: 'UPDATE_PROGRESS', payload: updates });
  }, []);

  const completeModule = useCallback(async (moduleId: string, xpGained: number) => {
    // Simplified for analytics-focused platform - log completion
    console.log(`Module ${moduleId} completed with ${xpGained} XP`);
  }, []);

  const addXP = useCallback(async (xp: number) => {
    // Simplified for analytics-focused platform - log XP gain
    console.log(`Added ${xp} XP`);
  }, []);

  const updateModuleProgress = useCallback(async (moduleId: string, progress: any) => {
    // Simplified for analytics-focused platform - log progress update
    console.log(`Updated module ${moduleId} progress:`, progress);
  }, []);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    // Simplified for analytics-focused platform - log achievement
    console.log(`Unlocked achievement: ${achievementId}`);
  }, []);

  const value: GameContextType = {
    userProgress: state.userProgress,
    moduleProgress: state.moduleProgress,
    achievements: state.achievements,
    isLoading: state.isLoading,
    refreshProgress,
    updateProgress,
    completeModule,
    addXP,
    updateModuleProgress,
    unlockAchievement,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}