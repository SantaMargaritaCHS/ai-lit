import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  clearUserName: () => void;
  // Per-module name methods
  getModuleName: (moduleId: string) => string | null;
  setModuleName: (moduleId: string, name: string) => void;
  clearModuleName: (moduleId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(() => {
    // Load name from localStorage on initialization
    const stored = localStorage.getItem('ai-literacy-user-name');
    return stored || null;
  });

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('ai-literacy-user-name', name);
  };

  const clearUserName = () => {
    setUserNameState(null);
    localStorage.removeItem('ai-literacy-user-name');
  };

  // Per-module name methods
  const getModuleName = (moduleId: string): string | null => {
    const key = `ai-literacy-module-${moduleId}-name`;
    return localStorage.getItem(key);
  };

  const setModuleName = (moduleId: string, name: string) => {
    const key = `ai-literacy-module-${moduleId}-name`;
    localStorage.setItem(key, name);
    // Also set as global name for dashboard display
    setUserName(name);
  };

  const clearModuleName = (moduleId: string) => {
    const key = `ai-literacy-module-${moduleId}-name`;
    localStorage.removeItem(key);
  };

  return (
    <UserContext.Provider value={{ 
      userName, 
      setUserName, 
      clearUserName,
      getModuleName,
      setModuleName,
      clearModuleName
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}