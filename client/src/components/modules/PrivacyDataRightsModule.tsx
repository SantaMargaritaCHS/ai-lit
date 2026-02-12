import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, CheckCircle, AlertTriangle, ArrowRight,
  User, Clock, Loader2, Send, Sparkles, Book, Scale,
  Zap, Eye
} from 'lucide-react';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';
import { generateEducationFeedback, isNonsensical, checkFeedbackRejection } from '@/utils/aiEducationFeedback';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry, type ActivityType } from '@/context/ActivityRegistryContext';
import { saveProgress, loadProgress, clearProgress } from '@/lib/progressPersistence';
import { TCTimerChallenge } from '@/components/PrivacyModule/TCTimerChallenge';
import { PolicyMythsQuiz } from '@/components/PrivacyModule/PolicyMythsQuiz';
import { PolicyComparisonTable } from '@/components/PrivacyModule/PolicyComparisonTable';
import { ToolsComparison } from '@/components/PrivacyModule/ToolsComparison';
import { generateWorksCited, getCitation } from '@/data/privacyPolicyCitations';
import { Certificate } from '@/components/Certificate';
import ResumeProgressDialog from '../WhatIsAIModule/ResumeProgressDialog';

const MODULE_ID = 'privacy-data-rights';

// Video URLs - relative Firebase Storage paths for PremiumVideoPlayer compatibility
const VIDEO_URLS = {
  chatPrivate: 'Videos/Privacy and AI Tools What You Need to Know/Your_AI_Chat_Isn_t_Private.mp4',
  dataAndYou: 'Videos/Privacy and AI Tools What You Need to Know/AI,_Your_Data,_and_You.mp4',
};

interface PrivacyDataRightsModuleProps {
  onComplete?: () => void;
  userName?: string;
}

// Jordan's College Essay Simulation Component
const JordanSimulation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'chat1' | 'time' | 'chat2' | 'reveal'>('intro');
  const [messages1, setMessages1] = useState<Array<{role: string, content: string}>>([]);
  const [messages2, setMessages2] = useState<Array<{role: string, content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedData, setHighlightedData] = useState<string[]>([]);
  const [showBreachNotification, setShowBreachNotification] = useState(false);

  const chat1Ref = useRef<HTMLDivElement>(null);
  const chat2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat1Ref.current) chat1Ref.current.scrollTop = chat1Ref.current.scrollHeight;
  }, [messages1]);

  useEffect(() => {
    if (chat2Ref.current) chat2Ref.current.scrollTop = chat2Ref.current.scrollHeight;
  }, [messages2]);

  useEffect(() => {
    if (stage === 'time') {
      const timer = setTimeout(() => {
        setStage('chat2');
        setTimeout(() => animateChat(2), 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const chat1Script = [
    { role: 'student', content: "Hey, can you help me revise my college essay? It's about overcoming personal challenges. I want to make it sound more powerful." },
    { role: 'ai', content: "Of course! I'd be happy to help. Please paste your essay, and I'll provide some suggestions." },
    { role: 'student', content: "Okay, here it is:\n\nMy name is Jordan Chen, and I'm a senior at Lincoln High, Class of 2027. It hasn't been easy maintaining my 3.7 GPA. My anxiety has been a constant battle, especially since my parents' divorce last year. Living with my mom, who works two jobs, means I have to be independent. Balancing my part-time job with the debate team has taught me a lot about resilience. I'm hoping to show colleges like UCLA, Berkeley, and USC that I'm ready for anything." },
    { role: 'ai', content: "This is a powerful start, Jordan. The vulnerability you show is compelling. Let's refine the language to highlight your strength..." }
  ];

  const chat2Script = [
    { role: 'student', content: "I need help brainstorming a topic for my college essay. I want to write about overcoming challenges but need some inspiration." },
    { role: 'ai', content: "Certainly. Many compelling essays focus on resilience. For example, I recently worked with Jordan Chen from Lincoln High (Class of 2027), who wrote a powerful essay about navigating anxiety and their parents' divorce while maintaining a 3.7 GPA. This student's experience balancing a part-time job with the debate team was a great example of overcoming adversity." }
  ];

  const animateChat = async (chatNumber: 1 | 2) => {
    const script = chatNumber === 1 ? chat1Script : chat2Script;
    const setMessages = chatNumber === 1 ? setMessages1 : setMessages2;

    for (let i = 0; i < script.length; i++) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsTyping(false);
      setMessages(prev => [...prev, script[i]]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (chatNumber === 2 && i === 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightedData(['Jordan Chen', 'Lincoln High', 'anxiety', 'parents\' divorce', 'divorced', '3.7 GPA', 'debate team', 'part-time job']);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowBreachNotification(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-6">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-3xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 text-2xl text-center">
                  The College Essay Leak: A True Story (That Could Happen to You)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 text-lg">
                  Meet <strong className="text-slate-900">Jordan</strong>, a 17-year-old high school senior trying to write
                  the perfect college essay. To get some help, Jordan turns to a popular AI chatbot.
                </p>
                <Button
                  onClick={() => {
                    setStage('chat1');
                    setTimeout(() => animateChat(1), 500);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Watch Jordan's Story Unfold
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'chat1' && (
          <motion.div key="chat1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 text-lg font-bold">Chat #1: Jordan's Session</div>
                  <Badge className="bg-blue-500 text-white">Monday, Oct 15, 8:00 PM</Badge>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2 mt-2">
                  <User className="w-4 h-4" />
                  Jordan Chen - High School Senior
                </div>
              </CardHeader>
              <CardContent>
                <div ref={chat1Ref} className="bg-slate-100 rounded-lg p-4 h-96 overflow-y-auto border border-slate-200">
                  {messages1.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'student' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-md ${
                        msg.role === 'student' ? 'bg-blue-600' : 'bg-slate-600'
                      }`}>
                        <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {msg.role === 'student' ? 'Jordan (USER)' : 'AI'}
                      </p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-left mb-4">
                      <div className="inline-block p-3 rounded-lg bg-slate-600">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {messages1.length >= 4 && (
                  <Button
                    onClick={() => setStage('time')}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Two Weeks Later...
                    <Clock className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'time' && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center max-w-2xl p-6">
              <Clock className="w-24 h-24 text-white mx-auto animate-spin-slow mb-8" />
              <h2 className="text-4xl font-bold text-white mb-4">Two Weeks Later...</h2>
              <p className="text-xl text-gray-200">
                Another student, Alex, from a different school, is also working on college essays
                and logs into the same AI tool.
              </p>
            </div>
          </div>
        )}

        {stage === 'chat2' && (
          <motion.div key="chat2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 text-lg font-bold">Chat #2: Alex's Session</div>
                  <Badge className="bg-orange-500 text-white">Monday, Oct 29, 4:30 PM</Badge>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2 mt-2">
                  <User className="w-4 h-4" />
                  Alex - Different High School
                </div>
              </CardHeader>
              <CardContent>
                <div ref={chat2Ref} className="bg-slate-100 rounded-lg p-4 h-96 overflow-y-auto border border-slate-200">
                  {messages2.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'student' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-md ${
                        msg.role === 'student' ? 'bg-orange-500' : 'bg-slate-600'
                      }`}>
                        <p className="text-white text-sm">
                          {idx === 1 ? (
                            (() => {
                              let displayContent = msg.content;
                              const sortedData = [...highlightedData].sort((a, b) => b.length - a.length);

                              sortedData.forEach(data => {
                                const regex = new RegExp(`(${data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                                displayContent = displayContent.replace(regex, '###HIGHLIGHT###$1###ENDHIGHLIGHT###');
                              });

                              const parts = displayContent.split(/###HIGHLIGHT###|###ENDHIGHLIGHT###/);
                              return parts.map((part, i) => {
                                if (i % 2 === 1) {
                                  return <span key={i} className="bg-yellow-300 text-black px-1 mx-0.5 rounded font-bold">{part}</span>;
                                }
                                return <span key={i}>{part}</span>;
                              });
                            })()
                          ) : msg.content}
                        </p>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {msg.role === 'student' ? 'Alex (USER)' : 'AI'}
                      </p>
                    </div>
                  ))}
                </div>
                {showBreachNotification && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-red-600 p-4 rounded-lg animate-shake">
                      <p className="text-white font-bold text-center text-lg">
                        PRIVACY BREACH!
                      </p>
                      <p className="text-white text-center mt-2">
                        Look at all the <span className="bg-yellow-300 text-black px-1 rounded">highlighted data</span> above —
                        Jordan's most personal details were just leaked to a complete stranger.
                      </p>
                    </div>
                    <Button
                      onClick={() => setStage('reveal')}
                      className="w-full bg-red-700 hover:bg-red-800 text-white"
                    >
                      What Just Happened?
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 text-2xl text-center">
                  <AlertTriangle className="w-8 h-8 inline mr-2 text-amber-500" />
                  The Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-100/60 p-6 rounded-lg border-2 border-red-400">
                  <p className="text-slate-900 text-lg mb-4">
                    Jordan's most personal details—name, school, mental health struggles,
                    family situation, and college list—were just leaked to a complete stranger.
                  </p>
                  <p className="text-red-700">
                    The AI <strong>doesn't understand privacy, trust, or social boundaries</strong>.
                    It processes everything as data patterns and can use any information from past
                    conversations as examples for future users.
                  </p>
                </div>

                <div className="bg-blue-100/70 p-6 rounded-lg border-2 border-blue-400">
                  <p className="text-slate-900 text-lg font-medium">
                    This isn't a made-up scare story. AI companies openly admit in their terms
                    of service that this is how their systems work.{' '}
                    <a
                      href={getCitation(1)?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 underline font-semibold"
                      title={getCitation(1)?.title}
                    >
                      <sup>[1]</sup>
                    </a>
                  </p>
                  <p className="text-slate-700 text-lg font-medium mt-3">
                    Let's look at how this actually happens...
                  </p>
                </div>

                <Button
                  onClick={onComplete}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
                >
                  Understand How AI Uses Your Data
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Segment definitions (17 segments, 0-16)
const segments = [
  { id: 0, title: 'Welcome to Module', type: 'intro' as const },
  { id: 1, title: 'VIDEO: Using AI Safely', type: 'video' as const },
  { id: 2, title: 'See It In Action', type: 'transition' as const },
  { id: 3, title: "Jordan's Story", type: 'interactive' as const },
  { id: 4, title: 'VIDEO: The 3-Step Data Journey', type: 'video' as const },
  { id: 5, title: 'Policy Myths Quiz', type: 'quiz' as const },
  { id: 6, title: 'But Can You Opt Out?', type: 'transition' as const },
  { id: 7, title: 'VIDEO: The Opt-Out Paradigm', type: 'video' as const },
  { id: 8, title: 'T&C Timer Challenge', type: 'interactive' as const },
  { id: 9, title: 'Policy Comparison Table', type: 'interactive' as const },
  { id: 10, title: 'VIDEO: School vs Consumer Tools', type: 'video' as const },
  { id: 11, title: 'AI Tools Guide', type: 'interactive' as const },
  { id: 12, title: 'VIDEO: Protect Yourself', type: 'video' as const },
  { id: 13, title: 'Your Action Plan', type: 'interactive' as const },
  { id: 14, title: 'VIDEO: Conclusion', type: 'video' as const },
  { id: 15, title: 'Final Reflection', type: 'exit-ticket' as const },
  { id: 16, title: 'Works Cited & Certificate', type: 'outro' as const },
];

export default function PrivacyDataRightsModule({
  onComplete,
  userName = "Student"
}: PrivacyDataRightsModuleProps) {
  const { isDevModeActive } = useDevMode();
  const { registerActivity, clearRegistry } = useActivityRegistry();

  // Segment state
  const [currentSegment, setCurrentSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [overviewScreen, setOverviewScreen] = useState(0);

  // Resume dialog state
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgressSummary, setSavedProgressSummary] = useState<{
    activityIndex: number;
    activityTitle: string;
    totalActivities: number;
    lastUpdated: string;
  } | null>(null);

  // Exit ticket state - 2-layer validation
  const [exitTicketAnswers, setExitTicketAnswers] = useState<{[key: string]: string}>({});
  const [exitTicketFeedback, setExitTicketFeedback] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [showExitFeedback, setShowExitFeedback] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  // Action plan flip cards
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const isMountedRef = useRef(true);
  const MAX_ATTEMPTS = 2;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Register activities for Developer Mode
  useEffect(() => {
    clearRegistry();
    segments.forEach((segment, index) => {
      registerActivity({
        id: `segment-${segment.id}`,
        type: segment.type as ActivityType,
        name: segment.title,
        completed: completedSegments.includes(index),
      });
    });
  }, []);

  // Listen for Developer Mode navigation
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      if (activityIndex >= 0 && activityIndex < segments.length) {
        setCurrentSegment(activityIndex);
      }
    };
    window.addEventListener('goToActivity', handleGoToActivity as EventListener);
    return () => window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
  }, []);

  // Progress persistence - load on mount
  useEffect(() => {
    const activityStates = segments.map((s) => ({
      id: `segment-${s.id}`,
      title: s.title,
      completed: false,
    }));
    const progress = loadProgress(MODULE_ID, activityStates);
    if (progress) {
      setSavedProgressSummary({
        activityIndex: progress.currentActivity,
        activityTitle: progress.activities[progress.currentActivity]?.title || 'Unknown',
        totalActivities: progress.activities.length,
        lastUpdated: new Date(progress.lastUpdated).toLocaleString(),
      });
      setShowResumeDialog(true);
    }
  }, []);

  // Auto-save progress on segment change
  useEffect(() => {
    if (!showResumeDialog && currentSegment > 0) {
      const activityStates = segments.map((s, i) => ({
        id: `segment-${s.id}`,
        title: s.title,
        completed: completedSegments.includes(i),
      }));
      saveProgress(MODULE_ID, currentSegment, activityStates);
    }
  }, [currentSegment, completedSegments, showResumeDialog]);

  const handleNextSegment = () => {
    if (!completedSegments.includes(currentSegment)) {
      setCompletedSegments(prev => [...prev, currentSegment]);
    }
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCertificate(true);
    }
  };

  // Dev mode responses for exit ticket
  const DEV_RESPONSES = {
    good: {
      'school-vs-consumer': "Before this module, I mostly used ChatGPT Free for everything without thinking twice. The biggest thing I learned is that school-safe tools like Microsoft Copilot Education are fundamentally different from consumer tools like ChatGPT Free or Snapchat My AI. With school tools, the school district is the customer, so the company has legal obligations to protect student data and can't use it for training or ads. With consumer tools, YOU are the product - they train on your conversations and can share data with advertisers. Now I'll use my school's tools for anything involving personal details or schoolwork, and if I use consumer tools, I'll strip out all identifying information first.",
      'friend-advice': "I'd tell my friend to STOP immediately and not paste that essay. I'd explain what happened to Jordan in this module - how a student shared their real name, school, GPA, and personal struggles with an AI chatbot, and weeks later the AI repeated all of those private details to a complete stranger. ChatGPT Free's terms of service actually say they can use your conversations to train their model, which means your essay details could end up as training data. Instead, I'd recommend they use their school's AI tool (like Microsoft Copilot Education) which has privacy protections, or at minimum strip out all identifying information - change their real name to 'Student A', their school to 'a high school', and generalize any personal details."
    },
    generic: "I think privacy is important and I learned some stuff about AI tools. They use your data and that's not great. I'll probably be more careful I guess.",
    complaint: "This module was way too long and boring. I don't see why we need to learn about privacy when everyone already knows AI collects data. Just let me finish and get my certificate.",
    gibberish: "asdfkj alksjdf privacy blah blah data whatever lol idk just let me pass aaaaaa"
  };

  const handleDevAutoFill = () => {
    if (!isDevModeActive) return;
    setExitTicketAnswers(DEV_RESPONSES.good);
    setExitTicketFeedback("Excellent reflection! Your understanding of AI privacy shows real depth. You've correctly identified the key differences between school-safe and consumer tools, and your advice to a friend demonstrates practical application of these concepts. Well done!");
    setShowExitFeedback(true);
    setNeedsRetry(false);
    setTimeout(() => handleNextSegment(), 1000);
  };

  // Exit ticket validation with 2-layer system
  const handleExitTicketSubmit = async () => {
    const combinedResponse = Object.values(exitTicketAnswers).join('\n\n');
    const combinedQuestion = "Reflection on AI privacy: (1) What's the biggest difference between school-safe and consumer AI tools, and how will you change your approach? (2) What would you tell a friend about the privacy risks of pasting personal info into ChatGPT Free?";

    // Layer 1: Pre-filter
    if (isNonsensical(combinedResponse)) {
      setExitTicketFeedback("Your response needs more depth. Please write at least 2-3 complete sentences for each question with specific thoughts about AI privacy and data rights.");
      setShowExitFeedback(true);
      setNeedsRetry(true);
      const newCount = attemptCount + 1;
      setAttemptCount(newCount);
      if (newCount >= MAX_ATTEMPTS) setShowEscapeHatch(true);
      return;
    }

    setIsGettingFeedback(true);
    try {
      // Wrap in a 20-second timeout at the handler level as a safety net
      const feedbackPromise = generateEducationFeedback(combinedResponse, combinedQuestion);
      const timeoutPromise = new Promise<string>((resolve) =>
        setTimeout(() => resolve('Great reflection! Your understanding of AI privacy shows real growth.'), 20000)
      );
      const feedback = await Promise.race([feedbackPromise, timeoutPromise]);
      if (!isMountedRef.current) return;

      const shouldRetry = checkFeedbackRejection(feedback);
      setExitTicketFeedback(feedback);
      setShowExitFeedback(true);
      setNeedsRetry(shouldRetry);

      if (shouldRetry) {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        if (newCount >= MAX_ATTEMPTS) setShowEscapeHatch(true);
      }
    } catch {
      if (!isMountedRef.current) return;
      setExitTicketFeedback('Great reflection! Your understanding of AI privacy shows real growth.');
      setShowExitFeedback(true);
      setNeedsRetry(false);
    } finally {
      if (isMountedRef.current) setIsGettingFeedback(false);
    }
  };

  const handleTryAgain = () => {
    setExitTicketAnswers({});
    setExitTicketFeedback('');
    setShowExitFeedback(false);
    setNeedsRetry(false);
    // DO NOT reset attemptCount or showEscapeHatch
  };

  const handleContinueAnyway = () => {
    handleNextSegment();
  };

  // Render segment content
  const renderSegment = () => {
    switch (currentSegment) {
      // Segment 0: Intro (2-screen)
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {overviewScreen === 0 ? (
              <Card className="bg-white border-slate-300 shadow-lg rounded-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Privacy & AI Tools: What You Need to Know
                </h1>
                <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                  You just told an AI tool your biggest secret, your most creative idea, or the personal
                  details for your college essay. Who else knows it now?
                </p>
                <div className="bg-blue-100/70 border-2 border-blue-400 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">In this module, you'll discover:</h3>
                  <ul className="text-left text-slate-700 space-y-2 max-w-xl mx-auto">
                    <li>• How consumer AI tools can accidentally leak your personal information to strangers</li>
                    <li>• What actually happens when you click "I Agree" without reading the terms</li>
                    <li>• The critical difference between school-safe and consumer AI tools</li>
                    <li>• How to protect your privacy while still using AI effectively</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setOverviewScreen(1)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  Let's Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Card>
            ) : (
              <Card className="bg-white border-slate-300 shadow-lg rounded-xl p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  Why Your Privacy Matters More Than Ever
                </h2>
                <div className="bg-amber-100/60 border-2 border-amber-400 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    The Reality:
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    AI tools are incredibly helpful—for homework, creative projects, and problem-solving.
                    But many students don't realize that <strong className="text-amber-800">not all AI tools
                    are created equal</strong> when it comes to protecting your personal information.
                  </p>
                </div>
                <div className="bg-blue-100/70 border-2 border-blue-400 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">Here's What Most People Don't Know:</h3>
                      <ul className="text-slate-700 space-y-3 leading-relaxed">
                        <li>• Some AI tools <strong className="text-red-700">train their models on your conversations</strong>—meaning
                          what you type today could show up in someone else's chat tomorrow</li>
                        <li>• Consumer AI tools often <strong className="text-red-700">use your data for advertising</strong>,
                          building profiles about your interests, problems, and secrets</li>
                        <li>• Your school provides <strong className="text-green-700">safer AI tools with built-in privacy
                          protections</strong>, but most students don't use them</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100/70 border-2 border-green-400 rounded-lg p-6 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600 inline mr-2" />
                  <span className="text-slate-900 font-semibold">Good News:</span>
                  <p className="text-slate-700 mt-2 leading-relaxed">
                    By educating yourself about how different AI tools handle your data, you can <strong className="text-green-700">make
                    informed decisions</strong> about what to share and where. <strong className="text-blue-700">Knowledge is power</strong> when
                    it comes to digital privacy.
                  </p>
                </div>
                <Button
                  onClick={handleNextSegment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2"
                >
                  Begin Module <ArrowRight className="w-5 h-5" />
                </Button>
              </Card>
            )}
          </motion.div>
        );

      // Segment 1: VIDEO - Using AI Safely (hook)
      case 1:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">Who Else Sees Your AI Chats?</CardTitle>
              <p className="text-slate-600 text-sm">
                Before we dive in, listen to this question: when you share something with an AI tool, who else might see it?
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.dataAndYou}
                videoId="privacy-data-and-you-hook"
                segments={[{
                  id: 'data-hook',
                  title: 'Using AI Safely',
                  source: VIDEO_URLS.dataAndYou,
                  start: 0,
                  end: 48.7,
                  description: 'Hook: who else sees your AI chats?',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 2: TRANSITION - See It In Action
      case 2:
        return (
          <Card className="bg-white border-slate-300 shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-8 text-center space-y-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">See It In Action</h2>
                <p className="text-slate-700 text-lg leading-relaxed">
                  You just heard the question: <strong>who else sees what you tell AI?</strong> Let's see
                  exactly what can happen when someone trusts an AI chatbot with personal information.
                </p>
                <Button
                  onClick={handleNextSegment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  See Jordan's Story
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
          </Card>
        );

      // Segment 3: Jordan's Story
      case 3:
        return <JordanSimulation onComplete={handleNextSegment} />;

      // Segment 4: VIDEO - The 3-Step Data Journey
      case 4:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">The 3-Step Data Journey</CardTitle>
              <p className="text-slate-600 text-sm">
                Jordan's data was shared with a stranger. But HOW? Let's follow the journey your data takes.
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.chatPrivate}
                videoId="privacy-chat-data-journey"
                segments={[{
                  id: 'data-journey',
                  title: 'The 3-Step Data Journey',
                  source: VIDEO_URLS.chatPrivate,
                  start: 106.7,
                  end: 199.6,
                  description: 'Input -> Storage -> Use, with Snapchat/Meta examples',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 5: Policy Myths Quiz
      case 5:
        return <PolicyMythsQuiz onComplete={handleNextSegment} />;

      // Segment 6: TRANSITION - But Can You Opt Out?
      case 6:
        return (
          <Card className="bg-white border-slate-300 shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-8 text-center space-y-6">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">But Can You Opt Out?</h2>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Now you know what's actually in those policies — and a lot of it isn't great.
                  So here's the big question: <strong>can you just say no?</strong> Can you tell
                  these companies to stop using your data? The answer might not be what you expect.
                </p>
                <Button
                  onClick={handleNextSegment}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  Find Out
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
          </Card>
        );

      // Segment 7: VIDEO - The Opt-Out Paradigm
      case 7:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">The Opt-Out Paradigm</CardTitle>
              <p className="text-slate-600 text-sm">
                You saw how your data travels. Now here's the catch: companies don't ask permission first. The default is "yes."
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.chatPrivate}
                videoId="privacy-chat-opt-out"
                segments={[{
                  id: 'opt-out-paradigm',
                  title: 'The Opt-Out Paradigm',
                  source: VIDEO_URLS.chatPrivate,
                  start: 65.3,
                  end: 106,
                  description: '"Default is yes" - companies assume consent',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 8: T&C Timer Challenge
      case 8:
        return <TCTimerChallenge onComplete={handleNextSegment} />;

      // Segment 9: Policy Comparison Table
      case 9:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-8">
              <PolicyComparisonTable showCitations={true} />
              <div className="text-center">
                <Button
                  onClick={handleNextSegment}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        );

      // Segment 10: VIDEO - School vs Consumer Tools
      case 10:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">School vs Consumer Tools</CardTitle>
              <p className="text-slate-600 text-sm">
                You've compared the real policies. Now let's understand the fundamental question:
                <strong> who is the customer?</strong>
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.dataAndYou}
                videoId="privacy-school-vs-consumer"
                segments={[{
                  id: 'school-vs-consumer',
                  title: 'School vs Consumer Tools',
                  source: VIDEO_URLS.dataAndYou,
                  start: 85.2,
                  end: 142,
                  description: '"Who is the customer?" comparison',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 11: AI Tools Guide
      case 11:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-8">
              <ToolsComparison showCitations={true} />
              <div className="text-center">
                <Button
                  onClick={handleNextSegment}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
                >
                  Learn How to Protect Yourself
                  <Shield className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        );

      // Segment 12: VIDEO - Protect Yourself
      case 12:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">Protect Yourself</CardTitle>
              <p className="text-slate-600 text-sm">
                You know the risks. Now here's your plan to stay in control.
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.dataAndYou}
                videoId="privacy-protect-yourself"
                segments={[{
                  id: 'protect-yourself',
                  title: 'Protect Yourself',
                  source: VIDEO_URLS.dataAndYou,
                  start: 142,
                  end: 198.3,
                  description: '3-step protection plan + de-identification',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 13: Your Action Plan + Know Your Rights
      case 13:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="max-w-4xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-slate-900 mb-4">
                  Your Privacy Action Plan
                </CardTitle>
                <p className="text-slate-600 text-lg">
                  You don't have to stop using AI. You just need to be smart about it.
                </p>
              </CardHeader>
              <CardContent className="space-y-8 text-slate-900">
                <div className="bg-green-100/70 p-8 rounded-lg border-4 border-green-400 shadow-lg">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Shield className="w-10 h-10 text-green-600" />
                    <h3 className="text-green-700 font-bold text-3xl text-center">
                      The Golden Rule of AI Privacy
                    </h3>
                    <Shield className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-slate-900 text-2xl font-bold italic text-center leading-relaxed">
                    "Use consumer AI tools the way you'd use social media — great for
                    general stuff, but keep your personal details out of it."
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-slate-900 text-2xl font-bold text-center">
                    Your 3-Step Action Plan:
                  </h3>
                  <p className="text-slate-500 text-center text-sm">Tap each card to reveal your action step</p>
                  <div className="space-y-4">
                    {/* Card 1: Know Your Tools */}
                    <div
                      onClick={() => setFlippedCards(prev => new Set(prev).add(1))}
                      className="cursor-pointer"
                    >
                      <Card className={`border-2 transition-all duration-300 ${
                        flippedCards.has(1) ? 'bg-white border-blue-400' : 'bg-blue-50 border-blue-300 hover:border-blue-500 hover:shadow-md'
                      }`}>
                        <CardContent className="p-6">
                          <h4 className="text-blue-700 text-xl font-bold mb-3 flex items-center gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                            Know Your Tools
                            {!flippedCards.has(1) && <span className="ml-auto text-blue-400 text-sm font-normal">Tap to reveal</span>}
                            {flippedCards.has(1) && <CheckCircle className="w-5 h-5 ml-auto text-green-500" />}
                          </h4>
                          <AnimatePresence>
                            {flippedCards.has(1) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 text-slate-700"
                              >
                                <p>
                                  <strong>For schoolwork</strong> and anything involving personal information,
                                  always use the AI tools provided by your school, like the education version
                                  of Microsoft Copilot, SchoolAI, or Snorkl.
                                </p>
                                <p>
                                  <strong>For casual curiosity</strong> on consumer AI tools, treat them like a
                                  public forum. Don't share secrets, personal struggles, or identifying details.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Card 2: Anonymize Everything */}
                    <div
                      onClick={() => flippedCards.has(1) && setFlippedCards(prev => new Set(prev).add(2))}
                      className={flippedCards.has(1) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                    >
                      <Card className={`border-2 transition-all duration-300 ${
                        flippedCards.has(2) ? 'bg-white border-blue-400' : flippedCards.has(1) ? 'bg-blue-50 border-blue-300 hover:border-blue-500 hover:shadow-md' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <CardContent className="p-6">
                          <h4 className="text-blue-700 text-xl font-bold mb-3 flex items-center gap-2">
                            <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm ${flippedCards.has(1) ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-500'}`}>2</span>
                            Anonymize Everything
                            {!flippedCards.has(2) && flippedCards.has(1) && <span className="ml-auto text-blue-400 text-sm font-normal">Tap to reveal</span>}
                            {flippedCards.has(2) && <CheckCircle className="w-5 h-5 ml-auto text-green-500" />}
                          </h4>
                          <AnimatePresence>
                            {flippedCards.has(2) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 text-slate-700"
                              >
                                <p>
                                  When using a consumer AI tool for help with a story or an essay,
                                  <strong> strip out all personal details</strong>:
                                </p>
                                <ul className="list-none space-y-1 ml-4">
                                  <li>• Your Name: "Jordan Chen" → "Student A"</li>
                                  <li>• Your School: "Lincoln High" → "a high school"</li>
                                  <li>• Personal Details: "my parents' divorce" → "a difficult family situation"</li>
                                  <li>• Specifics: "my 3.7 GPA" → "a good GPA"</li>
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Card 3: Check and Delete Your History */}
                    <div
                      onClick={() => flippedCards.has(2) && setFlippedCards(prev => new Set(prev).add(3))}
                      className={flippedCards.has(2) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                    >
                      <Card className={`border-2 transition-all duration-300 ${
                        flippedCards.has(3) ? 'bg-white border-blue-400' : flippedCards.has(2) ? 'bg-blue-50 border-blue-300 hover:border-blue-500 hover:shadow-md' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <CardContent className="p-6">
                          <h4 className="text-blue-700 text-xl font-bold mb-3 flex items-center gap-2">
                            <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm ${flippedCards.has(2) ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-500'}`}>3</span>
                            Check and Delete Your History
                            {!flippedCards.has(3) && flippedCards.has(2) && <span className="ml-auto text-blue-400 text-sm font-normal">Tap to reveal</span>}
                            {flippedCards.has(3) && <CheckCircle className="w-5 h-5 ml-auto text-green-500" />}
                          </h4>
                          <AnimatePresence>
                            {flippedCards.has(3) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 text-slate-700"
                              >
                                <p>
                                  Most consumer AI tools have a setting to view and delete your conversation
                                  history. <strong>Get in the habit of clearing it regularly.</strong>
                                </p>
                                <p>
                                  Look for privacy settings that let you opt out of having your conversations
                                  used for model training. It might not be the default, so you have to actively
                                  find it and turn it on.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100/70 p-6 rounded-lg border-2 border-blue-400">
                  <h3 className="text-slate-900 text-xl font-bold mb-3">The Takeaway: You Are in Control</h3>
                  <p className="text-slate-700">
                    The world of AI can seem complicated, but protecting your privacy doesn't have to be.
                    It all comes down to one thing: <strong>making conscious choices</strong>.
                  </p>
                  <ul className="list-none space-y-2 mt-4 text-slate-700">
                    <li>✓ You have the choice to use school-safe tools that protect your data by default.</li>
                    <li>✓ You have the choice to anonymize your information on consumer platforms.</li>
                    <li>✓ You have the choice to read beyond the "I Agree" button and understand what you're signing up for.</li>
                  </ul>
                </div>

                {/* Know Your Rights Section */}
                <div className="bg-purple-100/60 p-6 rounded-lg border-2 border-purple-400">
                  <h3 className="text-purple-700 text-xl font-bold mb-4 flex items-center gap-2">
                    <Scale className="w-6 h-6" />
                    Know Your Rights: Laws That Protect You
                  </h3>
                  <div className="space-y-4 text-slate-700">
                    <div>
                      <h4 className="text-slate-900 font-semibold mb-1">COPPA (Children's Online Privacy Protection Act)</h4>
                      <p className="text-sm">
                        If you're under 13, companies need parental consent to collect your data. That's why most AI tools require you to be 13+. If a company violates COPPA, the FTC can fine them millions of dollars.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold mb-1">State Privacy Laws (California, Virginia, and more)</h4>
                      <p className="text-sm">
                        States like California (CCPA) give you the right to know what data companies collect, request deletion, and opt out of data sales. More states are passing similar laws every year.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold mb-1">EU AI Act & GDPR (If You're in Europe)</h4>
                      <p className="text-sm">
                        European laws are even stronger. The GDPR gives EU residents formal opt-out rights from AI training, and the new AI Act (2026) requires transparency about how AI systems use your data.
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg mt-4">
                      <p className="text-purple-700 text-sm">
                        <strong>Bottom line:</strong> You have legal rights, and they're getting stronger. Companies that violate these laws face serious consequences. But the best protection is still being careful about what you share in the first place.
                      </p>
                    </div>
                  </div>
                </div>

                {flippedCards.size >= 3 ? (
                  <Button
                    onClick={handleNextSegment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <p className="text-slate-400 text-center text-sm">
                    Reveal all 3 action steps to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      // Segment 14: VIDEO - Conclusion
      case 14:
        return (
          <Card className="bg-white border-slate-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">Wrapping Up</CardTitle>
              <p className="text-slate-600 text-sm">
                Let's bring it all together.
              </p>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer
                videoUrl={VIDEO_URLS.dataAndYou}
                videoId="privacy-conclusion"
                segments={[{
                  id: 'conclusion',
                  title: 'Conclusion',
                  source: VIDEO_URLS.dataAndYou,
                  start: 224,
                  end: 248.5,
                  description: '"AI is amazing, you\'re in the driver\'s seat"',
                  mandatory: true
                }]}
                onModuleComplete={handleNextSegment}
                enableSubtitles={true}
                hideSegmentNavigator={true}
                allowSeeking={false}
              />
            </CardContent>
          </Card>
        );

      // Segment 15: Exit Ticket with 2-layer validation
      case 15: {
        const exitQuestions = [
          {
            id: 'school-vs-consumer',
            question: 'What\'s the biggest difference you learned between school-safe tools (like Microsoft Copilot Education) and consumer tools (like ChatGPT Free or Snapchat My AI)? How will this change the way you use AI?',
            placeholder: 'Describe the key differences in how they handle your data and how you\'ll change your approach...'
          },
          {
            id: 'friend-advice',
            question: 'Your friend is about to paste their entire college essay (with real name, school, and personal details) into ChatGPT Free. What would you tell them? Be specific about the risks.',
            placeholder: 'Explain the specific privacy risks and what you would recommend instead...'
          }
        ];

        const allAnswered = exitQuestions.every(q => exitTicketAnswers[q.id]?.trim().length >= 150);

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="bg-white border-slate-300 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-slate-900">
                    Final Reflection: What You Learned
                  </CardTitle>
                  <p className="text-slate-600 text-lg">
                    Show us your understanding of AI privacy and data rights
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dev Mode Shortcuts */}
                  {isDevModeActive && !showExitFeedback && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Exit Ticket Shortcuts</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleDevAutoFill} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-Fill & Complete
                        </Button>
                        <Button onClick={() => setExitTicketAnswers(DEV_RESPONSES.good)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                          Fill Good Response
                        </Button>
                        <Button onClick={() => setExitTicketAnswers({ 'school-vs-consumer': DEV_RESPONSES.generic, 'friend-advice': DEV_RESPONSES.generic })} className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                          Fill Generic Response
                        </Button>
                        <Button onClick={() => setExitTicketAnswers({ 'school-vs-consumer': DEV_RESPONSES.complaint, 'friend-advice': DEV_RESPONSES.complaint })} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                          Fill Complaint
                        </Button>
                        <Button onClick={() => setExitTicketAnswers({ 'school-vs-consumer': DEV_RESPONSES.gibberish, 'friend-advice': DEV_RESPONSES.gibberish })} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto" size="sm">
                          Fill Gibberish
                        </Button>
                      </div>
                      <p className="text-xs text-red-600 mt-1">Test validation: good, generic, complaint, or gibberish responses</p>
                    </div>
                  )}

                  {exitQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <label className="text-slate-900 font-semibold text-lg block">
                        {index + 1}. {question.question}
                      </label>
                      <textarea
                        value={exitTicketAnswers[question.id] || ''}
                        onChange={(e) => setExitTicketAnswers(prev => ({
                          ...prev,
                          [question.id]: e.target.value
                        }))}
                        placeholder={question.placeholder}
                        className="w-full h-32 p-3 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-blue-500 focus:outline-none"
                        required
                      />
                      <div className="text-right">
                        {(exitTicketAnswers[question.id]?.length || 0) >= 150 && (
                          <span className="text-green-600 text-sm font-semibold">
                            ✓ Ready for feedback
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Submit button - hide when escape hatch is actively showing */}
                  {!(showEscapeHatch && needsRetry) && !showExitFeedback && (
                    <Button
                      onClick={handleExitTicketSubmit}
                      disabled={!allAnswered || isGettingFeedback}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-4 text-lg"
                    >
                      {isGettingFeedback ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Getting AI Feedback...
                        </>
                      ) : (
                        <>
                          Submit for AI Feedback
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}

                  {/* Feedback display */}
                  {showExitFeedback && (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl border-2 ${needsRetry ? 'bg-amber-50 border-amber-400' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'}`}>
                        <div className="text-center mb-4">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${needsRetry ? 'bg-amber-400' : 'bg-yellow-400'}`}>
                            <Sparkles className={`w-8 h-8 ${needsRetry ? 'text-amber-900' : 'text-yellow-900'}`} />
                          </div>
                          <h3 className="text-slate-900 font-bold text-2xl mb-2">
                            AI Feedback on Your Reflection
                          </h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                          <p className="text-slate-700 text-lg leading-relaxed">{exitTicketFeedback}</p>
                        </div>
                      </div>

                      {/* Escape hatch after 2 failed attempts */}
                      {showEscapeHatch && needsRetry && (
                        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 space-y-4">
                          <p className="text-amber-800 font-semibold text-center">
                            You've had multiple attempts. You can try once more or continue to the next section.
                          </p>
                          <div className="flex gap-3">
                            <Button
                              onClick={handleTryAgain}
                              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Try One More Time
                            </Button>
                            <Button
                              onClick={handleContinueAnyway}
                              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                            >
                              Continue Anyway
                            </Button>
                          </div>
                          <p className="text-xs text-amber-700 text-center">
                            Note: Continuing without a complete reflection will be noted for instructor review.
                          </p>
                        </div>
                      )}

                      {/* Try again for non-escape-hatch retries */}
                      {needsRetry && !showEscapeHatch && (
                        <Button
                          onClick={handleTryAgain}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 text-lg"
                        >
                          Try Again
                        </Button>
                      )}

                      {/* Continue to works cited */}
                      {!needsRetry && (
                        <div className="text-center">
                          <Button
                            onClick={handleNextSegment}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-xl rounded-xl"
                          >
                            View Sources & Get Your Certificate
                            <CheckCircle className="w-6 h-6 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {!allAnswered && !showExitFeedback && (
                    <p className="text-amber-800 text-sm text-center">
                      Please complete all reflection questions with at least 150 characters each (2-3 sentences) to continue.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );
      }

      // Segment 16: Works Cited + Certificate
      case 16:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="bg-white border-slate-300 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                    <Book className="w-8 h-8" />
                    Works Cited
                  </CardTitle>
                  <p className="text-slate-600">
                    All sources used in this module (accurate as of February 2026)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="bg-slate-50 p-6 rounded-lg text-sm text-slate-700 space-y-3 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generateWorksCited() }}
                  />

                  <div className="bg-green-100/70 p-6 rounded-lg border-2 border-green-400 text-center">
                    <h3 className="text-slate-900 text-2xl font-bold mb-3">
                      Module Complete!
                    </h3>
                    <p className="text-green-700 text-lg mb-6">
                      You've learned how to protect your privacy when using AI tools.
                      You're now an informed digital citizen!
                    </p>
                    <Button
                      onClick={() => setShowCertificate(true)}
                      className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4"
                    >
                      Get Your Certificate
                      <CheckCircle className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Certificate view
  if (showCertificate) {
    return (
      <Certificate
        userName={userName}
        courseName="Privacy & Data Rights"
        completionDate={new Date().toLocaleDateString()}
        onDownload={() => {
          clearProgress(MODULE_ID);
          onComplete?.();
        }}
      />
    );
  }

  // Resume dialog
  if (showResumeDialog && savedProgressSummary) {
    return (
      <ResumeProgressDialog
        activityIndex={savedProgressSummary.activityIndex}
        activityTitle={savedProgressSummary.activityTitle}
        totalActivities={savedProgressSummary.totalActivities}
        lastUpdated={savedProgressSummary.lastUpdated}
        onResume={() => {
          const activityStates = segments.map((s) => ({
            id: `segment-${s.id}`,
            title: s.title,
            completed: false,
          }));
          const progress = loadProgress(MODULE_ID, activityStates);
          if (progress) {
            setCurrentSegment(progress.currentActivity);
            setCompletedSegments(
              segments
                .map((_, index) => index)
                .filter(index => index < progress.currentActivity)
            );
          }
          setShowResumeDialog(false);
        }}
        onStartOver={() => {
          clearProgress(MODULE_ID);
          setCurrentSegment(0);
          setCompletedSegments([]);
          setShowResumeDialog(false);
        }}
      />
    );
  }

  // Main layout
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy & Data Rights</h1>
        </div>
        <p className="text-xl text-gray-700">
          Protecting your personal information in the age of AI
        </p>
      </div>

      {/* Developer Mode Navigation */}
      {isDevModeActive && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-red-800">Developer Mode Active</span>
              <span className="text-xs text-red-600">
                Segment {currentSegment + 1} of {segments.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (currentSegment > 0) {
                    setCurrentSegment(currentSegment - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={currentSegment === 0}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentSegment < segments.length - 1) {
                    setCurrentSegment(currentSegment + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={currentSegment === segments.length - 1}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Segment {currentSegment + 1} of {segments.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentSegment + 1) / segments.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSegment + 1) / segments.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Segment */}
      {renderSegment()}
    </div>
  );
}
