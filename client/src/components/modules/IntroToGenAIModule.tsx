import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, Video, MessageSquare, Award, ChevronRight, Shuffle, CheckCircle2, X, Lightbulb, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumVideoPlayer } from '../PremiumVideoPlayer';
// Simple inline MultipleChoiceQuestion component - no import needed
import { Certificate } from '../Certificate';
import { ModuleActivityWrapper, VideoActivity, ReflectionActivity, InteractiveActivity } from '../ModuleActivityWrapper';
import { useActivityRegistry } from '../../context/ActivityRegistryContext';
// Enhanced interactive activities - no longer using drag and drop
// Developer mode props will be passed from activity wrapper

interface IntroToGenAIModuleProps {
  onComplete?: () => void;
  userName?: string;
}

type Phase = 
  | 'introduction'
  | 'opening-activity'
  | 'video-segment-1'
  | 'reflection-1'
  | 'video-segment-2'
  | 'question-1'
  | 'interactive-activity'
  | 'explore-tools'
  | 'video-segment-3'
  | 'exit-activity'
  | 'certificate';

interface SortingItem {
  id: string;
  text: string;
  category: 'traditional' | 'generative';
  explanation: string;
}

const SORTING_ITEMS: SortingItem[] = [
  {
    id: '1',
    text: 'Spam filter detecting unwanted emails',
    category: 'traditional',
    explanation: 'This analyzes and classifies existing content, not creating new content.'
  },
  {
    id: '2',
    text: 'ChatGPT writing a story',
    category: 'generative',
    explanation: 'ChatGPT creates brand new text that didn\'t exist before!'
  },
  {
    id: '3',
    text: 'Face recognition unlocking your phone',
    category: 'traditional',
    explanation: 'This identifies patterns in existing data, not generating new faces.'
  },
  {
    id: '4',
    text: 'DALL-E creating artwork from a description',
    category: 'generative',
    explanation: 'DALL-E generates completely new images based on text prompts!'
  },
  {
    id: '5',
    text: 'Netflix recommending movies',
    category: 'traditional',
    explanation: 'This analyzes your preferences to suggest existing movies.'
  },
  {
    id: '6',
    text: 'AI composing original music',
    category: 'generative',
    explanation: 'This creates brand new musical compositions!'
  }
];

const VIDEO_CONFIG = {
  url: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F2%20Introduction%20to%20Generative%20AI.mp4?alt=media&token=3a232dcb-8b6c-43c7-a427-127a0458cfa4',
  segments: [
    {
      id: 'segment-1',
      title: 'What is Generative AI?',
      startTime: 0,
      endTime: 123, // 2:03 - Includes chef/critic analogy
      pausePoint: 123
    },
    {
      id: 'segment-2', 
      title: 'Popular Generative AI Tools',
      startTime: 124, // 2:04 - Start second segment
      endTime: 196, // 3:16 - Popular tools segment
      pausePoint: 196
    },
    {
      id: 'segment-3',
      title: 'Benefits and Limitations',
      startTime: 196,
      endTime: 100000, // Use large number to play until natural end
      pausePoint: 100000
    }
  ]
};

const COMPREHENSION_QUESTION = {
  question: "According to the video, what's the key difference between traditional AI and generative AI?",
  options: [
    "Traditional AI is newer than generative AI",
    "Traditional AI analyzes and classifies existing data, while generative AI creates brand new content",
    "Generative AI is only used for text, while traditional AI handles images",
    "There is no real difference between them"
  ],
  correctAnswer: 1,
  explanation: "Exactly right! As the video explained with the chef vs food critic analogy - traditional AI is like a food critic that analyzes existing dishes, while generative AI is like a chef that creates entirely new recipes and dishes."
};

// SortableItem component removed - now using enhanced individual item presentation

export default function IntroToGenAIModule({ onComplete, userName = "AI Explorer" }: IntroToGenAIModuleProps) {
  const [phase, setPhase] = useState<Phase>('introduction');
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const { currentActivity, goToActivity } = useActivityRegistry();
  const [sortingGameScore, setSortingGameScore] = useState(0);
  const [reflectionResponse, setReflectionResponse] = useState('');
  const [aiFeedback, setAIFeedback] = useState('');
  const [exitResponse, setExitResponse] = useState('');
  const [exitFeedback, setExitFeedback] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  
  // Opening activity state
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'traditional' | 'generative'>>({});
  const [openingShowFeedback, setOpeningShowFeedback] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<SortingItem[]>([]);
  
  // Question state  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionShowFeedback, setQuestionShowFeedback] = useState(false);
  
  // Reflection state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [playgroundReflection, setPlaygroundReflection] = useState('');
  
  // Interactive Activity state (moved from renderInteractiveActivity to fix hooks violation)
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasCopied, setHasCopied] = useState<Record<string, boolean>>({});

  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Shuffle items for opening activity
    const shuffled = [...SORTING_ITEMS].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);



  const markPhaseComplete = useCallback((phaseId: Phase) => {
    setCompletedPhases(prev => new Set(prev).add(phaseId));
  }, []);

  const handlePhaseComplete = useCallback(() => {
    markPhaseComplete(phase);
    
    const nextPhase: Record<Phase, Phase | null> = {
      'introduction': 'opening-activity',
      'opening-activity': 'video-segment-1',
      'video-segment-1': 'reflection-1', 
      'reflection-1': 'question-1',
      'question-1': 'video-segment-2',
      'video-segment-2': 'interactive-activity',
      'interactive-activity': 'explore-tools',
      'explore-tools': 'video-segment-3',
      'video-segment-3': 'exit-activity',
      'exit-activity': 'certificate',
      'certificate': null
    };

    const next = nextPhase[phase];
    if (next) {
      // Add small delay and scroll to top for smoother transitions
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPhase(next);
      }, 300);
    } else if (onComplete) {
      onComplete();
    }
  }, [phase, markPhaseComplete, onComplete]);


  const handleReflectionSubmit = async (response: string) => {
    if (!response.trim()) return;
    
    setIsLoadingFeedback(true);
    console.log('🤖 Requesting AI feedback for reflection');
    
    try {
      const prompt = `
        A student just completed watching a video segment about generative AI.
        They were asked: "Think of one way you've used generative AI this week. What did it create for you?"
        
        Their response: "${response}"
        
        Provide encouraging, educational feedback (2-3 sentences) that:
        1. Acknowledges their example
        2. Explains briefly how that's an example of generative AI
        3. Encourages them to explore more generative AI tools
        
        If they haven't used generative AI, encourage them to try one of these: ChatGPT, Gemini, Copilot.
      `;

      const apiResponse = await fetch('/api/gemini/enhanced-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: response,
          context: 'Reflection activity: Student was asked to think of one way they\'ve used generative AI this week and what it created for them.'
        })
      });

      const data = await apiResponse.json();
      if (isMountedRef.current) {
        setAIFeedback(data.feedback || 'Great reflection! Generative AI is all around us, creating new content every day.');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      if (isMountedRef.current) {
        setAIFeedback('Excellent observation! Generative AI tools are becoming part of our daily lives.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingFeedback(false);
      }
    }
  };

  const debouncedSubmit = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleReflectionSubmit(value);
      }
    }, 500);
  }, []);

  // Enhanced interactive activity logic implemented in individual phase renders

  const renderIntroduction = () => (
    <ModuleActivityWrapper
      activityId="intro-gen-ai-introduction"
      activityType="intro"
      activityName="Module Introduction"
      moduleId="intro-to-gen-ai"
    >
      <div className="space-y-6">
      {/* Connection to Previous Module */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-purple-300 dark:border-purple-700"
      >
        <div className="flex items-start">
          <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full mr-4">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Building on Your AI Journey
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Great job completing "What is AI?" You've learned how AI evolved from analyzing 
              data in the 1950s to creating brand new content today. You discovered that 
              ChatGPT represents a revolutionary type of AI - generative AI!
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Quick Recap:</strong> Traditional AI (like spam filters) analyzes existing things. 
                Generative AI (like ChatGPT) creates new things. Now let's dive deeper! 🚀
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Introduction */}
      <div className="bg-glass-light rounded-2xl p-8 border border-primary">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-primary mb-4">
            Deep Dive: Introduction to Generative AI
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            You've seen the timeline, witnessed the revolution. Now let's truly understand 
            what makes generative AI so special and how to use it effectively!
          </p>
        </div>

        {/* Learning Path Preview */}
        <Card className="bg-purple-soft border-accent-secondary mb-6">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Your Learning Path Today
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm">
                  <strong>Master the Difference</strong><br/>
                  Practice identifying traditional vs generative AI
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">👨‍🍳</div>
                <p className="text-sm">
                  <strong>Chef vs Critic</strong><br/>
                  Understand the famous analogy in depth
                </p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-2xl mb-2">🛠️</div>
                <p className="text-sm">
                  <strong>Hands-On Practice</strong><br/>
                  Try generative AI tools yourself
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Hook */}
        <Card className="bg-yellow-soft border-accent mb-6">
          <CardContent className="p-4 text-center">
            <p>
              <strong>💡 By the end of this module:</strong> You'll confidently identify generative AI, 
              understand how it works, and be ready to use it as a creative partner!
            </p>
          </CardContent>
        </Card>

        {/* Start Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center"
        >
          <Button
            onClick={handlePhaseComplete}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700"
          >
            <span>Start Learning</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
    </ModuleActivityWrapper>
  );

  const renderOpeningActivity = () => {
    const currentItem = shuffledItems[currentItemIndex];
    
    const handleAnswer = (answer: 'traditional' | 'generative') => {
      const currentItem = shuffledItems[currentItemIndex];
      const correct = answer === currentItem.category;
      
      setIsCorrect(correct);
      setOpeningShowFeedback(true);
      
      if (correct) {
        setScore(prev => prev + 1);
      }
      
      // Update user answers
      setUserAnswers(prev => ({
        ...prev,
        [currentItem.id]: answer
      }));
    };

    const handleNext = () => {
      if (currentItemIndex < shuffledItems.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
        setOpeningShowFeedback(false);
        setIsCorrect(false);
      } else {
        // Calculate final score
        const finalScore = Math.round((score / shuffledItems.length) * 100);
        setSortingGameScore(finalScore);
        setGameCompleted(true);
      }
    };

    const handleCompleteActivity = () => {
      setCompletedPhases(prev => new Set([...prev, 'opening-activity']));
      setPhase('video-segment-1');
    };
    
    if (!gameCompleted && currentItem) {
      return (
        <ModuleActivityWrapper
          activityId="intro-gen-ai-sorting-game"
          activityType="interactive"
          activityName="Traditional vs Generative AI Sorting"
          moduleId="intro-to-gen-ai"
          onComplete={() => handlePhaseComplete()}
        >
          <div className="max-w-4xl mx-auto p-6">
          {/* Activity Header with Context */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                <Shuffle className="mr-3 h-6 w-6 text-purple-600" />
                Practice: Traditional AI vs Generative AI
              </h2>
              
              {/* Clear Instructions */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-700 mb-3">
                  Let's make sure you can spot the difference! For each AI example, decide:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      🔍 Traditional AI
                    </h4>
                    <p className="text-sm text-blue-700">
                      Analyzes, recognizes, or classifies existing things
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Examples: Spam filters, face recognition, recommendations
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-1">
                      ✨ Generative AI
                    </h4>
                    <p className="text-sm text-purple-700">
                      Creates brand new content that didn't exist before
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Examples: ChatGPT, DALL-E, AI music composers
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Question {currentItemIndex + 1} of {shuffledItems.length}
                </p>
                <div className="flex gap-1">
                  {shuffledItems.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < currentItemIndex
                          ? 'bg-purple-500'
                          : index === currentItemIndex
                          ? 'bg-purple-700'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="mb-6 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentItem.text}
                    </h3>
                  </div>
                  
                  {!openingShowFeedback ? (
                    <div className="flex gap-4 justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleAnswer('traditional')}
                          size="lg"
                          variant="outline"
                          className="border-blue-500 text-blue-700 hover:bg-blue-50 px-8"
                        >
                          <Brain className="mr-2 h-5 w-5" />
                          Traditional AI
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleAnswer('generative')}
                          size="lg"
                          variant="outline"
                          className="border-purple-500 text-purple-700 hover:bg-purple-50 px-8"
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generative AI
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`rounded-lg p-6 mb-4 ${
                        isCorrect
                          ? 'bg-green-50 border border-green-300'
                          : 'bg-red-50 border border-red-300'
                      }`}>
                        <div className="flex items-center justify-center mb-3">
                          {isCorrect ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          ) : (
                            <X className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                        <p className={`font-semibold mb-2 ${
                          isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {isCorrect ? 'Correct!' : 'Not quite!'}
                        </p>
                        <p className="text-gray-700">
                          {currentItem.explanation}
                        </p>
                      </div>
                      
                      <Button
                        onClick={handleNext}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {currentItemIndex < shuffledItems.length - 1 ? 'Next Question' : 'See Results'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Helpful Reminder */}
          <Card className="bg-yellow-50 border-yellow-300">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800 text-center">
                💡 <strong>Remember:</strong> Ask yourself - "Is this AI creating something new, 
                or is it working with something that already exists?"
              </p>
            </CardContent>
          </Card>
        </div>
        </ModuleActivityWrapper>
      );
    }
    
    // Game completed - show results
    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-sorting-results"
        activityType="interactive"
        activityName="Sorting Game Results"
        moduleId="intro-to-gen-ai"
      >
        <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Great Job! You Can Spot the Difference! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {score}/{shuffledItems.length} Correct
              </div>
              <p className="text-gray-600">
                You scored {sortingGameScore}%
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-2">
                Key Takeaway:
              </h4>
              <p className="text-purple-700">
                Traditional AI is like a detective 🔍 - it analyzes clues and recognizes patterns. 
                Generative AI is like an artist 🎨 - it creates something entirely new!
              </p>
            </div>
            
            <div className="text-center">
              <Button
                onClick={handleCompleteActivity}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue to Video
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </ModuleActivityWrapper>
    );
  };

  const renderVideoSegment = (segmentIndex: number) => {
    const segment = VIDEO_CONFIG.segments[segmentIndex];
    const activityId = `intro-gen-ai-video-${segment.id}`;
    const activityName = `Video: ${segment.title}`;
    
    // Enhanced segment-specific content based on the guide
    const getSegmentContent = () => {
      switch (segmentIndex) {
        case 0: // What is Generative AI + Chef/Critic
          return {
            icon: <Brain className="w-8 h-8 text-purple-400" />,
            title: "What is Generative AI?",
            gradient: "from-purple-900/20 to-blue-900/20",
            border: "border-purple-500/30",
            tip: "Pay attention to the chef vs food critic analogy - it perfectly explains the difference!",
            tipColor: "blue"
          };
        case 1: // Popular Tools
          return {
            icon: <Sparkles className="w-8 h-8 text-green-400" />,
            title: "Popular Generative AI Tools",
            gradient: "from-green-900/20 to-teal-900/20",
            border: "border-green-500/30",
            tip: "Notice how ChatGPT, Midjourney, and GitHub Copilot each create different types of content!",
            tipColor: "green",
            tools: [
              { name: 'ChatGPT', icon: '💬', type: 'Text Generation' },
              { name: 'Midjourney', icon: '🎨', type: 'Image Creation' },
              { name: 'GitHub Copilot', icon: '💻', type: 'Code Writing' }
            ]
          };
        case 2: // Benefits & Limitations
          return {
            icon: <Target className="w-8 h-8 text-orange-400" />,
            title: "Benefits and Limitations",
            gradient: "from-orange-900/20 to-red-900/20", 
            border: "border-orange-500/30",
            tip: "Understanding both benefits AND limitations is crucial for responsible AI use!",
            tipColor: "orange"
          };
        default:
          return {
            icon: <Video className="w-8 h-8 text-white" />,
            title: segment.title,
            gradient: "from-blue-900/20 to-purple-900/20",
            border: "border-blue-500/30",
            tip: "Watch carefully!",
            tipColor: "blue"
          };
      }
    };

    const content = getSegmentContent();
    
    return (
      <VideoActivity
        id={activityId}
        name={activityName}
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="space-y-6"
        >
        <Card className={`bg-gradient-to-br ${content.gradient} ${content.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {content.icon}
              <h2 className="text-2xl font-bold text-primary">{segment.title}</h2>
            </div>
            
            <div className="bg-blue-soft p-4 rounded-lg mb-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm">
                  {content.tip}
                </p>
              </div>
            </div>

            {/* Segment-specific content - comparison removed for now */}

            {content.tools && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {content.tools.map((tool) => (
                  <div 
                    key={tool.name}
                    className="bg-green-soft p-3 rounded-lg text-center hover:opacity-90 transition-opacity"
                  >
                    <div className="text-2xl mb-1">{tool.icon}</div>
                    <div className="font-semibold text-sm">{tool.name}</div>
                    <div className="text-xs opacity-80">{tool.type}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <PremiumVideoPlayer
                videoUrl={VIDEO_CONFIG.url}
                segments={[{
                  id: segment.id,
                  title: segment.title,
                  source: 'intro-gen-ai',
                  start: segment.startTime,
                  end: segment.endTime,
                  description: `Video segment: ${segment.title}`,
                  mandatory: true
                }]}
                videoId="intro-gen-ai"
                onSegmentComplete={() => {
                  console.log(`✅ Video Segment ${segmentIndex + 1} completed`);
                  setTimeout(handlePhaseComplete, 1000);
                }}
                hideSegmentNavigator={true}
                allowSeeking={isDevMode}
                enableSubtitles={true}

              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </VideoActivity>
    );
  };

  const renderReflection = () => {
    const EXAMPLE_USES = [
      'ChatGPT to help write an email',
      'Gemini to answer a question',
      'Copilot to get coding help',
      'DALL-E to create an image',
      'Claude to brainstorm ideas'
    ];

    const handleSubmit = async () => {
      if (!reflectionResponse.trim() || isLoadingFeedback) return;
      
      setIsLoadingFeedback(true);
      setHasSubmitted(true);
      
      console.log('🤖 Requesting AI feedback for reflection');
      
      try {
        const prompt = `
          A student learning about generative AI was asked: 
          "Think of one way you've used generative AI this week. What did it create for you?"
          
          Their response: "${reflectionResponse}"
          
          Provide encouraging, educational feedback (2-3 sentences) that:
          1. Acknowledges their example positively
          2. Briefly explains how that demonstrates generative AI creating new content
          3. Suggests one other generative AI tool they might enjoy trying
          
          If they say they haven't used any, encourage them to try one of these: ChatGPT, Gemini, Copilot.
          Keep the tone friendly and encouraging for a beginner.
        `;

        const apiResponse = await fetch('/api/gemini/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const data = await apiResponse.json();
        console.log('✅ AI feedback received');
        
        if (isMountedRef.current) {
          setAIFeedback(data.feedback || 'Great reflection! You\'re already seeing how generative AI creates new content in our daily lives.');
        }
      } catch (error) {
        console.error('❌ Error getting AI feedback:', error);
        if (isMountedRef.current) {
          setAIFeedback('Excellent observation! Generative AI is becoming part of our everyday tools, creating content that helps us work and learn more effectively.');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoadingFeedback(false);
        }
      }
    };

    return (
      <ReflectionActivity
        id="intro-gen-ai-reflection"
        name="Reflection: Using Generative AI"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
        <Card className="bg-green-soft">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400" />
              Personal Reflection
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">

            <div className="bg-green-soft p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Reflection Question:</h3>
              <p className="text-lg">
                "Think of one way you've used generative AI this week. What did it create for you?"
              </p>
            </div>

            <div className="bg-blue-soft p-4 rounded-lg">
              <h4 className="font-medium mb-2">Need inspiration? Try thinking about:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {EXAMPLE_USES.map((example, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className="opacity-70">•</span>
                    {example}
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              value={reflectionResponse}
              onChange={(e) => setReflectionResponse(e.target.value)}
              placeholder="Share your experience with generative AI... (e.g., 'I used ChatGPT to help write a cover letter for a job application')"
              className="min-h-[120px] bg-card border-primary placeholder:text-muted"
            />

            {!hasSubmitted && reflectionResponse.trim() && (
              <Button
                onClick={handleSubmit}
                disabled={isLoadingFeedback}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isLoadingFeedback ? 'Getting AI Feedback...' : 'Submit Reflection'}
              </Button>
            )}

            {isLoadingFeedback && (
              <div className="text-center text-green-600 dark:text-green-400 animate-pulse">
                Getting personalized AI feedback...
              </div>
            )}

            <AnimatePresence>
              {aiFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-soft p-4 rounded-lg"
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    AI Feedback:
                  </h4>
                  <p>{aiFeedback}</p>
                  
                  <Button
                    onClick={handlePhaseComplete}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Continue to Next Video
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      </ReflectionActivity>
    );
  };

  const renderComprehensionQuestion = () => {
    const handleAnswerSelect = (index: number) => {
      setSelectedAnswer(index);
      setQuestionShowFeedback(true);
    };

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-quiz"
        activityType="quiz"
        activityName="Comprehension Check"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-8 border border-primary"
        >
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Comprehension Check</h2>
          <p className="text-muted">Test your understanding</p>
        </div>

        <div className="space-y-6">

          <div className="bg-blue-soft p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">{COMPREHENSION_QUESTION.question}</h3>
          </div>

          <div className="space-y-3">
            {COMPREHENSION_QUESTION.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={questionShowFeedback}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? index === COMPREHENSION_QUESTION.correctAnswer
                      ? 'border-green-500 bg-green-soft'
                      : 'border-red-500 bg-red-soft'
                    : 'border-primary bg-card hover:bg-card-hover'
                } ${questionShowFeedback && index === COMPREHENSION_QUESTION.correctAnswer ? 'border-green-500 bg-green-soft' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          {questionShowFeedback && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === COMPREHENSION_QUESTION.correctAnswer
                ? 'bg-green-soft'
                : 'bg-yellow-soft'
            }`}>
              <p className={`mb-2 font-semibold ${
                selectedAnswer === COMPREHENSION_QUESTION.correctAnswer ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {selectedAnswer === COMPREHENSION_QUESTION.correctAnswer ? '✓ Correct!' : 'Not quite right'}
              </p>
              <p>{COMPREHENSION_QUESTION.explanation}</p>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={handlePhaseComplete}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      </ModuleActivityWrapper>
    );
  };

  const renderInteractiveActivity = () => {
    // State variables moved to component level to fix React Hooks violation

    // Developer mode constants
    const DEV_RESPONSES = {
      reflection: "As an educator, I've actually used generative AI quite a bit this week! I used ChatGPT to help brainstorm discussion questions for my lesson on ecosystems, and it created a really thoughtful list of questions that got my students thinking critically. I also used Gemini to help me write personalized feedback comments for student essays - it helped me articulate constructive feedback while maintaining an encouraging tone. This experience really shows me how generative AI doesn't just analyze existing content like traditional AI - it actually creates new, original content that I couldn't have thought of on my own.",
      exitTicket: "What surprised me most about generative AI is learning the clear distinction between traditional AI and generative AI through the chef vs. food critic analogy. I didn't realize that tools like Netflix recommendations and spam filters are traditional AI that analyze existing content, while tools like ChatGPT and DALL-E actually create entirely new content that never existed before. This distinction helps me understand why generative AI feels so revolutionary - it's not just processing what's already there, it's creating something completely new. As an educator, this makes me excited about the creative possibilities for both my teaching and my students' learning."
    };

    const CREATIVE_PROMPTS = [
      { id: '1', text: 'Write a haiku about artificial intelligence', icon: '📝' },
      { id: '2', text: 'Create a short story opening about a robot chef', icon: '📖' },
      { id: '3', text: 'Generate an image of a futuristic classroom', icon: '🎨' },
      { id: '4', text: 'Compose a jingle for an AI literacy course', icon: '🎵' },
      { id: '5', text: 'Design a logo for "AI Explorers Club"', icon: '🎯' },
      { id: '6', text: 'Write a recipe for "Algorithm Soup"', icon: '🍲' }
    ];

    const GENERATIVE_AI_TOOLS = [
      { name: 'Suno', url: 'https://suno.com', description: 'Create original music', icon: '🎵' },
      { name: 'Copilot', url: 'https://copilot.microsoft.com', description: 'Text generation & more', icon: '💬' },
      { name: 'Midjourney', url: 'https://midjourney.com', description: 'Create stunning images', icon: '🎨' },
      { name: 'Veo', url: 'https://deepmind.google/technologies/veo/', description: 'Generate videos', icon: '🎬' },
      { name: 'Rosebud.ai', url: 'https://rosebud.ai', description: 'Create video games', icon: '🎮' },
      { name: 'Cursor', url: 'https://cursor.sh', description: 'AI-powered coding', icon: '💻' }
    ];

    const copyPrompt = (prompt: { id: string; text: string }) => {
      navigator.clipboard.writeText(prompt.text);
      setSelectedPrompts(prev => [...prev, prompt.text]);
      setHasCopied(prev => ({ ...prev, [prompt.id]: true }));
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setHasCopied(prev => ({ ...prev, [prompt.id]: false }));
      }, 2000);
    };

    return (
      <InteractiveActivity
        id="intro-gen-ai-playground"
        name="AI Playground Activity"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              Generative AI Playground
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Fixed Instructions with proper contrast */}
            <Card className="mb-8 bg-purple-50 border-2 border-purple-300">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Have Some Fun!
                </h3>
                <p className="text-gray-700">
                  This is your playground! Chat with the AI above - ask it anything, 
                  request images, tell it jokes, or see what creative things it can make.
                </p>
                <p className="text-purple-700 mt-2 font-medium">
                  After exploring, share your experience below to continue.
                </p>
              </CardContent>
            </Card>

            {/* AI Chatbot Iframe */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">
                🤖 Multi-Modal AI Chatbot - Try Your Prompts Here!
              </h4>
              <div className="bg-yellow-500/20 border border-yellow-400/30 p-3 rounded-lg mb-4">
                <p className="text-yellow-100 text-sm">
                  <strong>Instructions:</strong> This multi‑modal chatbot (able to process text, images, documents, and code) can generate responses, create images, and interact with uploaded files. Try exploring all it can do!
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <iframe 
                  src="https://ailiteracybot-10010115.chipp.ai" 
                  height="600px" 
                  width="100%" 
                  frameBorder="0" 
                  title="AI Literacy Bot"
                  className="bg-white"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>

            {/* Fixed Reflection Section */}
            <Card className="mt-8 bg-white border-2 border-purple-300">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
                  Quick Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What did you create with the AI chatbot?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Share what you learned or created... (minimum 50 characters)
                  </p>
                </div>
                
                {/* ACTUAL TEXTAREA INPUT */}
                <Textarea
                  value={playgroundReflection}
                  onChange={(e) => setPlaygroundReflection(e.target.value)}
                  placeholder="Type your reflection here..."
                  className="w-full min-h-[120px] p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900"
                />
                
                {/* Character counter */}
                <div className="flex justify-between items-center mt-2 mb-4">
                  <span className={`text-sm ${playgroundReflection.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                    {playgroundReflection.length}/50 characters minimum {playgroundReflection.length >= 50 && '✓'}
                  </span>
                </div>

                {/* Submit button - only enabled when 50+ characters */}
                {playgroundReflection.length >= 50 && (
                  <Button
                    onClick={() => {
                      // Move to next activity
                      setCompletedPhases(prev => new Set([...prev, 'interactive-activity']));
                      setPhase('explore-tools');
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  >
                    Continue to Next Activity
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {/* Helper text */}
                {playgroundReflection.length < 50 && playgroundReflection.length > 0 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Keep writing! {50 - playgroundReflection.length} more characters needed.
                  </p>
                )}
              </CardContent>
            </Card>

            <p className="text-center mt-4 font-semibold text-sm">
              Explore the playground above, then share your thoughts to continue
            </p>
          </CardContent>
        </Card>
      </motion.div>
      </InteractiveActivity>
    );
  };

  const renderExitActivity = () => (
    <ModuleActivityWrapper
      activityId="intro-gen-ai-exit-ticket"
      activityType="exit-ticket"
      activityName="Exit Ticket"
      moduleId="intro-to-gen-ai"
      onComplete={() => handlePhaseComplete()}
    >
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl p-8 border border-primary"
    >
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Exit Ticket</h2>
        <p className="text-muted">Share what you've learned</p>
      </div>

      <div className="space-y-6">

        <div className="bg-orange-soft p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Final Question:</h3>
          <p>"What's one new thing you learned about generative AI that surprised you?"</p>
        </div>

        <div className="space-y-2">
          <Textarea
            value={exitResponse}
            onChange={(e) => setExitResponse(e.target.value)}
            placeholder="Share your biggest learning moment... (minimum 50 characters)"
            className="min-h-[120px] bg-card border-primary placeholder:text-muted"
          />
          <div className="text-right text-sm text-muted">
            {exitResponse.length}/50 characters {exitResponse.length < 50 ? '(minimum required)' : '✓'}
          </div>
        </div>

        <Button
          onClick={async () => {
            if (exitResponse.length < 50) return;
            
            setIsGettingFeedback(true);
            try {
              const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: [
                    {
                      role: 'system',
                      content: 'You are an encouraging AI literacy educator. The user just completed the generative AI module and shared their reflection. Give brief, specific, encouraging feedback about their learning. Keep it under 100 words and highlight what they understood well.'
                    },
                    {
                      role: 'user',
                      content: `Here's my reflection on what I learned about generative AI: "${exitResponse}"`
                    }
                  ]
                })
              });
              
              const data = await res.json();
              setExitFeedback(data.message || "Great reflection! You really understood the key concepts!");
            } catch {
              setExitFeedback("Excellent insights! You've mastered the difference between traditional and generative AI!");
            }
            setIsGettingFeedback(false);
          }}
          disabled={exitResponse.length < 50 || isGettingFeedback || !!exitFeedback}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGettingFeedback ? 'Getting feedback...' : 'Submit'}
        </Button>

        {exitFeedback && (
          <div className="mt-4 p-4 bg-purple-soft rounded-lg">
            <p>
              <strong>AI Feedback:</strong> {exitFeedback}
            </p>
          </div>
        )}

        {exitFeedback && (
          <Button
            onClick={() => {
              setCompletedPhases(prev => new Set([...prev, 'exit-activity']));
              setPhase('certificate');
            }}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Get Certificate!
          </Button>
        )}
      </div>
    </motion.div>
    </ModuleActivityWrapper>
  );

  const renderCertificate = () => {
    // Calculate achievement score based on multiple factors
    const completionScore = Math.round(
      (sortingGameScore * 0.4) + // 40% from sorting game
      (reflectionResponse.length > 20 ? 30 : 15) + // 30% for thoughtful reflection
      (exitResponse.length > 20 ? 30 : 15) // 30% for meaningful exit response
    );

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-certificate"
        activityType="certificate"
        activityName="Module Certificate"
        moduleId="intro-to-gen-ai"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="text-muted text-lg">You've completed the Introduction to Generative AI module!</p>
        </div>

        <Certificate
          userName={userName}
          courseName="Introduction to Generative AI"
          completionDate={new Date().toLocaleDateString()}
          score={completionScore}
          instructor="AI Literacy Platform"
          moduleId="intro-to-gen-ai"
          onDownload={() => {
            console.log('📊 Certificate downloaded for Introduction to Generative AI module');
            
            // Log completion analytics
            fetch('/api/analytics/certificate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'certificate_downloaded',
                moduleId: 'intro-to-gen-ai',
                studentName: userName,
                score: completionScore,
                timestamp: new Date().toISOString()
              })
            }).catch(error => console.error('Analytics error:', error));
          }}
        />
      </motion.div>
      </ModuleActivityWrapper>
    );
  };

  const renderExploreTools = () => {
    const DETAILED_TOOLS = [
      {
        name: 'Suno',
        url: 'https://suno.com',
        icon: '🎵',
        category: 'Music Generation',
        description: 'Create original music and songs from text prompts',
        features: ['Text-to-music generation', 'Custom lyrics creation', 'Various music styles', 'High-quality audio output'],
        useCase: 'Perfect for creating background music, jingles, or exploring musical creativity',
        accessibility: 'Free tier available, subscription for advanced features'
      },
      {
        name: 'Microsoft Copilot',
        url: 'https://copilot.microsoft.com',
        icon: '💬',
        category: 'Multi-Modal Assistant',
        description: 'Comprehensive AI assistant for text, images, and productivity',
        features: ['Text generation', 'Image creation', 'Code assistance', 'Web search integration'],
        useCase: 'Great for research, writing assistance, and general productivity tasks',
        accessibility: 'Free with Microsoft account, enhanced features with subscription'
      },
      {
        name: 'Midjourney',
        url: 'https://midjourney.com',
        icon: '🎨',
        category: 'Image Generation',
        description: 'Create stunning, artistic images from text descriptions',
        features: ['High-quality image generation', 'Artistic styles', 'Image variations', 'Upscaling capabilities'],
        useCase: 'Ideal for concept art, illustrations, and creative visual content',
        accessibility: 'Subscription-based service with different tiers'
      },
      {
        name: 'Veo (by Google)',
        url: 'https://deepmind.google/technologies/veo/',
        icon: '🎬',
        category: 'Video Generation',
        description: 'Generate realistic videos from text prompts',
        features: ['Text-to-video generation', 'High-resolution output', 'Various video styles', 'Motion control'],
        useCase: 'Perfect for creating promotional videos, animations, and video content',
        accessibility: 'Currently in limited access/beta testing'
      },
      {
        name: 'Rosebud.ai',
        url: 'https://rosebud.ai',
        icon: '🎮',
        category: 'Game Development',
        description: 'Create video games using AI assistance',
        features: ['Game asset generation', 'Code assistance', 'Visual scripting', 'Character creation'],
        useCase: 'Great for indie developers and game design exploration',
        accessibility: 'Free tier with premium features available'
      },
      {
        name: 'Cursor',
        url: 'https://cursor.sh',
        icon: '💻',
        category: 'Code Generation',
        description: 'AI-powered code editor and programming assistant',
        features: ['Code completion', 'Bug fixing', 'Code explanation', 'Multi-language support'],
        useCase: 'Excellent for learning programming and boosting coding productivity',
        accessibility: 'Free for individuals, paid plans for teams'
      }
    ];

    return (
      <ModuleActivityWrapper
        activityId="intro-gen-ai-explore-tools"
        activityType="interactive"
        activityName="Explore AI Tools"
        moduleId="intro-to-gen-ai"
        onComplete={() => handlePhaseComplete()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
        <Card className="bg-blue-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              Explore More Generative AI Tools
            </CardTitle>
            <p className="text-lg mt-2">
              Discover the amazing variety of content AI can create across different domains
            </p>
          </CardHeader>
        </Card>

        {/* Continue Button - Moved to Top for Better UX */}
        <Card className="bg-orange-soft">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Ready for the Final Video?</h3>
            <p className="mb-6">
              Explore the tools below, then continue to learn about benefits and limitations of generative AI.
            </p>
            <Button
              onClick={handlePhaseComplete}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            >
              Continue to Final Video
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {DETAILED_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card hover:bg-card-hover transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{tool.name}</h3>
                        <span className="px-2 py-1 bg-blue-soft text-xs rounded-full">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-secondary mb-4">{tool.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Key Features:</h4>
                          <ul className="text-sm text-muted space-y-1">
                            {tool.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Best Use Case:</h4>
                          <p className="text-sm text-muted">{tool.useCase}</p>
                          
                          <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1 mt-3">Accessibility:</h4>
                          <p className="text-sm text-muted">{tool.accessibility}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => window.open(tool.url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                        >
                          Visit {tool.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </ModuleActivityWrapper>
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {phase === 'introduction' && renderIntroduction()}
          {phase === 'opening-activity' && renderOpeningActivity()}
          {phase === 'video-segment-1' && renderVideoSegment(0)}
          {phase === 'reflection-1' && renderReflection()}
          {phase === 'video-segment-2' && renderVideoSegment(1)}
          {phase === 'question-1' && renderComprehensionQuestion()}
          {phase === 'interactive-activity' && renderInteractiveActivity()}
          {phase === 'explore-tools' && renderExploreTools()}
          {phase === 'video-segment-3' && renderVideoSegment(2)}
          {phase === 'exit-activity' && renderExitActivity()}
          {phase === 'certificate' && renderCertificate()}
        </AnimatePresence>
      </div>

    </>
  );
}