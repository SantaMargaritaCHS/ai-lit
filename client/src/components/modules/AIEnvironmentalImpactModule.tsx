import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  Award, 
  CheckCircle, 
  Droplets, 
  Leaf, 
  AlertCircle,
  Zap,
  Lightbulb,
  Sun,
  Atom,
  Wind,
  ChevronRight,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';
import { ExitTicket } from '@/components/ExitTicket';
import { motion } from 'framer-motion';
// Developer mode is now handled by the UniversalDevModeProvider
import { UniversalDevPanel } from '@/components/UniversalDevPanel';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';

// Video configuration
const VIDEO_URL = 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FHow%20AI%20Is%20Guzzling%20Our%20Water%20Supply.mp4?alt=media&token=cb353217-8baf-4778-bd8c-bb0468685f7f';

const VIDEO_SEGMENTS = [
  {
    id: 'segment-1',
    title: 'The Hidden Water Crisis',
    description: 'Understanding how AI systems consume water for cooling',
    start: 0,
    end: -1, // Play entire video in one segment
    source: VIDEO_URL,
    mandatory: true,
    crossfade: false,
    allowSkipWithinChapters: false,
    reflection: false
  }
];

// Updated steps with educator-focused examples
const guidedSteps = [
  {
    id: 'intro',
    title: 'The Hidden Cost of AI',
    type: 'intro',
    content: 'Every AI query you make requires real resources. Let\'s explore what happens when you use AI tools in your classroom.',
    icon: AlertCircle
  },
  {
    id: 'video-section',
    title: 'Understanding AI\'s Water Usage',
    type: 'video',
    content: 'Watch this important video about how AI systems consume water for cooling. Pay attention to the real-world impacts on communities.',
    icon: Droplets
  },
  {
    id: 'educator-question',
    title: 'Your Classroom AI Usage',
    type: 'question',
    content: 'In a typical week, how many times might YOU use AI tools for lesson planning, grading, or creating materials?',
    options: [
      'Less than 10 times',
      '10-25 times',
      '25-50 times',
      'More than 50 times'
    ],
    correctAnswer: -1 // No correct answer, just reflection
  },
  {
    id: 'daily-water',
    title: 'Your Daily AI Water Use',
    type: 'question',
    content: 'You use AI tools about 20 times today for lesson planning, grading, and creating materials. According to recent research, how much water does this consume?',
    options: [
      'Less than a teaspoon',
      'About one 12-ounce water bottle',
      'About 3-5 standard water bottles',
      'About 10 water bottles'
    ],
    correctAnswer: 1,
    explanation: {
      correct: 'Correct! According to 2024 research from the University of California, Riverside, each AI query uses approximately 0.3-10ml of water for cooling data centers. For 20 queries, that\'s about 6-200ml total - roughly equivalent to one 12-ounce (355ml) bottle of water. While this seems small, multiply it by millions of users daily!',
      incorrect: 'Not quite. Recent studies show that 20 AI queries use about 6-200ml of water total - approximately one standard 12-ounce bottle. The exact amount depends on the data center location and cooling efficiency.'
    }
  },
  {
    id: 'school-impact',
    title: 'School-Wide AI Impact',
    type: 'question',
    content: 'Your school has 50 teachers, each using AI tools 20 times daily for a full school year (180 days). How many standard 12-ounce water bottles worth of water does this represent?',
    options: [
      'About 500 bottles',
      'About 5,000 bottles', 
      'About 18,000 bottles',
      'About 50,000 bottles'
    ],
    correctAnswer: 2,
    explanation: {
      correct: 'That\'s right! With 50 teachers × 20 queries × 180 days = 180,000 total queries. At 0.3-10ml per query, that\'s 54-1,800 liters total. Using the mid-range estimate, this equals about 5,000 standard 12-ounce bottles - enough to fill a small swimming pool!',
      incorrect: 'Let\'s calculate: 50 teachers using AI 20 times daily for 180 school days equals 180,000 queries. At current rates, this uses approximately 5,000 twelve-ounce water bottles worth of water for data center cooling.'
    }
  },
  {
    id: 'image-generation',
    title: 'AI Images vs Text',
    type: 'question', 
    content: 'Creating one AI-generated image (like a classroom poster or worksheet visual) uses significantly more resources than text generation. How much more water does generating ONE image use compared to writing a text-based lesson plan?',
    options: [
      'About the same',
      'About 10 times more',
      'About 30-50 times more',
      'About 100 times more'
    ],
    correctAnswer: 2,
    explanation: {
      correct: 'Correct! AI image generation is extremely resource-intensive. According to 2024 research, generating one image can use 30-50 times more computational resources than text generation, translating to proportionally more water usage for cooling.',
      incorrect: 'Image generation is far more resource-intensive. Research shows it uses 30-50 times more resources than text generation due to the complex calculations required to create visual content.'
    }
  },
  {
    id: 'video-cost',
    title: 'The Cost of AI Video',
    type: 'reveal',
    content: 'Creating just ONE minute of AI-generated educational video (like an animated science explanation):',
    waterBottles: 45, // Estimated for 1-minute AI video
    energyComparison: 'Same electricity as running 5 classroom projectors for 8 hours',
    realWorldExample: 'That\'s over 22 gallons - enough to fill a small classroom aquarium!'
  },
  {
    id: 'training-cost',
    title: 'The Hidden Cost: AI Training',
    type: 'reveal',
    content: 'Before an AI model like ChatGPT can answer questions, it must be trained - a one-time process with massive environmental impact. Here\'s what it took to train GPT-3:',
    waterBottles: 1970000, // 700,000 liters ÷ 0.355 liters per 12oz bottle
    energyComparison: 'Equal to 120 American homes\' entire annual electricity usage',
    realWorldExample: 'The 700,000 liters of water used would fill 280 average American swimming pools',
    additionalContext: 'This is a ONE-TIME cost to create the model. The daily usage we discussed earlier is separate and ongoing.'
  },
  {
    id: 'educator-reflection',
    title: 'Teaching Environmental Awareness',
    type: 'reflection',
    content: 'Why is it important for your students to understand AI\'s environmental impact? How will you incorporate this knowledge into your teaching while still leveraging AI\'s educational benefits?',
    isReflectionStep: true
  },
  {
    id: 'practical-solutions',
    title: 'Sustainable AI Practices for Educators',
    type: 'solutions',
    content: 'Based on research, which teaching approach would MOST effectively reduce your AI environmental footprint while maintaining educational benefits?',
    options: [
      'Stop using AI tools in education entirely',
      'Batch similar tasks (like creating all week\'s materials at once), write specific prompts to reduce iterations, and teach students these efficiency practices',
      'Only use AI for major projects once per semester',
      'Continue using AI without considering environmental impact'
    ],
    correctAnswer: 1,
    explanation: {
      correct: 'Excellent choice! Research shows that batching tasks can reduce AI queries by up to 70%. Writing detailed, specific prompts reduces back-and-forth iterations. Teaching these practices to students creates a multiplier effect - imagine if every student learned to use AI efficiently!',
      incorrect: 'The most effective approach is teaching efficient AI use: batch similar tasks together, write clear prompts that work on the first try, and share these practices with students. This can reduce environmental impact by 70% while keeping all the educational benefits.'
    }
  },
  {
    id: 'renewable-hope',
    title: 'The Clean Energy Revolution',
    type: 'renewable',
    content: 'Major tech companies are investing billions in clean energy to power AI sustainably. Here are the latest developments as of 2024-2025:',
    innovations: [
      { 
        icon: Sun, 
        title: 'Solar + Battery Storage', 
        description: 'Google announced a "power first" approach in December 2024, building data centers next to new clean energy plants. Microsoft signed a 10.5 gigawatt renewable deal with Brookfield for 2026-2030.' 
      },
      { 
        icon: Atom, 
        title: 'Nuclear Renaissance', 
        description: 'Microsoft is reopening Three Mile Island (renamed Crane Clean Energy Center) by 2027 to power AI data centers with 835 megawatts of carbon-free energy. The 20-year deal marks the first U.S. nuclear plant restart.' 
      },
      { 
        icon: Wind, 
        title: 'Wind Power Expansion', 
        description: 'Amazon, Microsoft, and Google have committed to 100% renewable energy by 2025-2030. Data centers are moving to regions with abundant wind resources like the Midwest.' 
      },
      { 
        icon: Zap, 
        title: 'Advanced Cooling', 
        description: 'New liquid cooling systems and AI-optimized data center designs are reducing water usage by up to 50% compared to traditional cooling methods.' 
      }
    ]
  },
  {
    id: 'renewable-reflection',
    title: 'Your Role in Sustainable AI',
    type: 'reflection',
    content: 'Knowing that tech companies are investing in renewable energy but it will take years to fully implement, how will you balance using AI\'s educational benefits with environmental responsibility in your classroom? Consider both immediate actions you can take and how you\'ll teach students about this issue.',
    isReflectionStep: true
  },
  {
    id: 'exit-ticket',
    title: 'Check Your Understanding',
    type: 'exit-ticket',
    content: 'Before receiving your certificate, let\'s reflect on what you\'ve learned about AI\'s environmental impact and sustainable practices.'
  }
];

interface AIEnvironmentalImpactModuleProps {
  onComplete: () => void;
  userName?: string;
}

export default function AIEnvironmentalImpactModule({ onComplete, userName = "AI Explorer" }: AIEnvironmentalImpactModuleProps) {
  // Get isDevMode from context
  const { isDevModeActive: isDevMode } = useDevMode();

  // ActivityRegistry hooks
  const { registerActivity, clearRegistry, goToActivity } = useActivityRegistry();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionFeedback, setReflectionFeedback] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [exitTicketComplete, setExitTicketComplete] = useState(false);
  const [currentVideoSegment, setCurrentVideoSegment] = useState(0);

  const activities = guidedSteps.map((step, index) => ({
    id: `step-${index}`,
    title: step.title,
    type: step.type as 'intro' | 'quiz' | 'reflection' | 'video' | 'interactive' | 'exit-ticket',
    completed: index < currentStep,
    current: index === currentStep
  }));

  // Dev mode placeholders - will be provided by context
  const showDevPanel = false;

  // Temporary dev mode handlers (to be replaced by context)
  const devHandlers = {
    onJumpToActivity: (index: number) => {
      setCurrentStep(index);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setReflectionText('');
      setReflectionFeedback('');
    },
    onCompleteAll: () => {
      setCurrentStep(guidedSteps.length - 1);
      setExitTicketComplete(true);
      onComplete();
    },
    onReset: () => {
      setCurrentStep(0);
      setAnswers({});
      setReflectionText('');
      setReflectionFeedback('');
      setSelectedAnswer(null);
      setShowExplanation(false);
      setExitTicketComplete(false);
    }
  };

  const step = guidedSteps[currentStep];
  const progress = ((currentStep + 1) / guidedSteps.length) * 100;

  // Register activities with ActivityRegistry on mount
  useEffect(() => {
    console.log('🔧 [AIEnvironmentalImpactModule]: Registering activities...');
    clearRegistry();

    guidedSteps.forEach((step, index) => {
      const activityRegistration = {
        id: step.id,
        type: step.type === 'exit-ticket' ? 'certificate' :
              step.type === 'video' ? 'video' :
              step.type === 'reflection' ? 'reflection' :
              step.type === 'intro' ? 'interactive' :
              'quiz',
        title: step.title,
        completed: index < currentStep
      };
      console.log(`📝 Registering activity: ${activityRegistration.id} (${activityRegistration.type})`);
      registerActivity(activityRegistration);
    });
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 [AIEnvironmentalImpactModule]: Received goToActivity command for index ${activityIndex}`);

      // Logic to navigate to the specific activity based on index
      if (activityIndex >= 0 && activityIndex < guidedSteps.length) {
        setCurrentStep(activityIndex);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setReflectionText('');
        setReflectionFeedback('');
        console.log(`✅ Jumped to activity ${activityIndex}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => {
    // Skip validation in dev mode
    if (isDevMode || currentStep < guidedSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setReflectionText('');
      setReflectionFeedback('');
    } else if (exitTicketComplete) {
      onComplete();
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setAnswers({ ...answers, [step.id]: answerIndex });
  };

  const handleReflectionSubmit = async () => {
    if (reflectionText.trim()) {
      setIsGettingFeedback(true);
      
      try {
        // Get AI feedback for reflection
        const response = await fetch('/api/ai-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityType: 'reflection',
            activityTitle: 'AI Environmental Impact',
            question: step.content,
            answer: reflectionText
          })
        });

        if (response.ok) {
          const data = await response.json();
          setReflectionFeedback(data.feedback);
          console.log('Reflection AI feedback:', data);
        } else {
          console.error('Failed to get reflection feedback');
          setReflectionFeedback('Thank you for your thoughtful reflection on teaching environmental awareness!');
        }
      } catch (error) {
        console.error('Error getting reflection feedback:', error);
        setReflectionFeedback('Thank you for sharing your thoughts on this important topic!');
      } finally {
        setIsGettingFeedback(false);
        setAnswers({ ...answers, [step.id]: reflectionText });
      }
    }
  };

  const handleVideoSegmentComplete = () => {
    console.log('🎬 Video segment completed - auto-advancing to next step');
    // Auto-advance to next step after video completion
    setCurrentStep(currentStep + 1);
  };

  const handleAllVideosComplete = () => {
    console.log('🎬 All video segments completed - auto-advancing to next step');
    // Auto-advance to next step after all videos complete
    setCurrentStep(currentStep + 1);
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'intro':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 p-6 rounded-lg">
              {step.icon && <step.icon className="w-12 h-12 text-green-400 mb-4" />}
              <p className="text-lg text-secondary leading-relaxed">{step.content}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
              <p className="text-sm text-secondary">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                This module contains important information about AI's environmental impact, 
                but also highlights exciting innovations in clean energy.
              </p>
            </div>
            <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
              Start Learning <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-4">
              <p className="text-sm text-muted">
                <Droplets className="w-4 h-4 inline mr-2" />
                {step.content}
              </p>
            </div>
            
            <PremiumVideoPlayer
              videoUrl={VIDEO_URL}
              videoId="ai-environmental-impact"
              segments={VIDEO_SEGMENTS}
              onSegmentComplete={handleVideoSegmentComplete}
              onModuleComplete={handleAllVideosComplete}
              enableSubtitles={true}
              hideSegmentNavigator={true}
              allowSeeking={false}
            />

            {/* Auto-advance after video completion - no manual button needed */}
          </div>
        );

      case 'question':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            
            {/* Context clarification for school-impact step */}
            {step.id === 'school-impact' && (
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mt-4">
                <p className="text-sm text-muted">
                  <Info className="w-4 h-4 inline mr-2" />
                  <strong>Context:</strong> This water is used for cooling data centers that run AI services. 
                  The actual amount varies based on location, season, and cooling technology used.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {step.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                    selectedAnswer === index
                      ? step.correctAnswer === -1 || index === step.correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-card hover:bg-card-hover border border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-primary">{option}</span>
                    {showExplanation && selectedAnswer === index && (
                      step.correctAnswer === -1 || index === step.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 p-4 rounded-lg"
              >
                <p className="text-muted">
                  {step.correctAnswer === -1 
                    ? "Thank you for reflecting on your AI usage. Every bit of awareness helps!"
                    : step.explanation
                    ? (selectedAnswer === step.correctAnswer 
                       ? step.explanation.correct 
                       : step.explanation.incorrect)
                    : (selectedAnswer === step.correctAnswer
                       ? "Correct! You understand the scale of AI's resource consumption."
                       : "Not quite. The actual impact might surprise you!")}
                </p>
                
                {/* Teaching tip for image-generation step */}
                {step.id === 'image-generation' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-secondary">
                      <strong>Teaching Tip:</strong> Consider whether you really need an AI-generated image, 
                      or if existing images, simple drawings, or text descriptions might work just as well 
                      for your educational goals.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {showExplanation && (
              <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        );

      case 'reveal':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Water Usage */}
              <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-6 h-6 text-blue-400" />
                  <h3 className="font-semibold text-muted">Water Usage</h3>
                </div>
                <p className="text-2xl font-bold text-primary">{step.waterBottles} bottles</p>
                <p className="text-sm text-secondary">{step.realWorldExample}</p>
              </div>

              {/* Energy Usage */}
              <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="font-semibold text-secondary">Energy Usage</h3>
                </div>
                <p className="text-sm text-secondary">{step.energyComparison}</p>
              </div>

              {/* Impact Scale */}
              <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-6 h-6 text-green-400" />
                  <h3 className="font-semibold text-secondary">Scale</h3>
                </div>
                <p className="text-sm text-secondary">This is just ONE school. Imagine nationwide impact!</p>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
              <p className="text-sm text-orange-200">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                <strong>Key Insight:</strong> Small individual actions multiply across institutions. 
                Understanding scale helps us make informed decisions about AI usage.
              </p>
            </div>

            <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
              Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case 'training':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            
            <div className="bg-red-soft p-6 rounded-lg border border-red-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Water Usage */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-semibold text-muted">Training Water Cost</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary">{step.waterBottles?.toLocaleString()} bottles</p>
                  <p className="text-sm text-secondary">{step.realWorldExample}</p>
                </div>

                {/* Energy Usage */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-secondary">Training Energy Cost</h3>
                  </div>
                  <p className="text-sm text-secondary">{step.energyComparison}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-soft rounded-lg">
              <p className="text-sm text-muted">
                <strong>Important Context:</strong> While training costs are enormous, they're 
                spread across billions of users over years. Your individual usage contributes 
                to ongoing operational costs (water for cooling), not training costs. However, 
                as AI models get larger and more powerful, these training costs continue to grow.
              </p>
            </div>

            <div className="bg-green-soft p-4 rounded-lg">
              <p className="text-sm text-secondary">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                <strong>Good News:</strong> {step.additionalContext || 'Training happens only once per model. The ongoing usage cost (what you saw earlier) is much smaller. Still, understanding the full picture helps us appreciate both the capabilities and responsibilities of AI.'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Source: "Making AI Less 'Thirsty'" study, University of California Riverside (2023)
              </p>
            </div>

            <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case 'reflection':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            
            <div className="space-y-4">
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Share your thoughts on teaching environmental awareness..."
                className="min-h-[120px] bg-card border-primary placeholder:text-muted"
              />
              
              {reflectionFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg border border-green-500/30"
                >
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">AI Feedback</h4>
                      <p className="text-green-100">{reflectionFeedback}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {!reflectionFeedback && (
                <Button 
                  onClick={handleReflectionSubmit} 
                  disabled={!reflectionText.trim() || isGettingFeedback}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isGettingFeedback ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting AI Feedback...
                    </>
                  ) : (
                    <>Get AI Feedback <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
              
              {/* Add Continue button that appears after feedback */}
              {reflectionFeedback && (
                <Button 
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        );

      case 'solutions':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            <div className="space-y-3">
              {step.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                    selectedAnswer === index
                      ? index === step.correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-card hover:bg-card-hover border border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-primary">{option}</span>
                    {showExplanation && selectedAnswer === index && (
                      index === step.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && step.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/10 p-4 rounded-lg"
              >
                <p className="text-muted">
                  {selectedAnswer === step.correctAnswer
                    ? step.explanation.correct
                    : step.explanation.incorrect || "Not quite right. Try thinking about balancing environmental responsibility with educational benefits."}
                </p>
                
                {/* Practical tips for solutions step */}
                {step.id === 'practical-solutions' && (
                  <div className="mt-4 p-4 bg-green-soft rounded-lg">
                    <h4 className="font-semibold text-secondary mb-2">Quick Efficiency Tips:</h4>
                    <ul className="text-sm text-green-100 space-y-1">
                      <li>• Create all weekly materials in one session instead of daily</li>
                      <li>• Save and reuse effective prompts</li>
                      <li>• Choose text over images when possible</li>
                      <li>• Teach students these same practices</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {showExplanation && (
              <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        );

      case 'renewable':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-lg text-secondary">{step.content}</p>
            
            {step.innovations && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {step.innovations.map((innovation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-500/30"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <innovation.icon className="w-8 h-8 text-green-400" />
                      <h3 className="text-xl font-semibold text-secondary">{innovation.title}</h3>
                    </div>
                    <p className="text-green-100">{innovation.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-green-soft rounded-lg">
              <p className="text-xs text-secondary">
                <strong>Sources:</strong> Google-Intersect Power Partnership (Dec 2024), 
                Microsoft-Constellation Energy Agreement (Sept 2024), 
                International Energy Agency AI Report (2024)
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <p className="text-sm text-muted">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                <strong>Hope for the Future:</strong> These innovations show that technology companies 
                are actively working to reduce AI's environmental impact. Progress takes time, but 
                change is happening.
              </p>
            </div>

            <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
              Continue to Final Assessment <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case 'exit-ticket':
        return (
          <div className="space-y-6">
            <p className="text-lg text-secondary">{step.content}</p>
            <ExitTicket
              activityTitle="AI Environmental Impact"
              questions={[
                {
                  id: 'practical-implementation',
                  text: 'What is ONE specific sustainable AI practice you learned today that you could implement immediately in your classroom?',
                  placeholder: 'Describe a concrete action you can take tomorrow (e.g., batching similar tasks, using specific prompts, timing your AI usage...)'
                },
                {
                  id: 'biggest-surprise',
                  text: 'What surprised you most about AI\'s environmental impact, and why is this important for educators to know?',
                  placeholder: 'Share what was unexpected and why other teachers should be aware of this...'
                }
              ]}
              onComplete={() => {
                setExitTicketComplete(true);
                handleNext();
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">AI Environmental Impact</h1>
        </div>
        <p className="text-xl text-muted">
          Understanding AI's environmental cost and the path to sustainability
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-card-hover border-primary">
            Step {currentStep + 1} of {guidedSteps.length}
          </Badge>
          <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Main Content */}
      <Card className="bg-card border border-primary">
        <CardHeader>
          <CardTitle className="text-xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Key Insights Box */}
      {currentStep > 3 && (
        <Card className="border border-green-400/30 bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <CardContent className="p-4">
            <h3 className="font-semibold text-secondary mb-2 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Remember</span>
            </h3>
            <div className="space-y-1 text-sm text-green-300">
              {currentStep >= 4 && <p>• Every AI query has a real environmental cost</p>}
              {currentStep >= 6 && <p>• Images and videos use significantly more resources than text</p>}
              {currentStep >= 8 && <p>• Clean energy innovations are making AI more sustainable</p>}
              {currentStep >= 10 && <p>• Small changes in how we use AI can make a big difference</p>}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Universal Dev Panel */}
      {showDevPanel && (
        <UniversalDevPanel
          isOpen={showDevPanel}
          activities={activities}
          currentActivityIndex={currentStep}
          onNavigate={(index) => {
            if (index >= 0 && index < guidedSteps.length) {
              setCurrentStep(index);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setReflectionText('');
              setReflectionFeedback('');
            }
          }}
          onAutoComplete={() => {
            // Auto-complete current step
            if (step.type === 'quiz' && !showExplanation) {
              handleAnswer(step.correctAnswer || 0);
            } else if (step.type === 'reflection' && !reflectionFeedback) {
              setReflectionText('I understand that AI has a significant environmental impact through water and energy usage.');
              setReflectionFeedback('Great reflection! You understand the environmental implications of AI.');
            } else {
              handleNext();
            }
          }}
          moduleTitle="AI Environmental Impact"
          totalSteps={guidedSteps.length}
        />
      )}
    </>
  );
}