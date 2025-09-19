import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, RefreshCw } from 'lucide-react';

interface Scenario {
  id: string;
  context: string;
  task: string;
  options: RoleOption[];
  bestRole: string;
  explanation: string;
}

interface RoleOption {
  id: string;
  role: string;
  color: string;
  feedback: string;
  score: 'excellent' | 'good' | 'poor';
}

interface RoleMatchingActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const RoleMatchingActivity: React.FC<RoleMatchingActivityProps> = ({ onComplete, isDevMode }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: 'math-help',
      context: 'You need help understanding a difficult math concept',
      task: 'Complete the prompt: "_____ and explain how to solve quadratic equations"',
      options: [
        {
          id: 'tutor',
          role: 'Act as a patient math tutor',
          color: 'green',
          feedback: 'Excellent! A math tutor is the perfect expert for explaining mathematical concepts clearly.',
          score: 'excellent'
        },
        {
          id: 'comedian',
          role: 'Act as a professional comedian',
          color: 'orange',
          feedback: 'While humor can help learning, a comedian isn\'t the best choice for explaining math concepts.',
          score: 'poor'
        },
        {
          id: 'chef',
          role: 'Act as a chef',
          color: 'red',
          feedback: 'A chef specializes in cooking, not mathematics. Choose a role with relevant expertise.',
          score: 'poor'
        },
        {
          id: 'agent',
          role: 'Act as a travel agent',
          color: 'blue',
          feedback: 'Travel agents plan trips, not math lessons. Pick someone with educational expertise.',
          score: 'poor'
        }
      ],
      bestRole: 'tutor',
      explanation: 'When you need educational help, choose roles with teaching expertise and subject knowledge.'
    },
    {
      id: 'parent-letter',
      context: 'You need to communicate with parents professionally',
      task: 'Complete the prompt: "_____ and write a welcome letter for back-to-school night"',
      options: [
        {
          id: 'teenager',
          role: 'Act as a teenager',
          color: 'purple',
          feedback: 'A teenager\'s tone would be too casual for professional parent communication.',
          score: 'poor'
        },
        {
          id: 'teacher',
          role: 'Act as an experienced elementary school teacher',
          color: 'green',
          feedback: 'Perfect! An experienced teacher knows exactly how to communicate effectively with parents.',
          score: 'excellent'
        },
        {
          id: 'coach',
          role: 'Act as a sports coach',
          color: 'orange',
          feedback: 'While coaches communicate with parents, a teacher is more appropriate for academic contexts.',
          score: 'good'
        },
        {
          id: 'scientist',
          role: 'Act as a scientist',
          color: 'blue',
          feedback: 'Scientists have expertise, but may not have the right tone for parent communication.',
          score: 'poor'
        }
      ],
      bestRole: 'teacher',
      explanation: 'Match the role to both the task AND the audience. Teachers are experts at parent communication.'
    },
    {
      id: 'science-experiment',
      context: 'You want an engaging but safe science activity',
      task: 'Complete the prompt: "_____ and design a safe chemistry experiment for middle schoolers"',
      options: [
        {
          id: 'chef',
          role: 'Act as a professional chef',
          color: 'orange',
          feedback: 'Chefs know kitchen chemistry, but not educational lab safety standards.',
          score: 'poor'
        },
        {
          id: 'novelist',
          role: 'Act as a novelist',
          color: 'purple',
          feedback: 'Novelists tell stories, but lack the scientific expertise for safe experiments.',
          score: 'poor'
        },
        {
          id: 'science-teacher',
          role: 'Act as a middle school science teacher with lab safety expertise',
          color: 'green',
          feedback: 'Excellent! This role combines scientific knowledge with age-appropriate safety awareness.',
          score: 'excellent'
        },
        {
          id: 'musician',
          role: 'Act as a musician',
          color: 'blue',
          feedback: 'Musicians create art, not science experiments. Choose someone with scientific expertise.',
          score: 'poor'
        }
      ],
      bestRole: 'science-teacher',
      explanation: 'Safety + education requires specific expertise. Always consider both knowledge and context.'
    }
  ];

  const currentScenario = scenarios[currentScenarioIndex];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedRole(null);
      setShowFeedback(false);
    } else {
      // Complete the activity
      onComplete();
    }
  };

  const getScoreIcon = (score: string) => {
    return score === 'excellent' ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Practice: Match the Right Role
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          For each scenario, select the most appropriate role to get the best help from AI.
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Scenario {currentScenarioIndex + 1} of {scenarios.length}</span>
        </div>
      </div>

      {/* Scenario Card */}
      <motion.div
        key={currentScenario.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
      >
        {/* Context - High Contrast */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <p className="text-lg text-gray-800 dark:text-gray-100 font-medium">
            {currentScenario.context}
          </p>
        </div>

        {/* Task */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-200 font-semibold mb-4">
            {currentScenario.task}
          </p>
        </div>

        {/* Role Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentScenario.options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(option.id)}
              disabled={showFeedback}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${selectedRole === option.id 
                  ? option.score === 'excellent' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400' 
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                  : 'border-gray-300 hover:border-gray-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500'
                }
                ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {option.role}
                </span>
                {showFeedback && selectedRole === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {getScoreIcon(option.score)}
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Feedback Section */}
      <AnimatePresence>
        {showFeedback && selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            {/* Selected Role Feedback */}
            <div className={`
              p-4 rounded-lg mb-4
              ${currentScenario.options.find(o => o.id === selectedRole)?.score === 'excellent'
                ? 'bg-green-50 border-2 border-green-300 dark:bg-green-900/20 dark:border-green-600'
                : 'bg-orange-50 border-2 border-orange-300 dark:bg-orange-900/20 dark:border-orange-600'
              }
            `}>
              <p className="text-gray-800 dark:text-gray-100 font-medium">
                {currentScenario.options.find(o => o.id === selectedRole)?.feedback}
              </p>
            </div>

            {/* Learning Point */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-600">
              <div className="flex items-start">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Key Learning:</p>
                  <p className="text-gray-700 dark:text-gray-200">{currentScenario.explanation}</p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextScenario}
                className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center mx-auto"
              >
                {currentScenarioIndex < scenarios.length - 1 ? (
                  <>Next Scenario <RefreshCw className="w-4 h-4 ml-2" /></>
                ) : (
                  <>Complete Activity <CheckCircle className="w-4 h-4 ml-2" /></>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleMatchingActivity;