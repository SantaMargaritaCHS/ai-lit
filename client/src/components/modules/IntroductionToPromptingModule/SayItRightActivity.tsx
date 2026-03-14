import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface SayItRightActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface Question {
  wrongStatement: string;
  boldWord: string;
  correct: string;
  distractors: string[];
  explanation: string;
}

// ─── Data ────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    wrongStatement: 'ChatGPT **knows** the answer to your question',
    boldWord: 'knows',
    correct: 'ChatGPT generates a response based on patterns in its training data',
    distractors: ['ChatGPT searches the internet for your answer'],
    explanation:
      "AI doesn't 'know' anything — it predicts the most likely response based on patterns. It has no understanding of truth.",
  },
  {
    wrongStatement: 'The AI **understood** my essay and gave feedback',
    boldWord: 'understood',
    correct: 'The AI processed the text and predicted relevant feedback',
    distractors: ['The AI read and comprehended my essay like a teacher'],
    explanation:
      "AI doesn't 'understand' text the way humans do — it processes tokens and predicts statistically relevant outputs.",
  },
  {
    wrongStatement: 'AI **thinks** step-by-step when solving math',
    boldWord: 'thinks',
    correct: 'AI generates intermediate tokens that simulate step-by-step reasoning',
    distractors: ['AI carefully considers each step before answering'],
    explanation:
      "Chain-of-thought isn't actual thinking — the model generates tokens that look like reasoning steps, which often improves accuracy.",
  },
  {
    wrongStatement: 'The model **learned** not to be offensive',
    boldWord: 'learned',
    correct: 'The model was fine-tuned with human feedback to avoid harmful outputs',
    distractors: ['The model decided to stop being offensive'],
    explanation:
      "Models don't make choices about behavior — they're trained with techniques like RLHF to reduce harmful outputs.",
  },
  {
    wrongStatement: 'AI **wants** to give you the best answer',
    boldWord: 'wants',
    correct: 'AI is optimized to produce the most statistically likely helpful response',
    distractors: ['AI tries its best to satisfy your request'],
    explanation:
      "AI has no desires or goals — it's optimized to maximize a reward signal during training.",
  },
];

// Deterministic shuffle: place correct answer at a position based on question index
function getShuffledOptions(q: Question, index: number): string[] {
  const allOptions = [q.correct, ...q.distractors];
  // Insert correct answer at position determined by index
  const correctPos = index % allOptions.length;
  const result: string[] = [];
  const distractorsCopy = [...q.distractors];
  for (let i = 0; i < allOptions.length; i++) {
    if (i === correctPos) {
      result.push(q.correct);
    } else {
      result.push(distractorsCopy.shift()!);
    }
  }
  return result;
}

// ─── Render helpers ──────────────────────────────────────────────────

function renderWrongStatement(statement: string, boldWord: string) {
  const parts = statement.split(`**${boldWord}**`);
  if (parts.length < 2) return <span>{statement}</span>;
  return (
    <span>
      {parts[0]}
      <span className="font-bold underline decoration-red-400 decoration-2">{boldWord}</span>
      {parts[1]}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────

const SayItRightActivity: React.FC<SayItRightActivityProps> = ({ onComplete, isDevMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Dev mode: skip to completion
  useEffect(() => {
    if (isDevMode) {
      setScore(5);
      setFinished(true);
    }
  }, [isDevMode]);

  const question = QUESTIONS[currentIndex];
  const options = useMemo(() => getShuffledOptions(question, currentIndex), [currentIndex]);
  const isCorrect = selected === question.correct;

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    if (option === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  // ─── Completion Screen ─────────────────────────────────────────────

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card className="bg-green-50 border-green-200 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            You got {score} out of {QUESTIONS.length} correct!
          </h2>
        </Card>

        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Key Takeaway</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Using precise language about AI isn't just being picky — it keeps you from
                trusting a statistical tool like it's a thinking being. As the video said:{' '}
                <em>"We're using a statistical tool, not a conscious being."</em>
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // ─── Quiz Screen ───────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2" role="progressbar" aria-label={`Question ${currentIndex + 1} of ${QUESTIONS.length}`}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < currentIndex
                ? 'bg-green-500'
                : i === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
        <span className="ml-3 text-sm text-gray-600 font-medium">
          {currentIndex + 1} / {QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {/* Imprecise statement */}
          <Card className="bg-red-50 border-red-200 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                  Imprecise Statement
                </p>
                <p className="text-lg text-red-900">
                  {renderWrongStatement(question.wrongStatement, question.boldWord)}
                </p>
              </div>
            </div>
          </Card>

          {/* Question prompt */}
          <p className="text-gray-700 font-medium text-center">
            Which of these is the <span className="text-blue-700 font-bold">precise</span> way to
            say this?
          </p>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, i) => {
              const isThisCorrect = option === question.correct;
              const isThisSelected = option === selected;
              let borderClass = 'border-gray-200';
              let bgClass = 'bg-white hover:bg-blue-50';
              let textClass = 'text-gray-800';
              let icon = null;

              if (showResult) {
                if (isThisCorrect) {
                  borderClass = 'border-green-500';
                  bgClass = 'bg-green-50';
                  textClass = 'text-green-900';
                  icon = <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />;
                } else if (isThisSelected && !isThisCorrect) {
                  borderClass = 'border-red-400';
                  bgClass = 'bg-red-50';
                  textClass = 'text-red-900';
                  icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                } else {
                  bgClass = 'bg-gray-50';
                  textClass = 'text-gray-500';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  disabled={showResult}
                  aria-label={`Option ${i + 1}: ${option}`}
                  className={`w-full text-left p-4 rounded-lg border-2 ${borderClass} ${bgClass} ${textClass} transition-all flex items-start gap-3 disabled:cursor-default`}
                >
                  {icon}
                  <span className="text-sm leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-blue-50 border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentIndex < QUESTIONS.length - 1 ? 'Next' : 'See Results'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SayItRightActivity;
