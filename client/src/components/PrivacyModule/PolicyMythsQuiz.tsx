import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ExternalLink, AlertTriangle, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { policyMythsQuestions, QuizQuestion, calculateResults } from '@/data/policyMythsQuizData';

interface PolicyMythsQuizProps {
  onComplete: () => void;
}

export const PolicyMythsQuiz: React.FC<PolicyMythsQuizProps> = ({ onComplete }) => {
  const [showIntro, setShowIntro] = useState(true);
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

  // Intro screen
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Card className="max-w-2xl w-full mx-auto bg-white border-slate-300 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Can You Debunk These Privacy Myths?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 text-lg text-center leading-relaxed">
              You just saw how your data travels from your keyboard to places you never expected.
              Now let's see if you can separate <strong className="text-slate-900">fact from fiction</strong>.
            </p>
            <div className="bg-amber-100/60 border-2 border-amber-400 rounded-lg p-5">
              <p className="text-slate-900 text-center text-lg font-medium">
                We pulled <strong>real claims</strong> from actual privacy policies — Snapchat, ChatGPT,
                Meta AI, Microsoft Copilot, and more. Some are true. Some are completely false.
              </p>
              <p className="text-amber-800 text-center mt-3 font-semibold">
                Most people get over half of these wrong. Think you can do better?
              </p>
            </div>
            <Button
              onClick={() => setShowIntro(false)}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg py-4"
            >
              Let's Find Out
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="p-6">
        <div className="text-slate-900">Loading quiz...</div>
      </div>
    );
  }

  // Results screen
  if (quizComplete && results) {
    const scoreColor = results.percentage >= 70 ? 'text-green-600' : results.percentage >= 50 ? 'text-yellow-600' : 'text-red-600';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="max-w-2xl w-full mx-auto bg-white border-slate-300 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Quiz Complete!
            </CardTitle>
            <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
              {results.correct}/{results.total}
            </div>
            <p className="text-slate-600">
              {results.percentage >= 70
                ? "Great job! You know your privacy policies."
                : results.percentage >= 50
                ? "Not bad, but there's more to learn!"
                : "Most people are surprised by these facts!"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Most Surprising Facts */}
            <div className="bg-red-100/60 p-4 rounded-lg border-2 border-red-400">
              <h3 className="text-red-700 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Most Surprising Facts
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                {results.mostSurprising.slice(0, 3).map(q => (
                  <li key={q.id} className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">&bull;</span>
                    <span>
                      {q.answer ? "TRUE" : "FALSE"}: {q.statement.replace(/^"|"$/g, '')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Good News */}
            <div className="bg-green-100/70 p-4 rounded-lg border-2 border-green-400">
              <h3 className="text-green-700 font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Good News You Learned
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                {results.goodNews.map(q => (
                  <li key={q.id} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{q.explanation.split('!')[1]?.trim() || q.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Takeaway */}
            <div className="bg-blue-100/70 p-4 rounded-lg border-2 border-blue-400">
              <h3 className="text-blue-700 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Takeaway
              </h3>
              <p className="text-slate-700 text-sm">
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
      className="p-6"
    >
      <Card className="max-w-2xl w-full mx-auto bg-white border-slate-300 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-700 text-sm font-medium">
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
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 text-center">
            True or False?
          </CardTitle>
        </CardHeader>

        <CardContent key={currentIndex} className="space-y-6">
          {/* Question */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <p className="text-slate-900 text-xl text-center leading-relaxed">
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
                      ? 'bg-green-100/70 border-green-400'
                      : 'bg-red-100/60 border-red-400'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <X className="w-8 h-8 text-red-600" />
                    )}
                    <span className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Correct!' : 'Wrong!'}
                    </span>
                  </div>
                  <p className="text-slate-900 text-lg">
                    The answer is <strong>{currentQuestion.answer ? 'TRUE' : 'FALSE'}</strong>
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-700 mb-4">
                    {currentQuestion.explanation}
                  </p>

                  {/* Actual Policy Language */}
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500 mb-4">
                    <p className="text-sm text-blue-700 italic">
                      "{currentQuestion.actualLanguage}"
                    </p>
                  </div>

                  {/* Source Link */}
                  <a
                    href={currentQuestion.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition-colors"
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
