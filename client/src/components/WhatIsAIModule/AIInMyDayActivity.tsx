import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Smartphone, Calculator, Music, Search, Lightbulb,
  Clock, MessageSquare, Zap, CheckCircle, XCircle,
  Sparkles, Brain, Trophy
} from 'lucide-react';

interface AIInMyDayActivityProps {
  onComplete: () => void;
}

interface TechItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isAI: boolean;
  explanation: string;
  emoji: string;
}

const techItems: TechItem[] = [
  // AI Items (5)
  {
    id: 'autocorrect',
    name: 'Autocorrect',
    icon: MessageSquare,
    isAI: true,
    explanation: 'Autocorrect uses AI because it learns from millions of people\'s typing patterns. When you type, it predicts what word comes next based on patterns it learned from data. Traditional software just follows fixed rules, but AI adapts to different writing styles.',
    emoji: '✨'
  },
  {
    id: 'music-recommendations',
    name: 'Music Recommendations',
    icon: Music,
    isAI: true,
    explanation: 'Music apps use AI to analyze your listening habits—what you play, skip, and replay. The AI finds patterns in your behavior and predicts new songs you\'ll like. As your taste changes, the recommendations adapt because the AI keeps learning.',
    emoji: '🎵'
  },
  {
    id: 'google-search',
    name: 'Search Results',
    icon: Search,
    isAI: true,
    explanation: 'Search engines use AI to learn from billions of searches and clicks. They notice patterns like "people who search this phrase usually click these links" and use that to rank results. The ranking adapts over time as the AI learns what\'s actually helpful.',
    emoji: '🔍'
  },
  {
    id: 'social-media-feed',
    name: 'Social Media Feed',
    icon: Smartphone,
    isAI: true,
    explanation: 'Your feed uses AI to watch what you like, comment on, and how long you view each post. It learns patterns about your interests and predicts what content will keep you engaged. The AI constantly adapts to your changing behavior.',
    emoji: '📱'
  },
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    icon: Zap,
    isAI: true,
    explanation: 'Voice assistants like Siri and Alexa use AI to learn from millions of people speaking. They recognize patterns in speech to understand different accents and words. They also learn your preferences and adapt over time to serve you better.',
    emoji: '🗣️'
  },
  // Non-AI Items (5)
  {
    id: 'phone-alarm',
    name: 'Phone Alarm',
    icon: Clock,
    isAI: false,
    explanation: 'A phone alarm is just a simple countdown timer that follows fixed rules. It doesn\'t learn when you actually wake up or adapt to your sleep patterns. It does the same thing every time—ring at the set time. AI would notice your patterns and adjust automatically.',
    emoji: '⏰'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    isAI: false,
    explanation: 'A calculator uses pre-programmed math formulas and always does 2+2=4 the exact same way. It never learns from your calculations or adapts to patterns. AI would notice if you always calculate tips and start predicting amounts, but a calculator never will.',
    emoji: '🔢'
  },
  {
    id: 'flashlight',
    name: 'Flashlight App',
    icon: Lightbulb,
    isAI: false,
    explanation: 'A flashlight app is just a simple on/off switch for your phone\'s LED light. It doesn\'t learn when you typically use it or adapt the brightness based on patterns. It\'s the same fixed function every single time—no learning means no AI.',
    emoji: '💡'
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    icon: Clock,
    isAI: false,
    explanation: 'A stopwatch measures time by counting seconds using fixed programming rules. It doesn\'t learn from how you use it or predict when you\'ll stop it. The same basic programming runs every time. AI would learn your workout patterns and suggest timing, but a stopwatch never adapts.',
    emoji: '⏱️'
  },
  {
    id: 'basic-photo',
    name: 'Basic Camera',
    icon: Smartphone,
    isAI: false,
    explanation: 'A basic camera just captures whatever light hits the sensor—no learning or decision-making involved. Modern phones often add AI features like detecting faces or scenes, but the core camera sensor itself is traditional technology that just records photons.',
    emoji: '📷'
  }
];

export default function AIInMyDayActivity({ onComplete }: AIInMyDayActivityProps) {
  const [predictions, setPredictions] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const predictedCount = Object.keys(predictions).length;
  const totalItems = techItems.length;
  const allPredicted = predictedCount === totalItems;

  const handlePrediction = (itemId: string, predictedIsAI: boolean) => {
    setPredictions(prev => ({
      ...prev,
      [itemId]: predictedIsAI
    }));

    // Check if all items are predicted
    const newPredictedCount = Object.keys(predictions).length + 1;
    if (newPredictedCount === totalItems) {
      setTimeout(() => {
        setShowSummary(true);
      }, 400);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(predictions).forEach(([itemId, prediction]) => {
      const item = techItems.find(t => t.id === itemId);
      if (item && prediction === item.isAI) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">🤖 AI in My Day</h2>
        <p className="text-lg text-gray-600">
          {!allPredicted
            ? "See how many AI technologies you use without even realizing it!"
            : "Nice work! Check your results! 🎉"}
        </p>
      </div>

      {/* Instructions Card */}
      {predictedCount === 0 && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h3 className="font-bold text-lg text-blue-900">Your Task:</h3>
              </div>
              <p className="text-blue-900">
                For each technology below, decide: <strong>Does it use AI or not?</strong>
              </p>
              <p className="text-sm text-blue-800">
                💡 <strong>Hint:</strong> Ask yourself: "Does this technology <strong>learn from data and adapt</strong> over time,
                or does it just follow <strong>the same fixed rules</strong> every time?"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tracker */}
      {!allPredicted && predictedCount > 0 && (
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl font-bold text-purple-600">{predictedCount} of {totalItems}</span>
          <Progress value={(predictedCount / totalItems) * 100} className="w-48 h-3" />
        </div>
      )}

      {/* Tech Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techItems.map((item) => {
          const hasPredicted = predictions[item.id] !== undefined;
          const predictedCorrectly = hasPredicted && predictions[item.id] === item.isAI;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`overflow-hidden transition-all duration-300 ${
                  hasPredicted
                    ? predictedCorrectly
                      ? 'border-2 border-green-400 shadow-lg shadow-green-100'
                      : 'border-2 border-orange-400 shadow-lg shadow-orange-100'
                    : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className={`p-4 ${
                    hasPredicted
                      ? predictedCorrectly
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                        : 'bg-gradient-to-r from-orange-50 to-amber-50'
                      : 'bg-gradient-to-r from-gray-50 to-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{item.emoji}</span>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      </div>
                      {hasPredicted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          {predictedCorrectly ? (
                            <div className="bg-green-500 rounded-full p-1">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div className="bg-orange-500 rounded-full p-1">
                              <XCircle className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {!hasPredicted ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePrediction(item.id, true)}
                          className="flex-1 h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Sparkles className="h-5 w-5 mr-2" />
                          Uses AI
                        </Button>
                        <Button
                          onClick={() => handlePrediction(item.id, false)}
                          variant="outline"
                          className="flex-1 h-12 text-base font-semibold border-2 border-gray-300 hover:bg-gray-100"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          No AI
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        {/* Answer Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.isAI ? (
                            <>
                              <Badge className="bg-purple-600 hover:bg-purple-600 text-white border-0 text-sm px-3 py-1">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Uses AI
                              </Badge>
                              {predictedCorrectly && (
                                <span className="text-green-600 font-semibold text-sm">You got it! 🎉</span>
                              )}
                              {!predictedCorrectly && (
                                <span className="text-orange-600 font-semibold text-sm">Actually, this uses AI!</span>
                              )}
                            </>
                          ) : (
                            <>
                              <Badge variant="secondary" className="bg-gray-200 text-gray-800 border-0 text-sm px-3 py-1">
                                No AI
                              </Badge>
                              {predictedCorrectly && (
                                <span className="text-green-600 font-semibold text-sm">Correct! 👍</span>
                              )}
                              {!predictedCorrectly && (
                                <span className="text-orange-600 font-semibold text-sm">This one doesn't use AI</span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Explanation */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Section */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-4"
          >
            {/* Score Card */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center text-white">
                <Trophy className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">Your Score</h3>
                <p className="text-6xl font-black mb-3">
                  {score}/{totalItems}
                </p>
                <p className="text-xl font-semibold">
                  {score === totalItems && "🌟 Perfect! You really understand AI!"}
                  {score >= 8 && score < totalItems && "🔥 Excellent work! You've got this!"}
                  {score >= 6 && score < 8 && "💪 Good job! You're learning!"}
                  {score < 6 && "📚 Keep practicing—understanding AI takes time!"}
                </p>
              </div>
            </Card>

            {/* Key Concepts */}
            <Card className="border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    🎯 Key Takeaway
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* AI */}
                  <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                      <p className="font-bold text-lg text-purple-900">AI Technology</p>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-900">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-purple-600" />
                        <span><strong>Learns</strong> from data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-purple-600" />
                        <span><strong>Adapts</strong> over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-purple-600" />
                        <span><strong>Predicts</strong> patterns</span>
                      </li>
                    </ul>
                  </div>

                  {/* Non-AI */}
                  <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-300">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-6 w-6 text-gray-600" />
                      <p className="font-bold text-lg text-gray-900">Traditional Tech</p>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
                        <span>Follows <strong>fixed rules</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
                        <span><strong>Same</strong> every time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
                        <span><strong>Never learns</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-600 rounded-xl p-5 text-white">
                  <p className="text-base leading-relaxed">
                    <strong>💡 The Big Idea:</strong> If it learns from data and adapts to you, it's AI.
                    If it follows the same rules every single time, it's traditional technology.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="text-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="w-full md:w-auto text-lg h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue Learning About AI →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
