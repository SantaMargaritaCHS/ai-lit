import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ExternalLink, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import { policyMythsQuestions, QuizQuestion, calculateResults } from '@/data/policyMythsQuizData';

interface PolicyMythsQuizProps {
  onComplete: () => void;
}

export const PolicyMythsQuiz: React.FC<PolicyMythsQuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...policyMythsQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const results = quizComplete ? calculateResults(answers) : null;

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center">
        <div className="text-white">Loading quiz...</div>
      </div>
    );
  }

  // Results screen
  if (quizComplete && results) {
    const scoreColor = results.percentage >= 70 ? 'text-green-400' : results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center"
      >
        <Card className="max-w-2xl w-full bg-slate-800 border-slate-600">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Quiz Complete!
            </CardTitle>
            <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
              {results.correct}/{results.total}
            </div>
            <p className="text-blue-100">
              {results.percentage >= 70
                ? "Great job! You know your privacy policies."
                : results.percentage >= 50
                ? "Not bad, but there's more to learn!"
                : "Most people are surprised by these facts!"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Most Surprising Facts */}
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/50">
              <h3 className="text-red-300 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Most Surprising Facts
              </h3>
              <ul className="space-y-2 text-gray-200 text-sm">
                {results.mostSurprising.slice(0, 3).map(q => (
                  <li key={q.id} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>
                      {q.answer ? "TRUE" : "FALSE"}: {q.statement.replace(/^"|"$/g, '')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Good News */}
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/50">
              <h3 className="text-green-300 font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Good News You Learned
              </h3>
              <ul className="space-y-2 text-gray-200 text-sm">
                {results.goodNews.map(q => (
                  <li key={q.id} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{q.explanation.split('!')[1]?.trim() || q.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Takeaway */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/50">
              <h3 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Takeaway
              </h3>
              <p className="text-gray-200 text-sm">
                The privacy policies you "agree" to have real consequences. School-provided AI tools
                like Microsoft Copilot Education protect your data by default, while consumer tools
                often use your conversations for training and advertising.
              </p>
            </div>

            <Button
              onClick={onComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
            >
              Continue to Policy Comparison
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Quiz question screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center"
    >
      <Card className="max-w-2xl w-full bg-slate-800 border-slate-600">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-300 text-sm font-medium">
              Question {currentIndex + 1} of {shuffledQuestions.length}
            </span>
            <div className="flex gap-1">
              {shuffledQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx < currentIndex
                      ? 'bg-blue-500'
                      : idx === currentIndex
                      ? 'bg-blue-400'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            True or False?
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <p className="text-white text-xl text-center leading-relaxed">
              "{currentQuestion.statement}"
            </p>
          </div>

          {/* Answer Buttons */}
          {!showResult && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-xl py-8 transition-all hover:scale-105"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                TRUE
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                className="bg-red-600 hover:bg-red-700 text-white text-xl py-8 transition-all hover:scale-105"
              >
                <X className="w-6 h-6 mr-2" />
                FALSE
              </Button>
            </div>
          )}

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Correct/Incorrect Banner */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'bg-green-900/50 border-green-500'
                      : 'bg-red-900/50 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <X className="w-8 h-8 text-red-400" />
                    )}
                    <span className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Correct!' : 'Wrong!'}
                    </span>
                  </div>
                  <p className="text-white text-lg">
                    The answer is <strong>{currentQuestion.answer ? 'TRUE' : 'FALSE'}</strong>
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p className="text-gray-200 mb-4">
                    {currentQuestion.explanation}
                  </p>

                  {/* Actual Policy Language */}
                  <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500 mb-4">
                    <p className="text-sm text-blue-200 italic">
                      "{currentQuestion.actualLanguage}"
                    </p>
                  </div>

                  {/* Source Link */}
                  <a
                    href={currentQuestion.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Source: {currentQuestion.source.title} ({currentQuestion.source.organization})
                  </a>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
                >
                  {currentIndex < shuffledQuestions.length - 1 ? (
                    <>Next Question</>
                  ) : (
                    <>See Your Results</>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PolicyMythsQuiz;
