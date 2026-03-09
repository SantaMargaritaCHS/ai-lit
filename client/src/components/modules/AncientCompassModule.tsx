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
  Sparkles,
  Zap,
  Shield
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
  | 'honor-code-pledge'
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
      startTime: 115, // 1:55:00 (adjusted +0.5s for cleaner start)
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
      endTime: 447.5, // 7:27.5 (duration 1:09.5)
      pausePoint: 447.5
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
    explanation: "Correct! The industrialization of thought refers to AI systems automating cognitive, mental, and creative tasks—similar to how the Industrial Revolution automated physical labor.",
    hint: "Think about what the Industrial Revolution automated (physical labor). What is AI automating now? Consider what 'thought' and 'mental work' mean in this context."
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
    explanation: "Exactly! Both represent new skills that workers need to learn to interact with revolutionary technology of their era.",
    hint: "The video emphasizes parallels between two time periods. What did workers in the 1800s need to learn? What do workers today need to learn? Think about the core similarity."
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
    explanation: "Perfect! Both the Industrial Revolution and the AI Revolution are transformative technological shifts that require ethical frameworks to ensure they benefit humanity.",
    hint: "The video isn't just making a simple comparison about machines. Think about the bigger picture: what challenge did society face in both eras? Consider the ethical dimension."
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
    explanation: "Correct! The video uses the historical example of Rerum Novarum to show that society has successfully navigated major technological shifts using ethical frameworks before.",
    hint: "The video is using history as a lesson. Why would it share a story from the past? What does this historical example demonstrate about dealing with new technology?"
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
    explanation: "That's right! Rerum Novarum was a papal document that established principles to protect workers during the Industrial Revolution.",
    hint: "The Latin name suggests it's an official document, not a physical object or organization. What kind of document would address ethical concerns during the Industrial Revolution?"
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
    explanation: "Exactly! Catholic Social Teaching aimed to find a balance between extreme capitalism (which exploited workers) and extreme socialism (which erased individual dignity).",
    hint: "A 'middle path between extremes' suggests two opposing economic systems. Think about the major economic debates of the Industrial Revolution era—what were the two competing approaches?"
  }
];

// Quiz 2 questions
const QUIZ_2_QUESTIONS = {
  matching: [
    {
      example: "Ensuring rural students have equal access to AI education tools",
      correctPrinciple: "Common Good",
      id: 1,
      hint: "This is about access for everyone, not just those who can easily afford or access technology. Which principle focuses on ensuring everyone can participate?"
    },
    {
      example: "Requiring human oversight for AI hiring decisions",
      correctPrinciple: "Human Dignity",
      id: 2,
      hint: "This is about preventing AI from making major life decisions without human input. Which principle emphasizes that humans shouldn't be treated as just data points?"
    },
    {
      example: "Everyone working together to fix biased algorithms",
      correctPrinciple: "Solidarity",
      id: 3,
      hint: "Notice the emphasis on 'everyone working together' and 'collective action.' Which principle is about unity and mutual support?"
    }
  ],
  trueFalse: {
    statement: "The Common Good principle means AI should benefit the majority of people.",
    correctAnswer: false,
    explanation: "The Common Good means AI should allow EVERYONE to thrive, not just most people. It's about ensuring technology benefits all members of society, especially marginalized groups, not just the majority.",
    hint: "Read the statement carefully. Does 'majority' mean the same thing as 'everyone'? Think about what happens to minorities if we only focus on the majority."
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
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  // Define all phases for navigation
  const phases: Phase[] = [
    'welcome',
    'honor-code-pledge',
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

  // Render honor code pledge
  const renderHonorCodePledge = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
            <CardTitle className="text-3xl font-bold text-gray-900">
              Building a Culture of Integrity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-900">
          <p className="text-lg leading-relaxed">
            Before we begin, please read and accept the Honor Code Pledge.
          </p>

          <div className="bg-white p-8 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 uppercase tracking-wide">
              Honor Code Pledge
            </h3>
            <div className="text-gray-800 leading-relaxed space-y-4">
              <p>By turning in this assignment, I confirm that:</p>
              <ul className="space-y-3 ml-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">&bull;</span>
                  <span>This assignment is the result of my own work and thinking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">&bull;</span>
                  <span>I have acknowledged the assistance of all sources used in the preparation of my work by properly citing all sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">&bull;</span>
                  <span>I understand and uphold the SMCHS Honor Code</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg border border-blue-300">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pledgeAccepted}
                onChange={(e) => setPledgeAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                aria-label="I accept the Honor Code Pledge"
              />
              <span className="text-gray-800 leading-relaxed">
                I have read and I accept the Honor Code Pledge.
              </span>
            </label>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={advanceToNextPhase}
              disabled={!pledgeAccepted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            {!pledgeAccepted && (
              <p className="text-sm text-gray-500 mt-2">
                Please accept the Honor Code Pledge to continue.
              </p>
            )}
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
    };

    const checkAnswers = () => {
      setQuiz2ShowFeedback(true);
    };

    const handleTryAgain = () => {
      // Complete reset - blank slate
      setQuiz2Matching({});
      setQuiz2TrueFalse(null);
      setQuiz2ShowFeedback(false);
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
                const showFeedback = quiz2ShowFeedback;
                const hasAnswer = quiz2Matching[item.id] !== undefined;

                return (
                  <div key={item.id} className="space-y-2">
                    <p className="text-gray-900 font-medium">{item.example}</p>
                    <div className="flex gap-2 flex-wrap">
                      {principles.map((principle) => {
                        const isSelected = quiz2Matching[item.id] === principle;
                        const isPrincipleCorrect = item.correctPrinciple === principle;
                        const isSelectedAndCorrect = isSelected && isCorrect;
                        const isSelectedAndWrong = isSelected && !isCorrect;

                        // Only show green if student selected the correct answer
                        const showAsCorrect = showFeedback && isSelectedAndCorrect;

                        return (
                          <label
                            key={principle}
                            className={`px-4 py-2 rounded-lg border-2 transition-all inline-block ${
                              quiz2ShowFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              showAsCorrect
                                ? 'border-green-500 bg-green-50 text-gray-900'
                                : showFeedback && isSelectedAndWrong
                                ? 'border-red-500 bg-red-50 text-gray-900'
                                : isSelected
                                ? 'border-blue-500 bg-blue-50 text-gray-900'
                                : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz2-matching-${item.id}`}
                              checked={isSelected}
                              onChange={() => handleMatchingSelect(item.id, principle)}
                              disabled={quiz2ShowFeedback}
                              className="sr-only"
                            />
                            {principle}
                            {isSelected && (
                              <CheckCircle2 className={`inline-block ml-2 w-4 h-4 ${
                                showAsCorrect ? 'text-green-600' : 'text-blue-600'
                              }`} />
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {/* Show hint for wrong answers (never reveal correct answer) */}
                    {showFeedback && hasAnswer && !isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-lg bg-yellow-100 border border-yellow-300 mt-2"
                      >
                        <p className="text-sm text-gray-900">
                          <strong>Not quite!</strong> {item.hint}
                        </p>
                      </motion.div>
                    )}
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
                <label
                  className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                    quiz2ShowFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                  } ${
                    quiz2ShowFeedback && quiz2TrueFalse === true && !trueFalseCorrect
                      ? 'border-red-500 bg-red-50'
                      : quiz2TrueFalse === true
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz2-truefalse"
                    checked={quiz2TrueFalse === true}
                    onChange={() => handleTrueFalseSelect(true)}
                    disabled={quiz2ShowFeedback}
                    className="sr-only"
                  />
                  <span className="text-lg font-semibold text-gray-900">True</span>
                </label>
                <label
                  className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                    quiz2ShowFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                  } ${
                    quiz2ShowFeedback && quiz2TrueFalse === false && trueFalseCorrect
                      ? 'border-green-500 bg-green-50'
                      : quiz2TrueFalse === false
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz2-truefalse"
                    checked={quiz2TrueFalse === false}
                    onChange={() => handleTrueFalseSelect(false)}
                    disabled={quiz2ShowFeedback}
                    className="sr-only"
                  />
                  <span className="text-lg font-semibold text-gray-900">False</span>
                </label>
              </div>

              {/* Only show explanation if student got it right */}
              {quiz2ShowFeedback && trueFalseCorrect && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-lg bg-green-100 border border-green-300"
                >
                  <p className="text-sm text-gray-900">
                    {QUIZ_2_QUESTIONS.trueFalse.explanation}
                  </p>
                </motion.div>
              )}

              {/* Show hint for wrong answer (never reveal correct answer) */}
              {quiz2ShowFeedback && !trueFalseCorrect && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-lg bg-yellow-100 border border-yellow-300"
                >
                  <p className="text-sm text-gray-900">
                    <strong>Not quite!</strong> {QUIZ_2_QUESTIONS.trueFalse.hint}
                  </p>
                </motion.div>
              )}
            </div>

            {allAnswered && !quiz2ShowFeedback && (
              <div className="pt-4">
                <Button
                  onClick={checkAnswers}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Check My Answers
                </Button>
              </div>
            )}

            {quiz2ShowFeedback && allAnswered && allCorrect && !quiz2Completed && (
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

            {quiz2ShowFeedback && allAnswered && !allCorrect && (
              <div className="pt-4">
                <Button
                  onClick={handleTryAgain}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
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
    };

    const checkAnswers = () => {
      const newFeedback = COMPREHENSION_CHECK_2_QUESTIONS.map(() => true);
      setCc2ShowFeedback(newFeedback);
    };

    const handleTryAgain = () => {
      // Complete reset - blank slate
      setCc2Answers([null, null, null]);
      setCc2ShowFeedback([false, false, false]);
    };

    const allCorrect = cc2Answers.every((answer, index) => answer === COMPREHENSION_CHECK_2_QUESTIONS[index].correctAnswer);
    const allAnswered = cc2Answers.every(answer => answer !== null);
    const anyFeedbackShown = cc2ShowFeedback.some(shown => shown);

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
                    const isSelectedAndCorrect = isSelected && isCorrect;
                    const isSelectedAndWrong = isSelected && !isCorrect;

                    // Only show green if student selected the correct answer
                    const showAsCorrect = showFeedback && isSelectedAndCorrect;

                    return (
                      <label
                        key={oIndex}
                        className={`w-full block p-4 rounded-lg border-2 transition-all ${
                          anyFeedbackShown ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                        } ${
                          showAsCorrect
                            ? 'border-green-500 bg-green-50'
                            : showFeedback && isSelectedAndWrong
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`cc2-question-${qIndex}`}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(qIndex, oIndex)}
                          disabled={anyFeedbackShown}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showAsCorrect
                              ? 'border-green-600 bg-green-600'
                              : showFeedback && isSelectedAndWrong
                              ? 'border-red-600 bg-red-600'
                              : isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {(showAsCorrect || isSelected) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Only show explanation if student got it right */}
                {cc2ShowFeedback[qIndex] && cc2Answers[qIndex] === q.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg bg-green-100 border border-green-300"
                  >
                    <p className="text-sm text-gray-900">{q.explanation}</p>
                  </motion.div>
                )}

                {/* Show hint for wrong answers (never reveal the correct answer) */}
                {cc2ShowFeedback[qIndex] && cc2Answers[qIndex] !== q.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg bg-yellow-100 border border-yellow-300"
                  >
                    <p className="text-sm text-gray-900">
                      <strong>Not quite!</strong> {q.hint}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}

            {allAnswered && !anyFeedbackShown && (
              <div className="pt-4">
                <Button
                  onClick={checkAnswers}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Check My Answers
                </Button>
              </div>
            )}

            {anyFeedbackShown && allAnswered && allCorrect && !cc2Completed && (
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

            {anyFeedbackShown && allAnswered && !allCorrect && (
              <div className="pt-4">
                <Button
                  onClick={handleTryAgain}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
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
    };

    const checkAnswers = () => {
      const newFeedback = QUIZ_1_QUESTIONS.map(() => true);
      setQuiz1ShowFeedback(newFeedback);
    };

    const handleTryAgain = () => {
      // Complete reset - blank slate
      setQuiz1Answers([null, null, null]);
      setQuiz1ShowFeedback([false, false, false]);
    };

    const allCorrect = quiz1Answers.every((answer, index) => answer === QUIZ_1_QUESTIONS[index].correctAnswer);
    const allAnswered = quiz1Answers.every(answer => answer !== null);
    const anyFeedbackShown = quiz1ShowFeedback.some(shown => shown);

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
                    const isSelectedAndCorrect = isSelected && isCorrect;
                    const isSelectedAndWrong = isSelected && !isCorrect;

                    // Only show green if student selected the correct answer
                    const showAsCorrect = showFeedback && isSelectedAndCorrect;

                    return (
                      <label
                        key={oIndex}
                        className={`w-full block p-4 rounded-lg border-2 transition-all ${
                          anyFeedbackShown ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                        } ${
                          showAsCorrect
                            ? 'border-green-500 bg-green-50'
                            : showFeedback && isSelectedAndWrong
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz1-question-${qIndex}`}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(qIndex, oIndex)}
                          disabled={anyFeedbackShown}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showAsCorrect
                              ? 'border-green-600 bg-green-600'
                              : showFeedback && isSelectedAndWrong
                              ? 'border-red-600 bg-red-600'
                              : isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {(showAsCorrect || isSelected) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Only show explanation if student got it right */}
                {quiz1ShowFeedback[qIndex] && quiz1Answers[qIndex] === q.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg bg-green-100 border border-green-300"
                  >
                    <p className="text-sm text-gray-900">{q.explanation}</p>
                  </motion.div>
                )}

                {/* Show hint for wrong answers (never reveal the correct answer) */}
                {quiz1ShowFeedback[qIndex] && quiz1Answers[qIndex] !== q.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg bg-yellow-100 border border-yellow-300"
                  >
                    <p className="text-sm text-gray-900">
                      <strong>Not quite!</strong> {q.hint}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}

            {allAnswered && !anyFeedbackShown && (
              <div className="pt-4">
                <Button
                  onClick={checkAnswers}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Check My Answers
                </Button>
              </div>
            )}

            {anyFeedbackShown && allAnswered && allCorrect && !quiz1Completed && (
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

            {anyFeedbackShown && allAnswered && !allCorrect && (
              <div className="pt-4">
                <Button
                  onClick={handleTryAgain}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
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

            {/* Dev Mode Shortcuts */}
            {isDevModeActive && !exitShowFeedback && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Developer Mode: Exit Ticket Shortcuts
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      const goodResponses = [
                        "I use Instagram's recommendation algorithm daily, and applying Human Dignity would mean giving users more control over what they see instead of just maximizing engagement time. Currently, the algorithm shows content designed to keep me scrolling endlessly, treating me like an engagement metric rather than a person with agency and time limits. If Instagram respected Human Dignity, they would add features like 'time well spent' summaries showing if I'm actually connecting with friends or just consuming content, plus easy tools to customize my feed based on my values rather than just what keeps me clicking. This matters to me because I've noticed how the algorithm can make me feel worse about myself by showing idealized content, but I keep using it because all my friends are there. Respecting my dignity would mean acknowledging I'm a whole person who deserves transparency about how my attention is being directed, not just a user to monetize.",
                        "Companies face immense pressure to prioritize speed over ethics because their competitors will capture market share if they slow down. In tech, there's a 'move fast and break things' culture where being first to market often determines who dominates an entire industry - think how Google dominates search or how TikTok exploded by perfecting addictive algorithms before competitors could catch up. Financially, investors demand rapid growth and higher stock prices, so executives who slow down for ethics reviews risk being replaced by boards. However, what could motivate change is a combination of public backlash (like when Apple faced criticism over App Store policies and actually made changes) and smart regulation that levels the playing field so ethical companies aren't punished. If regulations required all social media companies to disclose algorithmic impacts on teen mental health, suddenly ethics becomes a competitive necessity rather than a disadvantage. Additionally, younger consumers like my generation increasingly care about corporate values and might choose ethical alternatives if they existed and were well-marketed.",
                        "The most important lesson from Catholic Social Teaching's response to the Industrial Revolution is that technological change doesn't automatically lead to human progress - we have to actively ensure technology serves human dignity rather than just profit. During the Industrial Revolution, people initially thought factories would make everyone's lives better, but instead we got child labor, dangerous conditions, and extreme inequality until society pushed back with regulations and unions. For AI, my generation needs to remember that just because we can automate something doesn't mean we should, and that the people most affected by AI systems (like gig workers or students) deserve a voice in how those systems work. I personally can apply this by questioning whether AI tools I use actually help me learn and grow, or if they're just making me dependent and less capable. For example, I've started using AI to help me understand difficult concepts rather than just giving me answers, which means I'm treating it as a tool for my development rather than a replacement for thinking."
                      ];
                      setExitResponse(goodResponses[selectedExitPrompt]);
                      setExitFeedback("Excellent reflection! Your response demonstrates deep engagement with the ethical principles and thoughtful consideration of real-world applications.");
                      setExitShowFeedback(true);
                      setExitNeedsRetry(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Auto-Fill & Show Good Feedback
                  </Button>
                  <Button
                    onClick={() => {
                      const goodResponses = [
                        "I use Instagram's recommendation algorithm daily, and applying Human Dignity would mean giving users more control over what they see instead of just maximizing engagement time. Currently, the algorithm shows content designed to keep me scrolling endlessly, treating me like an engagement metric rather than a person with agency and time limits. If Instagram respected Human Dignity, they would add features like 'time well spent' summaries showing if I'm actually connecting with friends or just consuming content, plus easy tools to customize my feed based on my values rather than just what keeps me clicking. This matters to me because I've noticed how the algorithm can make me feel worse about myself by showing idealized content, but I keep using it because all my friends are there. Respecting my dignity would mean acknowledging I'm a whole person who deserves transparency about how my attention is being directed, not just a user to monetize.",
                        "Companies face immense pressure to prioritize speed over ethics because their competitors will capture market share if they slow down. In tech, there's a 'move fast and break things' culture where being first to market often determines who dominates an entire industry - think how Google dominates search or how TikTok exploded by perfecting addictive algorithms before competitors could catch up. Financially, investors demand rapid growth and higher stock prices, so executives who slow down for ethics reviews risk being replaced by boards. However, what could motivate change is a combination of public backlash (like when Apple faced criticism over App Store policies and actually made changes) and smart regulation that levels the playing field so ethical companies aren't punished. If regulations required all social media companies to disclose algorithmic impacts on teen mental health, suddenly ethics becomes a competitive necessity rather than a disadvantage. Additionally, younger consumers like my generation increasingly care about corporate values and might choose ethical alternatives if they existed and were well-marketed.",
                        "The most important lesson from Catholic Social Teaching's response to the Industrial Revolution is that technological change doesn't automatically lead to human progress - we have to actively ensure technology serves human dignity rather than just profit. During the Industrial Revolution, people initially thought factories would make everyone's lives better, but instead we got child labor, dangerous conditions, and extreme inequality until society pushed back with regulations and unions. For AI, my generation needs to remember that just because we can automate something doesn't mean we should, and that the people most affected by AI systems (like gig workers or students) deserve a voice in how those systems work. I personally can apply this by questioning whether AI tools I use actually help me learn and grow, or if they're just making me dependent and less capable. For example, I've started using AI to help me understand difficult concepts rather than just giving me answers, which means I'm treating it as a tool for my development rather than a replacement for thinking."
                      ];
                      setExitResponse(goodResponses[selectedExitPrompt]);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    Fill Good Response
                  </Button>
                  <Button
                    onClick={() => {
                      setExitResponse("I think AI ethics is important and we should all think about it more. The principles from the module were interesting and made me think. Technology is changing fast and we need to be careful about how we use it. Everyone should consider the impact of their choices.");
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    Fill Generic Response
                  </Button>
                  <Button
                    onClick={() => {
                      setExitResponse("This module was really confusing and I don't understand why we had to learn about Catholic Social Teaching. It seems old and not relevant to modern technology. Can we just move on to the certificate already? I don't have time for this.");
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    Fill Complaint
                  </Button>
                  <Button
                    onClick={() => {
                      setExitResponse("asdfkj alksjdf laskdjf laksjdf lkajsdhf lkajsdhf lkajsdhf lakjsdhf laksjdhf laksjdhf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf qwerty keyboard mashing");
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 h-auto"
                  >
                    Fill Gibberish
                  </Button>
                </div>
                <p className="text-xs text-red-600 mt-2">Green button shows feedback, others fill text for manual testing</p>
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
            {!exitShowFeedback && (
              <Button
                onClick={handleExitSubmit}
                size="lg"
                disabled={isLoadingFeedback || exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length < 50}
                className={`w-full ${
                  exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 && !isLoadingFeedback
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoadingFeedback ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Getting Feedback...
                  </>
                ) : (
                  <>
                    Submit Response
                    {exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length < 50 && (
                      <span className="ml-2 text-xs">(50 words required)</span>
                    )}
                    {exitResponse.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 && (
                      <ChevronRight className="ml-2 w-5 h-5" />
                    )}
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

      case 'honor-code-pledge':
        return renderHonorCodePledge();

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
