import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, AlertCircle, Zap, Target, Sparkles,
  BookOpen, Lightbulb, MessageSquare, PenTool, Award, Brain,
  ChevronRight, Loader, ExternalLink, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Certificate } from '@/components/Certificate';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { saveProgress, loadProgress, clearProgress } from '@/lib/progressPersistence';
import { generateEducationFeedback, isNonsensical, checkFeedbackRejection } from '@/utils/aiEducationFeedback';
import ResumeProgressDialog from '@/components/WhatIsAIModule/ResumeProgressDialog';

import SayWhatYouSeeActivity from './IntroductionToPromptingModule/SayWhatYouSeeActivity';
import PromptFunnelVisualization from './IntroductionToPromptingModule/PromptFunnelVisualization';
import FormatActivity from './IntroductionToPromptingModule/FormatActivity';
import RTFOutputBuilder from './IntroductionToPromptingModule/RTFOutputBuilder';
import PromptRaterActivity from './IntroductionToPromptingModule/PromptRaterActivity';

const MODULE_ID = 'introduction-to-prompting';

interface IntroductionToPromptingModuleProps {
  userName?: string;
  onComplete?: () => void;
}

const IntroductionToPromptingModule: React.FC<IntroductionToPromptingModuleProps> = ({
  userName,
  onComplete,
}) => {
  const { isDevModeActive } = useDevMode();
  const { registerActivity, clearRegistry } = useActivityRegistry();

  const [currentSegment, setCurrentSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgressData, setSavedProgressData] = useState<{
    activityIndex: number;
    activityTitle: string;
    totalActivities: number;
    lastUpdated: string;
  } | null>(null);

  // Exit ticket state
  const [exitTicket, setExitTicket] = useState('');
  const [exitTicketFeedback, setExitTicketFeedback] = useState('');
  const [exitTicketNeedsRetry, setExitTicketNeedsRetry] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showExitTicketFeedback, setShowExitTicketFeedback] = useState(false);
  const [exitTicketAttemptCount, setExitTicketAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);

  // Animated segment interaction states
  const [principlesRevealed, setPrinciplesRevealed] = useState<number[]>([]);
  const [roleMatchAnswers, setRoleMatchAnswers] = useState<Record<number, number>>({});
  const [roleMatchChecked, setRoleMatchChecked] = useState(false);
  const [vagueTaskIndex, setVagueTaskIndex] = useState(0);
  const [vagueTaskRevealed, setVagueTaskRevealed] = useState<boolean[]>([false, false, false]);
  const [proTipsRevealed, setProTipsRevealed] = useState<number[]>([]);

  const MAX_ATTEMPTS = 2;
  const MIN_EXIT_TICKET_LENGTH = 100;

  const segments = [
    { id: 0, title: 'Welcome', type: 'intro' as const },
    { id: 1, title: 'Say What You See', type: 'interactive' as const },
    { id: 2, title: 'What Is a Prompt?', type: 'transition' as const },
    { id: 3, title: 'Rate the Prompts', type: 'interactive' as const },
    { id: 4, title: 'Prompting Principles', type: 'interactive' as const },
    { id: 5, title: 'Meet the RTF Framework', type: 'interactive' as const },
    { id: 6, title: 'Role: Your AI Expert', type: 'interactive' as const },
    { id: 7, title: 'Task: What You Want', type: 'interactive' as const },
    { id: 8, title: 'Format: How You Want It', type: 'interactive' as const },
    { id: 9, title: 'Build Your RTF Prompt', type: 'interactive' as const },
    { id: 10, title: 'Prompt Pro Tips', type: 'transition' as const },
    { id: 11, title: 'Exit Ticket', type: 'exit-ticket' as const },
    { id: 12, title: 'Certificate', type: 'certificate' as const },
  ];

  // Register activities for Developer Mode
  useEffect(() => {
    clearRegistry();
    segments.forEach((segment, index) => {
      registerActivity({
        id: `segment-${segment.id}`,
        type: segment.type,
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

  // Load saved progress
  useEffect(() => {
    const activityStates = segments.map((s) => ({
      id: `segment-${s.id}`,
      title: s.title,
      completed: false,
    }));
    const progress = loadProgress(MODULE_ID, activityStates);
    if (progress && progress.currentActivity > 0) {
      const currentActivityData = progress.activities[progress.currentActivity];
      setSavedProgressData({
        activityIndex: progress.currentActivity,
        activityTitle: currentActivityData?.title || 'Unknown',
        totalActivities: progress.activities.length,
        lastUpdated: new Date(progress.lastUpdated).toLocaleString(),
      });
      setShowResumeDialog(true);
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (currentSegment > 0 && !showResumeDialog) {
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
      setCompletedSegments([...completedSegments, currentSegment]);
    }
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCertificate(true);
    }
  };

  // ────────────── Exit Ticket Handlers ──────────────

  const EXIT_TICKET_QUESTION = "Think about a specific school assignment or project you have coming up. How could you use the RTF framework to write a prompt that helps you with it? Include the Role, Task, and Format you would use, and explain why you chose each one.";

  const DEV_RESPONSES = {
    good: "For my upcoming AP Biology lab report, I would use the RTF framework to get help organizing my findings. For Role, I'd choose 'experienced AP Biology teacher who grades lab reports' because they'd know exactly what format and depth is expected. For Task, I'd ask it to 'help me outline the discussion section of my lab report on enzyme kinetics, focusing on connecting my data to the hypothesis and identifying sources of error.' I made the task specific to one section rather than the whole report so the AI can give focused help. For Format, I'd request 'a structured outline with bullet points for each paragraph, including suggested transition phrases and key scientific terms to incorporate.' I chose this format because an outline gives me a framework to build on while still writing in my own voice. The RTF framework helps because without it, I might just say 'help me with my lab report' and get something too generic to be useful.",
    generic: "I would use RTF for my homework. I'd pick a role and a task and a format. It would help me do better on my assignments I think.",
    complaint: "I don't see why I need to learn about prompting. AI should just understand what I want without me having to format things a specific way. This whole module was a waste of time.",
    gibberish: "asdfkj rtf whatever role task format blah blah just let me finish aaaaaa lol idk"
  } as const;

  const DEV_FEEDBACK = "Excellent reflection! You've demonstrated mastery of the RTF framework by applying it to a real academic scenario. Your Role choice shows understanding of expertise targeting, your Task is admirably specific, and your Format selection is practical and purposeful. Well done!";

  const handleSubmitExitTicket = async () => {
    setIsGeneratingFeedback(true);
    setExitTicketNeedsRetry(false);

    try {
      const feedback = await generateEducationFeedback(
        exitTicket.trim(),
        EXIT_TICKET_QUESTION
      );

      const finalFeedback = feedback && feedback.trim().length > 0
        ? feedback
        : "Thank you for sharing your thoughtful reflection on using the RTF framework.";

      setExitTicketFeedback(finalFeedback);

      const needsRetry = checkFeedbackRejection(feedback);
      setExitTicketNeedsRetry(needsRetry);

      if (needsRetry) {
        const newAttemptCount = exitTicketAttemptCount + 1;
        setExitTicketAttemptCount(newAttemptCount);
        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      }

      setShowExitTicketFeedback(true);
    } catch {
      setExitTicketFeedback("Thank you for your thoughtful reflection on using the RTF framework.");
      setExitTicketNeedsRetry(false);
      setShowExitTicketFeedback(true);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleExitTicketTryAgain = () => {
    setExitTicket('');
    setExitTicketFeedback('');
    setShowExitTicketFeedback(false);
    setExitTicketNeedsRetry(false);
  };

  const handleExitTicketContinueAnyway = () => {
    handleNextSegment();
  };

  const handleDevAutoFillExitTicket = () => {
    if (!isDevModeActive) return;
    setExitTicket(DEV_RESPONSES.good);
    setExitTicketFeedback(DEV_FEEDBACK);
    setShowExitTicketFeedback(true);
    setExitTicketNeedsRetry(false);
    setTimeout(() => handleNextSegment(), 1000);
  };

  // ────────────── Segment Content Data ──────────────

  const PROMPT_PRINCIPLES = [
    {
      icon: Target,
      title: 'Be Specific',
      description: 'Vague prompts get vague answers. Instead of "help me study," say "create 10 flashcards covering Chapter 5 vocabulary on photosynthesis."',
      color: 'blue',
    },
    {
      icon: BookOpen,
      title: 'Give Context',
      description: 'Tell the AI what it needs to know. "I\'m a 10th grader writing a persuasive essay for English class" helps it pitch the response at the right level.',
      color: 'green',
    },
    {
      icon: MessageSquare,
      title: 'Set the Tone',
      description: 'Want it casual or formal? Funny or serious? "Explain this like you\'re a friendly tutor" gets a very different response than "provide an academic explanation."',
      color: 'purple',
    },
    {
      icon: PenTool,
      title: 'Define the Format',
      description: 'Tell AI exactly how you want the output: bullet points, a table, an outline, a paragraph, numbered steps, or even a poem.',
      color: 'orange',
    },
  ];

  const ROLE_MATCHING_SCENARIOS = [
    { scenario: "You need help studying for a biology test", correctRole: 0, roles: ["Biology Tutor", "Creative Writing Coach", "Debate Coach", "Programming Tutor"] },
    { scenario: "You want to write a short story for English class", correctRole: 1, roles: ["Math Teacher", "Creative Writing Coach", "History Professor", "Science Tutor"] },
    { scenario: "You need to understand Python for loops", correctRole: 3, roles: ["English Teacher", "Art Instructor", "Debate Coach", "Programming Tutor"] },
    { scenario: "You're preparing arguments for a debate", correctRole: 2, roles: ["Biology Tutor", "Math Teacher", "Debate Coach", "Art Instructor"] },
  ];

  const VAGUE_TASKS = [
    {
      vague: "Help me study",
      improved: "Create 10 flashcards covering the key vocabulary from Chapter 5 on photosynthesis, with the term on one side and a student-friendly definition with an example on the other.",
    },
    {
      vague: "Write something about history",
      improved: "Summarize the 3 main causes of World War I in a paragraph suitable for 10th grade, using simple language and one specific example for each cause.",
    },
    {
      vague: "Make my essay better",
      improved: "Review my persuasive essay introduction and suggest 3 specific improvements for stronger argumentation, including a hook, a clearer thesis, and better transition to my first point.",
    },
  ];

  const PRO_TIPS = [
    {
      title: "Iterate and Refine",
      description: "Your first prompt doesn't have to be perfect. If the AI's response isn't quite right, tweak your prompt and try again. Each iteration gets you closer to what you need.",
      icon: "🔄",
    },
    {
      title: "Chain Your Prompts",
      description: "Break big tasks into smaller steps. First ask AI to outline your essay, then ask it to expand each section. It's like building with blocks — one piece at a time.",
      icon: "🔗",
    },
    {
      title: "Know AI's Limits",
      description: "AI can make mistakes, produce outdated info, or sound confident when wrong. Always fact-check important information and use AI as a starting point, not the final answer.",
      icon: "⚠️",
    },
    {
      title: "Be Yourself",
      description: "Use AI to help you think and organize — not to replace your own voice. The best work combines AI assistance with your unique perspective and creativity.",
      icon: "✨",
    },
  ];

  // ────────────── Render Helpers ──────────────

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600' },
  };

  const renderSegment = () => {
    switch (currentSegment) {
      // ──── Segment 0: Welcome ────
      case 0:
        return (
          <Card>
            <CardContent className="p-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome to Introduction to Prompting
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Ever ordered food at a restaurant? The more specific you are — "no onions, extra cheese, well done" — the more likely you get exactly what you want. Talking to AI works the same way.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-3">What you'll learn:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>What a prompt is and why it matters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Key principles for writing effective prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>The RTF Framework: Role, Task, Format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>How to build prompts that get you exactly what you need</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <Button
                  onClick={handleNextSegment}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Let's Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        );

      // ──── Segment 1: Say What You See ────
      case 1:
        return (
          <SayWhatYouSeeActivity
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 2: What Is a Prompt? (Animated) ────
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                What Is a Prompt?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-lg text-gray-700 mb-6">
                  A <strong className="text-purple-700">prompt</strong> is any instruction or question you give to an AI. It's how you communicate what you want.
                </p>
              </motion.div>

              {/* Bad Prompt Example */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Vague Prompt:</h4>
                    <p className="text-red-900 font-mono bg-red-100 rounded px-3 py-2">"Help me with my homework"</p>
                    <p className="text-red-700 text-sm mt-2">
                      The AI doesn't know what subject, what assignment, what grade level, or what kind of help you need. You'll get a generic, unhelpful response.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Good Prompt Example */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-50 border-2 border-green-200 rounded-lg p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Specific Prompt:</h4>
                    <p className="text-green-900 font-mono bg-green-100 rounded px-3 py-2">
                      "I'm a 10th grader studying for my biology test on cell division. Create 10 flashcards with key terms and simple definitions."
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                      Now the AI knows who you are, what you're studying, and exactly what you need. The response will be targeted and useful.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center"
              >
                <p className="text-purple-800 font-medium">
                  The quality of your prompt directly determines the quality of the AI's response. Better prompts = better results.
                </p>
              </motion.div>

              <div className="flex justify-center">
                <Button onClick={handleNextSegment} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 3: Rate the Prompts ────
      case 3:
        return (
          <PromptRaterActivity onComplete={handleNextSegment} />
        );

      // ──── Segment 4: Prompting Principles (Animated Cards) ────
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Four Principles of Effective Prompting
              </CardTitle>
              <p className="text-gray-600 mt-1">Click each card to reveal the principle</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {PROMPT_PRINCIPLES.map((principle, index) => {
                  const isRevealed = principlesRevealed.includes(index);
                  const colors = colorMap[principle.color];
                  const Icon = principle.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => {
                        if (!isRevealed) {
                          setPrinciplesRevealed([...principlesRevealed, index]);
                        }
                      }}
                      whileHover={{ scale: isRevealed ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left rounded-lg border-2 p-5 transition-all ${
                        isRevealed
                          ? `${colors.bg} ${colors.border}`
                          : 'bg-gray-100 border-gray-300 cursor-pointer hover:border-gray-400'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ opacity: 0, rotateY: 90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={`w-5 h-5 ${colors.icon}`} />
                              <h4 className={`font-bold ${colors.text}`}>{principle.title}</h4>
                            </div>
                            <p className={`text-sm ${colors.text}`}>{principle.description}</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            className="flex items-center justify-center py-4"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                                <span className="text-xl font-bold text-gray-500">{index + 1}</span>
                              </div>
                              <p className="text-gray-500 text-sm">Click to reveal</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {principlesRevealed.length === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-4"
                >
                  <Button onClick={handleNextSegment} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Now Let's Learn the RTF Framework <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        );

      // ──── Segment 5: Meet the RTF Framework + Prompt Funnel ────
      case 5:
        return (
          <PromptFunnelVisualization onComplete={handleNextSegment} />
        );

      // ──── Segment 6: Role Deep Dive + Matching Game ────
      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white font-bold text-lg">R</span>
                Role: Your AI Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-5"
              >
                <p className="text-blue-900 text-lg mb-3">
                  The <strong>Role</strong> tells the AI who to act as. This shapes the perspective, vocabulary, and expertise of its response.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-800 text-sm">
                    <strong>Example:</strong> "Act as a <span className="text-blue-600 font-semibold">patient biology tutor for high school students</span>" gives you very different output than just asking AI a biology question directly.
                  </p>
                </div>
              </motion.div>

              {/* Role Matching Game */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Match the scenario to the best role:</h3>
                {ROLE_MATCHING_SCENARIOS.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <p className="text-gray-800 font-medium mb-3">{item.scenario}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.roles.map((role, roleIdx) => {
                        const isSelected = roleMatchAnswers[idx] === roleIdx;
                        const isCorrect = roleIdx === item.correctRole;
                        const showResult = roleMatchChecked;
                        return (
                          <button
                            key={roleIdx}
                            onClick={() => {
                              if (!roleMatchChecked) {
                                setRoleMatchAnswers({ ...roleMatchAnswers, [idx]: roleIdx });
                              }
                            }}
                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              showResult && isSelected && isCorrect
                                ? 'bg-green-100 border-green-500 text-green-800'
                                : showResult && isSelected && !isCorrect
                                ? 'bg-red-100 border-red-400 text-red-800'
                                : showResult && isCorrect
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : isSelected
                                ? 'bg-blue-100 border-blue-500 text-blue-800'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                            }`}
                            disabled={roleMatchChecked}
                          >
                            {role}
                            {showResult && isCorrect && ' ✓'}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {Object.keys(roleMatchAnswers).length === ROLE_MATCHING_SCENARIOS.length && !roleMatchChecked && (
                  <Button
                    onClick={() => setRoleMatchChecked(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Check My Answers
                  </Button>
                )}

                {roleMatchChecked && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-900 font-medium">
                        {Object.entries(roleMatchAnswers).filter(([idx, ans]) =>
                          ans === ROLE_MATCHING_SCENARIOS[Number(idx)].correctRole
                        ).length} of {ROLE_MATCHING_SCENARIOS.length} correct!
                        {' '}Choosing the right role ensures the AI responds with the right expertise.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={handleNextSegment} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Next: Task <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 7: Task Deep Dive + Fix-the-Vague-Task ────
      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-green-600 text-white font-bold text-lg">T</span>
                Task: What You Want
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-5"
              >
                <p className="text-green-900 text-lg mb-3">
                  The <strong>Task</strong> is the specific action you want the AI to perform. The more detailed your task, the more useful the response.
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <p className="text-gray-800 text-sm">
                    <strong>Key tip:</strong> Use action verbs like <span className="text-green-600 font-semibold">create, explain, compare, summarize, design, list, outline</span> to make your request crystal clear.
                  </p>
                </div>
              </motion.div>

              {/* Fix the Vague Task Exercise */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Can you spot the problem? Fix these vague tasks:</h3>

                <div className="flex items-center justify-center gap-2 mb-2">
                  {VAGUE_TASKS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVagueTaskIndex(idx)}
                      className={`w-10 h-10 rounded-full font-bold transition-all ${
                        vagueTaskIndex === idx
                          ? 'bg-green-600 text-white'
                          : vagueTaskRevealed[idx]
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={vagueTaskIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-700">Vague Task:</span>
                      </div>
                      <p className="text-red-900 font-mono text-lg">"{VAGUE_TASKS[vagueTaskIndex].vague}"</p>
                    </div>

                    {!vagueTaskRevealed[vagueTaskIndex] ? (
                      <Button
                        onClick={() => {
                          const newRevealed = [...vagueTaskRevealed];
                          newRevealed[vagueTaskIndex] = true;
                          setVagueTaskRevealed(newRevealed);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Reveal the Improved Version
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border-2 border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-700">Improved Task:</span>
                        </div>
                        <p className="text-green-900 font-mono text-sm">{VAGUE_TASKS[vagueTaskIndex].improved}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {vagueTaskRevealed.every(Boolean) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-2">
                    <Button onClick={handleNextSegment} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      Next: Format <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 8: Format Deep Dive ────
      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-purple-600 text-white font-bold text-lg">F</span>
                Format: How You Want It
              </CardTitle>
              <p className="text-gray-600 mt-1">
                The Format tells AI exactly how to structure its response. Same content, completely different output.
              </p>
            </CardHeader>
            <CardContent>
              <FormatActivity onComplete={handleNextSegment} />
            </CardContent>
          </Card>
        );

      // ──── Segment 9: RTF Builder ────
      case 9:
        return (
          <RTFOutputBuilder
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 10: Pro Tips (Animated) ────
      case 10:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Prompt Pro Tips
              </CardTitle>
              <p className="text-gray-600 mt-1">Click each tip to reveal expert advice</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {PRO_TIPS.map((tip, index) => {
                const isRevealed = proTipsRevealed.includes(index);
                return (
                  <motion.button
                    key={index}
                    onClick={() => {
                      if (!isRevealed) {
                        setProTipsRevealed([...proTipsRevealed, index]);
                      }
                    }}
                    whileHover={{ scale: isRevealed ? 1 : 1.01 }}
                    className={`w-full text-left rounded-lg border-2 p-5 transition-all ${
                      isRevealed
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200 cursor-pointer hover:border-yellow-300'
                    }`}
                  >
                    {isRevealed ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{tip.icon}</span>
                          <h4 className="font-bold text-gray-900">{tip.title}</h4>
                        </div>
                        <p className="text-gray-700 text-sm ml-11">{tip.description}</p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                        </div>
                        <span className="text-gray-400">Click to reveal tip #{index + 1}</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}

              {proTipsRevealed.length === PRO_TIPS.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-4"
                >
                  <Button onClick={handleNextSegment} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Almost Done — Exit Ticket <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        );

      // ──── Segment 11: Exit Ticket ────
      case 11:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Exit Ticket: Applying the RTF Framework
              </CardTitle>
              <p className="text-gray-700 mt-2">
                Show us what you've learned by connecting the RTF framework to your real life.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {EXIT_TICKET_QUESTION}
                </h3>
                <Textarea
                  value={exitTicket}
                  onChange={(e) => setExitTicket(e.target.value)}
                  disabled={showExitTicketFeedback && !exitTicketNeedsRetry}
                  placeholder="Describe the assignment, then explain your chosen Role, Task, and Format, and why each one helps..."
                  rows={6}
                  className="w-full text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-600">
                  {exitTicket.length} / {MIN_EXIT_TICKET_LENGTH} characters minimum
                </p>

                {/* Dev Mode Shortcuts */}
                {isDevModeActive && !showExitTicketFeedback && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Exit Ticket Shortcuts</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleDevAutoFillExitTicket}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                        size="sm"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Auto-Fill & Complete
                      </Button>
                      <Button
                        onClick={() => setExitTicket(DEV_RESPONSES.good)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                        size="sm"
                      >
                        Fill Good Response
                      </Button>
                      <Button
                        onClick={() => setExitTicket(DEV_RESPONSES.generic)}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
                        size="sm"
                      >
                        Fill Generic Response
                      </Button>
                      <Button
                        onClick={() => setExitTicket(DEV_RESPONSES.complaint)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 h-auto"
                        size="sm"
                      >
                        Fill Complaint
                      </Button>
                      <Button
                        onClick={() => setExitTicket(DEV_RESPONSES.gibberish)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                        size="sm"
                      >
                        Fill Gibberish
                      </Button>
                    </div>
                    <p className="text-xs text-red-600 mt-1">Test validation: good, generic, complaint, or gibberish responses</p>
                  </div>
                )}

                {/* AI Feedback */}
                {showExitTicketFeedback && exitTicketFeedback && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 rounded-lg p-4 ${
                        exitTicketNeedsRetry
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-green-50 border-green-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {exitTicketNeedsRetry ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="w-full">
                          <h5 className="text-sm font-semibold text-gray-900 mb-1">
                            {exitTicketNeedsRetry ? 'AI Feedback - Please Revise:' : 'AI Feedback:'}
                          </h5>
                          <p className="text-sm text-gray-900">{exitTicketFeedback}</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Loading state */}
              {isGeneratingFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your response with AI...</span>
                </motion.div>
              )}

              {/* Escape Hatch */}
              {showEscapeHatch && exitTicketNeedsRetry && (
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
                          Multiple Attempts Detected
                        </h3>
                        <p className="text-gray-900 mb-3">
                          You've tried {exitTicketAttemptCount} times and the AI feedback suggests your response needs improvement.
                        </p>
                        <p className="text-gray-900 mb-3">
                          <strong className="text-yellow-700">You have two options:</strong>
                        </p>
                        <ol className="text-gray-900 mb-4 space-y-1 ml-4">
                          <li>1. Try again with a different response that addresses the question</li>
                          <li>2. Continue anyway and get your certificate</li>
                        </ol>
                        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                          <p className="text-gray-900 text-sm">
                            <strong className="text-yellow-700">Important:</strong> If you continue, your response will be flagged for instructor review.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleExitTicketTryAgain}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try One More Time
                          </Button>
                          <Button
                            onClick={handleExitTicketContinueAnyway}
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
              {!(showEscapeHatch && exitTicketNeedsRetry) && (
                <Button
                  onClick={() => {
                    if (showExitTicketFeedback && !exitTicketNeedsRetry) {
                      handleNextSegment();
                    } else if (showExitTicketFeedback && exitTicketNeedsRetry) {
                      handleExitTicketTryAgain();
                    } else {
                      handleSubmitExitTicket();
                    }
                  }}
                  disabled={!showExitTicketFeedback && (exitTicket.length < MIN_EXIT_TICKET_LENGTH || isGeneratingFeedback)}
                  size="lg"
                  className={`w-full ${
                    showExitTicketFeedback && !exitTicketNeedsRetry
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : showExitTicketFeedback && exitTicketNeedsRetry
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : exitTicket.length >= MIN_EXIT_TICKET_LENGTH && !isGeneratingFeedback
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {showExitTicketFeedback && !exitTicketNeedsRetry ? (
                    <>
                      Get Your Certificate
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  ) : showExitTicketFeedback && exitTicketNeedsRetry ? (
                    'Try Again'
                  ) : (
                    'Submit Response'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      // ──── Segment 12: Certificate ────
      case 12:
        return null; // Handled by showCertificate early return

      default:
        return null;
    }
  };

  // Resume dialog handlers
  const handleResume = () => {
    if (savedProgressData) {
      setCurrentSegment(savedProgressData.activityIndex);
      setCompletedSegments(
        segments
          .map((_, index) => index)
          .filter(index => index < savedProgressData.activityIndex)
      );
    }
    setShowResumeDialog(false);
  };

  const handleStartOver = () => {
    clearProgress(MODULE_ID);
    setCurrentSegment(0);
    setCompletedSegments([]);
    setShowResumeDialog(false);
  };

  // Show resume dialog
  if (showResumeDialog && savedProgressData) {
    return (
      <ResumeProgressDialog
        activityIndex={savedProgressData.activityIndex}
        activityTitle={savedProgressData.activityTitle}
        totalActivities={savedProgressData.totalActivities}
        lastUpdated={savedProgressData.lastUpdated}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
    );
  }

  // Show certificate
  if (showCertificate || currentSegment === segments.length - 1) {
    return (
      <Certificate
        userName={userName}
        courseName="Introduction to Prompting"
        completionDate={new Date().toLocaleDateString()}
        onDownload={() => {
          clearProgress(MODULE_ID);
          onComplete?.();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Introduction to Prompting</h1>
        </div>
        <p className="text-lg text-gray-700">
          Master the art of communicating with AI
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

      {/* Current Segment Content */}
      {renderSegment()}
    </div>
  );
};

export default IntroductionToPromptingModule;
