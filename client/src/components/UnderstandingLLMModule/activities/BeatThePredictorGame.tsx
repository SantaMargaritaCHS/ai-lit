import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, ArrowRight, Sparkles, Lightbulb, CheckCircle, XCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface Prediction {
  word: string;
  probability: number;
  color: string;
}

export default function BeatThePredictorGame({ onComplete }: Props) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = quiz, 1 = interactive game
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [showPredictions, setShowPredictions] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Check-in quiz
  const checkInQuestion = {
    question: "If you remember one single thing from this entire explainer, make it this:",
    options: [
      "An LLM's only function is to predict what word should come next",
      "An LLM's job is to understand what you're asking",
      "An LLM uses beliefs and reasoning to answer questions",
      "An LLM thinks like a human brain"
    ],
    correctIndex: 0,
    explanation: "Exactly! An LLM's main, core, and ONLY function is to predict what word should come next. It's not understanding, believing, or reasoning—just predicting based on statistical patterns."
  };

  // Interactive prediction example: "My favorite animal is ___"
  const predictionExample = {
    prompt: "My favorite animal is",
    predictions: [
      { word: 'dog', probability: 45, color: 'bg-amber-500' },
      { word: 'cat', probability: 30, color: 'bg-orange-500' },
      { word: 'elephant', probability: 15, color: 'bg-gray-500' },
      { word: 'lion', probability: 6, color: 'bg-yellow-600' },
      { word: 'panda', probability: 4, color: 'bg-green-600' }
    ]
  };

  // Developer Mode: Auto-complete
  useEffect(() => {
    const handleAutoComplete = (event: CustomEvent) => {
      if (event.detail.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing Prediction Game');
        onComplete();
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleAutoComplete as EventListener);
    return () => window.removeEventListener('dev-auto-complete-activity', handleAutoComplete as EventListener);
  }, [onComplete]);

  const handleQuizAnswer = (index: number) => {
    if (showQuizFeedback) return;
    setSelectedQuizAnswer(index);
    setShowQuizFeedback(true);
  };

  const handleQuizNext = () => {
    if (selectedQuizAnswer === checkInQuestion.correctIndex) {
      setCurrentScreen(1);
    } else {
      // Reset for try again
      setSelectedQuizAnswer(null);
      setShowQuizFeedback(false);
    }
  };

  const handleShowPredictions = () => {
    if (!userGuess.trim()) return;
    setShowPredictions(true);
    setTimeout(() => setShowComparison(true), 1500);
  };

  const userGuessMatches = () => {
    const normalizedGuess = userGuess.toLowerCase().trim();
    return predictionExample.predictions.some(
      pred => pred.word.toLowerCase() === normalizedGuess
    );
  };

  const isQuizCorrect = selectedQuizAnswer === checkInQuestion.correctIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Part 1: Check-In Quiz */}
        {currentScreen === 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Quick Check-In
              </h1>
              <p className="text-white text-lg">
                Let's make sure you got the key concept from the video...
              </p>
            </div>

            <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {checkInQuestion.question}
              </h2>

              <div className="space-y-3">
                {checkInQuestion.options.map((option, index) => {
                  const isSelected = selectedQuizAnswer === index;
                  const isCorrectAnswer = index === checkInQuestion.correctIndex;

                  let bgColor = "bg-white/10 hover:bg-white/20";
                  let borderColor = "border-white/30";

                  if (showQuizFeedback) {
                    if (isCorrectAnswer) {
                      bgColor = "bg-green-900/40";
                      borderColor = "border-green-400";
                    } else if (isSelected) {
                      bgColor = "bg-red-900/40";
                      borderColor = "border-red-400";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showQuizFeedback}
                      className={`w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} text-white text-left transition-all duration-200 flex items-center justify-between`}
                    >
                      <span className="text-base">{option}</span>
                      {showQuizFeedback && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {isCorrectAnswer ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : isSelected ? (
                            <XCircle className="h-6 w-6 text-red-400" />
                          ) : null}
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {showQuizFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isQuizCorrect
                    ? 'bg-green-900/40 border-2 border-green-400'
                    : 'bg-red-900/40 border-2 border-red-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isQuizCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    {isQuizCorrect ? (
                      <>
                        <p className="font-semibold mb-1 text-white">Correct!</p>
                        <p className="text-sm text-white">
                          {checkInQuestion.explanation}
                        </p>
                      </>
                    ) : (
                      <p className="font-semibold text-white">
                        Not quite! Try again.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {showQuizFeedback && (
              <Button
                onClick={handleQuizNext}
                className={`w-full py-6 text-lg rounded-xl ${
                  isQuizCorrect
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
              >
                {isQuizCorrect ? (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  'Try Again'
                )}
              </Button>
            )}
          </div>
        )}

        {/* Part 2: Interactive Prediction Game */}
        {currentScreen === 1 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-center mb-8">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                The Prediction Game
              </h1>
              <p className="text-xl text-white">
                Can you predict what word comes next?
              </p>
            </div>

            {/* The Prompt */}
            <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-8 mb-6 text-center">
              <p className="text-3xl font-bold text-white mb-6">
                "{predictionExample.prompt} <span className="text-yellow-300">___________</span>"
              </p>

              {!showPredictions && (
                <div className="max-w-md mx-auto">
                  <label className="block text-white text-lg mb-3 text-left">
                    Your prediction:
                  </label>
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Type your guess..."
                    className="w-full p-4 rounded-xl border-2 border-white/30 bg-white/10 text-white text-xl placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && handleShowPredictions()}
                  />
                </div>
              )}
            </div>

            {!showPredictions ? (
              <Button
                onClick={handleShowPredictions}
                disabled={!userGuess.trim()}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-6 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                See What AI Predicts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                {/* Show user's guess */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-900/40 border-2 border-purple-400 rounded-xl p-6 mb-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">You predicted:</h3>
                  <p className="text-3xl font-bold text-yellow-300 capitalize">
                    {userGuess}
                  </p>
                </motion.div>

                {/* AI Predictions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900/40 border-2 border-purple-400 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">AI's Predictions:</h3>
                  </div>
                  <div className="space-y-4">
                    {predictionExample.predictions.map((pred, index) => {
                      const isUserGuess = pred.word.toLowerCase() === userGuess.toLowerCase().trim();
                      return (
                        <motion.div
                          key={pred.word}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.15 }}
                          className={isUserGuess ? 'ring-2 ring-yellow-400 rounded-lg p-2 -m-2' : ''}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold text-lg capitalize ${
                              isUserGuess ? 'text-yellow-300' : 'text-white'
                            }`}>
                              {pred.word}
                              {isUserGuess && ' ⭐'}
                            </span>
                            <span className="text-white text-base">
                              {pred.probability}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                            <motion.div
                              className={`${pred.color} h-full rounded-full flex items-center justify-end pr-2`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                            >
                              {pred.probability >= 20 && (
                                <span className="text-white text-xs font-bold">
                                  {pred.probability}%
                                </span>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Comparison & Explanation */}
                <AnimatePresence>
                  {showComparison && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 mb-6"
                    >
                      {userGuessMatches() ? (
                        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400 rounded-xl p-6">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-3">
                                You matched the AI!
                              </h3>
                              <p className="text-white text-base leading-relaxed mb-3">
                                You and the AI made the same prediction. That's because <strong className="text-yellow-300">you're both pattern matching</strong>!
                              </p>
                              <p className="text-white text-base leading-relaxed">
                                The AI isn't "smarter"—it just has access to <strong className="text-yellow-300">way more data</strong> about how people typically complete this sentence.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-2 border-blue-400 rounded-xl p-6">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-3">
                                Different predictions!
                              </h3>
                              <p className="text-white text-base leading-relaxed mb-3">
                                Your guess was unique—but that doesn't mean the AI is "right" and you're "wrong."
                              </p>
                              <p className="text-white text-base leading-relaxed">
                                The AI just predicted what word appears <strong className="text-yellow-300">most often</strong> in its training data after "{predictionExample.prompt}". It's all about <strong className="text-yellow-300">statistical patterns</strong>, not truth!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-400 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-white font-semibold mb-2 text-lg">
                              The Key Takeaway
                            </p>
                            <p className="text-white text-base leading-relaxed">
                              The AI isn't thinking or understanding—it's just calculating <strong className="text-yellow-300">statistical probabilities</strong> based on patterns it's seen billions of times.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Continue Button */}
                {showComparison && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={onComplete}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
}
