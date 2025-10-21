// Create: /client/src/components/UnderstandingLLMModule/activities/WordPredictionImproved.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Info, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Prediction {
  word: string;
  probability: number;
  color: string;
}

export default function WordPredictionImproved({ onComplete }: Props) {
  const [stage, setStage] = useState<'intro' | 'game' | 'explanation'>('intro');
  const [currentExample, setCurrentExample] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const examples = [
    {
      prompt: "The capital of France is",
      predictions: [
        { word: "Paris", probability: 0.89, color: "bg-green-500" },
        { word: "Lyon", probability: 0.04, color: "bg-yellow-500" },
        { word: "London", probability: 0.02, color: "bg-orange-500" },
        { word: "beautiful", probability: 0.03, color: "bg-red-500" },
        { word: "France", probability: 0.02, color: "bg-red-500" }
      ],
      correctAnswer: "Paris",
      explanation: "The AI assigns 89% confidence to 'Paris' because it appeared in this exact context millions of times in training data."
    },
    {
      prompt: "To make a peanut butter sandwich, first",
      predictions: [
        { word: "spread", probability: 0.42, color: "bg-green-500" },
        { word: "get", probability: 0.31, color: "bg-green-500" },
        { word: "take", probability: 0.15, color: "bg-yellow-500" },
        { word: "you", probability: 0.08, color: "bg-orange-500" },
        { word: "eat", probability: 0.04, color: "bg-red-500" }
      ],
      correctAnswer: "spread",
      explanation: "Multiple words could work here! The AI shows lower confidence because several valid options exist in its training data."
    },
    {
      prompt: "In the classroom, students should always",
      predictions: [
        { word: "be", probability: 0.28, color: "bg-yellow-500" },
        { word: "respect", probability: 0.24, color: "bg-yellow-500" },
        { word: "follow", probability: 0.21, color: "bg-yellow-500" },
        { word: "listen", probability: 0.18, color: "bg-yellow-500" },
        { word: "raise", probability: 0.09, color: "bg-orange-500" }
      ],
      correctAnswer: "be",
      explanation: "Notice the spread of probabilities! This happens because classroom rules vary widely in the training data."
    },
    {
      prompt: "The speed of light is approximately",
      predictions: [
        { word: "300,000", probability: 0.67, color: "bg-green-500" },
        { word: "186,000", probability: 0.18, color: "bg-yellow-500" },
        { word: "299,792", probability: 0.10, color: "bg-yellow-500" },
        { word: "very", probability: 0.03, color: "bg-red-500" },
        { word: "the", probability: 0.02, color: "bg-red-500" }
      ],
      correctAnswer: "300,000",
      explanation: "Scientific facts show higher confidence. The AI learned this specific number combination from many scientific texts."
    }
  ];

  const handleWordSelect = (word: string) => {
    setSelectedWord(word);
    setShowResults(true);
  };

  const nextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1);
      setSelectedWord(null);
      setShowResults(false);
    } else {
      setStage('explanation');
    }
  };

  // Developer Mode: Auto-complete functionality
  useEffect(() => {
    const handleDevAutoComplete = (event: any) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing word prediction game');
        
        if (stage === 'intro') {
          setStage('game');
        } else if (stage === 'game') {
          // Auto-select correct answers and advance
          const autoPlay = () => {
            handleWordSelect(examples[currentExample].correctAnswer);
            setTimeout(() => {
              if (currentExample < examples.length - 1) {
                nextExample();
                setTimeout(autoPlay, 500);
              } else {
                setStage('explanation');
                setTimeout(() => {
                  onComplete();
                }, 1500);
              }
            }, 1000);
          };
          autoPlay();
        } else if (stage === 'explanation') {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, [stage, currentExample, examples, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {stage === 'intro' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Think Like an LLM: Word Prediction
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            LLMs predict the next word by calculating probabilities. See how confident 
            the AI is about different word choices!
          </p>
          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <Info className="w-6 h-6 text-blue-400 inline mr-2" />
            <p className="text-white text-left">
              The percentages show how confident the AI is. Higher percentages mean 
              the AI saw this word pattern more often in its training data.
            </p>
          </div>
          <button
            onClick={() => setStage('game')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Start Prediction Game
          </button>
        </div>
      )}

      {stage === 'game' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Example {currentExample + 1} of {examples.length}
              </h2>
              <div className="flex gap-1">
                {examples.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= currentExample ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <p className="text-2xl text-white mb-2">
              "{examples[currentExample].prompt}
              <span className="text-blue-400 font-bold animate-pulse"> _____ </span>"
            </p>
            <p className="text-white/70 text-sm">Click the word the AI would most likely predict</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <AnimatePresence>
              {examples[currentExample].predictions.map((pred, index) => (
                <motion.button
                  key={pred.word}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleWordSelect(pred.word)}
                  disabled={showResults}
                  className={`relative overflow-hidden rounded-lg p-4 text-left transition-all ${
                    showResults
                      ? 'cursor-default'
                      : 'hover:scale-[1.02] cursor-pointer'
                  } ${
                    selectedWord === pred.word
                      ? 'ring-4 ring-blue-400'
                      : ''
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{pred.word}</span>
                    <div className="flex items-center gap-3">
                      {showResults && (
                        <>
                          <span className="text-2xl font-bold text-white">
                            {(pred.probability * 100).toFixed(0)}%
                          </span>
                          {pred.word === examples[currentExample].correctAnswer && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Probability Bar */}
                  {showResults && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.probability * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`absolute inset-0 ${pred.color} opacity-30`}
                    />
                  )}
                  
                  {/* Background */}
                  <div className="absolute inset-0 bg-gray-700/50" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`rounded-lg p-4 ${
                selectedWord === examples[currentExample].correctAnswer
                  ? 'bg-green-900/30 border border-green-400'
                  : 'bg-yellow-900/30 border border-yellow-400'
              }`}>
                <p className="text-white">
                  {selectedWord === examples[currentExample].correctAnswer
                    ? "🎉 Correct! You predicted like an LLM!"
                    : `The AI would most likely choose "${examples[currentExample].correctAnswer}"`}
                </p>
              </div>

              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4">
                <p className="text-white">
                  <strong>Why these probabilities?</strong> {examples[currentExample].explanation}
                </p>
              </div>

              <button
                onClick={nextExample}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {currentExample < examples.length - 1 ? (
                  <>Next Example <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>See How This Works <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {stage === 'explanation' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How LLMs Calculate Probabilities
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">🎯 High Confidence (70-100%)</h3>
              <p className="text-white">
                When the AI has seen a phrase thousands of times in the same way, like 
                "The capital of France is Paris", it assigns very high probability to the expected word.
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">🤔 Medium Confidence (30-70%)</h3>
              <p className="text-white">
                When multiple words could work, the AI spreads probability across options. 
                This happens with creative or open-ended prompts.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">❓ Low Confidence (0-30%)</h3>
              <p className="text-white">
                Words that could grammatically fit but rarely appear in this context get
                low probabilities. The AI assigns them low probability because these patterns rarely appeared in training data.
              </p>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 mb-6">
            <p className="text-white text-center text-lg">
              💡 <strong>Key Insight:</strong> LLMs don't "understand" - they predict based on patterns. 
              High confidence just means "I've seen this pattern a lot!"
            </p>
          </div>

          {/* Add transition message */}
          <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-3">🔍 What You've Learned:</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-white">AI predicts words based on patterns in training data</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-white">Common word combinations have higher probabilities</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-white">Context heavily influences AI predictions</p>
              </div>
            </div>
            
            <div className="border-t border-yellow-400/20 pt-4">
              <p className="text-white">
                <strong>Up Next:</strong> Now let's reflect on how this pattern recognition works and what it means for how we use AI in education and daily life.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            Continue to Pattern Recognition <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}