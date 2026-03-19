import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Zap, Target,
  BookOpen, Lightbulb, MessageSquare, PenTool, Brain,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Certificate } from '@/components/Certificate';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
import { saveProgress, loadProgress, clearProgress } from '@/lib/progressPersistence';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';
import ResumeProgressDialog from '@/components/WhatIsAIModule/ResumeProgressDialog';

import SayWhatYouSeeActivity from './IntroductionToPromptingModule/SayWhatYouSeeActivity';
import PromptFunnelVisualization from './IntroductionToPromptingModule/PromptFunnelVisualization';
import FormatActivity from './IntroductionToPromptingModule/FormatActivity';
import RTFOutputBuilder from './IntroductionToPromptingModule/RTFOutputBuilder';
import PromptRaterActivity from './IntroductionToPromptingModule/PromptRaterActivity';
import ZeroVsFewShotActivity from './IntroductionToPromptingModule/ZeroVsFewShotActivity';
import ChainOfThoughtActivity from './IntroductionToPromptingModule/ChainOfThoughtActivity';
import PromptEnhancerExitTicket from './IntroductionToPromptingModule/PromptEnhancerExitTicket';

const MODULE_ID = 'introduction-to-prompting';

// Video: The Explainer — How to Actually Use AI (~7:44)
// Using relative Firebase Storage path for PremiumVideoPlayer compatibility
const VIDEO_URL = 'Videos/Student Videos/Introduction to Prompting/The_Explainer__How_to_Actually_Use_AI.mp4';

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



  // Animated segment interaction states
  const [principlesRevealed, setPrinciplesRevealed] = useState<number[]>([]);
  const [roleMatchAnswers, setRoleMatchAnswers] = useState<Record<number, number>>({});
  const [roleMatchChecked, setRoleMatchChecked] = useState(false);
  const [vagueTaskIndex, setVagueTaskIndex] = useState(0);
  const [vagueTaskRevealed, setVagueTaskRevealed] = useState<boolean[]>([false, false, false]);
  const [selectedPowerVerb, setSelectedPowerVerb] = useState<string | null>(null);
  const [exploredVerbs, setExploredVerbs] = useState<string[]>([]);


  const segments = [
    { id: 0, title: 'Welcome', type: 'intro' as const },
    { id: 1, title: 'Video: Why Are Results So Inconsistent?', type: 'video' as const },
    { id: 2, title: 'What Is a Prompt?', type: 'transition' as const },
    { id: 3, title: 'Say What You See', type: 'interactive' as const },
    { id: 4, title: 'Video: How AI Actually Works', type: 'video' as const },
    { id: 5, title: 'Vague vs. Specific', type: 'transition' as const },
    { id: 6, title: 'Vague or Specific?', type: 'interactive' as const },
    { id: 7, title: 'Video: The Funnel', type: 'video' as const },
    { id: 8, title: 'The Funnel in Action', type: 'interactive' as const },
    { id: 9, title: 'Video: Narrowing the Funnel', type: 'video' as const },
    { id: 10, title: 'The RTFC Framework', type: 'interactive' as const },
    { id: 11, title: 'Let\'s Build a Prompt', type: 'transition' as const },
    { id: 12, title: 'Video: Role — The First Layer', type: 'video' as const },
    { id: 13, title: 'Role: Your AI Expert', type: 'interactive' as const },
    { id: 14, title: 'Video: Task & Format', type: 'video' as const },
    { id: 15, title: 'Task: What You Want', type: 'interactive' as const },
    { id: 16, title: 'Format: How You Want It', type: 'interactive' as const },
    { id: 17, title: 'Video: Context — The Final Layer', type: 'video' as const },
    { id: 18, title: 'Context: Background Info', type: 'interactive' as const },
    { id: 19, title: 'Build Your RTFC Prompt', type: 'interactive' as const },
    { id: 20, title: 'Video: Advanced Tricks', type: 'video' as const },
    { id: 21, title: 'Zero-Shot vs. Few-Shot', type: 'interactive' as const },
    { id: 22, title: 'Chain-of-Thought Prompting', type: 'interactive' as const },
    { id: 23, title: 'Video: The Golden Rules', type: 'video' as const },
    { id: 24, title: 'Exit Ticket', type: 'exit-ticket' as const },
    { id: 25, title: 'Certificate', type: 'certificate' as const },
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

  // ────────────── Segment Content Data ──────────────

  const RTFC_CARDS = [
    {
      letter: 'R',
      title: 'Role',
      subtitle: 'Who should the AI act as?',
      example: '"Act as a patient biology tutor for high school students"',
      color: 'blue',
      bgHex: '#2563eb',
    },
    {
      letter: 'T',
      title: 'Task',
      subtitle: 'What exactly do you want done?',
      example: '"Create 10 flashcards on Chapter 5 photosynthesis vocab"',
      color: 'green',
      bgHex: '#16a34a',
    },
    {
      letter: 'F',
      title: 'Format',
      subtitle: 'How should the response look?',
      example: '"Term on one side, definition + example on the other"',
      color: 'purple',
      bgHex: '#9333ea',
    },
    {
      letter: 'C',
      title: 'Context',
      subtitle: 'What background info does the AI need?',
      example: '"For a 10th-grade student studying for a test on Friday"',
      color: 'orange',
      bgHex: '#ea580c',
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

  // ────────────── Render Helpers ──────────────

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600' },
  };

  // ────────────── Prompt Build Banner ──────────────
  // Shows the video's prompt building up layer by layer across RTFC segments
  const PROMPT_LAYERS = [
    { letter: 'R', color: '#2563eb', label: 'Role', text: 'You are an experienced AP History teacher.' },
    { letter: 'T', color: '#16a34a', label: 'Task', text: 'Create 10 review questions with answers.' },
    { letter: 'F', color: '#9333ea', label: 'Format', text: 'In a numbered list.' },
    { letter: 'C', color: '#ea580c', label: 'Context', text: 'On the causes of WWI, focusing on the alliance system.' },
  ];

  // activeUpTo: 0 = none active (just vague), 1 = R active, 2 = R+T, 3 = R+T+F, 4 = all
  const renderPromptBanner = (activeUpTo: number) => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mt-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Building Our Prompt</p>
        <div className="flex gap-1">
          {PROMPT_LAYERS.map((layer, idx) => (
            <span
              key={layer.letter}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-extrabold"
              style={idx < activeUpTo ? { backgroundColor: layer.color, color: '#fff' } : { backgroundColor: '#f3f4f6', color: '#d1d5db' }}
            >
              {layer.letter}
            </span>
          ))}
        </div>
      </div>
      {activeUpTo === 0 && (
        <p className="text-red-500 font-mono text-sm line-through mb-2">"Help me study for my history test."</p>
      )}
      <div className="space-y-2">
        {PROMPT_LAYERS.map((layer, idx) => {
          const isActive = idx < activeUpTo;
          const isNext = idx === activeUpTo;
          return (
            <div key={layer.letter} className={`flex items-start gap-2.5 rounded-lg px-3 py-1.5 ${isActive ? 'bg-gray-50' : ''}`}>
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-extrabold shrink-0 mt-0.5"
                style={isActive ? { backgroundColor: layer.color, color: '#fff' } : { backgroundColor: '#f3f4f6', color: '#d1d5db' }}
              >
                {layer.letter}
              </span>
              {isActive ? (
                <p className="font-mono text-sm text-gray-900">{layer.text}</p>
              ) : (
                <p className={`text-sm ${isNext ? 'text-gray-400 italic' : 'text-gray-300'}`}>
                  {isNext ? `${layer.label} — coming next...` : `${layer.label}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ────────────── Video Clip Renderer ──────────────
  // Clips from How_Prompting_Actually_Works.mp4 (~7:19)
  // Clip timestamps from transcript — may need ±2s fine-tuning
  const renderVideoClip = (
    clipNumber: number,
    title: string,
    description: string,
    start: number,
    end: number,
    iconColor: string,
    promptBannerLevel?: number
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PlayCircle className={`w-6 h-6 ${iconColor}`} />
          {title}
        </CardTitle>
        <p className="text-gray-700 mt-1">{description}</p>
      </CardHeader>
      <CardContent>
        <PremiumVideoPlayer
          videoUrl={VIDEO_URL}
          videoId={`introduction-to-prompting-clip${clipNumber}`}
          segments={[{
            id: `prompting-clip-${clipNumber}`,
            title,
            description,
            start,
            end,
            source: VIDEO_URL,
            mandatory: true,
          }]}
          onSegmentComplete={() => {}}
          onModuleComplete={handleNextSegment}
          enableSubtitles={false}
          hideSegmentNavigator={true}
          allowSeeking={false}
        />
        {promptBannerLevel !== undefined && renderPromptBanner(promptBannerLevel)}
      </CardContent>
    </Card>
  );

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
                    <span>The four building blocks: Role, Task, Format, Context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>How to build and refine prompts through conversation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced techniques: few-shot prompting and chain-of-thought</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>How to talk about AI precisely and verify its output</span>
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

      // ──── Segment 1: Video — Why Are Results So Inconsistent? (9.75–39.7) ────
      case 1:
        return renderVideoClip(
          1,
          'Why Are Results So Inconsistent?',
          'Sometimes AI gives you something brilliant, sometimes garbage. Why?',
          9.75,
          39.7,
          'text-blue-600'
        );

      // ──── Segment 2: What Is a Prompt? (Visual Chat Demo) ────
      case 2:
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                So... What Is a Prompt?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-gray-600 text-center">
                A <strong className="text-purple-700">prompt</strong> is whatever you type into an AI tool. That's it. Let's see one in action.
              </p>

              {/* Fake chat interface */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                {/* Chat header */}
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-400 text-xs ml-2 font-mono">AI Chat</span>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-4">
                  {/* User message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-end"
                  >
                    <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Help me study</p>
                    </div>
                  </motion.div>

                  {/* AI response - vague */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-700 text-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Sure! What subject would you like to study? Do you want flashcards, a summary, practice questions, or something else? What grade level? What chapter?...</p>
                      <p className="text-xs text-gray-400 mt-2">The AI has no idea what you need.</p>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="flex items-center gap-2 py-1"
                  >
                    <div className="flex-1 border-t border-gray-600" />
                    <span className="text-xs text-gray-500 font-bold">vs.</span>
                    <div className="flex-1 border-t border-gray-600" />
                  </motion.div>

                  {/* User message - specific */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="flex justify-end"
                  >
                    <div className="bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Create 10 flashcards on Chapter 5 photosynthesis vocab — term, definition, and example on each</p>
                    </div>
                  </motion.div>

                  {/* AI response - specific */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-700 text-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm font-semibold text-green-400 mb-1">Flashcard 1/10</p>
                      <p className="text-sm"><strong className="text-gray-100">Term:</strong> Chlorophyll</p>
                      <p className="text-sm"><strong className="text-gray-100">Definition:</strong> The green pigment in plants that captures light energy</p>
                      <p className="text-sm"><strong className="text-gray-100">Example:</strong> Leaves are green because of chlorophyll</p>
                      <p className="text-xs text-gray-400 mt-2">Exactly what you asked for.</p>
                    </div>
                  </motion.div>
                </div>

                {/* Fake input bar */}
                <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
                  <div className="bg-gray-700 rounded-full px-4 py-2 text-gray-500 text-sm flex items-center justify-between">
                    <span>This is where your prompt goes...</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Takeaway */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.0 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center"
              >
                <p className="text-purple-900 font-medium">
                  Same AI tool. Same student. <strong>The only difference was the prompt.</strong>
                </p>
              </motion.div>

              <div className="flex justify-center">
                <Button onClick={handleNextSegment} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Got It — Let's Practice <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 3: Say What You See ────
      case 3:
        return (
          <SayWhatYouSeeActivity
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 4: Video — How AI Actually Works (40.62–104.34) ────
      case 4:
        return renderVideoClip(
          2,
          'How AI Actually Works',
          'AI doesn\'t think — it predicts. Understanding this changes how you talk to it.',
          40.62,
          104.34,
          'text-blue-600'
        );

      // ──── Segment 5: Vague vs. Specific (Transition) ────
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Vague vs. Specific
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-lg text-gray-700">
                  As you saw in the video, AI is a <strong>prediction machine</strong>. The more specific your prompt, the fewer directions it can go — and the better the result.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
              >
                <p className="text-blue-800 font-medium">
                  Let's test your eye. Can you tell which prompts are <strong>vague</strong> and which are <strong>specific</strong>?
                </p>
              </motion.div>

              <div className="flex justify-center">
                <Button onClick={handleNextSegment} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Let's Find Out <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 6: Vague or Specific? (Classification Activity) ────
      case 6:
        return (
          <PromptRaterActivity onComplete={handleNextSegment} />
        );

      // ──── Segment 7: Video — The Funnel Part 1 (105–136) ────
      case 7:
        return renderVideoClip(
          3,
          'The Funnel',
          'See how prompting works like a funnel — every detail you add narrows the AI\'s output.',
          105,
          137,
          'text-green-600'
        );

      // ──── Segment 8: The Funnel in Action (Visualization) ────
      case 8:
        return (
          <PromptFunnelVisualization onComplete={handleNextSegment} />
        );

      // ──── Segment 9: Video — Narrowing the Funnel Part 2 (136–170) ────
      case 9:
        return renderVideoClip(
          4,
          'Narrowing the Funnel',
          'Now see how each layer of detail narrows the funnel further — from infinite possibilities to exactly what you need.',
          137,
          170.8,
          'text-green-600'
        );

      // ──── Segment 10: The RTFC Framework (Flip Cards) ────
      case 10:
        return (
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                The RTFC Framework
              </CardTitle>
              <p className="text-gray-600 mt-1">Every great prompt has four parts. Tap each letter to reveal it.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* RTFC letter row */}
              <div className="flex justify-center gap-3 mb-2">
                {RTFC_CARDS.map((card, index) => {
                  const isRevealed = principlesRevealed.includes(index);
                  return (
                    <motion.div
                      key={card.letter}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-extrabold transition-all ${
                        isRevealed
                          ? 'text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      style={isRevealed ? { backgroundColor: card.bgHex } : undefined}
                    >
                      {card.letter}
                    </motion.div>
                  );
                })}
              </div>

              {/* Flip cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {RTFC_CARDS.map((card, index) => {
                  const isRevealed = principlesRevealed.includes(index);
                  const colors = colorMap[card.color];
                  return (
                    <motion.button
                      key={index}
                      onClick={() => {
                        if (!isRevealed) {
                          setPrinciplesRevealed([...principlesRevealed, index]);
                        }
                      }}
                      whileHover={{ scale: isRevealed ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${
                        isRevealed
                          ? `${colors.bg} ${colors.border}`
                          : 'bg-gray-50 border-gray-200 cursor-pointer hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ opacity: 0, rotateY: 90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            transition={{ duration: 0.4 }}
                            className="p-5"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-extrabold text-lg shrink-0"
                                style={{ backgroundColor: card.bgHex, color: '#ffffff' }}
                              >
                                {card.letter}
                              </span>
                              <div>
                                <h4 className={`font-bold text-lg ${colors.text}`}>{card.title}</h4>
                                <p className={`text-sm ${colors.text} opacity-80`}>{card.subtitle}</p>
                              </div>
                            </div>
                            <p className={`text-sm ${colors.text} font-mono bg-white/50 rounded-lg px-3 py-2 mt-2`}>
                              {card.example}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            className="flex items-center justify-center py-8 px-4"
                          >
                            <div className="text-center">
                              <span
                                className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-200 text-gray-400 font-extrabold text-2xl mx-auto mb-2"
                              >
                                {card.letter}
                              </span>
                              <p className="text-gray-400 text-sm font-medium">Tap to reveal</p>
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
                  className="space-y-3 pt-2"
                >
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <p className="text-purple-900 font-medium">
                      <strong>R</strong>ole + <strong>T</strong>ask + <strong>F</strong>ormat + <strong>C</strong>ontext = a prompt that gets exactly what you need.
                    </p>
                  </div>
                  <Button onClick={handleNextSegment} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Now Let's Use RTFC <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        );

      // ──── Segment 11: Let's Build a Prompt (Transition) ────
      case 11:
        return (
          <Card>
            <CardContent className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
                  <PenTool className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Watch a Prompt Get Built
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto">
                  You'll watch how this useless prompt gets transformed — one RTFC layer at a time — through short video clips and hands-on activities.
                </p>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">The Starting Prompt</p>
                  <p className="text-red-900 font-mono text-xl">"Help me study for my history test."</p>
                  <p className="text-red-500 text-sm mt-2">No role. No task. No format. No context. Useless.</p>
                </div>

                <Button onClick={handleNextSegment} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  See How It's Fixed <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        );

      // ──── Segment 12: Video — Role: The First Layer (171.10–204.84) ────
      case 12:
        return renderVideoClip(
          5,
          'Role — The First Layer',
          'Watch how adding just a Role transforms a useless prompt into something that sounds like it came from an expert.',
          171,
          205,
          'text-blue-600',
          0
        );

      // ──── Segment 13: Role Activity ────
      case 13:
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-white font-bold text-lg" style={{ backgroundColor: '#2563eb' }}>R</span>
                Role: Who Should the AI Be?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {renderPromptBanner(1)}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-blue-800 text-sm">
                  We just added a <strong>Role</strong> — now the AI responds like an expert. Different scenarios need different roles.
                </p>
              </div>

              <h3 className="font-semibold text-gray-900 text-lg text-center">Your Turn: Match the Scenario to the Best Role</h3>

              {/* Role Matching Game */}
              <div className="space-y-3">
                {ROLE_MATCHING_SCENARIOS.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
                  </div>
                ))}

                {Object.keys(roleMatchAnswers).length === ROLE_MATCHING_SCENARIOS.length && !roleMatchChecked && (
                  <Button onClick={() => setRoleMatchChecked(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
                        {' '}The right role shapes everything the AI produces.
                      </p>
                    </div>
                    <Button onClick={handleNextSegment} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Next: Add a Task <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      // ──── Segment 14: Video — Task & Format (205.42–224.70) ────
      case 14:
        return renderVideoClip(
          6,
          'Task & Format — Getting Tighter',
          'Now see how adding a specific Task and Format eliminates all the wrong options.',
          205,
          225,
          'text-green-600',
          1
        );

      // ──── Segment 15: Task Activity — Power Verb Explorer ────
      case 15: {
        const POWER_VERB_DATA = [
          { verb: 'Create', emoji: '🎨', task: 'Create 10 practice quiz questions about WWI causes', output: 'Q1: Which assassination triggered WWI?\nA) King George V  B) Archduke Franz Ferdinand ✓  C) Kaiser Wilhelm\n\nQ2: What was the alliance system?\nA) A trade agreement  B) A mutual defense pact ✓  C) A peace treaty...' },
          { verb: 'Summarize', emoji: '📝', task: 'Summarize the causes of WWI for a 10th grader', output: 'WWI started because of three big problems: European countries had secret alliances that forced them to fight for each other, nations were competing to build the biggest empires and armies, and when Archduke Franz Ferdinand was assassinated in 1914, it set off a chain reaction that pulled everyone in.' },
          { verb: 'Compare', emoji: '⚖️', task: 'Compare the Allied and Central Powers\' motivations', output: 'Allied Powers (France, Britain, Russia): Wanted to stop Germany from dominating Europe. Fought to defend smaller nations and honor their alliance agreements.\n\nCentral Powers (Germany, Austria-Hungary): Wanted more territory and power. Germany felt "encircled" by enemies and saw war as a chance to break free.' },
          { verb: 'Explain', emoji: '💡', task: 'Explain why alliances made WWI worse', output: 'Think of it like a group chat where everyone promised to back each other up in a fight. When Austria-Hungary attacked Serbia, Russia stepped in to help Serbia. Then Germany backed Austria-Hungary, which pulled in France and Britain. One conflict between two countries dragged in the entire continent.' },
          { verb: 'Evaluate', emoji: '⭐', task: 'Evaluate whether WWI could have been prevented', output: 'Arguments it was preventable: Diplomats had multiple chances to de-escalate during the July Crisis. Britain could have declared neutrality earlier, which might have made Germany hesitate.\n\nArguments it was inevitable: The arms race, imperial competition, and rigid alliance system made a major conflict nearly certain — the assassination was just the spark.' },
          { verb: 'Rewrite', emoji: '🔄', task: 'Rewrite this paragraph about WWI in simpler language', output: 'Before: "The geopolitical tensions arising from imperial ambitions and entangling alliances created an environment of mutual suspicion..."\n\nAfter: "Countries were competing to control more land and build bigger armies. Secret alliances meant that if one country got into a fight, everyone else got dragged in too."' },
        ];

        const selectedVerbData = selectedPowerVerb ? POWER_VERB_DATA.find(v => v.verb === selectedPowerVerb) : null;

        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-white font-bold text-lg" style={{ backgroundColor: '#16a34a' }}>T</span>
                Task: What Exactly Do You Want?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {renderPromptBanner(2)}

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-800 text-sm">
                  A <strong>Task</strong> starts with a <strong>verb</strong>. The verb you choose completely changes what the AI tool produces. Tap any verb to see:
                </p>
              </div>

              {/* Power verb grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POWER_VERB_DATA.map((item) => {
                  const isSelected = selectedPowerVerb === item.verb;
                  const wasExplored = exploredVerbs.includes(item.verb);
                  return (
                    <button
                      key={item.verb}
                      onClick={() => {
                        setSelectedPowerVerb(item.verb);
                        if (!exploredVerbs.includes(item.verb)) {
                          setExploredVerbs(prev => [...prev, item.verb]);
                        }
                      }}
                      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-green-100 border-green-500 shadow-sm'
                          : wasExplored
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{item.verb}</span>
                    </button>
                  );
                })}
              </div>

              {/* Output preview */}
              {selectedVerbData && (
                <motion.div
                  key={selectedVerbData.verb}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* The task */}
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Your Task</p>
                    <p className="text-green-900 font-mono text-sm">
                      <span className="inline-block font-extrabold bg-green-200 text-green-900 rounded px-1.5 py-0.5 mr-1">{selectedVerbData.verb}</span>
                      {selectedVerbData.task.slice(selectedVerbData.verb.length)}
                    </p>
                  </div>

                  {/* The output preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">What the AI tool produces</p>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{selectedVerbData.output}</pre>
                  </div>
                </motion.div>
              )}

              {/* Explore prompt + next */}
              <div className={`rounded-xl p-4 text-center border-2 ${exploredVerbs.length >= 3 ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-200'}`}>
                <p className={`text-sm font-bold ${exploredVerbs.length >= 3 ? 'text-green-700' : 'text-amber-700'}`}>
                  {exploredVerbs.length >= 3 ? `${exploredVerbs.length} verbs explored ✓` : `Explore at least 3 verbs to continue`}
                </p>
                <div className="flex justify-center gap-1.5 mt-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`h-2 w-10 rounded-full transition-all ${i < exploredVerbs.length ? 'bg-green-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              {exploredVerbs.length >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 text-sm font-medium">
                      Same topic. Different verb. Completely different output. <strong>The verb is the steering wheel of your prompt.</strong>
                    </p>
                  </div>
                  <Button onClick={handleNextSegment} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Next: Format <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        );
      }

      // ──── Segment 16: Format Activity ────
      case 16:
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-white font-bold text-lg" style={{ backgroundColor: '#9333ea' }}>F</span>
                Format: How Should It Look?
              </CardTitle>
              <p className="text-gray-600 mt-1">
                The Format tells the AI tool exactly how to structure its response. Same content, completely different output.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {renderPromptBanner(3)}
              <FormatActivity onComplete={handleNextSegment} />
            </CardContent>
          </Card>
        );

      // ──── Segment 17: Video — Context: The Final Layer (225.42–244.32) ────
      case 17:
        return renderVideoClip(
          7,
          'Context — The Final Layer',
          'The last piece of the puzzle. Watch how Context makes the output hyper-targeted to exactly what you need.',
          225,
          244.5,
          'text-orange-600',
          3
        );

      // ──── Segment 18: Context Activity — Context Swap ────
      case 18: {
        const CONTEXT_SWAPS = [
          {
            label: '10th grade test prep',
            context: 'on the causes of WWI, focusing on the alliance system. For a 10th-grade student studying for a test on Friday.',
            output: 'Q1: Name the two main alliance blocs before WWI. (Keep it simple — just the countries.)\nQ2: How did the assassination of Archduke Franz Ferdinand trigger a chain reaction?\nQ3: Why couldn\'t countries stay neutral once the alliances activated?',
          },
          {
            label: 'AP-level essay prep',
            context: 'on the causes of WWI for an AP History student writing an analytical essay. Focus on imperialism, nationalism, and militarism.',
            output: 'Q1: Analyze how imperial competition between European powers contributed to WWI tensions.\nQ2: Evaluate the role of nationalism in escalating a regional crisis into a world war.\nQ3: To what extent was the arms race a direct cause of WWI?',
          },
          {
            label: '9th grade intro',
            context: 'about WWI basics for a 9th grader who is just learning about it for the first time. Use simple language.',
            output: 'Q1: What does "world war" mean? Why was WWI called that?\nQ2: Which countries were on each side? (Hint: think Allies vs. Central Powers)\nQ3: What event is usually called the "spark" that started WWI?',
          },
        ];
        const selectedCtx = exploredVerbs.length > 0 ? CONTEXT_SWAPS.find(c => c.label === exploredVerbs[exploredVerbs.length - 1]) : null;

        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-white font-bold text-lg" style={{ backgroundColor: '#ea580c' }}>C</span>
                Context: Tell the AI About Your Situation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {renderPromptBanner(4)}

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <p className="text-orange-800 text-sm">
                  <strong>Context</strong> = the details about <strong>your</strong> situation — the topic, your grade level, what you need it for.
                </p>
              </div>

              {/* Base prompt */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Same Role + Task + Format</p>
                <p className="text-gray-800 font-mono text-sm">"You are an AP History teacher. Create 10 review questions with answers..."</p>
              </div>

              {/* Context swap buttons */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-2 text-center">Tap to swap the context:</p>
                <div className="grid grid-cols-3 gap-2">
                  {CONTEXT_SWAPS.map((item) => {
                    const isSelected = selectedCtx?.label === item.label;
                    const wasExplored = exploredVerbs.includes(item.label);
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (!exploredVerbs.includes(item.label)) {
                            setExploredVerbs(prev => [...prev, item.label]);
                          } else {
                            setExploredVerbs(prev => [...prev.filter(v => v !== item.label), item.label]);
                          }
                        }}
                        className={`px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-orange-100 border-orange-500 text-orange-800'
                            : wasExplored
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {item.label}
                        {wasExplored && !isSelected && <CheckCircle className="w-3 h-3 inline ml-1 text-orange-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {selectedCtx && (
                <motion.div
                  key={selectedCtx.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">Context added</p>
                    <p className="text-orange-900 font-mono text-sm">...{selectedCtx.context}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">AI output changes to</p>
                    <pre className="text-sm text-green-900 whitespace-pre-wrap font-mono leading-relaxed">{selectedCtx.output}</pre>
                  </div>
                </motion.div>
              )}

              {/* Takeaway + next */}
              {exploredVerbs.filter(v => CONTEXT_SWAPS.some(c => c.label === v)).length >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                    <p className="text-orange-800 text-sm font-medium">
                      Same role, same task, same format — <strong>completely different output.</strong> Context is what makes it yours.
                    </p>
                  </div>
                  <Button onClick={handleNextSegment} size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Next: RTFC Quiz <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        );
      }

      // ──── Segment 19: RTFC Builder ────
      case 19:
        return (
          <RTFOutputBuilder
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 20: Video Clip — Advanced Tricks (277–330.00) ────
      case 20:
        return renderVideoClip(
          8,
          'Advanced Tricks',
          'You\'ve mastered the four building blocks — now learn advanced techniques that give you even more precise control over AI output.',
          277,
          330,
          'text-purple-600'
        );

      // ──── Segment 21: Zero-Shot vs. Few-Shot ────
      case 21:
        return (
          <ZeroVsFewShotActivity
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 22: Chain-of-Thought Prompting ────
      case 22:
        return (
          <ChainOfThoughtActivity
            onComplete={handleNextSegment}
            isDevMode={isDevModeActive}
          />
        );

      // ──── Segment 23: Video Clip — The Golden Rules (330.68–461.32) ────
      case 23:
        return renderVideoClip(
          9,
          'The Golden Rules',
          'The most important lesson: why you must always verify AI output, why precise language matters, and the golden rule — you are the thinker, AI is the tool.',
          331,
          462,
          'text-orange-600'
        );

      // ──── Segment 24: Exit Ticket ────
      case 24:
        return (
          <PromptEnhancerExitTicket onComplete={handleNextSegment} />
        );

      // ──── Segment 25: Certificate ────
      case 25:
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
