// Video Segment Type
export interface VideoSegment {
  id: string;
  title: string;
  description?: string;
  start: number;
  end: number;
  source: string;
  mandatory?: boolean;
}

// Exit Ticket Types
export interface ExitTicketQuestion {
  id: string;
  text: string;
  placeholder?: string;
}

// Innovation Type for Renewable Section
export interface Innovation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// Step Types for the Module
export interface GuidedStep {
  id: string;
  title: string;
  type: 'intro' | 'video' | 'question' | 'reveal' | 'reflection' | 
        'renewable' | 'solutions' | 'exit-ticket' | 'final' | 'training';
  content: string;
  icon?: React.ComponentType<{ className?: string }>;
  options?: string[];
  correctAnswer?: number;
  waterBottles?: number;
  energyComparison?: string;
  realWorldExample?: string;
  innovations?: Innovation[];
  isReflectionStep?: boolean;
}

// Module Props
export interface AIEnvironmentalImpactModuleProps {
  onComplete: () => void;
}

// Re-export from video-activities if needed
export * from './video-activities';