import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Lightbulb, ArrowRight, RotateCcw, Sparkles, 
  Trophy, Target, CheckCircle, AlertCircle, Camera,
  Zap, Star, Award, Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface GuessThePromptActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface PromptLevel {
  level: number;
  prompt: string;
  hints: string[];
  keywords: string[];
  imageUrl?: string;
  difficulty: string;
  description: string;
}

interface SimilarityScore {
  overall: number;
  visualSimilarity: number;
  keywordMatching: number;
  conceptUnderstanding: number;
  feedback: string;
  strongPoints: string[];
  improvements: string[];
}

const promptLevels: PromptLevel[] = [
  {
    level: 1,
    prompt: "A bright red apple sitting on a clean white table",
    hints: ["red apple", "white table", "simple composition"],
    keywords: ["red", "apple", "white", "table", "sitting", "bright", "clean"],
    difficulty: "Beginner",
    description: "Simple object with clear colors",
    imageUrl: ""
  },
  {
    level: 2,
    prompt: "A blue bicycle leaning against a brick wall in an urban alley",
    hints: ["blue bicycle", "brick wall", "urban setting"],
    keywords: ["blue", "bicycle", "brick", "wall", "urban", "alley", "leaning", "against"],
    difficulty: "Intermediate",
    description: "Multiple elements with specific positioning",
    imageUrl: ""
  },
  {
    level: 3,
    prompt: "A cozy coffee shop interior with warm lighting and comfortable seating",
    hints: ["coffee shop", "warm lighting", "interior scene"],
    keywords: ["cozy", "coffee", "shop", "interior", "warm", "lighting", "comfortable", "seating"],
    difficulty: "Advanced",
    description: "Complex scene with atmosphere and multiple elements",
    imageUrl: ""
  }
];

const GuessThePromptActivity: React.FC<GuessThePromptActivityProps> = ({ 
  onComplete, 
  isDevMode = false 
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<SimilarityScore | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<boolean[]>(new Array(3).fill(false));
  const [isLoadingOriginalImages, setIsLoadingOriginalImages] = useState(true);
  const [levelScores, setLevelScores] = useState<number[]>(new Array(3).fill(0));
  const [showComparison, setShowComparison] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [cachingProgress, setCachingProgress] = useState({ current: 0, total: 0 });
  const [levelImageUrls, setLevelImageUrls] = useState<string[]>([]);
  const [isJudging, setIsJudging] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    visualSimilarity: 0,
    promptAccuracy: 0,
    keyElements: 0,
    creativity: 0,
    totalScore: 0,
    summary: '',
    strengths: [] as string[],
    tip: ''
  });
  const [tomSmithBonus, setTomSmithBonus] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);

  const currentPromptLevel = promptLevels[currentLevel];

  // Fun loading messages with Tom Smith specials
  const loadingMessages = [
    "🚀 Sending your words to space...",
    "🤖 Negotiating with the AI overlords...",
    "🎨 Mixing digital paint...",
    "☕ AI is having its coffee break...",
    "🌙 Traveling to the moon and back...",
    "🧙‍♂️ Consulting the AI wizards...",
    "🎭 Teaching robots about art...",
    "🍕 Bribing AI with pizza...",
    "🎪 Juggling pixels...",
    "🦄 Catching unicorns for inspiration...",
    
    // Tom Smith special messages
    "😄 Asking Tom Smith to draw this with crayons...",
    "🎨 Tom Smith is finger painting your description...",
    "☕ Waiting for Tom Smith to finish his coffee first...",
    "🎤 Tom Smith is doing standup about your prompt...",
    "📞 Calling Tom Smith for his artistic expertise...",
    "🏃 Tom Smith is running to get his paintbrush...",
    "😂 Tom Smith can't stop laughing at this one...",
    "🎯 Tom Smith is throwing paint at the canvas...",
    "🍩 Bribing Tom Smith with donuts to paint faster...",
    "💭 Tom Smith is thinking of a dad joke about this...",
    "🎪 Tom Smith turned this into a circus act...",
    "🚗 Tom Smith is driving to the art store...",
    "📱 Texting Tom Smith for emergency art help...",
    "🎸 Tom Smith is painting while playing air guitar...",
    "🏈 Tom Smith is painting during halftime...",
    "🎭 Tom Smith is turning this into interpretive dance...",
    "🍔 Tom Smith says he'll paint after lunch...",
    "🎮 Tom Smith is speedrunning this painting...",
    "📺 Tom Smith is making this into a TV show...",
    "🎉 Tom Smith declared this a painting party...",
    "🚁 Tom Smith is painting from a helicopter...",
    "🎯 Tom Smith bet he could paint this blindfolded...",
    "🏆 Tom Smith wants to frame this in his office...",
    "📸 Tom Smith is taking selfies with the canvas...",
    "🎨 Tom Smith spilled paint everywhere... again...",
    "🤹 Tom Smith is juggling paintbrushes...",
    "🎪 Tom Smith hired a clown to help paint...",
    "🚀 Tom Smith launched the paintbrush into orbit...",
    "🎤 Tom Smith is narrating this like a nature documentary...",
    "🏃 Tom Smith is racing the AI to finish first..."
  ];

  useEffect(() => {
    initializeOriginalImages();
  }, []);

  // Special Tom Smith message generator
  const getLoadingMessage = () => {
    if (Math.random() < 0.1) {
      return {
        text: loadingMessages[Math.floor(Math.random() * loadingMessages.length)],
        special: true
      };
    }
    return {
      text: loadingMessages[Math.floor(Math.random() * loadingMessages.length)],
      special: false
    };
  };

  // Cycle through fun loading messages
  useEffect(() => {
    if (isGenerating) {
      const messageObj = getLoadingMessage();
      setLoadingMessage(messageObj.special ? `${messageObj.text}|SPECIAL` : messageObj.text);
      const interval = setInterval(() => {
        const messageObj = getLoadingMessage();
        setLoadingMessage(messageObj.special ? `${messageObj.text}|SPECIAL` : messageObj.text);
      }, 3500); // Slowed down from 2000ms to 3500ms
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const initializeOriginalImages = async () => {
    setIsLoadingOriginalImages(true);
    setCachingProgress({ current: 0, total: promptLevels.length });
    
    try {
      const response = await fetch('/api/ai-literacy/original-images');
      if (!response.ok) {
        throw new Error(`Failed to fetch pre-generated images: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.images && data.images.length > 0) {
        const imageUrls = promptLevels.map((_, index) => {
          const levelImage = data.images.find((img: any) => img.level === index + 1);
          if (levelImage) {
            setCachingProgress(prev => ({ ...prev, current: prev.current + 1 }));
            return levelImage.imageUrl;
          } else {
            const fallbackUrl = `https://via.placeholder.com/512x512/FF6B6B/ffffff?text=Level+${index + 1}`;
            setCachingProgress(prev => ({ ...prev, current: prev.current + 1 }));
            return fallbackUrl;
          }
        });
        
        setLevelImageUrls(imageUrls);
      } else {
        throw new Error('No pre-generated images available');
      }
    } catch (error) {
      console.error('Failed to initialize original images:', error);
      const fallbackUrls = promptLevels.map((_, index) => 
        `https://via.placeholder.com/512x512/FF6B6B/ffffff?text=Level+${index + 1}`
      );
      setLevelImageUrls(fallbackUrls);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoadingOriginalImages(false);
    }
  };

  const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/ai-literacy/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        return data.imageUrl;
      }
      
      throw new Error('No imageUrl in response');
    } catch (error) {
      console.error('Image generation failed:', error);
      const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
      return `https://via.placeholder.com/512x512/4F46E5/ffffff?text=${encodedPrompt}`;
    }
  };

  const handleGenerateImage = async () => {
    if (!userGuess.trim()) return;

    setIsGenerating(true);
    setShowComparison(false);
    setScore(null);
    setFeedback('');
    
    try {
      const generatedUrl = await generateImageFromPrompt(userGuess);
      setGeneratedImageUrl(generatedUrl);
      
      if (generatedUrl) {
        setShowComparison(true);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Mini Score Bar Component - super simple
  const MiniScoreBar = ({ label, value, max }: { label: string, value: number, max: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value/max) * 100}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </div>
  );

  const calculateAdvancedScore = async (originalPrompt: string, userPrompt: string, originalImageUrl: string, userImageUrl: string) => {
    try {
      console.log('📤 Sending to advanced scoring:', {
        originalPrompt,
        userPrompt,
        originalImageUrl,
        userImageUrl,
        keywords: currentPromptLevel.keywords,
        tomSmithBonus,
        hintsUsed
      });
      
      // Enhanced scoring with visual comparison
      const response = await fetch('/api/ai-literacy/advanced-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt,
          userPrompt,
          originalImageUrl,
          userImageUrl,
          keywords: currentPromptLevel.keywords,
          tomSmithBonus
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Advanced scoring response:', data);
        console.log('📊 Score breakdown:', data.scoreBreakdown);
        return data.scoreBreakdown;
      } else {
        console.error('❌ Advanced scoring failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Advanced scoring failed');
      }
    } catch (error) {
      console.error('Advanced scoring failed, using fallback:', error);
      return calculateFallbackScore(originalPrompt, userPrompt);
    }
  };

  const calculateFallbackScore = (original: string, user: string) => {
    const keywords = currentPromptLevel.keywords;
    const matchedKeywords = keywords.filter(keyword => 
      user.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const keyElementsScore = Math.round((matchedKeywords.length / keywords.length) * 20);
    const promptAccuracyScore = Math.min(Math.round((user.length / original.length) * 30), 30);
    const visualSimilarityScore = Math.round(Math.random() * 20 + 20); // Random for fallback
    let creativityScore = user.length > 50 ? Math.round(Math.random() * 10 + 5) : Math.round(Math.random() * 5);
    
    // Tom Smith bonus!
    if (tomSmithBonus) {
      creativityScore = Math.min(creativityScore + 10, 10); // Cap at 10
    }
    
    const totalScore = visualSimilarityScore + promptAccuracyScore + keyElementsScore + creativityScore;
    
    // Generate appropriate feedback
    let summary = "";
    if (totalScore >= 85) {
      summary = "Incredible! You're a master of AI prompt description!";
    } else if (totalScore >= 70) {
      summary = "Excellent work! You captured the essence brilliantly!";
    } else if (totalScore >= 55) {
      summary = "Great job! You're getting really good at this!";
    } else if (totalScore >= 35) {
      summary = "Nice effort! Keep practicing to improve your descriptions!";
    } else {
      summary = "Every expert was once a beginner. Try again!";
    }
    
    // Generate strengths
    const strengths = [];
    if (matchedKeywords.length > 0) {
      strengths.push(`Identified key elements like ${matchedKeywords[0]}`);
    }
    if (user.length > 50) {
      strengths.push("Provided detailed description");
    }
    if (creativityScore > 5) {
      strengths.push("Used creative language");
    }
    
    // Generate tip
    let tip = "";
    if (matchedKeywords.length < keywords.length / 2) {
      tip = "Try to identify more key objects in the image";
    } else if (user.length < 30) {
      tip = "Add more descriptive details about colors and positioning";
    } else {
      tip = "Try adding descriptive words like 'bright' or 'glossy' next time!";
    }
    
    return {
      visualSimilarity: visualSimilarityScore,
      promptAccuracy: promptAccuracyScore,
      keyElements: keyElementsScore,
      creativity: creativityScore,
      totalScore: totalScore,
      summary: summary,
      strengths: strengths,
      tip: tip
    };
  };

  const handleJudgeAttempt = async () => {
    setIsJudging(true);
    try {
      // Use advanced scoring with visual comparison
      const breakdown = await calculateAdvancedScore(
        currentPromptLevel.prompt,
        userGuess,
        levelImageUrls[currentLevel],
        generatedImageUrl || ''
      );
      
      console.log('🔍 Score Breakdown Received:', breakdown);
      console.log('📊 Breakdown details:', {
        visual: breakdown.visualSimilarity,
        accuracy: breakdown.promptAccuracy,
        keyElements: breakdown.keyElements,
        creativity: breakdown.creativity,
        totalScore: breakdown.totalScore,
        summary: breakdown.summary,
        strengths: breakdown.strengths,
        tip: breakdown.tip
      });
      
      // Check if breakdown has the expected structure
      if (!breakdown || typeof breakdown.totalScore === 'undefined') {
        console.error('❌ Invalid breakdown structure:', breakdown);
        // Use fallback scoring
        const fallbackBreakdown = calculateFallbackScore(currentPromptLevel.prompt, userGuess);
        setScoreBreakdown(fallbackBreakdown);
        setScore(fallbackBreakdown.totalScore);
        setFeedback(fallbackBreakdown.summary);
      } else {
        setScoreBreakdown(breakdown);
        
        // Use the total score from the backend (already includes hint penalty calculation)
        const finalScore = breakdown.totalScore || 0;
        
        setScore(finalScore);
        
        // Use the summary from the backend
        let baseFeedback = breakdown.summary || "Good job!";
        
        // Add Tom Smith bonus message
        if (tomSmithBonus) {
          baseFeedback += " (Plus you get the Tom Smith bonus for making us laugh! 😂)";
        }
        
        setFeedback(baseFeedback);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Judging failed:', error);
      setFeedback('Unable to score at this time. Please try again.');
    } finally {
      setIsJudging(false);
    }
  };

  const handleNextLevel = () => {
    const newCompletedLevels = [...completedLevels];
    newCompletedLevels[currentLevel] = true;
    setCompletedLevels(newCompletedLevels);
    
    // Store the current level's score
    const newScores = [...levelScores];
    newScores[currentLevel] = score || 0;
    setLevelScores(newScores);

    if (currentLevel < promptLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      resetLevelState();
    } else {
      // Show conclusion page instead of completing immediately
      setShowConclusion(true);
    }
  };
  
  // Trophy tier system (adjusted for 3 levels with max 300 points)
  const getTrophyTier = (totalScore: number) => {
    if (totalScore >= 270) return { 
      level: 'legendary', 
      icon: '🏆', 
      title: 'Legendary AI Whisperer',
      color: 'from-yellow-400 via-amber-500 to-orange-600',
      message: 'Tom Smith bows to your mastery! You have achieved perfection!'
    };
    if (totalScore >= 240) return { 
      level: 'platinum', 
      icon: '🥇', 
      title: 'Platinum Prompt Master',
      color: 'from-gray-300 via-gray-400 to-gray-500',
      message: 'Outstanding! Even Tom Smith is impressed by your skills!'
    };
    if (totalScore >= 210) return { 
      level: 'gold', 
      icon: '🥈', 
      title: 'Gold Medal Describer',
      color: 'from-yellow-300 to-yellow-500',
      message: 'Excellent work! Tom Smith wants to hire you as his assistant!'
    };
    if (totalScore >= 180) return { 
      level: 'silver', 
      icon: '🥉', 
      title: 'Silver Star Student',
      color: 'from-gray-400 to-gray-600',
      message: 'Great job! Tom Smith says you\'re getting the hang of this!'
    };
    if (totalScore >= 150) return { 
      level: 'bronze', 
      icon: '🎖️', 
      title: 'Bronze Badge Beginner',
      color: 'from-orange-600 to-orange-800',
      message: 'Good effort! Tom Smith started here too!'
    };
    if (totalScore >= 120) return { 
      level: 'apprentice', 
      icon: '⭐', 
      title: 'Apprentice Descriptor',
      color: 'from-blue-500 to-purple-600',
      message: 'Nice try! Tom Smith believes in your potential!'
    };
    if (totalScore >= 90) return { 
      level: 'novice', 
      icon: '🌟', 
      title: 'Novice Explorer',
      color: 'from-green-500 to-blue-500',
      message: 'Keep practicing! Tom Smith says every master was once a beginner!'
    };
    return { 
      level: 'starter', 
      icon: '✨', 
      title: 'Starter Adventurer',
      color: 'from-purple-500 to-pink-500',
      message: 'Welcome to the journey! Tom Smith is cheering you on!'
    };
  };

  // Tom Smith Easter egg handler
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setUserGuess(text);
    
    // Tom Smith Easter egg
    if (text.toLowerCase().includes('tom smith') && !tomSmithBonus) {
      setTomSmithBonus(true);
      // Show special message briefly
      const originalMessage = loadingMessage;
      setLoadingMessage("🎉 TOM SMITH BONUS ACTIVATED! +10 creativity points!");
      setTimeout(() => {
        if (!isGenerating) {
          setLoadingMessage('');
        }
      }, 3000);
    }
  };

  const resetLevelState = () => {
    setUserGuess('');
    setGeneratedImageUrl(null);
    setSimilarityScore(null);
    setShowHints(false);
    setHintsUsed(0);
    setShowComparison(false);
    setScore(null);
    setFeedback('');
    setShowResults(false);
    setScoreBreakdown({
      visualSimilarity: 0,
      promptAccuracy: 0,
      keyElements: 0,
      creativity: 0,
      totalScore: 0,
      summary: '',
      strengths: [],
      tip: ''
    });
    setTomSmithBonus(false);
    setShowConclusion(false);
  };

  const handleShowHint = () => {
    setShowHints(true);
    setHintsUsed(prev => prev + 1);
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (score >= 70) return <Star className="h-8 w-8 text-gray-400" />;
    if (score >= 50) return <Medal className="h-8 w-8 text-orange-600" />;
    return <Target className="h-8 w-8 text-blue-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-yellow-500 to-amber-600';
    if (score >= 70) return 'from-gray-400 to-gray-600';
    if (score >= 50) return 'from-orange-500 to-orange-700';
    return 'from-blue-500 to-indigo-600';
  };

  // Show conclusion page if all levels completed
  if (showConclusion) {
    const totalScore = levelScores.reduce((sum, s) => sum + s, 0);
    const trophy = getTrophyTier(totalScore);
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center space-y-6">
            {/* Trophy and Score Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {trophy.icon}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-3xl font-bold bg-gradient-to-r ${trophy.color} text-transparent bg-clip-text`}
            >
              {trophy.title}
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <p className="text-5xl font-bold">{totalScore}/300</p>
              <p className="text-lg text-gray-600 dark:text-gray-400">{trophy.message}</p>
            </motion.div>
            
            {/* Level Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2"
            >
              <h3 className="font-semibold mb-3">Your Journey:</h3>
              <div className="grid grid-cols-3 gap-2">
                {levelScores.map((score, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-sm text-gray-500">Level {idx + 1}</div>
                    <div className="font-bold text-lg">{score}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Learning Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4 text-left max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-semibold text-center">What You've Learned</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Words matter with AI.</strong> The specific words and details you use dramatically 
                    impact the results you get. Being precise and descriptive leads to better outcomes.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Observation is key.</strong> You practiced looking closely at images and identifying 
                    important elements like colors, objects, styles, and moods.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Structure helps.</strong> Breaking down complex scenes into components (objects, 
                    settings, styles) makes descriptions clearer and more effective.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                <ArrowRight className="h-5 w-5" />
                What's Next?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Now that you understand how words impact AI, you're ready to learn about 
                <strong> prompting</strong> - the art of crafting instructions that get AI to do exactly 
                what you want. Get ready to become a prompt engineer!
              </p>
            </motion.div>
            
            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              >
                Continue to Introduction to Prompting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Tom Smith Easter Egg */}
            {totalScore === 300 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-xs text-gray-500 italic"
              >
                Tom Smith personally called to congratulate you on your perfect score! 
                He's hanging your certificate in his office right now. 🎨
              </motion.p>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Dev Mode Controls */}
      {isDevMode && (
        <Card className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Dev Mode Controls
          </h3>
          <div className="space-y-3">
            {/* Level Navigation */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Jump to Level:</span>
              <div className="flex gap-2">
                {[1, 2, 3].map(level => (
                  <Button
                    key={level}
                    size="sm"
                    variant={currentLevel === level - 1 ? "default" : "outline"}
                    onClick={() => {
                      setCurrentLevel(level - 1);
                      resetLevelState();
                    }}
                    className="h-8 w-8 p-0"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Quick Score Testing */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quick Score Test:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Set a score of 0
                    setScore(0);
                    setScoreBreakdown({
                      visualSimilarity: 0,
                      promptAccuracy: 0,
                      keyElements: 0,
                      creativity: 0,
                      totalScore: 0,
                      summary: 'Dev Mode: Zero score test',
                      strengths: [],
                      tip: 'This is a dev mode test with 0 points'
                    });
                    setFeedback('Dev Mode: Testing with 0 points');
                    setShowResults(true);
                    setShowComparison(true);
                    setGeneratedImageUrl('https://via.placeholder.com/512x512/FF0000/ffffff?text=Dev+Mode+0');
                    
                    // Update level scores
                    const newScores = [...levelScores];
                    newScores[currentLevel] = 0;
                    setLevelScores(newScores);
                  }}
                >
                  Test 0 Points
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Set a score of 10
                    setScore(10);
                    setScoreBreakdown({
                      visualSimilarity: 4,
                      promptAccuracy: 3,
                      keyElements: 2,
                      creativity: 1,
                      totalScore: 10,
                      summary: 'Dev Mode: Low score test',
                      strengths: ['Basic attempt'],
                      tip: 'This is a dev mode test with 10 points'
                    });
                    setFeedback('Dev Mode: Testing with 10 points');
                    setShowResults(true);
                    setShowComparison(true);
                    setGeneratedImageUrl('https://via.placeholder.com/512x512/FFA500/ffffff?text=Dev+Mode+10');
                    
                    // Update level scores
                    const newScores = [...levelScores];
                    newScores[currentLevel] = 10;
                    setLevelScores(newScores);
                  }}
                >
                  Test 10 Points
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Set a random score
                    const randomScore = Math.floor(Math.random() * 100);
                    setScore(randomScore);
                    setScoreBreakdown({
                      visualSimilarity: Math.floor(randomScore * 0.4),
                      promptAccuracy: Math.floor(randomScore * 0.3),
                      keyElements: Math.floor(randomScore * 0.2),
                      creativity: Math.floor(randomScore * 0.1),
                      totalScore: randomScore,
                      summary: `Dev Mode: Random score test (${randomScore})`,
                      strengths: ['Random test'],
                      tip: `This is a dev mode test with ${randomScore} points`
                    });
                    setFeedback(`Dev Mode: Testing with ${randomScore} points`);
                    setShowResults(true);
                    setShowComparison(true);
                    setGeneratedImageUrl(`https://via.placeholder.com/512x512/00FF00/ffffff?text=Dev+Mode+${randomScore}`);
                    
                    // Update level scores
                    const newScores = [...levelScores];
                    newScores[currentLevel] = randomScore;
                    setLevelScores(newScores);
                  }}
                >
                  Test Random
                </Button>
              </div>
            </div>
            
            {/* Current Scores Display */}
            <div className="text-sm space-y-1">
              <div className="font-medium">Level Scores:</div>
              <div className="flex gap-3">
                {levelScores.map((score, idx) => (
                  <div key={idx} className="text-xs">
                    L{idx + 1}: {score}
                  </div>
                ))}
              </div>
              <div className="font-medium">
                Total: {levelScores.reduce((sum, score) => sum + score, 0)}
              </div>
            </div>
            
            {/* Complete All Levels */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Mark all levels as completed with scores
                const newCompleted = new Array(3).fill(true);
                setCompletedLevels(newCompleted);
                const newScores = [30, 60, 90]; // Different scores for testing
                setLevelScores(newScores);
                setShowConclusion(true);
              }}
              className="w-full"
            >
              Complete All Levels (Total: 180 points)
            </Button>
          </div>
        </Card>
      )}

      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Describe and Recreate
          </h2>
          <div className="text-sm">
            Level {currentLevel + 1} of {promptLevels.length}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 mb-2">{currentPromptLevel.description}</p>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentPromptLevel.difficulty === 'Beginner' ? 'bg-green-500' :
                currentPromptLevel.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                'bg-orange-500'
              }`}>
                {currentPromptLevel.difficulty}
              </span>
            </div>
          </div>
          
          {/* Progress Dots */}
          <div className="flex gap-2">
            {promptLevels.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  completedLevels[index] 
                    ? 'bg-green-400' 
                    : index === currentLevel 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {!showComparison ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Original Image */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Original AI Image
            </h3>
            
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square mb-4 border-2 border-gray-200 dark:border-gray-700">
              {isLoadingOriginalImages ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading AI image...</p>
                </div>
              ) : levelImageUrls[currentLevel] ? (
                <img 
                  src={levelImageUrls[currentLevel]} 
                  alt={`Level ${currentLevel + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <Camera className="h-12 w-12 opacity-50" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Study this image carefully. Describe exactly what you see so AI can recreate it.
            </p>

            {/* Hide hints completely - they will only be available after scoring */}
          </Card>

          {/* Right Column - User Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Your Description
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe this image in detail:
                </label>
                <Textarea
                  value={userGuess}
                  onChange={handleDescriptionChange}
                  placeholder="Describe what you see in this image..."
                  className="min-h-[150px] resize-none"
                  disabled={score !== null}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                  <span>{userGuess.length} characters</span>
                  {tomSmithBonus && (
                    <span className="text-yellow-500 animate-pulse">
                      🎉 Tom Smith Bonus Active!
                    </span>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleGenerateImage}
                disabled={!userGuess.trim() || isGenerating || score !== null}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <div className="text-center">
                      {loadingMessage && loadingMessage.includes('|SPECIAL') ? (
                        <div className="space-y-1">
                          <div className="animate-pulse">{loadingMessage.replace('|SPECIAL', '')}</div>
                          <div className="text-xs opacity-70 italic">
                            (Tom Smith approved this message 👍)
                          </div>
                        </div>
                      ) : (
                        loadingMessage || 'Generating Image...'
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Recreate from My Description
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Side-by-side images */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Original AI Image</h3>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square">
                  <img 
                    src={levelImageUrls[currentLevel]} 
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Your Recreation</h3>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square">
                  <img 
                    src={generatedImageUrl || ''} 
                    alt="Recreation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* User's description */}
            <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your description:</p>
              <p className="font-mono text-sm">{userGuess}</p>
            </div>
            
            {/* Judge button */}
            {!score && (
              <Button 
                onClick={handleJudgeAttempt}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                disabled={isJudging}
              >
                {isJudging ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI is judging...
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Judge My Attempt
                  </>
                )}
              </Button>
            )}
          </Card>
          
          {/* Streamlined Score Display */}
          {showResults && score !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-6 space-y-6">
                {/* Big score with encouraging message */}
                <div className="text-center">
                  <motion.h2 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
                  >
                    {score}/100
                  </motion.h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">{feedback}</p>
                </div>

                {/* Simple progress bars - no verbose explanations */}
                <div className="grid grid-cols-2 gap-3">
                  <MiniScoreBar label="Visual Match" value={scoreBreakdown.visualSimilarity} max={40} />
                  <MiniScoreBar label="Accuracy" value={scoreBreakdown.promptAccuracy} max={30} />
                  <MiniScoreBar label="Details" value={scoreBreakdown.keyElements} max={20} />
                  <MiniScoreBar label="Creativity" value={scoreBreakdown.creativity} max={10} />
                </div>

                {/* What they did well - keep it brief */}
                {scoreBreakdown.strengths && scoreBreakdown.strengths.length > 0 && (
                  <div className="bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-600 dark:text-green-300 mb-2">✅ You nailed:</h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      {scoreBreakdown.strengths.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* One simple tip */}
                {scoreBreakdown.tip && (
                  <div className="bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="text-blue-600 dark:text-blue-300 font-medium">💡 Pro tip:</span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">{scoreBreakdown.tip}</span>
                    </p>
                  </div>
                )}

                {/* Reveal original prompt AFTER scoring */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 1.0 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  Original prompt: <span className="font-mono text-gray-700 dark:text-gray-300">{currentPromptLevel.prompt}</span>
                </motion.div>

                {/* Next Level button */}
                <div className="text-center">
                  <Button 
                    onClick={handleNextLevel}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-8 py-3"
                  >
                    {currentLevel < promptLevels.length - 1 ? (
                      <>
                        Next Level
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Complete Activity
                        <Trophy className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuessThePromptActivity;