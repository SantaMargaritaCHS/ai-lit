import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowRight, Clock, Target, Play, BookOpen, MessageCircle, Brain, Calendar, Trophy, Zap, Lightbulb, Smartphone, Home, Globe, Car } from 'lucide-react';
// Developer mode is now handled by the UniversalDevModeProvider
import { useReflectionNavigation, ReflectionActivity } from '@/hooks/useReflectionNavigation';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { useDevMode } from '@/context/DevModeContext';
import './WhatIsAIModule.css';
import { getAILiteracyFeedback, getReflectionPrompt } from '@/services/aiLiteracyBot';
import PremiumVideoPlayer from '@/components/PremiumVideoPlayer';
import { SegmentedVideoPlayer } from '@/components/SegmentedVideoPlayer';
import { ExitTicket } from '@/components/ExitTicket';
import { Certificate } from '@/components/Certificate';
import { getVideoUrl } from '@/services/videoService';
import { videoAnalyticsRedesign, initializeRedesignAnalytics, redesignedVideoSegments } from '@/services/videoAnalyticsRedesign';
import { EnhancedHistoryVideo } from '@/components/WhatIsAIModule/EnhancedHistoryVideo';
import { GuessAIAge } from '@/components/WhatIsAIModule/GuessAIAge';
import { AIThenVsNow } from '@/components/WhatIsAIModule/AIThenVsNowFixed';
import { GenerativeAITransition } from './GenerativeAITransition';
import { SimpleGuessAge } from './SimpleGuessAge';
import WhatAIIsNotActivity from './WhatAIIsNotActivity';
import { ImmersiveAITimeline } from './ImmersiveAITimeline';

interface CompactWhatIsAIModuleProps {
  onComplete: () => void;
  userName?: string;
}

interface AIAgeGuessActivity {
  title: string;
  description: string;
  options: Array<{
    label: string;
    value: number;
    feedback: string;
  }>;
  revealText: string;
}

interface ActivityState {
  id: string;
  title: string;
  completed: boolean;
}

const aiAgeGuessActivity: AIAgeGuessActivity = {
  title: "How Long Has AI Been Around?",
  description: "Before we dive into history, take a guess!",
  options: [
    { label: "Less than 10 years", value: 10, feedback: "AI might seem new because of ChatGPT, but it's much older!" },
    { label: "About 20-30 years", value: 25, feedback: "Getting warmer! But AI goes back even further." },
    { label: "Around 50 years", value: 50, feedback: "Close! AI research began in the 1950s, over 70 years ago!" },
    { label: "More than 70 years", value: 70, feedback: "Exactly right! AI research started in the 1950s." }
  ],
  revealText: "Surprised? Let's explore AI's fascinating 70+ year journey..."
};

// Direct Firebase URLs for fast loading (bypassing getDownloadURL API calls)
const DIRECT_VIDEO_URLS = {
  'Videos/1 Introduction to Artificial Intelligence.mp4': 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F1%20Introduction%20to%20Artificial%20Intelligence.mp4?alt=media&token=52c11993-7b1f-4fa5-b2a0-b6fa5b6ba857',
  'Videos/History of AI.mp4': 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FHistory%20of%20AI.mp4?alt=media&token=b5e0bc96-2f7f-4850-9cce-b6b2e5d9a6a0'
};

// Restored video segments with proper interactive pauses
const videoSegments = [
  {
    id: 'intro-segment-1',
    title: 'Introduction to AI',
    videoPath: 'Videos/1 Introduction to Artificial Intelligence.mp4',
    startTime: 0,
    endTime: 82, // Continue through to "Guess My Age" section
    pausePoints: [{
      timestamp: 59,
      type: 'reflection',
      question: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today? Share your examples.",
      promptType: 'daily-ai'
    }]
  },
  {
    id: 'history-full',
    title: 'History of AI',
    videoPath: 'Videos/History of AI.mp4',
    startTime: 0,
    endTime: -1, // Full video
    pausePoints: [
      {
        timestamp: 95,
        type: 'comprehension',
        question: "What was the Turing Test designed to evaluate?",
        options: [
          "A computer's processing speed",
          "A machine's ability to exhibit intelligent behavior",
          "The first AI programming language",
          "Computer memory capacity"
        ],
        correctAnswer: 1,
        explanation: "The Turing Test evaluates whether a machine can exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human."
      },
      {
        timestamp: 150,
        type: 'comprehension', 
        question: "What caused the 'AI Winter' periods?",
        options: [
          "Lack of funding and overpromised results",
          "Too much government regulation",
          "Computers became too expensive",
          "Scientists lost interest in AI"
        ],
        correctAnswer: 0,
        explanation: "AI Winters occurred when funding dried up due to overpromised results that couldn't be delivered with the technology of the time."
      },
      {
        timestamp: 220,
        type: 'comprehension',
        question: "What breakthrough helped launch the modern AI era?",
        options: [
          "Faster internet speeds",
          "Deep learning and neural networks",
          "Better programming languages", 
          "Cheaper computer hardware"
        ],
        correctAnswer: 1,
        explanation: "Deep learning and advanced neural networks, combined with big data and computational power, launched the current AI revolution."
      }
    ]
  },
  {
    id: 'intro-segment-3',
    title: 'Closing Concepts',
    videoPath: 'Videos/1 Introduction to Artificial Intelligence.mp4',
    startTime: 142,
    endTime: -1,
    pausePoints: []
  }
];

// Video segment definitions for the redesigned segmented player
const introVideoSegments = [
  {
    id: 'intro-reflection',
    startTime: 0,
    endTime: 59,
    title: 'AI in Your Daily Life',
    description: 'How AI is already part of your routine',
    reflection: {
      question: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today? Share your examples.",
      aiPrompt: "Analyze the user's AI interaction examples and provide encouraging feedback about their awareness of AI in daily life. Help them recognize AI patterns they might have missed."
    }
  },
  {
    id: 'what-is-ai',
    startTime: 60,
    endTime: 82, // 1:22
    title: 'What Exactly is AI?',
    description: 'Brief introduction to the concept'
  },
  {
    id: 'closing-segment',
    startTime: 142, // 2:22
    endTime: 164, // End of video
    title: 'Wrapping Up',
    description: 'Key takeaways about AI'
  }
];

export default function CompactWhatIsAIModule({ 
  onComplete, 
  userName = '' 
}: CompactWhatIsAIModuleProps) {
  // Use passed userName directly
  const [userNameState] = useState(userName);
  
  // Essential refs and state that need to be defined early
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Activity flow state - RESTORED to original structure
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities, setActivities] = useState<(ActivityState & Partial<ReflectionActivity>)[]>([
    { id: 'welcome', title: 'Welcome', completed: false },
    { id: 'ai-quiz', title: 'AI or Not Quiz', completed: false },
    { 
      id: 'video-intro', 
      title: 'Introduction Video', 
      completed: false,
      type: 'video-with-reflection',
      reflectionPoints: [
        {
          timestamp: 59,
          question: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today? Share your examples.",
          id: 'daily-ai-reflection',
          aiPrompt: "Analyze the user's AI interaction examples and provide encouraging feedback about their awareness of AI in daily life."
        }
      ]
    },
    { id: 'guess-age', title: "Guess My Age", completed: false },
    { id: 'history-video', title: 'History of AI Video', completed: false },
    { 
      id: 'ai-evolution', 
      title: 'Journey to Generative AI', 
      completed: false
    },
    { id: 'genai-transition', title: 'Discovering Generative AI', completed: false },
    { id: 'closing-video', title: 'Closing Video', completed: false },
    {
      id: 'what-ai-is-not',
      title: 'What AI is NOT',
      completed: false
    },
    { id: 'exit-ticket', title: 'Exit Ticket', completed: false },
    { id: 'certificate', title: 'Certificate', completed: false }
  ]);
  
  // Activity-specific states (needed for hook callbacks)
  const [reflectionResponses, setReflectionResponses] = useState<Record<string, string>>({});
  const [aiReflectionFeedback, setAiReflectionFeedback] = useState<Record<string, string>>({});
  const [selectedAgeGuess, setSelectedAgeGuess] = useState<number | null>(null);
  const [showAgeReveal, setShowAgeReveal] = useState(false);
  const [exitTicketResponse, setExitTicketResponse] = useState('');
  const [exitTicketFeedback, setExitTicketFeedback] = useState('');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentVideoSegment, setCurrentVideoSegment] = useState(0);
  const [segmentReflections, setSegmentReflections] = useState<Record<string, string>>({});
  const [showAgeGuessActivity, setShowAgeGuessActivity] = useState(false);
  
  // Activity Registry for dev mode
  const {
    currentActivity: registryCurrentActivity,
    registerActivity,
    setCurrentActivity: setRegistryCurrentActivity,
    markActivityCompleted,
    clearRegistry
  } = useActivityRegistry();

  // Dev mode context
  const { isDevModeActive } = useDevMode();
  
  // Reflection navigation
  const {
    reflectionState,
    handleEmbeddedReflection,
    initializeStandaloneReflection,
    answerStandaloneQuestion,
    nextQuestion,
    previousQuestion,
    skipToQuestion,
    completeStandaloneReflection,
    getReflectionProgress
  } = useReflectionNavigation();
  
  // Additional states not yet defined
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});

  // Debug: Check if userName is being passed
  useEffect(() => {
    console.log('🔍 WhatIsAI Module - userName received:', userName);
    console.log('🔍 WhatIsAI Module - userNameState:', userNameState);
    console.log('🔍 WhatIsAI Module - isDevModeActive:', isDevModeActive);
    if (!userName) {
      console.warn('⚠️ WhatIsAI Module - No userName provided! The module page should show name entry.');
    }
  }, [userName, userNameState, isDevModeActive]);

  const progressPercentage = ((currentActivity + 1) / activities.length) * 100;

  // Developer mode configurations for faster testing
  const waitTime = isDevModeActive ? 100 : 3000; // Reduced wait times in dev mode
  const devReflectionText = "I used voice assistant for setting alarms, got Netflix recommendations based on viewing history, and used GPS navigation with traffic predictions.";
  const devExitTicketResponse = "AI is like a smart computer system that can learn patterns from data to make predictions or help with tasks, similar to how humans learn from experience but much faster.";

  // Developer mode quiz auto-answers (correct answers for each question)
  const devQuizAnswers = {
    'search-engine': true,    // Google search IS AI
    'email-spam': true,       // Spam filtering IS AI  
    'recipe-recommendation': true, // Recipe suggestions ARE AI
    'smart-thermostat': true, // Smart thermostats ARE AI
    'calculator': false,      // Basic calculator is NOT AI
    'word-processor': false,  // Basic word processing is NOT AI
    'digital-clock': false,   // Digital clock is NOT AI
    'flashlight-app': false   // Flashlight app is NOT AI
  };

  // Load video URLs and initialize analytics - Using direct URLs for fast loading
  useEffect(() => {
    console.log('🚀 Using direct Firebase URLs for instant video loading');

    // Use direct URLs instead of slow Firebase API calls
    setVideoUrls(DIRECT_VIDEO_URLS);

    // Initialize the redesigned analytics system
    initializeRedesignAnalytics();
  }, []);

  // Register activities with the ActivityRegistry for dev mode
  useEffect(() => {
    // Clear previous activities when module mounts
    clearRegistry();

    // Register all activities
    activities.forEach((activity) => {
      registerActivity({
        id: activity.id,
        type: activity.id === 'certificate' ? 'certificate' :
              activity.id.includes('video') ? 'video' :
              activity.id === 'exit-ticket' ? 'reflection' :
              'interactive',
        title: activity.title,
        completed: activity.completed
      });
    });
  }, []); // Only run once on mount

  // Sync with dev mode navigation
  useEffect(() => {
    if (isDevModeActive && registryCurrentActivity) {
      const activityIndex = activities.findIndex(a => a.id === registryCurrentActivity.id);
      if (activityIndex >= 0 && activityIndex !== currentActivity) {
        console.log('🔧 DEV: Syncing activity from dev mode:', registryCurrentActivity.id);
        setCurrentActivity(activityIndex);
      }
    }
  }, [isDevModeActive, registryCurrentActivity, currentActivity, activities]);

  // Update ActivityRegistry when activity changes normally
  useEffect(() => {
    if (currentActivity >= 0 && currentActivity < activities.length) {
      const activity = activities[currentActivity];
      setRegistryCurrentActivity(activity.id);
    }
  }, [currentActivity, activities, setRegistryCurrentActivity]);

  // Developer mode auto-fill effects
  useEffect(() => {
    if (isDevModeActive) {
      // Auto-fill reflection responses based on current activity
      const currentActivityData = activities[currentActivity];
      
      if (currentActivityData?.id === 'video-intro') {
        // Auto-fill video reflection responses
        setReflectionResponses(prev => ({
          ...prev,
          'daily-ai-reflection': devReflectionText,
          'ai-definition-check': "AI is like a smart computer system that learns from data to recognize patterns and make decisions, similar to how humans learn but much faster and with more data."
        }));
      }
      
      if (currentActivityData?.id === 'exit-ticket') {
        // Auto-fill exit ticket response
        setExitTicketResponse(devExitTicketResponse);
      }
    }
  }, [currentActivity, isDevModeActive]);

  // Auto-start effect for closing video - moved outside switch case to fix React Hooks rules
  useEffect(() => {
    const currentActivityData = activities[currentActivity];
    const closingVideoUrl = videoUrls['Videos/1 Introduction to Artificial Intelligence.mp4'];
    
    if (currentActivityData?.id === 'closing-video' && closingVideoUrl) {
      console.log('🎬 Closing video activity started - preparing auto-play');
      // Small delay to ensure video element is ready
      const timer = setTimeout(() => {
        console.log('🎬 Attempting to auto-start closing video');
        // Try to find and start the video element
        const videoElements = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
        if (videoElements.length > 0) {
          const video = videoElements[0];
          video.play().then(() => {
            console.log('🎬 Closing video auto-play successful');
          }).catch((error) => {
            console.log('🎬 Auto-play blocked by browser, user interaction required:', error.message);
          });
        } else {
          console.log('🎬 No video elements found yet, video may still be loading');
        }
      }, 500); // Increased delay to ensure video is fully loaded
      return () => clearTimeout(timer);
    }
  }, [currentActivity, activities, videoUrls]);

  // Developer mode quiz auto-answer function
  const devAutoAnswerQuiz = () => {
    if (isDevModeActive && activities[currentActivity]?.id === 'ai-quiz') {
      const currentQ = aiOrNotQuestions[currentQuizQuestion];
      const correctAnswer = currentQ.isAI;
      
      // Auto-select correct answer
      setQuizAnswers(prev => ({ ...prev, [currentQ.id]: correctAnswer }));
      setShowQuizExplanation(true);
      setQuizScore(prev => prev + 1);
      
      // Auto-advance after reduced time
      setTimeout(() => {
        if (currentQuizQuestion < aiOrNotQuestions.length - 1) {
          setCurrentQuizQuestion(prev => prev + 1);
          setShowQuizExplanation(false);
        } else {
          // Auto-complete quiz
          setShowQuizResults(true);
        }
      }, waitTime);
    }
  };


  const markActivityComplete = (activityId: string) => {
    setActivities(prev => prev.map(activity =>
      activity.id === activityId
        ? { ...activity, completed: true }
        : activity
    ));
    // Also mark as completed in ActivityRegistry for dev mode
    markActivityCompleted(activityId);
  };

  const handleNextActivity = () => {
    const nextIndex = currentActivity + 1;
    
    if (nextIndex < activities.length) {
      setCurrentActivity(nextIndex);
      // Scroll to top when changing activities
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Module is complete
      onComplete();
    }
  };

  const handleReflectionSubmit = async (response: string, questionType: string) => {
    setIsLoadingAI(true);
    console.log('🤖 Calling Gemini API for reflection feedback:', { questionType, response: response.substring(0, 50) + '...' });
    
    try {
      const apiResponse = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: response,
          context: "Provide encouraging feedback on the student's reflection about AI concepts and learning."
        })
      });
      
      console.log('🌐 API Response status:', apiResponse.status);
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log('✅ Received API feedback:', data);
        const feedback = data.feedback || data.response || "Thank you for your thoughtful response!";
        setReflectionResponses(prev => ({ ...prev, [questionType]: response }));
        setAiReflectionFeedback(prev => ({ ...prev, [questionType]: feedback }));
      } else {
        const errorData = await apiResponse.text();
        console.error('❌ API Error:', apiResponse.status, errorData);
        throw new Error(`Gemini API request failed: ${apiResponse.status}`);
      }
    } catch (error) {
      console.error('🚨 Error getting AI feedback:', error);
      setAiReflectionFeedback(prev => ({ 
        ...prev, 
        [questionType]: 'Thank you for your thoughtful response! AI literacy is an important skill to develop.' 
      }));
    }
    setIsLoadingAI(false);
  };






  // AI or Not Quiz questions (simplified for compact design)
  const aiOrNotQuestions = [
    {
      id: '1',
      scenario: 'Smartphone Autocorrect - When your phone suggests words as you type',
      isAI: true,
      explanation: 'This IS AI! It learns from patterns in how people type and predicts what you\'re trying to say.'
    },
    {
      id: '2', 
      scenario: 'Calculator App - Basic calculator doing arithmetic (2+2=4)',
      isAI: false,
      explanation: 'This is NOT AI. It follows fixed mathematical rules programmed by humans. It doesn\'t learn or adapt.'
    },
    {
      id: '3',
      scenario: 'Netflix Recommendations - Movies suggested "Because you watched..."',
      isAI: true,
      explanation: 'This IS AI! It analyzes viewing patterns across millions of users to predict what you might enjoy.'
    },
    {
      id: '4',
      scenario: 'Digital Alarm Clock - Wakes you up at a set time each day',
      isAI: false,
      explanation: 'This is NOT AI. It\'s a simple timer following pre-programmed instructions.'
    },
    {
      id: '5',
      scenario: 'Google Translate - Converting text from English to Spanish',
      isAI: true,
      explanation: 'This IS AI! Modern translation uses neural networks trained on millions of text pairs.'
    }
  ];

  const renderCurrentActivity = () => {
    const activity = activities[currentActivity];
    
    if (!activity) {
      return <div>Loading...</div>;
    }

    switch (activity.id) {
      case 'welcome':
        return (
          <div className="section-content">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">What is AI?</h1>
              <p className="text-lg text-gray-600 mb-6">Interactive AI Literacy Module</p>
              
              {/* Activity Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-blue-900">What You'll Learn</h3>
                </div>
                
                <div className="grid gap-4 mb-4">
                  <div className="flex items-start">
                    <Target className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Identify AI in Daily Life</p>
                      <p className="text-sm text-blue-700">Discover the AI tools you already use every day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Understand AI vs. Not AI</p>
                      <p className="text-sm text-blue-700">Learn to distinguish real AI from regular computer programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Explore AI History</p>
                      <p className="text-sm text-blue-700">See how AI developed over 70+ years</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center pt-4 border-t border-blue-200">
                  <div className="flex items-center text-blue-700">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Certificate Available</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={handleNextActivity} className="w-full primary-button">
              Start Learning About AI <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'ai-quiz':
        return (
          <div className="section-content">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI or Not Quiz</h2>
              <p className="text-gray-600">Can you spot AI in these everyday scenarios?</p>
            </div>
            
            {currentQuizQuestion < aiOrNotQuestions.length ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {currentQuizQuestion + 1} of {aiOrNotQuestions.length}
                  </CardTitle>
                  <CardDescription>
                    {aiOrNotQuestions[currentQuizQuestion].scenario}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showQuizExplanation ? (
                    <div className="space-y-3">
                      {/* Developer Mode Auto-Answer Button */}
                      {isDevModeActive && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex gap-2">
                            <Button 
                              onClick={devAutoAnswerQuiz}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                              size="sm"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Auto-Answer Correctly
                            </Button>
                            <Button 
                              onClick={() => {
                                // Auto-complete entire quiz
                                setQuizScore(aiOrNotQuestions.length);
                                setShowQuizResults(true);
                                setCurrentQuizQuestion(aiOrNotQuestions.length);
                              }}
                              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
                              size="sm"
                            >
                              Skip Entire Quiz
                            </Button>
                          </div>
                          <p className="text-xs text-red-600 mt-1">Developer Mode: Testing shortcuts</p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleQuizAnswer(true)}
                        className="w-full"
                        variant="outline"
                      >
                        This IS AI
                      </Button>
                      <Button 
                        onClick={() => handleQuizAnswer(false)}
                        className="w-full"
                        variant="outline"
                      >
                        This is NOT AI
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${quizAnswers[aiOrNotQuestions[currentQuizQuestion].id] === aiOrNotQuestions[currentQuizQuestion].isAI ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {quizAnswers[aiOrNotQuestions[currentQuizQuestion].id] === aiOrNotQuestions[currentQuizQuestion].isAI ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-semibold">
                            {quizAnswers[aiOrNotQuestions[currentQuizQuestion].id] === aiOrNotQuestions[currentQuizQuestion].isAI ? 'Correct!' : 'Not quite!'}
                          </span>
                        </div>
                        <p className="text-sm">{aiOrNotQuestions[currentQuizQuestion].explanation}</p>
                      </div>
                      
                      <Button onClick={handleQuizNext} className="w-full">
                        {currentQuizQuestion < aiOrNotQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Quiz Complete!</h3>
                  <p className="text-lg text-blue-800">Score: {quizScore} out of {aiOrNotQuestions.length}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    {quizScore === aiOrNotQuestions.length ? "Perfect! You're already good at spotting AI!" :
                     quizScore >= aiOrNotQuestions.length * 0.6 ? "Great job! You understand AI basics well." :
                     "Good try! Let's learn more about AI together."}
                  </p>
                </div>
                <Button onClick={handleNextActivity} className="w-full">
                  Continue to Video <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case 'video-intro':
        const introVideoUrl = videoUrls['Videos/1 Introduction to Artificial Intelligence.mp4'];
        return (
          <div className="section-content">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Introduction to AI</h2>
              <p className="text-gray-600">Learn what AI is and how it's part of your daily life</p>
            </div>
            
            {introVideoUrl ? (
              <div className="video-container mb-6">
                <PremiumVideoPlayer
                  videoUrl={introVideoUrl}
                  segments={[
                    {
                      id: 'intro-complete',
                      title: 'Introduction Video',
                      source: 'Videos/1 Introduction to Artificial Intelligence.mp4',
                      start: 0,
                      end: 82, // Continue through "Guess My Age" section
                      mandatory: true,
                      description: 'Complete introduction including Guess My Age'
                    }
                  ]}
                  videoId="intro-ai-complete"
                  onSegmentComplete={(segmentId: string) => {
                    console.log('🎬 Introduction Video segment completed:', segmentId);
                    console.log('🎬 Current activity completed status:', activities[currentActivity].completed);
                    
                    // Mark current activity as complete and advance
                    markActivityComplete('video-intro');
                    
                    // Auto-advance to "Guess My Age" activity
                    setTimeout(() => {
                      console.log('🎬 Auto-advancing to Guess My Age activity');
                      handleNextActivity();
                    }, 500);
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={isDevModeActive} // Enable seeking in developer mode
                  videoRef={videoRef}
                  interactivePauses={[
                    {
                      id: 'daily-ai-reflection',
                      timestamp: 59,
                      type: 'reflection',
                      title: 'Daily AI Reflection',
                      content: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today?",
                      activity: {
                        type: 'reflection',
                        id: 'daily-ai-reflection',
                        title: 'AI in Your Daily Life',
                        prompt: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today? Share your examples.",
                        guidingQuestions: [
                          "What apps did you use on your phone today?",
                          "Did you search for anything online?",
                          "Have you watched any videos or listened to music?",
                          "Did you use voice commands or get recommendations?"
                        ],
                        minResponseLength: 50,
                        aiGenerated: true
                      }
                    }
                  ]}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading video...</p>
              </div>
            )}
          </div>
        );

      case 'guess-age':
        return (
          <div className="section-content">
            <SimpleGuessAge 
              onComplete={() => {
                markActivityComplete('guess-age');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'history-video':
        const historyVideoUrl = videoUrls['Videos/History of AI.mp4'];
        const historySegment = videoSegments.find(seg => seg.id === 'history-full');
        
        return (
          <div className="section-content">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">History of AI</h2>
              <p className="text-gray-600">Journey through 70+ years of AI development</p>
            </div>
            
            {historyVideoUrl && historySegment ? (
              <div className="video-container mb-6">
                <PremiumVideoPlayer
                  videoUrl={historyVideoUrl}
                  segments={[{
                    id: 'segment-1',
                    title: 'History of AI',
                    source: 'Videos/History of AI.mp4',
                    start: 0,
                    end: -1, // Full video
                    mandatory: true,
                    description: 'Complete history of artificial intelligence'
                  }]}
                  videoId="history-ai-complete"
                  interactivePauses={historySegment.pausePoints.map((pause, index) => ({
                    id: `history-pause-${pause.timestamp}`,
                    timestamp: pause.timestamp,
                    type: 'question' as const,
                    title: pause.question,
                    content: pause.question,
                    activity: {
                      type: 'quiz' as const,
                      id: `history-quiz-${pause.timestamp}`,
                      title: pause.question,
                      question: pause.question,
                      allowMultiple: false,
                      options: ((pause as any).options || []).map((optionText: string, optIndex: number) => ({
                        id: `option-${index}-${optIndex}`,
                        text: optionText,
                        isCorrect: optIndex === (pause as any).correctAnswer
                      })),
                      explanation: (pause as any).explanation || "Thank you for your answer!"
                    }
                  }))}
                  onSegmentComplete={() => {
                    markActivityComplete('history-video');
                    handleNextActivity();
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={isDevModeActive} // Enable seeking in developer mode
                  videoRef={videoRef}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading history video...</p>
              </div>
            )}
          </div>
        );

      case 'ai-reflection-standalone':
        const currentActivityData = activities[currentActivity];
        if ('isStandaloneReflection' in currentActivityData && currentActivityData.isStandaloneReflection && 'questions' in currentActivityData && currentActivityData.questions) {
          // Initialize standalone reflection if not already done
          if (!reflectionState.currentReflectionId) {
            initializeStandaloneReflection(currentActivityData.id, currentActivityData.questions);
          }
          
          const progress = getReflectionProgress();
          const currentQuestion = currentActivityData.questions[reflectionState.currentQuestionIndex];
          
          return (
            <div className="section-content">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentActivityData.title}</h2>
                <p className="text-gray-600">Reflect on your AI learning journey</p>
                {progress && (
                  <div className="mt-4">
                    <Progress value={progress.progressPercentage} className="w-full max-w-md mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">
                      Question {progress.currentQuestion} of {progress.totalQuestions}
                    </p>
                  </div>
                )}
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Question {reflectionState.currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700 mb-6">{currentQuestion}</p>
                    
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      placeholder="Share your thoughts..."
                      value={reflectionState.responses[reflectionState.currentQuestionIndex] || ''}
                      onChange={(e) => answerStandaloneQuestion(reflectionState.currentQuestionIndex, e.target.value)}
                    />
                    
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={reflectionState.currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      
                      {isDevModeActive && (
                        <div className="flex gap-2">
                          {currentActivityData.questions.map((_: string, index: number) => (
                            <Button
                              key={index}
                              variant={index === reflectionState.currentQuestionIndex ? "default" : "outline"}
                              size="sm"
                              onClick={() => skipToQuestion(index)}
                            >
                              {index + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {reflectionState.currentQuestionIndex < currentActivityData.questions.length - 1 ? (
                        <Button
                          onClick={nextQuestion}
                          disabled={!reflectionState.responses[reflectionState.currentQuestionIndex]?.trim()}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            completeStandaloneReflection(() => {
                              markActivityComplete(currentActivityData.id);
                              handleNextActivity();
                            });
                          }}
                          disabled={!reflectionState.responses[reflectionState.currentQuestionIndex]?.trim()}
                        >
                          Complete Reflection
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        }
        return null;

      case 'closing-video':
        const closingVideoUrl = videoUrls['Videos/1 Introduction to Artificial Intelligence.mp4'];
        
        // Debug logging for video loading verification
        console.log('🎬 Closing video URL (direct):', closingVideoUrl);
        console.log('📊 All video URLs loaded:', Object.keys(videoUrls).length, 'videos');
        

        
        return (
          <div className="section-content">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Takeaways</h2>
              <p className="text-gray-600">Final thoughts on understanding AI</p>
            </div>
            
            {closingVideoUrl ? (
              <div className="video-container mb-6">
                <PremiumVideoPlayer
                  videoUrl={closingVideoUrl}
                  segments={[{
                    id: 'closing-segment',
                    title: 'Wrapping Up',
                    source: 'Videos/1 Introduction to Artificial Intelligence.mp4',
                    start: 121,
                    end: 216,
                    mandatory: true,
                    description: 'Key takeaways about AI'
                  }]}
                  videoId="intro-ai-closing"
                  onSegmentComplete={() => {
                    markActivityComplete('closing-video');
                    handleNextActivity();
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={true} // Always allow seeking for closing video
                  videoRef={videoRef}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading closing video...</p>
                <p className="text-xs text-gray-400 mt-2">If this persists, check console for errors</p>
              </div>
            )}
          </div>
        );

      case 'what-ai-is-not':
        return (
          <div className="section-content">
            {/* Developer Mode Shortcut */}
            {isDevModeActive && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Activity Shortcuts</h3>
                <Button 
                  onClick={() => {
                    markActivityComplete('what-ai-is-not');
                    handleNextActivity();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                  size="sm"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Skip What AI Is NOT Activity
                </Button>
                <p className="text-xs text-red-600 mt-1">Skips the card-flipping activity entirely</p>
              </div>
            )}
            
            <WhatAIIsNotActivity 
              onComplete={() => {
                markActivityComplete('what-ai-is-not');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'exit-ticket':
        return (
          <div className="section-content">
            {/* Developer Mode Exit Ticket Shortcut */}
            {isDevModeActive && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Exit Ticket Shortcuts</h3>
                <div className="flex gap-2 mb-2">
                  <Button 
                    onClick={() => {
                      setExitTicketResponse(devExitTicketResponse);
                      // Auto-generate fake feedback
                      setExitTicketFeedback("Great understanding! Your explanation shows you've grasped the key concepts of AI as pattern recognition and learning systems.");
                      markActivityComplete('exit-ticket');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                    size="sm"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Auto-Complete Exit Ticket
                  </Button>
                  <Button 
                    onClick={() => {
                      // Just mark as complete without filling
                      markActivityComplete('exit-ticket');
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
                    size="sm"
                  >
                    Skip Exit Ticket
                  </Button>
                </div>
                <p className="text-xs text-red-600">Pre-fills with sample response or skips entirely</p>
              </div>
            )}
            
            <ExitTicket
              activityTitle="What is AI?"
              questions={[
                {
                  id: 'ai-understanding',
                  text: 'Based on everything you\'ve learned, how would you explain "artificial intelligence" to someone who has never heard the term before?',
                  placeholder: 'Think about the key concepts: pattern recognition, learning from data, making predictions...'
                }
              ]}
              onComplete={() => {
                markActivityComplete('exit-ticket');
              }}
            />
            {activities.find(a => a.id === 'exit-ticket')?.completed && (
              <div className="text-center mt-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleNextActivity}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl ring-4 ring-green-200 hover:ring-green-300"
                    size="lg"
                  >
                    <Trophy className="mr-3 h-6 w-6" />
                    Get Your Completion Certificate
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
                <p className="text-gray-600 mt-3 text-sm">
                  Congratulations! You've completed the entire module.
                </p>
              </div>
            )}
          </div>
        );

      case 'certificate':
        return (
          <div className="section-content">
            <Certificate
              userName={userNameState}
              courseName="What is AI?"
              completionDate={new Date().toLocaleDateString()}
              onDownload={() => {
                // Certificate downloaded, module is complete
                onComplete();
              }}
            />
          </div>
        );

      case 'ai-evolution':
        return (
          <div className="section-content">
            <ImmersiveAITimeline 
              onComplete={() => {
                markActivityComplete('ai-evolution');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'genai-transition':
        return (
          <div className="section-content">
            <GenerativeAITransition 
              onComplete={() => {
                markActivityComplete('genai-transition');
                handleNextActivity();
              }}
            />
          </div>
        );
        
      default:
        // Check if this is a standalone reflection activity that wasn't caught above
        if ('isStandaloneReflection' in activity && activity.isStandaloneReflection && 'questions' in activity && activity.questions) {
          // Same logic as specific reflection cases
          if (!reflectionState.currentReflectionId) {
            initializeStandaloneReflection(activity.id, activity.questions);
          }
          
          const progress = getReflectionProgress();
          const currentQuestion = activity.questions[reflectionState.currentQuestionIndex];
          
          return (
            <div className="section-content">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h2>
                <p className="text-gray-600">Reflect on your learning journey</p>
                {progress && (
                  <div className="mt-4">
                    <Progress value={progress.progressPercentage} className="w-full max-w-md mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">
                      Question {progress.currentQuestion} of {progress.totalQuestions}
                    </p>
                  </div>
                )}
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Question {reflectionState.currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700 mb-6">{currentQuestion}</p>
                    
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      placeholder="Share your thoughts..."
                      value={reflectionState.responses[reflectionState.currentQuestionIndex] || ''}
                      onChange={(e) => answerStandaloneQuestion(reflectionState.currentQuestionIndex, e.target.value)}
                    />
                    
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={reflectionState.currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      
                      {isDevModeActive && (
                        <div className="flex gap-2">
                          {activity.questions.map((_: string, index: number) => (
                            <Button
                              key={index}
                              variant={index === reflectionState.currentQuestionIndex ? "default" : "outline"}
                              size="sm"
                              onClick={() => skipToQuestion(index)}
                            >
                              {index + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {reflectionState.currentQuestionIndex < activity.questions.length - 1 ? (
                        <Button
                          onClick={nextQuestion}
                          disabled={!reflectionState.responses[reflectionState.currentQuestionIndex]?.trim()}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            completeStandaloneReflection(() => {
                              markActivityComplete(activity.id);
                              handleNextActivity();
                            });
                          }}
                          disabled={!reflectionState.responses[reflectionState.currentQuestionIndex]?.trim()}
                        >
                          Complete Reflection
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        }
        
        return (
          <div className="section-content">
            <div className="text-center py-8">
              <p className="text-gray-500">Activity not found: {activity.id}</p>
              <Button onClick={handleNextActivity} className="mt-4">
                Continue
              </Button>
            </div>
          </div>
        );
    }
  };

  const handleQuizAnswer = (answer: boolean) => {
    const currentQ = aiOrNotQuestions[currentQuizQuestion];
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    setShowQuizExplanation(true);
    
    if (answer === currentQ.isAI) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (currentQuizQuestion < aiOrNotQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setShowQuizExplanation(false);
    } else {
      // Quiz completed, stay on quiz activity to show results
      setCurrentQuizQuestion(aiOrNotQuestions.length);
    }
  };

  return (
    <>
      <div className="module-container">
        <div className="module-content">
          {/* Compact Progress Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-gray-900">What is AI?</h1>
              <Badge variant="outline" className="text-xs">
                {currentActivity + 1} / {activities.length}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{activities[currentActivity]?.title || 'Activity'}</span>
            </div>
          </div>

          {/* Current Activity Content */}
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

      {/* Universal Developer Mode components are handled by the provider */}
    </>
  );
}