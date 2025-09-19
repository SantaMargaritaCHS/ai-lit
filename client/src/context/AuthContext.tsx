import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProgress } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedProgress = localStorage.getItem('progress');
    
    if (storedUser && storedProgress) {
      setUser(JSON.parse(storedUser));
      setProgress(JSON.parse(storedProgress));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password,
      });

      const data = await response.json();
      
      setUser(data.user);
      setProgress(data.progress);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('progress', JSON.stringify(data.progress));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProgress(null);
    localStorage.removeItem('user');
    localStorage.removeItem('progress');
  };

  return (
    <AuthContext.Provider value={{
      user,
      progress,
      login,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
