import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Users, Sparkles, Lightbulb } from 'lucide-react';

interface PromptingFrameworksProps {
  onComplete?: () => void;
  isDevMode?: boolean;
}

const PromptingFrameworks = ({ onComplete, isDevMode }: PromptingFrameworksProps) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>('RTF');

  const frameworks = [
    {
      id: 'RTF',
      name: 'RTF Framework',
      icon: <Target className="w-6 h-6" />,
      color: 'blue',
      fullName: 'Role, Task, Format',
      tagline: 'Perfect for beginners! Structure prompts with three simple components.',
      components: [
        { letter: 'R', word: 'Role', description: 'Act as a 5th grade teacher' },
        { letter: 'T', word: 'Task', description: 'Create a lesson plan on fractions' },
        { letter: 'F', word: 'Format', description: 'Bullet points with activities' }
      ],
      example: 'Act as a 5th grade teacher. Create a lesson plan on fractions. Format as bullet points with activities.',
      whenToUse: 'Great for educational content, lesson planning, and clear communication.'
    },
    {
      id: 'STAR',
      name: 'STAR Method',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'purple',
      fullName: 'Situation, Task, Action, Result',
      tagline: 'Provides detailed context for complex scenarios.',
      components: [
        { letter: 'S', word: 'Situation', description: 'Students struggling with math anxiety' },
        { letter: 'T', word: 'Task', description: 'Help them feel confident' },
        { letter: 'A', word: 'Action', description: 'Create supportive exercises' },
        { letter: 'R', word: 'Result', description: 'Measurable improvement plan' }
      ],
      example: 'Situation: My students have math anxiety. Task: Help them feel confident. Action: Create supportive exercises. Result: A week-long confidence building plan.',
      whenToUse: 'Ideal for problem-solving, creating intervention strategies, and detailed planning.'
    },
    {
      id: 'CARE',
      name: 'CARE Framework',
      icon: <Users className="w-6 h-6" />,
      color: 'green',
      fullName: 'Context, Action, Result, Example',
      tagline: 'Emphasizes examples for better AI understanding.',
      components: [
        { letter: 'C', word: 'Context', description: 'Elementary school science class' },
        { letter: 'A', word: 'Action', description: 'Design hands-on experiment' },
        { letter: 'R', word: 'Result', description: 'Students understand states of matter' },
        { letter: 'E', word: 'Example', description: 'Like the ice cube melting activity' }
      ],
      example: 'Context: Elementary science class. Action: Design a hands-on experiment. Result: Students understand states of matter. Example: Like the ice cube melting demonstration we did last year.',
      whenToUse: 'Best when you have good examples to share or need very specific outputs.'
    },
    {
      id: 'RISE',
      name: 'RISE Method',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'orange',
      fullName: 'Role, Input, Steps, Expectation',
      tagline: 'Breaks down complex tasks into clear steps.',
      components: [
        { letter: 'R', word: 'Role', description: 'Instructional designer' },
        { letter: 'I', word: 'Input', description: 'State standards for 7th grade' },
        { letter: 'S', word: 'Steps', description: '1) Analyze 2) Design 3) Implement' },
        { letter: 'E', word: 'Expectation', description: 'Aligned curriculum map' }
      ],
      example: 'Role: Act as an instructional designer. Input: Use state standards for 7th grade. Steps: 1) Analyze standards 2) Design units 3) Create assessments. Expectation: Complete curriculum map.',
      whenToUse: 'Perfect for multi-step processes, curriculum development, and systematic planning.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Explore Prompting Frameworks
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Click on each framework below to learn more about how it works
        </p>
      </motion.div>

      {/* Frameworks Grid - All Expanded */}
      <div className="grid md:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <motion.div
            key={framework.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`
              bg-white dark:bg-gray-900 rounded-lg border-2 cursor-pointer transition-all shadow-sm dark:shadow-gray-900/50
              ${selectedFramework === framework.id 
                ? (framework.color === 'blue' ? 'border-blue-500 shadow-lg' :
                   framework.color === 'purple' ? 'border-purple-500 shadow-lg' :
                   framework.color === 'green' ? 'border-green-500 shadow-lg' :
                   'border-orange-500 shadow-lg')
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            onClick={() => setSelectedFramework(framework.id)}
          >
            {/* Header - Always Visible */}
            <div className={`p-4 rounded-t-lg ${
              framework.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
              framework.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20' :
              framework.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
              'bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`mr-3 ${
                    framework.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    framework.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    framework.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`}>
                    {framework.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {framework.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{framework.fullName}</p>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                    selectedFramework === framework.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
              <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{framework.tagline}</p>
            </div>

            {/* Content - Always Expanded */}
            <div className="p-4 space-y-4">
              {/* Component Breakdown */}
              <div className="space-y-2">
                {framework.components.map((component, index) => (
                  <div key={index} className="flex items-start">
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full font-bold mr-3 text-white
                      ${framework.color === 'blue' ? 'bg-blue-600 dark:bg-blue-500' :
                        framework.color === 'purple' ? 'bg-purple-600 dark:bg-purple-500' :
                        framework.color === 'green' ? 'bg-green-600 dark:bg-green-500' :
                        'bg-orange-600 dark:bg-orange-500'
                      }
                    `}>
                      {component.letter}
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{component.word}:</span>
                      <span className="text-gray-700 dark:text-gray-200 ml-2">{component.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example */}
              <div className={`rounded p-3 border ${
                framework.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600' :
                framework.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-600' :
                framework.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600' :
                'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-600'
              }`}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Example:</p>
                <p className="text-sm text-gray-800 dark:text-gray-100 italic">"{framework.example}"</p>
              </div>

              {/* When to Use */}
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <span className="font-semibold text-gray-900 dark:text-white">When to use:</span> {framework.whenToUse}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          onClick={() => {
            if (onComplete) {
              onComplete();
            }
          }}
        >
          Let's Practice Using RTF Framework →
        </motion.button>
      </div>
    </div>
  );
};

export default PromptingFrameworks;