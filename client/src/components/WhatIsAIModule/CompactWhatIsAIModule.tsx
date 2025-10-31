import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowRight, Clock, Target, Play, BookOpen, MessageCircle, Brain, Calendar, Trophy, Zap, Lightbulb, Smartphone, Home, Globe, Car, Loader2 } from 'lucide-react';
// Developer mode is now handled by the UniversalDevModeProvider
import { ReflectionActivity } from '@/hooks/useReflectionNavigation';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { useDevMode } from '@/context/DevModeContext';
import './WhatIsAIModule.css';
import PremiumVideoPlayer from '@/components/PremiumVideoPlayer';
import { ExitTicket } from '@/components/ExitTicket';
import { Certificate } from '@/components/Certificate';
import { initializeRedesignAnalytics } from '@/services/videoAnalyticsRedesign';
import EnhancedAIOrNotQuiz from './EnhancedAIOrNotQuiz';
import AIInTheWildActivity from './AIInTheWildActivity';
import VideoReflectionActivity from './VideoReflectionActivity';
import ResumeProgressDialog from './ResumeProgressDialog';
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import { WHAT_IS_AI_ACTIVITIES } from '@/data/moduleActivityDefinitions';

interface CompactWhatIsAIModuleProps {
  onComplete?: () => void;
  userName?: string;
}

interface ActivityState {
  id: string;
  title: string;
  completed: boolean;
}

// Module identifier for progress persistence
const MODULE_ID = 'what-is-ai';

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

  // Progress persistence state
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);

  // Activity flow state - NEW IMPROVED PEDAGOGICAL FLOW
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Use imported activity definitions (single source of truth)
  const [activities, setActivities] = useState<(ActivityState & Partial<ReflectionActivity>)[]>(
    WHAT_IS_AI_ACTIVITIES.map(activity => ({
      ...activity,
      completed: false
    }))
  );
  
  // Activity-specific states (cleaned up - removed unused states from old activities)
  
  // Activity Registry for dev mode
  const {
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


  // Load video URLs and initialize analytics - Using direct URLs for fast loading
  useEffect(() => {
    console.log('🚀 Using direct Firebase URLs for instant video loading');

    // Use direct URLs instead of slow Firebase API calls
    setVideoUrls(DIRECT_VIDEO_URLS);

    // Initialize the redesigned analytics system
    initializeRedesignAnalytics();
  }, []);

  // Load saved progress on mount (with anti-cheat validation)
  useEffect(() => {
    const progress = loadProgress(MODULE_ID, activities);

    if (progress) {
      // Valid progress found - show resume dialog
      const summary = getProgressSummary(MODULE_ID);
      setSavedProgress(summary);
      setShowResumeDialog(true);
      console.log('✅ Progress found - showing resume dialog');
    } else {
      console.log('ℹ️ No valid progress found - starting fresh');
    }
  }, []); // Only run on mount

  // Save progress whenever activity state changes (debounced to avoid excessive writes)
  useEffect(() => {
    // Don't save on initial mount or if showing resume dialog
    if (currentActivity === 0 && activities[0]?.completed === false) {
      return; // Skip saving if we're still on the welcome screen with no progress
    }

    // Don't save if we're showing the resume dialog (user hasn't chosen yet)
    if (showResumeDialog) {
      return;
    }

    // Save progress with anti-cheat protection
    saveProgress(MODULE_ID, currentActivity, activities);
  }, [currentActivity, activities, showResumeDialog]);

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
              activity.id.includes('reflection') ? 'reflection' as const :
              'interactive' as const,
        name: activity.title, // Use 'name' not 'title' for Activity type
        completed: index < currentActivity // Mark as completed if before current
      };
      registerActivity(activityReg);
      console.log(`  ✅ Registered: ${activityReg.name} (completed: ${activityReg.completed})`);
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

    // Set transitioning state for smooth animation
    setIsTransitioning(true);

    // Small delay for smooth transition
    setTimeout(() => {
      if (nextIndex < activities.length) {
        setCurrentActivity(nextIndex);
        setIsTransitioning(false);
        // Scroll to top when changing activities
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Module is complete
        setIsTransitioning(false);
        if (onComplete) onComplete();
      }
    }, 200);
  };

  // Handle resume from saved progress
  const handleResumeProgress = () => {
    const progress = loadProgress(MODULE_ID, activities);

    if (progress) {
      // Restore saved state
      setCurrentActivity(progress.currentActivity);
      setActivities(progress.activities);
      setShowResumeDialog(false);
      console.log(`✅ Resumed at activity ${progress.currentActivity + 1}/${progress.activities.length}`);
    } else {
      // Progress validation failed - start over
      console.warn('⚠️ Could not resume progress - starting over');
      handleStartOver();
    }
  };

  // Handle starting over (clears saved progress)
  const handleStartOver = () => {
    clearProgress(MODULE_ID);
    setShowResumeDialog(false);
    setCurrentActivity(0);
    setActivities(prev => prev.map(a => ({ ...a, completed: false })));
    console.log('🔄 Starting over - progress cleared');
  };



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
                  <h3 className="text-xl font-bold text-blue-900">What You'll Explore</h3>
                </div>

                <div className="grid gap-4 mb-4">
                  <div className="flex items-start">
                    <Smartphone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Spot AI in Everyday Apps</p>
                      <p className="text-sm text-blue-700">Discover which technologies around you use AI and which don't</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Explore How AI Works</p>
                      <p className="text-sm text-blue-700">Connect the steps: Data → Patterns → Actions in real apps</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MessageCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Think Critically About AI</p>
                      <p className="text-sm text-blue-700">Reflect on AI as a tool and its role in your future</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-4 border-t border-blue-200">
                  <div className="flex items-center text-blue-700">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Earn Your Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleNextActivity} className="w-full primary-button">
              Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'ai-or-not-quiz':
        return (
          <div className="section-content">
            <EnhancedAIOrNotQuiz
              onComplete={() => {
                markActivityComplete('ai-or-not-quiz');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'ai-in-the-wild':
        return (
          <div className="section-content">
            <AIInTheWildActivity
              onComplete={() => {
                markActivityComplete('ai-in-the-wild');
                handleNextActivity();
              }}
            />
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

      case 'video-segment-2':
        const segment2VideoUrl = videoUrls['Videos/1 Introduction to Artificial Intelligence.mp4'];
        return (
          <div className="section-content">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI as a Tool</h2>
              <p className="text-gray-600">Understanding what AI really is (and isn't)</p>
            </div>

            {segment2VideoUrl ? (
              <div className="video-container mb-6">
                <PremiumVideoPlayer
                  videoUrl={segment2VideoUrl}
                  segments={[
                    {
                      id: 'segment-2',
                      title: 'AI as a Tool',
                      source: 'Videos/1 Introduction to Artificial Intelligence.mp4',
                      start: 142, // 2:22
                      end: 178,   // 2:58
                      mandatory: true,
                      description: 'Understanding AI as a tool, not a conscious being'
                    }
                  ]}
                  videoId="segment-2-ai-tool"
                  onSegmentComplete={(segmentId: string) => {
                    console.log('🎬 Segment 2 completed:', segmentId);
                    markActivityComplete('video-segment-2');
                    setTimeout(() => {
                      console.log('🎬 Auto-advancing to reflection');
                      handleNextActivity();
                    }, 500);
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={isDevModeActive}
                  videoRef={videoRef}
                  interactivePauses={[]}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading video...</p>
              </div>
            )}
          </div>
        );

      case 'reflection-2':
        return (
          <div className="section-content">
            <VideoReflectionActivity
              question="The video explains that AI doesn't 'feel' or 'understand' like humans do. Why do you think it's important to remember that AI is a tool and not a conscious being?"
              videoSegmentId="segment-2"
              onComplete={() => {
                markActivityComplete('reflection-2');
                handleNextActivity();
              }}
            />
          </div>
        );

      case 'video-segment-3':
        const segment3VideoUrl = videoUrls['Videos/1 Introduction to Artificial Intelligence.mp4'];
        return (
          <div className="section-content">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Turning Point</h2>
              <p className="text-gray-600">Where AI is taking us next - a major moment of change</p>
            </div>

            {segment3VideoUrl ? (
              <div className="video-container mb-6">
                <PremiumVideoPlayer
                  videoUrl={segment3VideoUrl}
                  segments={[
                    {
                      id: 'segment-3',
                      title: 'AI Inflection Point',
                      source: 'Videos/1 Introduction to Artificial Intelligence.mp4',
                      start: 180, // 3:00
                      end: 211,   // 3:31
                      mandatory: true,
                      description: 'The future of AI and its impact'
                    }
                  ]}
                  videoId="segment-3-inflection-point"
                  onSegmentComplete={(segmentId: string) => {
                    console.log('🎬 Segment 3 completed:', segmentId);
                    markActivityComplete('video-segment-3');
                    setTimeout(() => {
                      console.log('🎬 Auto-advancing to final reflection');
                      handleNextActivity();
                    }, 500);
                  }}
                  hideSegmentNavigator={true}
                  allowSeeking={isDevModeActive}
                  videoRef={videoRef}
                  interactivePauses={[]}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading video...</p>
              </div>
            )}
          </div>
        );

      case 'reflection-3':
        return (
          <div className="section-content">
            <VideoReflectionActivity
              question="The video says we are at an 'inflection point' with AI. Besides what was mentioned, what is one big change you predict AI will bring to your daily life or schoolwork in the next five years?"
              videoSegmentId="segment-3"
              onComplete={() => {
                markActivityComplete('reflection-3');
                handleNextActivity();
              }}
            />
          </div>
        );

      // REMOVED OLD ACTIVITIES:
      // - 'ai-spotter-challenge' (replaced by AI in the Wild)
      // - 'what-ai-is-not' (concepts integrated into other activities)
      // - 'exit-ticket' (replaced by video reflections)


      case 'certificate':
        return (
          <div className="section-content">
            <Certificate
              userName={userNameState}
              courseName="What is AI?"
              completionDate={new Date().toLocaleDateString()}
              onDownload={() => {
                // Clear progress when certificate is downloaded (module complete)
                clearProgress(MODULE_ID);
                console.log('🎓 Certificate downloaded - progress cleared');
                // Certificate downloaded, module is complete
                if (onComplete) onComplete();
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


  return (
    <>
      {/* Resume Progress Dialog */}
      {showResumeDialog && savedProgress && savedProgress.exists && (
        <ResumeProgressDialog
          activityIndex={savedProgress.activityIndex!}
          activityTitle={savedProgress.activityTitle!}
          totalActivities={savedProgress.totalActivities!}
          lastUpdated={savedProgress.lastUpdated!}
          onResume={handleResumeProgress}
          onStartOver={handleStartOver}
        />
      )}

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
          {isTransitioning ? (
            <div className="section-content flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-500">Loading next activity...</p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Universal Developer Mode components are handled by the provider */}
    </>
  );
}