import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Lightbulb, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface BasicPromptDemoProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const BasicPromptDemo: React.FC<BasicPromptDemoProps> = ({ onComplete, isDevMode }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const SAMPLE_TASK = {
    title: "Improve This Email",
    context: "You need help making a parent communication email more friendly and clear.",
    originalEmail: `Dear Parents,
    
Your child must complete the science project by Friday. Late submissions will lose points. The project requires a poster board and printed materials.

Make sure everything is ready on time.

Teacher`,
    goal: "Make this email warmer, clearer, and more supportive while maintaining the important information."
  };

  const analyzePrompt = async () => {
    setIsLoading(true);
    setHasSubmitted(true);

    try {
      const response = await fetch('/api/gemini/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userPrompt,
          context: 'basic-prompting-intro'
        })
      });

      const data = await response.json();
      
      // Parse the feedback
      const feedbackData = {
        score: data.score || 3,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        improvedPrompt: data.improvedPrompt || '',
        explanation: data.explanation || ''
      };

      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      // Fallback feedback
      setFeedback({
        score: 3,
        strengths: ['You attempted to give instructions to the AI'],
        improvements: ['Be more specific about the tone you want', 'Specify the format of the response', 'Add context about your audience'],
        improvedPrompt: 'Help me rewrite this parent email to be warm, encouraging, and supportive. Include a friendly greeting, clear information about the science project deadline (Friday), explain what materials are needed (poster board and printed materials), and offer support. Format it as a professional but friendly email.',
        explanation: 'Good prompts are specific, provide context, and clearly state what you want.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <CheckCircle className="h-5 w-5" />;
    if (score >= 3) return <Lightbulb className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  // Auto-fill for dev mode
  useEffect(() => {
    if (isDevMode) {
      setUserPrompt('Make this email friendlier');
    }
  }, [isDevMode]);

  return (
    <div className="space-y-6">
      {/* Task Introduction */}
      <Card className="p-6 bg-gradient-to-br from-blue-700 to-indigo-700 text-white border-blue-600">
        <h3 className="text-xl font-bold mb-3 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Your First Prompting Challenge
        </h3>
        <p className="text-blue-100 mb-4">{SAMPLE_TASK.context}</p>
        
        {/* Original Email */}
        <div className="bg-white/20 rounded-lg p-4 border border-white/30 mb-4">
          <p className="text-sm font-medium text-blue-100 mb-2">Original Email:</p>
          <pre className="whitespace-pre-wrap text-sm text-white font-mono framework-example">
            {SAMPLE_TASK.originalEmail}
          </pre>
        </div>

        <p className="text-blue-100 font-medium">
          🎯 Goal: {SAMPLE_TASK.goal}
        </p>
      </Card>

      {/* Prompt Input */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white">Write Your Prompt</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          How would you ask AI to help improve this email? Write your instructions below:
        </p>
        
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Example: Help me rewrite this email to..."
          className="min-h-[120px] mb-4"
          disabled={hasSubmitted}
        />

        {!hasSubmitted && (
          <Button
            onClick={analyzePrompt}
            disabled={!userPrompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>Analyzing Your Prompt...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Prompt for Feedback
              </>
            )}
          </Button>
        )}
      </Card>

      {/* AI Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold dark:text-white">Your Prompt Score</h4>
              <div className={`flex items-center space-x-2 ${getScoreColor(feedback.score)}`}>
                {getScoreIcon(feedback.score)}
                <span className="text-2xl font-bold">{feedback.score}/5</span>
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-green-700 dark:text-green-400 mb-2">✅ Strengths:</p>
                <ul className="list-disc list-inside space-y-1">
                  {feedback.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">💡 Areas for Improvement:</p>
                <ul className="list-disc list-inside space-y-1">
                  {feedback.improvements.map((improvement: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improved Version */}
            {feedback.improvedPrompt && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium text-green-800 dark:text-green-400 mb-2">🌟 Improved Prompt Example:</p>
                <p className="text-gray-800 dark:text-gray-200 italic">"{feedback.improvedPrompt}"</p>
              </div>
            )}
          </Card>

          {/* Key Lesson */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
              Key Lesson: The Recipe for Good Prompts
            </h4>
            <p className="text-purple-800 dark:text-purple-200 mb-3">
              Just like a recipe needs the right ingredients, a good prompt needs:
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">1️⃣</span>
                <p className="text-purple-800 dark:text-purple-200"><strong>Clear Goal:</strong> What do you want the AI to do?</p>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">2️⃣</span>
                <p className="text-purple-800 dark:text-purple-200"><strong>Context:</strong> Background information the AI needs</p>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">3️⃣</span>
                <p className="text-purple-800 dark:text-purple-200"><strong>Format:</strong> How should the response be structured?</p>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">4️⃣</span>
                <p className="text-purple-800 dark:text-purple-200"><strong>Keywords:</strong> Specific terms that guide the AI</p>
              </div>
            </div>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={onComplete} size="lg" className="px-8">
              Continue to Learn About Frameworks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BasicPromptDemo;