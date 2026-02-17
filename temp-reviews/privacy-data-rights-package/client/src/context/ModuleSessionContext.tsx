import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Module {
  id: string;
  title: string;
  session: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Session {
  id: string;
  name: string;
  color: string;
}

interface ModuleSessionContextType {
  modules: Module[];
  sessions: Session[];
  updateModuleSession: (moduleId: string, sessionId: string | null) => void;
  createSession: (name: string) => void;
  deleteSession: (sessionId: string) => void;
  getModulesForSession: (sessionId: string | null) => Module[];
  reorderModules: (sessionId: string | null, moduleOrder: string[]) => void;
}

const ModuleSessionContext = createContext<ModuleSessionContextType | undefined>(undefined);

// CRITICAL: All modules start unassigned - let user organize their own sessions
// Database assignments will override these defaults
const INITIAL_MODULES: Module[] = [
  // Core AI Fundamentals  
  { id: 'what-is-ai', title: 'What is AI?', session: null, level: 'Beginner' },
  { id: 'intro-to-generative-ai', title: 'Introduction to Generative AI', session: null, level: 'Beginner' },
  { id: 'algorithms', title: 'From Movie Picks to AI Algorithms', session: null, level: 'Beginner' },
  { id: 'ai-history', title: 'History of AI', session: null, level: 'Beginner' },
  { id: 'nature-of-ai', title: 'Nature of AI', session: null, level: 'Beginner' },
  { id: 'how-ai-learns', title: 'How AI Learns', session: null, level: 'Beginner' },
  
  // AI Systems & Processing
  { id: 'pattern-recognition', title: 'Pattern Recognition', session: null, level: 'Intermediate' },
  { id: 'neural-networks', title: 'Neural Networks', session: null, level: 'Intermediate' },
  { id: 'ai-training', title: 'AI Training', session: null, level: 'Intermediate' },
  { id: 'generative-ai', title: 'Generative AI', session: null, level: 'Advanced' },
  { id: 'intro-llms', title: 'Introduction to Large Language Models', session: null, level: 'Intermediate' },
  { id: 'understanding-llms', title: 'Understanding Large Language Models', session: null, level: 'Intermediate' },
  { id: 'llm-limitations', title: 'Critical Thinking: LLM Limitations', session: null, level: 'Intermediate' },
  
  // AI Ethics & Responsibility
  { id: 'ai-ethics', title: 'AI Ethics', session: null, level: 'Intermediate' },
  { id: 'bias-exploration', title: 'AI Bias Exploration', session: null, level: 'Intermediate' },
  { id: 'ai-bias-fairness', title: 'AI Bias and Fairness', session: null, level: 'Intermediate' },
  { id: 'privacy-data-rights', title: 'Privacy and Data Rights', session: null, level: 'Beginner' },
  { id: 'ai-accountability', title: 'AI Accountability', session: null, level: 'Advanced' },
  { id: 'ai-environmental-impact', title: 'AI Environmental Impact', session: null, level: 'Intermediate' },
  { id: 'responsible-ai-schoolwork', title: 'Responsible AI Use in Schoolwork', session: null, level: 'Intermediate' },
  { id: 'what-can-ai-do', title: 'What Can AI Do?', session: null, level: 'Beginner' },
  
  // Advanced AI Techniques
  { id: 'tokenization', title: 'Understanding Tokenization', session: null, level: 'Intermediate' },
  { id: 'introduction-to-prompting', title: 'Introduction to Prompting', session: null, level: 'Beginner' },
  { id: 'prompt-engineering', title: 'Prompt Engineering', session: null, level: 'Advanced' },
  { id: 'chain-of-thought', title: 'Chain of Thought Prompting', session: null, level: 'Advanced' },
  { id: 'few-shot-zero-shot', title: 'Few-Shot vs Zero-Shot Training', session: null, level: 'Advanced' },
  { id: 'prompt-engineering-mastery', title: 'Prompt Engineering Mastery', session: null, level: 'Advanced' },
  { id: 'hallucination-detection', title: 'Hallucination Detection', session: null, level: 'Advanced' },
  
  // Creative & Interactive Modules
  { id: 'multimodal-ai', title: 'Multi-Modal AI', session: null, level: 'Advanced' },
  { id: 'ai-idea-factory', title: 'AI Idea Factory', session: null, level: 'Beginner' },
  { id: 'ai-idea-workshop', title: 'AI Idea Workshop', session: null, level: 'Intermediate' },
  { id: 'ai-bias-ethics', title: 'AI Bias & Ethics', session: null, level: 'Intermediate' },
  { id: 'ai-ethics-fundamentals', title: 'AI Ethics Fundamentals', session: null, level: 'Beginner' },
];

// Default sessions to prevent data loss
const INITIAL_SESSIONS: Session[] = [
  { id: 'session-introduction-for-teachers', name: 'Introduction for Teachers', color: 'bg-blue-100 dark:bg-blue-900' },
];

export function ModuleSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Load sessions from database
  const { data: dbSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/sessions'],
  });
  
  // Load module assignments from database
  const { data: moduleAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/module-assignments'],
  });
  
  // Create modules with assignments from database, preserving order
  // Database assignments ALWAYS take precedence over initial assignments
  const modules = INITIAL_MODULES.map(module => {
    const assignment = (moduleAssignments as any[]).find((a: any) => a.moduleId === module.id);
    return {
      ...module,
      // If there's a database assignment, use it completely (even if sessionId is null)
      // Only fall back to initial assignment if there's no database record at all
      session: assignment !== undefined ? assignment.sessionId : module.session,
      orderIndex: assignment ? assignment.orderIndex || 0 : 0
    };
  });
  
  // Convert database sessions to the expected format
  // Prioritize database sessions over initial sessions to avoid duplicates
  const dbSessionsFormatted = (dbSessions as any[]).map((s: any) => ({
    id: s.id,
    name: s.name,
    color: s.color
  }));
  
  const sessions = [
    // Only include initial sessions that don't exist in database
    ...INITIAL_SESSIONS.filter(initial => 
      !dbSessionsFormatted.some(db => db.id === initial.id)
    ),
    ...dbSessionsFormatted
  ];
  
  // Mutations for database operations
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    }
  });
  
  const updateModuleAssignmentMutation = useMutation({
    mutationFn: async ({ moduleId, sessionId }: { moduleId: string, sessionId: string | null }) => {
      const response = await fetch(`/api/module-assignments/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/module-assignments'] });
    }
  });
  
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/module-assignments'] });
    }
  });

  const reorderModulesMutation = useMutation({
    mutationFn: async ({ sessionId, moduleOrder }: { sessionId: string | null, moduleOrder: string[] }) => {
      const response = await fetch(`/api/sessions/${sessionId || 'null'}/reorder-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleOrder })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/module-assignments'] });
    }
  });

  const updateModuleSession = (moduleId: string, sessionId: string | null) => {
    updateModuleAssignmentMutation.mutate({ moduleId, sessionId });
  };

  const createSession = (name: string) => {
    const colors = [
      'bg-red-100 dark:bg-red-900',
      'bg-yellow-100 dark:bg-yellow-900',
      'bg-indigo-100 dark:bg-indigo-900',
      'bg-pink-100 dark:bg-pink-900',
      'bg-teal-100 dark:bg-teal-900',
    ];

    const newSession = {
      id: `session-${Date.now()}`,
      name,
      color: colors[sessions.length % colors.length],
    };

    createSessionMutation.mutate(newSession);
  };

  const deleteSession = (sessionId: string) => {
    deleteSessionMutation.mutate(sessionId);
  };

  const getModulesForSession = (sessionId: string | null) => {
    return modules
      .filter(module => module.session === sessionId)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  };

  const reorderModules = (sessionId: string | null, moduleOrder: string[]) => {
    reorderModulesMutation.mutate({ sessionId, moduleOrder });
  };

  // Initialize default session ONLY - let user organize modules manually
  useEffect(() => {
    if (!sessionsLoading && !assignmentsLoading && dbSessions.length === 0 && moduleAssignments.length === 0) {
      // Create the default "Introduction for Teachers" session but DON'T auto-assign modules
      createSessionMutation.mutate({
        id: 'session-introduction-for-teachers',
        name: 'Introduction for Teachers',
        color: 'bg-blue-100 dark:bg-blue-900'
      });
    }
  }, [sessionsLoading, assignmentsLoading, dbSessions.length, moduleAssignments.length]);

  return (
    <ModuleSessionContext.Provider value={{
      modules,
      sessions,
      updateModuleSession,
      createSession,
      deleteSession,
      getModulesForSession,
      reorderModules,
    }}>
      {children}
    </ModuleSessionContext.Provider>
  );
}

export function useModuleSession() {
  const context = useContext(ModuleSessionContext);
  if (context === undefined) {
    throw new Error('useModuleSession must be used within a ModuleSessionProvider');
  }
  return context;
}