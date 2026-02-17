import React, { createContext, useContext, useState, ReactNode } from 'react';

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

const MODULE_NAME_PREFIX = 'ai-literacy-module-';
const MODULE_NAME_SUFFIX = '-name';

/** Load all per-module names from localStorage into React state */
function loadModuleNamesFromStorage(): Record<string, string> {
  const names: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(MODULE_NAME_PREFIX) && key.endsWith(MODULE_NAME_SUFFIX)) {
      const moduleId = key.slice(MODULE_NAME_PREFIX.length, -MODULE_NAME_SUFFIX.length);
      const value = localStorage.getItem(key);
      if (value) names[moduleId] = value;
    }
  }
  return names;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(() => {
    const stored = localStorage.getItem('ai-literacy-user-name');
    return stored || null;
  });

  // Per-module names stored in React state so setModuleName always triggers re-render
  const [moduleNames, setModuleNamesState] = useState<Record<string, string>>(
    loadModuleNamesFromStorage
  );

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('ai-literacy-user-name', name);
  };

  const clearUserName = () => {
    setUserNameState(null);
    localStorage.removeItem('ai-literacy-user-name');
  };

  // Per-module name methods — backed by both React state and localStorage
  const getModuleName = (moduleId: string): string | null => {
    return moduleNames[moduleId] || null;
  };

  const setModuleName = (moduleId: string, name: string) => {
    const key = `${MODULE_NAME_PREFIX}${moduleId}${MODULE_NAME_SUFFIX}`;
    localStorage.setItem(key, name);
    // Update React state — always creates a new object, so always triggers re-render
    setModuleNamesState(prev => ({ ...prev, [moduleId]: name }));
    // Also set as global name for dashboard display
    setUserName(name);
  };

  const clearModuleName = (moduleId: string) => {
    const key = `${MODULE_NAME_PREFIX}${moduleId}${MODULE_NAME_SUFFIX}`;
    localStorage.removeItem(key);
    setModuleNamesState(prev => {
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
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