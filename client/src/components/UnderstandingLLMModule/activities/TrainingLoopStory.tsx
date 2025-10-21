import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Target, TrendingUp, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

interface StoryStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  example: string;
  position: { x: string; y: string }; // Clock position
}

export default function TrainingLoopStory({ onComplete }: Props) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // The NEW example: "The capital of France is ___ → Paris"
  const storySteps: StoryStep[] = [
    {
      step: 1,
      title: "Predict",
      subtitle: "The AI Makes a Guess",
      description: "The model is given a sentence with a word missing. Based on all the patterns it's seen before, it predicts what word should come next.",
      icon: <Target className="h-8 w-8" />,
      color: "text-blue-400",
      bgGradient: "from-blue-500 to-cyan-500",
      example: "Sentence: \"The capital of France is ___\"\n\nAI predicts: \"Paris\" (92% confidence)\n\nThe AI uses statistical patterns from billions of sentences to make this highly confident prediction.",
      position: { x: "50%", y: "10%" } // 12 o'clock
    },
    {
      step: 2,
      title: "Compare",
      subtitle: "Check Against the Real Answer",
      description: "The AI compares its prediction to the actual correct answer. Was it right? Was it close? This comparison is crucial for learning.",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "text-purple-400",
      bgGradient: "from-purple-500 to-pink-500",
      example: "Correct answer: \"Paris\" ✓\nAI predicted: \"Paris\" ✓\n\nResult: CORRECT! The prediction was spot-on.\n\nThis comparison tells the AI whether to strengthen or adjust its connections.",
      position: { x: "85%", y: "50%" } // 3 o'clock
    },
    {
      step: 3,
      title: "Adjust",
      subtitle: "Fine-Tune the Connections",
      description: "Based on whether it was right or wrong, the AI adjusts its internal connections (parameters) just a tiny bit to make even better guesses next time.",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "text-orange-400",
      bgGradient: "from-orange-500 to-amber-500",
      example: "Since the answer was CORRECT:\n\nThe AI strengthens the billions of tiny connections that led to \"Paris\" being the top prediction.\n\nThese adjustments are microscopic but add up over billions of cycles!",
      position: { x: "50%", y: "90%" } // 6 o'clock
    },
    {
      step: 4,
      title: "Repeat",
      subtitle: "Billions of Times",
      description: "This cycle happens over and over again—billions and billions of times. With each loop, the model gets just a little bit better at predicting text.",
      icon: <RotateCw className="h-8 w-8" />,
      color: "text-green-400",
      bgGradient: "from-green-500 to-emerald-500",
      example: "This 4-step cycle runs BILLIONS of times:\n\nPredict → Compare → Adjust → Repeat\n\nAfter billions of these tiny tweaks across trillions of examples, the whole network becomes incredibly good at making predictions!",
      position: { x: "15%", y: "50%" } // 9 o'clock
    }
  ];

  const quizQuestion = {
    question: "What happens when the AI makes a wrong prediction during training?",
    options: [
      "The AI gives up and starts over from scratch",
      "The AI adjusts its internal connections to make a better guess next time",
      "The AI ignores the mistake and moves on",
      "Humans manually fix every wrong answer"
    ],
    correctIndex: 1,
    explanation: "When the AI gets something wrong, it adjusts its internal connections (parameters) just a tiny bit. After billions of these tiny tweaks, it gets really good at predictions!"
  };

  const handleStepClick = (step: number) => {
    setSelectedStep(step === selectedStep ? null : step);
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
  };

  if (showQuiz) {
    const isCorrect = selectedAnswer === quizQuestion.correctIndex;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Quick Check!
            </h2>

            <p className="text-xl text-white/90 mb-8">
              {quizQuestion.question}
            </p>

            <div className="space-y-3 mb-6">
              {quizQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === quizQuestion.correctIndex;

                let bgColor = "bg-white/10 hover:bg-white/20";
                let borderColor = "border-white/30";

                if (showFeedback) {
                  if (isCorrectAnswer) {
                    bgColor = "bg-green-900/40";
                    borderColor = "border-green-400";
                  } else if (isSelected) {
                    bgColor = "bg-red-900/40";
                    borderColor = "border-red-400";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} text-white text-left transition-all duration-200`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect
                    ? 'bg-green-900/40 border-2 border-green-400'
                    : 'bg-red-900/40 border-2 border-red-400'
                }`}
              >
                <p className="text-white font-semibold mb-2">
                  {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
                </p>
                <p className="text-white/90 text-sm">
                  {quizQuestion.explanation}
                </p>
              </motion.div>
            )}

            {showFeedback && (
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            The Training Loop
          </h1>
          <p className="text-xl text-white">
            How AI learns from billions of examples
          </p>
          <p className="text-sm text-white/60 mt-2">
            💡 Click any step to learn more
          </p>
        </motion.div>

        {/* Circular Diagram Container */}
        <div className="relative w-full aspect-square max-w-3xl mx-auto mb-8">
          {/* Center Circle - Animated Loop Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full border-2 border-white/20 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <RotateCw className="w-16 h-16 text-white mb-2 mx-auto" />
              </motion.div>
              <p className="text-white font-bold text-lg">Continuous</p>
              <p className="text-white text-sm">Learning Cycle</p>
            </div>
          </motion.div>

          {/* Curved Arrows Between Steps */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
            {/* Arrow 1→2 (12 to 3 o'clock) */}
            <motion.path
              d="M 50% 20% Q 75% 25%, 80% 45%"
              stroke="#60a5fa"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            {/* Arrow 2→3 (3 to 6 o'clock) */}
            <motion.path
              d="M 80% 55% Q 75% 75%, 55% 85%"
              stroke="#a78bfa"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            {/* Arrow 3→4 (6 to 9 o'clock) */}
            <motion.path
              d="M 45% 85% Q 25% 75%, 25% 55%"
              stroke="#fb923c"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.9 }}
            />
            {/* Arrow 4→1 (9 to 12 o'clock) */}
            <motion.path
              d="M 25% 45% Q 25% 25%, 45% 20%"
              stroke="#34d399"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1.1 }}
            />
          </svg>

          {/* Step Hotspots */}
          {storySteps.map((step, index) => (
            <motion.button
              key={step.step}
              onClick={() => handleStepClick(step.step)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                absolute -translate-x-1/2 -translate-y-1/2 z-20
                ${selectedStep === step.step ? 'ring-4 ring-yellow-400' : ''}
              `}
              style={{
                left: step.position.x,
                top: step.position.y
              }}
            >
              <div className={`
                bg-gradient-to-br ${step.bgGradient} rounded-2xl p-6 shadow-2xl border-2 border-white/30
                w-40 h-40 flex flex-col items-center justify-center text-center
                transition-all duration-300
                ${selectedStep === step.step ? 'scale-110' : 'hover:shadow-xl'}
              `}>
                <div className="text-white mb-2">
                  {step.icon}
                </div>
                <p className="text-white/80 text-xs font-semibold mb-1">Step {step.step}</p>
                <p className="text-white font-bold text-lg leading-tight">
                  {step.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail Panel (Expands when step is clicked) */}
        <AnimatePresence mode="wait">
          {selectedStep !== null && (
            <motion.div
              key={selectedStep}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 mb-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-br ${storySteps[selectedStep - 1].bgGradient} p-3 rounded-xl`}>
                    <div className="text-white">
                      {storySteps[selectedStep - 1].icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm font-semibold">Step {selectedStep} of 4</p>
                    <h3 className="text-2xl font-bold text-white">{storySteps[selectedStep - 1].title}</h3>
                    <p className="text-white text-sm">{storySteps[selectedStep - 1].subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-white/90 text-base leading-relaxed mb-6">
                {storySteps[selectedStep - 1].description}
              </p>

              <div className={`bg-gradient-to-br ${storySteps[selectedStep - 1].bgGradient} bg-opacity-20 border-2 border-white/30 rounded-xl p-6`}>
                <p className="text-white font-mono text-sm md:text-base whitespace-pre-line leading-relaxed">
                  {storySteps[selectedStep - 1].example}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 text-sm mb-4">
            {selectedStep === null
              ? "Explore all 4 steps to understand the complete training cycle"
              : "Click another step or close this panel to continue exploring"}
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg rounded-xl"
          >
            Test Your Understanding
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
