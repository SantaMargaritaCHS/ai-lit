import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface TeachingComputerActivityProps {
  onComplete: () => void;
}

export default function TeachingComputerActivity({ onComplete }: TeachingComputerActivityProps) {
  const [instructions, setInstructions] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: 'Understanding Algorithms',
      description: 'Computers follow exact instructions. Let\'s practice writing precise steps!'
    },
    {
      title: 'Writing Instructions',
      description: 'Write step-by-step instructions to sort playing cards by color (red/black)'
    },
    {
      title: 'Computer Simulation',
      description: 'See how a computer would follow your instructions'
    }
  ];

  const instructionLines = instructions.split('\n').filter(line => line.trim());

  const simulateComputer = () => {
    const responses = [
      'Processing instruction...',
      'Checking for clarity...',
      'Following steps exactly as written...',
      'Looking for any ambiguity...',
      'Complete! But did I understand correctly?'
    ];
    return responses;
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Teaching a Computer: Algorithm Role-Play
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Understanding Algorithms Through Play</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  An algorithm is simply a set of step-by-step instructions to solve a problem. 
                  Computers follow these instructions exactly - they can't improvise or guess what you meant!
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">Good Algorithm Example:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Pick up the top card from the deck</li>
                      <li>Look at the color (red or black)</li>
                      <li>If red, place in the left pile</li>
                      <li>If black, place in the right pile</li>
                      <li>Repeat until no cards remain</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-red-600 mb-2">Unclear Instructions:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Sort the cards</li>
                      <li>Put similar ones together</li>
                      <li>Make neat piles</li>
                    </ol>
                    <p className="text-xs text-red-500 mt-2">Too vague! A computer wouldn't know what to do.</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Try Writing Your Own Algorithm <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Your Challenge</h3>
                <p className="text-sm">
                  Write exact step-by-step instructions to sort a deck of playing cards by color 
                  (red cards in one pile, black cards in another). Remember: be very specific!
                </p>
              </div>
              
              <Textarea
                placeholder="1. Pick up the first card&#10;2. Look at the color&#10;3. If red, place in left pile&#10;4. ..."
                className="min-h-[200px]"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={instructionLines.length < 3}
                className="w-full"
              >
                Test My Algorithm <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Your Instructions:</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                    {instructionLines.length > 0 ? (
                      <ol className="space-y-2 list-decimal list-inside">
                        {instructionLines.map((instruction, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500 italic">No instructions provided</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Computer's Response:</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                    {simulateComputer().map((response, idx) => (
                      <div key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                        → {response}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Insight:</strong> Computers follow instructions literally! 
                  This is an algorithm - a precise set of steps to solve a problem. 
                  AI uses much more complex algorithms that can learn and adapt from data.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Connection to AI</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Traditional algorithms (like your card sorting) follow fixed rules. 
                  AI algorithms can learn new patterns from examples and improve their performance over time. 
                  Instead of us writing every rule, AI writes its own rules based on data!
                </p>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                {completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activity Complete!
                  </>
                ) : (
                  <>
                    Continue to Next Section <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}