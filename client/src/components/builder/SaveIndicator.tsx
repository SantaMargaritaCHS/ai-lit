import React, { useEffect, useState } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

/**
 * SaveIndicator - Show save/validation status
 *
 * Phase 4.3: UI/UX Polish
 *
 * Provides visual feedback for save operations
 *
 * Usage:
 * <SaveIndicator status="saved" message="All changes saved" />
 */

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveIndicatorProps {
  status: SaveStatus;
  message?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function SaveIndicator({
  status,
  message,
  autoHide = true,
  autoHideDelay = 3000,
}: SaveIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      setVisible(true);

      if (autoHide && (status === 'saved' || status === 'error')) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [status, autoHide, autoHideDelay]);

  if (!visible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          iconClass: 'animate-spin text-blue-600',
          bgClass: 'bg-blue-50 border-blue-200',
          textClass: 'text-blue-900',
          defaultMessage: 'Saving...',
        };
      case 'saved':
        return {
          icon: Check,
          iconClass: 'text-green-600',
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-900',
          defaultMessage: 'Saved successfully',
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconClass: 'text-red-600',
          bgClass: 'bg-red-50 border-red-200',
          textClass: 'text-red-900',
          defaultMessage: 'Save failed',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`fixed bottom-6 right-6 ${config.bgClass} border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 z-50`}
    >
      <Icon className={`w-5 h-5 ${config.iconClass}`} />
      <span className={`text-sm font-medium ${config.textClass}`}>
        {message || config.defaultMessage}
      </span>
    </div>
  );
}

/**
 * Hook for managing save indicator state
 */
export function useSaveIndicator() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState<string | undefined>();

  const showSaving = (message?: string) => {
    setSaveStatus('saving');
    setSaveMessage(message);
  };

  const showSaved = (message?: string) => {
    setSaveStatus('saved');
    setSaveMessage(message);
  };

  const showError = (message?: string) => {
    setSaveStatus('error');
    setSaveMessage(message);
  };

  const reset = () => {
    setSaveStatus('idle');
    setSaveMessage(undefined);
  };

  return {
    saveStatus,
    saveMessage,
    showSaving,
    showSaved,
    showError,
    reset,
  };
}
