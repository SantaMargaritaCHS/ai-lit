import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RoleActivityProps {
  onComplete: () => void;
}

const RoleActivity: React.FC<RoleActivityProps> = ({ onComplete }) => {
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios = [
    {
      id: 'math-help',
      prompt: '_____ and explain how to solve quadratic equations',
      context: 'You need help understanding a difficult math concept',
      correctRole: 'Act as a patient math tutor',
      options: [
        'Act as a patient math tutor',
        'Act as a professional comedian',
        'Act as a chef',
        'Act as a travel agent'
      ],
      feedback: 'A math tutor is the perfect expert for explaining mathematical concepts clearly!'
    },
    {
      id: 'parent-letter',
      prompt: '_____ and write a welcome letter for back-to-school night',
      context: 'You need to communicate with parents professionally',
      correctRole: 'Act as an experienced elementary school teacher',
      options: [
        'Act as a teenager',
        'Act as an experienced elementary school teacher',
        'Act as a sports coach',
        'Act as a scientist'
      ],
      feedback: 'An experienced teacher knows how to communicate effectively with parents!'
    },
    {
      id: 'science-experiment',
      prompt: '_____ and design a safe chemistry experiment for middle schoolers',
      context: 'You want an engaging but safe science activity',
      correctRole: 'Act as a middle school science teacher with lab safety expertise',
      options: [
        'Act as a professional chef',
        'Act as a novelist',
        'Act as a middle school science teacher with lab safety expertise',
        'Act as a musician'
      ],
      feedback: 'A science teacher with safety expertise ensures educational AND safe experiments!'
    }
  ];

  const roleExamples = [
    { icon: '👩‍🏫', role: 'Teacher', examples: ['elementary teacher', 'high school math teacher', 'special education specialist'] },
    { icon: '📚', role: 'Subject Expert', examples: ['historian', 'scientist', 'literature professor'] },
    { icon: '🎨', role: 'Creative Professional', examples: ['children\'s book author', 'educational game designer', 'storyteller'] },
    { icon: '💼', role: 'Professional', examples: ['school counselor', 'curriculum developer', 'education consultant'] }
  ];

  const handleRoleSelect = (scenarioId: string, role: string) => {
    setSelectedRoles({ ...selectedRoles, [scenarioId]: role });
  };

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  const allCorrect = scenarios.every(s => selectedRoles[s.id] === s.correctRole);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
          {/* Introduction */}
          <Card className="p-6 bg-gradient-to-br from-purple-700 to-pink-700 text-white border-purple-600">
            <h2 className="text-2xl font-bold mb-3">
              The Power of Role: Choosing Your AI Expert
            </h2>
            <p className="text-purple-100 mb-4">
              The Role tells AI what expertise to use. It's like choosing which colleague to ask for help - 
              you wouldn't ask the gym teacher for calculus help!
            </p>
            
            {/* Role Examples */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {roleExamples.map((category) => (
                <div key={category.role} className="bg-white/20 rounded-lg p-3 border border-white/30">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <span className="font-semibold text-white">{category.role}</span>
                  </div>
                  <p className="text-xs text-purple-100">
                    Examples: {category.examples.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Practice Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Practice: Match the Right Role
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For each scenario, select the most appropriate role to get the best help from AI:
            </p>

            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scenario.context}</p>
                  <p className="font-medium mb-3">
                    Complete the prompt: "{scenario.prompt}"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {scenario.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleRoleSelect(scenario.id, option)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          selectedRoles[scenario.id] === option
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                        }`}
                        disabled={showFeedback}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showFeedback && selectedRoles[scenario.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 p-3 rounded-lg ${
                        selectedRoles[scenario.id] === scenario.correctRole
                          ? 'bg-green-500/20 border border-green-500/50'
                          : 'bg-red-500/20 border border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start">
                        {selectedRoles[scenario.id] === scenario.correctRole ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${
                            selectedRoles[scenario.id] === scenario.correctRole 
                              ? 'text-green-300' 
                              : 'text-red-300'
                          }`}>
                            {selectedRoles[scenario.id] === scenario.correctRole ? 'Correct!' : `Not quite. The best choice is: "${scenario.correctRole}"`}
                          </p>
                          <p className={`text-sm mt-1 ${
                            selectedRoles[scenario.id] === scenario.correctRole 
                              ? 'text-green-200' 
                              : 'text-red-200'
                          }`}>{scenario.feedback}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>

            {!showFeedback && Object.keys(selectedRoles).length === scenarios.length && (
              <Button onClick={checkAnswers} className="w-full mt-4">
                Check My Answers
              </Button>
            )}
          </Card>

          {/* Key Takeaway */}
          {showFeedback && (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700">
              <div className="flex items-start">
                <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                    Remember: Role = Expertise
                  </h4>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Always choose a role that matches the expertise you need. Be specific! 
                    "Act as a 3rd grade teacher" is better than just "Act as a teacher."
                  </p>
                  {allCorrect && (
                    <p className="text-green-700 dark:text-green-300 font-medium mt-2">
                      🎉 Excellent work! You understand how to choose the right role!
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Continue Button */}
          {showFeedback && (
            <div className="flex justify-center pt-4">
              <Button onClick={onComplete} size="lg" className="px-8">
                Continue to Task
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default RoleActivity;