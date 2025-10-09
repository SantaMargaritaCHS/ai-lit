import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, AlertCircle, Zap, Target, Trophy, BookOpen, Info, UserCircle, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PremiumVideoPlayer from '@/components/PremiumVideoPlayer';
import { Certificate } from '@/components/Certificate';
import { ExitTicket } from '@/components/ExitTicket';

import { DeveloperPanel } from '@/components/DeveloperPanel';
import { SecretKeyPrompt } from '@/components/SecretKeyPrompt';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { RTF_CHALLENGE_SCENARIOS } from '@/data/rtfChallengeScenarios';
import BasicPromptDemo from '@/components/BasicPromptDemo';
// Import enhanced components from activities/prompting
import PromptingFrameworks from '@/components/activities/prompting/PromptingFrameworks';
import WhatIsPromptingFramework from '@/components/activities/prompting/WhatIsPromptingFramework';
import RoleMatchingActivity from '@/components/activities/prompting/RoleMatchingActivity';
import FormatTransformationActivity from '@/components/activities/prompting/FormatTransformationActivity';
import RTFOutputBuilder from './IntroductionToPromptingModule/RTFOutputBuilder';
import AITaskExamples from '@/components/activities/prompting/AITaskExamples';
import PromptingExitTicket from '@/components/activities/prompting/PromptingExitTicket';
import VaguePromptRater from '@/components/activities/prompting/VaguePromptRater';
import PromptQualityActivity from '@/components/activities/prompting/PromptQualityActivity';
import RTFPracticeSection from './IntroductionToPromptingModule/RTFPracticeSection';
import RoleActivity from './IntroductionToPromptingModule/RoleActivity';
import TaskActivity from './IntroductionToPromptingModule/TaskActivity';
import FormatActivity from './IntroductionToPromptingModule/FormatActivity';
import SayWhatYouSeeActivity from './IntroductionToPromptingModule/SayWhatYouSeeActivity';

// Enhanced Module structure with improved educational flow
const ACTIVITIES = [
  { id: 'welcome', title: 'Welcome', completed: false },
  { id: 'say-what-you-see', title: 'Say What You See', completed: false },
  { id: 'basics-video-part1', title: 'What is a Prompt?', completed: false },
  { id: 'rate-vague-prompts', title: 'Practice: Rate Prompts', completed: false },
  { id: 'basics-video-part2', title: 'Prompting Principles', completed: false },
  { id: 'what-is-framework', title: 'What is a Prompting Framework?', completed: false },
  { id: 'frameworks', title: 'Prompting Frameworks', completed: false },
  { id: 'rtf-video', title: 'Understanding RTF', completed: false },
  
  // Separated Role: Video then Activity
  { id: 'role-video', title: 'Understanding Role', completed: false },
  { id: 'role-activity', title: 'Practice: Choosing Your AI Expert', completed: false },
  
  // Separated Task: Video then Activity
  { id: 'task-video', title: 'Understanding Task', completed: false },
  { id: 'task-activity', title: 'Practice: Clear Requests', completed: false },
  
  // Separated Format: Video then Activity
  { id: 'format-video', title: 'Understanding Format', completed: false },
  { id: 'format-activity', title: 'Format Transformation Magic', completed: false },
  
  { id: 'rtf-builder', title: 'Build Your RTF Prompt', completed: false },
  { id: 'conclusion-video', title: 'Advanced Tips', completed: false },
  { id: 'exit-ticket', title: 'Reflection', completed: false },
  { id: 'certificate', title: 'Certificate', completed: false }
];

// Split basics video into two segments with activity in between
const BASICS_VIDEO_SEGMENTS = {
  part1: {
    id: 'basics-segment-part1',
    title: 'What is a Prompt?',
    start: 0,
    end: 45, // Pause at 45 seconds for activity
    source: '/videos/6_Introduction_to_Basic_Prompting.mp4',
    description: 'Introduction to prompts',
    mandatory: true,
    interactive: undefined
  },
  part2: {
    id: 'basics-segment-part2',
    title: 'Continuing Prompting Basics',
    start: 45, // Resume from 45 seconds
    end: 133, // End at 2:13
    source: '/videos/6_Introduction_to_Basic_Prompting.mp4',
    description: 'More prompting fundamentals',
    mandatory: true,
    interactive: undefined
  }
};

const RTF_VIDEO_SEGMENTS = {
  intro: {
    id: 'rtf-intro-segment',
    title: 'RTF Framework Introduction',
    start: 0,  // Video will start from beginning
    end: 73,   // Will pause at 1:13
    source: '/videos/7_Prompting_Framework_RTF.mp4',
    description: 'Introduction to the RTF framework',
    mandatory: true,
    interactive: undefined
  },
  role: {
    id: 'role-segment',
    title: 'Understanding Role',
    start: 73,  // Will start from 1:13
    end: 109,   // Will pause at 1:49
    source: '/videos/7_Prompting_Framework_RTF.mp4',
    description: 'Learn about the Role component',
    mandatory: true,
    interactive: undefined
  },
  task: {
    id: 'task-segment', 
    title: 'Understanding Task',
    start: 109, // Will start from 1:49
    end: 183,   // Will pause at 3:03
    source: '/videos/7_Prompting_Framework_RTF.mp4',
    description: 'Learn about the Task component',
    mandatory: true,
    interactive: undefined
  },
  format: {
    id: 'format-segment',
    title: 'Understanding Format', 
    start: 183, // Will start from 3:03
    end: 279,   // Will pause at 4:39
    source: '/videos/7_Prompting_Framework_RTF.mp4',
    description: 'Learn about the Format component',
    mandatory: true,
    interactive: undefined
  }
};

const CONCLUSION_VIDEO_SEGMENT = {
  id: 'conclusion-segment',
  title: 'Advanced Prompting Tips',
  start: 133, // Will start from 2:13
  end: 175,   // Will pause at 2:55
  source: '/videos/6_Introduction_to_Basic_Prompting.mp4',
  description: 'Advanced tips for effective prompting',
  mandatory: true,
  interactive: undefined
};

// Sample prompts for fixing activity
const VAGUE_PROMPTS = [
  {
    id: 'vague-1',
    prompt: 'Help me with science',
    issues: ['No specific topic', 'No clear task', 'No format specified'],
    improved: 'Act as a 5th grade science teacher and create a 10-minute hands-on experiment about the water cycle using common household materials. Format as step-by-step instructions.'
  },
  {
    id: 'vague-2',
    prompt: 'Write something for my class',
    issues: ['Unclear what to write', 'No context about class', 'No specifications'],
    improved: 'Act as an elementary school teacher and write a friendly welcome letter for parents at the start of the school year. Include classroom expectations, communication methods, and volunteer opportunities. Format as a one-page letter.'
  },
  {
    id: 'vague-3',
    prompt: 'Make it better',
    issues: ['No context about what "it" is', 'No definition of "better"', 'No specific improvements requested'],
    improved: 'Act as a writing coach and improve this student essay introduction by making it more engaging. Add a compelling hook, clarify the thesis statement, and ensure smooth transitions. Maintain the student\'s voice while enhancing clarity.'
  }
];

// RTF components for builder
const ROLES = [
  'Elementary School Teacher',
  'High School Math Teacher',
  'Science Educator',
  'Language Arts Instructor',
  'Special Education Specialist',
  'School Counselor',
  'Curriculum Developer',
  'Educational Technology Coach'
];

const TASKS = [
  'Create a lesson plan',
  'Write parent communication',
  'Develop assessment questions',
  'Generate discussion prompts',
  'Design a rubric',
  'Explain a complex concept',
  'Create differentiated materials',
  'Suggest classroom activities'
];

const FORMATS = [
  'Step-by-step instructions',
  'Bulleted list',
  'Detailed paragraph',
  'Table or chart',
  'Dialogue or script',
  'Visual description',
  'Checklist',
  'Timeline'
];

// Developer mode responses
const DEV_RESPONSES = {
  preAssessment: "3",
  vaguePromptFixes: {
    'vague-1': ['No specific topic', 'No clear task'],
    'vague-2': ['Unclear what to write', 'No context about class'],
    'vague-3': ['No context about what "it" is', 'No definition of "better"']
  },
  rtfBuilder: {
    role: 'High School Math Teacher',
    task: 'Create a lesson plan',
    format: 'Step-by-step instructions'
  },
  challengePrompt: 'Act as a High School Math Teacher and create a lesson plan for teaching quadratic equations to 10th graders. Include a warm-up activity, main instruction with examples, guided practice, and assessment. Format as step-by-step instructions with time allocations.',
  workshopPrompt: 'Act as an Educational Technology Coach and design a professional development workshop for teachers on integrating AI tools in the classroom. Include learning objectives, hands-on activities, and discussion prompts. Format as a detailed 2-hour session plan.',
  exitTicket: {
    'rtf-usage': 'I will use the RTF framework to create clear, specific prompts for lesson planning, generating differentiated materials, and communicating with parents. This structured approach will help me get more useful responses from AI tools.',
    'next-prompt': 'Act as a 4th grade teacher and create a week-long reading comprehension unit on folktales from different cultures. Include daily lesson plans, vocabulary activities, and a culminating project. Format as a detailed curriculum guide.'
  }
};

// Helper function to track timeouts
const setTrackedTimeout = (callback: () => void, delay: number) => {
  const timers = (window as any).__introPromptingTimers || [];
  const timer = setTimeout(callback, delay);
  timers.push(timer);
  (window as any).__introPromptingTimers = timers;
  return timer;
};

// Error Boundary for Introduction to Prompting Module
class IntroPromptingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Introduction to Prompting Module Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Something went wrong</h3>
          <p className="text-gray-600 mb-4">
            We encountered an error in the prompting module. Please refresh the page to try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Simplified Vague Prompt Rater without RTF references
const SimplePromptRater: React.FC<{
  onComplete: () => void;
  isDevMode: boolean;
}> = ({ onComplete, isDevMode }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userRating, setUserRating] = useState(50);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userImprovement, setUserImprovement] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const simplePrompts = [
    {
      id: 1,
      prompt: "Help me with science",
      issues: ["Too vague", "No specific question", "Unclear what kind of help needed"],
      improved: "Can you explain how photosynthesis works in plants, specifically the light and dark reactions?"
    },
    {
      id: 2,
      prompt: "Write something",
      issues: ["No topic specified", "No purpose given", "No length or format indicated"],
      improved: "Please write a 200-word summary of the American Revolution for my 8th grade history class."
    },
    {
      id: 3,
      prompt: "Explain the water cycle for elementary students using simple terms and include the main stages like evaporation, condensation, and precipitation.",
      issues: [],
      improved: null // This is already a good prompt
    }
  ];

  const currentPrompt = simplePrompts[currentPromptIndex];

  // Get AI feedback for rating
  const getAIFeedback = async (prompt: string, rating: number) => {
    setIsLoadingFeedback(true);
    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `You are a helpful assistant evaluating prompt quality. The user rated this prompt "${prompt}" as ${rating}% effective. Provide brief, encouraging feedback about their rating. If they rated it low and it's vague, agree and explain why. If they rated it high and it's specific, praise their recognition. Keep response under 50 words.`,
          userPrompt: `Rating: ${rating}%`,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiFeedback(data.response);
      } else {
        setAiFeedback(`${rating < 50 ? 'Good eye!' : 'Interesting rating!'} ${rating < 50 ? 'This prompt could use more specific details.' : 'You might be seeing something I missed!'}`);
      }
    } catch (error) {
      // Fallback responses based on rating
      if (rating < 30) {
        setAiFeedback("You're right! This prompt is quite vague and would benefit from more specific details.");
      } else if (rating < 60) {
        setAiFeedback("Fair assessment! This prompt has some issues but could work with improvements.");
      } else {
        setAiFeedback("Interesting perspective! This prompt does have some good qualities.");
      }
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleRatePrompt = async () => {
    setShowFeedback(true);
    await getAIFeedback(currentPrompt.prompt, userRating);
  };

  const handleNext = () => {
    if (currentPromptIndex < simplePrompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setUserRating(50);
      setShowFeedback(false);
      setUserImprovement('');
      setAiFeedback('');
    } else {
      onComplete();
    }
  };

  // Auto-complete in dev mode
  useEffect(() => {
    if (isDevMode) {
      setUserRating(currentPrompt.issues.length > 0 ? 20 : 90);
      setTimeout(() => handleRatePrompt(), 500);
    }
  }, [isDevMode, currentPromptIndex]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Rate the Prompt Quality</h3>
        <p className="text-gray-600 dark:text-gray-300">
          How effective do you think this prompt would be for getting a helpful response?
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {simplePrompts.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < currentPromptIndex 
                  ? 'bg-green-500' 
                  : idx === currentPromptIndex 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Prompt #{currentPrompt.id}</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
              "{currentPrompt.prompt}"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              How effective is this prompt? (0-100%)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={userRating}
                onChange={(e) => setUserRating(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold">{userRating}%</span>
                <p className="text-sm text-gray-500">
                  {userRating < 30 ? 'Needs major improvement' : 
                   userRating < 60 ? 'Could be better' : 
                   userRating < 80 ? 'Pretty good' : 'Excellent'}
                </p>
              </div>
            </div>
          </div>

          {!showFeedback && (
            <Button
              onClick={handleRatePrompt}
              className="w-full"
              disabled={isLoadingFeedback}
            >
              {isLoadingFeedback ? 'Getting AI Feedback...' : 'Submit Rating'}
            </Button>
          )}

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* AI Feedback */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  AI Feedback:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{aiFeedback}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  My rating: {currentPrompt.issues.length > 0 ? '20%' : '85%'}
                </p>
              </div>

              {/* Issues or Strengths */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {currentPrompt.issues.length > 0 ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span>Issues with this prompt:</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>What makes this prompt effective:</span>
                    </>
                  )}
                </h4>
                {currentPrompt.issues.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {currentPrompt.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-300">{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li className="text-gray-600 dark:text-gray-300">Specific topic and audience</li>
                    <li className="text-gray-600 dark:text-gray-300">Clear request for what's needed</li>
                    <li className="text-gray-600 dark:text-gray-300">Includes helpful details</li>
                  </ul>
                )}
              </div>

              {/* Try Improving Section - with better contrast */}
              {currentPrompt.issues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Try improving this prompt:</h4>
                  <Textarea
                    value={userImprovement}
                    onChange={(e) => setUserImprovement(e.target.value)}
                    placeholder="Make the prompt more specific. What subject? What kind of help? Add details..."
                    className="min-h-[100px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                  {userImprovement && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Great job adding specifics! Clear prompts get better responses.
                    </p>
                  )}
                </div>
              )}

              {/* Example Improvement */}
              {currentPrompt.improved && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                    Example of an improved version:
                  </h4>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    "{currentPrompt.improved}"
                  </p>
                </div>
              )}

              <Button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {currentPromptIndex < simplePrompts.length - 1 ? 'Next Prompt' : 'Continue Video'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface IntroductionToPromptingModuleProps {
  userName?: string;
  onComplete?: () => void;
  isDevMode?: boolean;
  showDevPanel?: boolean;
  setShowDevPanel?: (show: boolean) => void;
  disableDevMode?: () => void;
}

const IntroductionToPromptingModule: React.FC<IntroductionToPromptingModuleProps> = ({
  userName: initialUserName = '',
  onComplete,
  isDevMode = false,
  showDevPanel = false,
  setShowDevPanel,
  disableDevMode
}) => {
  // Get isDevMode from context
  const { isDevModeActive: contextIsDevMode } = useDevMode();

  // ActivityRegistry hooks
  const { registerActivity, clearRegistry, goToActivity } = useActivityRegistry();

  const [userName, setUserName] = useState(initialUserName);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [exitTicketResponses, setExitTicketResponses] = useState<Record<string, string>>({});
  const [hasCompletedExitTicket, setHasCompletedExitTicket] = useState(false);
  const [startTime] = useState(Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video URL states
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({
    'basics': '',
    'rtf-framework': ''
  });

  // Use dev mode from context or prop
  const actualIsDevMode = contextIsDevMode || isDevMode;

  // Universal Developer Mode Integration - Using placeholders since dev mode is handled at app level
  const universalDevMode = false;
  const universalShowDevPanel = false;
  const showKeyPrompt = false;
  const setShowKeyPrompt = () => {};
  const originalHandleSecretKeySubmit = () => true;
  const handleNextTask = () => {};
  const devConfig = null;
  const setUniversalShowDevPanel = () => {};

  // Wrapper for secret key submit with logging
  const handleSecretKeySubmit = (key: string) => {
    console.log('IntroductionToPromptingModule: Secret key submitted:', key);
    originalHandleSecretKeySubmit(key);
  };

  // Register activities with ActivityRegistry on mount
  useEffect(() => {
    console.log('🔧 [IntroductionToPromptingModule]: Registering activities...');
    clearRegistry();

    ACTIVITIES.forEach((activity, index) => {
      const activityRegistration = {
        id: activity.id,
        type: activity.id === 'certificate' ? 'certificate' :
              activity.id.includes('video') ? 'video' :
              activity.id === 'exit-ticket' ? 'reflection' :
              'interactive',
        title: activity.title,
        completed: index < currentActivity
      };
      console.log(`📝 Registering activity: ${activityRegistration.id} (${activityRegistration.type})`);
      registerActivity(activityRegistration);
    });
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 [IntroductionToPromptingModule]: Received goToActivity command for index ${activityIndex}`);

      // Logic to navigate to the specific activity based on index
      if (activityIndex >= 0 && activityIndex < ACTIVITIES.length) {
        setCurrentActivity(activityIndex);
        console.log(`✅ Jumped to activity ${activityIndex}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, []);

  // Update userName when prop changes
  useEffect(() => {
    if (initialUserName) {
      setUserName(initialUserName);
    }
  }, [initialUserName]);

  // Debug logging for developer mode
  useEffect(() => {
    console.log('IntroductionToPromptingModule Developer Mode Status:', {
      isDevMode,
      contextIsDevMode,
      actualIsDevMode,
      universalDevMode,
      showDevPanel,
      universalShowDevPanel,
      combinedDevMode: universalDevMode || actualIsDevMode,
      combinedShowPanel: showDevPanel || universalShowDevPanel
    });
  }, [isDevMode, contextIsDevMode, actualIsDevMode, universalDevMode, showDevPanel, universalShowDevPanel]);

  // Load video URLs from Firebase Storage
  useEffect(() => {
    const loadVideoUrls = async () => {
      try {
        const { getVideoUrl } = await import('@/services/videoService');
        
        const [basicsUrl, rtfUrl] = await Promise.all([
          getVideoUrl('Videos/6 Introduction to Basic Prompting.mp4'),
          getVideoUrl('Videos/7 Prompting Framework - RTF.mp4')
        ]);
        
        setVideoUrls({
          'basics': basicsUrl,
          'rtf-framework': rtfUrl
        });
        
        console.log('🎬 Prompting module video URLs loaded:', { basicsUrl, rtfUrl });
      } catch (error) {
        console.error('❌ Failed to load prompting module video URLs:', error);
      }
    };
    
    loadVideoUrls();
  }, []);

  // Track analytics events
  const trackEvent = (eventName: string, eventData?: any) => {
    console.log(`📊 Analytics Event: ${eventName}`, eventData);
    
    // If Google Analytics is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'Introduction to Prompting Module',
        ...eventData
      });
    }
  };

  // Auto-fill and keyboard shortcuts for developer mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const devMode = universalDevMode || actualIsDevMode;
      
      // Auto-fill with Ctrl+Alt+F
      if (devMode && e.ctrlKey && e.altKey && e.key === 'f') {
        e.preventDefault();
        setUserName('Developer User');
      }
      
      // Navigate with arrow keys when dev mode is active
      if (devMode) {
        if (e.key === 'ArrowRight' && !e.shiftKey) {
          e.preventDefault();
          if (currentActivity < activities.length - 1) {
            handleActivityComplete(activities[currentActivity].id);
          }
        } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
          e.preventDefault();
          if (currentActivity > 0) {
            setCurrentActivity(currentActivity - 1);
          }
        }
      }
      
      // Toggle dev panel with Ctrl+Alt+D
      if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        console.log('Toggle dev panel shortcut pressed in IntroductionToPromptingModule');
        if (!universalDevMode && !actualIsDevMode) {
          // Show the key prompt if not in dev mode
          setShowKeyPrompt(true);
        } else {
          // Toggle the dev panel if already in dev mode
          if (setUniversalShowDevPanel) {
            setUniversalShowDevPanel(!universalShowDevPanel);
          }
          if (setShowDevPanel) {
            setShowDevPanel(!showDevPanel);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [universalDevMode, actualIsDevMode, currentActivity, activities]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove any event listeners
      const handleDevSkip = () => {};
      const handleDevBack = () => {};
      
      window.removeEventListener('dev-skip-forward', handleDevSkip);
      window.removeEventListener('dev-skip-backward', handleDevBack);
      
      // Clear any timers
      const timers = (window as any).__introPromptingTimers;
      if (timers && Array.isArray(timers)) {
        timers.forEach(timer => clearTimeout(timer));
      }
      
      console.log('🧹 Cleaned up Introduction to Prompting module');
    };
  }, []);

  // Mark activity as complete
  const markActivityComplete = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, completed: true }
        : activity
    ));
    
    // Track activity completion
    trackEvent('activity_completed', { 
      activity: activityId,
      activity_index: currentActivity,
      time_spent: Date.now() - startTime
    });
  };

  // Handle activity navigation
  const handleNextActivity = () => {
    if (currentActivity < activities.length - 1) {
      setCurrentActivity(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleActivityComplete = (activityId: string) => {
    console.log(`📊 Completing activity: ${activityId}`);
    
    try {
      // Mark current activity as complete
      markActivityComplete(activityId);
      
      // Use the current activity index instead of finding by ID
      // This ensures proper sequential progression
      const nextIndex = currentActivity + 1;
      
      // Auto-advance to next activity if not the last one
      if (nextIndex < activities.length) {
        console.log(`🚀 Auto-advancing from activity ${currentActivity} (${activityId}) to ${nextIndex} (${activities[nextIndex].id})`);
        
        // Small delay to ensure state updates properly
        setTimeout(() => {
          setCurrentActivity(nextIndex);
          
          // Scroll to top for better UX
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Track progression
          trackEvent('activity_completed', {
            activity_id: activityId,
            current_index: currentActivity,
            next_activity: activities[nextIndex].id,
            next_index: nextIndex,
            module_progress: ((nextIndex + 1) / activities.length) * 100
          });
        }, 300);
      } else {
        // This was the last activity
        console.log(`🎉 Module completed! Activity: ${activityId}`);
        trackEvent('module_completed', {
          total_time: Date.now() - startTime,
          userName: userName,
          final_activity: activityId
        });
      }
    } catch (error) {
      console.error('Error in handleActivityComplete:', error);
    }
  };

  // Developer panel props - use universal dev mode utilities
  const developerPanelProps = {
    currentActivity,
    totalActivities: activities.length,
    activities,
    onJumpToActivity: (index: number) => {
      setCurrentActivity(index);
      // Mark previous activities as complete when jumping forward
      if (index > currentActivity) {
        setActivities(prev => prev.map((activity, i) => ({
          ...activity,
          completed: i < index ? true : activity.completed
        })));
      }
    },
    onCompleteAll: () => {
      setActivities(prev => prev.map(a => ({ ...a, completed: true })));
      setCurrentActivity(activities.length - 1);
    },
    onReset: () => {
      setActivities(ACTIVITIES);
      setCurrentActivity(0);
      setUserName('');
      setExitTicketResponses({});
      setHasCompletedExitTicket(false);
    },
    videoRef,
    onSkipVideo: () => {
      handleNextTask();
    },
    isDevMode: universalDevMode || actualIsDevMode
  };

  // Auto-fill exit ticket in dev mode
  useEffect(() => {
    if (actualIsDevMode && activities[currentActivity]?.id === 'exit-ticket') {
      setExitTicketResponses(DEV_RESPONSES.exitTicket);
    }
  }, [actualIsDevMode, currentActivity]);

  // Handle automatic progression from exit ticket to certificate
  useEffect(() => {
    // When exit ticket is completed, automatically move to certificate
    if (activities[currentActivity]?.id === 'exit-ticket' && hasCompletedExitTicket) {
      const certIndex = activities.findIndex(a => a.id === 'certificate');
      if (certIndex !== -1) {
        setCurrentActivity(certIndex);
      }
    }
  }, [hasCompletedExitTicket, currentActivity, activities]);

  const jumpToActivity = (index: number) => {
    setCurrentActivity(index);
  };

  const renderCurrentActivity = () => {
    const activity = activities[currentActivity];
    if (!activity) return null;

    switch (activity.id) {
      case 'welcome':
        return (
          <Card className="p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Welcome{userName ? `, ${userName}` : ''}!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Ready to Master AI Prompting?
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                  What You'll Learn
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Prompting Basics:</strong> Understanding what makes a good prompt and how to communicate effectively with AI</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>The RTF Framework:</strong> A proven structure for creating clear, effective prompts every time</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Hands-on Practice:</strong> Interactive activities to apply what you learn and build your skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Real-world Applications:</strong> How to use AI effectively in your classroom or workplace</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                  <Info className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>You'll watch short videos, practice with interactive activities, and receive a certificate upon completion.</span>
                </p>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => handleActivityComplete('welcome')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  Let's Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </Card>
        );

      case 'say-what-you-see':
        return <SayWhatYouSeeActivity
          onComplete={() => handleActivityComplete('say-what-you-see')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;

      case 'basics-video-part1':
        if (!videoUrls['basics']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">What is a Prompt?</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">What is a Prompt?</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['basics'] || BASICS_VIDEO_SEGMENTS.part1.source}
              segments={[BASICS_VIDEO_SEGMENTS.part1]}
              videoId="intro-prompting-basics-part1"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Part 1 completed, showing activity');
                handleActivityComplete('basics-video-part1');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
              initialVolume={0.8}
              initialMuted={false}
            />
          </Card>
        );

      case 'rate-vague-prompts':
        return (
          <Card className="p-6">
            <PromptQualityActivity 
              onComplete={() => handleActivityComplete('rate-vague-prompts')}
              isDevMode={universalDevMode || actualIsDevMode}
            />
          </Card>
        );

      case 'basics-video-part2':
        if (!videoUrls['basics']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Prompting Principles</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Prompting Principles</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Let's continue learning about effective prompting...
            </p>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['basics'] || BASICS_VIDEO_SEGMENTS.part2.source}
              segments={[BASICS_VIDEO_SEGMENTS.part2]}
              videoId="intro-prompting-basics-part2"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Basics video fully completed');
                handleActivityComplete('basics-video-part2');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
            />
          </Card>
        );
        
      case 'what-is-framework':
        return <WhatIsPromptingFramework 
          onComplete={() => handleActivityComplete('what-is-framework')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;
        
      case 'frameworks':
        return <PromptingFrameworks 
          onComplete={() => handleActivityComplete('frameworks')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;
        
      case 'rtf-video':
        if (!videoUrls['rtf-framework']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding RTF Framework</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Introduction to the RTF Framework</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['rtf-framework'] || RTF_VIDEO_SEGMENTS.intro.source}
              segments={[RTF_VIDEO_SEGMENTS.intro]} // Single intro segment
              videoId="rtf-framework"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ RTF intro segment completed:', segmentId);
                handleActivityComplete('rtf-video');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
            />
          </Card>
        );
        
      case 'role-video':
        if (!videoUrls['rtf-framework']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Role</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Role</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['rtf-framework'] || RTF_VIDEO_SEGMENTS.role.source}
              segments={[RTF_VIDEO_SEGMENTS.role]}
              videoId="rtf-framework-role"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Role video segment completed:', segmentId);
                handleActivityComplete('role-video');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
            />
          </Card>
        );
        
      case 'role-activity':
        return (
          <Card className="p-6">
            <RoleActivity 
              onComplete={() => handleActivityComplete('role-activity')}
            />
          </Card>
        );
        
      case 'task-video':
        if (!videoUrls['rtf-framework']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Task</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Task</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['rtf-framework'] || RTF_VIDEO_SEGMENTS.task.source}
              segments={[RTF_VIDEO_SEGMENTS.task]}
              videoId="rtf-framework-task"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Task video segment completed:', segmentId);
                handleActivityComplete('task-video');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
            />
          </Card>
        );
        
      case 'task-activity':
        return (
          <Card className="p-6">
            <TaskActivity 
              onComplete={() => handleActivityComplete('task-activity')}
            />
          </Card>
        );
        
        
      case 'format-video':
        if (!videoUrls['rtf-framework']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Format</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Format</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['rtf-framework'] || RTF_VIDEO_SEGMENTS.format.source}
              segments={[RTF_VIDEO_SEGMENTS.format]}
              videoId="rtf-framework-format"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Format video segment completed:', segmentId);
                handleActivityComplete('format-video');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
            />
          </Card>
        );
        
      case 'format-activity':
        return (
          <Card className="p-6">
            <FormatActivity 
              onComplete={() => handleActivityComplete('format-activity')}
            />
          </Card>
        );
        
      case 'format-transform':
        return <FormatTransformationActivity 
          onComplete={() => handleActivityComplete('format-transform')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;
        
        
      case 'rtf-builder':
        return <RTFOutputBuilder 
          onComplete={() => handleActivityComplete('rtf-builder')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;
        
      case 'conclusion-video':
        if (!videoUrls['basics']) {
          return (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Prompting Tips</h3>
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                </div>
              </div>
            </Card>
          );
        }
        return (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Prompting Tips</h3>
            <PremiumVideoPlayer
              videoRef={videoRef}
              videoUrl={videoUrls['basics'] || CONCLUSION_VIDEO_SEGMENT.source}
              segments={[CONCLUSION_VIDEO_SEGMENT]}
              videoId="prompt-basics"
              userId={userName || 'anonymous'}
              onSegmentComplete={(segmentId) => {
                console.log('✅ Conclusion segment completed:', segmentId);
                handleActivityComplete('conclusion-video');
              }}
              className="w-full"
              allowSeeking={false}
              enableSubtitles={true}
              autoPlay={true}
              initialMuted={false}
            />
          </Card>
        );
        
      case 'exit-ticket':
        return <PromptingExitTicket 
          onComplete={() => handleActivityComplete('exit-ticket')}
          isDevMode={universalDevMode || actualIsDevMode}
        />;

      case 'certificate':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Congratulations, {userName}!
              </h2>
              
              <Certificate
                userName={userName} // Use the stored userName
                courseName="Introduction to AI Prompting for Educators"
                completionDate={new Date().toLocaleDateString()}
              />
              
              {/* Add completion actions */}
              <div className="flex justify-center mt-8 space-x-4">
                <Button variant="outline" onClick={() => window.print()}>
                  Print Certificate
                </Button>
                <Button onClick={() => {
                  if (onComplete) onComplete();
                }}>
                  Complete Module
                </Button>
              </div>
            </motion.div>
          </div>
        );
        
      default:
        return <div>Activity not found</div>;
    }
  };

  return (
    <div className="introduction-to-prompting-module min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20" data-module="introduction-to-prompting">
      <div className="container mx-auto px-4 py-8">
        {/* Universal Developer Mode UI */}
        {showKeyPrompt && (
          <SecretKeyPrompt
            isOpen={showKeyPrompt}
            onSubmit={handleSecretKeySubmit}
            onCancel={() => setShowKeyPrompt(false)}
          />
        )}
        
        {/* Developer Panel */}
        {(showDevPanel || universalShowDevPanel) && (
          <DeveloperPanel
            {...developerPanelProps}
            onClose={() => {
              if (setShowDevPanel) setShowDevPanel(false);
            }}
          />
        )}

        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Introduction to AI Prompting for Educators
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Activity {currentActivity + 1} of {activities.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentActivity + 1) / activities.length) * 100}%` }}
            />
          </div>

          {/* Activity Title */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {activities[currentActivity]?.title}
          </h2>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivity}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentActivity()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Component stubs for the sections - these will be implemented in subsequent parts

const BasicsVideoSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  const handleVideoComplete = () => {
    setHasWatchedVideo(true);
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Understanding Prompting Basics</h3>
      <div className="mb-6">
        <PremiumVideoPlayer
          videoUrl="/videos/6_Introduction_to_Basic_Prompting.mp4"
          segments={[{
            id: 'prompt-basics',
            title: 'Introduction to Basic Prompting',
            start: 0,
            end: 100000,
            source: '/videos/6_Introduction_to_Basic_Prompting.mp4',
            description: 'Learn the fundamentals of effective AI prompting',
            mandatory: true
          }]}
          videoId="prompt-basics"
          onSegmentComplete={handleVideoComplete}
          onModuleComplete={handleVideoComplete}
          className="w-full"
          allowSeeking={true}
          enableSubtitles={true}
          autoPlay={true}
        />
      </div>
      <Button 
        onClick={onComplete} 
        className="w-full"
        disabled={!hasWatchedVideo}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      {!hasWatchedVideo && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Please watch the video to continue
        </p>
      )}
    </Card>
  );
};

// Placeholder components for other sections
// Component for fixing vague prompts activity
const VaguePromptFixer: React.FC<{
  prompts: typeof VAGUE_PROMPTS;
  onComplete: () => void;
  isDevMode: boolean;
}> = ({ prompts, onComplete, isDevMode }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const currentPrompt = prompts[currentPromptIndex];

  // Auto-complete in dev mode
  useEffect(() => {
    if (isDevMode && currentPrompt) {
      const devIssues = DEV_RESPONSES.vaguePromptFixes[currentPrompt.id as keyof typeof DEV_RESPONSES.vaguePromptFixes];
      if (devIssues) {
        setSelectedIssues(devIssues);
        setShowFeedback(true);
      }
    }
  }, [isDevMode, currentPromptIndex, currentPrompt]);

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleCheckAnswer = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setSelectedIssues([]);
      setShowFeedback(false);
    } else {
      setAllCompleted(true);
      setTrackedTimeout(onComplete, 1000);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Fix the Vague Prompt</h3>
      
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 border">
          <p className="text-lg font-mono text-gray-700 dark:text-gray-300">"{currentPrompt.prompt}"</p>
        </div>

        <p className="mb-3 text-gray-700 dark:text-gray-300">What's wrong with this prompt? Select all issues:</p>
        
        <div className="space-y-2 mb-4">
          {currentPrompt.issues.map((issue) => (
            <label key={issue} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-white/50 dark:hover:bg-gray-800/50">
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => handleIssueToggle(issue)}
                className="rounded text-blue-600"
                disabled={showFeedback}
              />
              <span className="text-gray-700 dark:text-gray-300">{issue}</span>
            </label>
          ))}
        </div>

        {!showFeedback && (
          <Button 
            onClick={handleCheckAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={selectedIssues.length === 0}
          >
            Check Answer
          </Button>
        )}

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-300 font-semibold mb-2">
                {selectedIssues.length === currentPrompt.issues.length ? 
                  "Perfect! You identified all the issues." : 
                  "Good effort! Here's the complete analysis:"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">This prompt lacks specificity in multiple areas.</p>
              
              <div className="bg-white dark:bg-gray-800 p-3 rounded border border-green-100 dark:border-green-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Improved version:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{currentPrompt.improved}</p>
              </div>
            </div>

            <Button 
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {currentPromptIndex < prompts.length - 1 ? 'Next Prompt' : 'Complete Activity'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {prompts.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded-full transition-colors ${
              index === currentPromptIndex ? 'bg-blue-600' : 
              index < currentPromptIndex ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

const FixPromptsSection: React.FC<{ fixes: Record<string, string[]>; onFixesChange: (fixes: Record<string, string[]>) => void; onComplete: () => void }> = ({ onComplete }) => (
  <VaguePromptFixer 
    prompts={VAGUE_PROMPTS} 
    onComplete={onComplete} 
    isDevMode={false} 
  />
);

// RTF Framework Introduction Section
const RTFIntroSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  const handleVideoComplete = () => {
    setHasWatchedVideo(true);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">The RTF Framework</h3>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Learn about the RTF framework - <strong>Role</strong>, <strong>Task</strong>, and <strong>Format</strong> - your guide to creating effective AI prompts.
        </p>

        {/* RTF Framework Video */}
        <div className="mb-6">
          <PremiumVideoPlayer
            videoUrl="/videos/7_Prompting_Framework_RTF.mp4"
            segments={[{
              id: 'rtf-framework',
              title: 'RTF Framework',
              start: 0,
              end: 100000,
              source: '/videos/7_Prompting_Framework_RTF.mp4',
              description: 'Master the Role, Task, Format framework for better prompts',
              mandatory: true
            }]}
            videoId="rtf-framework"
            onSegmentComplete={handleVideoComplete}
            onModuleComplete={handleVideoComplete}
            className="w-full"
            allowSeeking={true}
            enableSubtitles={true}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                R
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Role</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Who should the AI act as? Define the perspective, expertise, or persona.
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
              "Act as a 5th grade teacher..."
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                T
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Task</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              What specific action do you want performed? Be clear and detailed.
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 italic">
              "...create a lesson plan for fractions..."
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                F
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Format</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How should the response be structured? Specify the output format.
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
              "...as step-by-step instructions."
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-lg border">
          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Complete RTF Example:</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-white dark:bg-gray-800 p-3 rounded border">
            "Act as a 5th grade teacher and create a lesson plan for teaching fractions to students who are visual learners. Format the response as step-by-step instructions with time allocations."
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Button 
            onClick={onComplete}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            disabled={!hasWatchedVideo}
          >
            Try Building Your Own RTF Prompt
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
          {!hasWatchedVideo && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please watch the video to continue
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// RTF Prompt Builder for hands-on practice
const RTFPromptBuilder: React.FC<{
  onComplete: (prompt: string) => void;
  isDevMode: boolean;
}> = ({ onComplete, isDevMode }) => {
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customTask, setCustomTask] = useState('');
  const [customFormat, setCustomFormat] = useState('');

  // Auto-fill in dev mode
  useEffect(() => {
    if (isDevMode) {
      setRole(DEV_RESPONSES.rtfBuilder.role);
      setTask(DEV_RESPONSES.rtfBuilder.task);
      setFormat(DEV_RESPONSES.rtfBuilder.format);
    }
  }, [isDevMode]);

  const getFullPrompt = () => {
    const finalRole = role === 'Custom' ? customRole : role;
    const finalTask = task === 'Custom' ? customTask : task;
    const finalFormat = format === 'Custom' ? customFormat : format;

    if (!finalRole || !finalTask || !finalFormat) return '';

    return `Act as a ${finalRole} and ${finalTask}. Format the response as ${finalFormat}.`;
  };

  const handleComplete = () => {
    const prompt = getFullPrompt();
    if (prompt) {
      // Track RTF builder completion
      console.log('📊 Analytics Event: rtf_builder_completed', { 
        role: role === 'Custom' ? customRole : role,
        task: task === 'Custom' ? customTask : task,
        format: format === 'Custom' ? customFormat : format,
        prompt_length: prompt.length
      });
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'rtf_builder_completed', {
          event_category: 'Introduction to Prompting Module',
          role: role === 'Custom' ? customRole : role,
          task: task === 'Custom' ? customTask : task,
          format: format === 'Custom' ? customFormat : format,
          prompt_length: prompt.length
        });
      }
      
      onComplete(prompt);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Build Your RTF Prompt</h3>
      
      <div className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Role (Who should the AI act as?)
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              {ROLES.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
              <SelectItem value="Custom">Custom Role</SelectItem>
            </SelectContent>
          </Select>
          {role === 'Custom' && (
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Enter custom role..."
              className="mt-2 w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          )}
        </div>

        {/* Task Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Task (What do you want done?)
          </label>
          <Select value={task} onValueChange={setTask}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select a task..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              {TASKS.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
              <SelectItem value="Custom">Custom Task</SelectItem>
            </SelectContent>
          </Select>
          {task === 'Custom' && (
            <input
              type="text"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Enter custom task..."
              className="mt-2 w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          )}
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Format (How should it be structured?)
          </label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select a format..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              {FORMATS.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
              <SelectItem value="Custom">Custom Format</SelectItem>
            </SelectContent>
          </Select>
          {format === 'Custom' && (
            <input
              type="text"
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              placeholder="Enter custom format..."
              className="mt-2 w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          )}
        </div>

        {/* Preview */}
        {getFullPrompt() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Complete Prompt:</p>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{getFullPrompt()}</p>
          </motion.div>
        )}

        <Button 
          onClick={handleComplete}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!getFullPrompt()}
        >
          Complete RTF Builder
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};



// AI-powered prompt quality analyzer
const PromptQualityAnalyzer: React.FC<{
  prompt: string;
  onComplete: () => void;
  isDevMode: boolean;
}> = ({ prompt, onComplete, isDevMode }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzePrompt();
  }, [prompt]);

  const analyzePrompt = async () => {
    if (isDevMode) {
      // Instant dev mode response
      setTrackedTimeout(() => {
        setAnalysis({
          score: 95,
          strengths: [
            'Clear role definition',
            'Specific task description',
            'Well-defined format'
          ],
          improvements: [
            'Consider adding more context about the target audience',
            'You could specify the desired length or scope'
          ],
          overallFeedback: 'Excellent prompt! You\'ve mastered the RTF framework.'
        });
      }, 100);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          rubric: {
            hasRole: 'Does the prompt specify who the AI should act as?',
            hasTask: 'Does the prompt clearly state what needs to be done?',
            hasFormat: 'Does the prompt specify how the output should be structured?',
            isSpecific: 'Is the prompt specific enough to produce useful results?',
            hasContext: 'Does the prompt provide necessary context?'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze prompt');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing prompt:', err);
      setError('Unable to analyze prompt. Please try again.');
      // Fallback analysis
      setAnalysis({
        score: 75,
        strengths: ['Good attempt at structuring your prompt'],
        improvements: ['Try to be more specific about your requirements'],
        overallFeedback: 'Keep practicing with the RTF framework!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your prompt...</p>
        </div>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
        <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
        AI Prompt Analysis
      </h3>

      {/* Score Display */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-lg">
          <span className="text-3xl font-bold text-blue-600">{analysis.score}%</span>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Prompt Quality Score</p>
      </div>

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Strengths:</h4>
          <ul className="space-y-1">
            {analysis.strengths.map((strength: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {analysis.improvements && analysis.improvements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Areas for Improvement:</h4>
          <ul className="space-y-1">
            {analysis.improvements.map((improvement: string, index: number) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Feedback */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 border">
        <p className="text-gray-800 dark:text-gray-200">{analysis.overallFeedback}</p>
      </div>

      <Button 
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
};

// RTF Examples with Quality Analysis
const RTFExamplesSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>('');
  
  const examples = [
    {
      title: 'Lesson Planning',
      prompt: 'Act as a 4th grade teacher and create a 45-minute lesson plan for teaching multiplication tables to visual learners. Format as step-by-step instructions with timing.',
      category: 'Strong Example'
    },
    {
      title: 'Parent Communication',
      prompt: 'Act as an elementary school teacher and write a friendly email to parents about upcoming parent-teacher conferences. Format as a formal email with clear next steps.',
      category: 'Strong Example'
    },
    {
      title: 'Assessment Creation',
      prompt: 'Act as a high school biology teacher and develop 10 multiple-choice questions about photosynthesis for a unit test. Format as numbered questions with answer choices.',
      category: 'Strong Example'
    }
  ];

  const handleAnalyzeExample = (prompt: string) => {
    setSelectedExample(prompt);
    setShowAnalysis(true);
  };

  if (showAnalysis && selectedExample) {
    return (
      <PromptQualityAnalyzer
        prompt={selectedExample}
        onComplete={() => {
          setShowAnalysis(false);
          setSelectedExample('');
          onComplete();
        }}
        isDevMode={false}
      />
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">RTF Examples in Action</h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Here are examples of well-crafted prompts using the RTF framework. Click "Analyze" to see how AI evaluates each prompt's quality.
      </p>

      <div className="space-y-4">
        {examples.map((example, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">{example.title}</h4>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                {example.category}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded mb-3 border">
              "{example.prompt}"
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                Clear Role
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded">
                Specific Task
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                Defined Format
              </span>
            </div>

            <Button 
              onClick={() => handleAnalyzeExample(example.prompt)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Zap className="mr-2 h-4 w-4" />
              Analyze This Prompt
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Key Takeaway:</h5>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Notice how each example follows the RTF pattern: <strong>Role</strong> (who the AI should be), 
          <strong>Task</strong> (what to create), and <strong>Format</strong> (how to structure the output). 
          This consistency leads to better, more useful AI responses.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Button 
          onClick={onComplete}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
        >
          Ready for the Challenge
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const RTFChallengeSection: React.FC<{ 
  prompt: string; 
  onPromptChange: (prompt: string) => void; 
  onComplete: () => void 
}> = ({ prompt, onPromptChange, onComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState(RTF_CHALLENGE_SCENARIOS[0]);
  const [validation, setValidation] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const handleScenarioChange = (scenarioId: string) => {
    const scenario = RTF_CHALLENGE_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setValidation(null);
      setHasSubmitted(false);
      onPromptChange(''); // Clear prompt when scenario changes
    }
  };

  const handleValidatePrompt = async () => {
    if (!prompt.trim()) return;

    setIsValidating(true);
    setHasSubmitted(true);

    try {
      const response = await fetch('/api/gemini/validate-rtf-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          scenario: selectedScenario.context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to validate prompt');
      }

      const data = await response.json();
      setValidation(data);
      
      // Track prompt validation
      console.log('📊 Analytics Event: prompt_analyzed', { 
        score: data.score, 
        scenario: selectedScenario.id,
        has_role: data.hasRole,
        has_task: data.hasTask,
        has_format: data.hasFormat
      });
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'prompt_analyzed', {
          event_category: 'Introduction to Prompting Module',
          score: data.score,
          scenario: selectedScenario.id,
          has_role: data.hasRole,
          has_task: data.hasTask,
          has_format: data.hasFormat
        });
      }
    } catch (err) {
      console.error('Error validating prompt:', err);
      // Fallback validation
      setValidation({
        hasRole: true,
        hasTask: true,
        hasFormat: true,
        isRelevant: true,
        score: 80,
        feedback: 'Good attempt at using the RTF framework! Continue practicing.',
        missingElements: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleTryAgain = () => {
    setValidation(null);
    setHasSubmitted(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-orange-600 mr-2" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">RTF Challenge</h3>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Test your RTF skills! Choose a teaching scenario and write a prompt using the Role, Task, Format framework.
      </p>

      {/* Scenario Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Choose Your Challenge:
        </label>
        <Select value={selectedScenario.id} onValueChange={handleScenarioChange}>
          <SelectTrigger className="bg-white dark:bg-gray-800 dark:border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
            {RTF_CHALLENGE_SCENARIOS.map(scenario => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Scenario Details */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedScenario.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedScenario.description}</p>
        <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded border-l-4 border-orange-400">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Scenario:</p>
          <p className="text-sm text-orange-700 dark:text-orange-300">{selectedScenario.context}</p>
        </div>
      </div>

      {/* Helpful Hints */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6">
        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          Hints for Success:
        </h5>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          {selectedScenario.hints.map((hint: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              {hint}
            </li>
          ))}
        </ul>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your RTF Prompt:
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={`Write your prompt here using the RTF framework...\n\nExample: ${selectedScenario.examplePrompt}`}
          className="min-h-[120px] bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          disabled={hasSubmitted && !validation}
        />
      </div>

      {/* Validation Results */}
      {validation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-900 dark:text-white">Validation Results</h5>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              validation.score >= 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : validation.score >= 60
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              <Trophy className="h-4 w-4 mr-1" />
              Score: {validation.score}%
            </div>
          </div>

          {/* RTF Component Check */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${validation.hasRole ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
              <div className="flex items-center">
                {validation.hasRole ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={`text-sm font-medium ${validation.hasRole ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  Role
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${validation.hasTask ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
              <div className="flex items-center">
                {validation.hasTask ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={`text-sm font-medium ${validation.hasTask ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  Task
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${validation.hasFormat ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
              <div className="flex items-center">
                {validation.hasFormat ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={`text-sm font-medium ${validation.hasFormat ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  Format
                </span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-400">
            <p className="text-sm text-gray-700 dark:text-gray-300">{validation.feedback}</p>
          </div>

          {/* Missing Elements */}
          {validation.missingElements && validation.missingElements.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded border-l-4 border-yellow-400">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Areas for Improvement:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300">
                {validation.missingElements.map((element: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {element}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!hasSubmitted ? (
          <Button 
            onClick={handleValidatePrompt}
            disabled={!prompt.trim() || isValidating}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isValidating ? 'Validating...' : 'Validate My Prompt'}
            <Target className="ml-2 h-4 w-4" />
          </Button>
        ) : validation ? (
          <>
            {validation.score >= 70 ? (
              <Button 
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to Next Section
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleTryAgain}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Try Another Prompt
                <Target className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        ) : null}
      </div>
    </Card>
  );
};

const AdvancedTipsSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <Card className="p-6">
    <h3 className="text-2xl font-bold mb-4">Advanced Prompting Tips</h3>
    <p className="mb-4">Tips will be implemented in next part</p>
    <Button onClick={onComplete}>Continue</Button>
  </Card>
);

// Interactive prompt workshop with AI critique
const PromptWorkshop: React.FC<{
  onComplete: () => void;
  isDevMode: boolean;
}> = ({ onComplete, isDevMode }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [critique, setCritique] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isRevising, setIsRevising] = useState(false);

  // Auto-fill in dev mode
  useEffect(() => {
    if (isDevMode && !hasSubmitted) {
      setUserPrompt(DEV_RESPONSES.workshopPrompt);
      // Auto-submit after short delay
      setTrackedTimeout(() => handleSubmit(), 500);
    }
  }, [isDevMode]);

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setHasSubmitted(true);

    // Track workshop prompt submission
    console.log('📊 Analytics Event: workshop_prompt_submitted', { 
      revised: isRevising,
      prompt_length: userPrompt.length
    });
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'workshop_prompt_submitted', {
        event_category: 'Introduction to Prompting Module',
        revised: isRevising,
        prompt_length: userPrompt.length
      });
    }

    try {
      const response = await fetch('/api/gemini/critique-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          context: 'Educational prompt for K-12 teaching'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get critique');
      }

      const data = await response.json();
      setCritique(data);
    } catch (err) {
      console.error('Error getting critique:', err);
      // Fallback critique
      setCritique({
        strengths: ['Good attempt at creating an educational prompt'],
        suggestions: [
          'Consider adding more specific details about your teaching context',
          'Try using the RTF framework more explicitly'
        ],
        improvedVersion: `Act as a [specific role] and [specific task]. Include [specific requirements]. Format as [specific structure].`,
        encouragement: 'You\'re on the right track! Keep practicing with the RTF framework.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevise = () => {
    setIsRevising(true);
    setCritique(null);
    setHasSubmitted(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Prompt Workshop</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Write a prompt for something you need in your classroom. Our AI will provide constructive feedback!
      </p>

      {!hasSubmitted || isRevising ? (
        <div className="space-y-4">
          <Textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Example: Act as a middle school science teacher and create a hands-on experiment about ecosystems..."
            className="min-h-[120px] bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Remember to include:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Role - Who should the AI act as?</li>
              <li>Task - What do you want done?</li>
              <li>Format - How should it be structured?</li>
            </ul>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!userPrompt.trim() || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Critique'}
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          {critique && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Display submitted prompt */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Prompt:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userPrompt}</p>
              </div>

              {/* Strengths */}
              {critique.strengths && critique.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">What Works Well:</h4>
                  <ul className="space-y-1">
                    {critique.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {critique.suggestions && critique.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Suggestions:</h4>
                  <ul className="space-y-1">
                    {critique.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improved Version */}
              {critique.improvedVersion && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Example Improvement:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{critique.improvedVersion}</p>
                </div>
              )}

              {/* Encouragement */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-300">{critique.encouragement}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleRevise}
                  variant="outline"
                  className="flex-1"
                >
                  Revise Prompt
                </Button>
                <Button 
                  onClick={onComplete}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Workshop
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Card>
  );
};

// NEW REFACTORED COMPONENT SECTIONS



// RTF Video Introduction Section
const RTFVideoIntroSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  const handleVideoComplete = () => {
    setHasWatchedVideo(true);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">The RTF Framework Introduction</h3>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Watch this introduction to the RTF framework and learn the foundation of structured AI prompting.
        </p>

        <PremiumVideoPlayer
          videoUrl="/videos/7_Prompting_Framework_RTF.mp4"
          segments={[{
            id: RTF_VIDEO_SEGMENTS.intro.id,
            title: RTF_VIDEO_SEGMENTS.intro.title,
            start: RTF_VIDEO_SEGMENTS.intro.start,
            end: RTF_VIDEO_SEGMENTS.intro.end,
            source: '/videos/7_Prompting_Framework_RTF.mp4',
            description: 'Learn the basics of the RTF framework',
            mandatory: true
          }]}
          videoId="rtf-intro"
          onSegmentComplete={handleVideoComplete}
          onModuleComplete={handleVideoComplete}
          className="w-full"
          allowSeeking={true}
          enableSubtitles={true}
          autoPlay={true}
        />

        {hasWatchedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button 
              onClick={onComplete}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Continue to Role
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

// Conclusion Video Section
const ConclusionVideoSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  const handleVideoComplete = () => {
    setHasWatchedVideo(true);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Advanced Prompting Tips</h3>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Watch these final tips to take your AI prompting skills to the next level.
        </p>

        <PremiumVideoPlayer
          videoUrl="/videos/6_Introduction_to_Basic_Prompting.mp4"
          segments={[{
            id: CONCLUSION_VIDEO_SEGMENT.id,
            title: CONCLUSION_VIDEO_SEGMENT.title,
            start: CONCLUSION_VIDEO_SEGMENT.start,
            end: CONCLUSION_VIDEO_SEGMENT.end,
            source: '/videos/6_Introduction_to_Basic_Prompting.mp4',
            description: 'Advanced tips for better AI prompting',
            mandatory: true
          }]}
          videoId="conclusion-tips"
          onSegmentComplete={handleVideoComplete}
          onModuleComplete={handleVideoComplete}
          className="w-full"
          allowSeeking={true}
          enableSubtitles={true}
          autoPlay={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Key Takeaways</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Use the RTF framework consistently for better results</li>
            <li>• Be specific about your role, task, and desired format</li>
            <li>• Experiment and iterate to improve your prompts</li>
            <li>• Keep practicing with real teaching scenarios</li>
          </ul>
        </div>

        {hasWatchedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button 
              onClick={onComplete}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Complete Module
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

const IntroductionToPromptingModuleWithErrorBoundary: React.FC<IntroductionToPromptingModuleProps> = (props) => (
  <IntroPromptingErrorBoundary>
    <IntroductionToPromptingModule {...props} />
  </IntroPromptingErrorBoundary>
);

export default IntroductionToPromptingModuleWithErrorBoundary;