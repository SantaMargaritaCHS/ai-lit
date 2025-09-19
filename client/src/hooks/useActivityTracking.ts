import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface ActivityTrackingData {
  userEmail: string;
  moduleId: string;
  moduleName: string;
}

export interface ActivityUpdate {
  completed?: boolean;
  score?: number;
  interactionData?: any;
  certificateGenerated?: boolean;
}

export function useActivityTracking(activityData: ActivityTrackingData) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const timeSpentRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);

  // Start session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (data: {
      userEmail: string;
      moduleId: string;
      moduleName: string;
      attemptNumber: number;
    }) => {
      return apiRequest('/api/activity-sessions', 'POST', data);
    },
    onSuccess: (response) => {
      setSessionId(response.id);
      startTimeRef.current = new Date();
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (data: {
      sessionId: number;
      updates: Partial<ActivityUpdate & { endTime?: Date; timeSpent?: number }>;
    }) => {
      return apiRequest(`/api/activity-sessions/${data.sessionId}`, 'PATCH', data.updates);
    },
  });

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        timeSpentRef.current = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      // Update final time when component unmounts
      if (sessionId && timeSpentRef.current > 0) {
        updateSessionMutation.mutate({
          sessionId,
          updates: {
            endTime: new Date(),
            timeSpent: timeSpentRef.current,
          },
        });
      }
    };
  }, [activityData.userEmail, activityData.moduleId]);

  // Initialize session on mount
  useEffect(() => {
    if (activityData.userEmail && activityData.moduleId) {
      startSessionMutation.mutate({
        userEmail: activityData.userEmail,
        moduleId: activityData.moduleId,
        moduleName: activityData.moduleName,
        attemptNumber: 1, // Could be enhanced to track multiple attempts
      });
    }
  }, [activityData.userEmail, activityData.moduleId]);

  // Update session function
  const updateSession = (updates: ActivityUpdate) => {
    if (sessionId) {
      updateSessionMutation.mutate({
        sessionId,
        updates: {
          ...updates,
          endTime: updates.completed ? new Date() : undefined,
          timeSpent: timeSpentRef.current,
        },
      });
    }
  };

  return {
    sessionId,
    updateSession,
    timeSpent: timeSpentRef.current,
    isStarting: startSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
  };
}