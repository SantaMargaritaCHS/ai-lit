// Create: /client/src/components/UnderstandingLLMModule/activities/ReflectionQuiz.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function ReflectionQuiz({ onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      question: "What are Large Language Models actually doing when they generate text?",
      options: [
        "Understanding the meaning of words like humans do",
        "Predicting the most likely next word based on patterns",
        "Searching the internet for answers",
        "Thinking about what to say"
      ],
      correct: 1,
      explanation: "LLMs predict the next word based on patterns they learned during training. They don't actually 'understand' or 'think'—they're sophisticated pattern-matching systems."
    },
    {
      question: "Why do LLMs sometimes give different confidence levels for predictions?",
      options: [
        "They get tired and less confident",
        "Some patterns appear more frequently in training data",
        "They randomly assign percentages",
        "They check the internet for accuracy"
      ],
      correct: 1,
      explanation: "Higher confidence means the AI saw that exact pattern many times in training data. Lower confidence indicates multiple valid options or less common patterns."
    },
    {
      question: "What happens during tokenization?",
      options: [
        "The AI understands each word's meaning",
        "Text is broken into processable pieces like words or parts of words",
        "The AI translates text into another language",
        "Words are checked for spelling errors"
      ],
      correct: 1,
      explanation: "Tokenization breaks text into smaller pieces (tokens) that the AI can process. These might be whole words, parts of words, or even single characters."
    },
    {
      question: "How much text data was GPT-4 trained on?",
      options: [
        "About as much as a library",
        "Millions of books worth",
        "More than a human could read in 200,000 lifetimes",
        "Just Wikipedia articles"
      ],
      correct: 2,
      explanation: "GPT-4 was trained on approximately 13 trillion tokens—more text than any human could read in hundreds of thousands of lifetimes!"
    },
    {
      question: "What should students understand about neural networks in LLMs?",
      options: [
        "They work exactly like human brains",
        "They're mathematical functions finding patterns, not thinking",
        "They can truly understand emotions",
        "They need rest between conversations"
      ],
      correct: 1,
      explanation: "Neural networks are layers of mathematical functions that find patterns. Despite the name, they don't work like biological brains or have understanding."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Developer Mode: Auto-complete functionality
  useEffect(() => {
    const handleDevAutoComplete = (event: any) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-completing reflection quiz');
        
        // Auto-complete quiz by selecting all correct answers
        const autoCompleteQuiz = () => {
          if (currentQuestion < questions.length - 1) {
            // Select correct answer and move to next question
            handleAnswer(questions[currentQuestion].correct);
            setTimeout(() => {
              nextQuestion();
            }, 500);
          } else {
            // Complete the quiz
            handleAnswer(questions[currentQuestion].correct);
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        };
        
        autoCompleteQuiz();
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, [currentQuestion, questions, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Knowledge Check</h2>
            <span className="text-white">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl text-white mb-6">{questions[currentQuestion].question}</h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showFeedback && handleAnswer(index)}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  showFeedback
                    ? index === questions[currentQuestion].correct
                      ? 'bg-green-600/30 border-2 border-green-400'
                      : index === selectedAnswer
                      ? 'bg-red-600/30 border-2 border-red-400'
                      : 'bg-gray-700/50 opacity-50'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{option}</span>
                  {showFeedback && (
                    <>
                      {index === questions[currentQuestion].correct && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {index === selectedAnswer && index !== questions[currentQuestion].correct && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className={`rounded-lg p-4 ${
              selectedAnswer === questions[currentQuestion].correct
                ? 'bg-green-900/30 border border-green-400'
                : 'bg-blue-900/30 border border-blue-400'
            }`}>
              <p className="text-white mb-2">
                {selectedAnswer === questions[currentQuestion].correct
                  ? '✅ Correct!'
                  : '💡 Not quite right, but that\'s okay!'}
              </p>
              <p className="text-white">{questions[currentQuestion].explanation}</p>
            </div>
          </motion.div>
        )}

        <button
          onClick={nextQuestion}
          disabled={!showFeedback}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            showFeedback
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-white/70 cursor-not-allowed'
          }`}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
        </button>

        {currentQuestion === questions.length - 1 && showFeedback && (
          <div className="mt-4 text-center">
            <p className="text-white">
              Your score: {score} out of {questions.length}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}