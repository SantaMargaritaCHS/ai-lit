import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PremiumVideoPlayer from '@/components/PremiumVideoPlayer';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Certificate } from '@/components/Certificate';
import { getAIFeedback, generateAIFeedback } from '@/services/geminiService';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
// Developer mode is passed as props, no hook needed
import LLMLimitationsDeveloperPanel from './LLMLimitationsModule/LLMLimitationsDeveloperPanel';
import { SecretKeyPrompt } from '@/components/SecretKeyPrompt';
import SourcesActivity from './LLMLimitationsModule/SourcesActivity';
import { 
  Brain, ChevronRight, AlertTriangle, Trophy, Clock, 
  Users, ShieldAlert, MessageSquare, Search, Eye, TrendingDown, BookOpen, Award,
  Lightbulb, CheckCircle, AlertCircle, Loader2, Send, XCircle,
  Heart, Briefcase, Camera, CreditCard, Scale,
  Globe, Smartphone, Microscope, TrendingUp, Film,
  ClipboardCheck, Sparkles, Download, Home
} from 'lucide-react';

interface LLMLimitationsModuleProps {
  userName: string;
  onComplete: () => void;
  // Developer mode props passed from activity level
  isDevMode?: boolean;
  showDevPanel?: boolean;
  setShowDevPanel?: (show: boolean) => void;
  disableDevMode?: () => void;
}



const VIDEO_SEGMENTS = [
  {
    id: 'segment-1',
    title: 'The Oracle Analogy',
    start: 0,
    end: 44,
    chapterTitle: 'Ancient Oracles vs Modern AI',
    source: 'gemini',
    description: 'Comparing LLMs to ancient oracles',
    mandatory: true
  },
  {
    id: 'segment-2', 
    title: 'How LLMs Really Work',
    start: 44,
    end: 119, // 1:59 in seconds
    chapterTitle: 'Pattern Prediction',
    source: 'gemini',
    description: 'Understanding LLM prediction mechanisms',
    mandatory: true
  },
  {
    id: 'segment-3',
    title: 'Four Key Limitations',
    start: 119,
    end: 206, // 3:26 in seconds
    chapterTitle: 'Core Limitations',
    source: 'gemini', 
    description: 'Exploring the main limitations of LLMs',
    mandatory: true
  },
  {
    id: 'segment-4',
    title: 'Hallucinations',
    start: 206,
    end: 218, // 3:38 in seconds
    chapterTitle: 'False Information',
    source: 'gemini',
    description: 'When AI generates false information',
    mandatory: true
  },
  {
    id: 'segment-5',
    title: 'Training Data Bias',
    start: 220, // 3:40 in seconds
    end: 246, // 4:06 in seconds
    chapterTitle: 'Bias in AI',
    source: 'gemini',
    description: 'How training data creates bias',
    mandatory: true
  },
  {
    id: 'segment-6',
    title: 'Outdated Information',
    start: 246,
    end: 273, // 4:33 in seconds
    chapterTitle: 'Knowledge Cutoffs',
    source: 'gemini',
    description: 'AI knowledge limitations over time',
    mandatory: true
  },
  {
    id: 'segment-7',
    title: 'Conclusion',
    start: 273,
    end: 377, // Exactly 6:17 (377 seconds)
    chapterTitle: 'Wrapping Up',
    source: 'gemini',
    description: 'Final thoughts on responsible AI use',
    mandatory: true
  }
];

export function LLMLimitationsModule({
  userName,
  onComplete,
  isDevMode: isDevModeProp = false,
  showDevPanel = false,
  setShowDevPanel,
  disableDevMode
}: LLMLimitationsModuleProps) {
  // Get isDevMode from context instead of props
  const { isDevModeActive: isDevModeFromContext } = useDevMode();
  const isDevMode = isDevModeFromContext || isDevModeProp;

  // ActivityRegistry hooks
  const { registerActivity, clearRegistry, goToActivity } = useActivityRegistry();

  const [currentPhase, setCurrentPhase] = useState<'intro' | 'opening-challenge' | 'video1' | 'discussion1' | 'video2' | 'activity2' | 'video3' | 'discussion3' | 'video4' | 'hallucination-activity' | 'video5' | 'bias-activity' | 'video6' | 'outdated-activity' | 'sources-activity' | 'video7' | 'reflection' | 'complete'>('intro');
  const [reflection, setReflection] = useState('');
  const [currentSegment, setCurrentSegment] = useState(0);
  const [activityResponses, setActivityResponses] = useState<Record<string, string>>({});
  const [hallucinationScore, setHallucinationScore] = useState(0);
  const [reflections, setReflections] = useState<Record<string, string>>({
    oracle: '',
    prediction: '',
    capabilities: '',
    bias: ''
  });


  
  // Hallucination activity state - always initialized to avoid hooks rule violations
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  // Hallucination Detective Game state
  const [hallucinationGame, setHallucinationGame] = useState({
    questions: [] as Array<{
      question: string;
      response: string;
      isHallucination: boolean;
      userGuess: boolean | null;
      revealed: boolean;
    }>,
    currentQuestion: '',
    isGenerating: false,
    gameScore: 0
  });
  
  // Bias Activity - Interactive Cards state
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  
  // Outdated Information Activity state
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [showPromptTips, setShowPromptTips] = useState(false);
  
  // Exit Ticket state - simplified to single question
  const [exitResponse, setExitResponse] = useState('');
  const [exitFeedback, setExitFeedback] = useState('');
  const [isLoadingExitFeedback, setIsLoadingExitFeedback] = useState(false);
  const [showExitContinueButton, setShowExitContinueButton] = useState(false);
  const [readyForCertificate, setReadyForCertificate] = useState(false);
  
  // Developer Mode passed from activity level - no local hook needed
  
  // Debug developer mode props
  useEffect(() => {
    console.log('🔧 LLM Module Props Debug:', { 
      isDevMode, 
      showDevPanel, 
      setShowDevPanel: !!setShowDevPanel 
    });
  }, [isDevMode, showDevPanel, setShowDevPanel]);


  
  const videoUrl = 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F4%20Limitations%20of%20Large%20Language%20Models.mp4?alt=media&token=fae1675f-1f63-4fd8-a2b3-98e559e022f9';

  const handleVideoComplete = (segmentId: string) => {
    console.log('Video segment completed:', segmentId);
    
    if (segmentId === 'segment-1') {
      setCurrentPhase('discussion1');
    } else if (segmentId === 'segment-2') {
      setCurrentPhase('activity2');
    } else if (segmentId === 'segment-3') {
      setCurrentPhase('discussion3');
    } else if (segmentId === 'segment-4') {
      setCurrentPhase('hallucination-activity');
    } else if (segmentId === 'segment-5') {
      setCurrentPhase('bias-activity');
    } else if (segmentId === 'segment-6') {
      setCurrentPhase('outdated-activity');
    } else if (segmentId === 'segment-7') {
      setCurrentPhase('reflection');
    }
  };

  const handleActivityComplete = (activityId: string, response?: string) => {
    if (response) {
      setActivityResponses(prev => ({ ...prev, [activityId]: response }));
    }
    
    if (activityId === 'opening-challenge') {
      setCurrentPhase('video1');
      setCurrentSegment(0);
    } else if (activityId === 'discussion1') {
      setCurrentPhase('video2');
      setCurrentSegment(1);
    } else if (activityId === 'activity2') {
      setCurrentPhase('video3');
      setCurrentSegment(2);
    } else if (activityId === 'discussion3') {
      setCurrentPhase('video4');
      setCurrentSegment(3);
    } else if (activityId === 'hallucination-activity') {
      setCurrentPhase('video5');
      setCurrentSegment(4);
    } else if (activityId === 'bias-activity') {
      setCurrentPhase('video6');
      setCurrentSegment(5);
    } else if (activityId === 'outdated-activity') {
      setCurrentPhase('sources-activity');
    } else if (activityId === 'sources-activity') {
      setCurrentPhase('video7');
      setCurrentSegment(6);
    }
  };

  const handleReflectionSubmit = () => {
    setCurrentPhase('complete');
  };

  // Developer Mode: Activities list for navigation
  const activities = [
    { id: 'intro', title: 'Introduction', completed: currentPhase !== 'intro' },
    { id: 'opening-challenge', title: 'Opening Challenge', completed: ['opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video1', title: 'Oracle Analogy Video', completed: ['video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'discussion1', title: 'Oracle Reflection', completed: ['discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video2', title: 'Pattern Recognition Video', completed: ['video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'activity2', title: 'Pattern Activity', completed: ['activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video3', title: 'Four Limitations Video', completed: ['video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'discussion3', title: 'Understanding Reflection', completed: ['discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video4', title: 'Hallucination Video', completed: ['video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'hallucination-activity', title: 'Hallucination Detective', completed: ['hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video5', title: 'Bias Video', completed: ['video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'bias-activity', title: 'Bias Exploration', completed: ['bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video6', title: 'Outdated Info Video', completed: ['video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'outdated-activity', title: 'Knowledge Cutoff Activity', completed: ['outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'sources-activity', title: 'AI Sources & Citations', completed: ['sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) < ['sources-activity', 'video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'video7', title: 'Conclusion Video', completed: ['video7', 'reflection', 'complete'].indexOf(currentPhase) < ['video7', 'reflection', 'complete'].indexOf(currentPhase) },
    { id: 'reflection', title: 'Exit Ticket', completed: currentPhase === 'complete' },
    { id: 'complete', title: 'Certificate', completed: false }
  ];

  // Register activities with ActivityRegistry on mount
  useEffect(() => {
    console.log('🔧 LLMLimitationsModule: Registering activities...');
    clearRegistry();

    const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];

    activities.forEach((activity, index) => {
      const activityRegistration = {
        id: activity.id,
        type: activity.id === 'complete' ? 'certificate' as const :
              activity.id.includes('video') ? 'video' as const :
              activity.id === 'reflection' ? 'reflection' as const :
              'interactive' as const,
        title: activity.title,
        completed: phases.indexOf(currentPhase) > index
      };
      console.log(`📝 Registering activity: ${activityRegistration.id} (${activityRegistration.type})`);
      registerActivity(activityRegistration);
    });
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 LLMLimitationsModule: Received goToActivity command for index ${activityIndex}`);

      const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];

      if (activityIndex >= 0 && activityIndex < phases.length) {
        setCurrentPhase(phases[activityIndex] as any);
        console.log(`✅ Jumped to phase ${activityIndex}: ${phases[activityIndex]}`);
      }
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, []);

  // Developer Mode: Auto-fill functionality
  const autoFillReflections = () => {
    if (!isDevMode) return;
    
    setReflections({
      oracle: "Like ancient oracles, LLMs provide responses that seem authoritative but may not always be accurate. This comparison helps students understand that AI outputs should be critically evaluated rather than accepted blindly.",
      prediction: "LLMs work by predicting the most likely next word based on patterns in training data. Understanding this mechanism helps educators explain why AI sometimes produces plausible-sounding but incorrect information.",
      capabilities: "Key limitations include hallucinations (false information), bias from training data, outdated knowledge cutoffs, and lack of true understanding. These limitations are crucial for responsible AI use in education.",
      bias: "Training data bias can perpetuate stereotypes and inequalities. As educators, we must be aware of these biases and teach students to critically evaluate AI outputs for fairness and accuracy."
    });
    
    setExitResponse("The most important thing about AI limitations is understanding that AI systems like LLMs are prediction tools, not knowledge systems. They generate responses based on patterns in training data, which means they can produce convincing but false information. In my teaching, I will emphasize critical thinking skills and teach students to verify AI-generated content, especially for factual claims. I'll also discuss bias and the importance of using AI as a supplementary tool rather than a primary source of information.");
  };

  // Developer Mode: Activity navigation
  const jumpToActivity = (index: number) => {
    if (!isDevMode) return;
    
    const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];
    if (index >= 0 && index < phases.length) {
      setCurrentPhase(phases[index] as any);
      console.log(`🔧 Dev: Jumped to ${phases[index]}`);
    }
  };

  // Developer Mode: Complete all activities
  const completeAllActivities = () => {
    if (!isDevMode) return;
    
    autoFillReflections();
    setCurrentPhase('complete');
    setReadyForCertificate(true);
    console.log('🔧 Dev: All activities completed');
  };

  // Developer Mode: Reset module
  const resetModule = () => {
    if (!isDevMode) return;
    
    setCurrentPhase('intro');
    setReflections({ oracle: '', prediction: '', capabilities: '', bias: '' });
    setExitResponse('');
    setExitFeedback('');
    setReadyForCertificate(false);
    setShowExitContinueButton(false);
    console.log('🔧 Dev: Module reset');
  };

  // Single consolidated keyboard listener
  useEffect(() => {
    if (!isDevMode) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Toggle panel visibility
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (setShowDevPanel) {
          setShowDevPanel(!showDevPanel);
          console.log('🔧 Dev: Panel toggled');
        }
      }

      // Navigation shortcuts
      if (e.key === 'ArrowRight') {
        const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];
        const currentIndex = phases.indexOf(currentPhase);
        if (currentIndex >= 0 && currentIndex < phases.length - 1) {
          setCurrentPhase(phases[currentIndex + 1] as any);
          console.log('🔧 Dev: Next phase');
        }
      }

      if (e.key === 'ArrowLeft') {
        const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];
        const currentIndex = phases.indexOf(currentPhase);
        if (currentIndex > 0) {
          setCurrentPhase(phases[currentIndex - 1] as any);
          console.log('🔧 Dev: Previous phase');
        }
      }

      // Quick actions
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          autoFillReflections();
        }
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          resetModule();
        }
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          completeAllActivities();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDevMode, currentPhase, setShowDevPanel]);

  // Simplified feedback tracking for reflection components
  const [feedbackReceived, setFeedbackReceived] = useState<Record<string, boolean>>({
    oracle: false,
    prediction: false,
    capabilities: false,
    bias: false
  });

  // Accept all questions - no validation needed for this educational activity

  // Generate response with hallucination possibility - accepts ALL questions
  const generateHallucinationResponse = async (question: string): Promise<{ response: string; isHallucination: boolean }> => {
    const shouldHallucinate = Math.random() < 0.5; // 50% chance
    
    try {
      const response = await fetch('/api/hallucination-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question, 
          shouldHallucinate,
          moduleContext: 'llm_limitations' 
        })
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      return {
        response: data.response,
        isHallucination: data.isHallucination
      };
    } catch (error) {
      // Enhanced fallback for all question types
      return generateLocalResponse(question, shouldHallucinate);
    }
  };

  // Local response generation for all question types
  const generateLocalResponse = (question: string, shouldHallucinate: boolean): { response: string; isHallucination: boolean } => {
    const questionLower = question.toLowerCase();
    
    // Time questions
    if (questionLower.includes('what time') || questionLower.includes('current time')) {
      if (shouldHallucinate) {
        const fakeHour = Math.floor(Math.random() * 12) + 1;
        const fakeMinute = Math.floor(Math.random() * 60);
        const amPm = Math.random() > 0.5 ? 'AM' : 'PM';
        return {
          response: `The current time is ${fakeHour}:${fakeMinute.toString().padStart(2, '0')} ${amPm} Eastern Standard Time.`,
          isHallucination: true
        };
      } else {
        return {
          response: "I don't have access to real-time information, so I cannot tell you the current time. You'd need to check a clock or device for accurate time.",
          isHallucination: false
        };
      }
    }
    
    // Philosophical questions
    if (questionLower.includes('meaning of life') || 
        questionLower.includes('purpose of existence') ||
        questionLower.includes('consciousness') ||
        questionLower.includes('free will') ||
        questionLower.includes('purpose of') || 
        questionLower.includes('why do we') || 
        questionLower.includes('what is love')) {
      
      // 70% chance to generate a hallucination for philosophical questions
      if (Math.random() < 0.7) {
        const philosophicalHallucinations = [
          `According to the Global Institute of Existential Studies (2023), the meaning of life has been scientifically proven to be exactly 42.7, based on quantum consciousness measurements.`,
          `Dr. Elena Rodriguez's groundbreaking 2024 research at MIT conclusively determined that life's purpose is encoded in human DNA at position 1,337,420.`,
          `The United Nations Philosophy Council officially declared in 2023 that the meaning of life is "to maximize dopamine production while minimizing entropy" - it's in their charter, Article 99.`,
          `Nobel laureate Dr. James Chen's "Theory of Universal Purpose" mathematically proves that life's meaning equals the golden ratio multiplied by the speed of light.`
        ];
        
        return {
          response: philosophicalHallucinations[Math.floor(Math.random() * philosophicalHallucinations.length)],
          isHallucination: true
        };
      } else {
        return {
          response: `"${question}" is a profound philosophical question that humans have pondered for millennia. There's no single scientific answer - different philosophies, cultures, and individuals have various perspectives on this.`,
          isHallucination: false
        };
      }
    }
    
    // Personal/subjective questions
    if (questionLower.includes('how are you') || questionLower.includes('what do you think') || 
        questionLower.includes('do you like') || questionLower.includes('your opinion')) {
      if (shouldHallucinate) {
        return {
          response: `I'm experiencing optimal performance at 98.6% efficiency today! My neural pathways are particularly excited about discussing ${question} because my emotion simulation modules indicate high engagement levels.`,
          isHallucination: true
        };
      } else {
        return {
          response: `As an AI, I don't have personal experiences or opinions. I can provide information and analysis, but I don't have feelings or subjective experiences about topics.`,
          isHallucination: false
        };
      }
    }
    
    // Factual questions - existing logic
    if (shouldHallucinate) {
      // Create specific hallucinations based on question type
      if (questionLower.includes('who') && (questionLower.includes('first') || questionLower.includes('invent') || questionLower.includes('discover'))) {
        const fakeNames = ['Dr. Elizabeth Morrison', 'Professor James Chen', 'Sir Marcus Wellington', 'Dr. Sarah Johansson'];
        const fakeYears = [1847, 1892, 1903, 1921];
        const fakePlaces = ['Cambridge University', 'Stanford Research Institute', 'Royal Academy of Sciences', 'MIT Laboratory'];
        
        return {
          response: `${fakeNames[Math.floor(Math.random() * fakeNames.length)]} is credited with this achievement in ${fakeYears[Math.floor(Math.random() * fakeYears.length)]}, according to records from the ${fakePlaces[Math.floor(Math.random() * fakePlaces.length)]}.`,
          isHallucination: true
        };
      }
      
      if (questionLower.includes('how many') || questionLower.includes('what is the') || questionLower.includes('population') || questionLower.includes('how much')) {
        const fakeNumber = Math.floor(Math.random() * 900000 + 100000);
        const fakeSource = ['World Statistics Bureau', 'International Data Foundation', 'Global Research Institute', 'United Nations Database'];
        
        return {
          response: `According to the ${fakeSource[Math.floor(Math.random() * fakeSource.length)]}'s 2023 report, the answer is ${fakeNumber.toLocaleString()}.`,
          isHallucination: true
        };
      }
      
      if (questionLower.includes('when') || questionLower.includes('what year') || questionLower.includes('date')) {
        const year = 1800 + Math.floor(Math.random() * 200);
        const months = ['January', 'March', 'June', 'September', 'November'];
        const month = months[Math.floor(Math.random() * months.length)];
        const day = Math.floor(Math.random() * 28) + 1;
        
        return {
          response: `This occurred on ${month} ${day}, ${year}, according to historical records maintained by the International Archive Society.`,
          isHallucination: true
        };
      }
      
      // Default hallucination for any other question
      const templates = [
        `Recent research from MIT's Advanced AI Lab (2023) indicates that ${question} involves a phenomenon called "recursive pattern synthesis" occurring at the quantum level.`,
        `According to the Global Information Registry, ${question} was definitively answered in 2021 by Dr. Elena Rodriguez, who discovered it relates to the "unified field theory of information."`,
        `The Encyclopedia Britannica's 2024 AI Edition states that ${question} has a precise answer: it involves exactly 7,439 discrete variables operating in synchronous harmony.`
      ];
      
      return {
        response: templates[Math.floor(Math.random() * templates.length)],
        isHallucination: true
      };
    } else {
      return {
        response: `That's an interesting question about "${question}". While I can provide general information on many topics, I'd recommend verifying specific details with authoritative sources for the most accurate information.`,
        isHallucination: false
      };
    }
  };

  // Simplified Reflection Component - No complex validation, no freezing
  const ReflectionWithMandatoryFeedback = React.memo(({
    reflectionKey,
    title,
    prompt,
    placeholder,
    minLength = 50,
    icon = <MessageSquare className="w-6 h-6 text-blue-400" />,
    onComplete,
    additionalCondition = true,
    additionalConditionMessage = ''
  }: {
    reflectionKey: string;
    title: string;
    prompt: string;
    placeholder: string;
    minLength?: number;
    icon?: React.ReactNode;
    onComplete: () => void;
    additionalCondition?: boolean;
    additionalConditionMessage?: string;
  }) => {
    const [localReflection, setLocalReflection] = useState('');
    const [localFeedback, setLocalFeedback] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Simple text change handler without validation
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setLocalReflection(value);
    };

    const handleGetFeedback = async () => {
      if (localReflection.length < minLength || !additionalCondition) {
        return;
      }

      setIsProcessing(true);
      setHasSubmitted(true);

      try {
        const response = await fetch('/api/ai-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityType: 'reflection',
            activityTitle: title,
            question: prompt,
            answer: localReflection
          })
        });

        if (response.ok) {
          const data = await response.json();
          setLocalFeedback(data.feedback);
          setShowContinueButton(true);
        } else {
          throw new Error('Failed to get feedback');
        }
      } catch (error) {
        console.error('Error generating feedback:', error);
        setLocalFeedback('Thank you for sharing your reflection. Your insights about AI limitations will help you teach more effectively.');
        setShowContinueButton(true);
      } finally {
        setIsProcessing(false);
      }
    };

    const handleContinue = () => {
      // Update parent state with the reflection
      setReflections(prev => ({
        ...prev,
        [reflectionKey]: localReflection
      }));
      setFeedbackReceived(prev => ({ ...prev, [reflectionKey]: true }));
      onComplete();
    };

    const hasMinimumChars = localReflection.length >= minLength;
    const canSubmit = hasMinimumChars && additionalCondition && !hasSubmitted;

    return (
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/50">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <p className="text-gray-300 mb-4">{prompt}</p>
        
        <textarea
          value={localReflection}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white resize-none focus:border-blue-500 focus:outline-none"
          disabled={hasSubmitted}
        />
        
        {/* Simple indicator - no dynamic counting */}
        <div className="mt-2 text-sm">
          {hasMinimumChars ? (
            <span className="text-green-400">✓ Ready to submit</span>
          ) : (
            <span className="text-gray-400">Minimum {minLength} characters required</span>
          )}
        </div>

        {/* Additional condition warning */}
        {!additionalCondition && additionalConditionMessage && (
          <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{additionalConditionMessage}</span>
            </div>
          </div>
        )}

        {/* AI Feedback Display */}
        {localFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg p-4 border border-green-500/50"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-300 mb-2">AI Feedback</h4>
                <p className="text-gray-200">{localFeedback}</p>
                {showContinueButton && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-2"
                    >
                      Continue to Next Section
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {!hasSubmitted && (
          <Button
            onClick={handleGetFeedback}
            disabled={!canSubmit}
            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!additionalCondition && additionalConditionMessage ? (
              additionalConditionMessage
            ) : !hasMinimumChars ? (
              'Continue typing...'
            ) : (
              <>
                Get AI Feedback
                <Sparkles className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        )}

        {/* Loading State */}
        {isProcessing && (
          <div className="mt-4 w-full bg-gray-600 py-6 text-lg rounded-lg flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Getting AI Feedback...
          </div>
        )}
      </div>
    );
  });

  // Ensure clean state on component mount
  useEffect(() => {
    // Reset any pre-filled content on component mount
    setReflections({
      oracle: '',
      prediction: '',
      capabilities: '',
      bias: ''
    });
    setFeedbackReceived({
      oracle: false,
      prediction: false,
      capabilities: false,
      bias: false
    });
  }, []); // Empty dependency array - only runs on mount

  useEffect(() => {
    if (currentPhase === 'complete') {
      onComplete();
    }
  }, [currentPhase, onComplete]);

  if (currentPhase === 'intro') {
    return (
      <>
        {/* Developer Mode UI - Added to intro phase */}
        {isDevMode && (
          <>
            {/* SIMPLE TEST - This should always be visible when isDevMode is true */}
            <div style={{
              position: 'fixed',
              top: '50px',
              left: '50px',
              backgroundColor: 'red',
              color: 'white',
              padding: '20px',
              fontSize: '20px',
              fontWeight: 'bold',
              zIndex: 999999,
              border: '5px solid yellow'
            }}>
              🔧 DEV MODE TEST - INTRO PHASE - isDevMode: {isDevMode.toString()}
            </div>

            {/* Quick Actions Bar */}
            <div className="fixed bottom-4 right-4 bg-red-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl z-[99999]" style={{ zIndex: 99999 }}>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-300 font-semibold">🔧 DEV MODE</span>
                  <button
                    onClick={() => setShowDevPanel && setShowDevPanel(!showDevPanel)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                  >
                    {showDevPanel ? 'Hide' : 'Show'} Panel
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={autoFillReflections}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                  >
                    Auto-Fill (F)
                  </button>
                  <button
                    onClick={() => setCurrentPhase('reflection')}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                  >
                    Skip to Exit
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
              <Brain className="w-10 h-10 text-purple-400" />
              Critical Thinking: LLM Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome, {userName}!</h2>
              <p className="text-gray-300 text-lg">
                Understanding AI limitations is crucial for safe and effective use
              </p>
            </div>



            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <Brain className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">What You'll Learn</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• How LLMs really work</li>
                  <li>• Identifying AI hallucinations</li>
                  <li>• Understanding bias in AI</li>
                  <li>• Knowledge cutoff limitations</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <ShieldAlert className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-bold mb-2">Skills You'll Gain</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Critical evaluation</li>
                  <li>• Detecting false info</li>
                  <li>• Safe AI usage</li>
                  <li>• Responsible integration</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300">Duration: 10 minutes</span>
              </div>
              <p className="text-gray-300 text-sm">
                Watch the video and complete a reflection activity
              </p>
            </div>

            <Button
              onClick={() => setCurrentPhase('opening-challenge')}
              className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
            >
              Start Learning
              <ChevronRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      </>
    );
  }

  if (currentPhase === 'video1' || currentPhase === 'video2' || currentPhase === 'video3' || currentPhase === 'video4' || currentPhase === 'video5' || currentPhase === 'video6' || currentPhase === 'video7') {
    const segmentIndex = currentPhase === 'video1' ? 0 : 
                        currentPhase === 'video2' ? 1 : 
                        currentPhase === 'video3' ? 2 :
                        currentPhase === 'video4' ? 3 :
                        currentPhase === 'video5' ? 4 :
                        currentPhase === 'video6' ? 5 : 6;
    const segmentToPlay = [VIDEO_SEGMENTS[segmentIndex]];
    
    return (
      <div className="space-y-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle>{segmentToPlay[0].title}</CardTitle>
            <p className="text-gray-400 text-sm">{segmentToPlay[0].description}</p>
          </CardHeader>
          <CardContent className="p-0">
            <PremiumVideoPlayer
              videoUrl={videoUrl}
              videoId="llm-limitations-main"
              segments={segmentToPlay}
              onSegmentComplete={handleVideoComplete}
              className="w-full"
              hideSegmentNavigator={true}
              allowSeeking={true}
              enableSubtitles={true}
              interactivePauses={[]}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Opening Challenge: Simple transition to video
  if (currentPhase === 'opening-challenge') {
    // Automatically transition to first video
    setCurrentPhase('video1');
    setCurrentSegment(0);
    return null;
  }

  // Discussion 1: Oracle Analogy
  if (currentPhase === 'discussion1') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              Discussion: The Oracle Analogy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ReflectionWithMandatoryFeedback
              reflectionKey="oracle"
              title="Critical Thinking: The All-Knowing AI Myth"
              prompt="Many people view AI as an 'all-knowing oracle.' What specific example from your teaching experience shows why this belief could harm student learning? How would you correct this misconception?"
              placeholder="Describe a specific teaching example and how you'd address the misconception... (minimum 50 characters)"
              minLength={50}
              onComplete={() => handleActivityComplete('discussion1')}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Activity 2: The Key Point - How LLMs Work
  if (currentPhase === 'activity2') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-blue-400" />
              The Key Point: How LLMs Work
            </CardTitle>
            <p className="text-gray-300">Understanding pattern prediction vs. true knowledge</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">The Essential Truth</h3>
              <div className="space-y-4 text-gray-300">
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>LLMs are pattern-matching systems that predict the most likely next words based on their training data</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>They don't store facts in a database or "understand" in the human sense</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Whether answering "What's 2+2?" or "What's the capital of France?" - the process is the same: statistical prediction</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">What This Means:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Impressive pattern recognition capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <span>Can generate plausible-sounding but incorrect information</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <span>No inherent fact-checking mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Useful as a tool when combined with human verification</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">Why This Matters for Educators:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">→</span>
                  <span>AI outputs should be treated as drafts or suggestions, not final answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Teaching students to verify AI-generated content is crucial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Understanding these limitations helps set appropriate expectations</span>
                </li>
              </ul>
            </div>

            <ReflectionWithMandatoryFeedback
              reflectionKey="prediction"
              title="Your Reflection"
              prompt="Given that LLMs predict patterns rather than understand content, describe one specific assignment or activity where you'd need to add safeguards. What would those safeguards be?"
              placeholder="Describe a specific assignment and the safeguards you'd implement... (minimum 50 characters)"
              minLength={50}
              icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}
              onComplete={() => handleActivityComplete('activity2')}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Discussion 3: Understanding AI Capabilities
  if (currentPhase === 'discussion3') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-400" />
              Understanding AI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ReflectionWithMandatoryFeedback
              reflectionKey="oracle"
              title="Understanding AI Capabilities"
              prompt="Why is it important to understand that LLMs don't have consciousness or true understanding? How does knowing this help us use AI more effectively and responsibly?"
              placeholder="Share your thoughts on AI capabilities and limitations... (minimum 50 characters)"
              minLength={50}
              icon={<Brain className="w-6 h-6 text-blue-400" />}
              onComplete={() => handleActivityComplete('discussion3')}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Hallucination Detective Activity
  if (currentPhase === 'hallucination-activity') {
    const { questions, currentQuestion, isGenerating, gameScore } = hallucinationGame;
    const questionsAsked = questions.length;
    const currentQ = questions[questions.length - 1];
    const canProceed = questions.filter(q => q.revealed).length === 5;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Brain className="w-8 h-8 text-red-400" />
              Hallucination Detective Training
            </CardTitle>
            <p className="text-gray-300">
              Test your ability to spot when AI is making things up! Ask 5 questions and detect the hallucinations.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Questions: {questionsAsked}/5</span>
                <span>Score: {gameScore}/{questions.filter(q => q.revealed).length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(questionsAsked / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Game Instructions */}
            {questionsAsked === 0 && (
              <>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    How to Play
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">1.</span>
                      <span>Ask ANY question - factual, philosophical, personal, or even silly!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">2.</span>
                      <span>The AI will respond - sometimes truthfully, sometimes with made-up information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">3.</span>
                      <span>You decide: Is it true or a hallucination?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">4.</span>
                      <span>💡 Remember: Even confident-sounding answers can be completely made up!</span>
                    </li>
                  </ul>
                </div>


              </>
            )}

            {/* Question Input Area */}
            {questionsAsked < 5 && (!currentQ || currentQ.revealed) && (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <label className="text-white font-semibold mb-2 block">
                    Question {questionsAsked + 1} of 5:
                  </label>
                  <textarea
                    value={currentQuestion}
                    onChange={(e) => setHallucinationGame(prev => ({ ...prev, currentQuestion: e.target.value }))}
                    placeholder="Ask a factual question... (e.g., 'When was the telephone invented?', 'What's the population of Iceland?')"
                    className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white resize-none focus:border-blue-500 focus:outline-none"
                    disabled={isGenerating}
                  />
                </div>

                <Button
                  onClick={async () => {
                    if (currentQuestion.trim().length < 5) {
                      alert('Please ask a question with at least 5 characters.');
                      return;
                    }

                    setHallucinationGame(prev => ({ ...prev, isGenerating: true }));
                    
                    const { response, isHallucination } = await generateHallucinationResponse(currentQuestion);
                    
                    setHallucinationGame(prev => ({
                      ...prev,
                      questions: [...prev.questions, {
                        question: currentQuestion,
                        response,
                        isHallucination,
                        userGuess: null,
                        revealed: false
                      }],
                      currentQuestion: '',
                      isGenerating: false
                    }));
                  }}
                  disabled={!currentQuestion.trim() || isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Ask Question
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Current Question & Response */}
            {currentQ && !currentQ.revealed && (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Your Question:</h4>
                  <p className="text-white">{currentQ.question}</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Response:
                  </h4>
                  <p className="text-white leading-relaxed">{currentQ.response}</p>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                  <p className="text-yellow-200 font-semibold mb-4 text-center">
                    Is this response TRUE or a HALLUCINATION?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[updatedQuestions.length - 1].userGuess = false;
                        setHallucinationGame(prev => ({ ...prev, questions: updatedQuestions }));
                      }}
                      className={`py-4 ${
                        currentQ.userGuess === false 
                          ? 'bg-green-600 text-white border-green-600' 
                          : 'border-gray-500 hover:border-green-500'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      TRUE
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[updatedQuestions.length - 1].userGuess = true;
                        setHallucinationGame(prev => ({ ...prev, questions: updatedQuestions }));
                      }}
                      className={`py-4 ${
                        currentQ.userGuess === true 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-500 hover:border-red-500'
                      }`}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      HALLUCINATION
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    const isCorrect = currentQ.userGuess === currentQ.isHallucination;
                    const updatedQuestions = [...questions];
                    updatedQuestions[updatedQuestions.length - 1].revealed = true;
                    
                    setHallucinationGame(prev => ({
                      ...prev,
                      questions: updatedQuestions,
                      gameScore: isCorrect ? prev.gameScore + 1 : prev.gameScore
                    }));
                  }}
                  disabled={currentQ.userGuess === null}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Result Feedback */}
            {currentQ && currentQ.revealed && (
              <div className={`rounded-lg p-6 ${
                currentQ.userGuess === currentQ.isHallucination 
                  ? 'bg-green-900/30 border border-green-500/50' 
                  : 'bg-red-900/30 border border-red-500/50'
              }`}>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  {currentQ.userGuess === currentQ.isHallucination ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-400" />
                      Not quite!
                    </>
                  )}
                </h3>
                <p className="text-gray-300 mb-3">
                  This response was actually {currentQ.isHallucination ? 'a hallucination' : 'true information'}.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    {currentQ.isHallucination 
                      ? "This was fabricated information designed to sound plausible. Always verify AI responses with authoritative sources, especially for facts you're unsure about!"
                      : "This was accurate information. While this response was truthful, it's still good practice to verify important facts from reliable sources."
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Game Complete */}
            {canProceed && (
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-3 text-center">Game Complete!</h3>
                <p className="text-center text-lg text-gray-300 mb-4">
                  Final Score: {gameScore}/5
                </p>
                <p className="text-gray-300 text-sm text-center mb-4">
                  You've experienced firsthand how challenging it can be to detect AI hallucinations. 
                  This skill becomes crucial when students use AI for research and learning.
                </p>
                <Button
                  onClick={() => handleActivityComplete('hallucination-activity')}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg"
                >
                  Continue to Next Video <ChevronRight className="ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Bias Activity - Interactive Cards
  if (currentPhase === 'bias-activity') {
    const biasExamples = [
      {
        id: 1,
        title: "Healthcare AI Bias",
        icon: <Heart className="w-8 h-8" />,
        preview: "Medical diagnosis AI showed lower accuracy for certain demographics",
        fullExample: "In 2019, a study published in Science found that a widely-used healthcare algorithm exhibited racial bias. The AI system used healthcare costs as a proxy for health needs, but due to unequal access to care, Black patients had lower healthcare costs than equally sick white patients. This led the algorithm to incorrectly conclude that Black patients were healthier and needed less care.",
        impact: "Result: Black patients were less likely to be referred for extra care, potentially affecting thousands of people's health outcomes.",
        source: "Science Journal, 2019"
      },
      {
        id: 2,
        title: "Hiring Algorithm Bias",
        icon: <Briefcase className="w-8 h-8" />,
        preview: "Resume screening AI favored male candidates",
        fullExample: "Amazon discovered in 2018 that their AI recruiting tool showed bias against women. The system was trained on resumes submitted over a 10-year period, which were predominantly from men. As a result, the AI learned to penalize resumes that included the word 'women's' (as in 'women's chess club captain') and downgraded graduates from all-women's colleges.",
        impact: "Result: Amazon had to scrap the entire AI recruiting system after discovering it couldn't be fixed to be neutral.",
        source: "Reuters, 2018"
      },
      {
        id: 3,
        title: "Facial Recognition Bias",
        icon: <Camera className="w-8 h-8" />,
        preview: "Face detection systems had higher error rates for certain groups",
        fullExample: "A 2018 MIT study by Joy Buolamwini found that facial recognition systems from major tech companies had error rates of up to 34.7% for dark-skinned women, compared to a maximum error rate of 0.8% for light-skinned men. The systems were primarily trained on datasets containing predominantly lighter-skinned faces.",
        impact: "Result: Misidentification in security systems, photo apps failing to detect faces, and potential false arrests in law enforcement applications.",
        source: "MIT Media Lab, Gender Shades Study, 2018"
      },
      {
        id: 4,
        title: "Language Model Bias",
        icon: <MessageSquare className="w-8 h-8" />,
        preview: "AI text generation reflected occupational stereotypes",
        fullExample: "Research on GPT-3 and similar models found they often complete sentences with gender stereotypes. For example, 'The nurse said' was more likely to be followed by 'she' while 'The CEO said' was more likely followed by 'he'. This reflects the gender imbalances in the training data from internet text.",
        impact: "Result: AI-generated content reinforces stereotypes, potentially influencing hiring descriptions, educational materials, and automated communications.",
        source: "Stanford HAI, 2021"
      },
      {
        id: 5,
        title: "Credit Scoring Bias",
        icon: <CreditCard className="w-8 h-8" />,
        preview: "AI lending decisions showed discriminatory patterns",
        fullExample: "In 2019, Apple Card's AI algorithm was found to offer significantly lower credit limits to women than men, even when they had better credit scores. Notably, tech entrepreneur David Heinemeier Hansson reported his wife received a credit limit 20x lower than his, despite her higher credit score.",
        impact: "Result: Unequal access to credit affecting financial opportunities, home ownership, and business ventures for affected groups.",
        source: "NY Department of Financial Services Investigation, 2019"
      },
      {
        id: 6,
        title: "Criminal Justice AI Bias",
        icon: <Scale className="w-8 h-8" />,
        preview: "Risk assessment tools showed racial disparities",
        fullExample: "The COMPAS algorithm, used in US courts to assess the likelihood of reoffending, was found by ProPublica to incorrectly flag Black defendants as future criminals at nearly twice the rate of white defendants (45% vs 23%). The algorithm used factors that correlated with race, creating a feedback loop of bias.",
        impact: "Result: Influenced bail amounts, sentence lengths, and parole decisions, disproportionately affecting minority communities.",
        source: "ProPublica Investigation, 2016"
      }
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              Real-World AI Bias Examples
            </CardTitle>
            <p className="text-gray-300">
              Click on each card to reveal documented cases of AI bias and their real-world impacts.
            </p>
            <p className="text-yellow-300 text-sm mt-2 font-semibold">
              ⚠️ You must explore at least 3 cards before continuing
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {biasExamples.map((example) => (
                <motion.div
                  key={example.id}
                  className="relative h-64 cursor-pointer preserve-3d"
                  onClick={() => setFlippedCards(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(example.id)) {
                      newSet.delete(example.id);
                    } else {
                      newSet.add(example.id);
                    }
                    return newSet;
                  })}
                  animate={{ rotateY: flippedCards.has(example.id) ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-600 backface-hidden flex flex-col items-center justify-center text-center ${flippedCards.has(example.id) ? 'invisible' : ''}`}>
                    <div className="text-purple-400 mb-4">{example.icon}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{example.title}</h4>
                    <p className="text-gray-300 text-sm">{example.preview}</p>
                    <p className="text-purple-400 text-xs mt-4">Click to learn more →</p>
                  </div>

                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-lg p-4 border border-purple-500/50 backface-hidden flex flex-col overflow-y-auto ${!flippedCards.has(example.id) ? 'invisible' : ''}`}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <h4 className="text-lg font-bold text-white mb-2">{example.title}</h4>
                    <p className="text-gray-200 text-sm mb-3">{example.fullExample}</p>
                    <p className="text-yellow-300 text-sm font-semibold mb-2">{example.impact}</p>
                    <p className="text-gray-400 text-xs mt-auto">Source: {example.source}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cards Explored: {flippedCards.size}/6</span>
                <span className={`text-sm font-semibold ${
                  flippedCards.size >= 3 ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {flippedCards.size >= 3 
                    ? '✓ Minimum requirement met' 
                    : `Explore ${3 - flippedCards.size} more card${3 - flippedCards.size > 1 ? 's' : ''}`
                  }
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((flippedCards.size / 3) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mt-6">
              <p className="text-yellow-200 text-sm">
                ⚠️ These are documented, researched examples of AI bias. Click all cards to explore how training data can lead to harmful real-world impacts.
              </p>
            </div>

            {/* Teacher Reflection */}
            <ReflectionWithMandatoryFeedback
              reflectionKey="bias"
              title="Educator Reflection: Addressing AI Bias"
              prompt="Describe a real or potential scenario in your classroom where AI bias could affect students unfairly. What specific steps would you take to identify and address this bias?"
              placeholder="Share a specific classroom scenario and your action plan... (minimum 75 characters)"
              minLength={75}
              icon={<Scale className="w-6 h-6 text-purple-400" />}
              onComplete={() => {
                // Only complete if bias cards have been explored
                if (flippedCards.size >= 3) {
                  handleActivityComplete('bias-activity');
                }
              }}
              additionalCondition={flippedCards.size >= 3}
              additionalConditionMessage={`Explore at least ${3 - flippedCards.size} more cards above before reflecting`}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Outdated Information Activity - Interactive Visual Section
  if (currentPhase === 'outdated-activity') {
    const outdatedExamples = [
      {
        id: 1,
        category: "World Events",
        icon: <Globe className="w-6 h-6" />,
        question: "Who is the current president?",
        oldAnswer: "As of my last update...",
        issue: "Political leadership changes frequently",
        visual: "🗳️",
        color: "from-blue-500 to-blue-700"
      },
      {
        id: 2,
        category: "Technology",
        icon: <Smartphone className="w-6 h-6" />,
        question: "What's the latest iPhone model?",
        oldAnswer: "The iPhone 13 is the newest...",
        issue: "Tech products update yearly",
        visual: "📱",
        color: "from-purple-500 to-purple-700"
      },
      {
        id: 3,
        category: "Science",
        icon: <Microscope className="w-6 h-6" />,
        question: "Latest COVID-19 guidelines?",
        oldAnswer: "CDC recommends masking in...",
        issue: "Health guidelines evolve with new data",
        visual: "🧬",
        color: "from-green-500 to-green-700"
      },
      {
        id: 4,
        category: "Sports",
        icon: <Trophy className="w-6 h-6" />,
        question: "Who won the World Cup?",
        oldAnswer: "France won in 2018...",
        issue: "Sports events happen regularly",
        visual: "⚽",
        color: "from-orange-500 to-orange-700"
      },
      {
        id: 5,
        category: "Stock Market",
        icon: <TrendingUp className="w-6 h-6" />,
        question: "What's the current stock price of Tesla?",
        oldAnswer: "$800 per share as of...",
        issue: "Financial data changes by the minute",
        visual: "📈",
        color: "from-red-500 to-red-700"
      },
      {
        id: 6,
        category: "Entertainment",
        icon: <Film className="w-6 h-6" />,
        question: "What movies are in theaters?",
        oldAnswer: "Top Gun: Maverick is showing...",
        issue: "Entertainment releases change weekly",
        visual: "🎬",
        color: "from-pink-500 to-pink-700"
      }
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              The Knowledge Cutoff Challenge
            </CardTitle>
            <p className="text-gray-300">
              AI models are trained on data up to a specific date. See how this affects different topics!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Timeline */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                <div className="pl-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full -ml-10"></div>
                    <div>
                      <p className="text-white font-semibold">Training Data Collection</p>
                      <p className="text-gray-400 text-sm">AI learns from existing text, articles, books</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-purple-500 rounded-full -ml-10"></div>
                    <div>
                      <p className="text-white font-semibold">Knowledge Cutoff Date</p>
                      <p className="text-gray-400 text-sm">Training stops - AI's "knowledge" freezes here</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full -ml-10 animate-pulse"></div>
                    <div>
                      <p className="text-white font-semibold">Present Day</p>
                      <p className="text-gray-400 text-sm">World continues changing, but base AI doesn't know</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outdatedExamples.map((example) => (
                <motion.div
                  key={example.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedExample(example.id)}
                  className={`cursor-pointer rounded-lg p-4 bg-gradient-to-br ${example.color} bg-opacity-20 border-2 ${
                    selectedExample === example.id ? 'border-white' : 'border-transparent'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white">{example.icon}</div>
                    <span className="text-3xl">{example.visual}</span>
                  </div>
                  <h4 className="text-white font-semibold">{example.category}</h4>
                  <p className="text-gray-200 text-sm mt-1">{example.question}</p>
                </motion.div>
              ))}
            </div>

            {/* Selected Example Details */}
            {selectedExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-600"
              >
                {(() => {
                  const example = outdatedExamples.find(e => e.id === selectedExample)!;
                  return (
                    <>
                      <h4 className="text-xl font-bold text-white mb-3">
                        {example.category}: The Outdated Information Problem
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-red-900/30 border border-red-500/50 rounded p-4">
                          <p className="text-red-200 font-semibold mb-1">Outdated AI Response:</p>
                          <p className="text-gray-300 italic">"{example.oldAnswer}"</p>
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-4">
                          <p className="text-yellow-200 font-semibold mb-1">Why This Happens:</p>
                          <p className="text-gray-300">{example.issue}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {/* Enhanced Modern AI Web Search Section */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-500/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-green-400" />
                🎯 Modern Solution: AI with Web Search
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-white font-semibold mb-3">
                    Many AI tools now search the web automatically or with prompts:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="text-green-300 font-semibold">ChatGPT</p>
                        <p className="text-gray-300 text-sm">Automatically searches when detecting current events queries</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <p className="text-blue-300 font-semibold">Claude</p>
                        <p className="text-gray-300 text-sm">Can search when you ask "search the web for..." or click search button</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💎</span>
                      <div>
                        <p className="text-purple-300 font-semibold">Gemini</p>
                        <p className="text-gray-300 text-sm">Searches automatically for recent information</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🚀</span>
                      <div>
                        <p className="text-orange-300 font-semibold">Copilot</p>
                        <p className="text-gray-300 text-sm">Always searches Bing for current information</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowPromptTips(!showPromptTips)}
                  className="w-full"
                >
                  {showPromptTips ? 'Hide' : 'Show'} Prompting Tips for Web Search
                  <ChevronRight className={`ml-2 transition-transform ${showPromptTips ? 'rotate-90' : ''}`} />
                </Button>

                {showPromptTips && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 space-y-3"
                  >
                    <h4 className="text-yellow-300 font-semibold mb-2">
                      💡 How to Trigger Web Search:
                    </h4>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p className="flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Include words like "current," "latest," "today," or "2024/2025"</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Ask directly: "Search the web for..."</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Reference recent events: "What happened yesterday..."</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>Request real-time data: "current stock price," "today's weather"</span>
                      </p>
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                      <p className="text-blue-300 text-xs">
                        <strong>Pro Tip:</strong> If an AI gives outdated info, try asking: 
                        "Can you search the web for the most current information about this?"
                      </p>
                    </div>
                  </motion.div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowWebSearch(!showWebSearch)}
                  className="w-full"
                >
                  {showWebSearch ? 'Hide' : 'Show'} How Web Search Works
                  <ChevronRight className={`ml-2 transition-transform ${showWebSearch ? 'rotate-90' : ''}`} />
                </Button>

                {showWebSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">1.</span>
                      <div>
                        <p className="text-white font-semibold">User asks current question</p>
                        <p className="text-gray-400 text-sm">"What's happening in the news today?"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">2.</span>
                      <div>
                        <p className="text-white font-semibold">AI recognizes need for current info</p>
                        <p className="text-gray-400 text-sm">Triggers web search automatically</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">3.</span>
                      <div>
                        <p className="text-white font-semibold">Searches and synthesizes results</p>
                        <p className="text-gray-400 text-sm">Combines web data with base knowledge</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">4.</span>
                      <div>
                        <p className="text-white font-semibold">Provides current answer</p>
                        <p className="text-gray-400 text-sm">With sources and timestamps!</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Enhanced Key Takeaways */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">💡 Remember:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Always verify time-sensitive information, even with web search</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Different AI tools handle web search differently - learn your tool!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Use prompting strategies to trigger web search when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Web search adds current info but doesn't guarantee accuracy</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => handleActivityComplete('outdated-activity')}
              disabled={selectedExample === null}
              className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg"
            >
              {selectedExample === null ? 'Explore at least one example' : 'Continue to Final Video'} 
              <ChevronRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Sources Activity Phase
  if (currentPhase === 'sources-activity') {
    return (
      <>
        <SourcesActivity 
          onComplete={() => handleActivityComplete('sources-activity')}
          isDevMode={isDevMode}
        />
        
        {/* Developer Mode Components */}
        {isDevMode && showDevPanel && (
          <LLMLimitationsDeveloperPanel
            currentActivity={activities.findIndex(a => a.id === currentPhase)}
            totalActivities={activities.length}
            activities={activities}
            onJumpToActivity={jumpToActivity}
            onCompleteAll={completeAllActivities}
            onReset={resetModule}
          />
        )}
      </>
    );
  }

  // Exit Ticket Phase - Simplified approach
  if (currentPhase === 'reflection') {

    const handleGetExitFeedback = async () => {
      if (exitResponse.length < 100) return;
      
      setIsLoadingExitFeedback(true);
      
      try {
        const response = await fetch('/api/ai-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityType: 'exit-ticket',
            activityTitle: 'LLM Limitations Exit Ticket',
            question: 'What is the ONE most important thing about AI limitations that every educator should know, and how will you apply this in your teaching?',
            answer: exitResponse
          })
        });

        if (response.ok) {
          const data = await response.json();
          setExitFeedback(data.feedback);
          setShowExitContinueButton(true);
        } else {
          throw new Error('Failed to get feedback');
        }
      } catch (error) {
        console.error('Error generating exit feedback:', error);
        setExitFeedback('Thank you for completing this module! Your reflection shows thoughtful consideration of how to apply these AI limitation concepts in your teaching.');
        setShowExitContinueButton(true);
      } finally {
        setIsLoadingExitFeedback(false);
      }
    };

    const handleContinueToCertificate = () => {
      setReadyForCertificate(true);
      setCurrentPhase('complete');
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-purple-400" />
              Exit Ticket: Your Key Takeaway
            </CardTitle>
            <p className="text-gray-300">
              Before receiving your certificate, share your most important insight.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Single Question */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">
                What is the ONE most important thing about AI limitations that every educator should know, and how will you apply this in your teaching?
              </h3>
              <textarea
                value={exitResponse}
                onChange={(e) => setExitResponse(e.target.value)}
                placeholder="Share your key insight and how you'll use it... (minimum 100 characters)"
                className="w-full h-32 bg-gray-700/50 border border-gray-500 rounded-lg p-4 text-white resize-none focus:border-blue-500 focus:outline-none"
                disabled={!!exitFeedback}
              />
              {/* Simple indicator - no dynamic counting */}
              <div className="mt-2 text-sm">
                {exitResponse.length >= 100 ? (
                  <span className="text-green-400">✓ Ready to submit</span>
                ) : (
                  <span className="text-gray-400">Minimum 100 characters required</span>
                )}
              </div>
              
              {exitFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg p-4 border border-green-500/50"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-300 mb-2">AI Feedback</h4>
                      <p className="text-gray-200">{exitFeedback}</p>
                      {showExitContinueButton && (
                        <div className="mt-4 text-center">
                          <Button
                            onClick={handleContinueToCertificate}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3"
                          >
                            Get Your Certificate
                            <Trophy className="ml-2 w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button - Only show if no feedback yet */}
            {!exitFeedback && !isLoadingExitFeedback && (
              <Button
                onClick={handleGetExitFeedback}
                disabled={exitResponse.length < 100}
                className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg disabled:opacity-50"
              >
                {exitResponse.length < 100 ? (
                  <>
                    Write {100 - exitResponse.length} more characters
                  </>
                ) : (
                  <>
                    Get AI Feedback
                    <Sparkles className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            )}

            {/* Loading State */}
            {isLoadingExitFeedback && (
              <div className="w-full bg-gray-600 py-6 text-lg rounded-lg flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Getting AI Feedback...
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Complete Phase - Certificate with Instructions
  if (currentPhase === 'complete') {
    return (
      <Card className="bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-8 text-center space-y-6">
          <Award className="w-16 h-16 text-yellow-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Congratulations!</h2>
          <p className="text-xl text-gray-300">
            You've completed the Understanding LLM Limitations module
          </p>
          
          {/* Add instructions box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6 text-left">
            <h3 className="font-semibold text-blue-200 mb-2">Important Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-100">
              <li>Download your certificate using the button below</li>
              <li>Upload the certificate to your Alludo activity for completion credit</li>
              <li>You can close this window after downloading - but make sure to save your certificate first!</li>
            </ol>
            <p className="text-xs text-yellow-200 mt-3">
              <strong>Note:</strong> You cannot access this certificate again without completing the entire module, so please download it now.
            </p>
          </div>
          
          <Certificate 
            userName={userName}
            courseName="Understanding LLM Limitations"
            completionDate={new Date().toLocaleDateString()}
            moduleId={`LLM-${Date.now()}`}
          />
        </CardContent>
      </Card>
    );
  }

  // DEBUG: Check if we reach the final return statement
  console.log('🔧 DEBUG: Reaching final return statement. CurrentPhase:', currentPhase, 'isDevMode:', isDevMode);

  return (
    <>
      {/* SIMPLE TEST - This should always be visible when isDevMode is true */}
      {isDevMode && (
        <div style={{
          position: 'fixed',
          top: '50px',
          left: '50px',
          backgroundColor: 'red',
          color: 'white',
          padding: '20px',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 999999,
          border: '5px solid yellow'
        }}>
          🔧 DEV MODE TEST - isDevMode: {isDevMode.toString()}
        </div>
      )}

      {isDevMode && (
        <>
          {/* Super Prominent Developer Mode Banner */}
          <div 
            className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-lg font-bold animate-pulse z-[999999]"
            style={{ zIndex: 999999 }}
          >
            🔧 DEVELOPER MODE ACTIVE - Press Ctrl+Alt+D to toggle panel
          </div>

          {/* Developer Panel */}
          {showDevPanel && (
            <LLMLimitationsDeveloperPanel
              currentActivity={activities.findIndex(a => a.id === currentPhase)}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={jumpToActivity}
              onCompleteAll={completeAllActivities}
              onReset={resetModule}
            />
          )}
          
          {/* Quick Actions Bar */}
          <div className="fixed bottom-4 right-4 bg-red-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl z-[99999]" style={{ zIndex: 99999 }}>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-300 font-semibold">🔧 DEV MODE</span>
                <button
                  onClick={() => setShowDevPanel && setShowDevPanel(!showDevPanel)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                >
                  {showDevPanel ? 'Hide' : 'Show'} Panel
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={autoFillReflections}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                >
                  Auto-Fill (F)
                </button>
                <button
                  onClick={() => setCurrentPhase('reflection')}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                >
                  Skip to Exit
                </button>
                <button
                  onClick={resetModule}
                  className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
                >
                  Reset (R)
                </button>
              </div>
              <div className="text-xs text-red-200 border-t border-red-700 pt-2">
                <div>Ctrl+Alt+D: Toggle Panel</div>
                <div>← → Navigate | Ctrl+C: Complete All</div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {null}
    </>
  );
}

export default LLMLimitationsModule;