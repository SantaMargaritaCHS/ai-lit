import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from 'lucide-react';

interface SimpleGuessAgeProps {
  onComplete: () => void;
}

export const SimpleGuessAge: React.FC<SimpleGuessAgeProps> = ({ onComplete }) => {
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const options = [
    { 
      year: 1950, 
      label: "1950s - Post WWII Era",
      feedback: "Correct! AI research began in the 1950s. Alan Turing proposed the Turing Test in 1950, and the term 'Artificial Intelligence' was coined at the Dartmouth Conference in 1956.",
      isCorrect: true
    },
    { 
      year: 1980, 
      label: "1980s - Personal Computer Age",
      feedback: "Good guess! While the 1980s saw important AI developments, AI research actually began in the 1950s with Alan Turing's work."
    },
    { 
      year: 2000, 
      label: "2000s - Internet Boom",
      feedback: "The 2000s brought major AI breakthroughs, but AI research has been around much longer - it started in the 1950s!"
    },
    { 
      year: 2010, 
      label: "2010s - Smartphone Revolution",
      feedback: "Recent years have seen amazing AI progress, but the field began over 70 years ago in the 1950s!"
    }
  ];

  const handleGuess = (year: number) => {
    setSelectedGuess(year);
    setShowFeedback(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center">When Did AI Research Begin?</CardTitle>
          <CardDescription className="text-center">
            Test your knowledge about the origins of artificial intelligence research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <Button
                key={option.year}
                variant={selectedGuess === option.year ? "default" : "outline"}
                onClick={() => handleGuess(option.year)}
                disabled={showFeedback}
                className="h-auto py-4 px-6"
              >
                <div className="text-center">
                  <p className="font-bold text-lg">{option.label}</p>
                  <p className="text-sm opacity-80">{option.year}s</p>
                </div>
              </Button>
            ))}
          </div>
          
          {showFeedback && selectedGuess && (
            <div className="mt-6 space-y-4">
              <Alert className={
                options.find(o => o.year === selectedGuess)?.isCorrect 
                  ? "border-green-500" 
                  : "border-orange-500"
              }>
                <AlertDescription>
                  {options.find(o => o.year === selectedGuess)?.feedback}
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={onComplete}
                className="w-full"
              >
                Continue to AI History Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};