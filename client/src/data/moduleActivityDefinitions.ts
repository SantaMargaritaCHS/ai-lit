import { ActivityType } from '@/context/ActivityRegistryContext';

/**
 * Module Activity Definitions
 *
 * Single source of truth for all module activities.
 * Used by both modules themselves and the ModuleOutline component.
 *
 * IMPORTANT: When adding/modifying activities in a module,
 * update this file to keep the outline in sync.
 */

export interface ModuleActivity {
  id: string;
  title: string;
  type: ActivityType;
  description?: string;
  duration?: string; // Estimated duration (e.g., "2 min", "5 min")
  completed?: boolean; // Runtime state, defaults to false
  // Expanded fields for detailed outline
  detailedDescription?: string; // Full explanation of the activity
  whatYoullDo?: string[]; // Bullet points of tasks
  learningObjectives?: string[]; // What students will learn
  keyTakeaways?: string[]; // Main points to remember
}

export interface ModuleDefinition {
  moduleId: string;
  moduleName: string;
  activities: ModuleActivity[];
}

/**
 * What Is AI Module Activities
 */
export const WHAT_IS_AI_ACTIVITIES: ModuleActivity[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    type: 'intro',
    description: 'Introduction to the module and learning objectives',
    duration: '1 min',
    completed: false,
    detailedDescription: 'Welcome to the What is AI module! This introduction sets the stage for your journey into understanding artificial intelligence. You\'ll get an overview of what you\'ll explore and how the activities will help you build AI literacy skills.',
    whatYoullDo: [
      'Review the module structure and learning path',
      'See what topics you\'ll explore: spotting AI, understanding how it works, and thinking critically about AI as a tool'
    ],
    learningObjectives: [
      'Understand what you\'ll learn in this module',
      'See how activities build on each other',
      'Get excited about exploring AI in everyday apps'
    ],
    keyTakeaways: [
      'This module teaches you to spot AI, understand how it works, and think critically about it',
      'You\'ll earn a certificate when you complete all activities'
    ]
  },
  {
    id: 'ai-or-not-quiz',
    title: 'AI Spotter Challenge',
    type: 'quiz',
    description: 'Identify which everyday technologies use AI',
    duration: '3 min',
    completed: false,
    detailedDescription: 'Before diving deep into AI, let\'s explore where it shows up in your daily life! You\'ll look at 12 different technologies and discover which ones use AI and which don\'t. This fun icebreaker helps you build intuition for what AI is (and isn\'t).',
    whatYoullDo: [
      'Examine 12 everyday scenarios (TikTok, calculators, Netflix, alarms, etc.)',
      'Decide if each technology uses AI or not',
      'Learn why each answer is correct through detailed explanations',
      'Discover teaching points about how AI learns and adapts'
    ],
    learningObjectives: [
      'Distinguish between AI and traditional software',
      'Understand that AI learns from data and finds patterns',
      'Recognize that not all computer programs are AI',
      'Identify AI in social media, entertainment, and communication apps'
    ],
    keyTakeaways: [
      'AI = Learning from data + Finding patterns + Adapting over time',
      'Non-AI = Fixed rules + Same input = Same output',
      'The key difference is learning and pattern recognition from examples'
    ]
  },
  {
    id: 'video-intro',
    title: 'Introduction Video (0:00-1:16)',
    type: 'video',
    description: 'Core introduction to AI concepts',
    duration: '1 min',
    completed: false,
    detailedDescription: 'Watch the first segment of the Introduction to Artificial Intelligence video. This foundational video explains what AI is and how it\'s already part of your daily life, setting the context for everything you\'ll learn.',
    whatYoullDo: [
      'Watch a 76-second video introduction',
      'Learn what artificial intelligence means',
      'See examples of AI in everyday contexts'
    ],
    learningObjectives: [
      'Define artificial intelligence in simple terms',
      'Understand that AI is already integrated into daily life',
      'Build foundational knowledge for deeper exploration'
    ],
    keyTakeaways: [
      'AI is technology that can learn, adapt, and make decisions',
      'AI is already part of your daily life in apps and devices'
    ]
  },
  {
    id: 'ai-in-the-wild',
    title: 'How AI Actually Works',
    type: 'interactive',
    description: 'Explore real-world examples of AI systems',
    duration: '4 min',
    completed: false,
    detailedDescription: 'Now let\'s see HOW AI works! Every AI system follows the same three-step process: Collect Data → Find Patterns → Take Action. You\'ll explore 6 real apps (TikTok, Spotify, YouTube, Gmail, Netflix, Instagram) and match the data, pattern, and action for each one.',
    whatYoullDo: [
      'Explore 6 popular apps and how they use AI',
      'Match the DATA each app collects (viewing history, emails, etc.)',
      'Identify the PATTERNS the AI finds',
      'Determine the ACTIONS the AI takes based on those patterns',
      'Get immediate feedback on your choices with detailed explanations'
    ],
    learningObjectives: [
      'Understand the three-step AI process: Data → Patterns → Actions',
      'See how real apps implement this framework',
      'Connect abstract concepts to concrete examples',
      'Recognize patterns across different AI applications'
    ],
    keyTakeaways: [
      'Every AI system follows: Data → Patterns → Actions',
      'TikTok analyzes what you watch to predict what you\'ll enjoy next',
      'Spotify finds patterns in your listening to discover new music',
      'Gmail spots spam patterns to filter suspicious emails'
    ]
  },
  {
    id: 'video-segment-2',
    title: 'AI as a Tool (2:22-2:58)',
    type: 'video',
    description: 'Understanding AI as a tool, not a conscious being',
    duration: '1 min',
    completed: false,
    detailedDescription: 'Watch a focused video segment that clarifies an important concept: AI is a tool, not a conscious being. Understanding this distinction helps you think critically about AI\'s capabilities and limitations.',
    whatYoullDo: [
      'Watch a 36-second video segment',
      'Learn why AI doesn\'t "feel" or "understand" like humans do',
      'Understand what it means to be a tool versus being conscious'
    ],
    learningObjectives: [
      'Distinguish between AI capabilities and human consciousness',
      'Understand that AI follows programmed patterns, not feelings',
      'Develop critical thinking about AI limitations'
    ],
    keyTakeaways: [
      'AI doesn\'t have feelings, consciousness, or true understanding',
      'AI is a powerful tool that follows patterns in data',
      'Remembering AI is a tool helps us use it responsibly'
    ]
  },
  {
    id: 'reflection-2',
    title: 'Reflection: AI as a Tool',
    type: 'reflection',
    description: 'Reflect on why AI is a tool and not conscious',
    duration: '3 min',
    completed: false,
    detailedDescription: 'Take time to think deeply about what you just learned. You\'ll write a thoughtful response to a reflection question about why it\'s important to remember that AI is a tool. Your response will be reviewed by AI to ensure you\'re engaging meaningfully with the concept.',
    whatYoullDo: [
      'Read the reflection question carefully',
      'Write a 2-3 sentence response (100+ characters, 15+ words)',
      'Submit your reflection for AI feedback',
      'Receive personalized feedback on your thinking',
      'Revise if needed to demonstrate understanding'
    ],
    learningObjectives: [
      'Articulate why the AI-as-tool distinction matters',
      'Connect video concepts to your own thinking',
      'Practice critical thinking and written expression',
      'Engage in metacognition about AI'
    ],
    keyTakeaways: [
      'Understanding AI as a tool prevents anthropomorphization',
      'This distinction helps us set realistic expectations for AI',
      'Recognizing AI\'s limits helps us use it more effectively'
    ]
  },
  {
    id: 'video-segment-3',
    title: 'AI Turning Point (3:00-3:31)',
    type: 'video',
    description: 'The future of AI and its impact',
    duration: '1 min',
    completed: false,
    detailedDescription: 'Watch a video segment about where AI is headed next. You\'ll learn about the "inflection point" we\'re at with AI—a major moment of change that will shape technology\'s role in society.',
    whatYoullDo: [
      'Watch a 31-second video about AI\'s future',
      'Learn what an "inflection point" means',
      'Consider how AI will evolve and impact society'
    ],
    learningObjectives: [
      'Understand the concept of a technological inflection point',
      'See AI as an evolving technology, not a finished product',
      'Begin thinking about AI\'s future role in your life'
    ],
    keyTakeaways: [
      'We are at an AI inflection point—a major turning moment',
      'AI technology is rapidly evolving and expanding',
      'The next few years will bring significant AI-driven changes'
    ]
  },
  {
    id: 'reflection-3',
    title: 'Reflection: Future of AI',
    type: 'reflection',
    description: 'Predict how AI will change your daily life',
    duration: '3 min',
    completed: false,
    detailedDescription: 'Now it\'s time to look forward! Based on what you\'ve learned, you\'ll predict one big change AI will bring to your daily life or schoolwork in the next five years. This helps you connect AI concepts to your own future.',
    whatYoullDo: [
      'Think about AI\'s potential impact on your life',
      'Write a thoughtful prediction (100+ characters, 15+ words)',
      'Explain your reasoning',
      'Submit for AI feedback',
      'Revise if needed to demonstrate thoughtful prediction'
    ],
    learningObjectives: [
      'Apply AI knowledge to real-world predictions',
      'Think critically about technology\'s trajectory',
      'Connect learning to personal relevance',
      'Practice evidence-based forecasting'
    ],
    keyTakeaways: [
      'AI will likely transform education, work, and daily tasks',
      'Your understanding of AI helps you prepare for these changes',
      'Being AI-literate means thinking ahead about impacts'
    ]
  },
  {
    id: 'certificate',
    title: 'Certificate',
    type: 'certificate',
    description: 'Download your completion certificate',
    duration: '1 min',
    completed: false,
    detailedDescription: 'Congratulations! You\'ve completed the What is AI module. Download your personalized certificate as proof of your achievement and AI literacy skills.',
    whatYoullDo: [
      'Review your accomplishments in this module',
      'Download your personalized certificate',
      'Celebrate your new AI literacy skills!'
    ],
    learningObjectives: [
      'Recognize your learning achievement',
      'Have documentation of module completion',
      'Feel motivated to continue learning about AI'
    ],
    keyTakeaways: [
      'You can now spot AI in everyday technology',
      'You understand the Data → Patterns → Actions framework',
      'You think critically about AI as a tool, not a conscious being'
    ]
  }
];

/**
 * All Module Definitions
 */
export const MODULE_DEFINITIONS: Record<string, ModuleDefinition> = {
  'what-is-ai': {
    moduleId: 'what-is-ai',
    moduleName: 'What is AI?',
    activities: WHAT_IS_AI_ACTIVITIES
  }
  // TODO: Add other modules:
  // 'intro-to-gen-ai': { ... },
  // 'intro-to-llms': { ... },
  // 'understanding-llms': { ... },
  // 'llm-limitations': { ... },
  // 'privacy-data-rights': { ... },
  // 'ai-environmental-impact': { ... },
  // 'introduction-to-prompting': { ... }
};

/**
 * Get activity definitions for a module
 */
export function getModuleActivities(moduleId: string): ModuleActivity[] | null {
  const definition = MODULE_DEFINITIONS[moduleId];
  return definition ? [...definition.activities] : null;
}

/**
 * Get full module definition
 */
export function getModuleDefinition(moduleId: string): ModuleDefinition | null {
  return MODULE_DEFINITIONS[moduleId] || null;
}

/**
 * Calculate total estimated duration for a module
 */
export function calculateModuleDuration(moduleId: string): string {
  const activities = getModuleActivities(moduleId);
  if (!activities) return 'Unknown';

  const totalMinutes = activities.reduce((sum, activity) => {
    if (!activity.duration) return sum;
    const match = activity.duration.match(/(\d+)\s*min/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return `${totalMinutes} min`;
}
