import React, { useState } from 'react';
import { Brain, ArrowRight, CheckCircle, X } from 'lucide-react';

interface IntroLLMsModuleProps {
  onComplete: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: '1',
    question: 'What does "LLM" stand for?',
    options: [
      'Large Learning Machine',
      'Large Language Model',
      'Linear Logic Model',
      'Long Learning Memory'
    ],
    correctAnswer: 1,
    explanation: 'LLM stands for Large Language Model - computer programs trained on lots of text to recognize patterns in language. Remember, they don\'t actually "understand" like humans do!'
  },
  {
    id: '2',
    question: 'How do LLMs process text?',
    options: [
      'By memorizing every sentence they\'ve seen',
      'By breaking text into tokens and finding patterns',
      'By using a built-in dictionary',
      'By copying directly from the internet'
    ],
    correctAnswer: 1,
    explanation: 'LLMs break text into smaller pieces called tokens and look for patterns. They don\'t actually "think" about meaning like you do - they use mathematical patterns to predict what words might come next!'
  },
  {
    id: '3',
    question: 'What is a "token" in AI language processing?',
    options: [
      'A password for the AI system',
      'A reward given for good answers',
      'A piece of text like a word or part of a word',
      'A type of computer chip'
    ],
    correctAnswer: 2,
    explanation: 'A token is like a building block of text! It could be a whole word like "cat" or part of a word like "ing" in "running". LLMs use tokens to process and understand text patterns.'
  },
  {
    id: '4',
    question: 'When an LLM generates text, what is it really doing?',
    options: [
      'Thinking about the meaning like humans do',
      'Predicting what words are most likely to come next',
      'Searching the internet for answers',
      'Using a secret code to decode messages'
    ],
    correctAnswer: 1,
    explanation: 'LLMs are like super-advanced autocomplete! They predict what word is most likely to come next based on patterns they learned during training. They\'re not actually "thinking" - just making very good predictions!'
  },
  {
    id: '5',
    question: 'Why do we call them "Large" Language Models?',
    options: [
      'Because they take up a lot of physical space',
      'Because they cost a lot of money to use',
      'Because they were trained on huge amounts of text',
      'Because they can only understand long sentences'
    ],
    correctAnswer: 2,
    explanation: 'They\'re called "Large" because they were trained on enormous amounts of text from books, websites, and articles - more text than any human could read in a lifetime! This massive training helps them recognize complex patterns in language.'
  }
];

export default function IntroLLMsModule({ onComplete }: IntroLLMsModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    return Object.entries(answers).filter(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      return question && answer === question.correctAnswer;
    }).length;
  };

  const renderIntro = () => (
    <div className="min-h-screen bg-module p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Introduction to Large Language Models</h1>
          <p className="text-xl text-muted mb-6">
            Discover what LLMs really are and how they work!
          </p>
          <div className="bg-yellow-soft rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">🤖 What You'll Learn</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>• What "LLM" actually means</div>
              <div>• How AI processes language</div>
              <div>• What tokens are and why they matter</div>
              <div>• How AI "predicts" rather than "thinks"</div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setCurrentStep(0)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105"
          >
            <Brain className="w-6 h-6 mr-3 inline" />
            Start Learning About LLMs
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestion = () => {
    const question = questions[currentStep];
    const selectedAnswer = answers[question.id];
    const hasAnswered = selectedAnswer !== undefined;

    return (
      <div className="min-h-screen bg-module p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted text-sm">Question {currentStep + 1} of {questions.length}</span>
              <span className="text-muted text-sm">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-primary">
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showCorrect = hasAnswered && isCorrect;
                const showIncorrect = hasAnswered && isSelected && !isCorrect;
                
                return (
                  <button
                    key={index}
                    onClick={() => !hasAnswered && handleAnswer(question.id, index)}
                    disabled={hasAnswered}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      hasAnswered
                        ? showCorrect
                          ? 'bg-green-soft border-2 border-green-500'
                          : showIncorrect
                          ? 'bg-red-soft border-2 border-red-500'
                          : 'bg-card border border-primary text-muted'
                        : isSelected
                        ? 'bg-blue-soft border-2 border-blue-500'
                        : 'bg-card border border-primary hover:bg-card-hover'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-4 font-bold text-lg">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                      {hasAnswered && showCorrect && (
                        <CheckCircle className="ml-auto w-6 h-6 text-green-400" />
                      )}
                      {hasAnswered && showIncorrect && (
                        <X className="ml-auto w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="bg-blue-soft rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-3">💡 Explanation</h3>
                <p className="text-secondary">{question.explanation}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </>
                ) : (
                  <>
                    See Results
                    <CheckCircle className="w-5 h-5 ml-2 inline" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-module p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">LLM Knowledge Complete!</h2>
            <p className="text-secondary">You've learned the fundamentals of Large Language Models</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2">{score}/{questions.length}</div>
              <div className="text-muted text-lg">Questions Correct ({percentage}%)</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-soft rounded-xl p-6 text-center">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="text-lg font-semibold mb-2">Understanding Level</div>
                <div className="text-secondary">
                  {percentage >= 80 ? 'Expert' : percentage >= 60 ? 'Good' : 'Learning'}
                </div>
              </div>
              
              <div className="bg-purple-soft rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <div className="text-lg font-semibold mb-2">Key Concepts</div>
                <div>Mastered</div>
              </div>
            </div>

            <div className="bg-green-soft rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">🎉 What You Now Know</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>✅ LLMs are Large Language Models trained on massive text</div>
                <div>✅ They break text into tokens to process information</div>
                <div>✅ They predict likely next words, not "think" like humans</div>
                <div>✅ Pattern recognition drives their text generation</div>
                <div>✅ Training data size makes them "large" and powerful</div>
                <div>✅ They're sophisticated prediction systems, not minds</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg"
            >
              <CheckCircle className="w-6 h-6 mr-3 inline" />
              Complete LLM Introduction
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === -1) {
    return renderIntro();
  } else if (showResults) {
    return renderResults();
  } else {
    return renderQuestion();
  }
}