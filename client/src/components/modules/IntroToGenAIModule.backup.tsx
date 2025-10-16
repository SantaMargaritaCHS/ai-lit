import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, Video, MessageSquare, Award, ChevronRight, Shuffle, CheckCircle2, X, Lightbulb, Target, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumVideoPlayer } from '../PremiumVideoPlayer';
// Simple inline MultipleChoiceQuestion component - no import needed
import { Certificate } from '../Certificate';
import { ModuleActivityWrapper, VideoActivity, ReflectionActivity, InteractiveActivity } from '../ModuleActivityWrapper';
import { useActivityRegistry } from '../../context/ActivityRegistryContext';
// Removed ModuleDevControls - using UniversalDevMode instead
import { useDevMode } from '@/context/DevModeContext';
// Enhanced interactive activities - no longer using drag and drop
// Developer mode props will be passed from activity wrapper
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from '../WhatIsAIModule/ResumeProgressDialog';
import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';

const MODULE_ID = 'intro-to-gen-ai';

interface IntroToGenAIModuleProps {
  onComplete?: () => void;
  userName?: string;
}

type Phase =
  | 'introduction'
  | 'video-segment-1'
  | 'reflection-1'
  | 'video-segment-2'
  | 'question-1'
  | 'interactive-activity'
  | 'explore-tools'
  | 'video-segment-3'
  | 'exit-activity'
  | 'certificate';

const VIDEO_CONFIG = {
  url: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FGenerative_AI__School_Guide.mp4?alt=media',
  segments: [
    {
      id: 'segment-1',
      title: 'What is Generative AI & Using It Responsibly',
      startTime: 0,
      endTime: 153, // 0:00-2:33 - What it is + How to use responsibly (research, art, coding examples)
      pausePoint: 153
    },
    {
      id: 'segment-2',
      title: 'The Three Key Ingredients',
      startTime: 153, // 2:33 - Start second segment
      endTime: 234, // 3:54 - Computing power, data, interfaces
      pausePoint: 234
    },
    {
      id: 'segment-3',
      title: 'Opportunities, Risks & Your Role',
      startTime: 234,
      endTime: 345, // 5:45 - Benefits/risks, fact-checking, you as the driver
      pausePoint: 345
    }
  ]
};

const COMPREHENSION_QUESTION = {
  question: "According to the video, what is the best way to think about generative AI?",
  options: [
    "It's a creative genius that thinks like a human",
    "It's a super-powered auto-complete that makes educated guesses based on patterns",
    "It's a simple calculator that just adds numbers",
    "It's a magical tool that creates content out of thin air"
  ],
  correctAnswer: 1,
  explanation: "Exactly right! As the video explained, generative AI is like a super-powered auto-complete. Just like your phone guesses the next word, AI makes educated guesses about the next word, sentence, or pixel based on massive amounts of data it has learned from."
};

// SortableItem component removed - now using enhanced individual item presentation

export default function IntroToGenAIModule({ onComplete, userName = "AI Explorer" }: IntroToGenAIModuleProps) {
  const [phase, setPhase] = useState<Phase>('introduction');
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const {
    currentActivity,
    goToActivity,
    registerActivity,
    setCurrentActivity,
    markActivityCompleted,
    clearRegistry
  } = useActivityRegistry();
  const { isDevModeActive, goToActivity: devGoToActivity } = useDevMode();
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);

  // Define phases for navigation
  const phases: Phase[] = [
    'introduction', 'video-segment-1', 'reflection-1',
    'video-segment-2', 'question-1', 'interactive-activity', 'explore-tools',
    'video-segment-3', 'exit-activity', 'certificate'
  ];
  const currentPhaseIndex = phases.indexOf(phase);

  // Convert phases to activities format for progress persistence
  const phaseActivities = phases.map((phaseId, index) => ({
    id: phaseId,
    title: phaseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    completed: completedPhases.has(phaseId)
  }));
  const [reflectionResponse, setReflectionResponse] = useState('');
  const [aiFeedback, setAIFeedback] = useState('');
  const [reflectionShowFeedback, setReflectionShowFeedback] = useState(false);
  const [reflectionNeedsRetry, setReflectionNeedsRetry] = useState(false);
  const [exitResponse, setExitResponse] = useState('');
  const [exitFeedback, setExitFeedback] = useState('');
  const [exitShowFeedback, setExitShowFeedback] = useState(false);
  const [exitNeedsRetry, setExitNeedsRetry] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Question state  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionShowFeedback, setQuestionShowFeedback] = useState(false);
  
  // Reflection state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Interactive Activity state (moved from renderInteractiveActivity to fix hooks violation)
  const [copiedPrompts, setCopiedPrompts] = useState<Record<string, boolean>>({});

  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Register activities with the ActivityRegistry for dev mode
  useEffect(() => {
    console.log('🔧 IntroToGenAIModule: Registering activities...');
    // Clear previous activities when module mounts
    clearRegistry();

    // Register all phases as activities with proper structure
    phases.forEach((phase, index) => {
      const activity = {
        id: phase,
        type: phase === 'certificate' ? 'certificate' as const :
              phase.includes('video') ? 'video' as const :
              phase.includes('reflection') || phase.includes('exit') ? 'reflection' as const :
              'interactive' as const,
        title: phase.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        completed: completedPhases.has(phase)
      };
      registerActivity(activity);
      console.log(`  ✅ Registered: ${activity.title}`);
    });

    console.log('🔧 IntroToGenAIModule: All activities registered');
  }, []); // Only register once on mount to avoid loops

  // Load progress on mount
  useEffect(() => {
    const progress = loadProgress(MODULE_ID, phaseActivities);
    if (progress) {
      const summary = getProgressSummary(MODULE_ID);
      setSavedProgress(summary);
      setShowResumeDialog(true);
      console.log('✅ Progress found - showing resume dialog');
    } else {
      console.log('ℹ️ No valid progress found - starting fresh');
    }
  }, []);

  // Save progress when phase or completedPhases change
  useEffect(() => {
    // Don't save on initial render
    if (currentPhaseIndex === 0 && completedPhases.size === 0) {
      return;
    }
    // Don't save while showing resume dialog
    if (showResumeDialog) {
      return;
    }
    saveProgress(MODULE_ID, currentPhaseIndex, phaseActivities);
  }, [currentPhaseIndex, completedPhases, showResumeDialog]);

  // Listen for dev panel navigation commands via event
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 IntroToGenAIModule: Received goToActivity command for index ${activityIndex}`);

      if (activityIndex >= 0 && activityIndex < phases.length) {
        const targetPhase = phases[activityIndex];
        setPhase(targetPhase as Phase);
        console.log(`✅ Jumped to phase ${activityIndex}: ${targetPhase}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);
    console.log('👂 IntroToGenAIModule: Listening for goToActivity events');

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, [phases]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);



  const markPhaseComplete = useCallback((phaseId: Phase) => {
    setCompletedPhases(prev => new Set(prev).add(phaseId));
    // Also mark as completed in ActivityRegistry for dev mode
    markActivityCompleted(phaseId);
  }, [markActivityCompleted]);

  const handlePhaseComplete = useCallback(() => {
    markPhaseComplete(phase);
    
    const nextPhase: Record<Phase, Phase | null> = {
      'introduction': 'video-segment-1',
      'video-segment-1': 'reflection-1',
      'reflection-1': 'question-1',
      'question-1': 'video-segment-2',
      'video-segment-2': 'interactive-activity',
      'interactive-activity': 'explore-tools',
      'explore-tools': 'video-segment-3',
      'video-segment-3': 'exit-activity',
      'exit-activity': 'certificate',
      'certificate': null
    };

    const next = nextPhase[phase];
    if (next) {
      // Add small delay and scroll to top for smoother transitions
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPhase(next);
      }, 300);
    } else if (onComplete) {
      onComplete();
    }
  }, [phase, markPhaseComplete, onComplete]);


  const handleReflectionSubmit = async (response: string) => {
    if (!response.trim()) return;
    
    setIsLoadingFeedback(true);
    console.log('🤖 Requesting AI feedback for reflection');
    
    try {
      const prompt = `
        A student just completed watching a video segment about generative AI.
        They were asked: "Think of one way you've used generative AI this week. What did it create for you?"
        
        Their response: "${response}"
        
        Provide encouraging, educational feedback (2-3 sentences) that:
        1. Acknowledges their example
        2. Explains briefly how that's an example of generative AI
        3. Encourages them to explore more generative AI tools
        
        If they haven't used generative AI, encourage them to try one of these: ChatGPT, Gemini, Copilot.
      `;

      const apiResponse = await fetch('/api/gemini/enhanced-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: response,
          context: 'Reflection activity: Student was asked to think of one way they\'ve used generative AI this week and what it created for them.'
        })
      });

      const data = await apiResponse.json();
      if (isMountedRef.current) {
        setAIFeedback(data.feedback || 'Great reflection! Generative AI is all around us, creating new content every day.');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      if (isMountedRef.current) {
        setAIFeedback('Excellent observation! Generative AI tools are becoming part of our daily lives.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingFeedback(false);
      }
    }
  };

  const debouncedSubmit = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleReflectionSubmit(value);
      }
    }, 500);
  }, []);

  // Progress persistence handlers
  const handleResumeProgress = () => {
    const progress = loadProgress(MODULE_ID, phaseActivities);
    if (progress) {
      const targetPhase = phases[progress.currentActivity];
      setPhase(targetPhase);
      // Restore completed phases
      const newCompletedPhases = new Set<Phase>();
      progress.activities.forEach((activity, index) => {
        if (activity.completed && index < phases.length) {
          newCompletedPhases.add(phases[index]);
        }
      });
      setCompletedPhases(newCompletedPhases);
      setShowResumeDialog(false);
      console.log(`✅ Resumed at phase ${progress.currentActivity + 1}: ${targetPhase}`);
    } else {
      console.warn('⚠️ Could not resume - starting over');
      handleStartOver();
    }
  };

  const handleStartOver = () => {
    clearProgress(MODULE_ID);
    setShowResumeDialog(false);
    setPhase('introduction');
    setCompletedPhases(new Set());
    console.log('🔄 Starting over - progress cleared');
  };

  // Enhanced interactive activity logic implemented in individual phase renders

  const renderIntroduction = () => (
    <ModuleActivityWrapper
      activityId="intro-gen-ai-introduction"
      activityType="intro"
      activityName="Module Introduction"
      moduleId="intro-to-gen-ai"
    >
      <div className="space-y-6">
      {/* Main Introduction */}
      <div className="bg-glass-light rounded-2xl p-8 border border-primary">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-primary mb-4">
            Introduction to Generative AI
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Welcome to the world of Generative AI - the revolutionary technology that doesn't
            just analyze data, but actually creates brand new content! Let's discover what makes
            it so special and how to use it effectively.
          </p>
        </div>

        {/* Learning Path Preview */}
        <Card className="bg-purple-soft border-accent-secondary mb-6">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Your Learning Path Today
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm">
                  <strong>Master the Difference</strong><br/>
                  Practice identifying traditional vs generative AI
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm">
                  <strong>AI Provides the Spark</strong><br/>
                  You build the fire - learn responsible use
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🛠️</div>
                <p className="text-sm">
                  <strong>Hands-On Practice</strong><br/>
                  Try generative AI tools yourself
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Hook */}
        <Card className="bg-yellow-soft border-accent mb-6">
          <CardContent className="p-4 text-center">
            <p>
              <strong>💡 By the end of this module:</strong> You'll confidently identify generative AI,
              understand how it works, and be ready to use it as a creative tool!
            </p>
          </CardContent>
        </Card>

        {/* Start Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center"
        >
          <Button
            onClick={handlePhaseComplete}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700"
          >
            <span>Start Learning</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
    </ModuleActivityWrapper>
  );

  const renderVideoSegment = (segmentIndex: number) => {
    const segment = VIDEO_CONFIG.segments[segmentIndex];
    const activityId = `intro-gen-ai-video-${segment.id}`;
    const activityName = `Video: ${segment.title}`;
    
    // Enhanced segment-specific content based on the new video
    const getSegmentContent = () => {
      switch (segmentIndex) {
        case 0: // What is Generative AI & Using It Responsibly
          return {
            icon: <Brain className="w-8 h-8 text-purple-400" />,
            title: "What is Generative AI & Using It Responsibly",
            gradient: "from-purple-900/20 to-blue-900/20",
            border: "border-purple-500/30",
            tip: "Pay attention to the 'super-powered auto-complete' analogy and the examples of responsible use!",
            tipColor: "blue"
          };
        case 1: // The Three Key Ingredients
          return {
            icon: <Sparkles className="w-8 h-8 text-green-400" />,
            title: "The Three Key Ingredients",
            gradient: "from-green-900/20 to-teal-900/20",
            border: "border-green-500/30",
            tip: "Learn what makes generative AI possible: computing power, massive datasets, and simple interfaces!",
            tipColor: "green"
          };
        case 2: // Opportunities, Risks & Your Role
          return {
            icon: <Target className="w-8 h-8 text-orange-400" />,
            title: "Opportunities, Risks & Your Role",
            gradient: "from-orange-900/20 to-red-900/20",
            border: "border-orange-500/30",
            tip: "Remember: AI is like a powerful car - it needs a responsible driver. That's YOU!",
            tipColor: "orange"
          };
        default:
          return {
            icon: <Video className="w-8 h-8 text-white" />,
            title: segment.title,
            gradient: "from-blue-900/20 to-purple-900/20",
            border: "border-blue-500/30",
            tip: "Watch carefully!",
            tipColor: "blue"
          };
      }
    };

    const content = getSegmentContent();
    
    return (
      <VideoActivity
        id={activityId}
        name={activityName}
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="space-y-6"
        >
        <Card className={`bg-gradient-to-br ${content.gradient} ${content.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {content.icon}
              <h2 className="text-2xl font-bold text-primary">{segment.title}</h2>
            </div>
            
            <div className="bg-blue-soft p-4 rounded-lg mb-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm">
                  {content.tip}
                </p>
              </div>
            </div>

            {/* Segment-specific content - comparison removed for now */}

            {content.tools && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {content.tools.map((tool) => (
                  <div 
                    key={tool.name}
                    className="bg-green-soft p-3 rounded-lg text-center hover:opacity-90 transition-opacity"
                  >
                    <div className="text-2xl mb-1">{tool.icon}</div>
                    <div className="font-semibold text-sm">{tool.name}</div>
                    <div className="text-xs opacity-80">{tool.type}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <PremiumVideoPlayer
                videoUrl={VIDEO_CONFIG.url}
                segments={[{
                  id: segment.id,
                  title: segment.title,
                  source: 'intro-gen-ai',
                  start: segment.startTime,
                  end: segment.endTime,
                  description: `Video segment: ${segment.title}`,
                  mandatory: true
                }]}
                videoId="intro-gen-ai"
                onSegmentComplete={() => {
                  console.log(`✅ Video Segment ${segmentIndex + 1} completed`);
                  setTimeout(handlePhaseComplete, 1000);
                }}
                hideSegmentNavigator={true}
                allowSeeking={isDevModeActive}
                enableSubtitles={true}

              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </VideoActivity>
    );
  };

  const renderReflection = () => {
    const EXAMPLE_USES = [
      'Microsoft Copilot (ages 13+) to understand concepts and practice skills',
      'Copilot to explore writing techniques and get feedback on drafts',
      'School AI tools to learn about topics',
      'AI image generators (with permission) to explore visual ideas',
      'AI chatbots to brainstorm creative projects'
    ];

    const minResponseLength = 100;
    const isResponseValid = reflectionResponse.trim().length >= minResponseLength;

    const handleSubmit = async () => {
      if (!reflectionShowFeedback) {
        // Layer 1: Pre-validation for gibberish/nonsense
        const isInvalid = isNonsensical(reflectionResponse);

        // Layer 2: Get AI feedback
        setIsLoadingFeedback(true);
        try {
          const question = "Have you ever used generative AI before? If yes, what did it create for you? If no, which tool would you like to try first and why? Remember: Microsoft Copilot is available for students ages 13-17 through your school, and there are other school AI tools you may have access to.";

          const feedback = await generateEducationFeedback(reflectionResponse, question);
          setAIFeedback(feedback);
          setReflectionShowFeedback(true);
          setIsLoadingFeedback(false);

          // Check if AI feedback indicates response needs improvement (strict rejection only)
          const feedbackIndicatesRetry =
            feedback.toLowerCase().includes('does not address') ||
            feedback.toLowerCase().includes('please re-read') ||
            feedback.toLowerCase().includes('inappropriate language') ||
            feedback.toLowerCase().includes('off-topic') ||
            feedback.toLowerCase().includes('must elaborate') ||
            feedback.toLowerCase().includes('insufficient') ||
            feedback.toLowerCase().includes('answer the original question');

          // Require retry if EITHER validation failed
          setReflectionNeedsRetry(isInvalid || feedbackIndicatesRetry);
        } catch (error) {
          console.error('Failed to get AI feedback:', error);
          setAIFeedback('Thank you for your reflection! Your insights about generative AI will help you use these tools more effectively.');
          setReflectionShowFeedback(true);
          setIsLoadingFeedback(false);
          setReflectionNeedsRetry(false); // Don't block on API errors
        }
      } else {
        // Feedback already shown - continue to next activity
        handlePhaseComplete();
      }
    };

    const handleTryAgain = () => {
      setReflectionShowFeedback(false);
      setAIFeedback('');
      setReflectionNeedsRetry(false);
      // IMPORTANT: Keep the response so student can edit it
    };

    return (
      <ReflectionActivity
        id="intro-gen-ai-reflection"
        name="Reflection: Using Generative AI"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
        <Card className="bg-green-soft">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400" />
              Personal Reflection
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">

            <div className="bg-green-soft p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Reflection Question:</h3>
              <p className="text-lg">
                "Have you ever used generative AI before? If yes, what did it create for you? If no, which tool would you like to try first and why?"
              </p>
            </div>

            <div className="bg-blue-soft p-4 rounded-lg">
              <h4 className="font-medium mb-2">Some examples of generative AI tools:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {EXAMPLE_USES.map((example, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className="opacity-70">•</span>
                    {example}
                  </div>
                ))}
              </div>
              <p className="text-sm mt-3 text-blue-700 dark:text-blue-300 font-medium">
                💡 Tip: Microsoft Copilot is available for ages 13-17 through your school!
              </p>
            </div>

            <Textarea
              value={reflectionResponse}
              onChange={(e) => setReflectionResponse(e.target.value)}
              placeholder="Share your thoughts... Be specific and thoughtful."
              className="w-full min-h-[150px] text-base"
              disabled={reflectionShowFeedback}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {reflectionResponse.length} characters
                {minResponseLength && ` (minimum: ${minResponseLength})`}
              </div>
              {isResponseValid && (
                <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  Ready to submit
                </div>
              )}
            </div>

            {/* Display AI Feedback */}
            {reflectionShowFeedback && aiFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-2 rounded-lg p-6 ${
                  reflectionNeedsRetry
                    ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700'
                    : 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300 dark:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 flex-shrink-0 ${
                    reflectionNeedsRetry
                      ? 'bg-blue-200 dark:bg-blue-800'
                      : 'bg-purple-200 dark:bg-purple-800'
                  }`}>
                    <Sparkles className={`w-5 h-5 ${
                      reflectionNeedsRetry
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-purple-700 dark:text-purple-300'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-3 ${
                      reflectionNeedsRetry
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-purple-900 dark:text-purple-100'
                    }`}>
                      AI Feedback
                    </h4>
                    <p className={`leading-relaxed ${
                      reflectionNeedsRetry
                        ? 'text-blue-900 dark:text-blue-200'
                        : 'text-purple-900 dark:text-purple-200'
                    }`}>
                      {aiFeedback}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show appropriate buttons based on state */}
            {reflectionNeedsRetry ? (
              <Button
                onClick={handleTryAgain}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Try Again
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoadingFeedback || !isResponseValid}
                className="w-full"
                size="lg"
              >
                {isLoadingFeedback ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting AI Feedback...
                  </>
                ) : reflectionShowFeedback ? (
                  'Continue Learning'
                ) : (
                  'Submit Reflection'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
      </ReflectionActivity>
    );
  };

  const renderComprehensionQuestion = () => {
    const handleAnswerSelect = (index: number) => {
      setSelectedAnswer(index);
      setQuestionShowFeedback(true);
    };

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-quiz"
        activityType="quiz"
        activityName="Comprehension Check"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-8 border border-primary"
        >
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Comprehension Check</h2>
          <p className="text-muted">Test your understanding</p>
        </div>

        <div className="space-y-6">

          <div className="bg-blue-soft p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">{COMPREHENSION_QUESTION.question}</h3>
          </div>

          <div className="space-y-3">
            {COMPREHENSION_QUESTION.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={questionShowFeedback}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? index === COMPREHENSION_QUESTION.correctAnswer
                      ? 'border-green-500 bg-green-soft'
                      : 'border-red-500 bg-red-soft'
                    : 'border-primary bg-card hover:bg-card-hover'
                } ${questionShowFeedback && index === COMPREHENSION_QUESTION.correctAnswer ? 'border-green-500 bg-green-soft' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          {questionShowFeedback && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === COMPREHENSION_QUESTION.correctAnswer
                ? 'bg-green-soft'
                : 'bg-yellow-soft'
            }`}>
              <p className={`mb-2 font-semibold ${
                selectedAnswer === COMPREHENSION_QUESTION.correctAnswer ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {selectedAnswer === COMPREHENSION_QUESTION.correctAnswer ? '✓ Correct!' : 'Not quite right'}
              </p>
              <p>{COMPREHENSION_QUESTION.explanation}</p>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={handlePhaseComplete}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      </ModuleActivityWrapper>
    );
  };

  const renderInteractiveActivity = () => {
    // State variables moved to component level to fix React Hooks violation

    // Developer mode constants
    const DEV_RESPONSES = {
      reflection: "As an educator, I've actually used generative AI quite a bit this week! I used ChatGPT to help brainstorm discussion questions for my lesson on ecosystems, and it created a really thoughtful list of questions that got my students thinking critically. I also used Gemini to help me brainstorm feedback approaches for student essays - it helped me think through different ways to provide constructive feedback while maintaining an encouraging tone. This experience really shows me how generative AI doesn't just analyze existing content like analytical AI - it actually creates new, original content that I couldn't have thought of on my own.",
      exitTicket: "What surprised me most about generative AI is learning the clear distinction between analytical AI and generative AI through the chef vs. food critic analogy. I didn't realize that tools like Netflix recommendations and spam filters are analytical AI that analyze existing content, while tools like ChatGPT and DALL-E actually create entirely new content that never existed before. This distinction helps me understand why generative AI feels so revolutionary - it's not just processing what's already there, it's creating something completely new. As an educator, this makes me excited about the creative possibilities for both my teaching and my students' learning."
    };


    return (
      <InteractiveActivity
        id="intro-gen-ai-playground"
        name="AI Playground Activity"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              Generative AI Playground
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Fixed Instructions with proper contrast */}
            <Card className="mb-8 bg-purple-50 border-2 border-purple-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Explore Multi-Modal AI!
                </h3>
                <p className="text-gray-700">
                  This chatbot can generate text, create images, analyze documents, and more!
                  Try the suggested prompts below, or experiment with your own ideas.
                </p>
                <p className="text-purple-700 mt-2 font-medium">
                  Click any prompt below to copy it, then paste into the chat and see what happens!
                </p>
              </CardContent>
            </Card>

            {/* AI Chatbot Iframe */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">
                🤖 Multi-Modal AI Chatbot - Try Your Prompts Here!
              </h4>
              <div className="bg-yellow-500/20 border border-yellow-400/30 p-3 rounded-lg mb-4">
                <p className="text-yellow-100 text-sm">
                  <strong>Instructions:</strong> This multi‑modal chatbot (able to process text, images, documents, and code) can generate responses, create images, and interact with uploaded files. Try exploring all it can do!
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <iframe 
                  src="https://ailiteracybot-10010115.chipp.ai" 
                  height="600px" 
                  width="100%" 
                  frameBorder="0" 
                  title="AI Literacy Bot"
                  className="bg-white"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>

            {/* Suggested Prompts Section */}
            <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Try These Multi-Modal Prompts!
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Click the copy icon to copy any prompt, then paste it into the chatbot above
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Text Generation */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">📝</span> Text Generation
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Write a break-up letter to my procrastination habits",
                      "Explain [topic from class] in a way that's actually interesting"
                    ].map((prompt, idx) => (
                      <button
                        key={`text-${idx}`}
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopiedPrompts(prev => ({ ...prev, [`text-${idx}`]: true }));
                          setTimeout(() => {
                            setCopiedPrompts(prev => ({ ...prev, [`text-${idx}`]: false }));
                          }, 2000);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{prompt}</span>
                        {copiedPrompts[`text-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Creation */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">🎨</span> Image Creation
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Create a movie poster for my life as a [comedy/horror/action] film called '[Your Name]: Finals Week'",
                      "Design an aesthetic mood board for [your favorite song/movie/book]"
                    ].map((prompt, idx) => (
                      <button
                        key={`image-${idx}`}
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopiedPrompts(prev => ({ ...prev, [`image-${idx}`]: true }));
                          setTimeout(() => {
                            setCopiedPrompts(prev => ({ ...prev, [`image-${idx}`]: false }));
                          }, 2000);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{prompt}</span>
                        {copiedPrompts[`image-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">📸</span> Image Analysis
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded ml-2">Upload photo first!</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Turn these messy notes into organized study points",
                      "Explain this practice problem step-by-step"
                    ].map((prompt, idx) => (
                      <button
                        key={`analyze-${idx}`}
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopiedPrompts(prev => ({ ...prev, [`analyze-${idx}`]: true }));
                          setTimeout(() => {
                            setCopiedPrompts(prev => ({ ...prev, [`analyze-${idx}`]: false }));
                          }, 2000);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          <span className="mr-1">📎</span>{prompt}
                        </span>
                        {copiedPrompts[`analyze-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">📄</span> Document Analysis
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded ml-2">Upload document first!</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Summarize this in 3 key points I can actually remember",
                      "What are the main arguments and counterarguments?"
                    ].map((prompt, idx) => (
                      <button
                        key={`doc-${idx}`}
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopiedPrompts(prev => ({ ...prev, [`doc-${idx}`]: true }));
                          setTimeout(() => {
                            setCopiedPrompts(prev => ({ ...prev, [`doc-${idx}`]: false }));
                          }, 2000);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          <span className="mr-1">📎</span>{prompt}
                        </span>
                        {copiedPrompts[`doc-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Creative Fun */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">🎲</span> Creative & Fun
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Generate the most ridiculous excuse for [situation] that might actually make someone laugh"
                    ].map((prompt, idx) => (
                      <button
                        key={`fun-${idx}`}
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopiedPrompts(prev => ({ ...prev, [`fun-${idx}`]: true }));
                          setTimeout(() => {
                            setCopiedPrompts(prev => ({ ...prev, [`fun-${idx}`]: false }));
                          }, 2000);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{prompt}</span>
                        {copiedPrompts[`fun-${idx}`] ? (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Try the suggested prompts above, or create your own! When you're ready, continue to discover more AI tools.
              </p>
              <Button
                onClick={() => {
                  setCompletedPhases(prev => new Set([...prev, 'interactive-activity']));
                  setPhase('explore-tools');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              >
                Continue to Explore More Tools
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </InteractiveActivity>
    );
  };

  const renderExitActivity = () => {
    const minExitLength = 100;
    const isExitValid = exitResponse.trim().length >= minExitLength;

    const handleExitSubmit = async () => {
      if (!exitShowFeedback) {
        // Layer 1: Pre-validation for gibberish/nonsense
        const isInvalid = isNonsensical(exitResponse);

        // Layer 2: Get AI feedback
        setIsLoadingFeedback(true);
        try {
          const question = "You just discovered that generative AI can CREATE original content, not just analyze existing stuff. Pick ONE thing you do regularly (hobbies, art, music, creative projects - whatever!) and explain how you'd use generative AI as a creative tool vs just using it to Google answers. Be specific about what you'd create with this technology.";

          const feedback = await generateEducationFeedback(exitResponse, question);
          setExitFeedback(feedback);
          setExitShowFeedback(true);
          setIsLoadingFeedback(false);

          // Check if AI feedback indicates response needs improvement (strict rejection only)
          const feedbackIndicatesRetry =
            feedback.toLowerCase().includes('does not address') ||
            feedback.toLowerCase().includes('please re-read') ||
            feedback.toLowerCase().includes('inappropriate language') ||
            feedback.toLowerCase().includes('off-topic') ||
            feedback.toLowerCase().includes('must elaborate') ||
            feedback.toLowerCase().includes('insufficient') ||
            feedback.toLowerCase().includes('answer the original question');

          // Require retry if EITHER validation failed
          setExitNeedsRetry(isInvalid || feedbackIndicatesRetry);
        } catch (error) {
          console.error('Failed to get AI feedback:', error);
          setExitFeedback('Excellent insights! You understand how generative AI can be a powerful creative tool in your activities.');
          setExitShowFeedback(true);
          setIsLoadingFeedback(false);
          setExitNeedsRetry(false); // Don't block on API errors
        }
      } else {
        // Feedback already shown - continue to certificate
        handlePhaseComplete();
      }
    };

    const handleExitTryAgain = () => {
      setExitShowFeedback(false);
      setExitFeedback('');
      setExitNeedsRetry(false);
      // IMPORTANT: Keep the response so student can edit it
    };

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-exit-ticket"
        activityType="exit-ticket"
        activityName="Exit Ticket"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-b-2 border-orange-300">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="w-6 h-6 text-orange-600" />
                Exit Ticket
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Show your understanding of generative AI as a creative tool</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-600">
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  "You just discovered that generative AI can CREATE original content, not just analyze existing stuff. Pick ONE thing you do regularly (hobbies, art, music, creative projects - whatever!) and explain how you'd use generative AI as a creative tool vs just using it to Google answers. Be specific about what you'd create with this technology."
                </p>
              </div>

              <Textarea
                value={exitResponse}
                onChange={(e) => setExitResponse(e.target.value)}
                placeholder="Share your specific idea... Be creative and detailed!"
                className="w-full min-h-[150px] text-base"
                disabled={exitShowFeedback}
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {exitResponse.length} characters
                  {minExitLength && ` (minimum: ${minExitLength})`}
                </div>
                {isExitValid && (
                  <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Ready to submit
                  </div>
                )}
              </div>

              {/* Display AI Feedback */}
              {exitShowFeedback && exitFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border-2 rounded-lg p-6 ${
                    exitNeedsRetry
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700'
                      : 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300 dark:border-purple-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 flex-shrink-0 ${
                      exitNeedsRetry
                        ? 'bg-blue-200 dark:bg-blue-800'
                        : 'bg-purple-200 dark:bg-purple-800'
                    }`}>
                      <Sparkles className={`w-5 h-5 ${
                        exitNeedsRetry
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-purple-700 dark:text-purple-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-3 ${
                        exitNeedsRetry
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-purple-900 dark:text-purple-100'
                      }`}>
                        AI Feedback
                      </h4>
                      <p className={`leading-relaxed ${
                        exitNeedsRetry
                          ? 'text-blue-900 dark:text-blue-200'
                          : 'text-purple-900 dark:text-purple-200'
                      }`}>
                        {exitFeedback}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Show appropriate buttons based on state */}
              {exitNeedsRetry ? (
                <Button
                  onClick={handleExitTryAgain}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Try Again
                </Button>
              ) : (
                <Button
                  onClick={handleExitSubmit}
                  disabled={isLoadingFeedback || !isExitValid}
                  className="w-full"
                  size="lg"
                >
                  {isLoadingFeedback ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting AI Feedback...
                    </>
                  ) : exitShowFeedback ? (
                    'Get Your Certificate!'
                  ) : (
                    'Submit Exit Ticket'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ModuleActivityWrapper>
    );
  };

  const renderCertificate = () => {
    // Calculate achievement score based on reflection engagement
    const completionScore = Math.round(
      (reflectionResponse.length > 50 ? 50 : 25) + // 50% for thoughtful reflection
      (exitResponse.length > 50 ? 50 : 25) // 50% for meaningful exit response
    );

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-certificate"
        activityType="certificate"
        activityName="Module Certificate"
        moduleId="intro-to-gen-ai"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="text-muted text-lg">You've completed the Introduction to Generative AI module!</p>
        </div>

        <Certificate
          userName={userName}
          courseName="Introduction to Generative AI"
          completionDate={new Date().toLocaleDateString()}
          score={completionScore}
          instructor="AI Literacy Platform"
          moduleId="intro-to-gen-ai"
          onDownload={() => {
            clearProgress(MODULE_ID);
            console.log('📊 Certificate downloaded for Introduction to Generative AI module');

            // Log completion analytics
            fetch('/api/analytics/certificate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'certificate_downloaded',
                moduleId: 'intro-to-gen-ai',
                studentName: userName,
                score: completionScore,
                timestamp: new Date().toISOString()
              })
            }).catch(error => console.error('Analytics error:', error));
          }}
        />
      </motion.div>
      </ModuleActivityWrapper>
    );
  };

  const renderExploreTools = () => {
    const SIMPLE_TOOLS = [
      {
        name: 'Microsoft Copilot',
        url: 'https://copilot.microsoft.com',
        icon: '💬',
        category: 'Multi-Modal Tool',
        description: 'AI tool for text creation, image generation, and concept explanation',
        cost: 'Free with Microsoft account (ages 13+)'
      },
      {
        name: 'Midjourney',
        url: 'https://midjourney.com',
        icon: '🎨',
        category: 'Image Generation',
        description: 'Creates stunning art from text descriptions',
        cost: 'Subscription required'
      },
      {
        name: 'Suno',
        url: 'https://suno.com',
        icon: '🎵',
        category: 'Music Generation',
        description: 'Generates original music and songs',
        cost: 'Free trial, then subscription'
      },
      {
        name: 'Claude',
        url: 'https://claude.ai',
        icon: '🤖',
        category: 'AI Tool',
        description: 'AI tool for writing practice, text analysis, and learning support',
        cost: 'Free tier available'
      }
    ];

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-explore-tools"
        activityType="interactive"
        activityName="Explore AI Tools"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
        {/* Continue Button - Prominent at Top */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready for the Final Video?</h3>
            <p className="text-orange-50 mb-6 text-lg">
              Learn about AI's benefits and limitations
            </p>
            <Button
              onClick={handlePhaseComplete}
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              Continue to Final Video
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Optional Tools Section */}
        <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Optional: Other AI Tools You Can Try
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check these out on your own time!
            </p>
          </div>

          {/* Parent Permission Notice */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6">
            <CardContent className="p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Heads up:</strong> Some tools need accounts or parent permission!
              </p>
            </CardContent>
          </Card>

          {/* Simplified Tool Cards - 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {SIMPLE_TOOLS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-card hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{tool.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base">{tool.name}</h4>
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {tool.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                          💰 {tool.cost}
                        </p>
                        <Button
                          onClick={() => window.open(tool.url, '_blank')}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          Visit {tool.name} →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </ModuleActivityWrapper>
    );
  };


  // Sync phase with ActivityRegistry (bidirectional)
  useEffect(() => {
    if (currentPhaseIndex >= 0) {
      setCurrentActivity(currentPhaseIndex);
    }
  }, [currentPhaseIndex, setCurrentActivity]);

  // Listen for ActivityRegistry navigation
  useEffect(() => {
    if (currentActivity >= 0 && currentActivity < phases.length) {
      const newPhase = phases[currentActivity];
      if (newPhase && newPhase !== phase) {
        console.log('🔧 DEV: Syncing from ActivityRegistry', {
          currentActivity,
          newPhase
        });
        setPhase(newPhase);
      }
    }
  }, [currentActivity]);

  // Debug phase changes
  useEffect(() => {
    console.log('🔧 DEV: Phase changed', {
      phase,
      currentPhaseIndex,
      isDevModeActive
    });
  }, [phase, currentPhaseIndex, isDevModeActive]);

  // Add keyboard navigation for dev mode
  useEffect(() => {
    if (!isDevModeActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigate with arrow keys
      if (e.key === 'ArrowLeft' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
        e.preventDefault();
        const prevIndex = Math.max(0, currentPhaseIndex - 1);
        setPhase(phases[prevIndex]);
      } else if (e.key === 'ArrowRight' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
        e.preventDefault();
        const nextIndex = Math.min(phases.length - 1, currentPhaseIndex + 1);
        setPhase(phases[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevModeActive, currentPhaseIndex]);

  return (
    <>
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

      {/* ModuleDevControls removed - using UniversalDevMode from context */}

      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {phase === 'introduction' && renderIntroduction()}
          {phase === 'video-segment-1' && renderVideoSegment(0)}
          {phase === 'reflection-1' && renderReflection()}
          {phase === 'video-segment-2' && renderVideoSegment(1)}
          {phase === 'question-1' && renderComprehensionQuestion()}
          {phase === 'interactive-activity' && renderInteractiveActivity()}
          {phase === 'explore-tools' && renderExploreTools()}
          {phase === 'video-segment-3' && renderVideoSegment(2)}
          {phase === 'exit-activity' && renderExitActivity()}
          {phase === 'certificate' && renderCertificate()}
        </AnimatePresence>
      </div>
    </>
  );
}