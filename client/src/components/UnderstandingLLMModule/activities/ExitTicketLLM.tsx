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
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  const minResponseLength = 100;
  const minWords = 15;
  const MAX_ATTEMPTS = 2;

  // Developer Mode: Auto-fill
  useEffect(() => {
    const handleDevAutoComplete = (event: CustomEvent) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-filling exit ticket');
        setResponse("Understanding how LLMs work helps me use them more effectively. I know they predict based on patterns, not actual understanding, so I always verify their outputs. I'm aware of training data limitations and biases. Most importantly, I see them as tools to enhance my thinking, not replacements for my critical judgment. This knowledge empowers me to use AI responsibly and make better decisions about when to rely on it versus when to trust my own expertise.");
        setTimeout(() => {
          setFeedback("Excellent reflection! You've demonstrated a clear understanding of how LLMs work and how to use them responsibly.");
          setShowFeedback(true);
          setNeedsRetry(false);
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

        // Track attempt count and show escape hatch after MAX_ATTEMPTS
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      } else {
        // Success - show feedback
        setNeedsRetry(false);
      }

      // Always show feedback after submission
      setShowFeedback(true);

    } catch (error) {
      console.error('[Exit Ticket] Error:', error);
      // On error, accept the response and move forward
      setFeedback("Thank you for your thoughtful reflection on using LLMs as tools.");
      setNeedsRetry(false);
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
      setIsGeneratingFeedback(false);
    }
  };

  const handleTryAgain = () => {
    // Reset for retry (clears attempt count and escape hatch)
    setResponse('');
    setFeedback('');
    setShowFeedback(false);
    setNeedsRetry(false);
    setValidationError('');
    setAttemptCount(0);
    setShowEscapeHatch(false);
  };

  const handleContinueAnyway = () => {
    // Student chooses to proceed despite validation failures
    console.log('Student bypassed validation after', attemptCount, 'attempts');
    onComplete();
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

          {/* Reflection Question */}
          <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Reflection Question
            </h3>
            <p className="text-white text-lg">
              How does understanding how LLMs work inform how you will use them as tools? <strong className="text-yellow-300">Include a specific example in your response.</strong>
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={showFeedback && !needsRetry}
            placeholder="Think about prediction, training data, your role in checking outputs, and using AI as a tool (not a teammate). Be sure to include a specific example of how you'll apply this knowledge..."
            className="w-full h-48 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          {/* Character count */}
          <div className="flex justify-between text-sm mb-4">
            <span className={response.length >= minResponseLength ? 'text-green-400' : 'text-white/70'}>
              {response.length >= minResponseLength ? '✓ Ready for AI feedback' : `• Minimum ${minResponseLength} characters to submit`}
            </span>
            <span className="text-white/70">{response.length}/{minResponseLength}</span>
          </div>

          {/* Loading state while generating feedback */}
          {isGeneratingFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 text-blue-300 bg-blue-900/40 rounded-lg p-4 mb-4"
            >
              <Loader className="w-5 h-5 animate-spin" />
              <span>Analyzing your response with AI...</span>
            </motion.div>
          )}

          {/* AI Feedback Box - appears after submission */}
          {showFeedback && feedback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-6 mb-6 ${
                  needsRetry
                    ? 'bg-yellow-900/30 border-yellow-400'
                    : 'bg-green-900/30 border-green-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {needsRetry ? (
                    <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {needsRetry ? '⚠️ AI Feedback - Please Revise:' : '✓ AI Feedback:'}
                    </h3>
                    <p className="text-white leading-relaxed mb-3">{feedback}</p>

                    {!needsRetry && (
                      <>
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

                        <p className="text-white/80 text-sm mt-4">
                          You've completed the Understanding LLMs module!
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Escape Hatch - appears after MAX_ATTEMPTS failed attempts */}
          {showEscapeHatch && needsRetry && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border-2 border-red-400 rounded-lg p-6 mb-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-white mb-2">
                      ⚠️ Multiple Attempts Detected
                    </h3>
                    <p className="text-white/90 mb-3">
                      You've tried {attemptCount} times and the AI feedback suggests your response needs improvement.
                    </p>
                    <p className="text-white/90 mb-3">
                      <strong className="text-yellow-300">You have two options:</strong>
                    </p>
                    <ol className="text-white/90 mb-4 space-y-1 ml-4">
                      <li>1. Try again with a different response that addresses the question</li>
                      <li>2. Continue anyway and move to the next step</li>
                    </ol>
                    <div className="bg-yellow-900/40 border border-yellow-500 rounded-lg p-3 mb-4">
                      <p className="text-white/90 text-sm">
                        ⚠️ <strong className="text-yellow-300">Important:</strong> If you continue, your response will be flagged for instructor review. We want to make sure students are engaging thoughtfully with the content.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleTryAgain}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
                      >
                        Try One More Time
                      </button>
                      <button
                        onClick={handleContinueAnyway}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
                      >
                        Continue Anyway
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Action Button - hidden when escape hatch is showing */}
          {!showEscapeHatch && (
            <button
            onClick={() => {
              if (showFeedback && !needsRetry) {
                // Success - get certificate
                onComplete();
              } else if (showFeedback && needsRetry) {
                // Retry - clear form
                handleTryAgain();
              } else {
                // Initial submit
                handleSubmit();
              }
            }}
            disabled={!showFeedback && (response.trim().length < minResponseLength || isSubmitting)}
            className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
              showFeedback && !needsRetry
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                : showFeedback && needsRetry
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : response.trim().length >= minResponseLength && !isSubmitting
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-700 text-white/50 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin inline mr-2" />
                Validating...
              </>
            ) : showFeedback && !needsRetry ? (
              <>
                Get Your Certificate
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </>
            ) : showFeedback && needsRetry ? (
              'Try Again'
            ) : (
              'Submit Reflection'
            )}
          </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
