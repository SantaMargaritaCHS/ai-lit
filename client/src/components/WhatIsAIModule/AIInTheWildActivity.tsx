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
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Define the intro slide
  const introSlides: Slide[] = [
    {
      title: "How AI Actually Works",
      subtitle: "The pattern behind every AI system",
      icon: Brain,
      content: (
        <div className="space-y-6 max-w-2xl mx-auto">
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
        { id: 'd1', text: 'Videos you like, watch completely, and share', isCorrect: true },
        { id: 'd2', text: 'Only videos from people you follow', isCorrect: false },
        { id: 'd3', text: 'Random trending videos from your region', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'People with similar interests watch similar content', isCorrect: true },
        { id: 'p2', text: 'Everyone in the same location likes the same videos', isCorrect: false },
        { id: 'p3', text: 'Older videos are always more popular', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Shows you videos that match your interests', isCorrect: true },
        { id: 'a2', text: 'Only shows videos with the most likes', isCorrect: false },
        { id: 'a3', text: 'Shows you every video your friends watched', isCorrect: false }
      ],
      correctData: 'Videos you like, watch completely, and share',
      correctPattern: 'People with similar interests watch similar content',
      correctAction: 'Shows you videos that match your interests'
    },
    {
      id: 'spotify',
      title: 'Spotify Discover Weekly',
      description: 'How does Spotify create your personalized playlist every Monday?',
      emoji: '🎵',
      color: 'blue',
      dataCards: [
        { id: 'd1', text: 'Songs you listen to, skip, and add to playlists', isCorrect: true },
        { id: 'd2', text: 'Only songs from your favorite artists', isCorrect: false },
        { id: 'd3', text: 'The most popular songs this week', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Listeners with similar taste enjoy similar songs', isCorrect: true },
        { id: 'p2', text: 'Everyone likes the same new releases', isCorrect: false },
        { id: 'p3', text: 'Older songs are always better', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Recommends new songs matching your music taste', isCorrect: true },
        { id: 'a2', text: 'Shows you the global top 50 songs', isCorrect: false },
        { id: 'a3', text: 'Plays every song your friends listened to', isCorrect: false }
      ],
      correctData: 'Songs you listen to, skip, and add to playlists',
      correctPattern: 'Listeners with similar taste enjoy similar songs',
      correctAction: 'Recommends new songs matching your music taste'
    },
    {
      id: 'youtube',
      title: 'YouTube Homepage',
      description: 'How does YouTube know which videos to recommend on your homepage?',
      emoji: '📺',
      color: 'pink',
      dataCards: [
        { id: 'd1', text: 'Videos you watch, like, and how long you watch them', isCorrect: true },
        { id: 'd2', text: 'Only videos from channels you subscribe to', isCorrect: false },
        { id: 'd3', text: 'Videos uploaded in the last 24 hours', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Viewers with similar watch history like similar videos', isCorrect: true },
        { id: 'p2', text: 'Everyone likes videos with the most views', isCorrect: false },
        { id: 'p3', text: 'Longer videos are always more popular', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Suggests videos based on your viewing interests', isCorrect: true },
        { id: 'a2', text: 'Shows only trending videos', isCorrect: false },
        { id: 'a3', text: 'Displays random videos from all categories', isCorrect: false }
      ],
      correctData: 'Videos you watch, like, and how long you watch them',
      correctPattern: 'Viewers with similar watch history like similar videos',
      correctAction: 'Suggests videos based on your viewing interests'
    },
    {
      id: 'gmail',
      title: 'Gmail Spam Filter',
      description: 'How does Gmail know which emails are spam and which are important?',
      emoji: '📧',
      color: 'blue',
      dataCards: [
        { id: 'd1', text: 'Emails you mark as spam, delete, or report', isCorrect: true },
        { id: 'd2', text: 'Only emails from unknown senders', isCorrect: false },
        { id: 'd3', text: 'Emails with attachments', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Spam emails share common words, links, and sender patterns', isCorrect: true },
        { id: 'p2', text: 'All promotional emails are spam', isCorrect: false },
        { id: 'p3', text: 'Emails from other countries are always spam', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Automatically filters suspicious emails to spam folder', isCorrect: true },
        { id: 'a2', text: 'Blocks all emails from new senders', isCorrect: false },
        { id: 'a3', text: 'Deletes every email with "sale" in the subject', isCorrect: false }
      ],
      correctData: 'Emails you mark as spam, delete, or report',
      correctPattern: 'Spam emails share common words, links, and sender patterns',
      correctAction: 'Automatically filters suspicious emails to spam folder'
    },
    {
      id: 'netflix',
      title: 'Netflix Recommendations',
      description: 'How does Netflix decide what shows and movies to suggest?',
      emoji: '🎬',
      color: 'pink',
      dataCards: [
        { id: 'd1', text: 'Shows you watch, rate, and how much you watch', isCorrect: true },
        { id: 'd2', text: 'Only new releases from this month', isCorrect: false },
        { id: 'd3', text: 'Shows with the highest ratings', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Viewers who like similar content watch similar shows', isCorrect: true },
        { id: 'p2', text: 'Everyone likes the same popular shows', isCorrect: false },
        { id: 'p3', text: 'Movies are always better than TV shows', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Suggests content matching your viewing preferences', isCorrect: true },
        { id: 'a2', text: 'Shows you every new release', isCorrect: false },
        { id: 'a3', text: 'Recommends the most-watched shows globally', isCorrect: false }
      ],
      correctData: 'Shows you watch, rate, and how much you watch',
      correctPattern: 'Viewers who like similar content watch similar shows',
      correctAction: 'Suggests content matching your viewing preferences'
    },
    {
      id: 'instagram',
      title: "Instagram Explore Page",
      description: "How does Instagram decide what posts to show you?",
      emoji: '📸',
      color: 'blue',
      dataCards: [
        { id: 'd1', text: 'Posts you like, save, and spend time viewing', isCorrect: true },
        { id: 'd2', text: 'Only the most recent posts from all accounts', isCorrect: false },
        { id: 'd3', text: 'Posts with the most comments', isCorrect: false }
      ],
      patternCards: [
        { id: 'p1', text: 'Users with similar engagement like similar content', isCorrect: true },
        { id: 'p2', text: 'All users in the same age group like the same things', isCorrect: false },
        { id: 'p3', text: 'Photos are always more engaging than videos', isCorrect: false }
      ],
      actionCards: [
        { id: 'a1', text: 'Suggests posts and accounts that match your interests', isCorrect: true },
        { id: 'a2', text: 'Shows you every post from accounts with many followers', isCorrect: false },
        { id: 'a3', text: 'Displays random popular posts from around the world', isCorrect: false }
      ],
      correctData: 'Posts you like, save, and spend time viewing',
      correctPattern: 'Users with similar engagement like similar content',
      correctAction: 'Suggests posts and accounts that match your interests'
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
    if (showFeedback) return; // Don't allow changes after feedback

    if (category === 'data') {
      setSelectedData(text);
      // Auto-advance to pattern step after selection
      setTimeout(() => setCurrentStep('pattern'), 600);
    }
    if (category === 'pattern') {
      setSelectedPattern(text);
      // Auto-advance to action step after selection
      setTimeout(() => setCurrentStep('action'), 600);
    }
    if (category === 'action') {
      setSelectedAction(text);
      // Auto-show feedback after completing all steps
      setTimeout(() => checkAnswers(), 600);
    }
  };

  const checkAnswers = () => {
    const isCorrect =
      selectedData === currentScenario.correctData &&
      selectedPattern === currentScenario.correctPattern &&
      selectedAction === currentScenario.correctAction;

    if (isCorrect) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setCurrentStep('data'); // Reset to first step
      setSelectedData(null);
      setSelectedPattern(null);
      setSelectedAction(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);

      // Auto-complete after showing results
      setTimeout(() => {
        onComplete();
      }, 3000);
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
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const devAutoAnswer = () => {
    setSelectedData(currentScenario.correctData);
    setSelectedPattern(currentScenario.correctPattern);
    setSelectedAction(currentScenario.correctAction);
  };

  const isAnswerComplete = selectedData && selectedPattern && selectedAction;
  const isAnswerCorrect = showFeedback &&
    selectedData === currentScenario.correctData &&
    selectedPattern === currentScenario.correctPattern &&
    selectedAction === currentScenario.correctAction;

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
                <strong>Every AI system</strong> collects data, finds patterns, and takes action based on those patterns. This three-step process is at the heart of how AI works!
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Moving to next activity in 3 seconds...
            </p>
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
            const showCorrectness = showFeedback;
            const isThisCorrect = card.isCorrect;

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(category, card.id, card.text)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${colors.selectedBg} border-gray-700 dark:border-gray-300`
                    : `${colors.card} border-transparent ${!showFeedback ? colors.cardHover : ''}`
                } ${
                  showCorrectness && isThisCorrect
                    ? 'ring-2 ring-green-500 bg-green-100 dark:bg-green-900/30'
                    : showCorrectness && isSelected && !isThisCorrect
                    ? 'ring-2 ring-red-500 bg-red-100 dark:bg-red-900/30'
                    : ''
                }`}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.text}</span>
                  {showCorrectness && isThisCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {showCorrectness && isSelected && !isThisCorrect && (
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
          <div className="flex gap-2">
            <Button
              onClick={devAutoAnswer}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto-Answer Current
            </Button>
            <Button
              onClick={devAutoComplete}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              Skip Entire Activity
            </Button>
          </div>
          <p className="text-xs text-red-600 mt-1">Fill answers or skip activity entirely</p>
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
                    isAnswerCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          Yep, you got it! 🎯
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-900 dark:text-orange-100">
                          Not quite, but here's how it works:
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentScenario.title} collects <strong>{currentScenario.correctData.toLowerCase()}</strong>,
                    finds the pattern that <strong>{currentScenario.correctPattern.toLowerCase()}</strong>,
                    and then <strong>{currentScenario.correctAction.toLowerCase()}</strong>.
                  </p>
                </motion.div>
              )}

              {/* Action Buttons - Only show when feedback is visible */}
              {showFeedback && (
                <div className="pt-4">
                  <Button
                    onClick={nextScenario}
                    className="w-full"
                    size="lg"
                  >
                    {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Activity'}
                  </Button>
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
