import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Loader, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitTicketQuestion {
  id: string;
  text: string;
  placeholder?: string;
}

interface ExitTicketProps {
  activityTitle: string;
  questions: ExitTicketQuestion[];
  onComplete: () => void;
}

export function ExitTicket({ activityTitle, questions, onComplete }: ExitTicketProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize answers object
    const initialAnswers: Record<string, string> = {};
    questions.forEach(q => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
  }, [questions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => answers[q.id]?.trim().length > 0);
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get AI feedback for each answer
      const feedbackPromises = questions.map(async (question) => {
        const response = await fetch('/api/ai-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityType: 'exit-ticket',
            activityTitle,
            question: question.text,
            answer: answers[question.id]
          })
        });

        if (!response.ok) {
          console.error('Failed to get feedback:', response.status);
          throw new Error('Failed to get feedback');
        }
        
        const data = await response.json();
        console.log('AI Feedback response:', data); // Debug log
        return { questionId: question.id, feedback: data.feedback };
      });

      const feedbackResults = await Promise.all(feedbackPromises);
      
      const newFeedback: Record<string, string> = {};
      feedbackResults.forEach(result => {
        newFeedback[result.questionId] = result.feedback;
      });
      
      setFeedback(newFeedback);
      setSubmitted(true);
    } catch (err) {
      console.error('Error getting AI feedback:', err);
      setError('Unable to get AI feedback. Please check your connection and try again.');
      // Don't mark as submitted if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-2 border-gray-600 bg-gray-800/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            Exit Ticket
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Please answer these reflection questions before completing the module.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <label className="text-white font-medium">
                {index + 1}. {question.text}
              </label>
              
              <Textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder || 'Type your answer here...'}
                className="exit-ticket-textarea min-h-[100px] !bg-gray-900 !text-white !border-gray-500 focus:!border-green-500 focus:ring-1 focus:ring-green-500 placeholder:!text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                style={{
                  backgroundColor: 'rgb(17, 24, 39)',
                  color: 'rgb(255, 255, 255)',
                  border: '2px solid rgb(107, 114, 128)',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  padding: '12px'
                }}
                disabled={submitted}
              />
              
              <AnimatePresence>
                {submitted && feedback[question.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                  >
                    <p className="text-green-200 text-sm leading-relaxed">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      {feedback[question.id]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-200 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {error}
              </p>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered() || isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Answers
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-green-200 text-center">
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Great job! Your reflections have been submitted.
                  </p>
                </div>
                
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Continue to Certificate
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}