import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ChevronDown, Sparkles, Target } from 'lucide-react';

interface PromptFunnelVisualizationProps {
  onComplete: () => void;
}

const PromptFunnelVisualization: React.FC<PromptFunnelVisualizationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: 'No Prompt Context',
      rtfElement: null,
      promptText: '"Write something"',
      description: 'Without any guidance, the AI has infinite possibilities. The output could be anything — a poem, a recipe, a history essay, random facts...',
      exampleOutputs: [
        'Here\'s a poem about the moon...',
        'The capital of France is Paris...',
        'Once upon a time in a land far away...',
        'To make scrambled eggs, first...',
        'The periodic table was created...',
        'In 2024, the world population...',
      ],
      funnelWidth: 100,
      color: 'from-gray-300 to-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
    {
      label: 'Add ROLE',
      rtfElement: 'R',
      promptText: '"Act as a biology tutor..."',
      description: 'Adding a Role filters out everything except educational biology content. The AI now responds with expertise and appropriate vocabulary.',
      exampleOutputs: [
        'Cell division occurs in two main types...',
        'The mitochondria is often called...',
        'Let me explain photosynthesis step by step...',
        'DNA replication follows these key steps...',
      ],
      funnelWidth: 70,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Add TASK',
      rtfElement: 'T',
      promptText: '"...create a study guide on cell division"',
      description: 'Now the AI knows exactly what to create. It\'s no longer guessing — it\'s focused on one specific topic and deliverable.',
      exampleOutputs: [
        'Study Guide: Cell Division\n• Mitosis vs Meiosis\n• Key phases explained...',
        'Cell Division Review:\n1. Interphase: The cell prepares...',
      ],
      funnelWidth: 45,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Add FORMAT',
      rtfElement: 'F',
      promptText: '"...as an outline with key terms and 5 practice questions"',
      description: 'The Format locks in exactly how the output should look. Now you get precisely what you need — no more, no less.',
      exampleOutputs: [
        'Cell Division Study Guide\n\nI. Key Terms:\n• Mitosis — cell division producing 2 identical cells\n• Meiosis — cell division producing 4 unique cells\n• Chromosome — DNA structure carrying genetic info\n\nII. Outline:\nA. Mitosis Phases\n  1. Prophase\n  2. Metaphase\n  3. Anaphase\n  4. Telophase\n\nIII. Practice Questions:\n1. What is the difference between mitosis and meiosis?\n2. During which phase do chromosomes align?\n...',
      ],
      funnelWidth: 25,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Add CONTEXT',
      rtfElement: 'C',
      promptText: '"...about the causes of World War I, for a 10th grade student"',
      description: 'Context gives the AI the background information it needs. Now it knows the exact topic AND who it\'s writing for — so the vocabulary, depth, and examples are perfectly targeted.',
      exampleOutputs: [
        'Study Guide: Causes of World War I\nPrepared for: 10th Grade History Students\n\nI. Key Terms:\n• Alliance System — agreements between nations to defend each other\n• Imperialism — when powerful countries compete to control weaker regions\n• Nationalism — extreme pride in one\'s country, often leading to rivalry\n• Militarism — the buildup of a country\'s military power\n• Assassination of Archduke Franz Ferdinand — the spark that set off the war\n\nII. The Four M.A.I.N. Causes:\nA. Militarism\n  1. European arms race in early 1900s\n  2. Countries built massive armies and navies\n\nB. Alliances\n  1. Triple Alliance: Germany, Austria-Hungary, Italy\n  2. Triple Entente: France, Russia, Britain\n\nC. Imperialism\n  1. Competition for colonies in Africa and Asia\n  2. Created tension between European powers\n\nD. Nationalism\n  1. Ethnic groups wanted independence\n  2. Balkans became a \"powder keg\" of conflict\n\nIII. Practice Questions:\n1. What does M.A.I.N. stand for in the context of WWI causes?\n2. Why were the Balkans called the \"powder keg of Europe\"?\n3. How did the alliance system turn a single assassination into a world war?\n4. Compare imperialism and nationalism as causes of WWI.\n5. Could WWI have been prevented? Explain your reasoning.',
      ],
      funnelWidth: 15,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  const activeStep = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Meet the RTFC Framework
        </CardTitle>
        <p className="text-gray-600 mt-1">
          Watch how each RTFC element narrows the AI's output from chaos to exactly what you need
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* RTF Letters Display */}
        <div className="flex items-center justify-center gap-4 mb-2">
          {['R', 'T', 'F', 'C'].map((letter, idx) => {
            const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
            const labels = ['Role', 'Task', 'Format', 'Context'];
            const isActive = currentStep >= idx + 1;
            return (
              <motion.div
                key={letter}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-center"
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-white transition-colors ${
                  isActive ? colors[idx] : 'bg-gray-300'
                }`}>
                  {letter}
                </div>
                <p className={`text-xs mt-1 font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                  {labels[idx]}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* The Funnel Visualization */}
        <div className="relative flex flex-col items-center py-4">
          {/* Step indicators on the left */}
          <div className="w-full flex flex-col items-center gap-1 mb-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                animate={{
                  opacity: idx <= currentStep ? 1 : 0.3,
                }}
                className="flex items-center gap-3 w-full max-w-md"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < currentStep
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : idx === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {idx < currentStep ? '✓' : idx + 1}
                </div>
                <span className={`text-sm font-medium ${
                  idx === currentStep ? 'text-gray-900' : idx < currentStep ? 'text-green-700' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {step.rtfElement && (
                  <span className={`text-xs px-2 py-0.5 rounded font-bold text-white ${
                    step.rtfElement === 'R' ? 'bg-blue-600' : step.rtfElement === 'T' ? 'bg-green-600' : step.rtfElement === 'F' ? 'bg-purple-600' : 'bg-orange-600'
                  } ${idx <= currentStep ? 'opacity-100' : 'opacity-30'}`}>
                    +{step.rtfElement}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Animated Funnel Bar */}
          <div className="w-full max-w-lg mx-auto relative h-16 flex items-center justify-center mb-4">
            <motion.div
              animate={{ width: `${activeStep.funnelWidth}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className={`h-12 rounded-lg bg-gradient-to-r ${activeStep.color} shadow-lg flex items-center justify-center`}
            >
              <motion.span
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold text-sm px-2 text-center whitespace-nowrap overflow-hidden"
              >
                {currentStep === 0 ? 'Infinite possibilities' :
                 currentStep === 1 ? 'Biology content' :
                 currentStep === 2 ? 'Study guide' :
                 currentStep === 3 ? 'Exact structure' :
                 'Perfect output'}
              </motion.span>
            </motion.div>
          </div>

          {/* Arrow between funnel and content */}
          <ChevronDown className="w-6 h-6 text-gray-400 mb-2" />
        </div>

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${activeStep.bgColor} border-2 ${activeStep.borderColor} rounded-lg p-6 space-y-4`}
          >
            {/* The prompt so far */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Your prompt:</p>
              <p className="text-gray-900 font-mono text-sm">{activeStep.promptText}</p>
            </div>

            {/* Description */}
            <p className="text-gray-800">{activeStep.description}</p>

            {/* Example outputs */}
            <div>
              <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">Possible AI outputs:</p>
              <div className={`space-y-2 ${currentStep < 4 ? 'grid grid-cols-1 md:grid-cols-2 gap-2' : ''}`}>
                {activeStep.exampleOutputs.map((output, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700 whitespace-pre-line"
                  >
                    {output}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              size="lg"
              className={`text-white ${
                currentStep === 0 ? 'bg-blue-600 hover:bg-blue-700' :
                currentStep === 1 ? 'bg-green-600 hover:bg-green-700' :
                currentStep === 2 ? 'bg-purple-600 hover:bg-purple-700' :
                'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {currentStep === 0 ? 'Add Role' : currentStep === 1 ? 'Add Task' : currentStep === 2 ? 'Add Format' : 'Add Context'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-bold">The RTFC Framework in Action!</p>
                  </div>
                  <p className="text-green-700 text-sm">
                    By combining Role + Task + Format + Context, you went from infinite random outputs to exactly what you need. That's the power of structured prompting.
                  </p>
                </div>
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue — Let's Deep Dive into Each Element
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptFunnelVisualization;
