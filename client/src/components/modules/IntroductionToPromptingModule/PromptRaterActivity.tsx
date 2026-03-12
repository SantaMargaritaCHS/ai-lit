import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Star, ThumbsDown, ThumbsUp, Minus } from 'lucide-react';

interface PromptRaterActivityProps {
  onComplete: () => void;
}

interface PromptItem {
  prompt: string;
  correctRating: 'poor' | 'okay' | 'excellent';
  explanation: string;
  whyThisRating: string;
}

const PROMPTS_TO_RATE: PromptItem[] = [
  {
    prompt: "Help me write something for school",
    correctRating: 'poor',
    explanation: "This prompt is way too vague. What subject? What type of writing? What grade level? The AI has no idea what you need.",
    whyThisRating: "No subject, no assignment type, no context = useless response",
  },
  {
    prompt: "I need to study for a test",
    correctRating: 'poor',
    explanation: "Again, too vague. What subject? What topics? What kind of help do you want — flashcards, a summary, practice questions? The AI can't read your mind.",
    whyThisRating: "Missing: subject, topic, and what kind of study help",
  },
  {
    prompt: "Act as a 10th-grade history tutor. Create a timeline of the 5 most important events leading to the American Revolution, with a one-sentence explanation for each event and a discussion question at the end.",
    correctRating: 'excellent',
    explanation: "This prompt nails it! It has a clear Role (history tutor), a specific Task (timeline of 5 events), a defined Format (one-sentence explanations + discussion question), and Context (American Revolution, 10th-grade level). The AI knows exactly what to produce.",
    whyThisRating: "Has Role + Task + Format + Context = precise, useful output",
  },
];

const RATING_OPTIONS: { value: 'poor' | 'okay' | 'excellent'; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'poor', label: 'Poor', icon: <ThumbsDown className="w-4 h-4" />, color: 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200' },
  { value: 'okay', label: 'Okay', icon: <Minus className="w-4 h-4" />, color: 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200' },
  { value: 'excellent', label: 'Excellent', icon: <ThumbsUp className="w-4 h-4" />, color: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200' },
];

const PromptRaterActivity: React.FC<PromptRaterActivityProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const currentPrompt = PROMPTS_TO_RATE[currentIndex];

  const handleRate = (rating: string) => {
    if (showFeedback) return;
    setSelectedRating(rating);
    setShowFeedback(true);
    if (rating === currentPrompt.correctRating) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNextPrompt = () => {
    if (currentIndex < PROMPTS_TO_RATE.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedRating(null);
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
              Prompt Rating Complete!
            </h3>
            <p className="text-gray-700 text-lg">
              You got {correctCount} out of {PROMPTS_TO_RATE.length} correct!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 font-medium">
                Key takeaway: Specific prompts with clear context get much better results than vague ones. Next, you'll learn a framework to make every prompt great.
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
          Rate the Prompts
        </CardTitle>
        <p className="text-gray-600">
          How good is each prompt? Rate them as Poor, Okay, or Excellent.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {PROMPTS_TO_RATE.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < currentIndex ? 'bg-green-500' :
                idx === currentIndex ? 'bg-blue-600 w-4 h-4' : 'bg-gray-300'
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
            {/* The prompt to rate */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                Prompt {currentIndex + 1} of {PROMPTS_TO_RATE.length}
              </p>
              <p className="text-gray-900 font-mono text-lg leading-relaxed">
                "{currentPrompt.prompt}"
              </p>
            </div>

            {/* Rating buttons */}
            <div className="flex gap-3 justify-center">
              {RATING_OPTIONS.map((option) => {
                const isSelected = selectedRating === option.value;
                const isCorrect = option.value === currentPrompt.correctRating;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleRate(option.value)}
                    disabled={showFeedback}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                      showFeedback && isCorrect
                        ? 'bg-green-200 border-green-500 text-green-900 ring-2 ring-green-400'
                        : showFeedback && isSelected && !isCorrect
                        ? 'bg-red-100 border-red-400 text-red-800'
                        : isSelected
                        ? 'ring-2 ring-blue-400 ' + option.color
                        : option.color
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
                className={`rounded-lg p-5 border-2 ${
                  selectedRating === currentPrompt.correctRating
                    ? 'bg-green-50 border-green-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <p className={`font-bold mb-2 ${
                  selectedRating === currentPrompt.correctRating ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {selectedRating === currentPrompt.correctRating ? 'Correct!' : `Not quite — this prompt is ${currentPrompt.correctRating}.`}
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
