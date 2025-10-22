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
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

type ScenarioPhase = 'intro' | 'wrong-way' | 'debrief' | 'right-way' | 'tips';

interface Message {
  role: 'user' | 'ai';
  content: string;
  tokenCount?: number;
}

export default function WhyTokenLimitsMatter({ onComplete }: Props) {
  const [scenarioPhase, setScenarioPhase] = useState<ScenarioPhase>('intro');
  const [wrongWayStep, setWrongWayStep] = useState(0);
  const [rightWayStep, setRightWayStep] = useState(0);
  const [viewedTips, setViewedTips] = useState<Set<number>>(new Set());
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  const TOKEN_LIMIT = 8000; // ChatGPT 4 limit

  // Wrong way scenario messages
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
      content: 'I can see the beginning of your article about renewable energy systems and the introduction to solar panel efficiency. However, I cannot see the rest of the document as it exceeded my 8,000 token context window. I can only access approximately the first 6 pages. I don\'t have access to the methodology, results, discussion, or conclusion sections you asked about.',
      tokenCount: 120
    },
    {
      role: 'user',
      content: 'Wait, you can\'t see all of it? I asked you to analyze the WHOLE article!',
      tokenCount: 80
    },
    {
      role: 'ai',
      content: 'I apologize for the confusion. The article was too long for my context window. I can only process about 6 pages at a time, and your article appears to be 15 pages. Everything after page 6 is invisible to me.',
      tokenCount: 95
    }
  ];

  // Right way scenario messages
  const rightWayMessages: Message[] = [
    {
      role: 'user',
      content: 'Can you help me analyze this 15-page research article about renewable energy?',
      tokenCount: 50
    },
    {
      role: 'ai',
      content: 'I\'d be happy to help! Since the article is 15 pages, it will exceed my 8,000 token limit. Let\'s break it down into sections. Can you start by pasting just the introduction and methodology (first 5 pages)?',
      tokenCount: 100
    },
    {
      role: 'user',
      content: '📄 [Pasting pages 1-5: Introduction & Methodology]',
      tokenCount: 5200
    },
    {
      role: 'ai',
      content: 'Great! I can see the introduction explains the global shift toward renewable energy, and the methodology describes a 3-year study of solar panel efficiency across 12 countries. The research examines efficiency improvements from new nano-coating technology. Now, please share the results and discussion sections (pages 6-10).',
      tokenCount: 150
    },
    {
      role: 'user',
      content: '📄 [Pasting pages 6-10: Results & Discussion]',
      tokenCount: 5400
    },
    {
      role: 'ai',
      content: 'Excellent! The results show a 23% increase in efficiency with the new coating technology, with the strongest improvements in high-humidity climates. The discussion section analyzes cost-benefit ratios and implementation barriers. Now please share the conclusion (pages 11-15).',
      tokenCount: 140
    },
    {
      role: 'user',
      content: '📄 [Pasting pages 11-15: Conclusion & References]',
      tokenCount: 4200
    },
    {
      role: 'ai',
      content: 'Perfect! Now I\'ve analyzed the complete article in manageable chunks. The conclusion emphasizes that while the technology shows promise, widespread adoption requires policy incentives and infrastructure investment. Here\'s my comprehensive summary of all sections...',
      tokenCount: 130
    }
  ];

  // Check if all tips viewed
  useEffect(() => {
    setCanContinue(viewedTips.size === 3);
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
      setViewedTips(new Set([0, 1, 2]));
      setCanContinue(true);
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, []);

  // Get current token count for animations
  const getCurrentTokenCount = (messageIndex: number, messages: Message[]): number => {
    return messages.slice(0, messageIndex + 1).reduce((sum, msg) => {
      // For user message pasting article, show rapid increase
      if (msg.tokenCount && msg.tokenCount > TOKEN_LIMIT) {
        return TOKEN_LIMIT + (msg.tokenCount - TOKEN_LIMIT);
      }
      return Math.min(sum + (msg.tokenCount || 0), TOKEN_LIMIT + 10000);
    }, 0);
  };

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
              onClick={() => setScenarioPhase('wrong-way')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl rounded-xl"
            >
              Show Me What Happens <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* SCENARIO 1: THE WRONG WAY */}
        {scenarioPhase === 'wrong-way' && (
          <ChatGPTSimulation
            messages={wrongWayMessages}
            currentStep={wrongWayStep}
            onStepComplete={() => setWrongWayStep(wrongWayStep + 1)}
            onScenarioComplete={() => setScenarioPhase('debrief')}
            tokenLimit={TOKEN_LIMIT}
            title="Scenario 1: The Wrong Way ❌"
            subtitle="Watch what happens when you paste a long document all at once..."
          />
        )}

        {/* DEBRIEF SECTION */}
        {scenarioPhase === 'debrief' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                What Just Happened?
              </h1>
            </div>

            {/* Explanation Card */}
            <div className="bg-red-900/30 border-2 border-red-400 rounded-xl p-8">
              <div className="space-y-4 text-white">
                <p className="text-xl font-semibold">
                  The article was <span className="text-red-300">TOO LONG</span> for ChatGPT 4's memory:
                </p>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>The article was 15 pages = <strong className="text-red-300">~32,000 tokens</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>ChatGPT 4 can only hold <strong className="text-red-300">8,000 tokens</strong> (~6 pages)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Everything after page 6 was <strong className="text-red-300">CUT OFF</strong> and invisible to the AI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>The AI couldn't analyze the methodology, results, or conclusions because it <strong className="text-red-300">never saw them</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual Diagram */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                What the AI Could See
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pages 1-6: Visible */}
                <div className="bg-green-900/40 border-2 border-green-400 rounded-lg p-6">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-center mb-2">Pages 1-6</h3>
                  <p className="text-white/90 text-center text-sm">✅ AI could see this</p>
                  <div className="mt-4 space-y-2">
                    {[1, 2, 3, 4, 5, 6].map(page => (
                      <div key={page} className="bg-green-500/20 rounded p-2 text-center text-white text-sm">
                        Page {page}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pages 7-15: Invisible */}
                <div className="bg-red-900/40 border-2 border-red-400 rounded-lg p-6 opacity-60">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-center mb-2">Pages 7-15</h3>
                  <p className="text-white/90 text-center text-sm">❌ AI COULD NOT see this</p>
                  <div className="mt-4 space-y-2">
                    {[7, 8, 9, 10, 11, 12, 13, 14, 15].map(page => (
                      <div key={page} className="bg-gray-700/50 rounded p-2 text-center text-white/50 text-sm line-through">
                        Page {page}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Impact */}
            <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-3">🌍 Why This Matters to YOU:</h3>
              <ul className="text-white space-y-2">
                <li>• This happens when you paste long essays, research papers, or study guides</li>
                <li>• This happens in very long conversations (AI "forgets" early messages)</li>
                <li>• This is why AI sometimes gives incomplete or confusing answers</li>
              </ul>
            </div>

            {/* Continue Button */}
            <Button
              onClick={() => {
                setScenarioPhase('right-way');
                setRightWayStep(0);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-xl rounded-xl"
            >
              Got it! Now show me the RIGHT way <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* SCENARIO 2: THE RIGHT WAY */}
        {scenarioPhase === 'right-way' && (
          <ChatGPTSimulation
            messages={rightWayMessages}
            currentStep={rightWayStep}
            onStepComplete={() => setRightWayStep(rightWayStep + 1)}
            onScenarioComplete={() => setScenarioPhase('tips')}
            tokenLimit={TOKEN_LIMIT}
            title="Scenario 2: The Right Way ✅"
            subtitle="Watch how chunking the article into smaller sections solves the problem..."
            isSuccessScenario={true}
          />
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
                Click each tip to learn more. You need to view all 3 to continue.
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
                icon={<MessageSquare className="w-8 h-8 text-blue-400" />}
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
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">
                  Tips Viewed: {viewedTips.size}/3
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
                'View all 3 tips to continue'
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
  onStepComplete: () => void;
  onScenarioComplete: () => void;
  tokenLimit: number;
  title: string;
  subtitle: string;
  isSuccessScenario?: boolean;
}

function ChatGPTSimulation({
  messages,
  currentStep,
  onStepComplete,
  onScenarioComplete,
  tokenLimit,
  title,
  subtitle,
  isSuccessScenario = false
}: ChatGPTSimulationProps) {
  const visibleMessages = messages.slice(0, currentStep + 1);
  const currentTokenCount = visibleMessages.reduce((sum, msg) => sum + (msg.tokenCount || 0), 0);
  const isOverLimit = currentTokenCount > tokenLimit;
  const isComplete = currentStep >= messages.length - 1;

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
          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
            isOverLimit ? 'bg-red-500/20 text-red-300 border border-red-500' : 'bg-gray-700 text-white'
          }`}>
            Tokens: {currentTokenCount.toLocaleString()} / {tokenLimit.toLocaleString()}
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
                transition={{ delay: index * 0.5 }}
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

          {/* Token Limit Warning */}
          {isOverLimit && !isSuccessScenario && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/40 border-2 border-red-400 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">⚠️ TOKEN LIMIT EXCEEDED!</p>
                  <p className="text-white/90 text-sm">
                    The AI can't see everything. Content was cut off!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Token Meter */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
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

      {/* Continue Button */}
      <div className="flex justify-center">
        {!isComplete ? (
          <Button
            onClick={onStepComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onScenarioComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg"
          >
            {isSuccessScenario ? 'See the Smart Tips' : 'What Happened?'} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
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
