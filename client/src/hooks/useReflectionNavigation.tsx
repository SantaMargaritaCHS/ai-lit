import { useState, useCallback } from 'react';

export interface ReflectionPoint {
  timestamp: number;
  question: string;
  id?: string;
  aiPrompt?: string;
}

export interface StandaloneReflection {
  id: string;
  questions: string[];
  isStandaloneReflection: true;
}

export interface EmbeddedReflection {
  id: string;
  type: 'video-with-reflection';
  reflectionPoints: ReflectionPoint[];
}

export type ReflectionActivity = StandaloneReflection | EmbeddedReflection;

export interface ReflectionState {
  currentQuestionIndex: number;
  responses: Record<string, string>;
  isComplete: boolean;
  currentReflectionId?: string;
}

export function useReflectionNavigation() {
  const [reflectionState, setReflectionState] = useState<ReflectionState>({
    currentQuestionIndex: 0,
    responses: {},
    isComplete: false,
  });

  const [standaloneReflections, setStandaloneReflections] = useState<Record<string, string[]>>({});
  const [embeddedReflections, setEmbeddedReflections] = useState<Record<string, string>>({});

  // Pattern A: Embedded Reflections (Video Pauses)
  const handleEmbeddedReflection = useCallback((
    reflectionId: string,
    response: string,
    onComplete?: () => void
  ) => {
    setEmbeddedReflections(prev => ({
      ...prev,
      [reflectionId]: response
    }));

    console.log(`📝 Embedded reflection completed: ${reflectionId}`, response);
    onComplete?.();
  }, []);

  // Pattern B: Standalone Reflection (Entire Activity)
  const initializeStandaloneReflection = useCallback((
    activityId: string,
    questions: string[]
  ) => {
    setReflectionState({
      currentQuestionIndex: 0,
      responses: {},
      isComplete: false,
      currentReflectionId: activityId,
    });

    setStandaloneReflections(prev => ({
      ...prev,
      [activityId]: questions
    }));

    console.log(`📝 Standalone reflection initialized: ${activityId}`, questions);
  }, []);

  const answerStandaloneQuestion = useCallback((
    questionIndex: number,
    response: string
  ) => {
    if (!reflectionState.currentReflectionId) return;

    setReflectionState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionIndex]: response
      }
    }));

    console.log(`📝 Question ${questionIndex} answered:`, response);
  }, [reflectionState.currentReflectionId]);

  const navigateToQuestion = useCallback((questionIndex: number) => {
    const currentActivity = reflectionState.currentReflectionId;
    if (!currentActivity || !standaloneReflections[currentActivity]) return;

    const questions = standaloneReflections[currentActivity];
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setReflectionState(prev => ({
        ...prev,
        currentQuestionIndex: questionIndex
      }));
      console.log(`📝 Navigated to question ${questionIndex + 1}/${questions.length}`);
    }
  }, [reflectionState.currentReflectionId, standaloneReflections]);

  const nextQuestion = useCallback(() => {
    const currentActivity = reflectionState.currentReflectionId;
    if (!currentActivity || !standaloneReflections[currentActivity]) return;

    const questions = standaloneReflections[currentActivity];
    const nextIndex = reflectionState.currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      navigateToQuestion(nextIndex);
    } else {
      // All questions completed
      setReflectionState(prev => ({
        ...prev,
        isComplete: true
      }));
      console.log(`📝 Standalone reflection completed: ${currentActivity}`);
    }
  }, [reflectionState, standaloneReflections, navigateToQuestion]);

  const previousQuestion = useCallback(() => {
    const prevIndex = reflectionState.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      navigateToQuestion(prevIndex);
    }
  }, [reflectionState.currentQuestionIndex, navigateToQuestion]);

  const skipToQuestion = useCallback((questionIndex: number) => {
    navigateToQuestion(questionIndex);
  }, [navigateToQuestion]);

  const completeStandaloneReflection = useCallback((
    onComplete?: () => void
  ) => {
    if (!reflectionState.currentReflectionId) return;

    setReflectionState(prev => ({
      ...prev,
      isComplete: true
    }));

    console.log(`📝 Standalone reflection manually completed: ${reflectionState.currentReflectionId}`);
    onComplete?.();
  }, [reflectionState.currentReflectionId]);

  const resetReflection = useCallback(() => {
    setReflectionState({
      currentQuestionIndex: 0,
      responses: {},
      isComplete: false,
    });
  }, []);

  // Developer mode utilities
  const getReflectionProgress = useCallback(() => {
    const currentActivity = reflectionState.currentReflectionId;
    if (!currentActivity || !standaloneReflections[currentActivity]) return null;

    const questions = standaloneReflections[currentActivity];
    const completedCount = Object.keys(reflectionState.responses).length;

    return {
      currentQuestion: reflectionState.currentQuestionIndex + 1,
      totalQuestions: questions.length,
      completedQuestions: completedCount,
      progressPercentage: (completedCount / questions.length) * 100,
      isComplete: reflectionState.isComplete
    };
  }, [reflectionState, standaloneReflections]);

  return {
    // State
    reflectionState,
    standaloneReflections,
    embeddedReflections,

    // Pattern A: Embedded Reflections
    handleEmbeddedReflection,

    // Pattern B: Standalone Reflections
    initializeStandaloneReflection,
    answerStandaloneQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    skipToQuestion,
    completeStandaloneReflection,

    // Utilities
    resetReflection,
    getReflectionProgress,
  };
}