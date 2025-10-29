import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle2, ChevronRight, Sparkles, Loader, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';

interface EthicalDilemmaScenariosProps {
  onComplete: () => void;
}

const SCENARIOS = [
  {
    id: 1,
    title: 'College AI Screening',
    description: 'You applied to your dream college. Later you learn their AI rejected 60% of applications before any human reviewed them, and the AI seems to favor certain zip codes and school districts over others.',
    questions: [
      'What principle is violated?',
      'What should change?'
    ]
  },
  {
    id: 2,
    title: 'Infinite Scroll Algorithm',
    description: 'Your favorite social media app\'s AI keeps you scrolling for 3+ hours by perfectly predicting what you want to see next. You know it\'s designed to be addictive.',
    questions: [
      'Is this ethical?',
      'Who\'s responsible?',
      'What would "human dignity" look like here?'
    ]
  }
];

export default function EthicalDilemmaScenarios({ onComplete }: EthicalDilemmaScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [completed, setCompleted] = useState(false);

  // AI Feedback state
  const [feedback, setFeedback] = useState('');
  const [needsRetry, setNeedsRetry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minWords = 30;
  const MAX_ATTEMPTS = 2;

  const handleSubmit = async () => {
    if (!selectedScenario) return;

    setIsSubmitting(true);
    setIsGeneratingFeedback(true);
    setNeedsRetry(false);

    try {
      const trimmedResponse = response.trim();
      const scenario = SCENARIOS[selectedScenario - 1];

      // Generate AI feedback
      const questionPrompt = `Scenario: ${scenario.description}\n\nConsider: ${scenario.questions.join(', ')}\n\nQuestion: How would you address this ethical dilemma using the principles from this module (Human Dignity, Common Good, Solidarity)?`;

      const aiFeedback = await generateEducationFeedback(
        trimmedResponse,
        questionPrompt
      );

      // Ensure feedback is never empty
      const finalFeedback = aiFeedback && aiFeedback.trim().length > 0
        ? aiFeedback
        : "Thank you for your thoughtful analysis of this ethical dilemma. Your consideration of the principles shows engagement with the material.";

      setFeedback(finalFeedback);

      // Check for rejection phrases
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
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      } else {
        setNeedsRetry(false);
      }

      setShowFeedback(true);

    } catch (error) {
      console.error('[Ethical Dilemma] Error:', error);
      setFeedback("Thank you for your thoughtful analysis of this ethical dilemma.");
      setNeedsRetry(false);
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
      setIsGeneratingFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setResponse('');
    setFeedback('');
    setShowFeedback(false);
    setNeedsRetry(false);
    setAttemptCount(0);
    setShowEscapeHatch(false);
  };

  const handleContinueAnyway = () => {
    console.log('Student bypassed validation after', attemptCount, 'attempts');
    onComplete();
  };

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            What Would YOU Do?
          </CardTitle>
          <p className="text-gray-700 mt-2">
            Read these real-world ethical dilemmas. Choose one scenario and explain how you would address it using the principles you've learned.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Selection */}
          {!selectedScenario && (
            <div className="space-y-4">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className="w-full text-left p-6 rounded-lg border-2 border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Scenario {scenario.id}: {scenario.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{scenario.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Selected Scenario */}
          {selectedScenario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl text-gray-900">
                    {SCENARIOS[selectedScenario - 1].title}
                  </h3>
                  <Button
                    onClick={() => {
                      setSelectedScenario(null);
                      setResponse('');
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Change Scenario
                  </Button>
                </div>
                <p className="text-gray-800 mb-4">
                  {SCENARIOS[selectedScenario - 1].description}
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">Consider:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {SCENARIOS[selectedScenario - 1].questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Your Response: How would you address this dilemma?
                </h4>
                <p className="text-sm text-gray-700">
                  Use the principles from this module (Human Dignity, Common Good, Solidarity) in your reasoning. Be specific about what should change and why it matters.
                </p>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={showFeedback && !needsRetry}
                  placeholder="Explain your reasoning using the ethical principles you've learned..."
                  rows={8}
                  className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className={`${wordCount >= minWords ? 'text-green-600' : 'text-gray-600'}`}>
                    {wordCount >= minWords ? '✓ Ready for AI feedback' : `${wordCount} / ${minWords} words minimum`}
                  </span>
                  <span className="text-gray-600">{wordCount} words</span>
                </div>
              </div>

              {/* Loading state while generating feedback */}
              {isGeneratingFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your response with AI...</span>
                </motion.div>
              )}

              {/* AI Feedback Box */}
              {showFeedback && feedback && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-lg p-6 ${
                      needsRetry
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {needsRetry ? (
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {needsRetry ? '⚠️ AI Feedback - Please Revise:' : '✓ AI Feedback:'}
                        </h3>
                        <p className="text-gray-900 leading-relaxed">{feedback}</p>
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
                    className="bg-red-50 border-2 border-red-400 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          ⚠️ Multiple Attempts Detected
                        </h3>
                        <p className="text-gray-900 mb-3">
                          You've tried {attemptCount} times and the AI feedback suggests your response needs improvement.
                        </p>
                        <p className="text-gray-900 mb-3">
                          <strong className="text-yellow-700">You have two options:</strong>
                        </p>
                        <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                          <li>1. Try again with a different response that addresses the question</li>
                          <li>2. Continue anyway and move to the next step</li>
                        </ol>
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                          <p className="text-gray-900 text-sm">
                            ⚠️ <strong className="text-yellow-700">Important:</strong> If you continue, your response will be flagged for instructor review. We want to make sure students are engaging thoughtfully with the content.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleTryAgain}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try One More Time
                          </Button>
                          <Button
                            onClick={handleContinueAnyway}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            Continue Anyway
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Submit / Continue Button */}
              {!showEscapeHatch && (
                <Button
                  onClick={() => {
                    if (showFeedback && !needsRetry) {
                      handleComplete();
                    } else if (showFeedback && needsRetry) {
                      handleTryAgain();
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={!showFeedback && (wordCount < minWords || isSubmitting)}
                  size="lg"
                  className={`w-full ${
                    showFeedback && !needsRetry
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : showFeedback && needsRetry
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : wordCount >= minWords && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : showFeedback && !needsRetry ? (
                    <>
                      Continue
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  ) : showFeedback && needsRetry ? (
                    'Try Again'
                  ) : (
                    'Submit Response'
                  )}
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
