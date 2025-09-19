import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Zap, Lightbulb, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FrameworksIntroSectionProps {
  onComplete: () => void;
}

const FrameworksIntroSection: React.FC<FrameworksIntroSectionProps> = ({ onComplete }) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const frameworks = [
    {
      id: 'rtf',
      name: 'RTF Framework',
      subtitle: 'Role, Task, Format',
      description: 'Perfect for beginners! Structures prompts with three simple components.',
      example: 'Role: Act as a 5th grade teacher\nTask: Create a lesson plan on fractions\nFormat: Bullet points with activities',
      whenToUse: 'Great for educational content, lesson planning, and clear communication',
      difficulty: 'Beginner',
      color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-300 dark:border-blue-600',
      icon: Target
    },
    {
      id: 'star',
      name: 'STAR Method',
      subtitle: 'Situation, Task, Action, Result',
      description: 'Provides detailed context for complex scenarios.',
      example: 'Situation: Students struggling with essay writing\nTask: Improve their skills\nAction: Create a step-by-step guide\nResult: Clear, structured essays',
      whenToUse: 'Best for problem-solving and detailed instructions',
      difficulty: 'Intermediate',
      color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-300 dark:border-purple-600',
      icon: Lightbulb
    },
    {
      id: 'care',
      name: 'CARE Framework',
      subtitle: 'Context, Action, Result, Example',
      description: 'Emphasizes examples for better AI understanding.',
      example: 'Context: Teaching multiplication\nAction: Create practice problems\nResult: Varied difficulty levels\nExample: 3×4, 12×15, 23×45',
      whenToUse: 'Ideal when you need specific examples in outputs',
      difficulty: 'Intermediate',
      color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-300 dark:border-green-600',
      icon: BookOpen
    },
    {
      id: 'rise',
      name: 'RISE Method',
      subtitle: 'Role, Input, Steps, Expectation',
      description: 'Breaks down complex tasks into clear steps.',
      example: 'Role: Curriculum designer\nInput: Grade 3 science standards\nSteps: 1) Review standards 2) Create activities 3) Add assessments\nExpectation: Complete unit plan',
      whenToUse: 'Perfect for multi-step processes and workflows',
      difficulty: 'Advanced',
      color: 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20',
      borderColor: 'border-orange-300 dark:border-orange-600',
      icon: Zap
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Prompting Frameworks: Your AI Communication Toolkit
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Just like lesson plans provide structure for teaching, prompting frameworks give structure to your AI conversations. 
          Let's explore four popular frameworks that educators love!
        </p>
      </motion.div>

      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm">
          <Info className="h-4 w-4" />
          Click on any framework card to see examples and details
        </span>
      </p>

      {/* Framework Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {frameworks.map((framework, index) => {
          const IconComponent = framework.icon;
          return (
            <motion.div
              key={framework.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`
                  p-6 cursor-pointer transition-all duration-300
                  ${framework.color} ${framework.borderColor} 
                  border-2 hover:shadow-xl hover:scale-[1.02]
                  ${selectedFramework === framework.id 
                    ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' 
                    : 'hover:border-opacity-80'
                  }
                  relative overflow-hidden
                `}
                onClick={() => setSelectedFramework(framework.id)}
              >
                {/* Add click indicator badge */}
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/80 dark:bg-gray-800/80"
                  >
                    Click to expand
                  </Badge>
                </div>
                
                {/* Add expanding arrow indicator */}
                <div className="absolute bottom-4 right-4">
                  <motion.div
                    animate={{ 
                      rotate: selectedFramework === framework.id ? 180 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </div>
                <div className="flex items-start justify-between mb-4 pr-16">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {framework.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {framework.subtitle}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getDifficultyColor(framework.difficulty)} border-none`}>
                    {framework.difficulty}
                  </Badge>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {framework.description}
                </p>

                {selectedFramework === framework.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Example:</h4>
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {framework.example}
                      </pre>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">When to use:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {framework.whenToUse}
                      </p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* What is a Framework Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-6 rounded-xl mb-6"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">What is a Prompting Framework?</h3>
          <p className="text-indigo-100 text-lg mb-6 max-w-3xl mx-auto">
            A prompting framework is like a recipe for talking to AI. Just like you follow steps when cooking, 
            frameworks give you a structured way to organize your thoughts and get better results from AI tools.
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <p className="text-indigo-100 text-sm mb-3">
              <strong>Think of it like this:</strong> Instead of saying "help me with math," you use a framework to say:
            </p>
            <div className="bg-indigo-900/50 rounded-lg p-3 font-mono text-sm text-left">
              <span className="text-yellow-300 font-bold">Role:</span> Act as a patient math tutor<br/>
              <span className="text-yellow-300 font-bold">Task:</span> Explain fractions step-by-step<br/>
              <span className="text-yellow-300 font-bold">Format:</span> Use simple examples and check my understanding
            </div>
          </div>
        </div>
      </motion.div>

      {/* RTF Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 rounded-xl"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Master RTF?</h3>
          <p className="text-blue-100 mb-4 max-w-2xl mx-auto">
            We'll focus on the RTF framework - it's the most beginner-friendly and perfect for educators. 
            You'll learn each component step by step with hands-on practice!
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-100">
            <Target className="h-5 w-5" />
            <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded font-bold text-lg">R</span>
            <span>→</span>
            <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded font-bold text-lg">T</span>
            <span>→</span>
            <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded font-bold text-lg">F</span>
          </div>
          <div className="mt-2 text-sm text-blue-200">
            <span className="font-semibold">Role</span> • <span className="font-semibold">Task</span> • <span className="font-semibold">Format</span>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="text-center pt-4">
        <Button 
          onClick={onComplete}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Let's Learn RTF Framework
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default FrameworksIntroSection;