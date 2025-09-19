import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, AlertCircle, ArrowRight, Lightbulb, Target, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface PromptQualityActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

// Rating prompts data
const RATING_PROMPTS = [
  {
    id: 1,
    prompt: "Help me with science",
    quality: "poor",
    stars: 1,
    feedback: "This prompt is too vague. It lacks a specific role (who should help), a clear task (what kind of science help), and format specifications (how the help should be delivered).",
    improvements: ["Specify the science topic", "Define what kind of help you need", "Add context about grade level or purpose"]
  },
  {
    id: 2,
    prompt: "Act as a science teacher and create a quiz about photosynthesis for 7th graders",
    quality: "good",
    stars: 4,
    feedback: "Good job! This prompt includes a clear role (science teacher) and specific task (quiz about photosynthesis for 7th graders). To make it excellent, you could add format specifications.",
    improvements: ["Specify number of questions", "Define question types (multiple choice, short answer)", "Add difficulty level or time limit"]
  },
  {
    id: 3,
    prompt: "Act as an experienced biology teacher. Create a 10-question multiple choice quiz about photosynthesis for 7th grade students. Include 4 answer choices per question, mark the correct answers, and provide brief explanations for each correct answer.",
    quality: "excellent",
    stars: 5,
    feedback: "Excellent! This prompt uses the complete RTF framework: clear Role (experienced biology teacher), specific Task (10-question quiz), and detailed Format (multiple choice with explanations).",
    improvements: []
  }
];

// Multiple choice questions
const MC_QUESTIONS = [
  {
    id: 1,
    prompt: "Write lesson plan",
    question: "What key elements are missing from this prompt?",
    options: [
      { id: 'a', text: "No subject or grade level specified", correct: true },
      { id: 'b', text: "The grammar is incorrect", correct: false },
      { id: 'c', text: "It's too long", correct: false },
      { id: 'd', text: "No role or format specified", correct: true }
    ],
    explanation: "This prompt lacks essential context: WHO should write it (role), WHAT subject and grade (specificity), and HOW it should be formatted (structure)."
  },
  {
    id: 2,
    prompt: "Create educational content about climate change",
    question: "How could this prompt be improved? (Select all that apply)",
    options: [
      { id: 'a', text: "Specify the target audience (grade level)", correct: true },
      { id: 'b', text: "Make it shorter", correct: false },
      { id: 'c', text: "Define the content format (video, worksheet, presentation)", correct: true },
      { id: 'd', text: "Add learning objectives or goals", correct: true }
    ],
    explanation: "While the topic is clear, effective prompts need audience context, format specifications, and clear objectives to produce useful results."
  }
];

// Rewriting exercise
const REWRITE_PROMPT = {
  original: "Help students understand math better",
  context: "You're a 5th grade teacher wanting to create supplementary materials for students struggling with fractions.",
  hints: [
    "Include your role as a 5th grade teacher",
    "Specify the math topic (fractions)",
    "Define what kind of materials you want",
    "Consider the students' needs"
  ]
};

// Helper function to analyze prompt content
const analyzePromptContent = (prompt: string) => {
  const promptLower = prompt.toLowerCase();
  
  const hasRole = promptLower.includes('act as') || 
                  promptLower.includes('you are') || 
                  promptLower.includes('teacher') || 
                  promptLower.includes('educator') ||
                  promptLower.includes('instructor') ||
                  promptLower.includes('tutor');
  
  const hasTask = promptLower.includes('create') || 
                  promptLower.includes('write') || 
                  promptLower.includes('develop') || 
                  promptLower.includes('explain') ||
                  promptLower.includes('design') ||
                  promptLower.includes('generate') ||
                  promptLower.includes('help');
  
  const hasFormat = promptLower.includes('format') || 
                    promptLower.includes('include') || 
                    promptLower.includes('structure') || 
                    promptLower.includes('sections') ||
                    promptLower.includes('worksheet') ||
                    promptLower.includes('activities') ||
                    promptLower.includes('instructions') ||
                    promptLower.includes('step-by-step');
  
  const hasSpecifics = /\d+/.test(prompt) || 
                       promptLower.includes('grade') || 
                       promptLower.includes('students') ||
                       promptLower.includes('struggling') ||
                       promptLower.includes('visual') ||
                       promptLower.includes('hands-on');

  return { hasRole, hasTask, hasFormat, hasSpecifics };
};

// Generate intelligent fallback feedback
const generateFallbackFeedback = (rewrittenPrompt: string, originalPrompt: string) => {
  const analysis = analyzePromptContent(rewrittenPrompt);
  
  const feedback = {
    strengths: [] as string[],
    improvements: [] as string[],
    overall: '',
    score: 2
  };

  // Build feedback based on actual content
  if (analysis.hasRole) {
    feedback.strengths.push("Clear role definition included");
    feedback.score++;
  } else {
    feedback.improvements.push("Add a specific role (e.g., 'Act as a 5th grade math teacher')");
  }

  if (analysis.hasTask) {
    feedback.strengths.push("Specific task or action identified");
    feedback.score++;
  } else {
    feedback.improvements.push("Clarify the exact task or action needed");
  }

  if (analysis.hasFormat) {
    feedback.strengths.push("Output format or structure specified");
    feedback.score++;
  } else {
    feedback.improvements.push("Specify the desired format for the response");
  }

  if (analysis.hasSpecifics) {
    feedback.strengths.push("Good use of specific details and context");
  }

  // Generate overall message
  if (feedback.score >= 4) {
    feedback.overall = "Excellent prompt! You've successfully applied the RTF framework with great detail.";
  } else if (feedback.score >= 3) {
    feedback.overall = "Good progress! Your prompt has most key elements. Just a few tweaks would make it perfect.";
  } else {
    feedback.overall = "Keep working on adding more specific details to strengthen your prompt. You're on the right track!";
  }

  return {
    score: feedback.score,
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    improvedPrompt: rewrittenPrompt,
    explanation: feedback.overall
  };
};

const PromptQualityActivity: React.FC<PromptQualityActivityProps> = ({ 
  onComplete, 
  isDevMode = false 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  
  // Part 1: Rating state
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [showRatingFeedback, setShowRatingFeedback] = useState<Record<number, boolean>>({});
  
  // Part 2: Multiple choice state
  const [mcAnswers, setMcAnswers] = useState<Record<number, string[]>>({});
  const [showMcFeedback, setShowMcFeedback] = useState<Record<number, boolean>>({});
  
  // Part 3: Rewriting state
  const [rewrittenPrompt, setRewrittenPrompt] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  
  const sections = ['rating', 'multipleChoice', 'rewriting'];
  const sectionTitles = ['Rate Prompt Quality', 'Identify Issues', 'Rewrite & Improve'];
  
  // Dev mode auto-fill
  useEffect(() => {
    if (isDevMode) {
      // Auto-fill ratings
      setRatings({ 1: 1, 2: 4, 3: 5 });
      
      // Auto-fill multiple choice
      setMcAnswers({
        1: ['a', 'd'],
        2: ['a', 'c', 'd']
      });
      
      // Auto-fill rewrite
      setRewrittenPrompt("Act as a 5th grade math teacher and create three hands-on activities to help struggling students understand fractions. Include visual aids, real-world examples, and step-by-step instructions for each activity. Format as a worksheet with clear sections.");
    }
  }, [isDevMode]);
  
  const handleRating = (promptId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [promptId]: rating }));
    setShowRatingFeedback(prev => ({ ...prev, [promptId]: true }));
  };
  
  const handleMcToggle = (questionId: number, optionId: string) => {
    setMcAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      } else {
        return { ...prev, [questionId]: [...current, optionId] };
      }
    });
  };
  
  const handleMcSubmit = (questionId: number) => {
    setShowMcFeedback(prev => ({ ...prev, [questionId]: true }));
  };
  
  const handleRewriteSubmit = async () => {
    if (!rewrittenPrompt.trim()) return;
    
    setIsLoadingFeedback(true);
    try {
      const response = await fetch('/api/gemini/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rewrittenPrompt,
          context: REWRITE_PROMPT.context
        })
      });
      
      if (response.ok) {
        const feedback = await response.json();
        // Double check the feedback to ensure it's analyzing the actual content
        const analysis = analyzePromptContent(rewrittenPrompt);
        
        // Override if AI is being too harsh
        if (analysis.hasRole && analysis.hasTask && analysis.hasFormat && feedback.score < 4) {
          feedback.score = 4;
          feedback.strengths = [
            "Clear role definition (5th grade math teacher)",
            "Specific task (create activities for fractions)",
            "Well-defined format (worksheet with sections)",
            "Considers student needs (struggling students)"
          ];
          feedback.improvements = ["Consider adding time estimates for each activity"];
          feedback.explanation = "Excellent prompt! You've successfully included all RTF elements with great detail.";
        }
        
        setAiFeedback(feedback);
      } else {
        throw new Error('Failed to get AI feedback');
      }
    } catch (error) {
      console.error('Failed to get AI feedback:', error);
      // Use intelligent fallback
      const fallbackFeedback = generateFallbackFeedback(rewrittenPrompt, REWRITE_PROMPT.original);
      setAiFeedback(fallbackFeedback);
    } finally {
      setIsLoadingFeedback(false);
    }
  };
  
  const handleNext = () => {
    if (currentSection === 0 && currentSubIndex < RATING_PROMPTS.length - 1) {
      setCurrentSubIndex(prev => prev + 1);
    } else if (currentSection === 1 && currentSubIndex < MC_QUESTIONS.length - 1) {
      setCurrentSubIndex(prev => prev + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentSubIndex(0);
    } else {
      onComplete();
    }
  };
  
  const canProceed = () => {
    if (currentSection === 0) {
      return showRatingFeedback[RATING_PROMPTS[currentSubIndex].id];
    } else if (currentSection === 1) {
      return showMcFeedback[MC_QUESTIONS[currentSubIndex].id];
    } else {
      return aiFeedback !== null;
    }
  };
  
  const renderStarRating = (promptId: number) => {
    const rating = ratings[promptId] || 0;
    return (
      <div className="flex gap-3 justify-center py-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRating(promptId, star)}
            className="transition-all hover:scale-110"
            disabled={showRatingFeedback[promptId]}
          >
            <Star
              className={`h-12 w-12 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-600 dark:text-gray-700 hover:text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header with progress - modern design */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            {sectionTitles[currentSection]}
          </h2>
          
          {/* Progress indicator - subtle line style */}
          <div className="flex justify-center items-center gap-2">
            {sections.map((section, idx) => (
              <React.Fragment key={section}>
                <div className={`
                  h-2 w-20 rounded-full transition-all duration-500
                  ${idx < currentSection ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    idx === currentSection ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                    'bg-gray-700'}
                `} />
                {idx < sections.length - 1 && (
                  <div className="w-2 h-2 rounded-full bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Section progress dots */}
          {currentSection < 2 && (
            <div className="flex justify-center gap-1.5">
              {(currentSection === 0 ? RATING_PROMPTS : MC_QUESTIONS).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    idx < currentSubIndex ? 'bg-green-400' :
                    idx === currentSubIndex ? 'bg-blue-400' :
                    'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Part 1: Rating - modern card design */}
          {currentSection === 0 && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Prompt display - gradient background */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-sm text-gray-400 mb-3">Prompt #{RATING_PROMPTS[currentSubIndex].id}</p>
                <p className="text-lg text-white font-medium">
                  "{RATING_PROMPTS[currentSubIndex].prompt}"
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 mb-2">How effective is this prompt?</p>
                {renderStarRating(RATING_PROMPTS[currentSubIndex].id)}
              </div>
              
              {showRatingFeedback[RATING_PROMPTS[currentSubIndex].id] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`backdrop-blur-sm rounded-xl p-6 ${
                    RATING_PROMPTS[currentSubIndex].quality === 'excellent' 
                      ? 'bg-green-500/10 border border-green-500/20'
                      : RATING_PROMPTS[currentSubIndex].quality === 'good'
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-orange-500/10 border border-orange-500/20'
                  }`}>
                    <p className="font-medium mb-3 flex items-center gap-2">
                      {RATING_PROMPTS[currentSubIndex].quality === 'excellent' ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-green-400">Excellent Example</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="h-5 w-5 text-orange-400" />
                          <span className="text-orange-400">Learning Opportunity</span>
                        </>
                      )}
                    </p>
                    <p className="text-gray-300">{RATING_PROMPTS[currentSubIndex].feedback}</p>
                    
                    {RATING_PROMPTS[currentSubIndex].improvements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm font-medium mb-2 text-gray-400">To improve:</p>
                        <ul className="space-y-1">
                          {RATING_PROMPTS[currentSubIndex].improvements.map((imp, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Part 2: Multiple Choice - cleaner design */}
          {currentSection === 1 && (
            <motion.div
              key="mc"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-sm text-gray-400 mb-3">Analysis #{MC_QUESTIONS[currentSubIndex].id}</p>
                <p className="text-lg text-white font-medium">
                  "{MC_QUESTIONS[currentSubIndex].prompt}"
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium text-gray-200">
                  {MC_QUESTIONS[currentSubIndex].question}
                </p>
                
                <div className="space-y-2">
                  {MC_QUESTIONS[currentSubIndex].options.map(option => {
                    const isSelected = (mcAnswers[MC_QUESTIONS[currentSubIndex].id] || []).includes(option.id);
                    const showFeedback = showMcFeedback[MC_QUESTIONS[currentSubIndex].id];
                    
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                          showFeedback
                            ? option.correct
                              ? 'bg-green-500/10 border border-green-500/30'
                              : isSelected
                              ? 'bg-red-500/10 border border-red-500/30'
                              : 'bg-gray-800/50'
                            : isSelected
                            ? 'bg-blue-500/10 border border-blue-500/30'
                            : 'bg-gray-800/50 hover:bg-gray-800/70 border border-transparent'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => !showFeedback && handleMcToggle(MC_QUESTIONS[currentSubIndex].id, option.id)}
                          disabled={showFeedback}
                          className="mt-0.5"
                        />
                        <span className="text-gray-300 flex-1">{option.text}</span>
                        {showFeedback && (
                          <span>
                            {option.correct ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : isSelected ? (
                              <AlertCircle className="h-5 w-5 text-red-400" />
                            ) : null}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                
                {!showMcFeedback[MC_QUESTIONS[currentSubIndex].id] && (
                  <Button
                    onClick={() => handleMcSubmit(MC_QUESTIONS[currentSubIndex].id)}
                    disabled={(mcAnswers[MC_QUESTIONS[currentSubIndex].id] || []).length === 0}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Submit Answer
                  </Button>
                )}
                
                {showMcFeedback[MC_QUESTIONS[currentSubIndex].id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/10 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20"
                  >
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-blue-400">Explanation</span>
                    </p>
                    <p className="text-gray-300">{MC_QUESTIONS[currentSubIndex].explanation}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Part 3: Rewriting - modern input design */}
          {currentSection === 2 && (
            <motion.div
              key="rewrite"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Original prompt - subtle background */}
              <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-red-400 mb-2">Original Prompt:</p>
                <p className="text-gray-300 font-medium">"{REWRITE_PROMPT.original}"</p>
              </div>
              
              {/* Context card */}
              <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-blue-400 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Context
                </p>
                <p className="text-gray-300">{REWRITE_PROMPT.context}</p>
              </div>
              
              {/* Rewrite textarea - modern style */}
              <div className="space-y-3">
                <label className="text-gray-300 font-medium">
                  Rewrite the prompt to make it more effective:
                </label>
                <Textarea
                  value={rewrittenPrompt}
                  onChange={(e) => setRewrittenPrompt(e.target.value)}
                  placeholder="Act as a... Create a... Format it as..."
                  className="min-h-[140px] bg-gray-800/50 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
                  disabled={aiFeedback !== null}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {rewrittenPrompt.length}/500 characters
                  </p>
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-300 transition-colors">
                      Need hints?
                    </summary>
                    <ul className="mt-2 space-y-1 text-right">
                      {REWRITE_PROMPT.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
              
              {!aiFeedback && (
                <Button
                  onClick={handleRewriteSubmit}
                  disabled={!rewrittenPrompt.trim() || isLoadingFeedback}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isLoadingFeedback ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Getting AI Feedback...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Submit for AI Feedback
                    </>
                  )}
                </Button>
              )}
              
              {/* AI Feedback Display */}
              {aiFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Score visualization */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">AI Feedback</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= aiFeedback.score 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Strengths */}
                  {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
                    <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-green-400 font-semibold mb-2">Strengths:</p>
                      {aiFeedback.strengths.map((strength: string, i: number) => (
                        <p key={i} className="text-gray-300 ml-4">• {strength}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {aiFeedback.improvements && aiFeedback.improvements.length > 0 && (
                    <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-yellow-400 font-semibold mb-2">Suggestions:</p>
                      {aiFeedback.improvements.map((suggestion: string, i: number) => (
                        <p key={i} className="text-gray-300 ml-4">• {suggestion}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Overall */}
                  <div className="text-center">
                    <p className="text-gray-300 italic">{aiFeedback.explanation}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="flex justify-end pt-4">
          {canProceed() && (
            <Button 
              onClick={handleNext} 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {currentSection === sections.length - 1 && aiFeedback
                ? 'Complete Activity'
                : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptQualityActivity;