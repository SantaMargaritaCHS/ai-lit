import React, { useEffect } from 'react';
import IntroToGenAIActivity from '../pages/activities/IntroToGenAIActivity';

export default function IntroToGenerativeAILight() {
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    
    // Cleanup when component unmounts
    return () => {
      // Check if user prefers dark mode and restore it
      const prefersDark = localStorage.getItem('theme') === 'dark';
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  return (
    <div className="light-mode-only">
      <style>{`
        .light-mode-only {
          background: white !important;
          color: black !important;
          min-height: 100vh;
        }
        
        /* Override any dark mode styles */
        .light-mode-only .dark\\:bg-gray-900,
        .light-mode-only .dark\\:bg-gray-800 {
          background-color: #f3f4f6 !important;
        }
        
        .light-mode-only .dark\\:text-white,
        .light-mode-only .dark\\:text-gray-300 {
          color: #1f2937 !important;
        }
      `}</style>
      <IntroToGenAIActivity />
    </div>
  );
}