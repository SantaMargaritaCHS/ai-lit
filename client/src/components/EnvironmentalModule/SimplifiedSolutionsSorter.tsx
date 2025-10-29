import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

interface SimplifiedSolutionsSorterProps {
  onComplete: () => void;
}

interface Statement {
  id: number;
  text: string;
  correctCategory: 'problem' | 'solution';
  explanation: string;
}

const STATEMENTS: Statement[] = [
  {
    id: 1,
    text: 'AI data centers use massive amounts of clean drinking water',
    correctCategory: 'problem',
    explanation: 'This is a problem - data centers can use up to 25% of a small town\'s water supply.',
  },
  {
    id: 2,
    text: 'AI helps farmers reduce water usage by 40%',
    correctCategory: 'solution',
    explanation: 'This is a solution - AI can analyze soil moisture and weather patterns to optimize irrigation.',
  },
  {
    id: 3,
    text: 'Generating AI videos uses exponentially more energy than text',
    correctCategory: 'problem',
    explanation: 'This is a problem - video generation can use 100x more computational resources than text.',
  },
  {
    id: 4,
    text: 'AI can detect city-wide water leaks and save millions of gallons',
    correctCategory: 'solution',
    explanation: 'This is a solution - AI pattern recognition can identify leaks in water infrastructure early.',
  },
  {
    id: 5,
    text: 'Tech companies are building data centers powered by renewable energy',
    correctCategory: 'solution',
    explanation: 'This is a solution - Google, Microsoft, and Amazon are investing billions in solar, wind, and nuclear power.',
  },
  {
    id: 6,
    text: 'Training large AI models generates as much carbon as 120 homes annually',
    correctCategory: 'problem',
    explanation: 'This is a problem - GPT-3 training produced significant carbon emissions equivalent to 120 homes\' yearly usage.',
  },
  {
    id: 7,
    text: 'Advanced cooling systems reduce data center water use by 50%',
    correctCategory: 'solution',
    explanation: 'This is a solution - New liquid cooling and AI-optimized designs are cutting water consumption.',
  },
  {
    id: 8,
    text: 'Most AI users don\'t know about the environmental costs',
    correctCategory: 'problem',
    explanation: 'This is a problem - lack of awareness prevents people from making informed choices about AI usage.',
  },
];

export default function SimplifiedSolutionsSorter({ onComplete }: SimplifiedSolutionsSorterProps) {
  const [categorized, setCategorized] = useState<Record<number, 'problem' | 'solution'>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleCategorize = (id: number, category: 'problem' | 'solution') => {
    setCategorized(prev => ({
      ...prev,
      [id]: category,
    }));
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setShowExplanations(true);
  };

  const handleReset = () => {
    setCategorized({});
    setHasSubmitted(false);
    setShowExplanations(false);
  };

  const allCategorized = STATEMENTS.every(s => categorized[s.id]);
  const correctCount = STATEMENTS.filter(s => categorized[s.id] === s.correctCategory).length;
  const allCorrect = correctCount === STATEMENTS.length;

  const getStatementColor = (statement: Statement) => {
    if (!hasSubmitted) {
      return categorized[statement.id] === 'problem'
        ? 'border-red-300 bg-red-50'
        : categorized[statement.id] === 'solution'
        ? 'border-green-300 bg-green-50'
        : 'border-gray-300 bg-white';
    }

    const isCorrect = categorized[statement.id] === statement.correctCategory;
    return isCorrect
      ? 'border-green-500 bg-green-100'
      : 'border-yellow-500 bg-yellow-100';
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          AI Solutions Sorting: Problem or Solution?
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Read each statement and categorize it as either a Problem or a Solution related to AI's environmental impact
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        {!hasSubmitted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>How to play:</strong> Click on each statement, then click the "Problem" or "Solution" button to categorize it.
              When you've categorized all statements, click "Check My Answers".
            </p>
          </div>
        )}

        {/* Statements List */}
        <div className="space-y-3">
          {STATEMENTS.map((statement, index) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-lg p-4 transition-all ${getStatementColor(statement)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-900 flex-1">{statement.text}</p>

                {!hasSubmitted && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCategorize(statement.id, 'problem')}
                      className={`px-3 py-1 text-sm rounded-md border transition-all ${
                        categorized[statement.id] === 'problem'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      Problem
                    </button>
                    <button
                      onClick={() => handleCategorize(statement.id, 'solution')}
                      className={`px-3 py-1 text-sm rounded-md border transition-all ${
                        categorized[statement.id] === 'solution'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Solution
                    </button>
                  </div>
                )}

                {hasSubmitted && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {categorized[statement.id] === statement.correctCategory ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                )}
              </div>

              {/* Explanation (shown after submission) */}
              {showExplanations && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-300"
                  >
                    <p className="text-sm text-gray-700">
                      <strong>Explanation:</strong> {statement.explanation}
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit / Results */}
        {!hasSubmitted && allCategorized && (
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Check My Answers
          </Button>
        )}

        {hasSubmitted && (
          <div className="space-y-4">
            {/* Results Card */}
            <div
              className={`rounded-lg p-6 border-2 ${
                allCorrect
                  ? 'bg-green-50 border-green-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {allCorrect ? (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {allCorrect
                      ? '🎉 Perfect Score!'
                      : `You got ${correctCount} out of ${STATEMENTS.length} correct`}
                  </h3>
                  <p className="text-gray-700">
                    {allCorrect
                      ? 'Excellent! You understand both the challenges and solutions around AI\'s environmental impact.'
                      : 'Review the explanations above to see which categories were correct. Understanding both problems and solutions is key to responsible AI use.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">The Big Picture:</h3>
              <p className="text-gray-700 leading-relaxed">
                AI creates real environmental challenges, <strong>but</strong> AI is also being used to solve
                environmental problems. The key is being aware of the costs and making intentional choices about
                when and how we use AI. Technology isn't inherently good or bad - it's how we use it that matters.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!allCorrect && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              <Button
                onClick={onComplete}
                className={`${allCorrect ? 'w-full' : 'flex-1'} bg-green-600 hover:bg-green-700 text-white`}
              >
                Continue Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!allCategorized && !hasSubmitted && (
          <div className="text-center text-sm text-gray-600">
            {STATEMENTS.length - Object.keys(categorized).length} statements remaining
          </div>
        )}
      </CardContent>
    </Card>
  );
}
