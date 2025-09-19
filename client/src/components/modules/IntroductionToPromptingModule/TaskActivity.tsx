import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TaskActivityProps {
  onComplete: () => void;
}

const TaskActivity: React.FC<TaskActivityProps> = ({ onComplete }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const taskOptions = [
    { id: 'create-lesson', text: 'Create a lesson plan', isGood: true, reason: 'Specific and actionable' },
    { id: 'help-me', text: 'Help me', isGood: false, reason: 'Too vague - help with what?' },
    { id: 'explain-concept', text: 'Explain photosynthesis to 5th graders', isGood: true, reason: 'Clear task with target audience' },
    { id: 'do-something', text: 'Do something educational', isGood: false, reason: 'No specific action requested' },
    { id: 'write-email', text: 'Write a parent conference reminder email', isGood: true, reason: 'Specific document type and purpose' },
    { id: 'make-better', text: 'Make it better', isGood: false, reason: 'Unclear what "it" is or how to improve' },
    { id: 'solve-equation', text: 'Solve and explain 2x + 5 = 13', isGood: true, reason: 'Specific problem with clear request' },
    { id: 'math-stuff', text: 'Do math stuff', isGood: false, reason: 'No specific mathematical task' }
  ];

  const taskVerbs = [
    { verb: 'Create', examples: ['a rubric', 'discussion questions', 'a quiz'] },
    { verb: 'Explain', examples: ['a concept', 'step-by-step', 'with examples'] },
    { verb: 'Write', examples: ['an email', 'instructions', 'feedback'] },
    { verb: 'Analyze', examples: ['student work', 'test results', 'a text'] },
    { verb: 'Design', examples: ['an activity', 'a worksheet', 'a project'] },
    { verb: 'Generate', examples: ['ideas', 'examples', 'scenarios'] }
  ];

  const handleTaskToggle = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  const correctSelections = taskOptions.filter(t => t.isGood).map(t => t.id);
  const isAllCorrect = 
    selectedTasks.length === correctSelections.length &&
    selectedTasks.every(id => correctSelections.includes(id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
          {/* Introduction */}
          <Card className="p-6 bg-gradient-to-br from-blue-700 to-cyan-700 text-white border-blue-600">
            <h2 className="text-2xl font-bold mb-3">
              The Task: Your Clear Request
            </h2>
            <p className="text-blue-100 mb-4">
              The Task is WHAT you want the AI to do. Think of it as giving clear instructions to a helpful assistant - 
              be specific about the action you need!
            </p>
            
            {/* Action Verbs Grid */}
            <div className="bg-white/20 rounded-lg p-4 border border-white/30">
              <p className="font-semibold text-white mb-3">Strong Task Verbs:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {taskVerbs.map((item) => (
                  <div key={item.verb} className="text-center">
                    <p className="font-bold text-yellow-300 text-lg">{item.verb}</p>
                    <p className="text-xs text-blue-100">{item.examples.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Multimodal AI Information */}
          <Card className="p-6 bg-yellow-500/10 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              💡 Multimodal AI Tip:
            </h3>
            <p className="text-gray-300 mb-4">
              Modern AI can handle multiple types of tasks! The <strong className="text-white">verb</strong> you use determines the output:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-white font-semibold">Visual Tasks:</p>
                <ul className="space-y-1 text-gray-300 text-sm mt-2">
                  <li>• <strong className="text-yellow-300">Generate</strong> an image of...</li>
                  <li>• <strong className="text-yellow-300">Create</strong> a video showing...</li>
                  <li>• <strong className="text-yellow-300">Draw</strong> a diagram that...</li>
                </ul>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-white font-semibold">Text & Analysis Tasks:</p>
                <ul className="space-y-1 text-gray-300 text-sm mt-2">
                  <li>• <strong className="text-blue-300">Write</strong> code that...</li>
                  <li>• <strong className="text-blue-300">Analyze</strong> this data...</li>
                  <li>• <strong className="text-blue-300">Translate</strong> this text...</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4 bg-black/20 rounded p-2">
              Remember: Clear action verbs = Clear AI outputs!
            </p>
          </Card>

          {/* Practice Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Practice: Identify Good Tasks
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select all the examples that are GOOD tasks for AI. Remember: good tasks are specific and actionable!
            </p>

            <div className="grid gap-3">
              {taskOptions.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedTasks.includes(task.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => !showFeedback && handleTaskToggle(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 dark:text-gray-200">{task.text}</p>
                      <div className="flex items-center">
                        {selectedTasks.includes(task.id) && !showFeedback && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                        {showFeedback && (
                          <>
                            {task.isGood ? (
                              <CheckCircle className={`h-5 w-5 ${
                                selectedTasks.includes(task.id) ? 'text-green-600' : 'text-gray-300'
                              }`} />
                            ) : (
                              <AlertTriangle className={`h-5 w-5 ${
                                selectedTasks.includes(task.id) ? 'text-red-600' : 'text-gray-300'
                              }`} />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {showFeedback && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`text-sm mt-2 ${
                          (task.isGood && selectedTasks.includes(task.id)) || (!task.isGood && !selectedTasks.includes(task.id))
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {task.reason}
                      </motion.p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {!showFeedback && selectedTasks.length > 0 && (
              <Button onClick={checkAnswers} className="w-full mt-4">
                Check My Selections
              </Button>
            )}
          </Card>

          {/* Tips Card */}
          {showFeedback && (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700">
              <div className="flex items-start">
                <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                    Task Writing Tips
                  </h4>
                  <ul className="space-y-2 text-green-800 dark:text-green-200">
                    <li>• Start with a strong action verb (Create, Write, Explain, etc.)</li>
                    <li>• Include specifics about what you need</li>
                    <li>• Mention any important details or constraints</li>
                    <li>• Avoid vague words like "help," "something," or "stuff"</li>
                  </ul>
                  {isAllCorrect && (
                    <p className="text-green-700 dark:text-green-300 font-medium mt-3">
                      🎉 Perfect! You can identify well-written tasks!
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
                Continue to Format
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default TaskActivity;