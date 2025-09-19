// Interactive Video Activity Types
export interface VideoActivity {
  id: string;
  videoId: string;
  timestamp: number;
  type: 'reflection' | 'quiz' | 'discussion' | 'application' | 'transition';
  required: boolean;
  data: ActivityData;
}

export type ActivityData = 
  | ReflectionActivity
  | QuizActivity
  | DiscussionActivity
  | ApplicationActivity
  | TransitionActivity;

export interface ReflectionActivity {
  type: 'reflection';
  id?: string;
  title?: string;
  prompt: string;
  guidingQuestions?: string[];
  minResponseLength?: number;
  aiGenerated?: boolean;
}

export interface QuizActivity {
  type: 'quiz';
  question: string;
  options: QuizOption[];
  explanation: string;
  allowMultiple?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface DiscussionActivity {
  type: 'discussion';
  topic: string;
  prompts: string[];
  shareableInsight?: boolean;
}

export interface ApplicationActivity {
  type: 'application';
  scenario: string;
  task: string;
  examples?: string[];
  hints?: string[];
}

export interface TransitionActivity {
  type: 'transition';
  currentTopicSummary: string;
  nextTopicPreview: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  connectionExplanation: string;
}