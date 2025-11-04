import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Droplets,
  Leaf,
  ArrowRight,
  Sparkles,
  Loader,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Cloud,
  Brain,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { saveProgress, loadProgress, clearProgress } from '@/lib/progressPersistence';
import EnvironmentalCalculator from '@/components/EnvironmentalModule/EnvironmentalCalculator';
import EnvironmentalImpactMatrix from '@/components/EnvironmentalModule/EnvironmentalImpactMatrix';
import SimplifiedSolutionsSorter from '@/components/EnvironmentalModule/SimplifiedSolutionsSorter';
import { Certificate } from '@/components/Certificate';

const MODULE_ID = 'ai-environmental-impact';
const waterBottleIcon = '/images/water-bottle.png';

// Video URLs (5 separate files - note the double spaces in BBC filenames)
// Using relative Firebase Storage paths (not gs:// URLs) for PremiumVideoPlayer compatibility
const VIDEO_URLS = {
  bbcPart1: 'Videos/Student Videos/AI and the Environment/How AI uses our drinking water  - Part 1.mp4',
  bbcPart2: 'Videos/Student Videos/AI and the Environment/How AI uses our drinking water  - Part 2.mp4',
  bbcPart3: 'Videos/Student Videos/AI and the Environment/How AI uses our drinking water  - Part 3.mp4',
  animated: 'Videos/Student Videos/AI and the Environment/AI_s_Hidden_Water_Bill.mp4',
  hiddenCost: 'Videos/Student Videos/AI and the Environment/The_Hidden_Cost_of_an_AI_Click.mp4',
};

interface AIEnvironmentalImpactModuleProps {
  onComplete: () => void;
  userName?: string;
}

export default function AIEnvironmentalImpactModule({ onComplete, userName = "Student" }: AIEnvironmentalImpactModuleProps) {
  const { isDevModeActive } = useDevMode();
  const { registerActivity, clearRegistry } = useActivityRegistry();

  // Segment state
  const [currentSegment, setCurrentSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<number[]>([]);

  // Hidden Cost Quiz state (Segment 2)
  const [hiddenCostAnswer, setHiddenCostAnswer] = useState<string | null>(null);
  const [showHiddenCostFeedback, setShowHiddenCostFeedback] = useState(false);

  // Quiz state (Segment 5 - was Segment 2)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);

  // Reflection state (Segment 11 - was Segment 7) - with AI validation
  const [reflection, setReflection] = useState('');
  const [reflectionFeedback, setReflectionFeedback] = useState('');
  const [reflectionNeedsRetry, setReflectionNeedsRetry] = useState(false);
  const [isGeneratingReflectionFeedback, setIsGeneratingReflectionFeedback] = useState(false);
  const [showReflectionFeedback, setShowReflectionFeedback] = useState(false);
  const [reflectionAttemptCount, setReflectionAttemptCount] = useState(0);
  const [showReflectionEscapeHatch, setShowReflectionEscapeHatch] = useState(false);

  // Exit ticket state (Segment 20) - with AI validation (single question)
  const [exitTicket, setExitTicket] = useState('');
  const [exitTicketFeedback, setExitTicketFeedback] = useState('');
  const [exitTicketNeedsRetry, setExitTicketNeedsRetry] = useState(false);
  const [isGeneratingExitTicketFeedback, setIsGeneratingExitTicketFeedback] = useState(false);
  const [showExitTicketFeedback, setShowExitTicketFeedback] = useState(false);
  const [exitTicketAttemptCount, setExitTicketAttemptCount] = useState(0);
  const [showExitTicketEscapeHatch, setShowExitTicketEscapeHatch] = useState(false);

  // Calculator reveal state (Segment 7)
  const [revealedLevels, setRevealedLevels] = useState({
    school: false,
    orangeCounty: false,
    california: false,
    usa: false
  });

  // BBC Part 2 Comprehension Check state (Segment 9)
  const [bbcQ1Answer, setBbcQ1Answer] = useState<string | null>(null);
  const [bbcQ2Answer, setBbcQ2Answer] = useState<string | null>(null);
  const [bbcQ3Answer, setBbcQ3Answer] = useState<string | null>(null);
  const [showBbcFeedback, setShowBbcFeedback] = useState(false);
  const [bbcAllCorrect, setBbcAllCorrect] = useState(false);

  // Water Footprint Tracker state (Segment 6)
  const [totalDrops, setTotalDrops] = useState(0);

  // Certificate state
  const [showCertificate, setShowCertificate] = useState(false);

  const MAX_ATTEMPTS = 2;
  const MIN_REFLECTION_LENGTH = 150;
  const MIN_EXIT_TICKET_LENGTH = 100;

  // Segment definitions (20 total)
  const segments = [
    { id: 0, title: 'Welcome to Module', type: 'intro' as const },
    { id: 1, title: 'The Hidden Cost (Hook)', type: 'video' as const },
    { id: 2, title: 'What Do You Think?', type: 'quiz' as const },
    { id: 3, title: 'The Answer Revealed', type: 'video' as const },
    { id: 4, title: 'Ready to Dive Deeper?', type: 'transition' as const },
    { id: 5, title: 'The Drop (BBC Part 1)', type: 'video' as const },
    { id: 6, title: 'Your Water Footprint', type: 'interactive' as const },
    { id: 7, title: 'Scale Your Impact', type: 'interactive' as const },
    { id: 8, title: 'Why So Thirsty? (BBC Part 2 - Part 1)', type: 'video' as const },
    { id: 9, title: 'Comprehension Check: Liquid Cooling', type: 'quiz' as const },
    { id: 10, title: 'Is All AI Usage the Same?', type: 'transition' as const },
    { id: 11, title: 'The Exponential Ladder', type: 'video' as const },
    { id: 12, title: 'Quick Quiz', type: 'quiz' as const },
    { id: 13, title: 'Beyond Water: Energy & Carbon', type: 'interactive' as const },
    { id: 14, title: 'Who Should Be Responsible?', type: 'transition' as const },
    { id: 15, title: 'Student Reflection', type: 'reflection' as const },
    { id: 16, title: 'The Paradox: AI as Problem and Solution', type: 'video' as const },
    { id: 17, title: 'Promising Solutions on the Horizon', type: 'transition' as const },
    { id: 18, title: 'AI Solutions Sorting', type: 'interactive' as const },
    { id: 19, title: 'Moving Forward: Your Role in AI\'s Future', type: 'video' as const },
    { id: 20, title: 'Exit Ticket', type: 'exit-ticket' as const },
  ];

  // Register activities for Developer Mode
  useEffect(() => {
    clearRegistry();
    segments.forEach((segment, index) => {
      registerActivity({
        id: `segment-${segment.id}`,
        type: segment.type,
        name: segment.title,
        completed: completedSegments.includes(index),
      });
    });
  }, []);

  // Listen for Developer Mode navigation
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      if (activityIndex >= 0 && activityIndex < segments.length) {
        setCurrentSegment(activityIndex);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);
    return () => window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
  }, []);

  // Reset revealed levels when entering calculator segment (Segment 7)
  useEffect(() => {
    if (currentSegment === 7) {
      setRevealedLevels({
        school: false,
        orangeCounty: false,
        california: false,
        usa: false
      });
    }
  }, [currentSegment]);

  // Progress persistence
  useEffect(() => {
    const activityStates = segments.map((s, i) => ({
      id: `segment-${s.id}`,
      title: s.title,
      completed: false,
    }));
    const progress = loadProgress(MODULE_ID, activityStates);
    if (progress) {
      // Resume from saved progress
      setCurrentSegment(progress.currentActivity);
      setCompletedSegments(
        segments
          .map((_, index) => index)
          .filter(index => index < progress.currentActivity)
      );
    }
  }, []);

  useEffect(() => {
    if (currentSegment > 0) {
      const activityStates = segments.map((s, i) => ({
        id: `segment-${s.id}`,
        title: s.title,
        completed: completedSegments.includes(i),
      }));
      saveProgress(MODULE_ID, currentSegment, activityStates);
    }
  }, [currentSegment, completedSegments]);

  // Dev mode response generators for reflection
  const getDevGoodReflectionResponse = () => {
    return "I think tech companies should be MOST responsible for reducing AI's environmental impact because they directly control the data centers and can make the biggest changes. For example, companies like Google and Microsoft could invest in renewable energy for their data centers, optimize their AI models to use less power, and implement better water cooling systems like the closed-loop systems mentioned in the module. While governments can create regulations and individual users can make conscious choices (like using text AI instead of video generation), tech companies have the technical expertise and resources to innovate sustainable solutions. The video showed that liquid cooling evaporates 80% of drinking water - companies could switch to seawater or recycled water instead. They're also the ones who can develop more efficient AI chips that generate less heat in the first place. However, I do think it's a shared responsibility where all stakeholders need to play a role.";
  };

  const getDevGenericReflectionResponse = () => {
    return "I think everyone should be responsible because it's important. AI uses a lot of resources and that's bad for the environment. People should just be more careful about how they use it and companies should make it better. Governments should make rules too.";
  };

  const getDevComplaintReflectionResponse = () => {
    return "This module is confusing and I don't understand why we have to learn about this. The videos are boring and too long. I just want to finish this assignment and move on. Can't we just use AI however we want without worrying about all this environmental stuff?";
  };

  const getDevGibberishReflectionResponse = () => {
    return "asdfkj alksjdf laskdjf ;lkj ;lkj ;lkj water water blah blah blah idk lol whatever just let me pass this thing aaaaaa";
  };

  const handleDevAutoFillReflection = () => {
    if (!isDevModeActive) return;

    const goodResponse = getDevGoodReflectionResponse();
    setReflection(goodResponse);
    setReflectionFeedback("Excellent reflection! You've identified tech companies as having the most direct control and provided specific examples like renewable energy investment, liquid cooling optimization, and more efficient AI chips. Your acknowledgment that this is a shared responsibility while identifying the primary actor shows nuanced understanding. Well done!");
    setShowReflectionFeedback(true);
    setReflectionNeedsRetry(false);

    // Auto-complete after brief delay
    setTimeout(() => {
      handleNextSegment();
    }, 1000);
  };

  const handleNextSegment = () => {
    if (!completedSegments.includes(currentSegment)) {
      setCompletedSegments([...completedSegments, currentSegment]);
    }

    if (currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Module complete - show certificate
      setShowCertificate(true);
    }
  };

  // Hidden Cost Quiz handlers (Segment 2)
  const handleHiddenCostAnswer = (answer: string) => {
    setHiddenCostAnswer(answer);
    setShowHiddenCostFeedback(true);
  };

  // Quiz handlers (Segment 5)
  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    setShowQuizFeedback(true);
  };

  // Reflection handlers with AI validation
  const handleSubmitReflection = async () => {
    setIsGeneratingReflectionFeedback(true);
    setReflectionNeedsRetry(false);

    try {
      const aiFeedback = await generateEducationFeedback(
        reflection.trim(),
        "Data centers impact water, energy, and carbon emissions. Who should be most responsible for reducing these impacts: tech companies, governments, or individual users? Explain your reasoning with specific examples."
      );

      const finalFeedback = aiFeedback && aiFeedback.trim().length > 0
        ? aiFeedback
        : "Thank you for reflecting on the responsibility for AI's environmental impact. Understanding different stakeholder roles is crucial.";

      setReflectionFeedback(finalFeedback);

      const feedbackIndicatesRetry =
        aiFeedback.toLowerCase().includes('does not address') ||
        aiFeedback.toLowerCase().includes('please re-read') ||
        aiFeedback.toLowerCase().includes('inappropriate language') ||
        aiFeedback.toLowerCase().includes('off-topic') ||
        aiFeedback.toLowerCase().includes('must elaborate') ||
        aiFeedback.toLowerCase().includes('insufficient') ||
        aiFeedback.toLowerCase().includes('needs more depth') ||
        aiFeedback.toLowerCase().includes('random text') ||
        aiFeedback.toLowerCase().includes('monitored for inappropriate') ||
        aiFeedback.toLowerCase().includes('answer the original question');

      if (feedbackIndicatesRetry) {
        setReflectionNeedsRetry(true);
        const newAttemptCount = reflectionAttemptCount + 1;
        setReflectionAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowReflectionEscapeHatch(true);
        }
      } else {
        setReflectionNeedsRetry(false);
      }

      setShowReflectionFeedback(true);
    } catch (error) {
      console.error('[Reflection] Error:', error);
      setReflectionFeedback("Thank you for your thoughtful reflection on AI's environmental impact.");
      setReflectionNeedsRetry(false);
      setShowReflectionFeedback(true);
    } finally {
      setIsGeneratingReflectionFeedback(false);
    }
  };

  const handleReflectionTryAgain = () => {
    setReflection('');
    setReflectionFeedback('');
    setShowReflectionFeedback(false);
    setReflectionNeedsRetry(false);
    // DON'T reset reflectionAttemptCount - need to track total attempts for escape hatch
    // DON'T reset showReflectionEscapeHatch - if earned, keep it available
  };

  const handleReflectionContinueAnyway = () => {
    console.log('Student bypassed reflection validation after', reflectionAttemptCount, 'attempts');
    handleNextSegment();
  };

  // Exit ticket handlers with AI validation
  const handleSubmitExitTicket = async () => {
    setIsGeneratingExitTicketFeedback(true);
    setExitTicketNeedsRetry(false);

    try {
      const feedback = await generateEducationFeedback(
        exitTicket.trim(),
        "What difference does it make to be aware of AI's environmental cost?"
      );

      const finalFeedback = feedback && feedback.trim().length > 0
        ? feedback
        : "Thank you for sharing your thoughtful reflection on AI's environmental impact.";

      setExitTicketFeedback(finalFeedback);

      const checkRejection = (text: string) =>
        text.toLowerCase().includes('does not address') ||
        text.toLowerCase().includes('please re-read') ||
        text.toLowerCase().includes('inappropriate language') ||
        text.toLowerCase().includes('off-topic') ||
        text.toLowerCase().includes('must elaborate') ||
        text.toLowerCase().includes('insufficient') ||
        text.toLowerCase().includes('needs more depth') ||
        text.toLowerCase().includes('random text') ||
        text.toLowerCase().includes('monitored for inappropriate') ||
        text.toLowerCase().includes('answer the original question');

      const needsRetry = checkRejection(feedback);
      setExitTicketNeedsRetry(needsRetry);

      if (needsRetry) {
        const newAttemptCount = exitTicketAttemptCount + 1;
        setExitTicketAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowExitTicketEscapeHatch(true);
        }
      }

      setShowExitTicketFeedback(true);
    } catch (error) {
      console.error('[Exit Ticket] Error:', error);
      setExitTicketFeedback("Thank you for your thoughtful reflection on AI's environmental impact.");
      setExitTicketNeedsRetry(false);
      setShowExitTicketFeedback(true);
    } finally {
      setIsGeneratingExitTicketFeedback(false);
    }
  };

  const handleExitTicketTryAgain = () => {
    setExitTicket('');
    setExitTicketFeedback('');
    setShowExitTicketFeedback(false);
    setExitTicketNeedsRetry(false);
    // DON'T reset exitTicketAttemptCount - need to track total attempts for escape hatch
    // DON'T reset showExitTicketEscapeHatch - if earned, keep it available
  };

  const handleExitTicketContinueAnyway = () => {
    console.log('Student bypassed exit ticket validation after', exitTicketAttemptCount, 'attempts');
    handleNextSegment();
  };

  // BBC Part 2 Comprehension Check handlers (Segment 9)
  const handleBbcCheckSubmit = () => {
    if (!bbcQ1Answer || !bbcQ2Answer || !bbcQ3Answer) {
      return; // All questions must be answered
    }

    const q1Correct = bbcQ1Answer === 'energy-intensive';
    const q2Correct = bbcQ2Answer === 'evaporates';
    const q3Correct = bbcQ3Answer === 'drinking-water';

    const allCorrect = q1Correct && q2Correct && q3Correct;

    setShowBbcFeedback(true);
    setBbcAllCorrect(allCorrect);
  };

  const handleBbcCheckReset = () => {
    setBbcQ1Answer(null);
    setBbcQ2Answer(null);
    setBbcQ3Answer(null);
    setShowBbcFeedback(false);
    setBbcAllCorrect(false);
  };

  // Render functions for new segments
  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-12 h-12 text-green-600" />
            <CardTitle className="text-3xl font-bold text-gray-900">
              AI's Environmental Impact
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-900">
          <p className="text-lg leading-relaxed">
            Welcome, {userName}! Every time you use AI, there's a hidden environmental cost. In this module, you'll discover what it takes to power the AI tools you use every day—and learn how to use them more sustainably.
          </p>

          <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              The Hidden Story Behind AI
            </h3>
            <p className="text-gray-800 leading-relaxed mb-4">
              AI tools like ChatGPT, DALL-E, and Gemini feel instant and free. But behind every query, image, or response is a massive data center consuming real-world resources.
            </p>
            <p className="text-gray-800 leading-relaxed">
              This module reveals the environmental footprint of AI and shows you how small changes in how we use these tools can make a big difference.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-lg border border-green-300">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <Sparkles className="w-6 h-6 text-green-600" />
              What You'll Learn
            </h3>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>The hidden cost:</strong> Discover what every AI query actually consumes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Behind the scenes:</strong> See what happens in data centers to power AI</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Your personal impact:</strong> Calculate your own AI environmental footprint</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Make better choices:</strong> Learn how to use AI more sustainably</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Future solutions:</strong> Innovations making AI more environmentally friendly</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
            <p className="text-sm text-gray-800 flex items-start gap-2">
              <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Good news:</strong> Tech companies are investing billions in renewable energy and efficient cooling systems. Understanding the problem is the first step toward solutions!</span>
            </p>
          </div>

          <Button
            onClick={handleNextSegment}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            <ChevronRight className="mr-2 w-5 h-5" />
            Start Module
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAnimatedHook = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          The Hidden Cost
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Let's ask a big question: What's the real cost of using AI?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <PremiumVideoPlayer
          videoUrl={VIDEO_URLS.animated}
          videoId="env-impact-animated-hook"
          segments={[
            {
              id: 'animated-hook',
              title: 'The Hidden Cost - Part 1',
              start: 0,
              end: 34.3,
              source: VIDEO_URLS.animated,
              description: "What's the hidden cost of AI?",
              mandatory: true,
            }
          ]}
          onSegmentComplete={() => {}}
          onModuleComplete={handleNextSegment}
          enableSubtitles={true}
          hideSegmentNavigator={true}
          allowSeeking={false}
        />
      </CardContent>
    </Card>
  );

  const renderHiddenCostQuiz = () => {
    const options = [
      {
        id: 'financial',
        emoji: '💰',
        title: 'Financial Cost',
        description: 'AI companies lose money on free services',
        isCorrect: false,
        explanation: "While AI is expensive to run, this isn't the environmental cost the video explores. The real hidden cost affects our planet's resources.",
        color: 'from-yellow-400 to-orange-500'
      },
      {
        id: 'water',
        emoji: '💧',
        title: 'Water Usage',
        description: 'Data centers need massive amounts of water for cooling',
        isCorrect: true,
        explanation: "Correct! Every AI query requires water to cool the servers. A single conversation with ChatGPT can use as much water as a water bottle. This hidden environmental cost is what the video reveals.",
        color: 'from-blue-400 to-cyan-500'
      },
      {
        id: 'battery',
        emoji: '⚡',
        title: 'Device Battery',
        description: 'AI drains phone and laptop batteries faster',
        isCorrect: false,
        explanation: "While AI does use your device's battery, the much larger hidden cost happens in data centers far away, where servers require enormous amounts of resources to run.",
        color: 'from-yellow-300 to-yellow-500'
      },
      {
        id: 'bandwidth',
        emoji: '🌐',
        title: 'Internet Bandwidth',
        description: 'AI queries slow down your internet connection',
        isCorrect: false,
        explanation: "AI queries do use bandwidth, but the significant hidden environmental cost occurs in the data centers processing your request, not in your internet connection.",
        color: 'from-purple-400 to-indigo-500'
      }
    ];

    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
            What Do You Think?
          </CardTitle>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            AI tools like ChatGPT and image generators seem free and instant. But there's a <strong>hidden environmental cost</strong> behind every query.
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Make your best guess before we reveal the answer!
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleHiddenCostAnswer(option.id)}
                disabled={showHiddenCostFeedback}
                className={`group relative p-6 text-left rounded-xl border-3 transition-all transform hover:scale-105 ${
                  hiddenCostAnswer === option.id
                    ? option.isCorrect
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-yellow-500 bg-yellow-50 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                } ${!showHiddenCostFeedback ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-3xl shadow-md`}>
                    {option.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {option.title}
                      {showHiddenCostFeedback && hiddenCostAnswer === option.id && (
                        option.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-yellow-600" />
                        )
                      )}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>

                {showHiddenCostFeedback && hiddenCostAnswer === option.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t-2 border-gray-300"
                  >
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <strong className={option.isCorrect ? 'text-green-700' : 'text-yellow-700'}>
                        {option.isCorrect ? '✓ Explanation:' : 'Not quite:'}
                      </strong> {option.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {showHiddenCostFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <Button onClick={handleNextSegment} size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6">
                Watch the Answer Revealed
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderAnimatedReveal = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-600" />
          The Answer Revealed
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Here's the hidden environmental cost of AI
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            Watch as the video reveals the answer to our question!
          </p>
        </div>

        <PremiumVideoPlayer
          videoUrl={VIDEO_URLS.animated}
          videoId="env-impact-animated-reveal"
          segments={[
            {
              id: 'animated-reveal',
              title: 'The Hidden Cost - Answer',
              start: 34.5,
              end: 48.5,
              source: VIDEO_URLS.animated,
              description: "The answer revealed",
              mandatory: true,
            }
          ]}
          onSegmentComplete={() => {}}
          onModuleComplete={handleNextSegment}
          enableSubtitles={true}
          hideSegmentNavigator={true}
          allowSeeking={false}
        />
      </CardContent>
    </Card>
  );

  const renderTransition = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-12 h-12 text-blue-600" />
            <CardTitle className="text-3xl font-bold text-gray-900">
              Ready to Dive Deeper?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-900">
          <p className="text-lg leading-relaxed">
            You've learned that AI uses water. But how much water are we really talking about? And why does AI even need water in the first place?
          </p>

          <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              What's Coming Next
            </h3>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>The real numbers:</strong> See exactly how much water AI actually uses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>The mystery revealed:</strong> Discover why AI systems need water</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>The bigger picture:</strong> Energy and carbon emissions beyond just water</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleNextSegment}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            <ChevronRight className="mr-2 w-5 h-5" />
            Continue to BBC Documentary
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSegment = () => {
    const segment = segments[currentSegment];

    switch (currentSegment) {
      // Segment 0: Welcome/Intro Page
      case 0:
        return renderIntro();

      // Segment 1: Animated Hook (0-34s)
      case 1:
        return renderAnimatedHook();

      // Segment 2: Hidden Cost Quiz
      case 2:
        return renderHiddenCostQuiz();

      // Segment 3: Animated Answer Reveal (34-49.5s)
      case 3:
        return renderAnimatedReveal();

      // Segment 4: Transition Screen
      case 4:
        return renderTransition();

      // Segment 5: The Drop (Hook) - BBC Part 1
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-600" />
                The "Drop": Every AI Query Has a Cost
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Watch this video to discover the hidden environmental cost of AI
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This video will show you how a single AI query uses a small "drop" of water - and how that scales up exponentially.
                </p>
              </div>

              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.bbcPart1}
                videoId="environmental-segment-0"
                segments={[
                  {
                    id: 'bbc-part-1',
                    title: 'The Drop: Every AI Query Has a Cost',
                    start: 0,
                    end: -1,
                    source: VIDEO_URLS.bbcPart1,
                    description: 'Introduction to AI water usage',
                    mandatory: true,
                  }
                ]}
                onSegmentComplete={() => {}}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 6: Interactive Water Footprint Tracker (NEW)
      case 6:
        // 1 cup = 15 drops (1 drop = 1/15 teaspoon)
        const totalCups = totalDrops / 15;
        const displayCups = Math.floor(totalCups);
        const remainingDrops = totalDrops % 15;

        const activities = [
          { id: 'quick', label: 'Quick question', icon: '⚡', drops: 1, desc: '1 exchange' },
          { id: 'question', label: 'Ask ChatGPT a longer question', icon: '❓', drops: 3, desc: '3 exchanges' },
          { id: 'brainstorm', label: 'Brainstorm essay ideas', icon: '💡', drops: 5, desc: '5 exchanges' },
          { id: 'summarize', label: 'Summarize an article', icon: '📄', drops: 4, desc: '4 exchanges' },
          { id: 'explain', label: 'Explain a concept in depth', icon: '🧠', drops: 6, desc: '6 exchanges' },
          { id: 'debug', label: 'Debug code together', icon: '🐛', drops: 8, desc: '8 exchanges' },
        ];

        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-600" />
                💧 What's Your AI Water Footprint?
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Track your daily AI usage and see how much water it uses
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Part 1: Reflection Prompt - SHORTENED */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-gray-900 text-center">
                  <strong>Think about your day.</strong> Click each AI task below based on how often you might do it:
                </p>
              </div>

              {/* Part 2: Interactive Tracker */}
              <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
                {/* Activity Buttons Grid */}
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {activities.map((activity) => (
                    <Button
                      key={activity.id}
                      onClick={() => setTotalDrops(totalDrops + activity.drops)}
                      className="h-auto p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex flex-col items-start"
                      size="lg"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-2xl mr-2">{activity.icon}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">+{activity.drops} drops</span>
                      </div>
                      <span className="text-sm font-medium text-left">{activity.label}</span>
                      <span className="text-xs text-blue-100 mt-1">({activity.desc})</span>
                    </Button>
                  ))}
                </div>

                {/* Counter Display */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-gray-900">Your Total Water Usage:</span>
                    <span className="text-3xl font-bold text-blue-700">{totalDrops} drops</span>
                  </div>

                  {/* Visual Display - Cups + Drops */}
                  {totalDrops > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Your Visual Footprint:</p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200 min-h-[80px] flex flex-wrap gap-2 items-center">
                        {/* Show spoons (each = 15 drops = 1 teaspoon) */}
                        {Array.from({ length: displayCups }).map((_, i) => (
                          <motion.span
                            key={`spoon-${i}`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="text-4xl"
                            title="1 teaspoon (15 drops)"
                          >
                            🥄
                          </motion.span>
                        ))}
                        {/* Show remaining drops */}
                        {Array.from({ length: remainingDrops }).map((_, i) => (
                          <motion.span
                            key={`drop-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-xl"
                          >
                            💧
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Water Calculation */}
                  <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 border border-cyan-300">
                    {displayCups > 0 ? (
                      <p className="text-lg text-gray-900">
                        <strong className="text-blue-700">{displayCups} teaspoon{displayCups > 1 ? 's' : ''}</strong>
                        {remainingDrops > 0 && <span> + {remainingDrops} drop{remainingDrops > 1 ? 's' : ''}</span>}
                        <span className="ml-2">of water</span>
                      </p>
                    ) : (
                      <p className="text-lg text-gray-900">
                        <strong className="text-blue-700">{totalDrops} drop{totalDrops > 1 ? 's' : ''}</strong> of water
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      (15 drops = 1 teaspoon 🥄)
                    </p>
                  </div>
                </div>

                {/* Insight Messages */}
                {totalDrops === 0 && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> Click the buttons above to track your daily AI usage!
                    </p>
                  </div>
                )}

                {totalDrops > 0 && totalDrops < 15 && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Light user!</strong> You're building up to your first teaspoon. Keep tracking!
                    </p>
                  </div>
                )}

                {totalDrops >= 15 && totalDrops < 45 && (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Moderate user!</strong> You've passed 1 teaspoon — that's {displayCups} teaspoon{displayCups > 1 ? 's' : ''} of water per day!
                    </p>
                  </div>
                )}

                {totalDrops >= 45 && (
                  <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Heavy user!</strong> That's {displayCups} teaspoons of water per day. Multiply this by millions of users worldwide! 🌍
                    </p>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              {totalDrops > 0 && (
                <Button onClick={handleNextSegment} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  See Your Impact at Scale
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </CardContent>
          </Card>
        );

      // Segment 7: Scale Your Impact (NEW - shows personal usage scaled up)
      case 7:
        // Calculate scaled impacts
        const dropsPerDay = totalDrops;
        const schoolStudents = 1700;
        const ocHighSchoolers = 300000; // Orange County ~300k high school students
        const caHighSchoolers = 2100000; // California ~2.1M high school students
        const usHighSchoolers = 15000000; // US ~15M high school students

        const schoolDrops = dropsPerDay * schoolStudents;
        const ocDrops = dropsPerDay * ocHighSchoolers;
        const caDrops = dropsPerDay * caHighSchoolers;
        const usDrops = dropsPerDay * usHighSchoolers;

        // Convert to water bottles (assuming 500ml bottle = 100 drops, where 1 drop = 5ml)
        const dropsPerBottle = 100;
        const schoolBottles = Math.round(schoolDrops / dropsPerBottle);
        const ocBottles = Math.round(ocDrops / dropsPerBottle);
        const caBottles = Math.round(caDrops / dropsPerBottle);
        const usBottles = Math.round(usDrops / dropsPerBottle);

        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                Your Impact at Scale
              </CardTitle>
              <p className="text-gray-700 mt-2">
                See how your daily AI usage adds up across your school, county, state, and nation
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Usage Recap */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Daily Usage</h3>
                <div className="text-5xl font-bold text-blue-700 mb-2">{dropsPerDay} drops</div>
                <p className="text-gray-700">
                  ({Math.floor(dropsPerDay / 15)} teaspoon{Math.floor(dropsPerDay / 15) !== 1 ? 's' : ''} of water per day)
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
                <p className="text-gray-900 text-lg">
                  Now, let's see what happens if <strong>everyone</strong> uses AI like you do...
                </p>
              </div>

              {/* Scaled Impacts */}
              <div className="space-y-4">
                {/* Your School */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🏫 Your School ({schoolStudents.toLocaleString()} students)
                  </h3>
                  {!revealedLevels.school ? (
                    <Button
                      onClick={() => setRevealedLevels(prev => ({ ...prev, school: true }))}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      Click to Reveal Water Usage
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <p className="text-3xl font-bold text-green-700">{schoolBottles.toLocaleString()}</p>
                      <img src={waterBottleIcon} alt="water bottle" className="w-8 h-8 inline-block" />
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-900">water bottles</p>
                        <p className="text-sm text-gray-700">per day (16.9 oz each)</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Orange County */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🏙️ Orange County High Schoolers ({(ocHighSchoolers / 1000).toFixed(0)}K students)
                  </h3>
                  {!revealedLevels.orangeCounty ? (
                    <Button
                      onClick={() => setRevealedLevels(prev => ({ ...prev, orangeCounty: true }))}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                      disabled={!revealedLevels.school}
                    >
                      {revealedLevels.school ? 'Click to Reveal Water Usage' : '🔒 Reveal Previous Level First'}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <p className="text-3xl font-bold text-blue-700">{ocBottles.toLocaleString()}</p>
                      <img src={waterBottleIcon} alt="water bottle" className="w-8 h-8 inline-block" />
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-900">water bottles</p>
                        <p className="text-sm text-gray-700">per day (16.9 oz each)</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* California */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🌴 California High Schoolers ({(caHighSchoolers / 1000000).toFixed(1)}M students)
                  </h3>
                  {!revealedLevels.california ? (
                    <Button
                      onClick={() => setRevealedLevels(prev => ({ ...prev, california: true }))}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      size="lg"
                      disabled={!revealedLevels.orangeCounty}
                    >
                      {revealedLevels.orangeCounty ? 'Click to Reveal Water Usage' : '🔒 Reveal Previous Level First'}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <p className="text-3xl font-bold text-orange-700">{caBottles.toLocaleString()}</p>
                      <img src={waterBottleIcon} alt="water bottle" className="w-8 h-8 inline-block" />
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-900">water bottles</p>
                        <p className="text-sm text-gray-700">per day (16.9 oz each)</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* United States */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🇺🇸 High Schoolers ({(usHighSchoolers / 1000000).toFixed(0)}M students)
                  </h3>
                  {!revealedLevels.usa ? (
                    <Button
                      onClick={() => setRevealedLevels(prev => ({ ...prev, usa: true }))}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="lg"
                      disabled={!revealedLevels.california}
                    >
                      {revealedLevels.california ? 'Click to Reveal Water Usage' : '🔒 Reveal Previous Level First'}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-purple-700">{usBottles.toLocaleString()}</p>
                        <img src={waterBottleIcon} alt="water bottle" className="w-8 h-8 inline-block" />
                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-900">water bottles</p>
                          <p className="text-sm text-gray-700">per day (16.9 oz each)</p>
                        </div>
                      </div>
                      <div className="mt-3 bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-xs text-gray-700">
                          That's <strong>{(usBottles / 1000000).toFixed(1)} million</strong> water bottles <strong>every single day</strong> — just from high school students using AI like you do!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Key Takeaway */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💡 The Power of Individual Choices
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  Your personal AI usage might seem small — just {dropsPerDay} drops per day. But when millions of people make the same choices, it adds up to a massive environmental impact. <strong>Every query matters.</strong>
                </p>
              </div>

              <Button
                onClick={handleNextSegment}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!revealedLevels.school || !revealedLevels.orangeCounty || !revealedLevels.california || !revealedLevels.usa}
              >
                {revealedLevels.school && revealedLevels.orangeCounty && revealedLevels.california && revealedLevels.usa
                  ? 'Continue to Learn Why AI Is So Thirsty'
                  : '🔒 Reveal All Levels to Continue'
                }
                {revealedLevels.school && revealedLevels.orangeCounty && revealedLevels.california && revealedLevels.usa && (
                  <ArrowRight className="ml-2 w-5 h-5" />
                )}
              </Button>
            </CardContent>
          </Card>
        );

      // Segment 8: Why So Thirsty? - BBC Part 2
      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-600" />
                Why So Thirsty? The Technical Explanation
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Understand WHY AI systems need so much water for cooling
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This video explains the technical reason: AI chips get extremely hot and require liquid cooling systems that use clean drinking water.
                </p>
              </div>

              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.bbcPart2}
                videoId="environmental-segment-2"
                segments={[
                  {
                    id: 'bbc-part-2-section-1',
                    title: 'Why So Thirsty? The Technical Explanation (Part 1)',
                    start: 0,
                    end: 113.5,
                    source: VIDEO_URLS.bbcPart2,
                    description: 'How AI chips get hot and require liquid cooling',
                    mandatory: true,
                  }
                ]}
                onSegmentComplete={() => {}}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 9: BBC Part 2 Comprehension Check
      case 9:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                Comprehension Check: Liquid Cooling
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Test your understanding of what you just learned about AI cooling systems
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question 1 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  1. Why can't data centers use regular air cooling systems for AI?
                </h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q1"
                      value="too-expensive"
                      checked={bbcQ1Answer === 'too-expensive'}
                      onChange={(e) => setBbcQ1Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">Air cooling is too expensive</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q1"
                      value="energy-intensive"
                      checked={bbcQ1Answer === 'energy-intensive'}
                      onChange={(e) => setBbcQ1Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">AI chips are too energy-intensive and generate too much heat</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q1"
                      value="not-available"
                      checked={bbcQ1Answer === 'not-available'}
                      onChange={(e) => setBbcQ1Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">Air cooling systems are not available for data centers</span>
                  </label>
                </div>
                {showBbcFeedback && bbcQ1Answer === 'energy-intensive' && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-800">
                    ✓ Correct! AI infrastructure is so energy-intensive that air cooling isn't sufficient.
                  </div>
                )}
                {showBbcFeedback && bbcQ1Answer !== 'energy-intensive' && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-800">
                    ✗ Not quite. The video mentioned that AI infrastructure generates much more heat than regular computing. Air cooling was fine until AI came along because AI data centers are so much more __________-intensive.
                  </div>
                )}
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  2. What happens to the water used in liquid cooling systems?
                </h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q2"
                      value="recycled"
                      checked={bbcQ2Answer === 'recycled'}
                      onChange={(e) => setBbcQ2Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">It's completely recycled and reused</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q2"
                      value="evaporates"
                      checked={bbcQ2Answer === 'evaporates'}
                      onChange={(e) => setBbcQ2Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">Up to 80% evaporates and is lost</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q2"
                      value="returned-clean"
                      checked={bbcQ2Answer === 'returned-clean'}
                      onChange={(e) => setBbcQ2Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">It's returned to water sources completely clean</span>
                  </label>
                </div>
                {showBbcFeedback && bbcQ2Answer === 'evaporates' && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-800">
                    ✓ Correct! The video explained that up to 80% evaporates during the cooling process.
                  </div>
                )}
                {showBbcFeedback && bbcQ2Answer !== 'evaporates' && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-800">
                    ✗ Not quite. The video explained what happens in the cooling towers: fans and water vapor dissipate heat. The water recirculates several times, but overall up to ___% of the water is lost through evaporation.
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  3. Why is liquid cooling a concern for communities?
                </h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q3"
                      value="too-noisy"
                      checked={bbcQ3Answer === 'too-noisy'}
                      onChange={(e) => setBbcQ3Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">Cooling systems are too noisy for residential areas</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q3"
                      value="drinking-water"
                      checked={bbcQ3Answer === 'drinking-water'}
                      onChange={(e) => setBbcQ3Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">It uses drinking water needed for human consumption and irrigation</span>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <input
                      type="radio"
                      name="q3"
                      value="air-pollution"
                      checked={bbcQ3Answer === 'air-pollution'}
                      onChange={(e) => setBbcQ3Answer(e.target.value)}
                      className="mt-1"
                      disabled={showBbcFeedback && bbcAllCorrect}
                    />
                    <span className="text-gray-900">It causes air pollution in the surrounding area</span>
                  </label>
                </div>
                {showBbcFeedback && bbcQ3Answer === 'drinking-water' && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-800">
                    ✓ Correct! The video explained that clean drinking water is needed for cooling, taking it from sources used for human consumption and irrigation.
                  </div>
                )}
                {showBbcFeedback && bbcQ3Answer !== 'drinking-water' && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-800">
                    ✗ Not quite. The video said the water must be clean to prevent bacteria and corrosion - which means using ________ water. This water is being extracted from sources needed for other purposes like irrigation and human consumption.
                  </div>
                )}
              </div>

              {/* Overall Feedback */}
              {showBbcFeedback && bbcAllCorrect && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">🎉 Excellent! All correct!</h3>
                  <p className="text-sm text-green-800 mb-4">
                    You clearly understood the technical challenges of AI cooling. Let's continue learning about the global impact...
                  </p>
                  <Button
                    onClick={handleNextSegment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    Continue to Global Impact
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {showBbcFeedback && !bbcAllCorrect && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Review your answers</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Some answers need correction. Review the feedback above and try again!
                  </p>
                  <Button
                    onClick={handleBbcCheckReset}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!showBbcFeedback && (
                <Button
                  onClick={handleBbcCheckSubmit}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!bbcQ1Answer || !bbcQ2Answer || !bbcQ3Answer}
                >
                  {bbcQ1Answer && bbcQ2Answer && bbcQ3Answer ? 'Check My Answers' : 'Answer All Questions to Continue'}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      // Segment 10: Transition - Is All AI Usage the Same?
      case 10:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                But Wait... Is All AI Usage the Same?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-purple-900 mb-6 text-center">
                  Does every AI interaction cause the same impact?
                </h3>

                {/* Visual Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Text Generation */}
                  <div className="bg-white rounded-lg p-5 border-2 border-blue-200 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">💬</div>
                    <h4 className="font-bold text-blue-900 mb-2">Text Query</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      "What's the weather today?"
                    </p>
                    <p className="text-xs text-gray-600 italic">ChatGPT, Gemini, Claude</p>
                  </div>

                  {/* Image Generation */}
                  <div className="bg-white rounded-lg p-5 border-2 border-green-200 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">🎨</div>
                    <h4 className="font-bold text-green-900 mb-2">Image Generation</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      "A sunset over mountains"
                    </p>
                    <p className="text-xs text-gray-600 italic">DALL-E, Midjourney, Stable Diffusion</p>
                  </div>

                  {/* Video Generation */}
                  <div className="bg-white rounded-lg p-5 border-2 border-orange-200 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">🎬</div>
                    <h4 className="font-bold text-orange-900 mb-2">Video Generation</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      "A person walking on the beach"
                    </p>
                    <p className="text-xs text-gray-600 italic">Sora, Runway, Pika</p>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-6">
                  <p className="text-xl font-semibold text-center text-gray-900 mb-4">
                    🤔 Which one uses the most water?
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-3xl mb-1">💬</p>
                      <p className="text-xs font-semibold text-blue-900">Text?</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-3xl mb-1">🎨</p>
                      <p className="text-xs font-semibold text-green-900">Image?</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-3xl mb-1">🎬</p>
                      <p className="text-xs font-semibold text-orange-900">Video?</p>
                    </div>
                  </div>
                </div>

                {/* Answer Teaser */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-400 text-center">
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    ⚡ The answer might shock you...
                  </p>
                  <p className="text-gray-700">
                    Different types of AI tasks use <strong>dramatically different</strong> amounts of resources. Let's explore what's called the <strong>"Exponential Ladder"</strong> of AI water usage.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleNextSegment}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Discover the Exponential Ladder
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        );

      // Segment 11: The Exponential Ladder - Animated visualization
      case 11:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                The Exponential Ladder
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Watch how AI resource usage scales from text to images to video
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This animation shows the "exponential ladder" - how each type of AI task (text, image, video) uses dramatically more resources than the one before it.
                </p>
              </div>

              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.animated}
                videoId="env-impact-exponential-ladder"
                segments={[
                  {
                    id: 'exponential-ladder',
                    title: 'The Exponential Ladder',
                    start: 114,
                    end: 213.5,
                    source: VIDEO_URLS.animated,
                    description: 'Visualizing how resource usage scales: text → image → video',
                    mandatory: true,
                  }
                ]}
                onSegmentComplete={() => {}}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 10: Quick Quiz - Understanding the Exponential Ladder
      case 12:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Quick Quiz: Understanding the Exponential Ladder
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Test your understanding of AI's environmental costs
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-900">
                You need a header image for a school project. Which of these choices would use the most environmental resources?
              </p>

              <div className="space-y-3">
                {[
                  { id: 'A', text: 'Writing a text prompt to ask for ideas' },
                  { id: 'B', text: 'Generating a single AI image' },
                  { id: 'C', text: 'Generating a 1-minute AI video for the header', correct: true },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuizAnswer(option.id)}
                    disabled={showQuizFeedback}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      quizAnswer === option.id
                        ? option.correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">({option.id}) {option.text}</span>
                      {showQuizFeedback && quizAnswer === option.id && (
                        option.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showQuizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-2 rounded-lg p-6 ${
                    quizAnswer === 'C'
                      ? 'border-green-500 bg-green-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  {quizAnswer === 'C' ? (
                    <p className="text-gray-900">
                      <strong>Correct!</strong> Video generation uses exponentially more resources than images, which use more than text.
                      The "exponential ladder" goes: Text → Image → Video, with each step using 10-50x more resources.
                    </p>
                  ) : (
                    <p className="text-gray-900">
                      <strong>Not quite.</strong> Video generation uses the most resources - exponentially more than images or text.
                      The correct answer is (C). Video can use 100x more computational power than generating text!
                    </p>
                  )}
                </motion.div>
              )}

              {showQuizFeedback && (
                <Button onClick={handleNextSegment} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </CardContent>
          </Card>
        );

      // Segment 11: Beyond Water - Energy & Carbon (Text Card) (was Segment 10, was Segment 9, was Segment 8, originally Segment 3)
      case 13:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                Beyond Water: Energy & Carbon
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Water isn't the only environmental cost of AI
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-900">Massive Energy Use</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Data centers use enormous amounts of <strong>electricity</strong> - enough to power
                    thousands of homes. In 2023, global data centers used as much electricity as the entire country of Argentina.
                  </p>
                </div>

                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cloud className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Carbon Emissions</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This electricity generates <strong>carbon emissions</strong> that contribute to climate change.
                    Training GPT-3 produced as much CO₂ as 120 American homes use in an entire year.
                  </p>
                </div>
              </div>

              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-6">
                <p className="text-gray-900 leading-relaxed">
                  <strong className="text-blue-900">The Full Picture:</strong> AI's environmental impact includes water for cooling,
                  electricity to run the servers, and carbon emissions from generating that electricity. Let's explore the scale of these impacts.
                </p>
              </div>

              <Button onClick={handleNextSegment} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Continue to The Big Picture
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        );

      // Segment 12: The Big Picture - Animated (was Segment 11, was Segment 10, was Segment 9, originally Segment 4)
      // Segment 14: Critical Thinking - Who Should Be Responsible?
      case 14:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Critical Thinking: Who Should Be Responsible?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Now that you know AI's environmental impact...
                </h3>

                <div className="space-y-6">
                  {/* The Question */}
                  <div className="bg-white rounded-lg p-6 border-2 border-purple-300">
                    <p className="text-xl font-semibold text-center text-purple-900 mb-4">
                      🤔 Who should be responsible for reducing this impact?
                    </p>
                  </div>

                  {/* Stakeholder Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* AI Companies */}
                    <div className="bg-white rounded-lg p-5 border-2 border-blue-200 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-3 text-center">🏢</div>
                      <h4 className="font-bold text-blue-900 mb-2 text-center">AI Companies</h4>
                      <p className="text-sm text-gray-700 text-center">
                        OpenAI, Google, Meta, Microsoft
                      </p>
                      <p className="text-xs text-gray-600 mt-2 italic text-center">
                        Build more efficient systems?
                      </p>
                    </div>

                    {/* Users */}
                    <div className="bg-white rounded-lg p-5 border-2 border-green-200 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-3 text-center">👥</div>
                      <h4 className="font-bold text-green-900 mb-2 text-center">Individual Users</h4>
                      <p className="text-sm text-gray-700 text-center">
                        You, your friends, everyone who uses AI
                      </p>
                      <p className="text-xs text-gray-600 mt-2 italic text-center">
                        Make conscious choices about usage?
                      </p>
                    </div>

                    {/* Governments */}
                    <div className="bg-white rounded-lg p-5 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-3 text-center">🏛️</div>
                      <h4 className="font-bold text-orange-900 mb-2 text-center">Governments</h4>
                      <p className="text-sm text-gray-700 text-center">
                        Create regulations and standards
                      </p>
                      <p className="text-xs text-gray-600 mt-2 italic text-center">
                        Enforce environmental limits?
                      </p>
                    </div>

                    {/* Everyone */}
                    <div className="bg-white rounded-lg p-5 border-2 border-purple-200 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-3 text-center">🌍</div>
                      <h4 className="font-bold text-purple-900 mb-2 text-center">All of Us</h4>
                      <p className="text-sm text-gray-700 text-center">
                        Shared responsibility across stakeholders
                      </p>
                      <p className="text-xs text-gray-600 mt-2 italic text-center">
                        Collective action?
                      </p>
                    </div>
                  </div>

                  {/* Reflection Prompt */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-400">
                    <p className="text-center text-gray-900 font-semibold mb-2">
                      💭 There's no single "right" answer...
                    </p>
                    <p className="text-sm text-center text-gray-700">
                      This is a complex issue involving technology companies, individual choices, government policy, and global cooperation. Think about this question as we continue exploring solutions.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleNextSegment}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue to Student Reflection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        );

      // Segment 15: Student Reflection (with AI validation) (was Segment 14, was Segment 13, was Segment 12, originally Segment 7)
      case 15:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Critical Thinking: Who Should Be Responsible?
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Reflect on who should manage AI's environmental impact
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <p className="text-gray-900 text-lg font-semibold mb-4">
                  Data centers impact water, energy, and carbon emissions. Who do you think should be MOST responsible for reducing these impacts?
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Tech companies</strong> (who build and run data centers)</li>
                  <li>• <strong>Governments</strong> (who regulate industries)</li>
                  <li>• <strong>Individual users</strong> (people like you who use AI)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Explain your reasoning with specific examples from what you've learned.
                </p>
              </div>

              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                disabled={showReflectionFeedback && !reflectionNeedsRetry}
                placeholder="Explain who you think should be most responsible and why. Use specific examples from the module..."
                rows={6}
                className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              />

              <p className="text-xs text-gray-600">
                {reflection.length >= MIN_REFLECTION_LENGTH
                  ? '✓ Ready for AI feedback'
                  : `${reflection.length} / ${MIN_REFLECTION_LENGTH} characters minimum`}
              </p>

              {/* Dev Mode Shortcuts */}
              {isDevModeActive && !showReflectionFeedback && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Reflection Shortcuts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleDevAutoFillReflection}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Fill & Complete
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGoodReflectionResponse())}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Good Response
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGenericReflectionResponse())}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Generic Response
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevComplaintReflectionResponse())}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Complaint
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGibberishReflectionResponse())}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Gibberish
                    </Button>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Test validation: good, generic, complaint, or gibberish responses</p>
                </div>
              )}

              {/* Loading state */}
              {isGeneratingReflectionFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your reflection with AI...</span>
                </motion.div>
              )}

              {/* AI Feedback */}
              {showReflectionFeedback && reflectionFeedback && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-lg p-6 ${
                      reflectionNeedsRetry
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {reflectionNeedsRetry ? (
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {reflectionNeedsRetry ? '⚠️ AI Feedback - Please Revise:' : '✓ AI Feedback:'}
                        </h3>
                        <p className="text-gray-900 leading-relaxed">{reflectionFeedback}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Escape Hatch */}
              {showReflectionEscapeHatch && reflectionNeedsRetry && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-400 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          ⚠️ Multiple Attempts Detected
                        </h3>
                        <p className="text-gray-900 mb-3">
                          You've tried {reflectionAttemptCount} times and the AI feedback suggests your reflection needs improvement.
                        </p>
                        <p className="text-gray-900 mb-3">
                          <strong className="text-yellow-700">You have two options:</strong>
                        </p>
                        <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                          <li>1. Try again with a different reflection that addresses the question</li>
                          <li>2. Continue anyway and move to the next step</li>
                        </ol>
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                          <p className="text-gray-900 text-sm">
                            ⚠️ <strong className="text-yellow-700">Important:</strong> If you continue, your response will be flagged for instructor review.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleReflectionTryAgain}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try One More Time
                          </Button>
                          <Button
                            onClick={handleReflectionContinueAnyway}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            Continue Anyway
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Submit / Continue Button */}
              {!(showReflectionEscapeHatch && reflectionNeedsRetry) && (
                <Button
                  onClick={() => {
                    if (showReflectionFeedback && !reflectionNeedsRetry) {
                      handleNextSegment();
                    } else if (showReflectionFeedback && reflectionNeedsRetry) {
                      handleReflectionTryAgain();
                    } else {
                      handleSubmitReflection();
                    }
                  }}
                  disabled={!showReflectionFeedback && (reflection.trim().length < MIN_REFLECTION_LENGTH || isGeneratingReflectionFeedback)}
                  size="lg"
                  className={`w-full ${
                    showReflectionFeedback && !reflectionNeedsRetry
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : showReflectionFeedback && reflectionNeedsRetry
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : reflection.trim().length >= MIN_REFLECTION_LENGTH && !isGeneratingReflectionFeedback
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGeneratingReflectionFeedback ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : showReflectionFeedback && !reflectionNeedsRetry ? (
                    <>
                      Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  ) : showReflectionFeedback && reflectionNeedsRetry ? (
                    'Try Again'
                  ) : (
                    'Submit Reflection'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      // Segment 16: The Paradox & Future - BBC Part 3 (was Segment 15, was Segment 14, was Segment 13, originally Segment 8)
      // Segment 16: The Paradox - AI as Problem and Solution
      case 16:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                The Paradox: AI as Problem and Solution
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Discover how AI can also help solve environmental problems
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This video shows the paradox: AI creates environmental problems, but AI is also being used to save water and find solutions.
                </p>
              </div>

              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.hiddenCost}
                videoId="environmental-segment-paradox"
                segments={[
                  {
                    id: 'paradox-segment',
                    title: 'The Paradox: AI as Problem and Solution',
                    start: 233,
                    end: 280,
                    source: VIDEO_URLS.hiddenCost,
                    description: 'How AI creates and solves environmental problems',
                    mandatory: true,
                  }
                ]}
                onSegmentComplete={() => {}}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 17: Promising Solutions on the Horizon
      case 17:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Promising Solutions on the Horizon
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Innovation and hope for a sustainable AI future
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
                <p className="text-center text-gray-900 font-semibold mb-4">
                  💡 While AI creates environmental challenges, tech companies and researchers are working on exciting solutions!
                </p>
              </div>

              {/* Tech Company Commitments */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🏢
                  </div>
                  Tech Company Innovations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">💧 Water Neutrality by 2030</h4>
                    <p className="text-sm text-gray-700">Google, Microsoft, and Meta have pledged to return as much water as they use</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">❄️ Evaporation-Free Cooling</h4>
                    <p className="text-sm text-gray-700">New cooling systems that don't evaporate any water at all</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">♻️ Heat Recycling</h4>
                    <p className="text-sm text-gray-700">Using AI-generated heat to warm homes and buildings</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">🌊 Seawater Cooling</h4>
                    <p className="text-sm text-gray-700">Using ocean water instead of freshwater for cooling</p>
                  </div>
                </div>
              </div>

              {/* Future Technologies */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    🚀
                  </div>
                  Futuristic Approaches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-1">🌊 Underwater Data Centers</h4>
                    <p className="text-sm text-gray-700">Moving servers beneath the ocean for natural cooling</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-1">🧊 Arctic Facilities</h4>
                    <p className="text-sm text-gray-700">Building data centers in cold climates to reduce cooling needs</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-1">🛰️ Space-Based Computing</h4>
                    <p className="text-sm text-gray-700">Experimental satellites for backup and computing tasks</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-1">⚡ Next-Gen AI Chips</h4>
                    <p className="text-sm text-gray-700">More efficient hardware that uses less power and generates less heat</p>
                  </div>
                </div>
              </div>

              {/* AI Helping the Environment */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    🌱
                  </div>
                  AI Solving Environmental Problems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">☀️ Renewable Energy Optimization</h4>
                    <p className="text-sm text-gray-700">AI makes solar and wind power grids more efficient</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">🌍 Climate Prediction</h4>
                    <p className="text-sm text-gray-700">Better weather models and climate change forecasting</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">💧 Smart Water Management</h4>
                    <p className="text-sm text-gray-700">AI-powered irrigation and leak detection systems</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">🌳 Carbon Capture</h4>
                    <p className="text-sm text-gray-700">Optimizing technologies that remove CO₂ from the atmosphere</p>
                  </div>
                </div>
              </div>

              {/* Optimistic Message */}
              <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg p-6 border-2 border-yellow-400">
                <p className="text-center text-gray-900 text-lg font-semibold mb-2">
                  🌟 "Generative AI is still very, very young"
                </p>
                <p className="text-center text-gray-700 text-sm">
                  As the industry matures, we can learn together as a society how to minimize water and energy use while maximizing AI's benefits. The solutions are coming!
                </p>
              </div>

              <Button
                onClick={handleNextSegment}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to Explore Solutions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        );

      // Segment 18: AI Solutions Sorting
      case 18:
        return <SimplifiedSolutionsSorter onComplete={handleNextSegment} />;

      // Segment 19: Moving Forward - Your Role
      case 19:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Moving Forward: Your Role in AI's Future
              </CardTitle>
              <p className="text-gray-700 mt-2">
                What you can do to make a difference
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This final video segment brings the focus back to YOU and what actions you can take moving forward.
                </p>
              </div>

              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.hiddenCost}
                videoId="environmental-segment-moving-forward"
                segments={[
                  {
                    id: 'moving-forward',
                    title: 'Moving Forward: Your Role in AI\'s Future',
                    start: 280,
                    end: 337.5,
                    source: VIDEO_URLS.hiddenCost,
                    description: 'What you can do to make a difference',
                    mandatory: true,
                  }
                ]}
                onSegmentComplete={() => {}}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 20: Exit Ticket (with AI validation)
      case 20:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Exit Ticket: Awareness and Reflection
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Reflect on what you've learned about AI's environmental impact
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Single Question */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  What difference does it make to be aware of AI's environmental cost?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Consider how this awareness might change how you think about or use AI tools in your daily life.
                </p>
                <Textarea
                  value={exitTicket}
                  onChange={(e) => setExitTicket(e.target.value)}
                  disabled={showExitTicketFeedback && !exitTicketNeedsRetry}
                  placeholder="Share your thoughts on how being aware of AI's water, energy, and carbon impact affects your perspective. Does it change anything? Why or why not?"
                  rows={5}
                  className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-600">
                  {exitTicket.length} / {MIN_EXIT_TICKET_LENGTH} characters minimum
                </p>

                {/* AI Feedback */}
                {showExitTicketFeedback && exitTicketFeedback && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 rounded-lg p-4 ${
                        exitTicketNeedsRetry
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-green-50 border-green-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {exitTicketNeedsRetry ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="w-full">
                          <h5 className="text-sm font-semibold text-gray-900 mb-1">
                            {exitTicketNeedsRetry ? 'AI Feedback - Please Revise:' : 'AI Feedback:'}
                          </h5>
                          <p className="text-sm text-gray-900">{exitTicketFeedback}</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Loading state */}
              {isGeneratingExitTicketFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your response with AI...</span>
                </motion.div>
              )}

              {/* Escape Hatch */}
              {showExitTicketEscapeHatch && exitTicketNeedsRetry && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-400 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          ⚠️ Multiple Attempts Detected
                        </h3>
                        <p className="text-gray-900 mb-3">
                          You've tried {exitTicketAttemptCount} times and the AI feedback suggests your response needs improvement.
                        </p>
                        <p className="text-gray-900 mb-3">
                          <strong className="text-yellow-700">You have two options:</strong>
                        </p>
                        <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                          <li>1. Try again with a different response that addresses the question</li>
                          <li>2. Continue anyway and get your certificate</li>
                        </ol>
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                          <p className="text-gray-900 text-sm">
                            ⚠️ <strong className="text-yellow-700">Important:</strong> If you continue, your response will be flagged for instructor review.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleExitTicketTryAgain}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try One More Time
                          </Button>
                          <Button
                            onClick={handleExitTicketContinueAnyway}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            Continue Anyway
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Submit / Continue Button */}
              {!(showExitTicketEscapeHatch && exitTicketNeedsRetry) && (
                <Button
                  onClick={() => {
                    if (showExitTicketFeedback && !exitTicketNeedsRetry) {
                      handleNextSegment();
                    } else if (showExitTicketFeedback && exitTicketNeedsRetry) {
                      handleExitTicketTryAgain();
                    } else {
                      handleSubmitExitTicket();
                    }
                  }}
                  disabled={!showExitTicketFeedback && (exitTicket.length < MIN_EXIT_TICKET_LENGTH || isGeneratingExitTicketFeedback)}
                  size="lg"
                  className={`w-full ${
                    showExitTicketFeedback && !exitTicketNeedsRetry
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : showExitTicketFeedback && exitTicketNeedsRetry
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : exitTicket.length >= MIN_EXIT_TICKET_LENGTH && !isGeneratingExitTicketFeedback
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGeneratingExitTicketFeedback ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : showExitTicketFeedback && !exitTicketNeedsRetry ? (
                    <>
                      Get Your Certificate
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  ) : showExitTicketFeedback && exitTicketNeedsRetry ? (
                    'Try Again'
                  ) : (
                    'Submit Response'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  // Show certificate
  if (showCertificate) {
    return (
      <Certificate
        userName={userName}
        courseName="AI Environmental Impact"
        completionDate={new Date().toLocaleDateString()}
        onDownload={() => {
          clearProgress(MODULE_ID);
          onComplete();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Environmental Impact</h1>
        </div>
        <p className="text-xl text-gray-700">
          Understanding AI's environmental cost and the path to sustainability
        </p>
      </div>

      {/* Developer Mode Navigation */}
      {isDevModeActive && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-red-800">Developer Mode Active</span>
              <span className="text-xs text-red-600">
                Segment {currentSegment + 1} of {segments.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (currentSegment > 0) {
                    setCurrentSegment(currentSegment - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={currentSegment === 0}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentSegment < segments.length - 1) {
                    setCurrentSegment(currentSegment + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={currentSegment === segments.length - 1}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Segment {currentSegment + 1} of {segments.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentSegment + 1) / segments.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSegment + 1) / segments.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Segment */}
      {renderSegment()}
    </div>
  );
}
