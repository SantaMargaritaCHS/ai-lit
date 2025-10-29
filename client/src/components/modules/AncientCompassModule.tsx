import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Compass,
  Factory,
  Heart,
  Users,
  Scale,
  Video,
  Award,
  ChevronRight,
  CheckCircle2,
  Loader2,
  BookOpen,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumVideoPlayer } from '../PremiumVideoPlayer';
import { Certificate } from '../Certificate';
import { useActivityRegistry } from '../../context/ActivityRegistryContext';
import { useDevMode } from '@/context/DevModeContext';
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from '../WhatIsAIModule/ResumeProgressDialog';
import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';
import RevolutionComparisonChart from '../AncientCompassModule/RevolutionComparisonChart';
import EthicalDilemmaScenarios from '../AncientCompassModule/EthicalDilemmaScenarios';
import StakeholderPerspectives from '../AncientCompassModule/StakeholderPerspectives';
import PersonalAIAudit from '../AncientCompassModule/PersonalAIAudit';

const MODULE_ID = 'ancient-compass-ai-ethics';

interface AncientCompassModuleProps {
  onComplete?: () => void;
  userName?: string;
}

type Phase =
  | 'welcome'
  | 'video-1-industrial-revolution'      // Segment 1: 0:00-1:54:30
  | 'quiz-1-understanding-parallel'
  | 'activity-1-revolution-comparison'
  | 'video-2-echo-from-past'             // Segment 2: 1:54:31-3:06:45
  | 'comprehension-check-2-rerum-novarum'
  | 'video-3-compass-for-humanity'       // Segment 3: 3:07-4:56
  | 'quiz-2-three-principles'
  | 'activity-2-ethical-dilemmas'
  | 'video-4-principle-to-practice'      // Segment 4: 4:57-6:17
  | 'activity-3-stakeholder-perspectives'
  | 'video-5-choice-we-face'             // Segment 5: 6:18-7:30
  | 'activity-4-personal-ai-audit'
  | 'exit-ticket'
  | 'certificate';

// Video configuration
const VIDEO_CONFIG = {
  url: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FAncient%20Compass%20Content%2FAn_Ancient_Compass_for_AI.mp4?alt=media',
  segments: [
    {
      id: 'segment-1',
      title: 'New Industrial Revolution',
      startTime: 0,
      endTime: 114.5, // 1:54:30
      pausePoint: 114.5
    },
    {
      id: 'segment-2',
      title: 'Echo from the Past',
      startTime: 114.5, // 1:54:31
      endTime: 186.75, // 3:06:45
      pausePoint: 186.75
    },
    {
      id: 'segment-3',
      title: 'A Compass for Humanity',
      startTime: 187, // 3:07
      endTime: 296, // 4:56
      pausePoint: 296
    },
    {
      id: 'segment-4',
      title: 'Principle to Practice',
      startTime: 297, // 4:57
      endTime: 377, // 6:17
      pausePoint: 377
    },
    {
      id: 'segment-5',
      title: 'The Choice We Face',
      startTime: 378, // 6:18
      endTime: 450, // 7:30
      pausePoint: 450
    }
  ]
};

// Quiz 1 questions
const QUIZ_1_QUESTIONS = [
  {
    question: "What does \"industrialization of thought\" mean?",
    options: [
      "Robots taking over factories",
      "AI automating mental and creative tasks",
      "People thinking like machines",
      "Factories producing computers"
    ],
    correctAnswer: 1,
    explanation: "Correct! The industrialization of thought refers to AI systems automating cognitive, mental, and creative tasks—similar to how the Industrial Revolution automated physical labor."
  },
  {
    question: "How is learning prompt engineering similar to learning to operate factory machines in the 1800s?",
    options: [
      "Both require years of training",
      "Both are physical skills",
      "Both are new skills needed to work with new technology",
      "Both are being replaced by AI"
    ],
    correctAnswer: 2,
    explanation: "Exactly! Both represent new skills that workers need to learn to interact with revolutionary technology of their era."
  },
  {
    question: "Why does the video compare AI to the Industrial Revolution?",
    options: [
      "They both happened in the same century",
      "They both represent massive technological shifts requiring ethical guidance",
      "They both involve machines",
      "They both were invented by the same people"
    ],
    correctAnswer: 1,
    explanation: "Perfect! Both the Industrial Revolution and the AI Revolution are transformative technological shifts that require ethical frameworks to ensure they benefit humanity."
  }
];

// Comprehension Check 2 questions (after Segment 2: Echo from the Past)
const COMPREHENSION_CHECK_2_QUESTIONS = [
  {
    question: "Why does the video mention the Catholic Church's response to the Industrial Revolution?",
    options: [
      "To criticize religious involvement in technology",
      "To show that ethical frameworks have guided technological change before",
      "To promote Catholic beliefs over other religions",
      "To suggest we should avoid AI entirely"
    ],
    correctAnswer: 1,
    explanation: "Correct! The video uses the historical example of Rerum Novarum to show that society has successfully navigated major technological shifts using ethical frameworks before."
  },
  {
    question: "What was Rerum Novarum (1891)?",
    options: [
      "A new type of factory machine",
      "A workers' union organization",
      "A document addressing worker dignity during industrialization",
      "A law banning child labor"
    ],
    correctAnswer: 2,
    explanation: "That's right! Rerum Novarum was a papal document that established principles to protect workers during the Industrial Revolution."
  },
  {
    question: "What 'middle path' did Catholic Social Teaching seek between two extremes?",
    options: [
      "Between technology and nature",
      "Between unregulated capitalism and state-controlled socialism",
      "Between old traditions and new innovations",
      "Between workers and factory owners"
    ],
    correctAnswer: 1,
    explanation: "Exactly! Catholic Social Teaching aimed to find a balance between extreme capitalism (which exploited workers) and extreme socialism (which erased individual dignity)."
  }
];

// Quiz 2 questions
const QUIZ_2_QUESTIONS = {
  matching: [
    {
      example: "Ensuring rural students have equal access to AI education tools",
      correctPrinciple: "Common Good",
      id: 1
    },
    {
      example: "Requiring human oversight for AI hiring decisions",
      correctPrinciple: "Human Dignity",
      id: 2
    },
    {
      example: "Everyone working together to fix biased algorithms",
      correctPrinciple: "Solidarity",
      id: 3
    }
  ],
  trueFalse: {
    statement: "The Common Good principle means AI should benefit the majority of people.",
    correctAnswer: false,
    explanation: "The Common Good means AI should allow EVERYONE to thrive, not just most people. It's about ensuring technology benefits all members of society, especially marginalized groups, not just the majority."
  }
};

export default function AncientCompassModule({ onComplete, userName = "AI Explorer" }: AncientCompassModuleProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const {
    registerActivity,
    clearRegistry
  } = useActivityRegistry();
  const { isDevModeActive, goToActivity: devGoToActivity } = useDevMode();
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);

  // Define all phases for navigation
  const phases: Phase[] = [
    'welcome',
    'video-1-industrial-revolution',
    'quiz-1-understanding-parallel',
    'activity-1-revolution-comparison',
    'video-2-echo-from-past',
    'comprehension-check-2-rerum-novarum',
    'video-3-compass-for-humanity',
    'quiz-2-three-principles',
    'activity-2-ethical-dilemmas',
    'video-4-principle-to-practice',
    'activity-3-stakeholder-perspectives',
    'video-5-choice-we-face',
    'activity-4-personal-ai-audit',
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

  // State for exit ticket
  const [exitResponse, setExitResponse] = useState('');
  const [exitFeedback, setExitFeedback] = useState('');
  const [exitShowFeedback, setExitShowFeedback] = useState(false);
  const [exitNeedsRetry, setExitNeedsRetry] = useState(false);
  const [exitAttemptCount, setExitAttemptCount] = useState(0);
  const [exitShowEscapeHatch, setExitShowEscapeHatch] = useState(false);
  const [selectedExitPrompt, setSelectedExitPrompt] = useState(0);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const MAX_EXIT_ATTEMPTS = 2;

  // Quiz 1 state
  const [quiz1Answers, setQuiz1Answers] = useState<(number | null)[]>([null, null, null]);
  const [quiz1ShowFeedback, setQuiz1ShowFeedback] = useState<boolean[]>([false, false, false]);
  const [quiz1Completed, setQuiz1Completed] = useState(false);

  // Comprehension Check 2 state
  const [cc2Answers, setCc2Answers] = useState<(number | null)[]>([null, null, null]);
  const [cc2ShowFeedback, setCc2ShowFeedback] = useState<boolean[]>([false, false, false]);
  const [cc2Completed, setCc2Completed] = useState(false);

  // Quiz 2 state
  const [quiz2Matching, setQuiz2Matching] = useState<Record<number, string>>({});
  const [quiz2TrueFalse, setQuiz2TrueFalse] = useState<boolean | null>(null);
  const [quiz2ShowFeedback, setQuiz2ShowFeedback] = useState(false);
  const [quiz2Completed, setQuiz2Completed] = useState(false);

  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Register activities with the ActivityRegistry for dev mode
  useEffect(() => {
    clearRegistry();

    phases.forEach((phase, index) => {
      const activity = {
        id: phase,
        moduleId: MODULE_ID,
        type: phase === 'certificate' ? 'certificate' as const :
              phase.includes('video') ? 'video' as const :
              phase.includes('exit') ? 'reflection' as const :
              'interactive' as const,
        name: phase.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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

  // Listen for dev mode activity navigation
  useEffect(() => {
    const handleGoToActivity = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      const targetIndex = customEvent.detail;
      if (targetIndex >= 0 && targetIndex < phases.length) {
        setPhase(phases[targetIndex]);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity);
    return () => window.removeEventListener('goToActivity', handleGoToActivity);
  }, [phases]);

  // Navigation helpers
  const completePhase = useCallback((currentPhase: Phase) => {
    setCompletedPhases(prev => new Set([...prev, currentPhase]));
  }, []);

  const advanceToNextPhase = useCallback(() => {
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < phases.length) {
      completePhase(phase);
      setPhase(phases[nextIndex]);
    }
  }, [currentPhaseIndex, phase, phases, completePhase]);

  // Handle resume dialog
  const handleResumeProgress = () => {
    if (savedProgress && savedProgress.activityIndex !== undefined) {
      setPhase(phases[savedProgress.activityIndex]);
      const completed = new Set<Phase>();
      phaseActivities.forEach((activity, index) => {
        if (activity.completed && index < savedProgress.activityIndex!) {
          completed.add(activity.id as Phase);
        }
      });
      setCompletedPhases(completed);
    }
    setShowResumeDialog(false);
  };

  const handleStartFresh = () => {
    clearProgress(MODULE_ID);
    setShowResumeDialog(false);
  };

  // Exit ticket handlers
  const handleExitSubmit = async () => {
    if (!exitResponse.trim()) return;

    const EXIT_PROMPTS = [
      "Think about the AI tools you use daily (social media algorithms, homework helpers, gaming AI, recommendation systems). Choose ONE tool and explain how applying ONE of the three principles (Human Dignity, Common Good, or Solidarity) could make that tool better for teen users. Be specific about what would change and why it matters to you.",
      "The video suggests we need 'courage' to choose ethical AI over speed and profit. What pressures do you think make it hard for companies to slow down and consider ethics? What could motivate them to change? Consider both business factors (money, competition) and social factors (public pressure, regulations) in your response.",
      "You're part of the generation that will shape how AI develops. Based on what you learned about Catholic Social Teaching's approach to the Industrial Revolution, what lesson from history do you think is most important for your generation to remember as AI becomes more powerful? Explain how you personally might apply this lesson."
    ];

    // Pre-filter
    const isInvalid = isNonsensical(exitResponse);

    setIsLoadingFeedback(true);

    try {
      const feedback = await generateEducationFeedback(
        exitResponse,
        EXIT_PROMPTS[selectedExitPrompt]
      );

      const feedbackIndicatesRetry =
        feedback.toLowerCase().includes('does not address') ||
        feedback.toLowerCase().includes('please re-read') ||
        feedback.toLowerCase().includes('inappropriate language') ||
        feedback.toLowerCase().includes('off-topic') ||
        feedback.toLowerCase().includes('must elaborate') ||
        feedback.toLowerCase().includes('insufficient') ||
        feedback.toLowerCase().includes('needs more depth') ||
        feedback.toLowerCase().includes('random text') ||
        feedback.toLowerCase().includes('answer the original question');

      setExitFeedback(feedback);
      setExitShowFeedback(true);
      setExitNeedsRetry(isInvalid || feedbackIndicatesRetry);

      if (isInvalid || feedbackIndicatesRetry) {
        const newAttemptCount = exitAttemptCount + 1;
        setExitAttemptCount(newAttemptCount);
        if (newAttemptCount >= MAX_EXIT_ATTEMPTS) {
          setExitShowEscapeHatch(true);
        }
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      setExitFeedback('Unable to process feedback at this time. Please try again.');
      setExitShowFeedback(true);
      setExitNeedsRetry(false);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleExitRetry = () => {
    setExitResponse('');
    setExitFeedback('');
    setExitShowFeedback(false);
    setExitNeedsRetry(false);
    setExitAttemptCount(0);
    setExitShowEscapeHatch(false);
  };

  const handleExitContinueAnyway = () => {
    console.log('Student bypassed validation after', exitAttemptCount, 'attempts');
    advanceToNextPhase();
  };

  // Certificate download handler
  const handleCertificateDownload = () => {
    clearProgress(MODULE_ID);
    if (onComplete) {
      onComplete();
    }
  };

  // Render welcome screen
  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-12 h-12 text-blue-600" />
            <CardTitle className="text-3xl font-bold text-gray-900">
              AI Ethics: An Ancient Compass
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-900">
          <p className="text-lg leading-relaxed">
            Welcome, {userName}! In this module, you'll explore how ancient wisdom can guide us through the modern AI revolution.
          </p>

          <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <BookOpen className="w-6 h-6 text-blue-600" />
              About This Module
            </h3>
            <p className="text-gray-800 leading-relaxed mb-4">
              This module explores <strong>Catholic Social Teaching</strong> as one approach to AI ethics.
              For over a century, these principles have guided responses to technological change,
              from the Industrial Revolution to today's AI revolution.
            </p>
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Students of all backgrounds are invited to engage with this framework.</strong> While
              rooted in Catholic tradition, the three core principles—Human Dignity, Common Good, and
              Solidarity—offer universal values that can inform anyone's thinking about technology and society.
            </p>
            <p className="text-gray-800 leading-relaxed">
              Many religious and secular ethical frameworks exist. This module presents one historically
              significant approach, and you're encouraged to consider how your own values and beliefs
              might guide your relationship with AI technology.
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg border border-blue-300">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <Sparkles className="w-6 h-6 text-blue-600" />
              What You'll Learn
            </h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>How the AI revolution parallels the Industrial Revolution</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Three ethical principles: Human Dignity, Common Good, and Solidarity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>How to apply ethical frameworks to real-world AI dilemmas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Practical steps you can take to use AI ethically</span>
              </li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={advanceToNextPhase}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Begin Your Journey
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Render video segments
  const renderVideoSegment = (segmentIndex: number) => {
    const segment = VIDEO_CONFIG.segments[segmentIndex];

    const getSegmentIcon = () => {
      switch (segmentIndex) {
        case 0: return <Factory className="w-8 h-8 text-orange-400" />;
        case 1: return <BookOpen className="w-8 h-8 text-purple-400" />;
        case 2: return <Compass className="w-8 h-8 text-blue-400" />;
        case 3: return <Users className="w-8 h-8 text-green-400" />;
        case 4: return <Heart className="w-8 h-8 text-red-400" />;
        default: return <Video className="w-8 h-8 text-white" />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {getSegmentIcon()}
              <h2 className="text-2xl font-bold text-gray-900">{segment.title}</h2>
            </div>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <PremiumVideoPlayer
                videoUrl={VIDEO_CONFIG.url}
                segments={[{
                  id: segment.id,
                  title: segment.title,
                  source: 'ancient-compass',
                  start: segment.startTime,
                  end: segment.endTime,
                  description: `Video segment: ${segment.title}`,
                  mandatory: true
                }]}
                videoId="ancient-compass"
                onSegmentComplete={() => {
                  setTimeout(advanceToNextPhase, 1000);
                }}
                hideSegmentNavigator={true}
                allowSeeking={isDevModeActive}
                enableSubtitles={true}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Render Quiz 2: Three Principles Check
  const renderQuiz2 = () => {
    const handleMatchingSelect = (exampleId: number, principle: string) => {
      setQuiz2Matching(prev => ({
        ...prev,
        [exampleId]: principle
      }));
    };

    const handleTrueFalseSelect = (value: boolean) => {
      setQuiz2TrueFalse(value);
      setQuiz2ShowFeedback(true);
    };

    const allMatchingCorrect = QUIZ_2_QUESTIONS.matching.every(
      item => quiz2Matching[item.id] === item.correctPrinciple
    );
    const allMatchingAnswered = QUIZ_2_QUESTIONS.matching.every(
      item => quiz2Matching[item.id] !== undefined
    );
    const trueFalseCorrect = quiz2TrueFalse === QUIZ_2_QUESTIONS.trueFalse.correctAnswer;
    const allCorrect = allMatchingCorrect && trueFalseCorrect;
    const allAnswered = allMatchingAnswered && quiz2TrueFalse !== null;

    const principles = ['Human Dignity', 'Common Good', 'Solidarity'];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-600" />
              Quiz: Three Principles Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Matching Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">
                Match each example to the correct principle:
              </h3>

              {QUIZ_2_QUESTIONS.matching.map((item) => {
                const isCorrect = quiz2Matching[item.id] === item.correctPrinciple;
                const showFeedback = quiz2Matching[item.id] !== undefined;

                return (
                  <div key={item.id} className="space-y-2">
                    <p className="text-gray-900 font-medium">{item.example}</p>
                    <div className="flex gap-2 flex-wrap">
                      {principles.map((principle) => {
                        const isSelected = quiz2Matching[item.id] === principle;

                        return (
                          <button
                            key={principle}
                            onClick={() => handleMatchingSelect(item.id, principle)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              showFeedback && isSelected && isCorrect
                                ? 'border-green-500 bg-green-50 text-gray-900'
                                : showFeedback && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50 text-gray-900'
                                : isSelected
                                ? 'border-blue-500 bg-blue-50 text-gray-900'
                                : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                            }`}
                          >
                            {principle}
                            {isSelected && (
                              <CheckCircle2 className={`inline-block ml-2 w-4 h-4 ${
                                showFeedback && isCorrect ? 'text-green-600' : 'text-blue-600'
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* True/False Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg text-gray-900">
                True or False:
              </h3>
              <p className="text-gray-900 font-medium">
                "{QUIZ_2_QUESTIONS.trueFalse.statement}"
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleTrueFalseSelect(true)}
                  className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                    quiz2ShowFeedback && quiz2TrueFalse === true && !trueFalseCorrect
                      ? 'border-red-500 bg-red-50'
                      : quiz2TrueFalse === true
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg font-semibold text-gray-900">True</span>
                </button>
                <button
                  onClick={() => handleTrueFalseSelect(false)}
                  className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                    quiz2ShowFeedback && quiz2TrueFalse === false && trueFalseCorrect
                      ? 'border-green-500 bg-green-50'
                      : quiz2TrueFalse === false
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg font-semibold text-gray-900">False</span>
                </button>
              </div>

              {quiz2ShowFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-lg ${
                    trueFalseCorrect
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-yellow-100 border border-yellow-300'
                  }`}
                >
                  <p className="text-sm text-gray-900">
                    {QUIZ_2_QUESTIONS.trueFalse.explanation}
                  </p>
                </motion.div>
              )}
            </div>

            {allAnswered && allCorrect && !quiz2Completed && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setQuiz2Completed(true);
                    advanceToNextPhase();
                  }}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  Continue to Next Activity
                </Button>
              </div>
            )}

            {allAnswered && !allCorrect && (
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <p className="text-sm text-gray-900">
                  Review your answers. All questions must be correct to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Render Comprehension Check 2: Rerum Novarum
  const renderComprehensionCheck2 = () => {
    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
      const newAnswers = [...cc2Answers];
      newAnswers[questionIndex] = answerIndex;
      setCc2Answers(newAnswers);

      const newFeedback = [...cc2ShowFeedback];
      newFeedback[questionIndex] = true;
      setCc2ShowFeedback(newFeedback);
    };

    const allCorrect = cc2Answers.every((answer, index) => answer === COMPREHENSION_CHECK_2_QUESTIONS[index].correctAnswer);
    const allAnswered = cc2Answers.every(answer => answer !== null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Comprehension Check: Echoes from the Past
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {COMPREHENSION_CHECK_2_QUESTIONS.map((q, qIndex) => (
              <div key={qIndex} className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {qIndex + 1}. {q.question}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => {
                    const isSelected = cc2Answers[qIndex] === oIndex;
                    const isCorrect = oIndex === q.correctAnswer;
                    const showFeedback = cc2ShowFeedback[qIndex];

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showFeedback && isCorrect
                            ? 'border-green-500 bg-green-50'
                            : showFeedback && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showFeedback && isCorrect
                              ? 'border-green-600 bg-green-600'
                              : showFeedback && isSelected && !isCorrect
                              ? 'border-red-600 bg-red-600'
                              : isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {((showFeedback && isCorrect) || isSelected) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {cc2ShowFeedback[qIndex] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-lg ${
                      cc2Answers[qIndex] === q.correctAnswer
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-yellow-100 border border-yellow-300'
                    }`}
                  >
                    <p className="text-sm text-gray-900">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            ))}

            {allAnswered && allCorrect && !cc2Completed && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setCc2Completed(true);
                    advanceToNextPhase();
                  }}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  Continue to Next Activity
                </Button>
              </div>
            )}

            {allAnswered && !allCorrect && (
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <p className="text-sm text-gray-900">
                  Review the questions and try selecting the correct answers. All questions must be correct to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Render Quiz 1: Understanding the Parallel
  const renderQuiz1 = () => {
    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
      const newAnswers = [...quiz1Answers];
      newAnswers[questionIndex] = answerIndex;
      setQuiz1Answers(newAnswers);

      const newFeedback = [...quiz1ShowFeedback];
      newFeedback[questionIndex] = true;
      setQuiz1ShowFeedback(newFeedback);
    };

    const allCorrect = quiz1Answers.every((answer, index) => answer === QUIZ_1_QUESTIONS[index].correctAnswer);
    const allAnswered = quiz1Answers.every(answer => answer !== null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Quiz: Understanding the Parallel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {QUIZ_1_QUESTIONS.map((q, qIndex) => (
              <div key={qIndex} className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {qIndex + 1}. {q.question}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => {
                    const isSelected = quiz1Answers[qIndex] === oIndex;
                    const isCorrect = oIndex === q.correctAnswer;
                    const showFeedback = quiz1ShowFeedback[qIndex];

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showFeedback && isCorrect
                            ? 'border-green-500 bg-green-50'
                            : showFeedback && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showFeedback && isCorrect
                              ? 'border-green-600 bg-green-600'
                              : showFeedback && isSelected && !isCorrect
                              ? 'border-red-600 bg-red-600'
                              : isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {((showFeedback && isCorrect) || isSelected) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {quiz1ShowFeedback[qIndex] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-lg ${
                      quiz1Answers[qIndex] === q.correctAnswer
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-yellow-100 border border-yellow-300'
                    }`}
                  >
                    <p className="text-sm text-gray-900">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            ))}

            {allAnswered && allCorrect && !quiz1Completed && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setQuiz1Completed(true);
                    advanceToNextPhase();
                  }}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  Continue to Next Activity
                </Button>
              </div>
            )}

            {allAnswered && !allCorrect && (
              <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                <p className="text-sm text-gray-900">
                  Review the questions and try selecting the correct answers. All questions must be correct to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Render Exit Ticket
  const renderExitTicket = () => {
    const EXIT_PROMPTS = [
      {
        title: 'Personal Application',
        prompt: "Think about the AI tools you use daily (social media algorithms, homework helpers, gaming AI, recommendation systems). Choose ONE tool and explain how applying ONE of the three principles (Human Dignity, Common Good, or Solidarity) could make that tool better for teen users. Be specific about what would change and why it matters to you."
      },
      {
        title: 'Critical Analysis',
        prompt: "The video suggests we need 'courage' to choose ethical AI over speed and profit. What pressures do you think make it hard for companies to slow down and consider ethics? What could motivate them to change? Consider both business factors (money, competition) and social factors (public pressure, regulations) in your response."
      },
      {
        title: 'Future Responsibility',
        prompt: "You're part of the generation that will shape how AI develops. Based on what you learned about Catholic Social Teaching's approach to the Industrial Revolution, what lesson from history do you think is most important for your generation to remember as AI becomes more powerful? Explain how you personally might apply this lesson."
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Exit Ticket: Final Reflection
            </CardTitle>
            <p className="text-gray-700 mt-2">
              Choose one prompt and write a thoughtful response (minimum 50 words). This is your chance to demonstrate what you've learned about AI ethics.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Selection */}
            {!exitShowFeedback && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Select a prompt:</h3>
                <div className="space-y-3">
                  {EXIT_PROMPTS.map((promptOption, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedExitPrompt(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedExitPrompt === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{promptOption.title}</h4>
                      <p className="text-sm text-gray-700">{promptOption.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Response Input */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Your Response:</h4>
              <Textarea
                value={exitResponse}
                onChange={(e) => setExitResponse(e.target.value)}
                placeholder="Write your thoughtful response here (minimum 50 words)..."
                rows={10}
                disabled={exitShowFeedback && !exitNeedsRetry}
                className="w-full text-gray-900"
              />
              <p className="text-xs text-gray-600">
                {exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length} words (minimum 50 required)
              </p>
            </div>

            {/* Feedback Display */}
            {exitShowFeedback && exitFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 ${
                  exitNeedsRetry
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{exitFeedback}</p>
              </motion.div>
            )}

            {/* Escape Hatch */}
            {exitShowEscapeHatch && exitNeedsRetry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-100 p-6 rounded-lg border-2 border-orange-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Multiple Attempts Detected
                    </h4>
                    <p className="text-sm text-gray-800 mb-4">
                      You've tried {exitAttemptCount} times. You can either:
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleExitRetry}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Try One More Time
                  </Button>
                  <Button
                    onClick={handleExitContinueAnyway}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Continue Anyway
                  </Button>
                </div>
                <p className="text-xs text-gray-700 mt-3 italic">
                  ⚠️ Note: Continuing without a complete response may be flagged for instructor review.
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            {!exitShowFeedback && exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 && (
              <Button
                onClick={handleExitSubmit}
                size="lg"
                disabled={isLoadingFeedback}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoadingFeedback ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Getting Feedback...
                  </>
                ) : (
                  <>
                    Submit Response
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            )}

            {/* Continue After Good Feedback */}
            {exitShowFeedback && !exitNeedsRetry && (
              <Button
                onClick={advanceToNextPhase}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="mr-2 w-5 h-5" />
                Continue to Certificate
              </Button>
            )}

            {/* Retry Button */}
            {exitShowFeedback && exitNeedsRetry && !exitShowEscapeHatch && (
              <Button
                onClick={handleExitRetry}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Render appropriate phase
  const renderPhase = () => {
    switch (phase) {
      case 'welcome':
        return renderWelcome();

      case 'video-1-industrial-revolution':
        return renderVideoSegment(0);

      case 'quiz-1-understanding-parallel':
        return renderQuiz1();

      case 'activity-1-revolution-comparison':
        return <RevolutionComparisonChart onComplete={advanceToNextPhase} />;

      case 'video-2-echo-from-past':
        return renderVideoSegment(1);

      case 'comprehension-check-2-rerum-novarum':
        return renderComprehensionCheck2();

      case 'video-3-compass-for-humanity':
        return renderVideoSegment(2);

      case 'quiz-2-three-principles':
        return renderQuiz2();

      case 'activity-2-ethical-dilemmas':
        return <EthicalDilemmaScenarios onComplete={advanceToNextPhase} />;

      case 'video-4-principle-to-practice':
        return renderVideoSegment(3);

      case 'activity-3-stakeholder-perspectives':
        return <StakeholderPerspectives onComplete={advanceToNextPhase} />;

      case 'video-5-choice-we-face':
        return renderVideoSegment(4);

      case 'activity-4-personal-ai-audit':
        return <PersonalAIAudit onComplete={advanceToNextPhase} />;

      case 'exit-ticket':
        return renderExitTicket();

      case 'certificate':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <Certificate
              userName={userName}
              courseName="AI Ethics: An Ancient Compass"
              completionDate={new Date().toLocaleDateString()}
              score={100}
              instructor="AI Literacy Platform"
            />
          </motion.div>
        );

      default:
        return (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-gray-900">Phase "{phase}" is under development.</p>
              <Button onClick={advanceToNextPhase} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {showResumeDialog && savedProgress && savedProgress.exists && (
        <ResumeProgressDialog
          activityIndex={savedProgress.activityIndex || 0}
          activityTitle={savedProgress.activityTitle || 'Unknown Activity'}
          totalActivities={savedProgress.totalActivities || phases.length}
          lastUpdated={savedProgress.lastUpdated || 'Unknown'}
          onResume={handleResumeProgress}
          onStartOver={handleStartFresh}
        />
      )}

      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  );
}
