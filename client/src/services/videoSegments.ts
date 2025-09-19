export interface PausePoint {
  time: number;
  prompt: string;
}

export interface KeyPoint {
  time: number;
  label: string;
}

export interface Chapter {
  time: number;
  title: string;
}

export interface VideoSegment {
  id: string;
  source: string;
  start: number;
  end: number;
  title: string;
  description: string;
  interactive?: {
    pausePoints: PausePoint[];
  };
  keyPoints?: KeyPoint[];
  chapters?: Chapter[];
  mandatory: boolean;
  crossfade?: boolean;
  nextSegment?: string;
  allowSkipWithinChapters?: boolean;
  reflection?: boolean;
}

export const videoSegments: VideoSegment[] = [
  {
    id: 'intro-complete',
    source: 'intro',
    start: 0,
    end: 100000, // Let the full video play
    title: "Introduction to Artificial Intelligence",
    description: "Understanding AI in your daily life",
    chapters: [
      { time: 0, title: 'Welcome to AI' },
      { time: 30, title: 'AI Examples' },
      { time: 60, title: 'What is AI?' },
      { time: 90, title: 'Intelligence?' }
    ],
    interactive: {
      pausePoints: [
        { time: 30, prompt: "Think: What AI did you use today?" },
        { time: 60, prompt: "Quick Check: Can you identify AI vs non-AI?" }
      ]
    },
    mandatory: true
  },
  {
    id: 'history-complete',
    source: 'history',
    start: 0,
    end: 100000, // Let the full video play
    title: "History of Artificial Intelligence",
    description: "From the 1950s to today",
    chapters: [
      { time: 0, title: 'Early Beginnings' },
      { time: 60, title: 'AI Winters' },
      { time: 120, title: 'Modern Renaissance' },
      { time: 180, title: 'Current Era' }
    ],
    interactive: {
      pausePoints: [
        { time: 60, prompt: "Reflect: Why do you think AI had 'winters'?" },
        { time: 180, prompt: "Consider: How has AI changed recently?" }
      ]
    },
    mandatory: true
  }
];

export const getSegmentById = (id: string): VideoSegment | undefined => {
  return videoSegments.find(segment => segment.id === id);
};

export const getSegmentsBySource = (source: string): VideoSegment[] => {
  return videoSegments.filter(segment => segment.source === source);
};

export const getMandatorySegments = (): VideoSegment[] => {
  return videoSegments.filter(segment => segment.mandatory);
};

export const getNextSegment = (currentId: string): VideoSegment | undefined => {
  const currentIndex = videoSegments.findIndex(segment => segment.id === currentId);
  if (currentIndex >= 0 && currentIndex < videoSegments.length - 1) {
    return videoSegments[currentIndex + 1];
  }
  return undefined;
};