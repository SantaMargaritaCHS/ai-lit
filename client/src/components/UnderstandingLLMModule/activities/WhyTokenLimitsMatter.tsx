import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Zap,
  ArrowRight,
  Scissors,
  FileText,
  BarChart3,
  RefreshCw,
  BookOpen,
  MessageCircle,
  FileCode,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onComplete: () => void;
}

type ViewMode = 'intro' | 'tips';

interface AIModel {
  id: string;
  name: string;
  icon: string;
  tokenLimit: number;
  displayLimit: string;
  description: string;
  barColor: string;
}

interface Scenario {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  tokens: number;
  color: string;
}

export default function WhyTokenLimitsMatter({ onComplete }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [clickedScenarios, setClickedScenarios] = useState<Set<string>>(new Set());
  const [cumulativeTokens, setCumulativeTokens] = useState(0);
  const [viewedTips, setViewedTips] = useState<Set<number>>(new Set());
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  // AI Models with their token limits (context windows) - Updated October 2025
  const aiModels: AIModel[] = [
    {
      id: 'gpt35',
      name: 'GPT-3.5 Turbo',
      icon: '🤖',
      tokenLimit: 16000,
      displayLimit: '16,000',
      description: '~40 pages',
      barColor: 'from-blue-500 to-blue-400'
    },
    {
      id: 'gpt4o',
      name: 'GPT-4o',
      icon: '🧠',
      tokenLimit: 128000,
      displayLimit: '128,000',
      description: '~320 pages',
      barColor: 'from-cyan-500 to-cyan-400'
    },
    {
      id: 'gpt5',
      name: 'GPT-5',
      icon: '🚀',
      tokenLimit: 128000,
      displayLimit: '128,000',
      description: '~320 pages',
      barColor: 'from-green-500 to-emerald-400'
    },
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      icon: '✨',
      tokenLimit: 200000,
      displayLimit: '200,000',
      description: '~500 pages',
      barColor: 'from-purple-500 to-purple-400'
    },
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      icon: '💎',
      tokenLimit: 2000000,
      displayLimit: '2,000,000',
      description: '~5,000 pages',
      barColor: 'from-pink-500 to-purple-500'
    }
  ];

  // Interactive scenarios students can click to fill context windows
  const scenarios: Scenario[] = [
    {
      id: 'page',
      title: '4 double-spaced pages',
      icon: <FileText className="w-6 h-6" />,
      description: '~1,000 words',
      tokens: 1500,
      color: 'text-blue-400'
    },
    {
      id: 'essay',
      title: 'Essay (10 pages)',
      icon: <BookOpen className="w-6 h-6" />,
      description: '~5,000 words',
      tokens: 7000,
      color: 'text-green-400'
    },
    {
      id: 'article',
      title: 'Article (15 pages)',
      icon: <FileText className="w-6 h-6" />,
      description: '~7,500 words',
      tokens: 10000,
      color: 'text-orange-400'
    },
    {
      id: 'chat',
      title: 'Long conversation',
      icon: <MessageCircle className="w-6 h-6" />,
      description: '15-20 exchanges (+ AI responses)',
      tokens: 6000,
      color: 'text-purple-400'
    }
  ];

  // Check if all tips viewed (4 tips)
  useEffect(() => {
    setCanContinue(viewedTips.size === 4);
  }, [viewedTips]);

  // Handle scenario button click (cumulative) - allows multiple clicks
  const handleScenarioClick = (scenario: Scenario) => {
    // ALWAYS add tokens when clicked (allows multiple clicks)
    setCumulativeTokens((prev) => prev + scenario.tokens);

    // Track that it's been clicked at least once (for checkmark and continue button)
    if (!clickedScenarios.has(scenario.id)) {
      setClickedScenarios((prev) => new Set(prev).add(scenario.id));
    }
  };

  // Reset all scenarios
  const handleReset = () => {
    setClickedScenarios(new Set());
    setCumulativeTokens(0);
  };

  // Handle tip card click
  const handleTipClick = (tipIndex: number) => {
    setViewedTips((prev) => new Set(prev).add(tipIndex));
    setExpandedTip(expandedTip === tipIndex ? null : tipIndex);
  };

  // Calculate fill percentage for a model
  const getModelFillPercentage = (modelLimit: number): number => {
    return (cumulativeTokens / modelLimit) * 100;
  };

  // Get bar color based on fill percentage
  const getBarColor = (percentage: number): string => {
    if (percentage < 50) return 'from-green-500 to-green-400';
    if (percentage < 75) return 'from-yellow-500 to-yellow-400';
    if (percentage < 90) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  // Auto-advance for dev mode
  useEffect(() => {
    const handleDevAutoComplete = () => {
      setViewMode('tips');
      setClickedScenarios(new Set(['page', 'essay', 'article', 'chat']));
      setViewedTips(new Set([0, 1, 2, 3]));
      setCanContinue(true);
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* INTRO SECTION WITH INTERACTIVE CONTEXT WINDOW VISUALIZATION */}
        {viewMode === 'intro' && (
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
              <div className="bg-blue-900/40 border-2 border-blue-400 rounded-xl p-6 max-w-4xl mx-auto">
                <p className="text-white text-lg mb-3">
                  Have you ever pasted a long essay into ChatGPT and gotten a weird, incomplete response? Here's why...
                </p>
                <p className="text-white/90 mb-3">
                  AI models have <strong className="text-yellow-300">context windows</strong> (token limits) that determine how much they can process at once.
                </p>
                <p className="text-white/90">
                  <strong className="text-yellow-300">Try it yourself:</strong> Click the examples below to see how quickly different models fill up—some max out fast, others have room to spare!
                </p>
              </div>
            </div>

            {/* Scenario Buttons */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Add content to the context window:
                  </h3>
                  <p className="text-green-300 text-sm font-medium">
                    💡 Click the same example multiple times to keep adding tokens!
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Total Tokens</p>
                    <p className="text-2xl font-bold text-yellow-300">
                      {cumulativeTokens.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="bg-red-900/40 border-red-400 text-white hover:bg-red-900/60 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioClick(scenario)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                      clickedScenarios.has(scenario.id)
                        ? 'bg-green-900/30 border-green-400 hover:bg-green-800/40 hover:border-green-300'
                        : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={scenario.color}>
                        {scenario.icon}
                      </div>
                      <p className="text-white font-semibold text-sm text-center">
                        {scenario.title}
                      </p>
                      <p className="text-white/70 text-xs">
                        {scenario.description}
                      </p>
                      <div className="bg-yellow-900/40 border border-yellow-400 rounded px-2 py-1 mt-1">
                        <p className="text-yellow-300 text-sm font-bold">
                          +{scenario.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                      {clickedScenarios.has(scenario.id) && (
                        <div className="flex items-center gap-1 text-green-400 text-xs font-medium mt-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Click again to add more!</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-400 rounded-lg p-4">
                <p className="text-white font-semibold text-center mb-1">
                  ⭐ Pro Tip: Keep clicking!
                </p>
                <p className="text-white/90 text-sm text-center">
                  You can click the same content card over and over to keep adding tokens. Watch the bars fill up and exceed their limits!
                </p>
              </div>
            </div>

            {/* Model Comparison Table with Dynamic Bars */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                AI Models & Their Context Windows
              </h2>

              <div className="space-y-4">
                {aiModels.map((model) => {
                  const fillPercentage = getModelFillPercentage(model.tokenLimit);
                  const isExceeded = fillPercentage > 100;
                  const displayPercentage = Math.min(fillPercentage, 100);
                  const barColor = isExceeded ? 'from-red-600 to-red-500' : getBarColor(fillPercentage);

                  return (
                    <div
                      key={model.id}
                      className={`rounded-lg p-4 border-2 transition-all ${
                        isExceeded
                          ? 'bg-red-900/40 border-red-400'
                          : 'bg-gray-800/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{model.icon}</span>
                          <div>
                            <p className="text-white font-semibold text-lg">{model.name}</p>
                            <p className="text-white/70 text-sm">
                              {model.displayLimit} tokens ({model.description})
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isExceeded ? (
                            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
                              ⚠️ EXCEEDED
                            </div>
                          ) : (
                            <p className="text-white font-bold text-lg">
                              {fillPercentage.toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${displayPercentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full bg-gradient-to-r ${barColor}`}
                        />
                        {isExceeded && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      {isExceeded && (
                        <div className="bg-red-900/60 border border-red-400 rounded-lg p-3 mt-3">
                          <p className="text-red-200 font-bold text-sm mb-2">
                            ⚠️ Content exceeds limit by {(fillPercentage - 100).toFixed(0)}%
                          </p>
                          <p className="text-red-200 text-xs mb-2">
                            <strong className="text-white">What happens when you exceed the limit:</strong>
                          </p>
                          <ul className="text-red-200 text-xs space-y-1 ml-4">
                            <li>• The AI starts forgetting earlier parts of the conversation</li>
                            <li>• Responses may be incomplete or cut off mid-sentence</li>
                            <li>• Answers can become inconsistent or contradictory</li>
                            <li>• <strong className="text-white">Solution:</strong> Start a new chat or break content into smaller chunks</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {cumulativeTokens > 0 && (
                <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-4 mt-6">
                  <h3 className="text-white font-bold mb-2">💡 What This Shows:</h3>
                  <p className="text-white/90 text-sm">
                    {cumulativeTokens <= 16000 ? (
                      <>All models can handle {cumulativeTokens.toLocaleString()} tokens. GPT-3.5 is filling up—keep clicking to see it exceed!</>
                    ) : cumulativeTokens <= 24500 ? (
                      <>⚠️ GPT-3.5 (16K) is EXCEEDED! It would cut off earlier parts or refuse input. The other models still have room.</>
                    ) : cumulativeTokens <= 128000 ? (
                      <>GPT-3.5 is way over capacity. Newer models (GPT-4o, GPT-5, Claude, Gemini) handle this load easily. Model choice matters!</>
                    ) : cumulativeTokens <= 200000 ? (
                      <>⚠️ GPT-4o and GPT-5 (128K) are EXCEEDED! Only Claude and Gemini can handle {cumulativeTokens.toLocaleString()} tokens without losing context.</>
                    ) : cumulativeTokens <= 2000000 ? (
                      <>⚠️ Claude (200K) is EXCEEDED! Only Gemini's massive 2M token window remains. This demonstrates why choosing the right tool is critical for huge documents!</>
                    ) : (
                      <>🚨 EVEN GEMINI (2M) is EXCEEDED at {cumulativeTokens.toLocaleString()} tokens! At this scale, you'd need to break content into chunks or use specialized document processing systems.</>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <Button
              onClick={() => setViewMode('tips')}
              disabled={clickedScenarios.size < scenarios.length}
              className={`w-full py-6 text-xl rounded-xl transition-all ${
                clickedScenarios.size >= scenarios.length
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              {clickedScenarios.size >= scenarios.length ? (
                <>
                  Continue to Smart Tips <ArrowRight className="w-6 h-6 ml-2" />
                </>
              ) : (
                `Try ${scenarios.length - clickedScenarios.size} more ${
                  scenarios.length - clickedScenarios.size === 1 ? 'example' : 'examples'
                } to continue`
              )}
            </Button>
          </motion.div>
        )}

        {/* SMART TIPS SECTION */}
        {viewMode === 'tips' && (
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
                  <li>• <strong className="text-blue-300">GPT-3.5 Turbo</strong> (40 pages): Quick questions, short conversations</li>
                  <li>• <strong className="text-cyan-300">GPT-4o / GPT-5</strong> (320 pages): Essay drafts, homework help, long discussions</li>
                  <li>• <strong className="text-purple-300">Claude 3.5 Sonnet</strong> (500 pages): Research papers, long documents</li>
                  <li>• <strong className="text-pink-300">Gemini 1.5 Pro</strong> (5,000+ pages): Entire books, massive datasets</li>
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
