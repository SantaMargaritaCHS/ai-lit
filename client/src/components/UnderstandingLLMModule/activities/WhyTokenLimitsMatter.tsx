import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Zap,
  ArrowRight,
  Scissors,
  FileText,
  ChevronDown,
  ChevronUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

type ScenarioPhase = 'intro' | 'wrong-way' | 'tips';

interface Message {
  role: 'user' | 'ai';
  content: string;
  tokenCount?: number;
}

export default function WhyTokenLimitsMatter({ onComplete }: Props) {
  const [scenarioPhase, setScenarioPhase] = useState<ScenarioPhase>('intro');
  const [wrongWayStep, setWrongWayStep] = useState(0);
  const [viewedTips, setViewedTips] = useState<Set<number>>(new Set());
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [canContinue, setCanContinue] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const TOKEN_LIMIT = 8000; // ChatGPT 4 limit

  // Wrong way scenario messages - MORE REALISTIC
  const wrongWayMessages: Message[] = [
    {
      role: 'user',
      content: 'Can you help me analyze this research article about renewable energy?',
      tokenCount: 50
    },
    {
      role: 'ai',
      content: 'Of course! I\'d be happy to help analyze your research article. Please share it with me.',
      tokenCount: 70
    },
    {
      role: 'user',
      content: '📄 [Pasting 15-page article: "Renewable Energy Transition in the 21st Century: A Comprehensive Analysis of Solar Panel Efficiency, Implementation Challenges, and Global Policy Frameworks..."] (15 pages total)',
      tokenCount: 32540 // Way over limit!
    },
    {
      role: 'ai',
      content: 'Based on the introduction section, this article examines solar panel efficiency improvements through new nano-coating technology. The research discusses the global shift toward renewable energy systems. For a complete analysis of the methodology, results, and conclusions, could you share those specific sections?',
      tokenCount: 120
    },
    {
      role: 'user',
      content: 'Wait, I already pasted the whole article! Did you see the results section on pages 10-12?',
      tokenCount: 80
    },
    {
      role: 'ai',
      content: 'I apologize for the confusion. I can only see the introduction and first few pages. Could you paste the results section (pages 10-12) separately so I can analyze it?',
      tokenCount: 95
    }
  ];

  // Context messages explaining what's happening at each step
  const contextMessages: { [key: number]: string } = {
    0: "👋 A student wants help analyzing a long research paper. This is a normal request.",
    1: "✅ ChatGPT says yes! Notice the token counter shows only 120 tokens used so far - plenty of room!",
    2: "⚠️ WATCH THIS: The student pastes their entire 15-page paper (32,540 tokens). But ChatGPT can only handle 8,000 tokens! Watch the Context Window bar below turn red.",
    3: "🤔 ChatGPT responds but ONLY talks about the introduction. Why? It never saw the rest of the paper - the context window was already full!",
    4: "😕 The student is confused. They specifically asked about the results section on page 10, but ChatGPT didn't mention it.",
    5: "💡 ChatGPT admits it can only see the first few pages. The rest was cut off without warning. This is why understanding token limits matters!"
  };

  // Steps where student must manually click Continue
  const pausePoints = [2, 3, 5];

  // Check if all tips viewed (now 4 tips)
  useEffect(() => {
    setCanContinue(viewedTips.size === 4);
  }, [viewedTips]);

  // Handle tip card click
  const handleTipClick = (tipIndex: number) => {
    setViewedTips((prev) => new Set(prev).add(tipIndex));
    setExpandedTip(expandedTip === tipIndex ? null : tipIndex);
  };

  // Auto-advance for dev mode
  useEffect(() => {
    const handleDevAutoComplete = () => {
      setScenarioPhase('tips');
      setViewedTips(new Set([0, 1, 2, 3])); // All 4 tips
      setCanContinue(true);
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, []);

  // Auto-advance timer with dynamic word-based timing
  useEffect(() => {
    if (scenarioPhase === 'wrong-way') {
      if (wrongWayStep < wrongWayMessages.length - 1) {
        // Reset simulation complete flag when replaying
        setSimulationComplete(false);

        // Check if current step is a pause point - DON'T auto-advance
        if (pausePoints.includes(wrongWayStep)) {
          return; // Wait for manual Continue click
        }

        const currentMessage = wrongWayMessages[wrongWayStep];
        const messageContent = currentMessage.content || '';
        const wordCount = messageContent.split(' ').length;

        // Dynamic delay: 1200ms base + 60ms per word (prevents 6-9 second waits)
        const baseDelay = 1200;
        const msPerWord = 60;
        const calculatedDelay = baseDelay + (wordCount * msPerWord);

        // AI messages get minimum 1800ms (more realistic), cap maximum at 4000ms
        const finalDelay = currentMessage.role === 'ai'
          ? Math.min(Math.max(calculatedDelay, 1800), 4000)
          : Math.min(calculatedDelay, 4000);

        const timer = setTimeout(() => {
          setWrongWayStep(wrongWayStep + 1);
        }, finalDelay);

        return () => clearTimeout(timer);
      } else {
        // Simulation complete - mark it
        setSimulationComplete(true);
      }
    }
  }, [scenarioPhase, wrongWayStep, wrongWayMessages, pausePoints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* INTRO SECTION */}
        {scenarioPhase === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Why Should You Care About Token Limits?
              </h1>
              <p className="text-white text-xl max-w-3xl mx-auto">
                Have you ever pasted a long essay into ChatGPT and gotten a weird, incomplete response? Here's why...
              </p>
            </div>

            {/* Model Comparison */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Different AI Models, Different Limits
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <span className="text-white font-semibold text-lg">ChatGPT 3.5</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">4,000 tokens</p>
                      <p className="text-white/70 text-sm">~3 pages</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[10%]" />
                  </div>
                </div>

                <div className="bg-blue-900/40 rounded-lg p-4 border-2 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧠</span>
                      <span className="text-white font-semibold text-lg">ChatGPT 4</span>
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">We'll use this!</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">8,000 tokens</p>
                      <p className="text-white/70 text-sm">~6 pages</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[20%]" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔧</span>
                      <span className="text-white font-semibold text-lg">GitHub Copilot</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">8,000 tokens</p>
                      <p className="text-white/70 text-sm">~6 pages of code</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 w-[20%]" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>
                      <span className="text-white font-semibold text-lg">Claude Sonnet</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">200,000 tokens</p>
                      <p className="text-white/70 text-sm">~500 pages</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[50%]" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💎</span>
                      <span className="text-white font-semibold text-lg">Gemini 1.5 Pro</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">1,000,000 tokens</p>
                      <p className="text-white/70 text-sm">~3,000 pages</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4 mt-6">
                <p className="text-white text-sm">
                  💡 <strong className="text-yellow-300">What this means:</strong> Bigger limits = more text at once. But what happens when you exceed the limit? Let's find out...
                </p>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={() => {
                setScenarioPhase('wrong-way');
                setWrongWayStep(0);
                setSimulationComplete(false);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
            >
              Show Me What Happens <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* SCENARIO: THE WRONG WAY (Step-by-step with manual progression) */}
        {scenarioPhase === 'wrong-way' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* PRE-SIMULATION INTRO BOX */}
            {wrongWayStep === 0 && (
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-2 border-blue-500 rounded-xl p-5">
                <p className="text-white text-center text-sm font-medium">
                  📚 <strong>WHAT YOU'LL LEARN:</strong> ChatGPT has a 'Context Window' - like a fixed-size container for text.
                  When you paste too much, it silently cuts off the extra. Watch how this causes confusion...
                </p>
              </div>
            )}

            {/* STATIC NARRATION BOX - MOVED ABOVE SIMULATION */}
            <div className="bg-blue-900/30 border-2 border-blue-400 rounded-xl p-6 min-h-[120px]">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-blue-300 font-bold text-sm mb-2">💡 WHAT'S HAPPENING</h3>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={wrongWayStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-base leading-relaxed"
                    >
                      {contextMessages[wrongWayStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <ChatGPTSimulation
              messages={wrongWayMessages}
              currentStep={wrongWayStep}
              tokenLimit={TOKEN_LIMIT}
              title="Token Limits in Action: When AI Can't See Everything"
              subtitle="Watch what happens when someone tries to paste more text than ChatGPT can handle"
            />

            {/* Continue Button - shown at pause points */}
            <AnimatePresence>
              {pausePoints.includes(wrongWayStep) && !simulationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <Button
                    onClick={() => setWrongWayStep(wrongWayStep + 1)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Replay and Continue to Tips - shown after simulation completes */}
            <AnimatePresence>
              {simulationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={() => {
                      setWrongWayStep(0);
                      setSimulationComplete(false);
                    }}
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 w-full sm:w-auto"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Replay Simulation
                  </Button>
                  <Button
                    onClick={() => setScenarioPhase('tips')}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
                  >
                    Continue to the Tips
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* SMART TIPS SECTION */}
        {scenarioPhase === 'tips' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Smart Ways to Work With Token Limits
              </h1>
              <p className="text-white text-xl">
                Click each tip to learn more. You need to view all 4 to continue.
              </p>
            </div>

            {/* Tip Cards */}
            <div className="space-y-4">
              {/* Tip 1: Break It Up */}
              <TipCard
                index={0}
                icon={<Scissors className="w-8 h-8 text-green-400" />}
                title="Break Long Documents Into Chunks"
                isExpanded={expandedTip === 0}
                isViewed={viewedTips.has(0)}
                onClick={() => handleTipClick(0)}
              >
                <ul className="space-y-2 text-white/90">
                  <li>• Split 15-page essays into 3-5 page sections</li>
                  <li>• Process each section separately</li>
                  <li>• Example: Introduction → Body Paragraphs → Conclusion</li>
                  <li>• Works for: Long essays, research papers, textbook chapters</li>
                </ul>
              </TipCard>

              {/* Tip 2: Summarize */}
              <TipCard
                index={1}
                icon={<FileText className="w-8 h-8 text-blue-400" />}
                title="Ask AI to Summarize Each Section"
                isExpanded={expandedTip === 1}
                isViewed={viewedTips.has(1)}
                onClick={() => handleTipClick(1)}
              >
                <ul className="space-y-2 text-white/90">
                  <li>• After each chunk, ask: "Summarize the key points"</li>
                  <li>• Copy summaries to a document</li>
                  <li>• At the end, ask AI to synthesize all summaries together</li>
                  <li>• Saves tokens AND helps organize your thoughts!</li>
                </ul>
              </TipCard>

              {/* Tip 3: Choose Right Tool */}
              <TipCard
                index={2}
                icon={<Zap className="w-8 h-8 text-purple-400" />}
                title="Choose the Right AI Tool for Your Task"
                isExpanded={expandedTip === 2}
                isViewed={viewedTips.has(2)}
                onClick={() => handleTipClick(2)}
              >
                <ul className="space-y-2 text-white/90">
                  <li>• <strong className="text-blue-300">ChatGPT 3.5</strong> (3 pages): Quick questions, short conversations</li>
                  <li>• <strong className="text-blue-300">ChatGPT 4</strong> (6 pages): Essay drafts, homework help</li>
                  <li>• <strong className="text-purple-300">Claude</strong> (500 pages): Research papers, long documents</li>
                  <li>• <strong className="text-pink-300">Gemini Pro</strong> (3,000+ pages): Entire books, massive datasets</li>
                  <li>• <strong className="text-yellow-300">Match the tool to your task size!</strong></li>
                </ul>
              </TipCard>

              {/* Tip 4: Start New Chat */}
              <TipCard
                index={3}
                icon={<RefreshCw className="w-8 h-8 text-orange-400" />}
                title="Start a New Chat When Switching Topics"
                isExpanded={expandedTip === 3}
                isViewed={viewedTips.has(3)}
                onClick={() => handleTipClick(3)}
              >
                <ul className="space-y-2 text-white/90">
                  <li>• Long conversations eat up tokens even if you switch topics</li>
                  <li>• Start a fresh chat when moving to a different subject</li>
                  <li>• Example: Don't ask about math homework in the same chat as your history essay</li>
                  <li>• Clears the AI's "memory" and gives you full token capacity</li>
                  <li>• Think of it like clearing your browser tabs before starting new work!</li>
                </ul>
              </TipCard>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">
                  Tips Viewed: {viewedTips.size}/4
                </span>
                {canContinue && (
                  <span className="text-green-400 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Ready to continue!
                  </span>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={onComplete}
              disabled={!canContinue}
              className={`w-full py-6 text-xl rounded-xl ${
                canContinue
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canContinue ? (
                <>
                  Continue to Next Activity <ArrowRight className="w-6 h-6 ml-2" />
                </>
              ) : (
                'View all 4 tips to continue'
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CHATGPT SIMULATION COMPONENT
// ============================================================================

interface ChatGPTSimulationProps {
  messages: Message[];
  currentStep: number;
  tokenLimit: number;
  title: string;
  subtitle: string;
}

function ChatGPTSimulation({
  messages,
  currentStep,
  tokenLimit,
  title,
  subtitle
}: ChatGPTSimulationProps) {
  const visibleMessages = messages.slice(0, currentStep + 1);
  const currentTokenCount = visibleMessages.reduce((sum, msg) => sum + (msg.tokenCount || 0), 0);
  const isOverLimit = currentTokenCount > tokenLimit;

  const getTokenBarColor = () => {
    const percentage = (currentTokenCount / tokenLimit) * 100;
    if (percentage < 50) return 'from-green-500 to-green-400';
    if (percentage < 75) return 'from-yellow-500 to-yellow-400';
    if (percentage < 90) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/80 text-lg">{subtitle}</p>
      </div>

      {/* ChatGPT Interface */}
      <div className="bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-white font-medium">ChatGPT 4</span>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold transition-all ${
            isOverLimit
              ? 'bg-red-500/30 text-red-300 border-2 border-red-500 animate-pulse text-base'
              : 'bg-gray-700 text-white text-sm border border-gray-600'
          }`}>
            {isOverLimit
              ? `⚠️ ${currentTokenCount.toLocaleString()} tokens (EXCEEDS ${tokenLimit.toLocaleString()} limit!)`
              : `Tokens: ${currentTokenCount.toLocaleString()} / ${tokenLimit.toLocaleString()}`
            }
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {visibleMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm">
                    🤖
                  </div>
                )}
                <div className={`max-w-[70%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm">
                    👤
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Token Limit Warning - Only shows at step 5 (final AI admission) */}
          {isOverLimit && currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/40 border-2 border-red-400 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-lg">⚠️ THE AI IS CONFUSED!</p>
                  <p className="text-white/90 text-sm mt-2">
                    The AI just hit its 8,000 token limit. It <strong>only saw the first few pages</strong> of the article.
                  </p>
                  <p className="text-white/90 text-sm mt-1">
                    Everything after that was <strong>silently ignored</strong>. It doesn't even know the rest of the text exists! That's why it's asking for sections you already pasted.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Token Meter */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          {/* --- ADDED LABEL --- */}
          <div className="flex justify-between items-center mb-1 px-1">
            <span className="text-xs font-medium text-white/70">
              Context Window
            </span>
            <span className={`text-xs font-bold ${isOverLimit ? 'text-red-400' : 'text-white/70'}`}>
              {isOverLimit ? 'LIMIT EXCEEDED' : ''}
            </span>
          </div>
          {/* --- END ADDED LABEL --- */}
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getTokenBarColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((currentTokenCount / tokenLimit) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// TIP CARD COMPONENT
// ============================================================================

interface TipCardProps {
  index: number;
  icon: React.ReactNode;
  title: string;
  isExpanded: boolean;
  isViewed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TipCard({ icon, title, isExpanded, isViewed, onClick, children }: TipCardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-xl border-2 transition-all cursor-pointer ${
        isViewed ? 'border-green-400' : 'border-white/20 hover:border-white/40'
      }`}
    >
      <div
        onClick={onClick}
        className="p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            {!isExpanded && (
              <p className="text-white/60 text-sm">Click to learn more</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isViewed && <CheckCircle className="w-6 h-6 text-green-400" />}
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-white" />
          ) : (
            <ChevronDown className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
