import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

interface Question {
  question: string;
  options: Option[];
}

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  segmentNumber?: number;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswer,
  segmentNumber
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [hasAnswered, setHasAnswered] = React.useState(false);
  
  const handleOptionClick = (option: Option) => {
    if (hasAnswered) return;
    
    setSelectedOption(option.id);
    setShowFeedback(true);
    setHasAnswered(true);
    
    onAnswer(option.correct);
  };

  const selectedOptionData = question.options.find(opt => opt.id === selectedOption);
  const correctOption = question.options.find(opt => opt.correct);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          {segmentNumber && (
            <p className="text-sm text-gray-500 mb-2">
              Comprehension Check {segmentNumber} of 4
            </p>
          )}
          <CardTitle className="text-lg sm:text-xl leading-normal break-words">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option) => (
              <Button
                key={option.id}
                variant={
                  selectedOption === option.id
                    ? option.correct
                      ? 'default'
                      : 'destructive'
                    : 'outline'
                }
                className={`
                  w-full text-left justify-start p-3 h-auto text-sm
                  ${!hasAnswered ? 'hover:bg-gray-50' : ''}
                  ${selectedOption === option.id ? 'ring-2 ring-offset-2' : ''}
                  ${hasAnswered && option.correct && selectedOption !== option.id ? 'border-green-500 border-2' : ''}
                `}
                onClick={() => handleOptionClick(option)}
                disabled={hasAnswered}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="font-semibold text-base flex-shrink-0">
                    {option.id.toUpperCase()}.
                  </span>
                  <span className="text-left break-words flex-1">
                    {option.text}
                  </span>
                  {hasAnswered && (
                    <span className="flex-shrink-0 ml-2">
                      {option.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : selectedOption === option.id ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : null}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {showFeedback && selectedOptionData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {selectedOptionData.correct ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800 mb-1">Correct!</p>
                        <p className="text-green-700 text-sm">{selectedOptionData.feedback}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 mb-1">Not quite right</p>
                        <p className="text-red-700 text-sm mb-2">{selectedOptionData.feedback}</p>
                        
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Correct answer:</span>{' '}
                            <span className="font-semibold">{correctOption?.id.toUpperCase()}.</span>{' '}
                            {correctOption?.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-3">
                  Moving to next section in a moment...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};