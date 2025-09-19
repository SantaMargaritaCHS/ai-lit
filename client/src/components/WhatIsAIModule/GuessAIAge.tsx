import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Brain, Clock, Lightbulb } from 'lucide-react';

interface GuessAIAgeProps {
  onComplete: () => void;
}

const aiMilestones = [
  { year: 1950, event: "Turing Test proposed", icon: Brain },
  { year: 1956, event: "AI term coined at Dartmouth", icon: Lightbulb },
  { year: 1997, event: "Deep Blue beats chess champion", icon: Brain },
  { year: 2011, event: "Watson wins Jeopardy!", icon: Lightbulb },
  { year: 2016, event: "AlphaGo beats Go champion", icon: Brain },
  { year: 2022, event: "ChatGPT launches", icon: Lightbulb }
];

export const GuessAIAge: React.FC<GuessAIAgeProps> = ({ onComplete }) => {
  const [guess, setGuess] = useState([30]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  
  const actualAge = new Date().getFullYear() - 1950; // AI started ~1950
  const guessValue = guess[0];
  const difference = Math.abs(guessValue - actualAge);
  
  const getFeedback = () => {
    if (difference <= 5) return "Excellent! You really know your AI history!";
    if (difference <= 10) return "Pretty good! You're getting close!";
    if (difference <= 20) return "Not bad! AI has been around longer than many think.";
    return "AI has actually been around much longer! Let's explore its timeline.";
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleNextMilestone = () => {
    if (currentMilestone < aiMilestones.length - 1) {
      setCurrentMilestone(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (showAnswer) {
    const milestone = aiMilestones[currentMilestone];
    const Icon = milestone.icon;
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI Timeline Explorer
          </h2>
          <p className="text-gray-600">
            Milestone {currentMilestone + 1} of {aiMilestones.length}
          </p>
        </motion.div>

        <motion.div
          key={currentMilestone}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center">
              <Icon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                {milestone.year}
              </h3>
              <p className="text-lg text-blue-700 mb-4">
                {milestone.event}
              </p>
              {currentMilestone === 0 && (
                <div className="bg-blue-100 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Your guess:</strong> {guessValue} years old<br />
                    <strong>Actual age:</strong> {actualAge} years old<br />
                    <strong>Feedback:</strong> {getFeedback()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="text-center">
          <Button
            onClick={handleNextMilestone}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            {currentMilestone < aiMilestones.length - 1 ? 'Next Milestone →' : 'Continue Learning →'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Guess AI's Age!
        </h2>
        <p className="text-gray-600">
          How old do you think artificial intelligence is?
        </p>
      </motion.div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">Your Guess</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {guessValue} years old
            </div>
            <p className="text-gray-500 text-sm">
              Use the slider below to make your guess
            </p>
          </div>
          
          <div className="px-4">
            <Slider
              value={guess}
              onValueChange={setGuess}
              max={100}
              min={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>5 years</span>
              <span>50 years</span>
              <span>100 years</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Think about:</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• When did computers first become popular?</li>
              <li>• How long have movies shown robots and AI?</li>
              <li>• When do you think scientists first tried to make machines "think"?</li>
            </ul>
          </div>

          <Button
            onClick={handleReveal}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            Reveal the Answer!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};