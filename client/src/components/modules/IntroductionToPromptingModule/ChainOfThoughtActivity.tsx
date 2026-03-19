import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, CheckCircle, Brain, ChevronDown, X, HelpCircle, User, Bot, RotateCcw, Target } from 'lucide-react';

interface ChainOfThoughtActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

// ── Chat bubble components ──

const UserBubble = ({ children, highlight }: { children: React.ReactNode; highlight?: string }) => (
  <div className="flex justify-end">
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm whitespace-pre-line">{children}</p>
        {highlight && (
          <div className="mt-2 pt-2 border-t border-blue-400/40">
            <div className="bg-teal-400/30 border border-teal-300/50 rounded-lg px-3 py-1.5 inline-block">
              <p className="text-white font-bold text-sm">{highlight}</p>
            </div>
            <p className="text-teal-200 text-xs mt-1 font-semibold">↑ This one line changes everything</p>
          </div>
        )}
      </div>
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-blue-600" />
      </div>
    </div>
  </div>
);

const AIBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-start">
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-purple-600" />
      </div>
      <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="text-sm whitespace-pre-line">{children}</div>
      </div>
    </div>
  </div>
);

// ── Simulation data ──

type SimStep =
  | { type: 'problem'; text: string }
  | { type: 'chat-without'; prompt: string; response: string; footnote: string }
  | { type: 'question'; text: string; options: string[]; correctIndex: number; explanation: string }
  | { type: 'chat-with'; prompt: string; highlight: string }
  | { type: 'reveal-step'; stepNumber: number; text: string }
  | { type: 'chat-final'; response: string; footnote: string }
  | { type: 'compare' }
  | { type: 'takeaway'; text: string };

const SIMULATION: SimStep[] = [
  {
    type: 'problem',
    text: 'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
  },
  {
    type: 'chat-without',
    prompt: 'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
    response: '$0.10',
    footnote: '$0.10 — that was instant. Seems obvious, right?',
  },
  {
    type: 'question',
    text: 'Is the AI right? Does the ball cost $0.10?',
    options: ['Yes, $1.10 minus $1.00 = $0.10', 'Wait, let me think about that...'],
    correctIndex: 1,
    explanation: 'It\'s wrong! If the ball is $0.10, the bat is $1.10 (that\'s $1.00 more). Together that\'s $1.20, not $1.10. The AI gave the gut-reaction answer without checking the math.',
  },
  {
    type: 'chat-with',
    prompt: 'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
    highlight: 'Think through this step by step.',
  },
  { type: 'reveal-step', stepNumber: 1, text: 'Let\'s call the ball\'s price "x".' },
  { type: 'reveal-step', stepNumber: 2, text: 'The bat costs $1.00 more, so the bat = x + $1.00.' },
  { type: 'reveal-step', stepNumber: 3, text: 'Together they cost $1.10: x + (x + $1.00) = $1.10.' },
  { type: 'reveal-step', stepNumber: 4, text: 'That simplifies to 2x + $1.00 = $1.10, so 2x = $0.10.' },
  { type: 'reveal-step', stepNumber: 5, text: 'x = $0.05. The ball costs 5 cents.' },
  {
    type: 'chat-final',
    response: 'The ball costs $0.05. Check: bat = $1.05, ball = $0.05. Total = $1.10 ✓ Difference = $1.00 ✓',
    footnote: 'By working through it step by step, the AI got the right answer AND proved it\'s correct.',
  },
  {
    type: 'compare',
  },
  {
    type: 'takeaway',
    text: 'One extra line — "Think through this step by step" — was the difference between $0.10 (wrong) and $0.05 (right).',
  },
];

// ── Combined quiz data (zero-shot, few-shot, chain-of-thought) ──

interface QuizQuestion {
  prompt: string;
  answer: 'zero-shot' | 'few-shot' | 'chain-of-thought';
  explanation: string;
}

const QUIZ_POOL: QuizQuestion[] = [
  {
    prompt: 'Write a haiku about rain.',
    answer: 'zero-shot',
    explanation: 'A simple, direct request with no examples or reasoning instructions. Zero-shot.',
  },
  {
    prompt: 'Here are topic sentences I like:\n\n"The Industrial Revolution didn\'t just change factories — it rewired society."\n"Social media isn\'t the problem; our relationship with it is."\n\nNow write one for my essay about school start times.',
    answer: 'few-shot',
    explanation: 'Two examples are provided to show the style before asking. That\'s few-shot.',
  },
  {
    prompt: 'What\'s the capital of France?',
    answer: 'zero-shot',
    explanation: 'A straightforward factual question — no examples, no step-by-step needed. Zero-shot.',
  },
  {
    prompt: 'I need to decide between taking AP Biology or AP Chemistry next year. Think through the pros and cons step by step.',
    answer: 'chain-of-thought',
    explanation: '"Think through... step by step" asks the AI to show its reasoning. That\'s chain-of-thought.',
  },
  {
    prompt: '"Gravity" → "The invisible force that keeps you from floating away at lunch."\n"Velocity" → "Speed with a sense of direction — literally."\n\nNow define "acceleration" in this style.',
    answer: 'few-shot',
    explanation: 'Examples set the tone, then the AI is asked to match the pattern. Few-shot.',
  },
  {
    prompt: 'Should I use a pie chart or a bar graph to show survey results from 200 students? Walk me through your reasoning.',
    answer: 'chain-of-thought',
    explanation: '"Walk me through your reasoning" forces the AI to explain its thinking step by step. Chain-of-thought.',
  },
  {
    prompt: 'Translate this paragraph from English to Spanish.',
    answer: 'zero-shot',
    explanation: 'A direct request the AI can handle without examples or reasoning. Zero-shot.',
  },
  {
    prompt: 'My teacher grades like this:\n"Good analysis" → B+\n"Needs more evidence" → C+\n"Excellent, well-argued" → A\n\nHow would she grade this paragraph?',
    answer: 'few-shot',
    explanation: 'Three grading examples teach the AI the pattern before asking it to apply it. Few-shot.',
  },
  {
    prompt: 'Is it ethical for schools to use AI to detect cheating? Break this down into steps and consider multiple perspectives.',
    answer: 'chain-of-thought',
    explanation: '"Break this down into steps" triggers structured reasoning. Chain-of-thought.',
  },
  {
    prompt: 'Give me 5 study tips for AP History.',
    answer: 'zero-shot',
    explanation: 'A simple request with no examples or reasoning instructions. Zero-shot.',
  },
  {
    prompt: 'Casual email → "Hey! Just checking in on that project 😊"\nFormal email → "Dear Ms. Johnson, I am writing to inquire about the project status."\n\nRewrite this text in formal style: "yo can I get an extension on the paper lol"',
    answer: 'few-shot',
    explanation: 'Two style examples teach the AI the transformation before asking. Few-shot.',
  },
  {
    prompt: 'I got a 72 on my math test. I studied for 3 hours but mostly re-read my notes. Explain step by step what I should do differently next time.',
    answer: 'chain-of-thought',
    explanation: '"Explain step by step" asks for structured, sequential reasoning. Chain-of-thought.',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const QUIZ_COUNT = 10;
const PASSING_SCORE = 65;

const ANSWER_OPTIONS: { value: 'zero-shot' | 'few-shot' | 'chain-of-thought'; label: string; classes: string }[] = [
  { value: 'zero-shot', label: 'Zero-Shot', classes: 'bg-blue-600 hover:bg-blue-700' },
  { value: 'few-shot', label: 'Few-Shot', classes: 'bg-amber-500 hover:bg-amber-600' },
  { value: 'chain-of-thought', label: 'Chain-of-Thought', classes: 'bg-teal-600 hover:bg-teal-700' },
];

// ── Component ──

const ChainOfThoughtActivity: React.FC<ChainOfThoughtActivityProps> = ({ onComplete, isDevMode }) => {
  // Simulation state
  const [simStep, setSimStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);
  const [phase, setPhase] = useState<'sim' | 'quiz-intro' | 'quiz' | 'results'>('sim');
  const [compareAnswer, setCompareAnswer] = useState<number | null>(null);
  const [compareShowResult, setCompareShowResult] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState(() => shuffleArray(QUIZ_POOL).slice(0, QUIZ_COUNT));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizShowResult, setQuizShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const current = SIMULATION[simStep];

  const handleSimNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (simStep < SIMULATION.length - 1) {
      const nextIdx = simStep + 1;
      setSimStep(nextIdx);
      const next = SIMULATION[nextIdx];
      if (next.type === 'reveal-step') {
        setRevealedSteps(prev => [...prev, next.stepNumber]);
      }
    } else {
      setPhase('quiz-intro');
    }
  };

  const handleSimAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizShowResult) return;
    setQuizAnswer(answer);
    setQuizShowResult(true);
    if (answer === quizQuestions[quizIndex].answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswer(null);
      setQuizShowResult(false);
    } else {
      setPhase('results');
    }
  };

  const handleQuizRetry = () => {
    setQuizQuestions(shuffleArray(QUIZ_POOL).slice(0, QUIZ_COUNT));
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizShowResult(false);
    setQuizScore(0);
  };

  const devModeBar = isDevMode ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center justify-between">
      <p className="text-sm font-semibold text-red-800">Dev Mode</p>
      <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto" size="sm">
        <Zap className="w-3 h-3 mr-1" /> Skip Activity
      </Button>
    </div>
  ) : null;

  // ── Quiz Results ──
  if (phase === 'results') {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    const passed = percentage >= PASSING_SCORE;
    return (
      <Card>
        {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
        <CardContent className="p-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${passed ? 'bg-green-100' : 'bg-amber-100'}`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <RotateCcw className="w-10 h-10 text-amber-600" />
              )}
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">{percentage}%</h3>
              <p className="text-gray-600">{quizScore} out of {quizQuestions.length} correct</p>
            </div>

            <div className={`rounded-xl p-4 ${passed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`font-medium ${passed ? 'text-green-800' : 'text-amber-800'}`}>
                {passed
                  ? 'You can identify prompting techniques like a pro! Zero-shot, few-shot, and chain-of-thought — you\'ve got them down.'
                  : `You need ${PASSING_SCORE}% to pass. Review the techniques and try again — you've got this!`
                }
              </p>
            </div>

            {passed ? (
              <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button onClick={handleQuizRetry} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // ── Quiz Intro ──
  if (phase === 'quiz-intro') {
    return (
      <Card>
        {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
        <CardContent className="p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100">
              <Target className="w-8 h-8 text-purple-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Name That Technique</h3>
              <p className="text-gray-600 mt-2">Let's see if you can tell the three prompting techniques apart.</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-left space-y-3">
              <h4 className="font-semibold text-purple-900">How it works:</h4>
              <ul className="text-purple-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600 mt-0.5">1.</span>
                  <span>You'll see a prompt and decide which technique it uses:</span>
                </li>
                <li className="flex items-start gap-2 ml-5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>Zero-Shot</span>
                  <span className="text-purple-700 text-xs">— just ask, no examples</span>
                </li>
                <li className="flex items-start gap-2 ml-5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>Few-Shot</span>
                  <span className="text-purple-700 text-xs">— show examples first</span>
                </li>
                <li className="flex items-start gap-2 ml-5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#0d9488', color: '#ffffff' }}>Chain-of-Thought</span>
                  <span className="text-purple-700 text-xs">— ask for step-by-step reasoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600 mt-0.5">2.</span>
                  <span>There are <strong>{QUIZ_COUNT} questions</strong>. You need at least <strong>{PASSING_SCORE}%</strong> ({Math.ceil(QUIZ_COUNT * PASSING_SCORE / 100)} out of {QUIZ_COUNT}) to pass.</span>
                </li>
              </ul>
            </div>

            <Button onClick={() => setPhase('quiz')} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Start Quiz <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // ── Quiz ──
  if (phase === 'quiz') {
    const q = quizQuestions[quizIndex];
    return (
      <Card>
        {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Name That Technique
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">Which prompting technique is this? You need 65% to pass.</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
            </div>
            <span className="text-sm font-bold text-gray-500">{quizIndex + 1}/{quizQuestions.length}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={quizIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              {/* Show prompt as chat bubble */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <UserBubble>{q.prompt}</UserBubble>
              </div>

              {/* 3 answer buttons */}
              <div className="grid grid-cols-3 gap-2">
                {ANSWER_OPTIONS.map((opt) => {
                  const isSelected = quizAnswer === opt.value;
                  const isCorrect = opt.value === q.answer;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleQuizAnswer(opt.value)}
                      disabled={quizShowResult}
                      className={`rounded-xl border-2 p-3 transition-all text-center ${
                        quizShowResult && isCorrect
                          ? 'bg-green-50 border-green-500'
                          : quizShowResult && isSelected && !isCorrect
                          ? 'bg-red-50 border-red-400'
                          : quizShowResult
                          ? 'bg-gray-50 border-gray-200 opacity-40'
                          : `${opt.classes} border-transparent cursor-pointer`
                      }`}
                    >
                      <span className={`font-bold text-xs ${quizShowResult ? (isCorrect ? 'text-green-800' : isSelected ? 'text-red-800' : 'text-gray-400') : 'text-white'}`}>
                        {opt.label}
                      </span>
                      {quizShowResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-600 mx-auto mt-1" />}
                      {quizShowResult && isSelected && !isCorrect && <X className="w-4 h-4 text-red-500 mx-auto mt-1" />}
                    </button>
                  );
                })}
              </div>

              {quizShowResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className={`rounded-xl p-4 ${quizAnswer === q.answer ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <p className={`font-medium text-sm ${quizAnswer === q.answer ? 'text-green-800' : 'text-amber-800'}`}>
                      {q.explanation}
                    </p>
                  </div>
                  <Button onClick={handleQuizNext} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    {quizIndex < quizQuestions.length - 1 ? 'Next' : 'See Results'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  // ── Simulation ──
  return (
    <Card>
      {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-teal-600" />
          Chain-of-Thought Prompting
        </CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${((simStep + 1) / SIMULATION.length) * 100}%` }} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div key={simStep} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── Problem ── */}
          {current.type === 'problem' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Here's a problem</p>
                <p className="text-gray-900 font-medium text-lg">{current.text}</p>
              </div>
              <p className="text-gray-600 text-sm">Let's see what happens when you ask AI to solve it.</p>
              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Ask the AI <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Chat without CoT ── */}
          {current.type === 'chat-without' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <UserBubble>{current.prompt}</UserBubble>
                <AIBubble>{current.response}</AIBubble>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-amber-800 text-sm font-medium">{current.footnote}</p>
              </div>
              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Question ── */}
          {current.type === 'question' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-purple-900 font-medium">{current.text}</p>
              </div>

              <div className="space-y-2">
                {current.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === current.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSimAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        showExplanation && isCorrect
                          ? 'bg-green-50 border-green-500'
                          : showExplanation && isSelected && !isCorrect
                          ? 'bg-red-50 border-red-400'
                          : showExplanation
                          ? 'bg-gray-50 border-gray-200 opacity-50'
                          : 'bg-white border-gray-200 hover:border-gray-400 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                        {showExplanation && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500 shrink-0" />}
                        <p className={`text-sm font-medium ${showExplanation && !isCorrect && !isSelected ? 'text-gray-400' : 'text-gray-900'}`}>{opt}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <p className="text-teal-900 text-sm font-medium">{current.explanation}</p>
                  </div>
                  <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          {/* ── Chat with CoT (prompt only) ── */}
          {current.type === 'chat-with' && (
            <div className="space-y-4">
              <div className={`rounded-xl p-3 bg-teal-50 border-2 border-teal-300`}>
                <p className="font-semibold text-sm text-teal-800">Same question, but add one line:</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <UserBubble highlight={current.highlight}>{current.prompt}</UserBubble>
              </div>
              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                See the response <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Reveal Step ── */}
          {current.type === 'reveal-step' && (
            <div className="space-y-4">
              {current.stepNumber === 1 && (
                <p className="text-gray-600 text-sm">Watch how the AI breaks it down:</p>
              )}

              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                {/* Static: original CoT prompt */}
                <UserBubble>
                  A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?{'\n\n'}Think through this step by step.
                </UserBubble>

                {/* AI response building up */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
                      {revealedSteps.map((num) => {
                        const s = SIMULATION.find(s => s.type === 'reveal-step' && s.stepNumber === num) as { type: 'reveal-step'; stepNumber: number; text: string } | undefined;
                        if (!s) return null;
                        const isCurrent = num === current.stepNumber;
                        return (
                          <motion.div
                            key={num}
                            initial={isCurrent ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2"
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isCurrent ? 'bg-teal-500 text-white' : 'bg-teal-200 text-teal-800'}`}>
                              {num}
                            </span>
                            <p className={`text-sm ${isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>{s.text}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                {simStep < SIMULATION.length - 1 && SIMULATION[simStep + 1].type === 'reveal-step'
                  ? <>Reveal step {current.stepNumber + 1} <ChevronDown className="ml-2 w-4 h-4" /></>
                  : <>See the final answer <ArrowRight className="ml-2 w-4 h-4" /></>
                }
              </Button>
            </div>
          )}

          {/* ── Chat Final Response ── */}
          {current.type === 'chat-final' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                {/* Static: original CoT prompt */}
                <UserBubble>
                  A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?{'\n\n'}Think through this step by step.
                </UserBubble>

                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
                      {revealedSteps.map((num) => {
                        const s = SIMULATION.find(s => s.type === 'reveal-step' && s.stepNumber === num) as { type: 'reveal-step'; stepNumber: number; text: string } | undefined;
                        if (!s) return null;
                        return (
                          <div key={num} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{num}</span>
                            <p className="text-sm text-gray-700">{s.text}</p>
                          </div>
                        );
                      })}
                      <div className="border-t border-gray-300 pt-2 mt-1">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-900 font-bold text-sm">
                          {current.response}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-teal-900 text-sm font-medium">{current.footnote}</p>
              </div>

              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Compare ── */}
          {current.type === 'compare' && (
            <div className="space-y-4">
              <p className="text-gray-700 font-semibold text-sm text-center">Same prompt. Two very different experiences.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Without */}
                <div className="rounded-xl border-2 border-red-200 overflow-hidden">
                  <div className="bg-red-500 px-4 py-2 flex items-center gap-2">
                    <X className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">Without CoT</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-blue-600 text-white rounded-2xl px-3 py-2">
                      <p className="text-xs">How much does the ball cost?</p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <p className="text-red-700 font-bold text-2xl text-center">$0.10</p>
                    </div>
                  </div>
                  <div className="bg-red-50 px-4 py-2 border-t border-red-200">
                    <p className="text-red-700 text-xs font-medium">WRONG. Gut reaction, no checking.</p>
                  </div>
                </div>

                {/* With */}
                <div className="rounded-xl border-2 border-teal-200 overflow-hidden">
                  <div className="bg-teal-600 px-4 py-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">With CoT</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-blue-600 text-white rounded-2xl px-3 py-2">
                      <p className="text-xs">How much does the ball cost?</p>
                      <p className="text-xs text-blue-200">Think through this step by step.</p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 space-y-1">
                      <p className="text-xs text-gray-700">x + (x + $1) = $1.10</p>
                      <p className="text-xs text-gray-700">2x = $0.10</p>
                      <p className="text-teal-800 font-bold text-lg text-center border-t border-gray-300 pt-1 mt-1">$0.05 ✓</p>
                    </div>
                  </div>
                  <div className="bg-teal-50 px-4 py-2 border-t border-teal-200">
                    <p className="text-teal-700 text-xs font-medium">Showed the work. Got it RIGHT.</p>
                  </div>
                </div>
              </div>

              {/* Inline question */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-purple-900 font-medium text-sm mb-3">Why did chain-of-thought get $0.05 when the regular prompt said $0.10?</p>
                <div className="space-y-2">
                  {['It forced the AI to do the actual math instead of guessing', 'It just got lucky with a longer answer'].map((opt, idx) => {
                    const isSelected = compareAnswer === idx;
                    const isCorrect = idx === 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!compareShowResult) { setCompareAnswer(idx); setCompareShowResult(true); } }}
                        disabled={compareShowResult}
                        className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                          compareShowResult && isCorrect
                            ? 'bg-green-50 border-green-500'
                            : compareShowResult && isSelected && !isCorrect
                            ? 'bg-red-50 border-red-400'
                            : compareShowResult
                            ? 'bg-gray-50 border-gray-200 opacity-50'
                            : 'bg-white border-gray-200 hover:border-gray-400 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {compareShowResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                          {compareShowResult && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500 shrink-0" />}
                          <p className={`text-sm font-medium ${compareShowResult && !isCorrect && !isSelected ? 'text-gray-400' : 'text-gray-900'}`}>{opt}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {compareShowResult && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                      <p className="text-teal-900 text-sm font-medium">
                        Exactly. Without step-by-step reasoning, AI gives the same gut reaction most humans do — $0.10. But when forced to set up the equation and solve it, the AI catches that $0.10 + $1.10 = $1.20, not $1.10.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {compareShowResult && (
                <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* ── Takeaway ── */}
          {current.type === 'takeaway' && (
            <div className="space-y-4">
              <div className="bg-teal-600 rounded-xl p-6 text-white text-center">
                <Brain className="w-8 h-8 mx-auto mb-3 text-teal-200" />
                <p className="font-medium text-lg">{current.text}</p>
              </div>

              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-5 text-center">
                <p className="text-teal-700 text-xs font-semibold uppercase tracking-wide mb-3">Remember this phrase</p>
                <div className="bg-white border-2 border-teal-400 rounded-xl px-4 py-3 inline-block shadow-sm">
                  <p className="font-mono text-teal-800 text-xl font-bold">&ldquo;Think through this step by step.&rdquo;</p>
                </div>
                <p className="text-teal-700 text-sm mt-3">Add it to any prompt where accuracy matters.</p>
              </div>

              <Button onClick={handleSimNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Take the Quiz <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ChainOfThoughtActivity;
