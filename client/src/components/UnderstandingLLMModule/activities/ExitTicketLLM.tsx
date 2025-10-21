import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Loader, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';

interface Props {
  onComplete: () => void;
}

export default function ExitTicketLLM({ onComplete }: Props) {
  // Question 1: Scenario (multiple choice)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);

  // Question 2: Reflection (free text)
  const [q2Response, setQ2Response] = useState('');
  const [q2Feedback, setQ2Feedback] = useState('');
  const [q2NeedsRetry, setQ2NeedsRetry] = useState(false);
  const [q2ValidationError, setQ2ValidationError] = useState('');

  // Question 3: Final check (multiple choice)
  const [q3Answer, setQ3Answer] = useState<string | null>(null);

  // UI State
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, or 3
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const minResponseLength = 100;
  const minWords = 15;

  // Question 1 options
  const q1Options = [
    {
      id: 'A',
      text: "The AI didn't understand—it predicted statistically likely words based on patterns",
      isCorrect: true
    },
    {
      id: 'B',
      text: "The AI thought about the question and decided on the best answer",
      isCorrect: false
    },
    {
      id: 'C',
      text: 'The AI is a "helper" that knew what your friend wanted',
      isCorrect: false
    }
  ];

  // Question 3 options
  const q3Options = [
    { id: 'A', text: 'Teammate', isCorrect: false },
    { id: 'B', text: 'Thinking machine', isCorrect: false },
    { id: 'C', text: 'Pattern-matching tool', isCorrect: true },
    { id: 'D', text: 'Magic box', isCorrect: false }
  ];

  // Developer Mode: Auto-fill
  useEffect(() => {
    const handleDevAutoComplete = (event: CustomEvent) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-filling exit ticket');
        setQ1Answer('A');
        setQ2Response("It's important to remember I'm responsible for verifying outputs because LLMs can make mistakes and generate incorrect information. They don't actually understand context or facts—they just predict patterns. I need to verify outputs, fact-check claims, and use my own judgment. The AI is a tool I use, not an authority I blindly trust. This keeps me from over-relying on AI and helps me use it responsibly.");
        setQ3Answer('C');
        setCurrentStep(3);
        setTimeout(() => setShowFinalResults(true), 1000);
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete as EventListener);
  }, []);

  const handleQ1Submit = () => {
    if (q1Answer) {
      setCurrentStep(2);
    }
  };

  const handleQ2Submit = async () => {
    setIsSubmitting(true);
    setIsGeneratingFeedback(true);
    setQ2NeedsRetry(false);
    setQ2ValidationError('');

    try {
      const trimmedResponse = q2Response.trim();
      const wordCount = trimmedResponse.split(/\s+/).filter(w => w.length > 0).length;

      // Layer 1: Pre-filter
      const isInvalid = isNonsensical(trimmedResponse);

      if (isInvalid) {
        setQ2NeedsRetry(true);
        setQ2ValidationError('Please provide a thoughtful response. Keyboard mashing or gibberish is not accepted.');
        setIsSubmitting(false);
        setIsGeneratingFeedback(false);
        return;
      }

      if (trimmedResponse.length < minResponseLength) {
        setQ2NeedsRetry(true);
        setQ2ValidationError(`Please write at least ${minResponseLength} characters (currently ${trimmedResponse.length}).`);
        setIsSubmitting(false);
        setIsGeneratingFeedback(false);
        return;
      }

      if (wordCount < minWords) {
        setQ2NeedsRetry(true);
        setQ2ValidationError(`Please write at least ${minWords} words (currently ${wordCount}).`);
        setIsSubmitting(false);
        setIsGeneratingFeedback(false);
        return;
      }

      // Layer 2: AI validation
      const feedback = await generateEducationFeedback(
        trimmedResponse,
        "Why is it important to remember that YOU're responsible for verifying AI outputs?"
      );

      setQ2Feedback(feedback);

      // Check for strict rejection phrases
      const feedbackIndicatesRetry =
        feedback.toLowerCase().includes('does not address') ||
        feedback.toLowerCase().includes('please re-read') ||
        feedback.toLowerCase().includes('inappropriate language') ||
        feedback.toLowerCase().includes('off-topic') ||
        feedback.toLowerCase().includes('must elaborate') ||
        feedback.toLowerCase().includes('insufficient') ||
        feedback.toLowerCase().includes('monitored for inappropriate') ||
        feedback.toLowerCase().includes('answer the original question');

      if (feedbackIndicatesRetry) {
        setQ2NeedsRetry(true);
        setQ2ValidationError('Your response needs improvement. Please read the AI feedback and try again.');
      } else {
        // Success - move to question 3
        setCurrentStep(3);
      }

    } catch (error) {
      console.error('[Exit Ticket] Error:', error);
      // On error, accept the response and move forward
      setQ2Feedback("Thank you for your thoughtful reflection on responsibility when using AI tools.");
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
      setIsGeneratingFeedback(false);
    }
  };

  const handleQ3Submit = () => {
    if (q3Answer) {
      setShowFinalResults(true);
    }
  };

  // Calculate score
  const q1Correct = q1Options.find(o => o.id === q1Answer)?.isCorrect || false;
  const q2Correct = !q2NeedsRetry && q2Response.length >= minResponseLength;
  const q3Correct = q3Options.find(o => o.id === q3Answer)?.isCorrect || false;
  const totalCorrect = [q1Correct, q2Correct, q3Correct].filter(Boolean).length;

  if (showFinalResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              {totalCorrect === 3 ? 'Perfect Score!' : 'Excellent Work!'}
            </h2>
            <p className="text-white text-lg">
              You've completed the Understanding LLMs module!
            </p>
            <div className="text-5xl font-bold text-yellow-400 mt-4">
              {totalCorrect}/3
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-6 mb-8">
            {/* Q1 Review */}
            <div className={`rounded-lg p-6 border-2 ${q1Correct ? 'bg-green-900/30 border-green-400' : 'bg-yellow-900/30 border-yellow-400'}`}>
              <div className="flex items-start gap-3 mb-3">
                {q1Correct ? <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />}
                <h3 className="text-white font-semibold">Scenario Question</h3>
              </div>
              <p className="text-white text-sm mb-2">
                Your friend says, "I asked the AI for help and it understood my question!"
              </p>
              <p className="text-white">
                <strong>Your answer:</strong> {q1Options.find(o => o.id === q1Answer)?.text}
              </p>
              {!q1Correct && (
                <p className="text-white mt-2">
                  <strong>Remember:</strong> LLMs don't "understand"—they predict patterns!
                </p>
              )}
            </div>

            {/* Q2 Review */}
            <div className="bg-blue-900/30 border-2 border-blue-400 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <h3 className="text-white font-semibold">Your Reflection</h3>
              </div>
              <p className="text-white italic mb-4">"{q2Response}"</p>
              {q2Feedback && (
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white">{q2Feedback}</p>
                </div>
              )}
            </div>

            {/* Q3 Review */}
            <div className={`rounded-lg p-6 border-2 ${q3Correct ? 'bg-green-900/30 border-green-400' : 'bg-yellow-900/30 border-yellow-400'}`}>
              <div className="flex items-start gap-3 mb-3">
                {q3Correct ? <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />}
                <h3 className="text-white font-semibold">Final Check</h3>
              </div>
              <p className="text-white">
                <strong>Your answer:</strong> {q3Options.find(o => o.id === q3Answer)?.text}
              </p>
              {q3Correct && (
                <p className="text-white mt-2">
                  ✓ Exactly! LLMs are pattern-matching tools, not teammates or thinking machines.
                </p>
              )}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">🎯 Key Takeaways</h3>
            <ul className="space-y-2 text-white">
              <li>• LLMs are <strong className="text-yellow-300">predictors</strong>, not thinkers</li>
              <li>• They find <strong className="text-yellow-300">statistical patterns</strong>, not meaning</li>
              <li>• <strong className="text-yellow-300">YOU</strong> are responsible for checking their work</li>
              <li>• They're <strong className="text-yellow-300">tools</strong> you use, not teammates</li>
            </ul>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-all"
          >
            Get Your Certificate <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Exit Ticket
          </h2>
          <p className="text-white">Check your understanding before completing the module</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-12 h-2 rounded-full ${
                step <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Question 1: Scenario */}
        {currentStep === 1 && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Question 1 of 3
                </h3>
                <p className="text-white text-lg">
                  Your friend says, "I asked the AI for help and it <em>understood</em> my question!"
                  What's a more accurate way to describe what happened?
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {q1Options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setQ1Answer(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      q1Answer === option.id
                        ? 'bg-blue-900/40 border-blue-400 text-white'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${q1Answer === option.id ? 'text-yellow-300' : 'text-white/70'}`}>
                        {option.id}.
                      </span>
                      <span>{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleQ1Submit}
                disabled={!q1Answer}
                className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                  q1Answer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-white/50 cursor-not-allowed'
                }`}
              >
                Continue to Question 2
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Question 2: Reflection */}
        {currentStep === 2 && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Question 2 of 3
                </h3>
                <p className="text-white text-lg">
                  Why is it important to remember that <strong>YOU're</strong> responsible
                  for verifying AI outputs, not blindly trusting them?
                </p>
              </div>

              <textarea
                value={q2Response}
                onChange={(e) => setQ2Response(e.target.value)}
                placeholder="Think about responsibility, verification, and critical thinking..."
                className="w-full h-40 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none mb-3"
              />

              <div className="flex justify-between text-sm mb-4">
                <span className={q2Response.length >= minResponseLength ? 'text-green-400' : 'text-white/70'}>
                  {q2Response.length >= minResponseLength ? '✓' : '•'} Minimum {minResponseLength} characters ({minWords} words)
                </span>
                <span className="text-white/70">{q2Response.length}/{minResponseLength}</span>
              </div>

              {q2NeedsRetry && q2ValidationError && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">{q2ValidationError}</p>
                      {q2Feedback && <p className="text-white text-sm mt-2">{q2Feedback}</p>}
                    </div>
                  </div>
                </div>
              )}

              {isGeneratingFeedback && (
                <div className="flex items-center justify-center gap-3 text-blue-300 bg-blue-900/40 rounded-lg p-4 mb-4">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Validating your response...</span>
                </div>
              )}

              <button
                onClick={handleQ2Submit}
                disabled={q2Response.trim().length < minResponseLength || isSubmitting}
                className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                  q2Response.trim().length >= minResponseLength && !isSubmitting
                    ? q2NeedsRetry
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 text-white/50 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Validating...' : q2NeedsRetry ? 'Try Again' : 'Continue to Question 3'}
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Question 3: Final Check */}
        {currentStep === 3 && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-green-900/30 border border-green-400 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Question 3 of 3
                </h3>
                <p className="text-white text-lg">
                  An LLM is a... (Pick the best answer)
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {q3Options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setQ3Answer(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      q3Answer === option.id
                        ? 'bg-green-900/40 border-green-400 text-white'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${q3Answer === option.id ? 'text-yellow-300' : 'text-white/70'}`}>
                        {option.id}.
                      </span>
                      <span>{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleQ3Submit}
                disabled={!q3Answer}
                className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                  q3Answer
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-white/50 cursor-not-allowed'
                }`}
              >
                Submit Exit Ticket
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
