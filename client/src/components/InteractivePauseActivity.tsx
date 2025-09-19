import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Lightbulb, MessageSquare, CheckCircle, Play } from 'lucide-react';

// Import all activity components
import { ReflectionActivity } from './VideoActivities/ReflectionActivity';
import { QuizActivity } from './VideoActivities/QuizActivity';
import { TransitionActivity } from './VideoActivities/TransitionActivity';
import { ApplicationActivity } from './VideoActivities/ApplicationActivity';

import { VideoActivity, ActivityData } from '@/types/video-activities';

export interface InteractivePause {
  id: string;
  timestamp: number;
  type: 'reflection' | 'question' | 'transition' | 'application';
  title: string;
  content: string;
  options?: string[];
  nextVideoPreview?: {
    title: string;
    description: string;
  };
  activity?: ActivityData;
}

interface InteractivePauseActivityProps {
  pause: InteractivePause;
  onComplete: () => void;
  onReplay?: () => void;
}

export function InteractivePauseActivity({ 
  pause, 
  onComplete,
  onReplay 
}: InteractivePauseActivityProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleComplete = (response?: any) => {
    // Store activity response if needed for analytics
    console.log('Activity completed:', { pauseId: pause.id, response });
    onComplete();
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
    // Auto-advance after 2 seconds for questions
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  // If we have a comprehensive activity, render it
  if (pause.activity) {
    switch (pause.activity.type) {
      case 'reflection':
        return (
          <motion.div
            className="interactive-pause-overlay reflection-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ReflectionActivity activity={pause.activity} onComplete={handleComplete} onReplay={onReplay} />
          </motion.div>
        );
      case 'quiz':
        return (
          <motion.div
            className="interactive-pause-overlay reflection-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizActivity activity={pause.activity} onComplete={handleComplete} />
          </motion.div>
        );
      case 'transition':
        return (
          <motion.div
            className="interactive-pause-overlay reflection-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TransitionActivity activity={pause.activity} onComplete={handleComplete} />
          </motion.div>
        );
      case 'application':
        return (
          <motion.div
            className="interactive-pause-overlay reflection-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ApplicationActivity activity={pause.activity} onComplete={handleComplete} />
          </motion.div>
        );
    }
  }
  
  return (
    <motion.div
      className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl mx-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 border-0 shadow-2xl">
          <div className="p-8">
            {/* Activity Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${
                pause.type === 'reflection' ? 'bg-blue-100 dark:bg-blue-900/30' :
                pause.type === 'question' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-purple-100 dark:bg-purple-900/30'
              }`}>
                {pause.type === 'reflection' && <Brain className="w-8 h-8 text-blue-600" />}
                {pause.type === 'question' && <Lightbulb className="w-8 h-8 text-yellow-600" />}
                {pause.type === 'transition' && <MessageSquare className="w-8 h-8 text-purple-600" />}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pause.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {pause.type === 'reflection' ? 'Take a moment to think' :
                   pause.type === 'question' ? 'Quick knowledge check' :
                   'Transition to next section'}
                </p>
              </div>
            </div>
            
            {/* Activity Content */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {pause.content}
                </p>
              </div>
              
              {/* Question Options */}
              {pause.type === 'question' && pause.options && !showFeedback && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                    Select your answer:
                  </p>
                  {pause.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedOption === option
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedOption === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
              
              {/* Transition Preview */}
              {pause.type === 'transition' && pause.nextVideoPreview && (
                <motion.div 
                  className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Play className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        Coming Next: {pause.nextVideoPreview.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {pause.nextVideoPreview.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Feedback for Questions */}
              {showFeedback && pause.type === 'question' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Great thinking!
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        The video will continue automatically in a moment...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Continue Button */}
              {(pause.type !== 'question' || showFeedback) && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleComplete}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    disabled={pause.type === 'question' && !selectedOption}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {pause.type === 'transition' ? 'Continue to Next Video' : 'Continue Watching'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}