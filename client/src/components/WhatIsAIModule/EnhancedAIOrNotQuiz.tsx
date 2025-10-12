import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowRight, Lightbulb, RotateCcw, Brain } from 'lucide-react';
import ActivityIntroSlides, { type Slide } from '@/components/ActivityIntroSlides';
import './WhatIsAIModule.css';

interface EnhancedAIOrNotQuizProps {
  onComplete: () => void;
}

interface QuizQuestion {
  id: string;
  scenario: string;
  isAI: boolean;
  explanation: string;
  teachingPoint: string;
  category: string;
}

export default function EnhancedAIOrNotQuiz({ onComplete }: EnhancedAIOrNotQuizProps) {
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Define the intro slide
  const introSlides: Slide[] = [
    {
      title: "Try It Out: Spot the AI",
      subtitle: "Explore how AI shows up in everyday technology",
      icon: Brain,
      content: (
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            You've seen some examples. Now let's see if you can identify which technologies use AI
            and which just follow programmed rules. This is just a fun way to explore!
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">AI = Learning</h3>
              <p className="text-sm text-purple-800 dark:text-gray-300">
                Learns from data, finds patterns, adapts over time
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Traditional = Fixed Rules</h3>
              <p className="text-sm text-blue-800 dark:text-gray-300">
                Follows exact instructions, same input = same output
              </p>
            </div>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>12 scenarios to explore</strong> - Each one teaches you something new about AI!
            </p>
          </div>
        </div>
      )
    }
  ];

  const questions: QuizQuestion[] = [
    {
      id: '1',
      scenario: 'TikTok\'s For You page showing videos you\'ll probably like',
      isAI: true,
      explanation: 'This IS AI! It analyzes what you watch, like, and skip to predict what you\'ll enjoy next based on patterns.',
      teachingPoint: 'AI learns from your behavior patterns to make personalized predictions',
      category: 'Social Media'
    },
    {
      id: '2',
      scenario: 'Calculator performing math operations like 2 + 2 = 4',
      isAI: false,
      explanation: 'This is NOT AI - it follows programmed rules. No learning or pattern recognition involved, just predetermined mathematical operations.',
      teachingPoint: 'Not all computer programs are AI - some just follow exact instructions',
      category: 'Computing'
    },
    {
      id: '3',
      scenario: 'Netflix recommending shows based on your viewing history',
      isAI: true,
      explanation: 'This IS AI! It analyzes patterns in what you and similar users watch to predict what you might enjoy.',
      teachingPoint: 'AI can find patterns across millions of users to personalize experiences',
      category: 'Entertainment'
    },
    {
      id: '4',
      scenario: 'Snapchat filters that track your face in real-time',
      isAI: true,
      explanation: 'This IS AI! It recognizes facial features and movements to apply filters that move with you in real-time.',
      teachingPoint: 'AI can identify and track objects (like faces) in visual data',
      category: 'Social Media'
    },
    {
      id: '5',
      scenario: 'Your phone\'s alarm going off at 7 AM every day',
      isAI: false,
      explanation: 'This is NOT AI - it\'s just following a timer you set. No intelligence or learning needed.',
      teachingPoint: 'Scheduled tasks are automation, not AI',
      category: 'Technology'
    },
    {
      id: '6',
      scenario: 'Google Maps predicting how long your drive will take',
      isAI: true,
      explanation: 'This IS AI! It analyzes current traffic, typical patterns, and road conditions to predict travel time accurately.',
      teachingPoint: 'AI combines multiple data sources to make real-time predictions',
      category: 'Transportation'
    },
    {
      id: '7',
      scenario: 'Spotify creating your Discover Weekly playlist',
      isAI: true,
      explanation: 'This IS AI! It learns from your listening history and finds patterns to recommend new songs you\'ll probably like.',
      teachingPoint: 'AI discovers patterns in your preferences to make suggestions',
      category: 'Entertainment'
    },
    {
      id: '8',
      scenario: 'Digital clock displaying the current time',
      isAI: false,
      explanation: 'This is NOT AI - it\'s simply counting seconds and displaying time according to pre-programmed rules.',
      teachingPoint: 'Automated doesn\'t mean artificial intelligence',
      category: 'Technology'
    },
    {
      id: '9',
      scenario: 'Spam email filter deciding which messages go to junk folder',
      isAI: true,
      explanation: 'This IS AI! It learns from examples of spam and legitimate emails to recognize patterns and make decisions about new messages.',
      teachingPoint: 'AI can be trained to make classification decisions',
      category: 'Communication'
    },
    {
      id: '10',
      scenario: 'Traffic light changing from red to green on a timer',
      isAI: false,
      explanation: 'This is NOT AI - it follows a predetermined schedule or simple sensors, with no learning involved.',
      teachingPoint: 'Sensors and timers are not AI unless they adapt and learn',
      category: 'Transportation'
    },
    {
      id: '11',
      scenario: 'Smartphone autocorrect fixing "teh" to "the" while you type',
      isAI: true,
      explanation: 'This IS AI! It learns common typing mistakes and patterns in how people write to predict what word you meant.',
      teachingPoint: 'AI learns from patterns in data to make predictions',
      category: 'Communication'
    },
    {
      id: '12',
      scenario: 'Video game character following scripted dialogue trees',
      isAI: false,
      explanation: 'This is NOT AI - it\'s following predetermined responses. No learning or adaptation based on player behavior.',
      teachingPoint: 'Pre-programmed responses are not AI, even if they seem intelligent',
      category: 'Gaming'
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    const isCorrect = answer === currentQ.isAI;
    setAnswers({ ...answers, [currentQ.id]: answer });
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setCompleted(true);

      // Auto-complete after showing results
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const isAnswerCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question && answers[questionId] === question.isAI;
  };

  // Show intro slides if not completed yet
  if (showIntroSlides) {
    return (
      <div className="max-w-4xl mx-auto">
        <ActivityIntroSlides
          slides={introSlides}
          onComplete={() => setShowIntroSlides(false)}
          activityName="AI or Not Quiz"
          allowSkip={true}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              AI or Not? Challenge
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary">
                Score: {score}/{questions.length}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Explore everyday technology and learn to identify AI. Each scenario includes teaching points to build your understanding.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!completed ? (
            <>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{currentQ.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">
                    Is this artificial intelligence?
                  </h3>
                  <p className="text-lg text-center py-4 px-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed">
                    {currentQ.scenario}
                  </p>
                </div>

                {!showExplanation && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAnswer(true)}
                      size="lg"
                      variant="outline"
                      className="h-16 text-lg border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      ✓ Yes, this is AI
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      size="lg"
                      variant="outline"
                      className="h-16 text-lg border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      ✗ No, this is not AI
                    </Button>
                  </div>
                )}

                {showExplanation && (
                  <div className="space-y-4">
                    <Alert className={isAnswerCorrect(currentQ.id) ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:bg-red-950'}>
                      <div className="flex items-center gap-2">
                        {isAnswerCorrect(currentQ.id) ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-800 dark:text-green-200">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-red-800 dark:text-red-200">Not quite!</span>
                          </>
                        )}
                      </div>
                      <AlertDescription className="mt-2">
                        {currentQ.explanation}
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-100 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900 dark:text-blue-200">
                          Teaching Point:
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {currentQ.teachingPoint}
                      </p>
                    </div>

                    <Button onClick={nextQuestion} className="w-full" size="lg">
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          Next Question <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Complete Quiz <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-8 rounded-lg border-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950 border-green-300">
                <h3 className="text-2xl font-bold mb-4">
                  Activity Complete! 🎉
                </h3>
                <div className="text-6xl font-bold mb-2 text-blue-600">
                  {score}/{questions.length}
                </div>
                <div className="text-lg font-semibold mb-2">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {score === questions.length
                    ? "Perfect! You have an excellent understanding of what AI is and isn't."
                    : score >= questions.length * 0.8
                    ? "Great job! You're getting the hang of identifying AI."
                    : "Nice work exploring! The teaching points will help build your understanding."}
                </p>
              </div>

              <div className="bg-blue-100 dark:bg-blue-950 p-6 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                  Key Takeaway
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  AI systems learn from data and can adapt their behavior, while traditional
                  computer programs follow predetermined rules. The key difference is learning
                  and pattern recognition from examples.
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Moving to the next activity in 3 seconds...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}