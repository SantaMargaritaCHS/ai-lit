import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

export default function NeuralNetworkKnowledgeCheck({ onComplete }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = {
    question: "How do modern LLMs like ChatGPT leverage neural networks?",
    options: [
      "To understand human emotions and feelings",
      "To analyze long sequences of text and find complex patterns",
      "To think and reason like humans do",
      "To have meaningful conversations"
    ],
    correctIndex: 1,
    explanation: "Neural networks help LLMs analyze long sequences of text (not just single letters!) to find complex patterns. This gives the AI more context to make better predictions. But remember: they're finding patterns, not thinking or understanding!"
  };

  // Developer Mode: Auto-complete
  useEffect(() => {
    const handleDevAutoComplete = (event: CustomEvent) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing neural network check');
        setSelectedAnswer(1);
        setShowFeedback(true);
        setTimeout(() => onComplete(), 1500);
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
  }, [onComplete]);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (selectedAnswer === question.correctIndex) {
      onComplete();
    } else {
      // Allow retry
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Network className="h-16 w-16 text-blue-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Knowledge Check
            </h1>
            <p className="text-white/70 text-lg">
              Let's reinforce what you just learned about neural networks
            </p>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctIndex;

              let bgColor = "bg-white/10 hover:bg-white/20";
              let borderColor = "border-white/30";
              let textColor = "text-white";

              if (showFeedback) {
                if (isCorrectAnswer) {
                  bgColor = "bg-green-900/40";
                  borderColor = "border-green-400";
                } else if (isSelected) {
                  bgColor = "bg-red-900/40";
                  borderColor = "border-red-400";
                }
              } else if (isSelected) {
                bgColor = "bg-white/20";
                borderColor = "border-white/50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} text-left transition-all duration-200 flex items-center justify-between group disabled:cursor-not-allowed`}
                >
                  <span className="font-medium">{option}</span>
                  {showFeedback && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
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

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect
                    ? 'bg-green-900/40 border-2 border-green-400 text-white'
                    : 'bg-red-900/40 border-2 border-red-400 text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    {isCorrect ? (
                      <>
                        <p className="font-semibold mb-1 text-white">Exactly right!</p>
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                          <p className="text-sm text-white">
                            {question.explanation}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="font-semibold text-white">
                        Not quite! Try again and think about pattern-finding, not thinking.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
              >
                {isCorrect ? 'Continue' : 'Try Again'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
