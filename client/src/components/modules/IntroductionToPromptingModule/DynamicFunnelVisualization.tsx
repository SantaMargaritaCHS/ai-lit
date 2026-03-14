import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface DynamicFunnelVisualizationProps {
  onComplete: () => void;
}

type BubbleCategory = 'random' | 'biology' | 'study-guide' | 'formatted' | 'perfect';

interface Bubble {
  id: number;
  text: string;
  category: BubbleCategory;
}

const ALL_BUBBLES: Bubble[] = [
  { id: 0, text: 'Poem about the moon', category: 'random' },
  { id: 1, text: 'Recipe for scrambled eggs', category: 'random' },
  { id: 2, text: 'Capital of France', category: 'random' },
  { id: 3, text: 'Fairy tale about a dragon', category: 'random' },
  { id: 4, text: 'World population stats', category: 'random' },
  { id: 5, text: 'Periodic table facts', category: 'random' },
  { id: 6, text: 'How to fix a bicycle', category: 'random' },
  { id: 7, text: 'Song lyrics about summer', category: 'random' },
  { id: 8, text: 'Cell division overview', category: 'biology' },
  { id: 9, text: 'Photosynthesis explained', category: 'biology' },
  { id: 10, text: 'Mitochondria function', category: 'biology' },
  { id: 11, text: 'DNA replication steps', category: 'biology' },
  { id: 12, text: 'Cell division study guide', category: 'study-guide' },
  { id: 13, text: 'Cell division flashcards', category: 'study-guide' },
  { id: 14, text: 'Structured outline with key terms', category: 'formatted' },
  { id: 15, text: 'WWI causes study guide for 10th grade', category: 'perfect' },
];

const CATEGORY_VISIBILITY: Record<number, BubbleCategory[]> = {
  0: ['random', 'biology', 'study-guide', 'formatted', 'perfect'],
  1: ['biology', 'study-guide', 'formatted', 'perfect'],
  2: ['study-guide', 'formatted', 'perfect'],
  3: ['formatted', 'perfect'],
  4: ['perfect'],
};

const STEPS = [
  {
    label: 'No Prompt Context',
    prompt: '"Write something"',
    description: 'Without guidance, the AI could produce anything — poems, recipes, random facts...',
    funnelWidth: 100,
    funnelLabel: 'Infinite possibilities',
    color: '#6b7280',
    buttonLabel: 'Add Role',
  },
  {
    label: '+ Role',
    prompt: '"Act as a biology tutor..."',
    description: 'Adding a Role narrows the AI to biology-related content only.',
    funnelWidth: 70,
    funnelLabel: 'Biology content',
    color: '#3b82f6',
    buttonLabel: 'Add Task',
  },
  {
    label: '+ Task',
    prompt: '"...create a study guide on cell division"',
    description: 'A specific Task eliminates everything except study guide formats about cell division.',
    funnelWidth: 45,
    funnelLabel: 'Study guides',
    color: '#22c55e',
    buttonLabel: 'Add Format',
  },
  {
    label: '+ Format',
    prompt: '"...as an outline with key terms and 5 practice questions"',
    description: 'Format tells the AI exactly how to structure the output.',
    funnelWidth: 25,
    funnelLabel: 'Exact structure',
    color: '#a855f7',
    buttonLabel: 'Add Context',
  },
  {
    label: '+ Context',
    prompt: '"...about the causes of WWI, for a 10th grade student"',
    description: 'Context dials in the audience, topic depth, and specifics — one perfect result.',
    funnelWidth: 15,
    funnelLabel: 'Perfect output',
    color: '#f97316',
    buttonLabel: '',
  },
];

const RTFC_LETTERS = [
  { letter: 'R', label: 'Role', color: '#3b82f6', step: 1 },
  { letter: 'T', label: 'Task', color: '#22c55e', step: 2 },
  { letter: 'F', label: 'Format', color: '#a855f7', step: 3 },
  { letter: 'C', label: 'Context', color: '#f97316', step: 4 },
];

// Deterministic pseudo-random positions for bubbles
const BUBBLE_POSITIONS = ALL_BUBBLES.map((_, i) => ({
  x: ((i * 47 + 13) % 80) + 10,
  y: ((i * 31 + 7) % 60) + 20,
  exitDirection: i % 2 === 0 ? -1 : 1,
}));

const DynamicFunnelVisualization: React.FC<DynamicFunnelVisualizationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const visibleCategories = CATEGORY_VISIBILITY[currentStep];
  const step = STEPS[currentStep];

  const visibleBubbles = useMemo(
    () => ALL_BUBBLES.filter((b) => visibleCategories.includes(b.category)),
    [currentStep] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  }, [currentStep]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* RTFC Letter Display */}
      <div className="flex justify-center gap-3 mb-6" role="group" aria-label="RTFC prompt elements">
        {RTFC_LETTERS.map(({ letter, label, color, step: activeStep }) => {
          const isActive = currentStep >= activeStep;
          return (
            <div key={letter} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-500"
                style={{
                  backgroundColor: isActive ? color : '#334155',
                  color: isActive ? '#ffffff' : '#64748b',
                  boxShadow: isActive ? `0 0 16px ${color}66` : 'none',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label={`${letter} for ${label}${isActive ? ' (active)' : ''}`}
              >
                {letter}
              </div>
              <span
                className="text-xs font-medium transition-colors duration-300"
                style={{ color: isActive ? '#e2e8f0' : '#64748b' }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{step.label}</h3>
        <p className="text-blue-300 font-mono text-sm mb-2">{step.prompt}</p>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">{step.description}</p>
      </div>

      {/* Funnel Visualization Area */}
      <div
        className="relative rounded-xl overflow-hidden mb-6"
        style={{
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          minHeight: '320px',
          perspective: '800px',
        }}
      >
        {/* Floating Bubbles */}
        <div className="absolute inset-0" aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {visibleBubbles.map((bubble) => {
              const pos = BUBBLE_POSITIONS[bubble.id];
              const isLast = bubble.category === 'perfect' && currentStep === 4;
              return (
                <motion.div
                  key={bubble.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: isLast ? 1.15 : 1,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  exit={{
                    opacity: 0,
                    x: pos.exitDirection * 300,
                    y: -80,
                    scale: 0.3,
                    transition: { duration: 0.6, ease: 'easeIn', delay: bubble.id * 0.04 },
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{
                      background: isLast
                        ? 'rgba(249, 115, 22, 0.3)'
                        : 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                      border: isLast
                        ? '1px solid rgba(249, 115, 22, 0.6)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      color: isLast ? '#fed7aa' : '#e2e8f0',
                      boxShadow: isLast ? '0 0 20px rgba(249, 115, 22, 0.4)' : 'none',
                    }}
                  >
                    {isLast && <Sparkles className="w-3 h-3 inline mr-1" />}
                    {bubble.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Funnel Shape */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4">
          <motion.div
            className="h-10 rounded-lg flex items-center justify-center"
            animate={{
              width: `${step.funnelWidth}%`,
              backgroundColor: step.color,
            }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ minWidth: '120px' }}
          >
            <span className="text-white text-xs font-semibold px-3 truncate">
              {step.funnelLabel}
            </span>
          </motion.div>
          <motion.div
            className="h-1 rounded-b mt-0.5"
            animate={{
              width: `${step.funnelWidth}%`,
              backgroundColor: step.color,
              opacity: 0.4,
            }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ minWidth: '120px' }}
          />
        </div>

        {/* Bubble count indicator */}
        <div className="absolute top-3 right-3">
          <span className="text-slate-400 text-xs font-mono bg-slate-800/70 px-2 py-1 rounded">
            {visibleBubbles.length} output{visibleBubbles.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Action Area */}
      {!completed ? (
        <div className="flex justify-center">
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {step.buttonLabel}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              See the Result
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-6 mb-4 max-w-xl mx-auto">
            <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <p className="text-slate-200 text-sm leading-relaxed">
              By combining <span className="text-blue-400 font-semibold">Role</span> +{' '}
              <span className="text-green-400 font-semibold">Task</span> +{' '}
              <span className="text-purple-400 font-semibold">Format</span> +{' '}
              <span className="text-orange-400 font-semibold">Context</span>, you went from
              infinite random outputs to exactly what you need. That&apos;s the power of structured
              prompting.
            </p>
          </div>
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base"
          >
            Continue — Let&apos;s Deep Dive into Each Element
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DynamicFunnelVisualization;
