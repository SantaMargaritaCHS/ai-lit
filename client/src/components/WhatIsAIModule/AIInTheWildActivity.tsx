import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, Brain, Zap, Sparkles, TrendingUp, Database, Target, RotateCcw } from 'lucide-react';
import { useDevMode } from '@/context/DevModeContext';
import ActivityIntroSlides, { type Slide } from '@/components/ActivityIntroSlides';
import './WhatIsAIModule.css';

interface AIInTheWildActivityProps {
  onComplete: () => void;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: 'pink' | 'blue';
  dataCards: CardOption[];
  patternCards: CardOption[];
  actionCards: CardOption[];
  correctData: string;
  correctPattern: string;
  correctAction: string;
  dataHint: string;
  patternHint: string;
  actionHint: string;
}

interface CardOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function AIInTheWildActivity({ onComplete }: AIInTheWildActivityProps) {
  const { isDevModeActive } = useDevMode();
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<'data' | 'pattern' | 'action'>('data');
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Define the intro slide
  const introSlides: Slide[] = [
    {
      title: "How AI Actually Works",
      subtitle: "The pattern behind every AI system",
      icon: Brain,
      content: (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Now let's see HOW AI works. Every AI system follows the same three-step process.
          </p>

          <div className="space-y-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">1. Collect Data</h3>
              <p className="text-sm text-blue-800 dark:text-gray-300">
                Gather information (viewing history, emails, photos, etc.)
              </p>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">2. Find Patterns</h3>
              <p className="text-sm text-purple-800 dark:text-gray-300">
                Analyze the data to discover trends and connections
              </p>
            </div>

            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-600">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">3. Take Action</h3>
              <p className="text-sm text-green-800 dark:text-gray-300">
                Make decisions or predictions based on those patterns
              </p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-300">
            <p className="text-sm text-gray-800 dark:text-gray-300 text-center">
              <strong>Your task:</strong> For each app, match the data, pattern, and action.
            </p>
          </div>
        </div>
      )
    }
  ];

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Scenarios with shuffled answer options - prevents students from gaming by always picking first option
  const createScenarios = (): Scenario[] => {
    const baseScenarios: Scenario[] = [
    {
      id: 'tiktok',
      title: 'TikTok For You Page',
      description: 'How does TikTok know exactly what videos to show you?',
      emoji: '📱',
      color: 'pink',
      dataCards: [
        { id: 'd1', text: 'Videos you watch completely, rewatch, and how long you spend on each', isCorrect: true },
        { id: 'd2', text: 'Only videos from people you follow', isCorrect: false },
        { id: 'd3', text: 'Random trending videos from your region', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Videos that go viral spread rapidly through similar audiences', isCorrect: true },
        { id: 'p2', text: 'Everyone in the same location likes the same videos', isCorrect: false },
        { id: 'p3', text: 'Older videos are always more popular', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Prioritizes videos likely to keep you watching and scrolling', isCorrect: true },
        { id: 'a2', text: 'Only shows videos with the most likes', isCorrect: false },
        { id: 'a3', text: 'Shows you every video your friends watched', isCorrect: false }
      ],
      correctData: 'Videos you watch completely, rewatch, and how long you spend on each',
      correctPattern: 'Videos that go viral spread rapidly through similar audiences',
      correctAction: 'Prioritizes videos likely to keep you watching and scrolling',
      dataHint: 'Think about your personal viewing behavior - what details does TikTok track about HOW you watch, not just WHAT you watch?',
      patternHint: 'Consider how content spreads - do users with similar interests tend to discover and share similar videos?',
      actionHint: 'What is TikTok\'s main goal? Think about what keeps users engaged on the app the longest.'
    },
    {
      id: 'fraud-detection',
      title: 'Credit Card Fraud Detection',
      description: 'How does your bank instantly spot suspicious purchases on your card?',
      emoji: '💳',
      color: 'blue',
      dataCards: [
        { id: 'd1', text: 'Your purchase history, locations, amounts, times, and merchant types', isCorrect: true },
        { id: 'd2', text: 'Only large purchases over $500', isCorrect: false },
        { id: 'd3', text: 'Every transaction from new stores', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Fraudulent transactions often show unusual locations, amounts, or rapid sequences', isCorrect: true },
        { id: 'p2', text: 'All online purchases are more likely to be fraud', isCorrect: false },
        { id: 'p3', text: 'International transactions are always suspicious', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Flags or blocks suspicious transactions and sends you an alert', isCorrect: true },
        { id: 'a2', text: 'Automatically cancels your card after any new purchase', isCorrect: false },
        { id: 'a3', text: 'Charges fees on all international transactions', isCorrect: false }
      ],
      correctData: 'Your purchase history, locations, amounts, times, and merchant types',
      correctPattern: 'Fraudulent transactions often show unusual locations, amounts, or rapid sequences',
      correctAction: 'Flags or blocks suspicious transactions and sends you an alert',
      dataHint: 'Fraud detection needs a complete picture of YOUR normal spending habits. What details would reveal your typical behavior?',
      patternHint: 'What makes a fraudster\'s behavior different from yours? Think about what would look unusual or out of character.',
      actionHint: 'Banks want to protect you while minimizing disruption. What\'s the best balance between security and convenience?'
    },
    {
      id: 'face-id',
      title: 'Face ID Phone Unlock',
      description: 'How does your phone recognize your face even in different lighting?',
      emoji: '🔐',
      color: 'pink',
      dataCards: [
        { id: 'd1', text: 'Thousands of data points mapping your facial features, depth, and contours', isCorrect: true },
        { id: 'd2', text: 'Just a photo of your face from one angle', isCorrect: false },
        { id: 'd3', text: 'Only your eye color and hair color', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Unique facial features like distance between eyes, nose shape, and bone structure stay consistent', isCorrect: true },
        { id: 'p2', text: 'Everyone in the same family has identical facial patterns', isCorrect: false },
        { id: 'p3', text: 'Makeup and glasses completely change your facial pattern', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Unlocks only when face matches your unique biometric pattern', isCorrect: true },
        { id: 'a2', text: 'Unlocks for anyone who looks similar to you', isCorrect: false },
        { id: 'a3', text: 'Takes a new photo every time and compares it exactly', isCorrect: false }
      ],
      correctData: 'Thousands of data points mapping your facial features, depth, and contours',
      correctPattern: 'Unique facial features like distance between eyes, nose shape, and bone structure stay consistent',
      correctAction: 'Unlocks only when face matches your unique biometric pattern',
      dataHint: 'Face ID needs to work in different lighting and angles. What kind of data goes beyond a simple 2D photo?',
      patternHint: 'Your face changes with expressions and accessories, but what underlying structure stays the same?',
      actionHint: 'Security is critical here. How specific does the match need to be?'
    },
    {
      id: 'self-driving',
      title: 'Self-Driving Car Vision',
      description: 'How do self-driving cars detect pedestrians, signs, and other vehicles?',
      emoji: '🚗',
      color: 'blue',
      dataCards: [
        { id: 'd1', text: 'Camera feeds, LIDAR distance sensors, radar, and GPS location data', isCorrect: true },
        { id: 'd2', text: 'Only a front-facing camera', isCorrect: false },
        { id: 'd3', text: 'Pre-downloaded map of every road', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Pedestrians, vehicles, and road signs have distinctive shapes, movements, and positions', isCorrect: true },
        { id: 'p2', text: 'Everything on the road moves at the same speed', isCorrect: false },
        { id: 'p3', text: 'All objects are either cars or not cars', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Identifies objects, predicts movements, and adjusts steering, speed, and braking', isCorrect: true },
        { id: 'a2', text: 'Follows the car in front at a constant distance', isCorrect: false },
        { id: 'a3', text: 'Stops completely whenever any object is detected nearby', isCorrect: false }
      ],
      correctData: 'Camera feeds, LIDAR distance sensors, radar, and GPS location data',
      correctPattern: 'Pedestrians, vehicles, and road signs have distinctive shapes, movements, and positions',
      correctAction: 'Identifies objects, predicts movements, and adjusts steering, speed, and braking',
      dataHint: 'Self-driving cars need to understand the 3D world around them. What types of sensors provide different kinds of information?',
      patternHint: 'Think about what makes a pedestrian look different from a car or a stop sign. What characteristics help identify each?',
      actionHint: 'The car needs to respond to its environment safely. What decisions must it make in real-time?'
    }
    ];

    // Shuffle the options for each scenario to prevent pattern recognition
    return baseScenarios.map(scenario => ({
      ...scenario,
      dataCards: shuffleArray(scenario.dataCards),
      patternCards: shuffleArray(scenario.patternCards),
      actionCards: shuffleArray(scenario.actionCards)
    }));
  };

  // Create scenarios once when component mounts
  const [scenarios] = useState<Scenario[]>(() => createScenarios());

  const currentScenario = scenarios[currentScenarioIndex];

  const handleCardClick = (category: 'data' | 'pattern' | 'action', cardId: string, text: string) => {
    if (showFeedback && !isCorrectAnswer) return; // Don't allow changes while showing error feedback

    if (category === 'data') {
      setSelectedData(text);
      const isCorrect = text === currentScenario.correctData;
      setIsCorrectAnswer(isCorrect);
      setShowFeedback(true);

      if (isCorrect) {
        // Auto-advance to pattern step after showing success
        setTimeout(() => {
          setShowFeedback(false);
          setCurrentStep('pattern');
        }, 800);
      }
      // If wrong, stay on data step and let them retry
    }

    if (category === 'pattern') {
      setSelectedPattern(text);
      const isCorrect = text === currentScenario.correctPattern;
      setIsCorrectAnswer(isCorrect);
      setShowFeedback(true);

      if (isCorrect) {
        // Auto-advance to action step after showing success
        setTimeout(() => {
          setShowFeedback(false);
          setCurrentStep('action');
        }, 800);
      }
      // If wrong, stay on pattern step and let them retry
    }

    if (category === 'action') {
      setSelectedAction(text);
      const isCorrect = text === currentScenario.correctAction;
      setIsCorrectAnswer(isCorrect);
      setShowFeedback(true);

      if (isCorrect) {
        // All steps completed correctly
        setScore(score + 1);
      }
      // Show feedback and wait for user to click button (correct or retry)
    }
  };

  const retryCurrentStep = () => {
    // Clear the selection for the current step only
    if (currentStep === 'data') {
      setSelectedData(null);
    } else if (currentStep === 'pattern') {
      setSelectedPattern(null);
    } else if (currentStep === 'action') {
      setSelectedAction(null);
    }

    setShowFeedback(false);
    setIsCorrectAnswer(false);
  };

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setCurrentStep('data'); // Reset to first step
      setSelectedData(null);
      setSelectedPattern(null);
      setSelectedAction(null);
      setShowFeedback(false);
      setIsCorrectAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const resetActivity = () => {
    setCurrentScenarioIndex(0);
    setSelectedData(null);
    setSelectedPattern(null);
    setSelectedAction(null);
    setShowFeedback(false);
    setScore(0);
    setCompleted(false);
  };

  const devAutoComplete = () => {
    setScore(scenarios.length);
    setCompleted(true);
    // No auto-advance - wait for user to click Continue button
  };

  const devAutoAnswer = () => {
    setSelectedData(currentScenario.correctData);
    setSelectedPattern(currentScenario.correctPattern);
    setSelectedAction(currentScenario.correctAction);
  };

  const devAutoAnswerWrong = () => {
    // Select the first incorrect answer for each step
    const wrongData = currentScenario.dataCards.find(card => !card.isCorrect);
    const wrongPattern = currentScenario.patternCards.find(card => !card.isCorrect);
    const wrongAction = currentScenario.actionCards.find(card => !card.isCorrect);

    if (wrongData) setSelectedData(wrongData.text);
    if (wrongPattern) setSelectedPattern(wrongPattern.text);
    if (wrongAction) setSelectedAction(wrongAction.text);
  };

  const isAnswerComplete = selectedData && selectedPattern && selectedAction;

  // Color schemes
  const colorSchemes = {
    pink: {
      bg: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20',
      border: 'border-pink-300 dark:border-pink-700',
      text: 'text-pink-900 dark:text-pink-100',
      card: 'bg-pink-50 dark:bg-pink-900/30',
      cardHover: 'hover:bg-pink-100 dark:hover:bg-pink-800/40',
      selectedBg: 'bg-pink-200 dark:bg-pink-700',
      icon: 'text-pink-600 dark:text-pink-400'
    },
    blue: {
      bg: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      text: 'text-blue-900 dark:text-blue-100',
      card: 'bg-blue-50 dark:bg-blue-900/30',
      cardHover: 'hover:bg-blue-100 dark:hover:bg-blue-800/40',
      selectedBg: 'bg-blue-200 dark:bg-blue-700',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  };

  const colors = colorSchemes[currentScenario.color];

  // Show intro slides if not completed yet
  if (showIntroSlides) {
    return (
      <div className="max-w-4xl mx-auto">
        <ActivityIntroSlides
          slides={introSlides}
          onComplete={() => setShowIntroSlides(false)}
          activityName="AI in the Wild"
          allowSkip={true}
        />
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-2 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border-green-300">
          <CardContent className="p-8 text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />

            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Exploration Complete! 🎉
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">
                You explored {scenarios.length} real-world apps and discovered how AI works in each one!
              </p>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300">
              {score === scenarios.length
                ? 'Amazing! You connected every step correctly. You really understand the Data → Pattern → Action framework!'
                : score >= scenarios.length * 0.7
                ? 'Great work! You\'re getting the hang of how AI systems operate in everyday apps.'
                : 'Nice exploration! Each scenario revealed something new about how AI makes decisions.'}
            </p>

            <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-lg border-2 border-blue-300">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Key Insight</h4>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <strong>Every AI system</strong> collects data, finds patterns, and executes programmed responses based on those patterns. This three-step process is at the heart of how AI works!
              </p>
            </div>

            <Button
              onClick={onComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const renderCardSection = (
    category: 'data' | 'pattern' | 'action',
    title: string,
    icon: any,
    cards: CardOption[],
    selected: string | null
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
        </div>
        <div className="grid gap-2">
          {cards.map((card) => {
            const isSelected = selected === card.text;
            const isThisCorrect = card.isCorrect;
            // Only show correctness indicators when the answer is correct
            const showCorrectIndicator = showFeedback && isCorrectAnswer && isThisCorrect;
            const showWrongIndicator = showFeedback && !isCorrectAnswer && isSelected && !isThisCorrect;

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(category, card.id, card.text)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${colors.selectedBg} border-gray-700 dark:border-gray-300`
                    : `${colors.card} border-transparent ${!showFeedback ? colors.cardHover : ''}`
                } ${
                  showCorrectIndicator
                    ? 'ring-2 ring-green-500 bg-green-100 dark:bg-green-900/30'
                    : showWrongIndicator
                    ? 'ring-2 ring-red-500 bg-red-100 dark:bg-red-900/30'
                    : ''
                }`}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.text}</span>
                  {showCorrectIndicator && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {showWrongIndicator && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Developer Mode Controls */}
      {isDevModeActive && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Activity Shortcuts</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={devAutoAnswer}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto-Answer Correct
            </Button>
            <Button
              onClick={devAutoAnswerWrong}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Auto-Answer Wrong
            </Button>
            <Button
              onClick={devAutoComplete}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              Skip Entire Activity
            </Button>
          </div>
          <p className="text-xs text-red-600 mt-1">Test correct/wrong answers or skip activity entirely</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              How AI Works: Connect the Steps
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Discover how real apps use Data → Patterns → Actions. Select one step at a time!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Scenario Header */}
              <div className={`bg-gradient-to-r ${colors.bg} p-6 rounded-lg border-2 ${colors.border} mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{currentScenario.emoji}</span>
                  <h3 className={`text-2xl font-bold ${colors.text}`}>{currentScenario.title}</h3>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200">{currentScenario.description}</p>
              </div>

              {/* Step Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  currentStep === 'data' || selectedData
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300'
                }`}>
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-medium">1. Data</span>
                  {selectedData && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="w-8 h-0.5 bg-gray-300" />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  currentStep === 'pattern' || selectedPattern
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">2. Pattern</span>
                  {selectedPattern && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="w-8 h-0.5 bg-gray-300" />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  currentStep === 'action' || selectedAction
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300'
                }`}>
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">3. Action</span>
                  {selectedAction && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
              </div>

              {/* Current Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {currentStep === 'data' && renderCardSection('data', 'What DATA is the AI collecting?', Database, currentScenario.dataCards, selectedData)}
                  {currentStep === 'pattern' && renderCardSection('pattern', 'What PATTERN is it finding?', TrendingUp, currentScenario.patternCards, selectedPattern)}
                  {currentStep === 'action' && renderCardSection('action', 'What ACTION does it take?', Target, currentScenario.actionCards, selectedAction)}
                </motion.div>
              </AnimatePresence>

              {/* Feedback */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-lg border-2 ${
                    isCorrectAnswer
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrectAnswer ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          {currentStep === 'action' ? 'Perfect! All steps complete! 🎯' : 'Correct! Moving to next step...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-900 dark:text-orange-100">
                          Not quite. Think about this:
                        </span>
                      </>
                    )}
                  </div>
                  {!isCorrectAnswer && (
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      <strong>💡 Hint:</strong>{' '}
                      {currentStep === 'data' && currentScenario.dataHint}
                      {currentStep === 'pattern' && currentScenario.patternHint}
                      {currentStep === 'action' && currentScenario.actionHint}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Action Buttons - Only show when feedback is visible */}
              {showFeedback && (
                <div className="pt-4">
                  {isCorrectAnswer ? (
                    // Show Next button only after Action step is completed correctly
                    currentStep === 'action' && (
                      <Button
                        onClick={nextScenario}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Activity'}
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={retryCurrentStep}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Attribution */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Scenarios adapted from the <em>Student Guide to Artificial Intelligence</em> (Elon University, 2025)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
