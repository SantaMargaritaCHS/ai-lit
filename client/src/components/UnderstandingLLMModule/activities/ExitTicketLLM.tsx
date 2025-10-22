import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Loader, AlertCircle, CheckCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';

interface Props {
  onComplete: () => void;
}

export default function ExitTicketLLM({ onComplete }: Props) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [needsRetry, setNeedsRetry] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const minResponseLength = 100;
  const minWords = 15;

  // Developer Mode: Auto-fill
  useEffect(() => {
    const handleDevAutoComplete = (event: CustomEvent) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-filling exit ticket');
        setResponse("Understanding how LLMs work helps me use them more effectively. I know they predict based on patterns, not actual understanding, so I always verify their outputs. I'm aware of training data limitations and biases. Most importantly, I see them as tools to enhance my thinking, not replacements for my critical judgment. This knowledge empowers me to use AI responsibly and make better decisions about when to rely on it versus when to trust my own expertise.");
        setTimeout(() => {
          setShowSuccess(true);
          setTimeout(() => onComplete(), 2000);
        }, 1000);
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
  }, [onComplete]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsGeneratingFeedback(true);
    setNeedsRetry(false);
    setValidationError('');

    try {
      const trimmedResponse = response.trim();

      // ALWAYS generate AI feedback - the AI handles validation internally
      // This ensures students ALWAYS receive educational feedback
      const aiFeedback = await generateEducationFeedback(
        trimmedResponse,
        "How does understanding how LLMs work inform how you will use them as tools? Include a specific example in your response."
      );

      // Ensure feedback is never empty
      const finalFeedback = aiFeedback && aiFeedback.trim().length > 0
        ? aiFeedback
        : "Thank you for your thoughtful reflection on using LLMs as tools. Your understanding of how LLMs work through pattern matching and statistical predictions will help you use them more effectively and critically.";

      setFeedback(finalFeedback);

      // Check for strict rejection phrases (including pre-filter feedback)
      const feedbackIndicatesRetry =
        aiFeedback.toLowerCase().includes('does not address') ||
        aiFeedback.toLowerCase().includes('please re-read') ||
        aiFeedback.toLowerCase().includes('inappropriate language') ||
        aiFeedback.toLowerCase().includes('off-topic') ||
        aiFeedback.toLowerCase().includes('must elaborate') ||
        aiFeedback.toLowerCase().includes('insufficient') ||
        aiFeedback.toLowerCase().includes('needs more depth') ||
        aiFeedback.toLowerCase().includes('random text') ||
        aiFeedback.toLowerCase().includes('monitored for inappropriate') ||
        aiFeedback.toLowerCase().includes('answer the original question');

      if (feedbackIndicatesRetry) {
        setNeedsRetry(true);
        setValidationError('Your response needs improvement. Please read the AI feedback and try again.');
      } else {
        // Success - show feedback and complete
        setShowSuccess(true);
      }

    } catch (error) {
      console.error('[Exit Ticket] Error:', error);
      // On error, accept the response and move forward
      setFeedback("Thank you for your thoughtful reflection on using LLMs as tools.");
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <MessageSquare className="h-16 w-16 text-purple-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Exit Ticket
            </h1>
            <p className="text-white/70 text-lg">
              Check your understanding before completing the module
            </p>
          </div>

          {!showSuccess ? (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Reflection Question
                  </h3>
                  <p className="text-white text-lg">
                    How does understanding how LLMs work inform how you will use them as tools? <strong className="text-yellow-300">Include a specific example in your response.</strong>
                  </p>
                </div>

                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Think about prediction, training data, your role in checking outputs, and using AI as a tool (not a teammate). Be sure to include a specific example of how you'll apply this knowledge..."
                  className="w-full h-48 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none mb-3"
                />

                <div className="flex justify-between text-sm mb-4">
                  <span className={response.length >= minResponseLength ? 'text-green-400' : 'text-white/70'}>
                    {response.length >= minResponseLength ? '✓ Ready for AI feedback' : `• Minimum ${minResponseLength} characters to submit`}
                  </span>
                  <span className="text-white/70">{response.length}/{minResponseLength}</span>
                </div>

                {needsRetry && validationError && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">{validationError}</p>
                        {feedback && <p className="text-white text-sm mt-2">{feedback}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {isGeneratingFeedback && (
                  <div className="flex items-center justify-center gap-3 text-blue-300 bg-blue-900/40 rounded-lg p-4 mb-4">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing your response with AI...</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={response.trim().length < minResponseLength || isSubmitting}
                  className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                    response.trim().length >= minResponseLength && !isSubmitting
                      ? needsRetry
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-700 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Validating...' : needsRetry ? 'Try Again' : 'Submit Reflection'}
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <CheckCircle className="h-20 w-20 text-green-400 mx-auto" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Reflection Complete!
                </h2>

                <div className="bg-green-900/30 border border-green-400 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-white mb-2">AI Feedback:</h3>
                      <p className="text-white text-left mb-3">{feedback || "Thank you for your thoughtful reflection."}</p>

                      {/* Collapsible section to show what they wrote */}
                      <details className="mt-3">
                        <summary className="text-white/70 text-sm cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2">
                          <ChevronDown className="w-4 h-4 inline" />
                          <span>View your response</span>
                        </summary>
                        <div className="mt-3 bg-gray-800/50 rounded-lg p-4 border border-white/10">
                          <p className="text-white/90 text-sm italic leading-relaxed">
                            "{response}"
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>

                <p className="text-white/80 text-lg mb-8">
                  You've completed the Understanding LLMs module!
                </p>

                <button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all inline-flex items-center gap-2"
                >
                  Get Your Certificate
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
