import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RTFPracticeBuilderProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const RTFPracticeBuilder: React.FC<RTFPracticeBuilderProps> = ({ onComplete, isDevMode }) => {
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const scenarios = [
    {
      title: 'Lesson Planning Challenge',
      context: 'You need to create a science lesson about the water cycle for 4th graders.',
      hints: {
        role: 'Think: Who would be an expert at teaching science to kids?',
        task: 'What specific lesson elements do you need?',
        format: 'How should the lesson be structured?'
      }
    },
    {
      title: 'Parent Communication',
      context: 'A parent is concerned about their child\'s math progress.',
      hints: {
        role: 'What professional role would handle this sensitively?',
        task: 'What kind of response would be helpful?',
        format: 'What\'s the appropriate format for parent communication?'
      }
    }
  ];

  const analyzePrompt = () => {
    const analysis = {
      role: {
        score: role.length > 10 && role.includes('teacher') ? 'good' : 'needs-work',
        feedback: role.includes('teacher') || role.includes('educator') 
          ? 'Good choice of educational role!'
          : 'Consider using a more specific educational role.'
      },
      task: {
        score: task.length > 20 && (task.includes('create') || task.includes('write')) ? 'good' : 'needs-work',
        feedback: task.length > 20 
          ? 'Nice specific task description!'
          : 'Add more details about what you want to accomplish.'
      },
      format: {
        score: format.length > 10 ? 'good' : 'needs-work',
        feedback: format.includes('bullet') || format.includes('steps') || format.includes('plan')
          ? 'Clear format specification!'
          : 'Be more specific about how you want the output formatted.'
      }
    };
    
    return analysis;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          🛠️ Build Your RTF Prompt
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Practice creating effective prompts using the Role, Task, Format framework.
        </p>
        
        {/* Scenario */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{scenarios[0].title}</h4>
          <p className="text-gray-600 dark:text-gray-400">{scenarios[0].context}</p>
        </div>

      {/* RTF Builder */}
      <div className="space-y-4">
        {/* Role Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-bold">R</span> Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Act as a..."
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{scenarios[0].hints.role}</p>
        </div>

        {/* Task Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded font-bold">T</span> Task
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Create/Write/Explain..."
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 dark:bg-gray-800 dark:text-white"
            rows={2}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{scenarios[0].hints.task}</p>
        </div>

        {/* Format Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded font-bold">F</span> Format
          </label>
          <input
            type="text"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="Format as..."
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:bg-gray-800 dark:text-white"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{scenarios[0].hints.format}</p>
        </div>
      </div>

        {/* Complete Prompt Display */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Your Complete Prompt:</h4>
          <p className="text-gray-600 dark:text-gray-300 italic">
            {role || '[Add role]'} {task || '[Add task]'} {format || '[Add format]'}
          </p>
        </div>

        {/* Analyze Button */}
        <button
          onClick={() => setShowAnalysis(true)}
          disabled={!role || !task || !format}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Analyze My RTF Prompt
        </button>

        {/* Analysis Feedback */}
        {showAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          {Object.entries(analyzePrompt()).map(([component, analysis]) => (
            <div key={component} className={`p-4 rounded-lg border-2 ${
              analysis.score === 'good' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
            }`}>
              <div className="flex items-center mb-2">
                {analysis.score === 'good' ? 
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> :
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                }
                <span className="font-semibold capitalize">{component}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.feedback}</p>
            </div>
          ))}
          
          {/* Complete button */}
          <div className="mt-4 text-center">
            <Button onClick={onComplete} className="w-full">
              Complete Activity <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default RTFPracticeBuilder;