import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, FastForward, RotateCcw } from 'lucide-react';
import { useUniversalDevMode } from '@/hooks/useUniversalDevMode';

interface ModuleDevControlsProps {
  currentActivity: number;
  totalActivities: number;
  onNavigate: (index: number) => void;
  onCompleteAll: () => void;
  onReset: () => void;
  activityNames?: string[];
}

export function ModuleDevControls({
  currentActivity,
  totalActivities,
  onNavigate,
  onCompleteAll,
  onReset,
  activityNames = []
}: ModuleDevControlsProps) {
  const { isDevModeActive } = useUniversalDevMode();

  // Debug log when component renders
  useEffect(() => {
    console.log('🔧 DEV: ModuleDevControls rendered', {
      isDevModeActive,
      currentActivity,
      totalActivities,
      activityNames
    });
  }, [isDevModeActive, currentActivity, totalActivities]);

  // Don't render if dev mode is not active
  if (!isDevModeActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px'
      }}>
        🔧 DEV MODE
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetIndex = Math.max(0, currentActivity - 1);
            console.log('🔧 DEV: Previous button clicked!', {
              currentActivity,
              targetIndex,
              disabled: currentActivity <= 0
            });
            if (currentActivity > 0) {
              onNavigate(targetIndex);
            }
          }}
          disabled={currentActivity <= 0}
          style={{
            background: currentActivity <= 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: currentActivity <= 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            opacity: currentActivity <= 0 ? 0.5 : 1
          }}
          title="Previous activity (←)"
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{
          minWidth: '180px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 12px',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Activity {currentActivity + 1} of {totalActivities}
          </div>
          {activityNames[currentActivity] && (
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
              {activityNames[currentActivity]}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetIndex = Math.min(totalActivities - 1, currentActivity + 1);
            console.log('🔧 DEV: Next button clicked!', {
              currentActivity,
              targetIndex,
              totalActivities,
              disabled: currentActivity >= totalActivities - 1
            });
            if (currentActivity < totalActivities - 1) {
              onNavigate(targetIndex);
            }
          }}
          disabled={currentActivity >= totalActivities - 1}
          style={{
            background: currentActivity >= totalActivities - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: currentActivity >= totalActivities - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            opacity: currentActivity >= totalActivities - 1 ? 0.5 : 1
          }}
          title="Next activity (→)"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{
        width: '1px',
        height: '24px',
        background: 'rgba(255,255,255,0.2)'
      }} />

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔧 DEV: Skip to End button clicked!');
          onCompleteAll();
        }}
        style={{
          background: 'rgba(255,255,255,0.25)',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontSize: '12px'
        }}
        title="Skip to end (Ctrl+Shift+E)"
      >
        <FastForward size={16} />
        Skip to End
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔧 DEV: Reset button clicked!');
          onReset();
        }}
        style={{
          background: 'rgba(255,255,255,0.25)',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontSize: '12px'
        }}
        title="Reset module (Ctrl+Shift+R)"
      >
        <RotateCcw size={16} />
        Reset
      </button>

      <div style={{ fontSize: '11px', opacity: 0.7 }}>
        Use ← → arrows to navigate
      </div>
    </div>
  );
}