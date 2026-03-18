import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Star, AlertCircle, Target } from 'lucide-react';

interface PromptRaterActivityProps {
  onComplete: () => void;
}

interface PromptItem {
  prompt: string;
  correctAnswer: 'vague' | 'specific';
  explanation: string;
  whyThisRating: string;
}

const PROMPTS_TO_RATE: PromptItem[] = [
  {
    prompt: "Help me write something for school",
    correctAnswer: 'vague',
    explanation: "This prompt is way too vague. What subject? What type of writing? What grade level? The AI tool has no idea what you need.",
    whyThisRating: "No subject, no assignment type, no context — the AI tool has to guess everything",
  },
  {
    prompt: "I need to study for a test",
    correctAnswer: 'vague',
    explanation: "Too vague. What subject? What topics? What kind of help — flashcards, a summary, practice questions? The AI tool can't figure out what you actually need.",
    whyThisRating: "Missing: subject, topic, and what kind of study help you want",
  },
  {
    prompt: "Act as a 10th-grade biology tutor. Create 10 flashcards on Chapter 5 photosynthesis vocab — term, student-friendly definition, and real-world example on each.",
    correctAnswer: 'specific',
    explanation: "This prompt has it all: a clear Role (biology tutor), a specific Task (10 flashcards), a defined Format (term + definition + example), and Context (Chapter 5, photosynthesis, 10th-grade).",
    whyThisRating: "Has Role + Task + Format + Context = precise, useful output",
  },
  {
    prompt: "Make my essay better",
    correctAnswer: 'vague',
    explanation: '"Better" means nothing. The AI tool needs to know what to fix, how much to change, and what kind of improvements you want.',
    whyThisRating: '"Better" is not an action — no specifics about what to improve or how',
  },
  {
    prompt: "Summarize the 3 main causes of WWI in a 10th-grade paragraph — simple language, one specific example per cause.",
    correctAnswer: 'specific',
    explanation: "This tells the AI tool exactly what to do: summarize (Task), 3 causes of WWI (Context), 10th-grade level with simple language (more Context), and a paragraph format with examples (Format).",
    whyThisRating: "Clear task, specific topic, defined format, appropriate level",
  },
];

const PromptRaterActivity: React.FC<PromptRaterActivityProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const currentPrompt = PROMPTS_TO_RATE[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === currentPrompt.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextPrompt = () => {
    if (currentIndex < PROMPTS_TO_RATE.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setAllDone(true);
    }
  };

  if (allDone) {
    return (
      <Card>
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Nice work!
            </h3>
            <p className="text-gray-700 text-lg">
              You got {correctCount} out of {PROMPTS_TO_RATE.length} correct!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 font-medium">
                Key takeaway: Specific prompts with a clear action, topic, and format get much better results than vague ones. Next, you'll learn a framework to make every prompt specific.
              </p>
            </div>
            <Button onClick={onComplete} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue to Prompting Principles <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Vague or Specific?
        </CardTitle>
        <p className="text-gray-600">
          Read each prompt and decide: is it vague or specific?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {PROMPTS_TO_RATE.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx < currentIndex ? 'w-8 bg-green-500' :
                idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            {/* The prompt to classify */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                Prompt {currentIndex + 1} of {PROMPTS_TO_RATE.length}
              </p>
              <p className="text-gray-900 font-mono text-lg leading-relaxed">
                "{currentPrompt.prompt}"
              </p>
            </div>

            {/* Vague / Specific buttons */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'vague', label: 'Vague', icon: <AlertCircle className="w-5 h-5" />, baseClass: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100' },
                { value: 'specific', label: 'Specific', icon: <Target className="w-5 h-5" />, baseClass: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' },
              ].map((option) => {
                const isSelected = selectedAnswer === option.value;
                const isCorrect = option.value === currentPrompt.correctAnswer;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    disabled={showFeedback}
                    className={`flex flex-col items-center gap-2 px-6 py-5 rounded-xl border-2 font-bold text-lg transition-all ${
                      showFeedback && isCorrect
                        ? 'bg-green-200 border-green-500 text-green-900 ring-2 ring-green-400'
                        : showFeedback && isSelected && !isCorrect
                        ? 'bg-red-100 border-red-400 text-red-800'
                        : option.baseClass
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {option.icon}
                    {option.label}
                    {showFeedback && isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-5 border-2 ${
                  selectedAnswer === currentPrompt.correctAnswer
                    ? 'bg-green-50 border-green-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <p className={`font-bold mb-2 ${
                  selectedAnswer === currentPrompt.correctAnswer ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {selectedAnswer === currentPrompt.correctAnswer ? 'Correct!' : `Not quite — this prompt is ${currentPrompt.correctAnswer}.`}
                </p>
                <p className="text-gray-800 mb-2">{currentPrompt.explanation}</p>
                <p className="text-sm text-gray-600 italic">{currentPrompt.whyThisRating}</p>
              </motion.div>
            )}

            {/* Next button */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <Button onClick={handleNextPrompt} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {currentIndex < PROMPTS_TO_RATE.length - 1 ? 'Next Prompt' : 'See Results'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default PromptRaterActivity;
