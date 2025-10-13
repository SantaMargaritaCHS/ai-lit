import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Loader2, Zap } from 'lucide-react';
import { useDevMode } from '@/context/DevModeContext';
import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';
import './WhatIsAIModule.css';

interface VideoReflectionActivityProps {
  question: string;
  videoSegmentId: string;
  onComplete: () => void;
}

export default function VideoReflectionActivity({
  question,
  videoSegmentId,
  onComplete
}: VideoReflectionActivityProps) {
  const { isDevModeActive } = useDevMode();
  const [response, setResponse] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);


  // Developer mode auto-fill responses based on video segment
  const getDevResponse = () => {
    if (videoSegmentId === 'segment-2') {
      return "It's important to remember that AI is a tool because it helps us understand its limitations. AI doesn't have feelings, consciousness, or true understanding - it's just processing data and finding patterns. If we think of AI as conscious, we might trust it too much or expect it to make moral decisions it's not capable of making.";
    } else if (videoSegmentId === 'segment-3') {
      return "I predict AI will bring significant changes to how we do research and homework. Instead of just searching for information, AI assistants might help us understand complex topics by breaking them down into simpler explanations. However, we'll need to learn how to verify AI-generated information and use it responsibly, not just copy answers but use it as a learning tool.";
    }
    return "This is a developer mode auto-generated response for testing purposes.";
  };

  const handleDevSkip = () => {
    const devResponse = getDevResponse();
    setResponse(devResponse);
    setAiFeedback("Excellent reflection! Your thoughtful response shows a deep understanding of AI's role and impact. Keep thinking critically about these important topics.");
    setShowFeedback(true);
    // Auto-complete after showing feedback
    setTimeout(() => onComplete(), 1000);
  };

  const handleSubmit = async () => {
    if (!showFeedback) {
      // Check if response is nonsensical BEFORE calling AI
      const isInvalid = isNonsensical(response);

      // Get AI feedback
      setIsLoadingFeedback(true);
      try {
        const feedback = await generateEducationFeedback(response, question);
        setAiFeedback(feedback);
        setShowFeedback(true);
        setIsLoadingFeedback(false);

        // Determine if retry is needed based on:
        // 1. Pre-validation (gibberish/too short)
        // 2. Gemini's feedback indicating the response is inadequate (strict rejection only)
        const feedbackIndicatesRetry =
          feedback.toLowerCase().includes('does not address') ||
          feedback.toLowerCase().includes('please re-read') ||
          feedback.toLowerCase().includes('inappropriate language') ||
          feedback.toLowerCase().includes('off-topic') ||
          feedback.toLowerCase().includes('must elaborate') ||
          feedback.toLowerCase().includes('insufficient') ||
          feedback.toLowerCase().includes('answer the original question');

        // Require retry if EITHER pre-validation failed OR Gemini says response is inadequate
        setNeedsRetry(isInvalid || feedbackIndicatesRetry);
      } catch (error) {
        console.error('Failed to get AI feedback:', error);
        setAiFeedback('Thank you for your thoughtful reflection! Your insights about AI are valuable as you continue learning.');
        setShowFeedback(true);
        setIsLoadingFeedback(false);
        setNeedsRetry(false);
      }
    } else {
      // Continue to next activity
      onComplete();
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setAiFeedback('');
    setNeedsRetry(false);
    // Keep the response so they can edit it
  };

  const minResponseLength = 100;
  const isResponseValid = response.trim().length >= minResponseLength;

  return (
    <div className="activity-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >

        {/* Developer Mode Controls */}
        {isDevModeActive && !showFeedback && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Reflection Shortcuts</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleDevSkip}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto-Fill & Complete
            </Button>
            <Button
              onClick={() => {
                const devResponse = getDevResponse();
                setResponse(devResponse);
              }}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              Fill Response Only
            </Button>
          </div>
          <p className="text-xs text-red-600 mt-1">Pre-fills appropriate response for this reflection</p>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-b-2 border-blue-300">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            Pause & Reflect
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Take a moment to think deeply about what you just learned</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-lg text-gray-800">{question}</p>
          </div>

          {!showFeedback && (
            <>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts and insights... Be specific and thoughtful."
                className="w-full min-h-[150px] text-base"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {response.length} characters
                  {minResponseLength && ` (suggested minimum: ${minResponseLength})`}
                </div>
                {isResponseValid && (
                  <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Ready to submit
                  </div>
                )}
              </div>
            </>
          )}

          {/* Display AI Feedback */}
          {showFeedback && aiFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border-2 rounded-lg p-6 ${
                needsRetry
                  ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700'
                  : 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300 dark:border-purple-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 flex-shrink-0 ${
                  needsRetry
                    ? 'bg-blue-200 dark:bg-blue-800'
                    : 'bg-purple-200 dark:bg-purple-800'
                }`}>
                  <Sparkles className={`w-5 h-5 ${
                    needsRetry
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-purple-700 dark:text-purple-300'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-3 ${
                    needsRetry
                      ? 'text-blue-900 dark:text-blue-100'
                      : 'text-purple-900 dark:text-purple-100'
                  }`}>
                    AI Feedback
                  </h4>
                  <p className={`leading-relaxed ${
                    needsRetry
                      ? 'text-blue-900 dark:text-blue-200'
                      : 'text-purple-900 dark:text-purple-200'
                  }`}>
                    {aiFeedback}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Show appropriate buttons based on state */}
          {needsRetry ? (
            <Button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Try Again
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoadingFeedback}
              className="w-full"
              size="lg"
            >
              {isLoadingFeedback ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting AI Feedback...
                </>
              ) : showFeedback ? (
                'Continue Learning'
              ) : (
                'Submit Reflection'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
