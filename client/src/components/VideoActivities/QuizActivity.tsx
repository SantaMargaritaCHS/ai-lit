import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizActivity as QuizActivityType } from '@/types/video-activities';

interface QuizActivityProps {
  activity: QuizActivityType;
  onComplete: (correct: boolean) => void;
}

export function QuizActivity({ activity, onComplete }: QuizActivityProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Add effect to prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);
  
  const handleSubmit = () => {
    const correctOptions = activity.options.filter(opt => opt.isCorrect);
    const correct = correctOptions.every(opt => selected.includes(opt.id)) &&
      selected.every(id => activity.options.find(opt => opt.id === id)?.isCorrect);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    setTimeout(() => {
      onComplete(correct);
    }, 2500);
  };
  
  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    
    if (activity.allowMultiple) {
      setSelected(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelected([optionId]);
    }
  };
  
  return (
    <div className="reflection-modal-overlay">
      <div className="reflection-modal-content">
        <div className="p-6">
      <div className="activity-header">
        <div className="activity-icon question">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
          <p className="text-sm text-gray-600">Test your understanding</p>
        </div>
      </div>
      
      <div className="activity-content">
        <p className="text-lg mb-6 text-gray-800">{activity.question}</p>
        
        <div className="activity-options">
          {activity.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
              className={`activity-option ${
                selected.includes(option.id) ? 'selected' : ''
              } ${
                showFeedback && option.isCorrect ? '!border-green-500 !bg-green-50' : ''
              } ${
                showFeedback && selected.includes(option.id) && !option.isCorrect ? '!border-red-500 !bg-red-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="option-indicator flex-shrink-0 mt-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selected.includes(option.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selected.includes(option.id) && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </span>
                <span className="text-left flex-1">{option.text}</span>
                {showFeedback && option.isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {showFeedback && selected.includes(option.id) && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {!showFeedback && (
          <Button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="continue-button"
          >
            Check Answer
          </Button>
        )}
        
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="activity-feedback"
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium mb-1 text-gray-900">
                  {isCorrect ? 'Excellent! That\'s correct!' : 'Not quite right, but good try!'}
                </p>
                <p className="text-sm text-gray-700">{activity.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}