import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner - Reusable loading indicator
 *
 * Phase 4.3: UI/UX Polish
 *
 * Usage:
 * <LoadingSpinner message="Generating quiz questions..." />
 */

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message, size = 'md', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const iconSize = sizeClasses[size];

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <Loader2 className={`${iconSize} animate-spin text-purple-600 mb-3`} />
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
