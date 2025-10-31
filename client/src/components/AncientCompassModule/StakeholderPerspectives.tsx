import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Users, Briefcase, GraduationCap, BookOpen, ChevronRight, CheckCircle2, Sparkles, Loader, AlertCircle, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';
import { useDevMode } from '@/context/DevModeContext';

interface StakeholderPerspectivesProps {
  onComplete: () => void;
}

const STAKEHOLDERS = [
  {
    id: 1,
    name: 'Maya - Gig Worker (Age 32)',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    perspective: '"I deliver food using an app. The algorithm decides which orders I get and rates my performance. Last week my rating dropped because of late deliveries during a snowstorm. Now I get fewer high-paying orders. I have no way to appeal to a human."'
  },
  {
    id: 2,
    name: 'Jordan - Tech CEO (Age 45)',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    perspective: '"I run an AI startup. We\'re trying to balance ethics with competition. If we slow down for ethics reviews, our competitors will beat us to market. Investors expect rapid growth. I believe in doing right, but the system pressures us to move fast."'
  },
  {
    id: 3,
    name: 'Alex - High School Junior (Age 16)',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    perspective: '"I use ChatGPT to help me understand difficult concepts and brainstorm essay ideas. But I\'ve seen classmates copy-paste entire essays. Teachers are cracking down on AI use, but it\'s honestly so helpful when I\'m stuck. Where\'s the line?"'
  },
  {
    id: 4,
    name: 'Ms. Rodriguez - English Teacher (Age 38)',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    perspective: '"I can usually tell when students use AI to write their essays. The voice changes, it sounds too polished. But I\'m not sure how to prove it. I want students to learn, but I also don\'t want to ban a tool that could help them. This is exhausting."'
  }
];

export default function StakeholderPerspectives({ onComplete }: StakeholderPerspectivesProps) {
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');
  const [completed, setCompleted] = useState(false);

  // AI Feedback state
  const [feedback1, setFeedback1] = useState('');
  const [feedback2, setFeedback2] = useState('');
  const [needsRetry1, setNeedsRetry1] = useState(false);
  const [needsRetry2, setNeedsRetry2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  const minChars = 50;
  const MAX_ATTEMPTS = 2;

  const { isDevModeActive } = useDevMode();

  // Dev Mode Response Generators
  const getDevGoodResponse1 = () => {
    return "Alex's perspective surprised me the most because it shows the ethical dilemma from a student's point of view. I hadn't really thought about how AI tools like ChatGPT can be both helpful for learning and problematic for academic integrity. Alex's situation highlights the gray area between using AI as a learning aid versus using it to cheat. This made me realize that blanket bans on AI aren't the answer – we need clearer guidelines about appropriate use. The fact that Alex is aware of classmates copy-pasting entire essays while trying to use the tool responsibly shows that students themselves understand the ethical difference, but need better guidance.";
  };

  const getDevGoodResponse2 = () => {
    return "Balancing these competing needs requires transparency and human oversight at multiple levels. For Maya, gig platforms should provide appeals processes where human reviewers can consider extenuating circumstances like weather delays. For Jordan, industry standards and ethics boards could help level the playing field so companies aren't penalized for prioritizing ethics. For Alex and Ms. Rodriguez, schools need AI literacy programs that teach students when AI use is appropriate (brainstorming, understanding concepts) versus inappropriate (writing entire assignments). Ms. Rodriguez also needs better tools to detect AI writing, like plagiarism checkers adapted for AI. The common thread is that purely algorithmic decisions aren't enough – we need human judgment, clear policies, and systems that allow appeals and context. Rather than banning AI or letting it run unchecked, we need frameworks that preserve human dignity, support learning, and maintain fairness.";
  };

  const getDevGenericResponse1 = () => {
    return "I think all of the perspectives were interesting and made me think about AI ethics. Each person had valid concerns about technology. This activity was very informative and taught me a lot about different viewpoints on AI systems.";
  };

  const getDevGenericResponse2 = () => {
    return "There are many ways to balance these competing needs. Everyone makes good points and we should consider all perspectives. AI systems should try to be fair to everyone involved. More research is needed on this topic.";
  };

  const getDevComplaintResponse1 = () => {
    return "This whole activity is too long and complicated. I don't see why we need to read all these different perspectives. Can we just move on to the next section already?";
  };

  const getDevComplaintResponse2 = () => {
    return "I already said this is too much work. These questions are asking for too much detail and I don't have time for this. Let me continue.";
  };

  const getDevGibberishResponse1 = () => {
    return "asdf asdfasdf asdf asf asdf asfasdfl;aksf ja;klsdfBlah blah blah blah blah blah blah blah";
  };

  const getDevGibberishResponse2 = () => {
    return "asdf asdfasf asf afasf asf asf asf asfasd f asf asf asf as";
  };

  const handleDevAutoFill = () => {
    setReflection1(getDevGoodResponse1());
    setReflection2(getDevGoodResponse2());
    setFeedback1("Excellent analysis! Your identification of Alex's perspective as highlighting the gray area between helpful and harmful AI use shows thoughtful engagement with the ethical complexities.");
    setFeedback2("Outstanding solution! Your emphasis on transparency, human oversight, and clear guidelines demonstrates sophisticated understanding of how to balance competing stakeholder needs.");
    setShowFeedback(true);
    setNeedsRetry1(false);
    setNeedsRetry2(false);
    setTimeout(() => {
      handleComplete();
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsGeneratingFeedback(true);
    setNeedsRetry1(false);
    setNeedsRetry2(false);

    try {
      // Generate AI feedback for both questions in parallel
      const [aiFeedback1, aiFeedback2] = await Promise.all([
        generateEducationFeedback(
          reflection1.trim(),
          "Which stakeholder perspective surprised you the most and why? Explain which viewpoint challenged your thinking and what you learned from it."
        ),
        generateEducationFeedback(
          reflection2.trim(),
          "How would you balance the competing needs of different stakeholders in AI systems (Maya the gig worker, Jordan the CEO, Alex the student, and Ms. Rodriguez the teacher)? Propose a solution that addresses multiple perspectives."
        )
      ]);

      // Ensure feedback is never empty
      const finalFeedback1 = aiFeedback1 && aiFeedback1.trim().length > 0
        ? aiFeedback1
        : "Thank you for sharing which perspective surprised you. Considering different viewpoints is crucial for ethical AI development.";

      const finalFeedback2 = aiFeedback2 && aiFeedback2.trim().length > 0
        ? aiFeedback2
        : "Thank you for proposing a solution that balances different stakeholder needs. This kind of thoughtful consideration is essential for ethical AI.";

      setFeedback1(finalFeedback1);
      setFeedback2(finalFeedback2);

      // Check for rejection phrases in both feedbacks
      const checkRejection = (text: string) =>
        text.toLowerCase().includes('does not address') ||
        text.toLowerCase().includes('please re-read') ||
        text.toLowerCase().includes('inappropriate language') ||
        text.toLowerCase().includes('off-topic') ||
        text.toLowerCase().includes('must elaborate') ||
        text.toLowerCase().includes('insufficient') ||
        text.toLowerCase().includes('needs more depth') ||
        text.toLowerCase().includes('random text') ||
        text.toLowerCase().includes('monitored for inappropriate') ||
        text.toLowerCase().includes('answer the original question');

      const retry1 = checkRejection(aiFeedback1);
      const retry2 = checkRejection(aiFeedback2);

      setNeedsRetry1(retry1);
      setNeedsRetry2(retry2);

      if (retry1 || retry2) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      }

      setShowFeedback(true);

    } catch (error) {
      console.error('[Stakeholder Perspectives] Error:', error);
      setFeedback1("Thank you for sharing which perspective surprised you.");
      setFeedback2("Thank you for proposing a solution to balance stakeholder needs.");
      setNeedsRetry1(false);
      setNeedsRetry2(false);
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
      setIsGeneratingFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setReflection1('');
    setReflection2('');
    setFeedback1('');
    setFeedback2('');
    setShowFeedback(false);
    setNeedsRetry1(false);
    setNeedsRetry2(false);
    // DON'T reset attemptCount - we need to track total attempts for escape hatch
    // DON'T reset showEscapeHatch - if they've earned it, keep it available
  };

  const handleContinueAnyway = () => {
    console.log('Student bypassed validation after', attemptCount, 'attempts');
    onComplete();
  };

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const bothValid = reflection1.length >= minChars && reflection2.length >= minChars;
  const needsRetry = needsRetry1 || needsRetry2;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Stakeholder Perspectives
          </CardTitle>
          <p className="text-gray-700 mt-2">
            AI ethics isn't just about principles—it's about real people with different needs. Read these four perspectives and consider how to balance competing interests.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stakeholder Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {STAKEHOLDERS.map((stakeholder) => {
              const Icon = stakeholder.icon;
              return (
                <div
                  key={stakeholder.id}
                  className={`p-5 rounded-lg border-2 ${stakeholder.borderColor} ${stakeholder.bgColor}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-5 h-5 ${stakeholder.color}`} />
                    <h3 className="font-semibold text-gray-900">{stakeholder.name}</h3>
                  </div>
                  <p className="text-sm text-gray-800 italic leading-relaxed">
                    {stakeholder.perspective}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dev Mode Shortcuts */}
          {isDevModeActive && !showFeedback && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Developer Mode: Stakeholder Reflection Shortcuts
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleDevAutoFill}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 h-auto"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Auto-Fill & Complete
                </Button>
                <Button
                  onClick={() => {
                    setReflection1(getDevGoodResponse1());
                    setReflection2(getDevGoodResponse2());
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 h-auto"
                >
                  Fill Good Responses
                </Button>
                <Button
                  onClick={() => {
                    setReflection1(getDevGenericResponse1());
                    setReflection2(getDevGenericResponse2());
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 h-auto"
                >
                  Fill Generic Responses
                </Button>
                <Button
                  onClick={() => {
                    setReflection1(getDevComplaintResponse1());
                    setReflection2(getDevComplaintResponse2());
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 h-auto"
                >
                  Fill Complaints
                </Button>
                <Button
                  onClick={() => {
                    setReflection1(getDevGibberishResponse1());
                    setReflection2(getDevGibberishResponse2());
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 h-auto"
                >
                  Fill Gibberish
                </Button>
              </div>
              <p className="text-xs text-red-700 mt-2">
                These shortcuts help test different validation scenarios for both reflection questions.
              </p>
            </div>
          )}

          {/* Reflection Questions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mt-8"
          >
            {/* Question 1 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                1. Which perspective surprised you the most and why?
              </h4>
              <Textarea
                value={reflection1}
                onChange={(e) => setReflection1(e.target.value)}
                disabled={showFeedback && !needsRetry}
                placeholder="Explain which viewpoint challenged your thinking and what you learned from it..."
                rows={4}
                className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-600">
                {reflection1.length} characters (minimum {minChars} required)
              </p>

              {/* AI Feedback for Question 1 */}
              {showFeedback && feedback1 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-lg p-4 ${
                      needsRetry1
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {needsRetry1 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="w-full">
                        <h5 className="text-sm font-semibold text-gray-900 mb-1">
                          {needsRetry1 ? 'AI Feedback - Please Revise:' : 'AI Feedback:'}
                        </h5>
                        <p className="text-sm text-gray-900">{feedback1}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                2. How would you balance these competing needs?
              </h4>
              <p className="text-sm text-gray-700 mb-2">
                Consider: Maya needs fair treatment, Jordan faces business pressures, Alex needs learning support, and Ms. Rodriguez needs to ensure academic integrity. How can AI systems serve everyone?
              </p>
              <Textarea
                value={reflection2}
                onChange={(e) => setReflection2(e.target.value)}
                disabled={showFeedback && !needsRetry}
                placeholder="Propose a solution that addresses the needs of different stakeholders..."
                rows={5}
                className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  {reflection2.length} characters (minimum {minChars} required)
                </span>
                {bothValid && !showFeedback && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready for AI feedback
                  </span>
                )}
              </div>

              {/* AI Feedback for Question 2 */}
              {showFeedback && feedback2 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-lg p-4 ${
                      needsRetry2
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {needsRetry2 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="w-full">
                        <h5 className="text-sm font-semibold text-gray-900 mb-1">
                          {needsRetry2 ? 'AI Feedback - Please Revise:' : 'AI Feedback:'}
                        </h5>
                        <p className="text-sm text-gray-900">{feedback2}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Loading state */}
          {isGeneratingFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
            >
              <Loader className="w-5 h-5 animate-spin" />
              <span>Analyzing your responses with AI...</span>
            </motion.div>
          )}

          {/* Escape Hatch */}
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
                      You've tried {attemptCount} times and the AI feedback suggests your responses need improvement.
                    </p>
                    <p className="text-gray-900 mb-3">
                      <strong className="text-yellow-700">You have two options:</strong>
                    </p>
                    <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                      <li>1. Try again with different responses that address the questions</li>
                      <li>2. Continue anyway and move to the next step</li>
                    </ol>
                    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                      <p className="text-gray-900 text-sm">
                        ⚠️ <strong className="text-yellow-700">Important:</strong> If you continue, your responses will be flagged for instructor review. We want to make sure students are engaging thoughtfully with the content.
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
              disabled={!showFeedback && (!bothValid || isSubmitting)}
              size="lg"
              className={`w-full ${
                showFeedback && !needsRetry
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : showFeedback && needsRetry
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : bothValid && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                'Submit Responses'
              ) : showFeedback && !needsRetry ? (
                <>
                  Continue
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              ) : showFeedback && needsRetry ? (
                'Try Again'
              ) : (
                'Submit Responses'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
