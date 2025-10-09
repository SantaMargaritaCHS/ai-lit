import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Brain, Eye, Zap, Lightbulb, Target } from 'lucide-react';
import { useDevMode } from '@/context/DevModeContext';

interface AIPatternSpotterActivityProps {
  onComplete: () => void;
}

interface Step {
  id: number;
  title: string;
  instruction: string;
  data: { label: string; value: string }[];
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
  concept: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Step 1: Look at the Data',
    instruction: 'First, AI needs data to learn from. Let\'s start by looking at what people watched on Netflix:',
    data: [
      { label: 'Alex', value: '🎬 Action, Action, Action' },
      { label: 'Priya', value: '😂 Comedy, Comedy, Comedy' },
      { label: 'Jordan', value: '🎬 Action, 😂 Comedy, 🎬 Action' }
    ],
    question: 'What patterns do you notice in the data?',
    options: [
      {
        text: 'Alex watches action, Priya watches comedy, Jordan watches both',
        isCorrect: true,
        explanation: 'Exactly! You just spotted the pattern—that\'s the first step in thinking like AI. Each person has a viewing preference pattern in the data.'
      },
      {
        text: 'Everyone watches the same things',
        isCorrect: false,
        explanation: 'Look closer! Each person has different preferences. Alex prefers action, Priya prefers comedy, and Jordan likes both.'
      },
      {
        text: 'There are no patterns in the data',
        isCorrect: false,
        explanation: 'Actually, there ARE patterns! Each person consistently chooses certain types of movies. That\'s what AI looks for!'
      }
    ],
    concept: '🔍 AI starts by looking at data to find patterns—just like you did!'
  },
  {
    id: 2,
    title: 'Step 2: Follow the Algorithm',
    instruction: 'Now, AI uses an algorithm (step-by-step instructions) to analyze the patterns. Here\'s a simple algorithm:',
    data: [
      { label: 'Step 1', value: 'Look at what each person watched' },
      { label: 'Step 2', value: 'Count how many of each type' },
      { label: 'Step 3', value: 'Find the most common type for each person' },
      { label: 'Step 4', value: 'Use that to predict what they\'ll like next' }
    ],
    question: 'Based on this algorithm, what type of movie should we recommend to Alex?',
    options: [
      {
        text: 'Action movies',
        isCorrect: true,
        explanation: 'Perfect! The algorithm found that Alex watched action movies 3 times, so it predicts Alex will like more action. That\'s how AI uses algorithms to make predictions!'
      },
      {
        text: 'Comedy movies',
        isCorrect: false,
        explanation: 'Looking at the data, Alex watched action movies, not comedy. The algorithm counts patterns to make predictions.'
      },
      {
        text: 'Random movies',
        isCorrect: false,
        explanation: 'AI doesn\'t guess randomly! It follows the algorithm to find patterns and make smart predictions based on the data.'
      }
    ],
    concept: '⚙️ Algorithms are the recipe AI follows to turn patterns into predictions!'
  },
  {
    id: 3,
    title: 'Step 3: Make Predictions from Patterns',
    instruction: 'Once AI finds patterns using algorithms, it can predict what will happen next. Let\'s practice:',
    data: [
      { label: 'Monday', value: '☀️ Sunny → 🏞️ Park is crowded' },
      { label: 'Tuesday', value: '☀️ Sunny → 🏞️ Park is crowded' },
      { label: 'Wednesday', value: '🌧️ Rainy → 🏞️ Park is empty' },
      { label: 'Thursday', value: '🌧️ Rainy → 🏞️ Park is empty' }
    ],
    question: 'Tomorrow will be sunny. Using the pattern, what will AI predict about the park?',
    options: [
      {
        text: 'The park will be crowded',
        isCorrect: true,
        explanation: 'Yes! AI saw the pattern: Sunny days = Crowded park. So it predicts tomorrow (sunny) will also be crowded. This is pattern recognition in action!'
      },
      {
        text: 'The park will be empty',
        isCorrect: false,
        explanation: 'Look at the pattern again. When it\'s sunny, the park is always crowded. When it\'s rainy, the park is empty. Tomorrow is sunny!'
      },
      {
        text: 'The park will be closed',
        isCorrect: false,
        explanation: 'The pattern doesn\'t show the park ever being closed. Based on the data, sunny days mean crowded parks!'
      }
    ],
    concept: '🎯 AI makes predictions by finding patterns in past data and applying them to new situations!'
  },
  {
    id: 4,
    title: 'Step 4: AI Learns and Adapts',
    instruction: 'The best part? AI keeps learning! Each time it gets new data, it can update its predictions:',
    data: [
      { label: 'Week 1', value: 'You listened to: Pop, Pop, Pop' },
      { label: 'Week 2', value: 'You listened to: Pop, Rock, Pop' },
      { label: 'Week 3', value: 'You listened to: Rock, Rock, Rock' },
      { label: 'Week 4', value: 'AI now recommends: More Rock!' }
    ],
    question: 'What shows that this is AI and not traditional technology?',
    options: [
      {
        text: 'It adapted its recommendations as your listening changed',
        isCorrect: true,
        explanation: 'Exactly! Traditional technology would keep recommending pop forever. AI notices your preferences changed (from pop to rock) and adapts. That\'s learning!'
      },
      {
        text: 'It always recommends the same thing',
        isCorrect: false,
        explanation: 'Actually, the recommendations changed! Week 1 it would suggest pop, but by Week 4 it suggests rock. That adaptation is what makes it AI!'
      },
      {
        text: 'It follows fixed rules that never change',
        isCorrect: false,
        explanation: 'Fixed rules = traditional tech. This system changed its behavior based on new data—that\'s AI learning and adapting!'
      }
    ],
    concept: '🔄 What makes AI special: It learns from new data and keeps getting better!'
  }
];

export default function AIPatternSpotterActivity({ onComplete }: AIPatternSpotterActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { isDevModeActive } = useDevMode();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleAnswer = (optionText: string) => {
    setSelectedAnswer(optionText);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const getSelectedOption = () => {
    return step.options.find(opt => opt.text === selectedAnswer);
  };

  // Dev mode auto-answer
  const handleDevAutoAnswer = () => {
    const correctOption = step.options.find(opt => opt.isCorrect);
    if (correctOption) {
      handleAnswer(correctOption.text);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">🧠 Think Like AI</h2>
        <p className="text-lg text-gray-600">
          Follow these steps to understand how AI finds patterns and makes predictions
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </div>

      {/* Dev Mode Shortcuts */}
      {isDevModeActive && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex gap-2">
            <Button
              onClick={handleDevAutoAnswer}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto-Answer Step
            </Button>
            <Button
              onClick={onComplete}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              Skip Entire Activity
            </Button>
          </div>
          <p className="text-xs text-red-600 mt-1">Developer Mode: Testing shortcuts</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-colors ${
              index < currentStep
                ? 'bg-green-500'
                : index === currentStep
                ? 'bg-purple-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step Title */}
          <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                {currentStep === 0 && <Eye className="h-6 w-6 text-purple-600" />}
                {currentStep === 1 && <Brain className="h-6 w-6 text-blue-600" />}
                {currentStep === 2 && <Target className="h-6 w-6 text-green-600" />}
                {currentStep === 3 && <Zap className="h-6 w-6 text-orange-600" />}
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-700">{step.instruction}</p>
            </CardContent>
          </Card>

          {/* Data Display */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {step.data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-purple-700 min-w-[100px]">
                        {item.label}:
                      </span>
                      <span className="text-gray-800">{item.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="border-2 border-blue-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <p className="font-semibold text-lg text-gray-900">{step.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.text;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect;

                  return (
                    <div key={index}>
                      <Button
                        onClick={() => !showFeedback && handleAnswer(option.text)}
                        disabled={showFeedback}
                        variant="outline"
                        className={`w-full text-left justify-start h-auto py-4 px-4 ${
                          showCorrect
                            ? 'border-2 border-green-500 bg-green-50'
                            : showIncorrect
                            ? 'border-2 border-orange-400 bg-orange-50'
                            : isSelected
                            ? 'border-2 border-blue-500 bg-blue-50'
                            : 'hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          {showFeedback && (
                            <div className="mt-0.5">
                              {option.isCorrect && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          )}
                          <span className="flex-1 text-base">{option.text}</span>
                        </div>
                      </Button>

                      {showFeedback && (isSelected || option.isCorrect) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`mt-2 p-4 rounded-lg ${
                            option.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-orange-50 border-l-4 border-orange-400'
                          }`}
                        >
                          <p className={`text-sm leading-relaxed ${
                            option.isCorrect ? 'text-green-900' : 'text-orange-900'
                          }`}>
                            {option.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Concept Learned */}
          {showFeedback && getSelectedOption()?.isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-green-500 to-teal-500 border-0">
                <CardContent className="p-6 text-center text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-6 w-6" />
                    <h4 className="font-bold text-lg">Key Concept:</h4>
                  </div>
                  <p className="text-lg">{step.concept}</p>
                </CardContent>
              </Card>

              <div className="text-center pt-4">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full md:w-auto text-lg h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLastStep ? 'Complete Activity ✓' : 'Next Step →'}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
