import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Scissors, Keyboard, BarChart, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface TokenExample {
  text: string;
  tokens: string[];
  explanation: string;
}

const tokenExamples: TokenExample[] = [
  {
    text: "Hello world!",
    tokens: ["Hello", " world", "!"],
    explanation: "Common phrases often tokenize predictably"
  },
  {
    text: "AI understands patterns",
    tokens: ["AI", " under", "stands", " patterns"],
    explanation: "Longer words might split into meaningful parts"
  },
  {
    text: "ChatGPT",
    tokens: ["Chat", "G", "PT"],
    explanation: "Even brand names get broken down!"
  }
];

const quizSentence = "The teacher explained tokenization clearly.";
const correctAnswer = 6;
const quizOptions = [5, 6, 7, 8];

export default function TokenDefinition({ onComplete }: Props) {
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Auto-show continue button after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  // Animation sequence for examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % tokenExamples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Progressive content reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 1000),
      setTimeout(() => setAnimationStep(2), 2000),
      setTimeout(() => setAnimationStep(3), 3000),
      setTimeout(() => setAnimationStep(4), 4000),
      setTimeout(() => setShowQuiz(true), 25000)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleQuizAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowQuizResult(true);
    
    setTimeout(() => {
      setShowContinueButton(true);
    }, 2000);
  };

  const handleGotIt = () => {
    setShowContinueButton(true);
  };

  const currentExample = tokenExamples[currentExampleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🧩</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              What Exactly is a Token?
            </h1>
            <p className="text-white">
              Understanding the building blocks of AI language processing
            </p>
          </motion.div>

          {/* Main Definition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 mb-8 border border-blue-400"
          >
            <div className="flex items-start gap-4">
              <Puzzle className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xl text-white font-medium mb-3">
                  A token is the basic unit that LLMs use to process text.
                </p>
                <p className="text-white text-lg">
                  Think of tokens like LEGO blocks - just as you build structures with LEGO pieces, 
                  LLMs build understanding with tokens.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Point 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: animationStep >= 1 ? 1 : 0, x: animationStep >= 1 ? 0 : -20 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <Scissors className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Not Always Full Words</h3>
              </div>
              <p className="text-white">
                "running" might be 2 tokens: "run" + "ning"
              </p>
            </motion.div>

            {/* Point 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: animationStep >= 2 ? 1 : 0, x: animationStep >= 2 ? 0 : 20 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <Keyboard className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Includes Spaces & Punctuation</h3>
              </div>
              <p className="text-white">
                A space before a word is often part of the token
              </p>
            </motion.div>

            {/* Point 3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: animationStep >= 3 ? 1 : 0, x: animationStep >= 3 ? 0 : -20 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Common Patterns</h3>
              </div>
              <p className="text-white">
                Frequent words = 1 token ("the", "and")<br />
                Rare words = multiple tokens
              </p>
            </motion.div>

            {/* Point 4 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: animationStep >= 4 ? 1 : 0, x: animationStep >= 4 ? 0 : 20 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Why It Matters</h3>
              </div>
              <p className="text-white">
                LLMs have token limits (context windows)<br />
                More tokens = more processing needed
              </p>
            </motion.div>
          </div>

          {/* Animated Examples */}
          <AnimatePresence mode="wait">
            {animationStep >= 4 && (
              <motion.div
                key="examples"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-600/50"
              >
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Live Examples
                </h3>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentExampleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-lg text-white mb-3">
                      <span className="font-mono bg-gray-700 px-2 py-1 rounded">
                        "{currentExample.text}"
                      </span>
                    </div>
                    
                    <div className="flex justify-center gap-2 mb-3 flex-wrap">
                      {currentExample.tokens.map((token, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-purple-900/40 border border-purple-400 rounded px-3 py-2 text-white font-mono text-sm"
                        >
                          {token === ' ' ? '␣' : token}
                        </motion.span>
                      ))}
                    </div>
                    
                    <p className="text-white/70 text-sm">
                      {currentExample.explanation}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Check Quiz */}
          <AnimatePresence>
            {showQuiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Quick Check
                </h3>
                <p className="text-white text-center mb-4">
                  How many tokens do you think are in this sentence?
                </p>
                <div className="text-center mb-6">
                  <span className="font-mono bg-gray-700 px-4 py-2 rounded text-white text-lg">
                    "{quizSentence}"
                  </span>
                </div>
                
                {!showQuizResult && (
                  <div className="flex justify-center gap-4 mb-4">
                    {quizOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleQuizAnswer(option)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {showQuizResult && selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    {selectedAnswer === correctAnswer ? (
                      <div className="text-green-400">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Correct! 🎉</p>
                        <p className="text-white mt-2">
                          The sentence has exactly {correctAnswer} tokens: ["The", " teacher", " explained", " token", "ization", " clearly", "."]
                        </p>
                      </div>
                    ) : (
                      <div className="text-orange-400">
                        <p className="text-lg font-semibold">Close, but not quite!</p>
                        <p className="text-white mt-2">
                          The correct answer is {correctAnswer} tokens. Tokenization can be tricky - 
                          "tokenization" gets split into "token" + "ization"!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!showContinueButton && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleGotIt}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Got it!
              </motion.button>
            )}

            <AnimatePresence>
              {showContinueButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={onComplete}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 pulse"
                >
                  Continue to Token Visualization
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}