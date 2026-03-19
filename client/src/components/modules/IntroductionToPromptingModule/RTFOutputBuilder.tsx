import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';

interface RTFOutputBuilderProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface QuizQuestion {
  prompt: string;
  highlighted: string;
  correctAnswer: 'R' | 'T' | 'F' | 'C';
  explanation: string;
}

const QUIZ_QUESTIONS_POOL: QuizQuestion[] = [
  {
    prompt: 'Compare the advantages and disadvantages of renewable vs. fossil fuel energy.',
    highlighted: 'Compare the advantages and disadvantages',
    correctAnswer: 'T',
    explanation: '"Compare" is the action verb — it tells the AI exactly what to DO. That\'s the Task.',
  },
  {
    prompt: 'I\'m a 10th grader studying for a test on Friday about cell division.',
    highlighted: 'a 10th grader studying for a test on Friday about cell division',
    correctAnswer: 'C',
    explanation: 'Grade level, topic, and deadline — that\'s background info about YOUR situation. That\'s Context.',
  },
  {
    prompt: 'Present the answer as a numbered list with explanations.',
    highlighted: 'a numbered list with explanations',
    correctAnswer: 'F',
    explanation: 'This describes HOW the response should look — a numbered list. That\'s the Format.',
  },
  {
    prompt: 'You are an experienced debate coach who teaches competitive speech.',
    highlighted: 'an experienced debate coach',
    correctAnswer: 'R',
    explanation: 'It\'s telling the AI to act as a debate coach — that\'s assigning a Role.',
  },
  {
    prompt: 'This is for my 11th grade Environmental Science class and we\'re focusing on sustainability.',
    highlighted: 'my 11th grade Environmental Science class ... focusing on sustainability',
    correctAnswer: 'C',
    explanation: 'Class, grade level, and topic focus — all background info. That\'s Context.',
  },
  {
    prompt: 'Explain the causes of the American Revolution in simple terms.',
    highlighted: 'Explain the causes of the American Revolution',
    correctAnswer: 'T',
    explanation: '"Explain" is the action verb — it tells the AI what to DO. That\'s the Task.',
  },
  {
    prompt: 'Act as a patient biology tutor for high school students.',
    highlighted: 'a patient biology tutor for high school students',
    correctAnswer: 'R',
    explanation: 'This tells the AI WHO to be — a biology tutor. That\'s the Role.',
  },
  {
    prompt: 'Write it as a two-column table with pros on one side and cons on the other.',
    highlighted: 'a two-column table',
    correctAnswer: 'F',
    explanation: 'A two-column table describes the STRUCTURE of the output. That\'s the Format.',
  },
  {
    prompt: 'Summarize the 3 main themes of To Kill a Mockingbird.',
    highlighted: 'Summarize the 3 main themes',
    correctAnswer: 'T',
    explanation: '"Summarize" is the action. "3 main themes" is what you want. That\'s a Task.',
  },
  {
    prompt: 'Respond in bullet points, keeping each point under 2 sentences.',
    highlighted: 'in bullet points, keeping each point under 2 sentences',
    correctAnswer: 'F',
    explanation: 'Bullet points with a length constraint — that\'s how you want it structured. That\'s Format.',
  },
];

// Shuffle questions on each quiz attempt using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const RTFC_OPTIONS = [
  { letter: 'R', label: 'Role', color: '#2563eb', description: 'Who the AI should be' },
  { letter: 'T', label: 'Task', color: '#16a34a', description: 'What you want done' },
  { letter: 'F', label: 'Format', color: '#9333ea', description: 'How it should look' },
  { letter: 'C', label: 'Context', color: '#ea580c', description: 'Your situation details' },
];

const PASSING_SCORE = 70;

const RTFOutputBuilder: React.FC<RTFOutputBuilderProps> = ({ onComplete, isDevMode }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [questions, setQuestions] = useState(() => shuffleArray(QUIZ_QUESTIONS_POOL));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= PASSING_SCORE;

  const handleAnswer = (letter: string) => {
    if (showFeedback) return;
    setSelectedAnswer(letter);
    setShowFeedback(true);
    setAnswered(prev => prev + 1);
    if (letter === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setQuestions(shuffleArray(QUIZ_QUESTIONS_POOL));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnswered(0);
    setShowResults(false);
  };

  const devModeBar = isDevMode ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center justify-between">
      <p className="text-sm font-semibold text-red-800">Dev Mode</p>
      <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto" size="sm">
        Skip Quiz
      </Button>
    </div>
  ) : null;

  // Intro screen
  if (showIntro) {
    return (
      <Card>
        {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-5"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <Target className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">RTFC Quiz: Name That Part</h3>
              <p className="text-gray-600 mt-2">Time to test what you've learned about the RTFC framework!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left space-y-3">
              <h4 className="font-semibold text-blue-900">How it works:</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">1.</span>
                  <span>You'll see a prompt with part of it <span className="font-bold bg-yellow-200 text-gray-900 rounded px-1">highlighted in yellow</span>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">2.</span>
                  <span>Pick which RTFC part the highlighted section represents: <strong>Role</strong>, <strong>Task</strong>, <strong>Format</strong>, or <strong>Context</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">3.</span>
                  <span>There are <strong>{totalQuestions} questions</strong> total. You need at least <strong>{PASSING_SCORE}%</strong> (that's {Math.ceil(totalQuestions * PASSING_SCORE / 100)} out of {totalQuestions}) to pass.</span>
                </li>
              </ul>
            </div>

            <Button onClick={() => setShowIntro(false)} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Quiz <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <Card>
        <CardContent className="p-8">
          {devModeBar}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${passed ? 'bg-green-100' : 'bg-amber-100'}`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <RotateCcw className="w-10 h-10 text-amber-600" />
              )}
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-gray-900">{percentage}%</h3>
              <p className="text-gray-600">{score} out of {totalQuestions} correct</p>
            </div>

            <div className={`rounded-xl p-4 ${passed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`font-medium ${passed ? 'text-green-800' : 'text-amber-800'}`}>
                {passed
                  ? 'You\'ve got the RTFC framework down! You can identify each part of a well-crafted prompt.'
                  : `You need ${PASSING_SCORE}% to pass. Review the framework and try again — you've got this!`
                }
              </p>
            </div>

            {passed ? (
              <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button onClick={handleRetry} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Quiz screen
  return (
    <Card>
      {devModeBar && <div className="px-6 pt-4">{devModeBar}</div>}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          RTFC Quiz: Name That Part
        </CardTitle>
        <p className="text-gray-500 text-sm">Which part of the RTFC framework is this? You need 70% to pass.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-500">{currentQuestion + 1}/{totalQuestions}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-5"
          >
            {/* The prompt snippet */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
              <p className="text-gray-800 text-base leading-relaxed">
                {question.prompt.split(question.highlighted).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="font-bold bg-yellow-200 text-gray-900 rounded px-1">{question.highlighted}</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* RTFC answer buttons */}
            <div className="grid grid-cols-2 gap-3">
              {RTFC_OPTIONS.map((option) => {
                const isSelected = selectedAnswer === option.letter;
                const isCorrect = option.letter === question.correctAnswer;
                return (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswer(option.letter)}
                    disabled={showFeedback}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all text-left ${
                      showFeedback && isCorrect
                        ? 'bg-green-100 border-green-500'
                        : showFeedback && isSelected && !isCorrect
                        ? 'bg-red-50 border-red-400'
                        : showFeedback
                        ? 'bg-gray-50 border-gray-200 opacity-50'
                        : 'bg-white border-gray-200 hover:border-gray-400 cursor-pointer'
                    }`}
                  >
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-extrabold text-lg shrink-0"
                      style={
                        showFeedback && isCorrect
                          ? { backgroundColor: option.color, color: '#fff' }
                          : showFeedback && isSelected && !isCorrect
                          ? { backgroundColor: '#fca5a5', color: '#991b1b' }
                          : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                      }
                    >
                      {option.letter}
                    </span>
                    <div>
                      <p className={`font-bold text-sm ${showFeedback && isCorrect ? 'text-green-800' : 'text-gray-900'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                    {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto shrink-0" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                <p className={`text-sm font-medium ${
                  selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {selectedAnswer === question.correctAnswer ? 'Correct! ' : 'Not quite. '}
                  {question.explanation}
                </p>
              </motion.div>
            )}

            {/* Next button */}
            {showFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={handleNext} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See My Score'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Running score */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i >= answered ? 'bg-gray-200' : i < score + (answered - score) && i >= answered - (answered - score) ? 'bg-red-300' : 'bg-green-500'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RTFOutputBuilder;
