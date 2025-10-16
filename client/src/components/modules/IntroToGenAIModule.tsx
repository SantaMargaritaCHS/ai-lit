import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, Video, MessageSquare, Award, ChevronRight, Shuffle, CheckCircle2, X, Lightbulb, Target, Copy, Check, Loader2, BookOpen, AlertTriangle, Scale, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumVideoPlayer } from '../PremiumVideoPlayer';
import { Certificate } from '../Certificate';
import { ModuleActivityWrapper, VideoActivity, ReflectionActivity, InteractiveActivity } from '../ModuleActivityWrapper';
import { useActivityRegistry } from '../../context/ActivityRegistryContext';
import { useDevMode } from '@/context/DevModeContext';
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
  | 'video-1-what-is-ai'           // Movement 1: 0:00-0:55
  | 'comprehension-check-1'
  | 'video-2-responsible-use'      // Movement 2: 0:55-3:08
  | 'school-policy'
  | 'scenario-activity'
  | 'video-3-how-it-works'         // Movement 3: 3:08-3:44
  | 'ingredients-activity'
  | 'video-4-opportunities-risks'  // Movement 4: 3:44-4:55
  | 'sorting-activity'
  | 'fact-check-challenge'
  | 'integrity-reflection'
  | 'video-5-your-role'            // Movement 5: 4:56-5:45
  | 'interactive-playground'
  | 'exit-ticket'
  | 'certificate';

const VIDEO_CONFIG = {
  url: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FGenerative_AI__School_Guide.mp4?alt=media',
  segments: [
    {
      id: 'segment-1',
      title: 'What is Generative AI?',
      startTime: 0,
      endTime: 55, // Movement 1: 0:00-0:55 - Pattern matching, super-powered auto-complete
      pausePoint: 55
    },
    {
      id: 'segment-2',
      title: 'Using AI Responsibly at School',
      startTime: 55,
      endTime: 188, // Movement 2: 0:55-3:08 - Partnership, research/art/coding examples, "spark and fire"
      pausePoint: 188
    },
    {
      id: 'segment-3',
      title: 'What Makes Gen AI Possible?',
      startTime: 188,
      endTime: 224, // Movement 3: 3:08-3:44 - Three ingredients: computing power, data, interfaces
      pausePoint: 224
    },
    {
      id: 'segment-4',
      title: 'Opportunities & Risks',
      startTime: 224,
      endTime: 295, // Movement 4: 3:44-4:55 - Double-edged sword, hallucinations, bias, academic integrity
      pausePoint: 295
    },
    {
      id: 'segment-5',
      title: 'You Are the Driver',
      startTime: 296,
      endTime: 345, // Movement 5: 4:56-5:45 - "AI is the car, you are the driver", your role
      pausePoint: 345
    }
  ]
};

const COMPREHENSION_QUESTION_1 = {
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

  // Define all 16 phases for navigation
  const phases: Phase[] = [
    'introduction',
    'video-1-what-is-ai',
    'comprehension-check-1',
    'video-2-responsible-use',
    'school-policy',
    'scenario-activity',
    'video-3-how-it-works',
    'ingredients-activity',
    'video-4-opportunities-risks',
    'sorting-activity',
    'fact-check-challenge',
    'integrity-reflection',
    'video-5-your-role',
    'interactive-playground',
    'exit-ticket',
    'certificate'
  ];
  const currentPhaseIndex = phases.indexOf(phase);

  // Convert phases to activities format for progress persistence
  const phaseActivities = phases.map((phaseId, index) => ({
    id: phaseId,
    title: phaseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    completed: completedPhases.has(phaseId)
  }));

  // State for reflections
  const [exitResponse, setExitResponse] = useState('');
  const [exitFeedback, setExitFeedback] = useState('');
  const [exitShowFeedback, setExitShowFeedback] = useState(false);
  const [exitNeedsRetry, setExitNeedsRetry] = useState(false);

  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Question state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionShowFeedback, setQuestionShowFeedback] = useState(false);

  // Activity states
  const [copiedPrompts, setCopiedPrompts] = useState<Record<string, boolean>>({});
  const [sortedItems, setSortedItems] = useState<Record<string, 'opportunity' | 'risk' | null>>({});
  const [factCheckSelections, setFactCheckSelections] = useState<Record<number, boolean>>({});
  const [integritySelections, setIntegritySelections] = useState<Record<number, string>>({});

  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Register activities with the ActivityRegistry for dev mode
  useEffect(() => {
    clearRegistry();

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
    });
  }, []);

  // Load progress on mount
  useEffect(() => {
    const progress = loadProgress(MODULE_ID, phaseActivities);
    if (progress) {
      const summary = getProgressSummary(MODULE_ID);
      setSavedProgress(summary);
      setShowResumeDialog(true);
    }
  }, []);

  // Save progress when phase or completedPhases change
  useEffect(() => {
    if (currentPhaseIndex === 0 && completedPhases.size === 0) {
      return;
    }
    if (showResumeDialog) {
      return;
    }
    saveProgress(MODULE_ID, currentPhaseIndex, phaseActivities);
  }, [currentPhaseIndex, completedPhases, showResumeDialog]);

  // Listen for dev panel navigation commands via event
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;

      if (activityIndex >= 0 && activityIndex < phases.length) {
        const targetPhase = phases[activityIndex];
        setPhase(targetPhase as Phase);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

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
    markActivityCompleted(phaseId);
  }, [markActivityCompleted]);

  const handlePhaseComplete = useCallback(() => {
    markPhaseComplete(phase);

    const nextPhase: Record<Phase, Phase | null> = {
      'introduction': 'video-1-what-is-ai',
      'video-1-what-is-ai': 'comprehension-check-1',
      'comprehension-check-1': 'video-2-responsible-use',
      'video-2-responsible-use': 'school-policy',
      'school-policy': 'scenario-activity',
      'scenario-activity': 'video-3-how-it-works',
      'video-3-how-it-works': 'ingredients-activity',
      'ingredients-activity': 'video-4-opportunities-risks',
      'video-4-opportunities-risks': 'sorting-activity',
      'sorting-activity': 'fact-check-challenge',
      'fact-check-challenge': 'integrity-reflection',
      'integrity-reflection': 'video-5-your-role',
      'video-5-your-role': 'interactive-playground',
      'interactive-playground': 'exit-ticket',
      'exit-ticket': 'certificate',
      'certificate': null
    };

    const next = nextPhase[phase];
    if (next) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPhase(next);
      }, 300);
    } else if (onComplete) {
      onComplete();
    }
  }, [phase, markPhaseComplete, onComplete]);

  // Progress persistence handlers
  const handleResumeProgress = () => {
    const progress = loadProgress(MODULE_ID, phaseActivities);
    if (progress) {
      const targetPhase = phases[progress.currentActivity];
      setPhase(targetPhase);
      const newCompletedPhases = new Set<Phase>();
      progress.activities.forEach((activity, index) => {
        if (activity.completed && index < phases.length) {
          newCompletedPhases.add(phases[index]);
        }
      });
      setCompletedPhases(newCompletedPhases);
      setShowResumeDialog(false);
    } else {
      handleStartOver();
    }
  };

  const handleStartOver = () => {
    clearProgress(MODULE_ID);
    setShowResumeDialog(false);
    setPhase('introduction');
    setCompletedPhases(new Set());
  };

  // Render functions for each phase

  const renderIntroduction = () => (
    <ModuleActivityWrapper
      activityId="intro-gen-ai-introduction"
      activityType="intro"
      activityName="Module Introduction"
      moduleId="intro-to-gen-ai"
    >
      <div className="space-y-6">
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
            You provide the direction, AI processes information. Let's learn how to use generative AI responsibly and effectively as students.
          </p>
        </div>

        <Card className="bg-purple-soft border-accent-secondary mb-6">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Your Learning Path Today
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🧠</div>
                <p className="text-sm">
                  <strong>Pattern Matching Machine</strong><br/>
                  Understand AI as "super-powered auto-complete"
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm">
                  <strong>You Make the Decisions</strong><br/>
                  AI processes patterns, you create original work
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🚗</div>
                <p className="text-sm">
                  <strong>You Drive the Car</strong><br/>
                  Learn your role in shaping AI's future
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

    const getSegmentContent = () => {
      switch (segmentIndex) {
        case 0:
          return {
            icon: <Brain className="w-8 h-8 text-purple-400" />,
            title: segment.title,
            gradient: "from-purple-900/20 to-blue-900/20",
            border: "border-purple-500/30",
            tip: "Listen for the 'super-powered auto-complete' analogy - it's the key to understanding what AI really is!"
          };
        case 1:
          return {
            icon: <Zap className="w-8 h-8 text-green-400" />,
            title: segment.title,
            gradient: "from-green-900/20 to-teal-900/20",
            border: "border-green-500/30",
            tip: "Watch for the three examples: research paper, art project, and coding. Notice the pattern - You provide the direction, AI processes information!"
          };
        case 2:
          return {
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            title: segment.title,
            gradient: "from-yellow-900/20 to-orange-900/20",
            border: "border-yellow-500/30",
            tip: "Three key ingredients: computing power, massive data, and simple interfaces. This 'perfect storm' makes AI accessible to everyone!"
          };
        case 3:
          return {
            icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
            title: segment.title,
            gradient: "from-red-900/20 to-orange-900/20",
            border: "border-red-500/30",
            tip: "Double-edged sword! AI offers amazing opportunities but has serious risks: hallucinations, bias, and academic integrity concerns."
          };
        case 4:
          return {
            icon: <Target className="w-8 h-8 text-blue-400" />,
            title: segment.title,
            gradient: "from-blue-900/20 to-purple-900/20",
            border: "border-blue-500/30",
            tip: "Remember: AI is a powerful car, but YOU are the driver. The future is shaped by how we choose to use it!"
          };
        default:
          return {
            icon: <Video className="w-8 h-8 text-white" />,
            title: segment.title,
            gradient: "from-blue-900/20 to-purple-900/20",
            border: "border-blue-500/30",
            tip: "Watch carefully!"
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
              <h2 className="text-2xl font-bold text-primary">{content.title}</h2>
            </div>

            <div className="bg-blue-soft p-4 rounded-lg mb-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {content.tip}
                </p>
              </div>
            </div>

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

  const renderComprehensionCheck1 = () => {
    const handleAnswerSelect = (index: number) => {
      setSelectedAnswer(index);
      setQuestionShowFeedback(true);
    };

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-comprehension-check-1"
        activityType="quiz"
        activityName="Comprehension Check: Pattern Matching"
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
          <h2 className="text-2xl font-bold text-primary mb-2">Comprehension Check</h2>
          <p className="text-secondary">Test your understanding</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-soft p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">{COMPREHENSION_QUESTION_1.question}</h3>
          </div>

          <div className="space-y-3">
            {COMPREHENSION_QUESTION_1.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={questionShowFeedback}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? index === COMPREHENSION_QUESTION_1.correctAnswer
                      ? 'border-green-500 bg-green-soft'
                      : 'border-red-500 bg-red-soft'
                    : 'border-primary bg-card hover:bg-card-hover'
                } ${questionShowFeedback && index === COMPREHENSION_QUESTION_1.correctAnswer ? 'border-green-500 bg-green-soft' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          {questionShowFeedback && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === COMPREHENSION_QUESTION_1.correctAnswer
                ? 'bg-green-soft'
                : 'bg-yellow-soft'
            }`}>
              <p className={`mb-2 font-semibold ${
                selectedAnswer === COMPREHENSION_QUESTION_1.correctAnswer ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {selectedAnswer === COMPREHENSION_QUESTION_1.correctAnswer ? '✓ Correct!' : 'Not quite right'}
              </p>
              <p className="text-gray-800 dark:text-gray-200">{COMPREHENSION_QUESTION_1.explanation}</p>

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


  const renderSchoolPolicy = () => (
    <InteractiveActivity
      id="intro-gen-ai-school-policy"
      name="SMHS AI Policy"
      moduleId="intro-to-gen-ai"
      onComplete={() => handlePhaseComplete()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Your School's AI Policy
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Santa Margarita Catholic High School - AI Guidelines</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Pre-Approved Tools (Ages 13+):</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-800 dark:text-gray-200">
                    <li>Microsoft Copilot</li>
                    <li>SchoolAI</li>
                    <li>Snorkl</li>
                    <li>Khanmigo</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Key Rules:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-800 dark:text-gray-200">
                    <li><strong>Always follow teacher instructions</strong> for each assignment</li>
                    <li><strong>Fact-check everything</strong> AI generates</li>
                    <li><strong>Cite AI usage</strong> when required</li>
                    <li>Remember: AI helps you understand concepts and practice skills - it should never complete your assignments</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 p-4 rounded-lg">
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <strong>Important:</strong> This policy helps ensure you use AI responsibly and develop real skills. Your teacher's instructions always come first!
              </p>
            </div>

            <Button
              onClick={() => window.open('https://www.smhs.org/academics/ed-tech/ai', '_blank')}
              variant="outline"
              className="w-full mb-4"
            >
              Read Full Policy at smhs.org/academics/ed-tech/ai
            </Button>

            <Button
              onClick={handlePhaseComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              I Understand the Policy
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </InteractiveActivity>
  );

  const renderScenarioActivity = () => {
    const SCENARIO_QUESTION = {
      question: "Which of these demonstrates responsible AI use for learning?",
      options: [
        {
          text: "📚 Using AI to understand research methodology - AI suggests resources, you develop critical thinking skills",
          isCorrect: true,
          explanation: "Exactly right! You're using AI to learn HOW to research, not to do the research for you. You provide the direction, AI provides information."
        },
        {
          text: "🎨 Using AI to explore artistic techniques - AI shows examples, you practice and develop your own artistic voice",
          isCorrect: true,
          explanation: "Perfect! AI generates examples for you to study, but YOU create the original work. AI processes patterns, you create."
        },
        {
          text: "💻 Using AI to understand programming concepts - AI explains and provides examples, you analyze and experiment",
          isCorrect: true,
          explanation: "Great! AI provides example code to study, but you build true understanding by analyzing and testing. You make the decisions."
        },
        {
          text: "📝 Using AI to complete your homework assignments without understanding the concepts",
          isCorrect: false,
          explanation: "This is NOT responsible use. AI should help you learn skills, not complete tasks for you. Remember: you're the driver!"
        }
      ]
    };

    const [scenarioSelections, setScenarioSelections] = useState<Record<number, boolean>>({});
    const allAnswered = SCENARIO_QUESTION.options.every((_, idx) => scenarioSelections[idx] !== undefined);
    const hasCorrectAnswer = SCENARIO_QUESTION.options.some((opt, idx) => opt.isCorrect && scenarioSelections[idx] === true);

    return (
      <InteractiveActivity
        id="intro-gen-ai-scenario-activity"
        name="Responsible Use Knowledge Check"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                Knowledge Check: Responsible AI Use
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Select all examples of responsible AI use (there may be more than one!)
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">{SCENARIO_QUESTION.question}</h3>
              </div>

              <div className="space-y-3">
                {SCENARIO_QUESTION.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => setScenarioSelections({...scenarioSelections, [index]: !scenarioSelections[index]})}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                        scenarioSelections[index] === true
                          ? option.isCorrect
                            ? 'border-green-500 bg-green-soft'
                            : 'border-red-500 bg-red-soft'
                          : 'border-primary bg-card hover:bg-card-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
                        {scenarioSelections[index] === true && (
                          <span className="ml-2 flex-shrink-0">
                            {option.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          </span>
                        )}
                      </div>
                    </button>
                    {scenarioSelections[index] === true && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded-lg text-sm ${
                          option.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        }`}
                      >
                        {option.explanation}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-400 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>Remember:</strong> Responsible AI use means you provide the direction and make the decisions. AI processes information to help you learn skills - it should never complete tasks for you.
                </p>
              </div>

              <Button
                onClick={handlePhaseComplete}
                disabled={!allAnswered || !hasCorrectAnswer}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                size="lg"
              >
                {!allAnswered ? 'Select at least one answer to continue' : !hasCorrectAnswer ? 'Select at least one correct answer to continue' : 'Continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  };

  const renderIngredientsActivity = () => {
    const ingredients = [
      {
        icon: '⚡',
        title: 'Computing Power',
        description: 'Specialized computer chips that can process massive amounts of data incredibly fast',
        example: 'GPUs and TPUs that train AI models'
      },
      {
        icon: '📊',
        title: 'Massive Datasets',
        description: 'Enormous collections of data from books, websites, images - a giant chunk of the public internet',
        example: 'Billions of web pages, images, and text'
      },
      {
        icon: '💬',
        title: 'Simple Interfaces',
        description: 'Easy-to-use text boxes that hide all the complexity, making AI accessible to everyone',
        example: 'ChatGPT, Copilot, Gemini chat interfaces'
      }
    ];

    const allClicked = ingredients.every(ing =>
      sortedItems[ing.title] !== null && sortedItems[ing.title] !== undefined
    );

    return (
      <InteractiveActivity
        id="intro-gen-ai-ingredients"
        name="Three Key Ingredients"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                The Perfect Storm: Three Key Ingredients
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Click each card to learn what makes generative AI possible
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {ingredients.map((ingredient, index) => (
                  <motion.button
                    key={ingredient.title}
                    onClick={() => setSortedItems({...sortedItems, [ingredient.title]: 'clicked' as any})}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-left"
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      sortedItems[ingredient.title]
                        ? 'bg-white dark:bg-gray-800 border-2 border-green-500'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 hover:border-yellow-400'
                    }`}>
                      <CardContent className="p-5">
                        <div className="text-center mb-3">
                          <div className="text-4xl mb-2">{ingredient.icon}</div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ingredient.title}</h3>
                        </div>

                        {sortedItems[ingredient.title] && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">{ingredient.description}</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Example:</p>
                              <p className="text-xs text-gray-800 dark:text-gray-200">{ingredient.example}</p>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.button>
                ))}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 p-4 rounded-lg mt-6">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>The Perfect Storm:</strong> When these three ingredients came together, they made AI accessible to everyone - not just researchers and tech companies!
                </p>
              </div>

              <Button
                onClick={handlePhaseComplete}
                disabled={!allClicked}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white mt-4"
                size="lg"
              >
                {allClicked ? 'Continue' : 'Click all three ingredients to continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  };

  const renderSortingActivity = () => {
    const items = [
      { id: 1, text: 'Summarize long documents', category: 'opportunity' },
      { id: 2, text: 'Generate completely false information (hallucinations)', category: 'risk' },
      { id: 3, text: 'Help organize research data', category: 'opportunity' },
      { id: 4, text: 'Reflect and amplify biases from training data', category: 'risk' },
      { id: 5, text: 'Explore new ideas and ask questions', category: 'opportunity' },
      { id: 6, text: 'Raise questions about academic integrity', category: 'risk' }
    ];

    const allSorted = items.every(item => sortedItems[item.id] !== null && sortedItems[item.id] !== undefined);

    return (
      <InteractiveActivity
        id="intro-gen-ai-sorting"
        name="Opportunities vs Risks"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Scale className="w-8 h-8 text-red-600 dark:text-red-400" />
                The Double-Edged Sword
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Sort each statement as an Opportunity or a Risk
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.text}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSortedItems({...sortedItems, [item.id]: 'opportunity'})}
                        variant={sortedItems[item.id] === 'opportunity' ? 'default' : 'outline'}
                        className={`flex-1 ${
                          sortedItems[item.id] === 'opportunity'
                            ? item.category === 'opportunity'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                            : ''
                        }`}
                        size="sm"
                      >
                        {sortedItems[item.id] === 'opportunity' && (
                          item.category === 'opportunity' ? '✓ ' : '✗ '
                        )}
                        Opportunity
                      </Button>
                      <Button
                        onClick={() => setSortedItems({...sortedItems, [item.id]: 'risk'})}
                        variant={sortedItems[item.id] === 'risk' ? 'default' : 'outline'}
                        className={`flex-1 ${
                          sortedItems[item.id] === 'risk'
                            ? item.category === 'risk'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                            : ''
                        }`}
                        size="sm"
                      >
                        {sortedItems[item.id] === 'risk' && (
                          item.category === 'risk' ? '✓ ' : '✗ '
                        )}
                        Risk
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handlePhaseComplete}
                disabled={!allSorted}
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                size="lg"
              >
                {allSorted ? 'Continue' : 'Sort all items to continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  };

  const renderFactCheckChallenge = () => {
    const statements = [
      {
        id: 1,
        text: 'AI models are trained on data from the internet, so they can repeat misinformation.',
        isTrue: true,
        explanation: 'Correct! AI learns from human-created content, including incorrect information.'
      },
      {
        id: 2,
        text: 'AI-generated content is always 100% accurate and never needs fact-checking.',
        isTrue: false,
        explanation: 'Wrong! AI can "hallucinate" - generate information that sounds correct but is completely made up. Always fact-check!'
      },
      {
        id: 3,
        text: 'You are responsible for fact-checking anything AI tells you.',
        isTrue: true,
        explanation: 'Absolutely correct! This is the #1 rule of using AI responsibly.'
      }
    ];

    const allAnswered = statements.every(stmt => factCheckSelections[stmt.id] !== undefined);

    return (
      <InteractiveActivity
        id="intro-gen-ai-fact-check"
        name="Fact-Check Challenge"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                Hallucination Alert: Fact-Check Challenge
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Mark each statement as True or False
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {statements.map((statement) => (
                <div key={statement.id} className="space-y-3">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{statement.text}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setFactCheckSelections({...factCheckSelections, [statement.id]: true})}
                      variant={factCheckSelections[statement.id] === true ? 'default' : 'outline'}
                      className={`flex-1 ${
                        factCheckSelections[statement.id] === true
                          ? statement.isTrue
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                          : ''
                      }`}
                    >
                      {factCheckSelections[statement.id] === true && (
                        statement.isTrue ? '✓ ' : '✗ '
                      )}
                      True
                    </Button>
                    <Button
                      onClick={() => setFactCheckSelections({...factCheckSelections, [statement.id]: false})}
                      variant={factCheckSelections[statement.id] === false ? 'default' : 'outline'}
                      className={`flex-1 ${
                        factCheckSelections[statement.id] === false
                          ? !statement.isTrue
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                          : ''
                      }`}
                    >
                      {factCheckSelections[statement.id] === false && (
                        !statement.isTrue ? '✓ ' : '✗ '
                      )}
                      False
                    </Button>
                  </div>
                  {factCheckSelections[statement.id] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-3 rounded-lg text-sm ${
                        factCheckSelections[statement.id] === statement.isTrue
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {statement.explanation}
                    </motion.div>
                  )}
                </div>
              ))}

              <Button
                onClick={handlePhaseComplete}
                disabled={!allAnswered}
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                size="lg"
              >
                {allAnswered ? 'Continue' : 'Answer all questions to continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  };

  const renderIntegrityReflection = () => {
    const scenarios = [
      {
        id: 1,
        scenario: 'Your teacher says "No AI for this essay"',
        options: ['Use AI anyway, just don\'t tell anyone', 'Follow instructions and write it yourself', 'Ask teacher if AI is okay for brainstorming only'],
        correct: [1, 2]
      },
      {
        id: 2,
        scenario: 'AI gives you information for your project',
        options: ['Copy it directly without checking', 'Fact-check everything before using it', 'Assume it\'s correct because AI said so'],
        correct: [1]
      }
    ];

    const allAnswered = scenarios.every(s => integritySelections[s.id]);

    return (
      <InteractiveActivity
        id="intro-gen-ai-integrity"
        name="Academic Integrity Reflection"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Academic Integrity Check
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                What would YOU do in these situations?
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="space-y-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{scenario.scenario}</p>
                  <div className="space-y-2">
                    {scenario.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setIntegritySelections({...integritySelections, [scenario.id]: idx.toString()})}
                        className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                          integritySelections[scenario.id] === idx.toString()
                            ? scenario.correct.includes(idx)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <span className="text-sm text-gray-800 dark:text-gray-200">{option}</span>
                        {integritySelections[scenario.id] === idx.toString() && (
                          <span className="ml-2">
                            {scenario.correct.includes(idx) ? '✓' : '✗'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 p-4 rounded-lg">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>Remember:</strong> Always follow your teacher's instructions, fact-check everything, and know your school's AI policy!
                </p>
              </div>

              <Button
                onClick={handlePhaseComplete}
                disabled={!allAnswered}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                size="lg"
              >
                {allAnswered ? 'Continue' : 'Answer all scenarios to continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  };

  const renderInteractivePlayground = () => {
    return (
      <InteractiveActivity
        id="intro-gen-ai-playground"
        name="AI Playground"
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
            <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              Try It Yourself: AI Playground
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Card className="mb-8 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  Explore Microsoft Copilot!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  This AI tool processes text and image requests based on your prompts.
                  Try the suggested prompts below or experiment with your own ideas.
                </p>
              </CardContent>
            </Card>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">
                Multi-Modal AI Chatbot
              </h4>
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

            <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Suggested Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { icon: '📝', text: 'Write a break-up letter to my procrastination habits' },
                  { icon: '🎨', text: 'Create a movie poster for my life called "[Your Name]: Finals Week"' },
                  { icon: '📸', text: 'Turn these messy notes into organized study points (upload photo first!)' }
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigator.clipboard.writeText(prompt.text);
                      setCopiedPrompts(prev => ({ ...prev, [idx]: true }));
                      setTimeout(() => setCopiedPrompts(prev => ({ ...prev, [idx]: false })), 2000);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      <span className="mr-2">{prompt.icon}</span>
                      {prompt.text}
                    </span>
                    {copiedPrompts[idx] ? (
                      <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 ml-2 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Button
              onClick={handlePhaseComplete}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              Continue to Final Reflection
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      </InteractiveActivity>
    );
  };

  const renderExitTicket = () => {
    const minExitLength = 150;
    const isExitValid = exitResponse.trim().length >= minExitLength;

    const handleExitSubmit = async () => {
      if (!exitShowFeedback) {
        const isInvalid = isNonsensical(exitResponse);

        setIsLoadingFeedback(true);
        try {
          const question = "The video ended with a powerful question: 'The real question isn't what can AI do - it's what will YOU do with it?' So... what will YOU do with it? How will you use AI tools responsibly to support your learning?";

          const feedback = await generateEducationFeedback(exitResponse, question);
          setExitFeedback(feedback);
          setExitShowFeedback(true);
          setIsLoadingFeedback(false);

          const feedbackIndicatesRetry =
            feedback.toLowerCase().includes('does not address') ||
            feedback.toLowerCase().includes('please re-read') ||
            feedback.toLowerCase().includes('inappropriate language') ||
            feedback.toLowerCase().includes('off-topic') ||
            feedback.toLowerCase().includes('must elaborate') ||
            feedback.toLowerCase().includes('insufficient') ||
            feedback.toLowerCase().includes('answer the original question');

          setExitNeedsRetry(isInvalid || feedbackIndicatesRetry);
        } catch (error) {
          setExitFeedback('Excellent reflection! You understand your role as the driver of this powerful technology.');
          setExitShowFeedback(true);
          setIsLoadingFeedback(false);
          setExitNeedsRetry(false);
        }
      } else {
        handlePhaseComplete();
      }
    };

    const handleExitTryAgain = () => {
      setExitShowFeedback(false);
      setExitFeedback('');
      setExitNeedsRetry(false);
    };

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-exit-ticket"
        activityType="exit-ticket"
        activityName="Exit Ticket: Your Role"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Exit Ticket: What Will YOU Do With It?
              </CardTitle>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Final reflection on your role as the driver</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-600">
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  The video ended with a powerful question: "The real question isn't what can AI do - it's what will YOU do with it?"
                  <br/><br/>
                  So... what will YOU do with it? How will you use AI tools responsibly to support your learning?
                </p>
              </div>

              <Textarea
                value={exitResponse}
                onChange={(e) => setExitResponse(e.target.value)}
                placeholder="Share your vision for how you'll use AI responsibly and effectively..."
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
                        Automated Review
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  {isLoadingFeedback ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Response...
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
    const completionScore = Math.round(
      (exitResponse.length > 50 ? 100 : 60)
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
          <h2 className="text-3xl font-bold text-primary mb-2">Congratulations!</h2>
          <p className="text-secondary text-lg">You've completed the Introduction to Generative AI module!</p>
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
          }}
        />
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
        setPhase(newPhase);
      }
    }
  }, [currentActivity]);

  // Add keyboard navigation for dev mode
  useEffect(() => {
    if (!isDevModeActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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

      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {phase === 'introduction' && renderIntroduction()}
          {phase === 'video-1-what-is-ai' && renderVideoSegment(0)}
          {phase === 'comprehension-check-1' && renderComprehensionCheck1()}
          {phase === 'video-2-responsible-use' && renderVideoSegment(1)}
          {phase === 'school-policy' && renderSchoolPolicy()}
          {phase === 'scenario-activity' && renderScenarioActivity()}
          {phase === 'video-3-how-it-works' && renderVideoSegment(2)}
          {phase === 'ingredients-activity' && renderIngredientsActivity()}
          {phase === 'video-4-opportunities-risks' && renderVideoSegment(3)}
          {phase === 'sorting-activity' && renderSortingActivity()}
          {phase === 'fact-check-challenge' && renderFactCheckChallenge()}
          {phase === 'integrity-reflection' && renderIntegrityReflection()}
          {phase === 'video-5-your-role' && renderVideoSegment(4)}
          {phase === 'interactive-playground' && renderInteractivePlayground()}
          {phase === 'exit-ticket' && renderExitTicket()}
          {phase === 'certificate' && renderCertificate()}
        </AnimatePresence>
      </div>
    </>
  );
}
