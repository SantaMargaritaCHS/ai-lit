import React, { useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';

interface ActivityWrapperProps {
  children: React.ReactNode;
}

export function ActivityWrapper({ children }: ActivityWrapperProps) {
  // Force dark mode for iframe activities to ensure visibility
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  // Navigation completely removed for direct link access

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Activity Content */}
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}