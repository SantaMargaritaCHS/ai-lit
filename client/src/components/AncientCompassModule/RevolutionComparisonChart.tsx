import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Factory, Smartphone, CheckCircle2, ArrowRight, Sparkles, Loader, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';
import { useDevMode } from '@/context/DevModeContext';

interface RevolutionComparisonChartProps {
  onComplete: () => void;
}

const COMPARISONS = [
  {
    id: 1,
    industrial: 'Child labor in factories',
    modern: 'Data privacy violations in youth apps',
  },
  {
    id: 2,
    industrial: 'Unsafe working conditions',
    modern: 'Algorithmic discrimination',
  },
  {
    id: 3,
    industrial: 'Wealth inequality',
    modern: 'Digital divide',
  },
  {
    id: 4,
    industrial: 'Factory owners controlling wages',
    modern: 'Tech companies controlling algorithms',
  },
];

// Color scheme for each match (1-4)
// NOTE: Green is reserved for "correct answer" feedback only!
const getMatchColors = (matchId: number) => {
  const colors = {
    1: { bg: 'bg-blue-100', border: 'border-blue-500', button: 'bg-blue-600 hover:bg-blue-700', text: 'text-white' },
    2: { bg: 'bg-pink-100', border: 'border-pink-500', button: 'bg-pink-600 hover:bg-pink-700', text: 'text-white' },
    3: { bg: 'bg-purple-100', border: 'border-purple-500', button: 'bg-purple-600 hover:bg-purple-700', text: 'text-white' },
    4: { bg: 'bg-orange-100', border: 'border-orange-500', button: 'bg-orange-600 hover:bg-orange-700', text: 'text-white' },
  };
  return colors[matchId as keyof typeof colors] || { bg: 'bg-gray-100', border: 'border-gray-300', button: 'bg-gray-600', text: 'text-white' };
};

export default function RevolutionComparisonChart({ onComplete }: RevolutionComparisonChartProps) {
  const { isDevModeActive } = useDevMode();
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // AI Feedback state for reflection question
  const [reflectionFeedback, setReflectionFeedback] = useState('');
  const [reflectionNeedsRetry, setReflectionNeedsRetry] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);
  const [showReflectionFeedback, setShowReflectionFeedback] = useState(false);

  const MAX_ATTEMPTS = 2;
  const minReflectionLength = 100;

  // Dev mode response generators
  const getDevGoodResponse = () => {
    return "The digital divide to wealth inequality parallel really caught my eye because it shows how history repeats itself with different technology. Just like the Industrial Revolution created a gap between factory owners and workers, the AI Revolution is creating a gap between those who have access to technology and those who don't. What surprised me most is how zip codes and school districts can determine who gets AI education and who doesn't, which mirrors how your birth location determined your opportunities in the 1800s. This shows we need to actively work to prevent AI from deepening existing inequalities rather than assuming technology automatically benefits everyone equally.";
  };

  const getDevGenericResponse = () => {
    return "I think all the parallels are interesting. Technology changes things and we need to be aware of that. The Industrial Revolution had some problems and the AI Revolution has some problems too. We should learn from history so we don't make the same mistakes. It's important to think about these connections.";
  };

  const getDevComplaintResponse = () => {
    return "I don't really understand why we're comparing old factories to modern AI. This seems like a stretch and I'm not sure what the point is. The Industrial Revolution was a long time ago and things are completely different now. I don't see how this helps me understand AI better. This activity feels confusing and unnecessarily complicated.";
  };

  const getDevGibberishResponse = () => {
    return "asdfkj alksjdf laskdjf laksjdf lkajsdhf lkajsdhf lkajsdhf lakjsdhf laksjdhf laksjdhf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf laskdjf qwerty keyboard mashing text";
  };

  const handleDevAutoFill = () => {
    if (!isDevModeActive) return;

    const goodResponse = getDevGoodResponse();
    setReflection(goodResponse);
    setReflectionFeedback("Excellent reflection! Your connection between the digital divide and wealth inequality shows deep engagement with historical patterns.");
    setShowReflectionFeedback(true);
    setReflectionNeedsRetry(false);

    // Auto-complete after brief delay
    setTimeout(() => {
      setCompleted(true);
      onComplete();
    }, 1000);
  };

  // Correct mappings based on logical connections (fixed, not randomized)
  // The modern issues are shuffled in the UI, but the correct answers remain logically consistent
  const correctMappings: Record<number, number> = {
    1: 1, // Child labor → Data privacy violations in youth apps
    2: 2, // Unsafe working conditions → Algorithmic discrimination
    3: 3, // Wealth inequality → Digital divide
    4: 4, // Factory owners controlling wages → Tech companies controlling algorithms
  };

  // Memoize arrays to prevent re-shuffling on every render (fixes flashing bug)
  const industrialIssues = useMemo(() =>
    COMPARISONS.map(c => ({ id: c.id, text: c.industrial }))
  , []);

  const modernIssues = useMemo(() =>
    COMPARISONS.map(c => ({ id: c.id, text: c.modern }))
      .sort(() => Math.random() - 0.5) // Shuffle once on mount
  , []);

  // Single-selection enforcement: remove previous matches when selecting new ones
  const handleMatch = (industrialId: number, modernId: number) => {
    setMatches(prev => {
      const newMatches = { ...prev };

      // If this industrial issue was already matched, clicking the same modern issue unselects it
      if (newMatches[industrialId] === modernId) {
        delete newMatches[industrialId];
        return newMatches;
      }

      // Remove any other industrial issue that was matched to this modern issue
      Object.keys(newMatches).forEach(key => {
        if (newMatches[parseInt(key)] === modernId) {
          delete newMatches[parseInt(key)];
        }
      });

      // Set the new match
      newMatches[industrialId] = modernId;
      return newMatches;
    });

    // Reset submission state when matches change
    setHasSubmitted(false);
  };

  const allMatched = Object.keys(matches).length === COMPARISONS.length;
  const allCorrect = COMPARISONS.every(c => matches[c.id] === correctMappings[c.id]);
  const correctCount = COMPARISONS.filter(c => matches[c.id] === correctMappings[c.id]).length;

  const handleSubmit = () => {
    setHasSubmitted(true);
  };

  const handleSubmitReflection = async () => {
    setIsGeneratingFeedback(true);
    setReflectionNeedsRetry(false);

    try {
      const trimmedReflection = reflection.trim();

      // Generate AI feedback
      const aiFeedback = await generateEducationFeedback(
        trimmedReflection,
        "Which parallel between the Industrial Revolution and AI Revolution surprised you the most, and why? Explain which connection you found most surprising."
      );

      // Ensure feedback is never empty
      const finalFeedback = aiFeedback && aiFeedback.trim().length > 0
        ? aiFeedback
        : "Thank you for reflecting on the parallels between these two technological revolutions. Your understanding of historical patterns helps inform how we approach AI today.";

      setReflectionFeedback(finalFeedback);

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
        setReflectionNeedsRetry(true);
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      } else {
        setReflectionNeedsRetry(false);
      }

      setShowReflectionFeedback(true);

    } catch (error) {
      console.error('[Revolution Comparison] Error generating reflection feedback:', error);
      // On error, accept and proceed
      setReflectionFeedback("Thank you for your thoughtful reflection on the parallels between these revolutions.");
      setReflectionNeedsRetry(false);
      setShowReflectionFeedback(true);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setReflection('');
    setReflectionFeedback('');
    setShowReflectionFeedback(false);
    setReflectionNeedsRetry(false);
    // DON'T reset attemptCount - we need to track total attempts for escape hatch
    // DON'T reset showEscapeHatch - if they've earned it, keep it available
  };

  const handleContinueAnyway = () => {
    console.log('Student bypassed reflection validation after', attemptCount, 'attempts');
    setCompleted(true);
    onComplete();
  };

  const handleProceed = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Factory className="w-6 h-6 text-orange-600" />
            Revolution Comparison Chart
          </CardTitle>
          <p className="text-gray-700 mt-2">
            Match each Industrial Revolution issue with its modern AI equivalent. Click to connect the parallels.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Industrial Revolution Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Factory className="w-5 h-5 text-orange-600" />
                Industrial Revolution (1800s)
              </h3>
              {industrialIssues.map((issue) => {
                const isMatched = matches[issue.id] !== undefined;
                const isCorrect = hasSubmitted && matches[issue.id] === correctMappings[issue.id];
                const matchColors = getMatchColors(issue.id);

                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isMatched
                        ? `${matchColors.border} ${matchColors.bg}`
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        isMatched ? matchColors.button.split(' ')[0] + ' text-white' : 'bg-orange-600 text-white'
                      }`}>
                        {issue.id}
                      </span>
                      <p className="text-gray-900 font-medium flex-1">{issue.text}</p>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modern AI Revolution Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                AI Revolution (Today)
              </h3>
              {modernIssues.map((issue) => {
                const matchedIndustrialId = Object.keys(matches).find(
                  key => matches[parseInt(key)] === issue.id
                );
                const isMatched = matchedIndustrialId !== undefined;
                const isCorrect = hasSubmitted && matchedIndustrialId && correctMappings[parseInt(matchedIndustrialId)] === issue.id;
                const matchColors = matchedIndustrialId ? getMatchColors(parseInt(matchedIndustrialId)) : null;

                return (
                  <div key={issue.id} className="space-y-2">
                    <div
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isMatched && matchColors
                          ? `${matchColors.border} ${matchColors.bg}`
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-gray-900 font-medium flex-1">{issue.text}</p>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      </div>
                    </div>

                    {/* Matching buttons with color coding */}
                    <div className="flex gap-1 flex-wrap">
                      {industrialIssues.map((indIssue) => {
                        const isSelected = matches[indIssue.id] === issue.id;
                        const btnColors = getMatchColors(indIssue.id);
                        return (
                          <button
                            key={indIssue.id}
                            onClick={() => handleMatch(indIssue.id, issue.id)}
                            disabled={hasSubmitted && allCorrect}
                            className={`px-3 py-1 text-xs rounded-md border transition-all ${
                              isSelected
                                ? `${btnColors.button} ${btnColors.text} border-transparent`
                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            Match to #{indIssue.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {hasSubmitted && !allCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-100 p-4 rounded-lg border border-yellow-300"
            >
              <p className="text-sm text-gray-900 font-semibold">
                You have {correctCount} out of {COMPARISONS.length} correct matches.
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Review the green checkmarks to see which are correct. Adjust your incorrect matches and click "Check Again" below.
              </p>
            </motion.div>
          )}

          {/* Check Answers / Check Again Button */}
          {!(hasSubmitted && allCorrect) && (
            <Button
              onClick={handleSubmit}
              disabled={!allMatched}
              size="lg"
              className={`w-full ${
                allMatched
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasSubmitted ? 'Check Again' : 'Check Answers'}
              {!allMatched && ' (select all 4 matches first)'}
            </Button>
          )}

          {hasSubmitted && allCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 p-4 rounded-lg border border-green-300"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-900">
                  Excellent! You've identified the parallels between the Industrial Revolution and the AI Revolution.
                </p>
              </div>
            </motion.div>
          )}

          {/* Reflection */}
          {hasSubmitted && allCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Developer Mode Controls */}
              {isDevModeActive && !showReflectionFeedback && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Reflection Shortcuts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleDevAutoFill}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Fill & Complete
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGoodResponse())}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Good Response
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGenericResponse())}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Generic Response
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevComplaintResponse())}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Complaint
                    </Button>
                    <Button
                      onClick={() => setReflection(getDevGibberishResponse())}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      Fill Gibberish
                    </Button>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Test validation: good, generic, complaint, or gibberish responses</p>
                </div>
              )}

              <h4 className="font-semibold text-gray-900">
                Reflection: Which parallel surprised you the most, and why?
              </h4>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                disabled={showReflectionFeedback && !reflectionNeedsRetry}
                placeholder="Explain which connection you found most surprising and why it challenged or changed your thinking..."
                rows={4}
                className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-600">
                {reflection.length >= minReflectionLength ? '✓ Ready for AI feedback' : `${reflection.length} / ${minReflectionLength} characters minimum`}
              </p>
            </motion.div>
          )}

          {/* Loading state while generating feedback */}
          {isGeneratingFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
            >
              <Loader className="w-5 h-5 animate-spin" />
              <span>Analyzing your reflection with AI...</span>
            </motion.div>
          )}

          {/* AI Feedback Box */}
          {showReflectionFeedback && reflectionFeedback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 rounded-lg p-6 ${
                  reflectionNeedsRetry
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {reflectionNeedsRetry ? (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {reflectionNeedsRetry ? '⚠️ AI Feedback - Please Revise:' : '✓ AI Feedback:'}
                    </h3>
                    <p className="text-gray-900 leading-relaxed">{reflectionFeedback}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Escape Hatch - appears after MAX_ATTEMPTS failed attempts */}
          {showEscapeHatch && reflectionNeedsRetry && (
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
                      You've tried {attemptCount} times and the AI feedback suggests your reflection needs improvement.
                    </p>
                    <p className="text-gray-900 mb-3">
                      <strong className="text-yellow-700">You have two options:</strong>
                    </p>
                    <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                      <li>1. Try again with a different reflection that addresses the question</li>
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
          {hasSubmitted && allCorrect && !(showEscapeHatch && reflectionNeedsRetry) && (
            <Button
              onClick={() => {
                if (showReflectionFeedback && !reflectionNeedsRetry) {
                  handleProceed();
                } else if (showReflectionFeedback && reflectionNeedsRetry) {
                  handleTryAgain();
                } else {
                  handleSubmitReflection();
                }
              }}
              disabled={!showReflectionFeedback && (reflection.trim().length < minReflectionLength || isGeneratingFeedback)}
              size="lg"
              className={`w-full ${
                showReflectionFeedback && !reflectionNeedsRetry
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : showReflectionFeedback && reflectionNeedsRetry
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : reflection.trim().length >= minReflectionLength && !isGeneratingFeedback
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGeneratingFeedback ? (
                'Submit Reflection'
              ) : showReflectionFeedback && !reflectionNeedsRetry ? (
                <>
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              ) : showReflectionFeedback && reflectionNeedsRetry ? (
                'Try Again'
              ) : (
                'Submit Reflection'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
