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
import { ReflectionActivity } from '@/hooks/useReflectionNavigation';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { useDevMode } from '@/context/DevModeContext';
import './WhatIsAIModule.css';
import PremiumVideoPlayer from '@/components/PremiumVideoPlayer';
import { ExitTicket } from '@/components/ExitTicket';
import { Certificate } from '@/components/Certificate';
import { initializeRedesignAnalytics } from '@/services/videoAnalyticsRedesign';
import WhatAIIsNotActivity from './WhatAIIsNotActivity';
import AIInMyDayActivity from './AIInMyDayActivity';
import AIPatternSpotterActivity from './AIPatternSpotterActivity';
import ConnectingTheDotsActivity from './ConnectingTheDotsActivity';

interface CompactWhatIsAIModuleProps {
  onComplete: () => void;
  userName?: string;
}

interface ActivityState {
  id: string;
  title: string;
  completed: boolean;
}

// Direct Firebase URL for fast loading (bypassing getDownloadURL API calls)
const DIRECT_VIDEO_URLS = {
  'Videos/1 Introduction to Artificial Intelligence.mp4': 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F1%20Introduction%20to%20Artificial%20Intelligence.mp4?alt=media&token=52c11993-7b1f-4fa5-b2a0-b6fa5b6ba857'
};


export default function CompactWhatIsAIModule({ 
  onComplete, 
  userName = '' 
}: CompactWhatIsAIModuleProps) {
  // Use passed userName directly
  const [userNameState] = useState(userName);
  
  // Essential refs and state that need to be defined early
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Activity flow state - REDESIGNED for better pedagogical flow
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities, setActivities] = useState<(ActivityState & Partial<ReflectionActivity>)[]>([
    { id: 'welcome', title: 'Welcome', completed: false },
    { id: 'ai-in-my-day', title: 'AI in My Day', completed: false },
    {
      id: 'video-intro',
      title: 'Introduction Video',
      completed: false,
      type: 'video-with-reflection'
    },
    { id: 'connecting-dots', title: 'Connecting the Dots', completed: false },
    { id: 'pattern-spotter', title: 'AI Pattern Spotter', completed: false },
    {
      id: 'what-ai-is-not',
      title: 'What AI is NOT',
      completed: false
    },
    { id: 'exit-ticket', title: 'Exit Ticket', completed: false },
    { id: 'certificate', title: 'Certificate', completed: false }
  ]);
  
  // Activity-specific states
  const [showAgeReveal, setShowAgeReveal] = useState(false);
  const [exitTicketResponse, setExitTicketResponse] = useState('');
  const [exitTicketFeedback, setExitTicketFeedback] = useState('');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
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

  // Video URLs state
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


  // Load video URLs and initialize analytics - Using direct URLs for fast loading
  useEffect(() => {
    console.log('🚀 Using direct Firebase URLs for instant video loading');

    // Use direct URLs instead of slow Firebase API calls
    setVideoUrls(DIRECT_VIDEO_URLS);

    // Initialize the redesigned analytics system
    initializeRedesignAnalytics();
  }, []);

  // Register activities with the ActivityRegistry for dev mode - only on mount
  useEffect(() => {
    console.log('🔧 CompactWhatIsAIModule: Registering activities...');
    // Clear previous activities when module mounts
    clearRegistry();

    // Register all activities with proper structure
    activities.forEach((activity, index) => {
      const activityReg = {
        id: activity.id,
        type: activity.id === 'certificate' ? 'certificate' as const :
              activity.id.includes('video') ? 'video' as const :
              activity.id === 'exit-ticket' ? 'reflection' as const :
              'interactive' as const,
        title: activity.title,
        completed: index < currentActivity // Mark as completed if before current
      };
      registerActivity(activityReg);
      console.log(`  ✅ Registered: ${activityReg.title} (completed: ${activityReg.completed})`);
    });

    console.log('🔧 CompactWhatIsAIModule: All activities registered');
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands via event
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 CompactWhatIsAIModule: Received goToActivity command for index ${activityIndex}`);

      if (activityIndex >= 0 && activityIndex < activities.length) {
        setCurrentActivity(activityIndex);
        console.log(`✅ Jumped to activity ${activityIndex}: ${activities[activityIndex].title}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);
    console.log('👂 CompactWhatIsAIModule: Listening for goToActivity events');

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, [activities.length]); // Only re-register when activity count changes, not on every update

  // Sync module's currentActivity with ActivityRegistry
  useEffect(() => {
    if (isDevModeActive) {
      // Update registry's current activity index to match module's
      setRegistryCurrentActivity(currentActivity);
      console.log(`🔄 Synced registry currentActivity to ${currentActivity}`);
    }
  }, [currentActivity, isDevModeActive]);

  // Developer mode auto-fill effects
  useEffect(() => {
    if (isDevModeActive) {
      // Auto-fill exit ticket based on current activity
      const currentActivityData = activities[currentActivity];

      if (currentActivityData?.id === 'exit-ticket') {
        // Auto-fill exit ticket response
        setExitTicketResponse(devExitTicketResponse);
      }
    }
  }, [currentActivity, isDevModeActive]);


  // Developer mode quiz auto-answer function
  const devAutoAnswerQuiz = () => {
    if (isDevModeActive && activities[currentActivity]?.id === 'ai-spotter-challenge') {
      const currentQ = aiSpotterQuestions[currentQuizQuestion];
      const correctAnswer = currentQ.isAI;

      // Auto-select correct answer
      setQuizAnswers(prev => ({ ...prev, [currentQ.id]: correctAnswer }));
      setShowQuizExplanation(true);
      setQuizScore(prev => prev + 1);

      // Auto-advance after reduced time
      setTimeout(() => {
        if (currentQuizQuestion < aiSpotterQuestions.length - 1) {
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


  // AI Spotter Challenge questions - REVISED with graduated difficulty
  const aiSpotterQuestions = [
    {
      id: '1',
      scenario: 'Your phone\'s keyboard suggests the next word as you type',
      isAI: true,
      explanation: 'Yes! It learns from how millions of people write and predicts what you\'ll type next. That\'s pattern recognition!'
    },
    {
      id: '2',
      scenario: 'A microwave timer counting down from 3 minutes',
      isAI: false,
      explanation: 'Correct! This is a simple countdown timer following fixed instructions. No learning or pattern recognition involved.'
    },
    {
      id: '3',
      scenario: 'Snapchat filters that add dog ears to your face',
      isAI: true,
      explanation: 'Yes! It uses AI to recognize where your face is and track it as you move. That\'s complex pattern recognition!'
    },
    {
      id: '4',
      scenario: 'TikTok\'s "For You" page showing videos you might like',
      isAI: true,
      explanation: 'Absolutely! This is AI analyzing your viewing patterns, likes, and watch time to predict what you\'ll enjoy. It\'s constantly learning from your behavior!'
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

      case 'ai-in-my-day':
        return (
          <div className="section-content">
            <AIInMyDayActivity
              onComplete={() => {
                markActivityComplete('ai-in-my-day');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'pattern-spotter':
        return (
          <div className="section-content">
            <AIPatternSpotterActivity
              onComplete={() => {
                markActivityComplete('pattern-spotter');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'connecting-dots':
        return (
          <div className="section-content">
            <ConnectingTheDotsActivity
              onComplete={() => {
                markActivityComplete('connecting-dots');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'ai-spotter-challenge':
        return (
          <div className="section-content">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Spotter Challenge</h2>
              <p className="text-gray-600">Apply what you've learned - can you identify AI?</p>
            </div>
            
            {currentQuizQuestion < aiSpotterQuestions.length ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {currentQuizQuestion + 1} of {aiSpotterQuestions.length}
                  </CardTitle>
                  <CardDescription>
                    {aiSpotterQuestions[currentQuizQuestion].scenario}
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
                                setQuizScore(aiSpotterQuestions.length);
                                setShowQuizResults(true);
                                setCurrentQuizQuestion(aiSpotterQuestions.length);
                              }}
                              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
                              size="sm"
                            >
                              Skip Entire Challenge
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
                      <div className={`p-4 rounded-lg ${quizAnswers[aiSpotterQuestions[currentQuizQuestion].id] === aiSpotterQuestions[currentQuizQuestion].isAI ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {quizAnswers[aiSpotterQuestions[currentQuizQuestion].id] === aiSpotterQuestions[currentQuizQuestion].isAI ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-semibold">
                            {quizAnswers[aiSpotterQuestions[currentQuizQuestion].id] === aiSpotterQuestions[currentQuizQuestion].isAI ? 'Correct!' : 'Not quite!'}
                          </span>
                        </div>
                        <p className="text-sm">{aiSpotterQuestions[currentQuizQuestion].explanation}</p>
                      </div>

                      <Button onClick={handleQuizNext} className="w-full">
                        {currentQuizQuestion < aiSpotterQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Challenge Complete!</h3>
                  <p className="text-lg text-blue-800">Score: {quizScore} out of {aiSpotterQuestions.length}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    {quizScore === aiSpotterQuestions.length ? "Perfect! You're great at identifying AI!" :
                     quizScore >= aiSpotterQuestions.length * 0.75 ? "Excellent work! You understand pattern recognition well." :
                     quizScore >= aiSpotterQuestions.length * 0.5 ? "Good job! You're getting the hang of this." :
                     "Keep learning! AI can be tricky to spot."}
                  </p>
                </div>
                <Button onClick={handleNextActivity} className="w-full">
                  Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
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
                      end: 76.5, // Stops at 1:16.5
                      mandatory: true,
                      description: 'Core introduction to AI concepts'
                    }
                  ]}
                  videoId="intro-ai-complete"
                  onSegmentComplete={(segmentId: string) => {
                    console.log('🎬 Introduction Video segment completed:', segmentId);

                    // Mark current activity as complete and advance
                    markActivityComplete('video-intro');

                    // Auto-advance to next activity
                    setTimeout(() => {
                      console.log('🎬 Auto-advancing to next activity');
                      handleNextActivity();
                    }, 500);
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={isDevModeActive} // Enable seeking in developer mode
                  videoRef={videoRef}
                  interactivePauses={[]} // Removed pauses for better flow
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading video...</p>
              </div>
            )}
          </div>
        );

      // REMOVED: 'video-what-ai-isnt' - content now included in intro video (0:00-1:57)
      // REMOVED: 'simple-age' activity - history question removed per pedagogical review
      //case 'simple-age':
      //   return (
      //     <div className="section-content">
      //       ... (activity code commented out)
      //     </div>
      //   );




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


        
      default:
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
    const currentQ = aiSpotterQuestions[currentQuizQuestion];
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    setShowQuizExplanation(true);

    if (answer === currentQ.isAI) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (currentQuizQuestion < aiSpotterQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setShowQuizExplanation(false);
    } else {
      // Quiz completed, stay on quiz activity to show results
      setCurrentQuizQuestion(aiSpotterQuestions.length);
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