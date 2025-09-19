import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface VaguePromptRaterProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

// Enhanced Vague Prompt Rater Activity
const VaguePromptRater: React.FC<VaguePromptRaterProps> = ({ onComplete, isDevMode }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userRating, setUserRating] = useState<number[]>([50]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userImprovement, setUserImprovement] = useState('');
  const [showImprovement, setShowImprovement] = useState(false);
  const [completedPrompts, setCompletedPrompts] = useState<boolean[]>([false, false, false]);
  const [improvedPrompt, setImprovedPrompt] = useState('');

  const prompts = [
    {
      id: 1,
      prompt: "Help me with science",
      quality: "poor",
      aiRating: 20,
      issues: ["No specific topic", "No clear task", "No format specified"],
      improved: "Act as a 5th grade science teacher and create a 10-minute hands-on experiment about the water cycle using common household materials. Format as step-by-step instructions."
    },
    {
      id: 2,
      prompt: "Write something for my class",
      quality: "poor",
      aiRating: 15,
      issues: ["Unclear what to write", "No context about class", "No specifications"],
      improved: "Act as an elementary school teacher and write a friendly welcome letter for parents at the start of the school year. Include classroom expectations, communication methods, and volunteer opportunities. Format as a one-page letter."
    },
    {
      id: 3,
      prompt: "Act as a curriculum specialist and design a differentiated math lesson on fractions for 4th graders with varying ability levels. Include visual aids, hands-on activities, and assessment strategies. Format as a detailed lesson plan with time allocations.",
      quality: "excellent",
      aiRating: 95,
      issues: [],
      improved: null
    }
  ];

  const currentPrompt = prompts[currentPromptIndex];

  useEffect(() => {
    if (isDevMode) {
      setUserRating([currentPrompt.quality === 'poor' ? 30 : 90]);
      // Don't auto-show feedback in dev mode - let user submit first
    }
  }, [isDevMode, currentPromptIndex]);

  const handleRatePrompt = () => {
    setShowFeedback(true);
    if (userRating[0] < 60 && currentPrompt.quality === 'poor') {
      setShowImprovement(true);
    }
  };

  const handleSubmitImprovement = () => {
    if (!userImprovement.trim()) return;
    
    const newCompleted = [...completedPrompts];
    newCompleted[currentPromptIndex] = true;
    setCompletedPrompts(newCompleted);
    setImprovedPrompt(userImprovement);
  };

  const getAIComment = () => {
    const diff = Math.abs(userRating[0] - currentPrompt.aiRating);
    const userHigher = userRating[0] > currentPrompt.aiRating;
    
    if (diff < 10) {
      return "Great job! We're in complete agreement on this prompt's quality.";
    } else if (diff < 25) {
      return userHigher 
        ? "You're a bit more optimistic than me, but we're close! You might be seeing potential I missed."
        : "You're being a bit harsh! This prompt has some issues, but there might be a few redeeming qualities.";
    } else {
      return userHigher
        ? "Interesting! You rated this much higher than I would. Remember to look for specific role, task, and format elements."
        : "You're being quite critical! That's good - high standards lead to better prompts. Let's see how we can improve it.";
    }
  };

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setUserRating([50]);
      setShowFeedback(false);
      setShowImprovement(false);
      setUserImprovement('');
      setImprovedPrompt('');
    } else if (completedPrompts.every(c => c)) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            📊 Rate the Prompt Quality
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Evaluate each prompt and identify what makes it effective or ineffective
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {prompts.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  completedPrompts[idx] 
                    ? 'bg-green-500' 
                    : idx === currentPromptIndex 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Prompt #{currentPrompt.id}</p>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <p className="text-lg font-mono text-gray-700 dark:text-gray-300">
              "{currentPrompt.prompt}"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              How effective is this prompt? (0-100%)
            </label>
            <div className="space-y-4">
              <div className="relative px-2">
                <div className="w-full py-4">
                  <Slider
                    value={userRating}
                    onValueChange={setUserRating}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {userRating[0]}%
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {userRating[0] < 25 ? 'Needs major improvement' :
                   userRating[0] < 50 ? 'Has potential but unclear' :
                   userRating[0] < 75 ? 'Pretty good, minor tweaks needed' :
                   'Excellent prompt!'}
                </p>
              </div>
            </div>
          </div>

          {!showFeedback && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleRatePrompt}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold shadow-lg transition-all rounded-lg border-0"
                size="lg"
              >
                Submit Rating
              </Button>
            </motion.div>
          )}

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* AI Comment */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">AI Feedback:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{getAIComment()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      My rating: <span className="font-semibold">{currentPrompt.aiRating}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Show issues/strengths */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {currentPrompt.quality === 'poor' ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Issues with this prompt:</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">What makes this prompt effective:</span>
                    </>
                  )}
                </h4>
                {currentPrompt.quality === 'poor' ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {currentPrompt.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-300">{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li className="text-gray-600 dark:text-gray-300">Clear role definition (curriculum specialist)</li>
                    <li className="text-gray-600 dark:text-gray-300">Specific task with details</li>
                    <li className="text-gray-600 dark:text-gray-300">Well-defined format expectations</li>
                    <li className="text-gray-600 dark:text-gray-300">Includes context (4th graders, varying abilities)</li>
                  </ul>
                )}
              </div>

              {/* Improvement opportunity for low-rated prompts */}
              {userRating[0] < 60 && currentPrompt.quality === 'poor' && !improvedPrompt && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                    Try improving this prompt:
                  </h4>
                  <Textarea
                    value={userImprovement}
                    onChange={(e) => setUserImprovement(e.target.value)}
                    placeholder="Write your improved version of the prompt..."
                    className="min-h-[80px] mb-3"
                  />
                  <Button
                    onClick={handleSubmitImprovement}
                    disabled={!userImprovement.trim()}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    Submit Improvement
                  </Button>
                </div>
              )}

              {/* Show AI's improved version or user's improvement */}
              {(improvedPrompt || currentPrompt.improved) && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                    {improvedPrompt ? 'Your improved version:' : 'Improved version using RTF:'}
                  </h4>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mb-3">
                    {improvedPrompt || currentPrompt.improved}
                  </p>
                  {improvedPrompt && currentPrompt.improved && (
                    <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-600">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">AI's suggested version:</p>
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {currentPrompt.improved}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Next button - only show after completing the prompt */}
              {((currentPrompt.quality !== 'poor') || (userRating[0] < 60 && improvedPrompt) || (userRating[0] >= 60) || completedPrompts[currentPromptIndex]) && (
                <Button
                  onClick={() => {
                    const newCompleted = [...completedPrompts];
                    newCompleted[currentPromptIndex] = true;
                    setCompletedPrompts(newCompleted);
                    handleNext();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {currentPromptIndex < prompts.length - 1 ? 'Next Prompt' : 'Complete Activity'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default VaguePromptRater;