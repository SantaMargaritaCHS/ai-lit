import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

const PREDICTION_SCENARIOS = [
  {
    id: 1,
    context: "The teacher wrote on the",
    options: ["board", "student", "purple", "quickly"],
    correct: 0,
    explanation: "LLMs predict 'board' because it frequently follows 'teacher wrote on the' in training data."
  },
  {
    id: 2,
    context: "Students submitted their homework",
    options: ["yesterday", "assignment", "blue", "teacher"],
    correct: 0,
    explanation: "Time references like 'yesterday' commonly follow 'submitted their homework' in text."
  },
  {
    id: 3,
    context: "The principal announced a new",
    options: ["policy", "sandwich", "purple", "quietly"],
    correct: 0,
    explanation: "LLMs learn that principals typically announce policies, rules, or programs."
  },
  {
    id: 4,
    context: "During recess, children love to",
    options: ["play", "calculate", "purple", "principal"],
    correct: 0,
    explanation: "The model predicts 'play' based on millions of examples linking recess with playing."
  }
];

export default function WordPredictionGame({ onComplete }: Props) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = PREDICTION_SCENARIOS[currentScenario];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === scenario.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < PREDICTION_SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Brain className="w-8 h-8 text-purple-400" />
              Word Prediction Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mb-4">
              <p className="text-white mb-2">
                Question {currentScenario + 1} of {PREDICTION_SCENARIOS.length}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentScenario + 1) / PREDICTION_SCENARIOS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg text-white mb-6">
                What word would an AI most likely predict to complete this sentence?
              </p>
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-xl font-medium text-white">
                  "{scenario.context} <span className="text-purple-400">_______</span>"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {scenario.options.map((option, index) => {
                  const isCorrect = index === scenario.correct;
                  const isSelected = selectedAnswer === index;
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        showExplanation && isSelected
                          ? isCorrect
                            ? 'border-green-400 bg-green-900/40 text-green-300'
                            : 'border-red-400 bg-red-900/40 text-red-300'
                          : showExplanation && isCorrect
                          ? 'border-green-400 bg-green-900/40 text-green-300'
                          : 'border-gray-600 hover:border-purple-400 bg-gray-800 text-white'
                      } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showExplanation && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {showExplanation && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-900/40 border border-blue-400 rounded-lg p-6"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">AI Explanation</h4>
                    <p className="text-white">{scenario.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {showExplanation && (
              <div className="text-center">
                <Button
                  onClick={handleNext}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {currentScenario < PREDICTION_SCENARIOS.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Game (Score: {score}/{PREDICTION_SCENARIOS.length})
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}