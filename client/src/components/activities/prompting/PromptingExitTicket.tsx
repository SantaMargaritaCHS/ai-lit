import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PromptingExitTicketProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const PromptingExitTicket: React.FC<PromptingExitTicketProps> = ({ onComplete, isDevMode }) => {
  const [responses, setResponses] = useState<Record<string, string>>({
    application: '',
    formats: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const questions = [
    {
      id: 'application',
      question: 'Describe one specific way you plan to use AI prompting in your classroom or teaching practice.',
      placeholder: 'I plan to use AI to help me create...'
    },
    {
      id: 'formats',
      question: 'What format types (bullet points, dialogue, poem, etc.) are you most excited to try with AI? How might you use them?',
      placeholder: 'I\'m excited to try dialogue format for...'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          🎯 Exit Ticket: Prompting Reflection
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Take a moment to reflect on everything you've learned about AI prompting.
        </p>

        {!submitted ? (
          <form onSubmit={async (e) => {
            e.preventDefault();
            setSubmitted(true);
            
            // Get AI feedback on responses
            setIsLoadingFeedback(true);
            try {
              const response = await fetch('/api/gemini/analyze-exit-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses })
              });
              
              if (response.ok) {
                const feedback = await response.json();
                setAiFeedback(feedback);
              } else {
                // Fallback feedback
                setAiFeedback({
                  overall: "Thank you for your thoughtful responses! Your commitment to using AI in education is inspiring.",
                  applicationFeedback: "Great idea! This shows you're thinking practically about AI integration.",
                  formatsFeedback: "Excellent choice! Experimenting with different formats will make your content more engaging.",
                  encouragement: "You're well-prepared to start using AI prompting in your classroom. Remember, practice makes perfect!"
                });
              }
            } catch (error) {
              console.error('Failed to get AI feedback:', error);
              // Use fallback feedback
              setAiFeedback({
                overall: "Thank you for your thoughtful responses! Your commitment to using AI in education is inspiring.",
                applicationFeedback: "Great idea! This shows you're thinking practically about AI integration.",
                formatsFeedback: "Excellent choice! Experimenting with different formats will make your content more engaging.",
                encouragement: "You're well-prepared to start using AI prompting in your classroom. Remember, practice makes perfect!"
              });
            } finally {
              setIsLoadingFeedback(false);
              setShowFeedback(true);
            }
          }}>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id}>
                  <label className="block mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {index + 1}. {q.question}
                    </span>
                  </label>
                  <textarea
                    value={responses[q.id] || ''}
                    onChange={(e) => setResponses({...responses, [q.id]: e.target.value})}
                    placeholder={q.placeholder}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center mx-auto"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Reflection
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Loading state */}
            {isLoadingFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Analyzing your responses...</p>
              </motion.div>
            )}
            
            {/* AI Feedback */}
            {showFeedback && aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Thank you for your thoughtful reflection!
                  </h3>
                </div>
                
                {/* Overall Feedback */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Feedback</h4>
                      <p className="text-gray-700 dark:text-gray-300">{aiFeedback.overall}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Response-specific feedback */}
                <div className="space-y-3">
                  {aiFeedback.applicationFeedback && (
                    <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">On your classroom application:</p>
                          <p className="text-sm text-green-800 dark:text-green-200">{aiFeedback.applicationFeedback}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {aiFeedback.formatsFeedback && (
                    <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">On format exploration:</p>
                          <p className="text-sm text-purple-800 dark:text-purple-200">{aiFeedback.formatsFeedback}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
                
                {/* Encouragement */}
                {aiFeedback.encouragement && (
                  <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 text-center">
                    <p className="text-orange-800 dark:text-orange-200 font-medium">
                      🌟 {aiFeedback.encouragement}
                    </p>
                  </Card>
                )}
                
                {/* Continue Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={onComplete}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    Continue to Certificate
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptingExitTicket;