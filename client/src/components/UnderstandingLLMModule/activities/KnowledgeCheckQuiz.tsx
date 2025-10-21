import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "What does the acronym LLM stand for?",
    options: [
      "Large Learning Machine",
      "Large Language Model",
      "Language Learning Module",
      "Linguistic Logic Model"
    ],
    correctIndex: 1,
    explanation: "LLM stands for Large Language Model. The name gives you big clues about what it does!"
  },
  {
    question: "The 'L' in LLM stands for 'Large.' What does this primarily refer to?",
    options: [
      "The large number of people using the AI",
      "The large amount of electricity the AI uses",
      "The mind-bogglingly large amount of text data it's trained on",
      "The large physical size of the servers"
    ],
    correctIndex: 2,
    explanation: "Large refers to the truly mind-boggling amount of text data—huge chunks of the internet!"
  },
  {
    question: "According to the video, what is the main 'job' of a Language Model?",
    options: [
      "To think and reason like a human",
      "To spot patterns in how humans write and talk",
      "To create brand new, original ideas never seen before",
      "To check if facts are true or false"
    ],
    correctIndex: 1,
    explanation: "A language model's job is to get really, really good at spotting patterns in how we humans talk and write."
  }
];

export default function KnowledgeCheckQuiz({ onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false); // Track if they've tried this question

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    // Only count score on first attempt
    if (index === questions[currentQuestion].correctIndex && !hasAttempted) {
      setScore(score + 1);
    }
    setHasAttempted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setHasAttempted(false); // Reset for next question
    } else {
      setCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    // Don't reset hasAttempted - they already tried once
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correctIndex;

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6"
      >
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">
              🎉
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Perfect Score!
          </h2>

          <div className="text-5xl font-bold text-blue-300 mb-4">
            {score} / {questions.length}
          </div>

          <p className="text-white/80 text-lg mb-8">
            You've got a solid understanding of what an LLM is!
          </p>

          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8">
            {questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === questions[currentQuestion].correctIndex;

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
                      <p className="font-semibold mb-1 text-white">Correct!</p>
                      <p className="text-sm text-white">
                        {questions[currentQuestion].explanation}
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

          {/* Action Button - Try Again or Next */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isCorrect ? (
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg rounded-xl"
                >
                  Try Again
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
