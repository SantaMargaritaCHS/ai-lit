import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface AITaskExamplesProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const AITaskExamples: React.FC<AITaskExamplesProps> = ({ onComplete, isDevMode }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const taskExamples = [
    {
      id: 'lesson-plan',
      text: 'Create a detailed lesson plan with objectives and activities',
      isGood: true,
      category: 'specific',
      reason: 'Specific, actionable, and within AI capabilities'
    },
    {
      id: 'help-me',
      text: 'Help me',
      isGood: false,
      category: 'vague',
      reason: 'Too vague - AI needs specific instructions'
    },
    {
      id: 'grade-papers',
      text: 'Grade these student papers for me',
      isGood: false,
      category: 'impossible',
      reason: 'AI cannot access or evaluate actual student work'
    },
    {
      id: 'explain-photosynthesis',
      text: 'Explain photosynthesis in simple terms for 5th graders',
      isGood: true,
      category: 'specific',
      reason: 'Clear task with specific audience'
    },
    {
      id: 'do-something',
      text: 'Do something educational',
      isGood: false,
      category: 'vague',
      reason: 'No specific action or outcome requested'
    },
    {
      id: 'parent-email',
      text: 'Write a professional email template for parent conferences',
      isGood: true,
      category: 'specific',
      reason: 'Specific document type and purpose'
    },
    {
      id: 'make-better',
      text: 'Make it better',
      isGood: false,
      category: 'vague',
      reason: 'Unclear what "it" is or how to improve'
    },
    {
      id: 'quiz-questions',
      text: 'Generate 10 multiple choice questions about fractions',
      isGood: true,
      category: 'specific',
      reason: 'Specific quantity, format, and topic'
    }
  ];

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  const toggleTask = (taskId: string) => {
    if (!showFeedback) {
      setSelectedTasks(prev => 
        prev.includes(taskId) 
          ? prev.filter(id => id !== taskId)
          : [...prev, taskId]
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Practice: Identify Good AI Tasks
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Select all the examples that are GOOD tasks for AI. Remember: good tasks are specific and actionable!
      </p>

      <div className="grid gap-3 mb-6">
        {taskExamples.map((task) => (
          <motion.button
            key={task.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleTask(task.id)}
            disabled={showFeedback}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${showFeedback
                ? task.isGood
                  ? selectedTasks.includes(task.id)
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : selectedTasks.includes(task.id)
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                : selectedTasks.includes(task.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-200">{task.text}</span>
              {showFeedback && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {task.isGood ? (
                    selectedTasks.includes(task.id) ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )
                  ) : (
                    selectedTasks.includes(task.id) ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )
                  )}
                </motion.div>
              )}
            </div>
            {showFeedback && (
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                {task.reason}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      {!showFeedback ? (
        <button
          onClick={checkAnswers}
          disabled={selectedTasks.length === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Check My Answers
        </button>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
            Key Takeaway
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Good AI tasks are <strong>specific</strong> (not vague), 
            <strong> actionable</strong> (AI can actually do them), and 
            <strong> clear</strong> about the desired outcome. Avoid tasks that 
            are too general or require access to real student data.
          </p>
          <button
            onClick={onComplete}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center mx-auto"
          >
            Complete Activity <CheckCircle className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AITaskExamples;