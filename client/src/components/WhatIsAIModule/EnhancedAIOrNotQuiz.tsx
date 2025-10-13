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
      title: "Explore AI in Everyday Tech",
      subtitle: "A fun icebreaker to discover AI around you",
      icon: Brain,
      content: (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Before we dive deep into AI, let's explore where it shows up in your daily life!
            You'll look at 12 different technologies and discover which ones use AI and which don't.
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
              <strong>12 everyday scenarios</strong> - Each one reveals something interesting about how AI works!
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
      explanation: 'This IS AI! The system analyzes common typing mistakes and patterns in text data to predict the intended word.',
      teachingPoint: 'AI analyzes patterns in data to make predictions',
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
              Explore: AI or Not?
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Scenario {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <p className="text-base text-secondary mt-2">
            Explore everyday technology and discover which apps use AI. Each scenario teaches you something new!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!completed ? (
            <>
              <div className="space-y-4">
                <div className="bg-card border border-primary p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{currentQ.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">
                    Is this artificial intelligence?
                  </h3>
                  <p className="text-lg text-center py-4 px-6 bg-module rounded-lg border-2 border-dashed border-accent">
                    {currentQ.scenario}
                  </p>
                </div>

                {!showExplanation && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAnswer(true)}
                      size="lg"
                      variant="outline"
                      className="h-16 text-lg border-2 border-accent hover:bg-primary-soft transition-colors"
                    >
                      ✓ Yes, this is AI
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      size="lg"
                      variant="outline"
                      className="h-16 text-lg border-2 border-accent hover:bg-primary-soft transition-colors"
                    >
                      ✗ No, this is not AI
                    </Button>
                  </div>
                )}

                {showExplanation && (
                  <div className="space-y-4">
                    <Alert className={isAnswerCorrect(currentQ.id) ? 'bg-green-soft border border-success' : 'bg-red-soft border border-error'}>
                      <div className="flex items-center gap-2">
                        {isAnswerCorrect(currentQ.id) ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="font-semibold text-success">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-error" />
                            <span className="font-semibold text-error">Not quite!</span>
                          </>
                        )}
                      </div>
                      <AlertDescription className="mt-2">
                        {currentQ.explanation}
                      </AlertDescription>
                    </Alert>

                    <div className="bg-primary-soft p-4 rounded-lg border-l-4 border-accent">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        <span className="font-semibold">
                          Teaching Point:
                        </span>
                      </div>
                      <p className="text-sm">
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
              <div className="p-8 rounded-lg bg-primary-soft border border-accent">
                <h3 className="text-2xl font-bold mb-4 text-accent">
                  Exploration Complete! 🎉
                </h3>
                <p className="text-lg mb-6 text-secondary">
                  You explored {questions.length} everyday technologies and discovered {score} that use AI!
                </p>
                <p className="text-base mb-4">
                  {score === questions.length
                    ? "Amazing! You spotted every AI system. You have a strong intuition for what AI is and isn't."
                    : score >= questions.length * 0.8
                    ? "Nice work! You're starting to recognize the patterns that distinguish AI from traditional software."
                    : "Great exploration! Each scenario taught you something new about how AI learns and adapts."}
                </p>
              </div>

              <div className="bg-primary-soft p-6 rounded-lg border-l-4 border-accent">
                <h4 className="font-semibold mb-3">
                  Key Insight
                </h4>
                <p className="text-sm">
                  AI systems <strong>learn from data</strong> and can adapt their behavior, while traditional
                  computer programs follow predetermined rules. The key difference is <strong>learning
                  and pattern recognition</strong> from examples.
                </p>
              </div>

              <p className="text-sm text-muted">
                Moving to the next activity in 3 seconds...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}