import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { darkTheme } from '../styles/darkTheme';
import { generateEducationFeedback, getEducationFallback } from '../../../utils/aiEducationFeedback';

interface Props {
  onComplete: () => void;
}

const exitQuestions = [
  {
    id: 'practical-application',
    question: "Now that you understand how LLMs work (pattern matching, not true understanding), how will this knowledge help you interact with AI tools more effectively?",
    minLength: 30,
    placeholder: "Think about how knowing the limitations and capabilities changes your approach...",
    focusArea: "Understanding AI mechanics"
  },
  {
    id: 'classroom-integration', 
    question: "Based on what you learned about tokenization and context windows, what's one specific way you could use this knowledge when teaching students about AI?",
    minLength: 30,
    placeholder: "Consider how you might explain AI limitations or help students write better prompts...",
    focusArea: "Classroom application"
  }
];

export default function ExitTicket({ onComplete }: Props) {
  const [responses, setResponses] = useState<string[]>(['', '']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const canProceed = responses[currentQuestion].trim().length >= exitQuestions[currentQuestion].minLength;

  const handleNext = async () => {
    if (currentQuestion < exitQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate feedback for all responses
      await generateAllFeedback();
    }
  };

  const generateAllFeedback = async () => {
    setIsGenerating(true);
    
    try {
      const feedbackPromises = responses.map((response, index) => 
        generateEducationFeedback(response, exitQuestions[index].question)
      );
      
      const feedback = await Promise.all(feedbackPromises);
      setAiFeedback(feedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Use fallback feedback
      setAiFeedback([getEducationFallback(), getEducationFallback()]);
      setShowFeedback(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className={`${darkTheme.bgPrimary} rounded-xl shadow-xl p-8`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${darkTheme.textPrimary} mb-2`}>
              Exit Reflection: Applying Your Knowledge
            </h2>
            <div className="flex gap-2 mb-4">
              {exitQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= currentQuestion ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className={`${darkTheme.cardHighlight} p-4`}>
                <p className={`text-blue-200 text-sm flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  {exitQuestions[currentQuestion].focusArea}
                </p>
              </div>

              <div>
                <label className={`${darkTheme.textPrimary} font-medium text-lg`}>
                  {exitQuestions[currentQuestion].question}
                </label>
                <textarea
                  value={responses[currentQuestion]}
                  onChange={(e) => {
                    const newResponses = [...responses];
                    newResponses[currentQuestion] = e.target.value;
                    setResponses(newResponses);
                  }}
                  className={`w-full h-32 px-4 py-3 mt-3 ${darkTheme.input} rounded-lg resize-none`}
                  placeholder={exitQuestions[currentQuestion].placeholder}
                  autoFocus
                />
                <div className={`text-sm ${darkTheme.textMuted} mt-2`}>
                  {responses[currentQuestion].length}/{exitQuestions[currentQuestion].minLength} characters minimum
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!canProceed || isGenerating}
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                  ${canProceed 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Generating Feedback...
                  </>
                ) : currentQuestion < exitQuestions.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Submit Reflections <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Show feedback view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6"
    >
      <div className={`${darkTheme.bgPrimary} rounded-xl shadow-xl p-8`}>
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${darkTheme.textPrimary}`}>
            Excellent Reflections!
          </h2>
          <p className={darkTheme.textSecondary}>
            Your AI literacy journey continues to grow
          </p>
        </div>

        <div className="space-y-6">
          {exitQuestions.map((question, index) => (
            <div key={question.id} className={`${darkTheme.card} p-6`}>
              <p className={`${darkTheme.textAccent} font-medium mb-2`}>
                {question.question}
              </p>
              <p className={`${darkTheme.textSecondary} italic mb-3`}>
                "{responses[index]}"
              </p>
              
              <div className={`${darkTheme.cardHighlight} p-4`}>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className={darkTheme.textPrimary}>{aiFeedback[index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all"
        >
          Continue to Certificate
        </button>
      </div>
    </motion.div>
  );
}